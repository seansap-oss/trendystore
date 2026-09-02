'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SupermarketProduct } from './types';
import { PRODUCTS as SEED } from './products';

export type ProductStatus = 'Draft' | 'Pending Review' | 'Scheduled' | 'Published' | 'Out of Stock' | 'Discontinued' | 'Archived';

export type ProductWithStatus = SupermarketProduct & {
  status: ProductStatus;
  supplier?: string;
  supplierCode?: string;
  costPrice?: number;
  compareAtPrice?: number;
  lowStockThreshold?: number;
  seoTitle?: string;
  seoDescription?: string;
  updatedBy?: string;
};

export type InventoryTx = {
  id: string;
  productId: string;
  storeId: string;
  prev: number;
  adjustment: number;
  newQty: number;
  type: 'Supplier Delivery' | 'Customer Order' | 'Damage' | 'Manual Correction' | 'Cancellation' | 'Stocktake' | 'Return';
  reason: string;
  admin: string;
  timestamp: string;
  reference?: string;
};

export type ChangeHistory = {
  id: string;
  productId: string;
  field: string;
  oldValue: string;
  newValue: string;
  admin: string;
  timestamp: string;
  source: 'Manual Edit' | 'Bulk Edit' | 'CSV Import' | 'Supplier Import' | 'Promotion' | 'System';
};

export type ImportBatch = {
  id: string;
  filename: string;
  createdAt: string;
  rows: number;
  newProducts: number;
  priceChanges: number;
  stockChanges: number;
  errors: string[];
  status: 'Preview' | 'Approved' | 'Rolled Back';
  changes: any[];
};

interface AdminState {
  products: ProductWithStatus[];
  inventory: Record<string, Record<string, number>>; // productId -> storeId -> qty
  transactions: InventoryTx[];
  history: ChangeHistory[];
  batches: ImportBatch[];
  // actions
  updateProduct: (id: string, patch: Partial<ProductWithStatus>, admin?: string, source?: ChangeHistory['source']) => void;
  duplicateProduct: (id: string) => void;
  archiveProduct: (id: string) => void;
  publishProduct: (id: string) => void;
  unpublishProduct: (id: string) => void;
  createProduct: (p: ProductWithStatus) => void;
  deleteProduct: (id: string) => void;
  adjustInventory: (productId: string, storeId: string, delta: number, type: InventoryTx['type'], reason: string) => void;
  addBatch: (b: ImportBatch) => void;
  approveBatch: (id: string) => void;
  rollbackBatch: (id: string) => void;
}

function seedWithStatus(): ProductWithStatus[] {
  return SEED.map((p, idx) => ({
    ...p,
    status: (p.inStock ? 'Published' : 'Out of Stock') as ProductStatus,
    supplier: idx % 3 === 0 ? 'FreshCo Suppliers' : idx % 3 === 1 ? 'Harvest Distributors' : 'Aussie Foods',
    supplierCode: `SUP-${p.sku}`,
    costPrice: Number((p.retailPrice * 0.65).toFixed(2)),
    compareAtPrice: p.compareAtPrice || (p.isSpecial ? p.retailPrice : undefined),
    lowStockThreshold: 5,
    seoTitle: p.name,
    seoDescription: p.description.slice(0, 155),
  }));
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      products: seedWithStatus(),
      inventory: {},
      transactions: [],
      history: [],
      batches: [],

      updateProduct: (id, patch, admin = 'admin@example.test', source = 'Manual Edit') =>
        set((s) => {
          const old = s.products.find((p) => p.id === id);
          if (!old) return s;
          const historyEntries: ChangeHistory[] = Object.entries(patch).map(([k, v]) => ({
            id: `hist-${Date.now()}-${k}`,
            productId: id,
            field: k,
            oldValue: String((old as any)[k] ?? ''),
            newValue: String(v ?? ''),
            admin,
            timestamp: new Date().toISOString(),
            source,
          }));
          return {
            products: s.products.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString(), updatedBy: admin } : p)),
            history: [...historyEntries, ...s.history].slice(0, 500),
          };
        }),

      duplicateProduct: (id) =>
        set((s) => {
          const orig = s.products.find((p) => p.id === id);
          if (!orig) return s;
          const dup: ProductWithStatus = {
            ...orig,
            id: `${orig.id}-copy-${Date.now()}`,
            sku: `${orig.sku}-COPY`,
            slug: `${orig.slug}-copy`,
            name: `${orig.name} (Copy)`,
            status: 'Draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return { products: [dup, ...s.products] };
        }),

      archiveProduct: (id) => get().updateProduct(id, { status: 'Archived' }),
      publishProduct: (id) => get().updateProduct(id, { status: 'Published', inStock: true }),
      unpublishProduct: (id) => get().updateProduct(id, { status: 'Draft' }),
      createProduct: (p) => set((s) => ({ products: [p, ...s.products] })),
      deleteProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),

      adjustInventory: (productId, storeId, delta, type, reason) =>
        set((s) => {
          const prev = s.inventory[productId]?.[storeId] ?? 20;
          const newQty = Math.max(0, prev + delta);
          const tx: InventoryTx = {
            id: `tx-${Date.now()}`,
            productId,
            storeId,
            prev,
            adjustment: delta,
            newQty,
            type,
            reason,
            admin: 'admin@example.test',
            timestamp: new Date().toISOString(),
          };
          return {
            inventory: { ...s.inventory, [productId]: { ...(s.inventory[productId] || {}), [storeId]: newQty } },
            transactions: [tx, ...s.transactions].slice(0, 500),
          };
        }),

      addBatch: (b) => set((s) => ({ batches: [b, ...s.batches] })),
      approveBatch: (id) => set((s) => ({ batches: s.batches.map((b) => (b.id === id ? { ...b, status: 'Approved' as const } : b)) })),
      rollbackBatch: (id) => set((s) => ({ batches: s.batches.map((b) => (b.id === id ? { ...b, status: 'Rolled Back' as const } : b)) })),
    }),
    { name: 'freshbasket-admin', storage: createJSONStorage(() => typeof window !== 'undefined' ? localStorage : undefined as any), version: 2 }
  )
);


