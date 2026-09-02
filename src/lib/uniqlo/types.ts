export type UniqloCategory = {
  id: string;
  slug: string;
  name: string;
  parentId?: string | null;
  gender: 'WOMEN' | 'MEN' | 'KIDS' | 'BABY' | 'UNISEX';
  image?: string;
  mobileImage?: string;
  sortOrder: number;
  isActive: boolean;
  description?: string;
};

export type UniqloProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  features?: string[];
  composition?: string;
  careInstructions?: string;
  categoryId: string;
  subcategory?: string;
  gender: 'WOMEN' | 'MEN' | 'KIDS' | 'BABY' | 'UNISEX';
  brand?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  images: string[];
  colors: { name: string; hex: string; image?: string }[];
  sizes: string[];
  inStock: boolean;
  available: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  isSale?: boolean;
  badge?: string; // e.g. "25% OFF", "2 FOR ₹1999", "ONLINE ONLY"
  promoLabel?: string;
  rating?: number;
  reviewCount?: number;
  stockQty?: number;
  createdAt: number;
  updatedAt: number;
};

export type HeroSection = {
  id: string;
  type: 'image' | 'video';
  src: string;
  mobileSrc?: string;
  poster?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  finePrint?: string;
  ctaLabel?: string;
  ctaLink?: string;
  cta2Label?: string;
  cta2Link?: string;
  cta3Label?: string;
  cta3Link?: string;
  alignment?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'center' | 'bottom';
  overlayOpacity?: number;
  isActive: boolean;
  focalX?: number;
  focalY?: number;
  // Typography controls — editable via Admin
  titleColor?: string;
  titleFontFamily?: string;
  titleFontSize?: number; // px
  titleFontWeight?: number;
  titleItalic?: boolean;
  titleLetterSpacing?: number; // em
  titleAccentColor?: string; // first letter / accent color
  titleAccentEnabled?: boolean;
  subtitleColor?: string;
  subtitleFontFamily?: string;
  subtitleFontSize?: number;
  eyebrowColor?: string;
  eyebrowFontFamily?: string;
  // publish state
  draft?: boolean;
  publishedAt?: number;
};

export type TickerConfig = {
  enabled: boolean;
  text: string;
  speed: number;
  bgColor: string;
  textColor: string;
  link?: string;
};

export type Announcement = {
  id: string;
  text: string;
  mobileText?: string;
  link?: string;
  bgColor: string;
  textColor: string;
  enabled: boolean;
  priority: number;
  startDate?: string;
  endDate?: string;
};

export type Coupon = {
  id: string;
  code: string;
  type: 'percent' | 'fixed' | 'free_shipping' | 'bogo' | 'bundle';
  value: number;
  minBasket?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  applicableCategoryIds?: string[];
  description?: string;
  stackable?: boolean;
};

export type UniqloCartItem = {
  product: UniqloProduct;
  quantity: number;
  size?: string;
  color?: string;
};

export type UniqloOrder = {
  id: string;
  orderNumber: string;
  username?: string;
  items: UniqloCartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string;
  status: 'pending' | 'paid' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentMethod: 'card' | 'paypal' | 'cod' | 'upi';
  shippingAddress?: string;
  createdAt: number;
};

export type UniqloSectionImage = {
  id: string;
  title: string;
  image: string;
  mobileImage?: string;
  link: string;
  sortOrder: number;
  isActive: boolean;
};

// Homepage Builder - Cotton On style modular sections
export type HomepageSectionType =
  | 'hero'
  | 'hero_video'
  | 'split_hero'
  | 'promo_banner'
  | 'text_banner'
  | 'category_tiles'
  | 'product_carousel'
  | 'collection_carousel'
  | 'trending_categories'
  | 'image_grid'
  | 'image_with_text'
  | 'full_width_campaign'
  | 'countdown_promo'
  | 'featured_products'
  | 'new_arrivals'
  | 'sale_collection'
  | 'loyalty_promo'
  | 'newsletter'
  | 'rich_text'
  | 'spacer'
  | 'instagram'
  | 'recently_viewed'
  | 'recommendations';

export type HomepageSection = {
  id: string;
  type: HomepageSectionType;
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  image?: string;
  mobileImage?: string;
  video?: string;
  ctaLabel?: string;
  ctaLink?: string;
  cta2Label?: string;
  cta2Link?: string;
  cta3Label?: string;
  cta3Link?: string;
  // styling
  bgColor?: string;
  textColor?: string;
  buttonStyle?: 'primary' | 'secondary' | 'outline' | 'light';
  textAlign?: 'left' | 'center' | 'right';
  overlayOpacity?: number;
  desktopHeight?: string;
  mobileHeight?: string;
  padding?: string;
  // content refs
  categoryIds?: string[];
  productIds?: string[];
  collectionSlug?: string;
  // meta
  sortOrder: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
};

export type NavigationItem = {
  id: string;
  label: string;
  href: string;
  badge?: string;
  badgeColor?: string;
  image?: string;
  children?: NavigationItem[];
  isActive: boolean;
  sortOrder: number;
};

export type SiteSettings = {
  brandName: string;
  logo?: string;
  favicon?: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  currency: string;
  currencySymbol: string;
  announcementEnabled: boolean;
  freeShippingThreshold: number;
  shippingStandard: number;
  shippingExpress: number;
  headerStyle: 'static' | 'sticky' | 'transparent';
  footerLinks?: { title: string; links: { label: string; href: string }[] }[];
  socialLinks?: { platform: string; url: string }[];
  newsletterEnabled?: boolean;
  newsletterTitle?: string;
  newsletterSubtitle?: string;
  newsletterButtonLabel?: string;
  headerPromoText?: string; // editable top ticker press text
};
