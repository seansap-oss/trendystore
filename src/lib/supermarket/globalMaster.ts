import type { MasterProduct } from './india/masterTypes';
import { MASTER_CATALOGUE as INDIA_MASTER } from './india/masterCatalogue';
import { PRODUCTS as AU_PRODUCTS } from './products';

// Global Master = canonical physical SKU (barcode is strongest identity)
export type GlobalMasterProduct = {
  id: string; // gmp_*
  gtin?: string;
  barcode?: string;
  brand: string;
  manufacturer?: string;
  canonicalName: string;
  packSize: string;
  packUnit: string;
  variant?: string;
  countryOfOrigin?: string;
  primaryImage?: string;
  productStatus: 'active'|'draft'|'archived';
  createdAt: string;
  updatedAt: string;
};

// Build global from both markets, dedupe by GTIN/barcode
const globalMap = new Map<string, GlobalMasterProduct>();

function addToGlobal(p: { gtin?:string; barcode?:string; brandName?:string; brand?:string; productName?:string; canonicalName?:string; packSize:string; imageUrl?:string; primaryImage?:string }) {
  const key = (p.gtin || p.barcode || `${p.brandName||p.brand}-${p.productName||p.canonicalName}-${p.packSize}`.toLowerCase()).toLowerCase();
  if (globalMap.has(key)) return globalMap.get(key)!;
  const g: GlobalMasterProduct = {
    id: `gmp_${String(globalMap.size+1).padStart(5,'0')}`,
    gtin: p.gtin,
    barcode: p.barcode,
    brand: p.brandName || p.brand || '',
    canonicalName: p.productName || p.canonicalName || '',
    packSize: p.packSize,
    packUnit: p.packSize.replace(/[0-9.\s]/g,'') || 'g',
    primaryImage: p.imageUrl || p.primaryImage,
    productStatus:'active',
    createdAt:new Date().toISOString(),
    updatedAt:new Date().toISOString(),
  };
  globalMap.set(key, g);
  return g;
}

INDIA_MASTER.forEach(m=> addToGlobal({ gtin:m.gtin, barcode:m.barcode, brandName:m.brandName, productName:m.productName, packSize:m.packSize, imageUrl:m.imageUrl }));
AU_PRODUCTS.forEach(p=> addToGlobal({ barcode:(p as any).barcode || p.sku, brand: (p as any).brandName, canonicalName:p.name, packSize:p.packageSize, primaryImage:(p as any).images?.[0] }));

export const GLOBAL_MASTER_PRODUCTS = Array.from(globalMap.values());

// Market products layer — links global to market-specific category/mrp
export type MarketProduct = {
  id: string;
  marketCatalogueId: string; // market_au or market_in
  masterProductId: string; // global id
  marketName: string;
  localAliases?: string[];
  mrp?: number;
  mrpVerifiedAt?: string;
  marketCategoryId?: string;
  marketSubcategoryId?: string;
  dietaryTags?: string[];
  regionalTags?: string[];
  status: 'active'|'draft';
  source?: string;
};

const marketProducts: MarketProduct[] = [];

// India market products
INDIA_MASTER.forEach(m=>{
  const g = addToGlobal({ gtin:m.gtin, barcode:m.barcode, brandName:m.brandName, productName:m.productName, packSize:m.packSize, imageUrl:m.imageUrl });
  marketProducts.push({
    id:`mpkt_in_${m.id}`,
    marketCatalogueId:'market_in',
    masterProductId:g.id,
    marketName:m.productName,
    localAliases:m.searchKeywords,
    mrp:m.referenceMrp,
    mrpVerifiedAt:m.mrpVerifiedAt,
    marketCategoryId:m.categoryId,
    marketSubcategoryId:(m as any).subcategoryId,
    dietaryTags:m.dietaryTags,
    status:'active',
    source:m.source,
  });
});
// Australia market products
AU_PRODUCTS.forEach(p=>{
  const g = addToGlobal({ barcode:(p as any).barcode||p.sku, brand:(p as any).brandName, canonicalName:p.name, packSize:p.packageSize, primaryImage:(p as any).images?.[0] });
  marketProducts.push({
    id:`mpkt_au_${p.id}`,
    marketCatalogueId:'market_au',
    masterProductId:g.id,
    marketName:p.name,
    mrp:(p as any).retailPrice,
    marketCategoryId:(p as any).categoryId,
    status:'active',
    source:'Australia Seed',
  });
});

export const MARKET_PRODUCTS = marketProducts;
export const getMarketProducts = (code:'AU'|'IN') => marketProducts.filter(m=> m.marketCatalogueId===`market_${code.toLowerCase()}`);
