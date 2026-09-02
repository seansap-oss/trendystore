// FreshBasket Supermarket — Core Data Models
// Mirrors DB schema (Supabase PostgreSQL) — see /supabase/migrations

export type Department = {
  id: string;
  slug: string;
  name: string;
  icon?: string;
  image?: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
};

export type Category = {
  id: string;
  departmentId: string;
  slug: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
};

export type Subcategory = {
  id: string;
  categoryId: string;
  departmentId: string;
  slug: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
};

export type Brand = {
  id: string;
  slug: string;
  name: string;
  isPrivateLabel?: boolean;
};

export type DietaryTag =
  | 'Vegan' | 'Vegetarian' | 'Organic' | 'Gluten Free' | 'Dairy Free' | 'Lactose Free'
  | 'Nut Free' | 'Halal' | 'Kosher' | 'High Protein' | 'Low Sugar' | 'Low Fat'
  | 'Wholegrain' | 'High Fibre' | 'No Artificial Colours' | 'No Artificial Preservatives';

export type AllergenTag =
  | 'Milk' | 'Eggs' | 'Peanuts' | 'Tree Nuts' | 'Soy' | 'Wheat' | 'Fish' | 'Crustacean' | 'Sesame' | 'Gluten';

export type SupermarketProduct = {
  id: string;
  sku: string;
  barcode?: string;
  slug: string;
  name: string;
  shortName?: string;
  brandId: string;
  brandName: string;
  departmentId: string;
  categoryId: string;
  subcategoryId?: string;
  description: string;
  shortDescription?: string;
  ingredients?: string;
  allergenInformation?: string;
  nutritionInformation?: Record<string, string>;
  countryOfOrigin?: string;
  packageSize: string; // e.g. "500g", "2L", "12 pack"
  packageUnit: string;
  unitPrice: number; // cents or dollars — we use dollars float
  retailPrice: number;
  compareAtPrice?: number;
  costPrice?: number;
  taxRate: number; // 0.1 for 10%
  variableWeight: boolean;
  estimatedWeight?: number; // kg
  minWeight?: number;
  maxWeight?: number;
  pricePerKg?: number;
  inStock: boolean;
  lowStockThreshold?: number;
  isSpecial: boolean;
  specialPrice?: number;
  specialStart?: string;
  specialEnd?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  isMarketplace?: boolean;
  sellerId?: string;
  ageRestricted?: boolean;
  healthStarRating?: number; // 0.5-5
  averageRating?: number;
  reviewCount?: number;
  dietaryTags?: DietaryTag[];
  allergenTags?: AllergenTag[];
  images: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
};

export type Store = {
  id: string;
  code: string;
  name: string;
  address: string;
  suburb: string;
  postcode: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  phone: string;
  email?: string;
  timezone: string;
  openingHours: DayHours[];
  services: StoreService[];
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  rapidPickupEnabled: boolean;
  deliveryRadiusKm?: number;
  servicePostcodes?: string[];
  isActive: boolean;
};

export type DayHours = { day: string; open: string; close: string; closed?: boolean };
export type StoreService = 'Delivery' | 'Pickup' | 'DriveUp' | 'Rapid' | 'Locker' | 'InStore';

export type StoreInventory = {
  storeId: string;
  productId: string;
  quantityAvailable: number;
  quantityReserved: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Unavailable';
};

export type StorePrice = {
  storeId: string;
  productId: string;
  price: number;
  specialPrice?: number;
};

export type SupermarketCartItem = {
  product: SupermarketProduct;
  quantity: number;
  note?: string;
  substitutionPreference?: 'allow' | 'no_substitution';
  estimatedTotal?: number;
};

export type ShoppingList = {
  id: string;
  name: string;
  userId?: string;
  items: { productId: string; quantity: number }[];
  isShared?: boolean;
  shareToken?: string;
  createdAt: string;
  updatedAt: string;
};

export type Promotion = {
  id: string;
  code?: string;
  title: string;
  description?: string;
  type: 'percentage' | 'fixed' | 'special_price' | 'multibuy' | 'bundle' | 'free_delivery';
  value: number;
  minBasket?: number;
  maxDiscount?: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  usageLimit?: number;
  perUserLimit?: number;
  applicableProductIds?: string[];
  applicableCategoryIds?: string[];
  storeIds?: string[];
};

export type DeliverySlot = {
  id: string;
  storeId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;
  capacity: number;
  used: number;
  fee: number;
  minOrder: number;
  method: 'Standard' | 'SameDay' | 'Rapid';
  cutoffTime?: string;
};

export type PickupSlot = {
  id: string;
  storeId: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  used: number;
  type: 'Standard' | 'DriveUp' | 'Rapid' | 'Locker';
};

export type OrderStatus =
  | 'Draft' | 'PendingPayment' | 'PaymentAuthorised' | 'Confirmed' | 'Picking'
  | 'SubstitutionRequired' | 'Picked' | 'Packed' | 'ReadyForPickup' | 'CustomerOnTheWay'
  | 'CustomerArrived' | 'OutForDelivery' | 'Delivered' | 'Collected' | 'Cancelled'
  | 'RefundPending' | 'PartiallyRefunded' | 'Refunded' | 'Failed';

export type SupermarketOrderItem = {
  productId: string;
  sku: string;
  name: string;
  image: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  specialPrice?: number;
  estimatedWeight?: number;
  actualWeight?: number;
  estimatedTotal: number;
  finalTotal: number;
  tax: number;
  note?: string;
  substitutionPreference: 'allow' | 'no_substitution';
  substituteProductId?: string;
  fulfilmentResult?: 'fulfilled' | 'substituted' | 'unavailable';
};

export type SupermarketOrder = {
  id: string;
  orderNumber: string;
  userId?: string;
  items: SupermarketOrderItem[];
  status: OrderStatus;
  fulfilment: 'Delivery' | 'Pickup';
  storeId: string;
  deliveryAddress?: string;
  slot?: DeliverySlot | PickupSlot;
  subtotal: number;
  savings: number;
  deliveryFee: number;
  serviceFee: number;
  tax: number;
  total: number;
  paymentMethod: 'card' | 'paypal' | 'gift_card';
  paymentStatus: 'pending' | 'authorised' | 'captured' | 'failed' | 'refunded';
  promotionCode?: string;
  giftCardUsed?: number;
  createdAt: string;
  updatedAt: string;
};

export type HomepageModule = {
  id: string;
  type: 'hero_carousel' | 'specials_carousel' | 'department_grid' | 'promo_banner' | 'product_row' | 'meal_inspiration';
  title?: string;
  subtitle?: string;
  items?: string[]; // productIds or bannerIds
  bannerIds?: string[];
  sortOrder: number;
  isActive: boolean;
  ctaLabel?: string;
  ctaLink?: string;
};

export type Banner = {
  id: string;
  title: string;
  description?: string;
  image: string;
  ctaLabel: string;
  ctaLink: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  sortOrder: number;
};

export type SearchSynonym = { term: string; synonyms: string[] };
export type GiftCard = { id: string; code: string; pin?: string; balance: number; initialValue: number; status: 'active' | 'redeemed' | 'expired'; expiry?: string };
