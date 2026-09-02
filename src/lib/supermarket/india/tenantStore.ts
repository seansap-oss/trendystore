'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { TenantProduct, TenantInventory } from './masterTypes';
import { MASTER_CATALOGUE } from './masterCatalogue';

export type TenantId = string;

interface TenantState {
  tenantId: string;
  tenantName: string;
  marketCode: 'AU' | 'IN';
  overrides: TenantProduct[]; // per master product
  inventory: TenantInventory[];
  // onboarding
  onboardingComplete: boolean;
  enabledDepartments: string[];
  // actions
  setTenant: (id:string, name:string)=>void;
  setMarket: (code:'AU'|'IN')=>void;
  setOverride: (masterId:string, patch: Partial<TenantProduct>)=>void;
  enableProduct: (masterId:string, enabled:boolean)=>void;
  setSellingPrice: (masterId:string, price:number)=>void;
  setStock: (masterId:string, storeId:string, qty:number)=>void;
  bulkEnable: (masterIds:string[], enabled:boolean)=>void;
  replaceWithMarket: (code:'AU'|'IN')=>void;
  mergeMarket: (code:'AU'|'IN')=>void;
  enableCategory: (deptId:string, enabled:boolean)=>void;
  getDisplayProducts: ()=> any[]; // resolved
  isEnabled: (masterId:string)=>boolean;
  getSellingPrice: (masterId:string)=>number;
}

const DEFAULT_TENANT = 'tenant_demo';
const DEFAULT_STORE = 'store_syd_cbd';

