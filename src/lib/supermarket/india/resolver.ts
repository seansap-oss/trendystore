import { MASTER_CATALOGUE } from './masterCatalogue';
import { useTenantStore } from './tenantStore';

// Server-safe resolver (no hooks)
export function resolveDisplayProducts(tenantId: string, overrides: any[], inventory: any[]) {
  return MASTER_CATALOGUE.map(mp=>{
    const ov = overrides.find((o:any)=> o.masterProductId===mp.id && o.tenantId===tenantId);
    const enabled = ov ? ov.enabled : true;
    if(!enabled) return null;
    const inv = inventory.find((i:any)=> i.masterProductId===mp.id && i.tenantId===tenantId);
    const sellingPrice = ov?.sellingPrice ?? mp.referenceMrp;
    const effective = ov?.specialPrice ? ov.specialPrice : sellingPrice;
    return {
      id: mp.id,
      sku: mp.skuReference,
      slug: mp.slug,
      name: ov?.customName || mp.productName,
      brandName: mp.brandName,
      brandId: mp.brandId,
      departmentId: mp.departmentId,
      categoryId: mp.categoryId,
      subcategoryId: (mp as any).subcategoryId,
      description: ov?.customDescription || mp.description,
      shortDescription: mp.productName,
      packageSize: mp.packSize,
      packageUnit: mp.packUnit,
      unitPrice: mp.referenceMrp,
      retailPrice: mp.referenceMrp,
      sellingPrice,
      effectivePrice: effective,
      compareAtPrice: mp.referenceMrp,
      taxRate: 0.05,
      variableWeight: !!mp.variableWeight,
      inStock: inv ? inv.inStock : true,
      isSpecial: !!ov?.specialPrice,
      specialPrice: ov?.specialPrice,
      healthStarRating: 4,
      images: [ov?.customImage || mp.imageUrl],
      barcode: mp.barcode,
      gtin: mp.gtin,
      mrp: mp.referenceMrp,
      warning: effective > mp.referenceMrp ? 'SELLING PRICE EXCEEDS MRP' : undefined,
      _master: mp,
      _override: ov,
    };
  }).filter(Boolean) as any[];
}

export function getDisplayForCurrentTenant() {
  if (typeof window==='undefined') return resolveDisplayProducts('tenant_demo', [], []);
  const s = useTenantStore.getState();
  return resolveDisplayProducts(s.tenantId, s.overrides, s.inventory);
}
