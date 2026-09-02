// India Master Catalogue — SaaS architecture (Master + Tenant)
export type MasterProduct = {
  id: string; // mp_xxx
  gtin?: string;
  ean?: string;
  barcode?: string; // GTIN-13 India
  skuReference: string;
  brandId: string;
  brandName: string;
  manufacturerId?: string;
  productName: string;
  shortName?: string;
  slug: string;
  genericName?: string;
  description: string;
  packSize: string; // 5kg, 500g, 1L
  packUnit: string;
  netQuantity?: string;
  unitOfMeasure?: string;
  countryOfOrigin: string;
  hsnCode?: string;
  gstCategory?: string; // 0,5,12,18
  foodCategory?: string;
  departmentId: string;
  categoryId: string;
  subcategoryId?: string;
  productType?: string;
  variableWeight?: boolean;
  vegetarianStatus?: 'veg' | 'non-veg' | 'egg';
  dietaryTags?: string[];
  allergenTags?: string[];
  ingredients?: string;
  nutrition?: Record<string,string>;
  storageInformation?: string;
  searchKeywords: string[];
  primaryImageId?: string;
  imageUrl: string; // primary, CDN
  status: 'active' | 'draft' | 'archived';
  source: string;
  sourceReference?: string;
  referenceMrp: number; // ₹
  mrpVerifiedAt?: string;
  mrpSource?: string;
  createdAt: string;
  updatedAt: string;
  qualityScore?: number; // 0-100
};

export type ProductMrpHistory = {
  productId: string;
  mrp: number;
  effectiveFrom: string;
  effectiveUntil?: string;
  source: string;
  sourceReference?: string;
  verifiedAt?: string;
  createdAt: string;
};

export type TenantProduct = {
  id: string;
  tenantId: string;
  masterProductId: string; // or 'custom_' for tenant custom
  enabled: boolean;
  customName?: string;
  customDescription?: string;
  customImage?: string;
  categoryOverride?: string;
  subcategoryOverride?: string;
  sellingPrice?: number; // overrides MRP
  compareAtPrice?: number;
  specialPrice?: number;
  specialStart?: string;
  specialEnd?: string;
  minimumQuantity?: number;
  maximumQuantity?: number;
  featured?: boolean;
  newProduct?: boolean;
  storeVisibility?: string[]; // storeIds
  isCustom?: boolean;
  customBarcode?: string;
  customPackSize?: string;
  createdAt: string;
  updatedAt: string;
};

export type TenantInventory = {
  tenantId: string;
  storeId: string;
  masterProductId: string;
  quantityAvailable: number;
  quantityReserved: number;
  lowStockThreshold: number;
  inStock: boolean;
  lastStocktake?: string;
  updatedAt: string;
};

export type ProductAlias = { term: string; aliases: string[]; lang?: string };

export type CatalogueSource = {
  id: string;
  name: string;
  type: 'Dukaan' | 'CSV' | 'Excel' | 'GS1' | 'Manufacturer' | 'Supplier' | 'Manual' | 'API';
  url?: string;
  lastImport?: string;
};

export type SourceProduct = {
  source: string;
  externalId: string;
  externalCategory: string;
  externalProductName: string;
  externalPrice?: number;
  externalMrp?: number;
  externalImageUrl?: string;
  externalDescription?: string;
  externalSku?: string;
  externalBarcode?: string;
  rawPayload?: any;
  importBatch: string;
  importedAt: string;
};

export type NormalizedSourceProduct = {
  externalId: string;
  name: string;
  brand?: string;
  barcode?: string;
  gtin?: string;
  sku?: string;
  description?: string;
  categoryPath: string[];
  packSize?: string;
  packUnit?: string;
  mrp?: number;
  sellingPrice?: number;
  imageUrl?: string;
  availability?: string;
  source: string;
  sourceUrl?: string;
  rawData?: any;
};

export type ProductImage = {
  productId: string;
  url: string;
  imageType: 'primary' | 'gallery';
  source: 'manufacturer' | 'GS1' | 'supplier' | 'tenant_upload' | 'AI_GENERIC' | 'internal';
  rightsStatus: 'authorized' | 'tenant' | 'placeholder' | 'pending';
  isPrimary: boolean;
  verified: boolean;
  createdAt: string;
};