function ensureOverride(masterId:string, tenantId:string): TenantProduct {
  return {
    id:`tp_${tenantId}_${masterId}`,
    tenantId,
    masterProductId: masterId,
    enabled: true,
    sellingPrice: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set, get)=> ({
      tenantId: DEFAULT_TENANT,
      tenantName: 'FreshBasket Demo (India SaaS)',
      marketCode: 'IN' as const,
      overrides: [],
      inventory: [],
      onboardingComplete: false,
      enabledDepartments: [],

      setTenant: (id,name)=> set({ tenantId:id, tenantName:name }),
      setMarket: (code)=> set({ marketCode:code }),
      setOverride: (masterId,patch)=> set(s=>{
        const idx=s.overrides.findIndex(o=>o.masterProductId===masterId && o.tenantId===s.tenantId);
        let next=[...s.overrides];
        if(idx>=0) next[idx]={...next[idx], ...patch, updatedAt:new Date().toISOString()};
        else next.push({ ...ensureOverride(masterId, s.tenantId), ...patch });
        return { overrides: next };
      }),
      enableProduct: (masterId,enabled)=> get().setOverride(masterId,{enabled}),
      setSellingPrice: (masterId,price)=> {
        const mp=MASTER_CATALOGUE.find(m=>m.id===masterId);
        if(mp && price>mp.referenceMrp) console.warn(`Selling price ₹${price} exceeds MRP ₹${mp.referenceMrp} — requires correction`);
        get().setOverride(masterId,{sellingPrice:price});
      },
      setStock: (masterId,storeId,qty)=> set(s=>{
        const idx=s.inventory.findIndex(i=>i.masterProductId===masterId && i.storeId===storeId && i.tenantId===s.tenantId);
        let next=[...s.inventory];
        const rec: TenantInventory = { tenantId:s.tenantId, storeId, masterProductId:masterId, quantityAvailable:qty, quantityReserved:0, lowStockThreshold:5, inStock:qty>0, updatedAt:new Date().toISOString() };
        if(idx>=0) next[idx]=rec; else next.push(rec);
        return { inventory: next };
      }),
      bulkEnable: (masterIds,enabled)=> set(s=>{
        let next=[...s.overrides];
        masterIds.forEach(mid=>{
          const idx=next.findIndex(o=>o.masterProductId===mid && o.tenantId===s.tenantId);
          if(idx>=0) next[idx]={...next[idx], enabled, updatedAt:new Date().toISOString()};
          else next.push({...ensureOverride(mid,s.tenantId), enabled});
        });
        return { overrides: next };
      }),
      replaceWithMarket: (code)=> {
        const s=get();
        // Option A: preserve custom but replace demo enable state
        const isIN = code==='IN';
        const ids = MASTER_CATALOGUE.filter(m=> isIN ? m.departmentId.startsWith('in_') : !m.departmentId.startsWith('in_')).map(m=>m.id);
        // disable opposite market, enable target scope (first 4k for Standard)
        const otherIds = MASTER_CATALOGUE.filter(m=> !ids.includes(m.id)).map(m=>m.id);
        s.bulkEnable(ids.slice(0,4000), true);
        s.bulkEnable(otherIds, false);
        set({ marketCode:code });
      },
      mergeMarket: (code)=> {
        const s=get();
        const isIN = code==='IN';
        const ids = MASTER_CATALOGUE.filter(m=> isIN ? m.departmentId.startsWith('in_') : !m.departmentId.startsWith('in_')).map(m=>m.id).slice(0,4000);
        s.bulkEnable(ids, true);
        set({ marketCode:code });
      },
      enableCategory: (deptId,enabled)=> {
        const ids = MASTER_CATALOGUE.filter(m=>m.departmentId===deptId).map(m=>m.id);
        get().bulkEnable(ids, enabled);
      },
      getDisplayProducts: ()=>{
        const { tenantId, overrides, inventory, marketCode } = get() as any;
        if (marketCode === 'AU') {
          // Australia market — use AU_PRODUCTS (imported lazily)
          // preserve approved AU catalogue separately
          try {
            // dynamic require to avoid circular
            const { PRODUCTS } = require('@/lib/supermarket/products');
            return (PRODUCTS as any[]).map((p:any)=>{
              const ov = overrides.find((o:any)=> o.masterProductId===p.id && o.tenantId===tenantId);
              const enabled = ov ? ov.enabled : true;
              if(!enabled) return null;
              const inv = inventory.find((i:any)=> i.masterProductId===p.id && i.tenantId===tenantId && i.storeId===DEFAULT_STORE);
              const sellingPrice = ov?.sellingPrice ?? p.retailPrice;
              const effective = ov?.specialPrice ?? sellingPrice;
              return {
                ...p,
                name: ov?.customName || p.name,
                description: ov?.customDescription || p.description,
                images: ov?.customImage ? [ov.customImage] : p.images,
                retailPrice: p.retailPrice,
                sellingPrice, effectivePrice: effective,
                mrp: p.retailPrice,
                inStock: inv ? inv.inStock : p.inStock,
                warning: effective > p.retailPrice ? 'SELLING PRICE EXCEEDS MRP' : undefined,
                enabled,
                _override: ov,
              };
            }).filter(Boolean) as any[];
          } catch { return []; }
        }
        // India market (default)
        return MASTER_CATALOGUE.map(mp=>{
          const ov=overrides.find((o:any)=>o.masterProductId===mp.id && o.tenantId===tenantId);
          const enabled = ov ? ov.enabled : true; // default enabled for demo starter packs; in prod use onboarding
          if(!enabled) return null;
          const inv=inventory.find((i:any)=>i.masterProductId===mp.id && i.tenantId===tenantId && i.storeId===DEFAULT_STORE);
          const sellingPrice = ov?.sellingPrice ?? mp.referenceMrp;
          const effective = ov?.specialPrice && ov.specialStart && new Date(ov.specialStart) <= new Date() && (!ov.specialEnd || new Date(ov.specialEnd) >= new Date()) ? ov.specialPrice : sellingPrice;
          // MRP warning
          const warning = effective > mp.referenceMrp ? 'SELLING PRICE EXCEEDS MRP' : undefined;
          return {
            ...mp,
            // map to existing SupermarketProduct shape for UI compat
            id: mp.id,
            sku: mp.skuReference,
            barcode: mp.barcode,
            slug: mp.slug,
            name: ov?.customName || mp.productName,
            brandName: mp.brandName,
            departmentId: ov?.categoryOverride || mp.departmentId,
            categoryId: mp.categoryId,
            description: ov?.customDescription || mp.description,
            packageSize: mp.packSize,
            retailPrice: mp.referenceMrp,
            // tenant effective
            sellingPrice,
            effectivePrice: effective,
            mrp: mp.referenceMrp,
            inStock: inv ? inv.inStock : true,
            stockQty: inv ? inv.quantityAvailable : 20,
            image: ov?.customImage || mp.imageUrl,
            images: [ov?.customImage || mp.imageUrl],
            warning,
            enabled,
            isCustom: !!ov?.isCustom,
            // keep original
            _master: mp,
            _override: ov,
          };
        }).filter(Boolean) as any[];
      },
      isEnabled: (masterId)=> {
        const ov=get().overrides.find(o=>o.masterProductId===masterId && o.tenantId===get().tenantId);
        return ov ? ov.enabled : true;
      },
      getSellingPrice: (masterId)=>{
        const ov=get().overrides.find(o=>o.masterProductId===masterId && o.tenantId===get().tenantId);
        const mp=MASTER_CATALOGUE.find(m=>m.id===masterId);
        return ov?.sellingPrice ?? mp?.referenceMrp ?? 0;
      },
    }),
    { name:'freshbasket-tenant-india', storage: createJSONStorage(() => typeof window !== 'undefined' ? localStorage : undefined as any), version:1 }
  )
);


