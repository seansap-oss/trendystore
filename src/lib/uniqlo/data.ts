import type { UniqloCategory, UniqloProduct, HeroSection, TickerConfig, Coupon, UniqloSectionImage, Announcement, HomepageSection, NavigationItem, SiteSettings } from './types';

export const DEFAULT_CATEGORIES: UniqloCategory[] = [
  // WOMEN - Cotton On style hierarchy
  { id:'cat_women', slug:'women', name:'WOMEN', gender:'WOMEN', image:'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600', sortOrder:1, isActive:true, description:'Shop Women at ManiKunj' },
  { id:'cat_w_tops', slug:'women-tops', name:'Tops', parentId:'cat_women', gender:'WOMEN', image:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', sortOrder:2, isActive:true },
  { id:'cat_w_jeans', slug:'women-jeans', name:'Jeans', parentId:'cat_women', gender:'WOMEN', image:'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600', sortOrder:3, isActive:true },
  { id:'cat_w_pants', slug:'women-pants', name:'Pants', parentId:'cat_women', gender:'WOMEN', image:'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600', sortOrder:4, isActive:true },
  { id:'cat_w_dresses', slug:'dresses', name:'Dresses', parentId:'cat_women', gender:'WOMEN', image:'https://images.unsplash.com/photo-1515372039744-f1fd71d4f6d1?w=600', sortOrder:5, isActive:true },
  { id:'cat_w_active', slug:'women-activewear', name:'Activewear', parentId:'cat_women', gender:'WOMEN', image:'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?w=600', sortOrder:6, isActive:true },
  { id:'cat_w_sweats', slug:'women-sweats', name:'Sweats', parentId:'cat_women', gender:'WOMEN', image:'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600', sortOrder:7, isActive:true },
  { id:'cat_w_shorts', slug:'women-shorts', name:'Shorts & Skirts', parentId:'cat_women', gender:'WOMEN', image:'https://images.unsplash.com/photo-1581044777556-4cfa60707c03?w=600', sortOrder:8, isActive:true },
  // MEN
  { id:'cat_men', slug:'men', name:'MEN', gender:'MEN', image:'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600', sortOrder:10, isActive:true, description:'Shop Men at ManiKunj' },
  { id:'cat_m_tops', slug:'men-tops', name:'Tops & Tees', parentId:'cat_men', gender:'MEN', image:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', sortOrder:11, isActive:true },
  { id:'cat_m_jeans', slug:'men-jeans', name:'Jeans', parentId:'cat_men', gender:'MEN', image:'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600', sortOrder:12, isActive:true },
  { id:'cat_m_shirts', slug:'men-shirts', name:'Shirts', parentId:'cat_men', gender:'MEN', image:'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600', sortOrder:13, isActive:true },
  { id:'cat_m_shorts', slug:'men-shorts', name:'Shorts', parentId:'cat_men', gender:'MEN', image:'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600', sortOrder:14, isActive:true },
  { id:'cat_m_active', slug:'men-activewear', name:'Activewear', parentId:'cat_men', gender:'MEN', image:'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?w=600', sortOrder:15, isActive:true },
  // KIDS
  { id:'cat_kids', slug:'kids', name:'KIDS', gender:'KIDS', image:'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800', sortOrder:20, isActive:true, description:'Shop Kids at ManiKunj' },
  { id:'cat_k_girls', slug:'girls-2-14', name:'Girls 2-14', parentId:'cat_kids', gender:'KIDS', image:'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600', sortOrder:21, isActive:true },
  { id:'cat_k_boys', slug:'boys-2-14', name:'Boys 2-14', parentId:'cat_kids', gender:'KIDS', image:'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600', sortOrder:22, isActive:true },
  { id:'cat_k_baby', slug:'baby-0-2', name:'Baby 0-2', parentId:'cat_kids', gender:'BABY', image:'https://images.unsplash.com/photo-1522771930-78848d9293e?w=600', sortOrder:23, isActive:true },
  // ACCESSORIES / universal
  { id:'cat_accessories', slug:'accessories', name:'Accessories', gender:'UNISEX', image:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', sortOrder:30, isActive:true },
  { id:'cat_outer', slug:'outerwear', name:'Jackets', gender:'UNISEX', image:'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600', sortOrder:31, isActive:true },
];

export const GENDER_TABS = ['WOMEN','MEN','KIDS','BABY'] as const;

function slugify(s:string){return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');}
const FIXED_TS = 1700000000000;
function mk(p: Omit<UniqloProduct,'slug'|'createdAt'|'updatedAt'>): UniqloProduct {
  return { ...p, slug: slugify(p.name)+'-'+p.id, createdAt: FIXED_TS, updatedAt: FIXED_TS };
}

export const DEFAULT_PRODUCTS: UniqloProduct[] = [
  // WOMEN - Tops
  mk({ id:'mk001', name:'Relaxed Graphic T-Shirt', description:'Soft cotton jersey with vintage graphic. Relaxed fit for everyday ease.', categoryId:'cat_w_tops', gender:'WOMEN', price:799, compareAtPrice:1099, images:['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800','https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'], colors:[{name:'White',hex:'#ffffff'},{name:'Black',hex:'#111111'},{name:'Washed Pink',hex:'#f4c2c2'}], sizes:['XS','S','M','L','XL'], inStock:true, available:true, isFeatured:true, rating:4.6, reviewCount:412, badge:'25% OFF', stockQty:120 }),
  mk({ id:'mk002', name:'Rib Baby Tee', description:'Stretch rib knit, cropped length. Perfect with high-waisted jeans.', categoryId:'cat_w_tops', gender:'WOMEN', price:599, images:['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'], colors:[{name:'White',hex:'#fff'},{name:'Black',hex:'#111'},{name:'Sage',hex:'#8fa98f'}], sizes:['XS','S','M','L'], inStock:true, available:true, isNew:true, rating:4.5, reviewCount:203, stockQty:89 }),
  mk({ id:'mk003', name:'Oversized Linen Shirt', description:'Breathable linen blend, dropped shoulder. Weekend uniform.', categoryId:'cat_w_tops', gender:'WOMEN', price:1499, compareAtPrice:1999, images:['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800'], colors:[{name:'Ecru',hex:'#f5efe6'},{name:'Blue Stripe',hex:'#7aa9d6'}], sizes:['S','M','L','XL'], inStock:true, available:true, badge:'25% OFF', rating:4.7, reviewCount:178, stockQty:54 }),
  mk({ id:'mk004', name:'Long Sleeve Boxy Tee', description:'Heavyweight cotton, boxy cut. Layer or wear solo.', categoryId:'cat_w_tops', gender:'WOMEN', price:899, images:['https://images.unsplash.com/photo-1618354691321-e851c56960d1?w=800'], colors:[{name:'Grey Marle',hex:'#9aa0a6'},{name:'Black',hex:'#111'}], sizes:['XS','S','M','L','XL'], inStock:true, available:true, rating:4.4, reviewCount:98, stockQty:67 }),
  // WOMEN - Jeans / Pants
  mk({ id:'mk005', name:'Baggy Low Rise Jeans', description:'90s inspired baggy jean with low rise and relaxed leg.', categoryId:'cat_w_jeans', gender:'WOMEN', price:2499, compareAtPrice:3299, images:['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800','https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800'], colors:[{name:'Vintage Blue',hex:'#5b7ca6'},{name:'Black',hex:'#222'},{name:'Stone',hex:'#c2b280'}], sizes:['24','26','28','30','32'], inStock:true, available:true, isFeatured:true, rating:4.8, reviewCount:892, badge:'25% OFF', stockQty:140 }),
  mk({ id:'mk006', name:'Straight Leg Jeans', description:'Classic straight leg, mid-rise. Your everyday denim.', categoryId:'cat_w_jeans', gender:'WOMEN', price:2299, images:['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800'], colors:[{name:'Mid Blue',hex:'#6b8cae'},{name:'White',hex:'#fff'}], sizes:['24','26','28','30','32'], inStock:true, available:true, rating:4.6, reviewCount:521, stockQty:72 }),
  mk({ id:'mk007', name:'Cargo Relaxed Pants', description:'Cotton twill cargo with side pockets. Utility meets comfort.', categoryId:'cat_w_pants', gender:'WOMEN', price:1999, images:['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800'], colors:[{name:'Khaki',hex:'#8a7a5a'},{name:'Black',hex:'#111'},{name:'Olive',hex:'#6b7c3a'}], sizes:['XS','S','M','L','XL'], inStock:true, available:true, isNew:true, rating:4.5, reviewCount:210, stockQty:44 }),
  mk({ id:'mk008', name:'Wide Leg Linen Pants', description:'Flowy wide leg in breathable linen. Resort-ready.', categoryId:'cat_w_pants', gender:'WOMEN', price:1799, images:['https://images.unsplash.com/photo-1506629903106-e46132dba7a5?w=800'], colors:[{name:'Natural',hex:'#d6c7b8'},{name:'Black',hex:'#111'}], sizes:['S','M','L','XL'], inStock:true, available:true, rating:4.7, reviewCount:134, stockQty:38 }),
  // WOMEN - Dresses
  mk({ id:'mk009', name:'Tiered Midi Dress', description:'Soft woven midi with tiered skirt and puff sleeves.', categoryId:'cat_w_dresses', gender:'WOMEN', price:2199, images:['https://images.unsplash.com/photo-1515372039744-f1fd71d4f6d1?w=800'], colors:[{name:'Floral',hex:'#e8a0a8'},{name:'Black',hex:'#111'}], sizes:['XS','S','M','L'], inStock:true, available:true, isFeatured:true, rating:4.9, reviewCount:167, stockQty:31 }),
  mk({ id:'mk010', name:'Slip Dress', description:'Satin slip with cowl neck. Dress up or down.', categoryId:'cat_w_dresses', gender:'WOMEN', price:1899, compareAtPrice:2499, images:['https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800'], colors:[{name:'Champagne',hex:'#f7e7ce'},{name:'Black',hex:'#111'}], sizes:['S','M','L'], inStock:true, available:true, badge:'25% OFF', rating:4.6, reviewCount:243, stockQty:56 }),
  // WOMEN - Active / Sweats
  mk({ id:'mk011', name:'509 Active Leggings', description:'High-waist, squat-proof. For studio or street.', categoryId:'cat_w_active', gender:'WOMEN', price:1499, images:['https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?w=800'], colors:[{name:'Black',hex:'#111'},{name:'Graphite',hex:'#444'}], sizes:['XS','S','M','L','XL'], inStock:true, available:true, rating:4.7, reviewCount:512, stockQty:95 }),
  mk({ id:'mk012', name:'Oversized Crew Sweat', description:'Fleece crew with dropped shoulders. Cosy staple.', categoryId:'cat_w_sweats', gender:'WOMEN', price:1699, compareAtPrice:2199, images:['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'], colors:[{name:'Grey Marle',hex:'#9aa0a6'},{name:'Oat',hex:'#c9b8a3'}], sizes:['S','M','L','XL'], inStock:true, available:true, badge:'2 FOR ₹2999', rating:4.5, reviewCount:298, stockQty:82 }),
  mk({ id:'mk013', name:'Plush Hoodie', description:'Super soft plush fleece hoodie with kangaroo pocket.', categoryId:'cat_w_sweats', gender:'WOMEN', price:1999, images:['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'], colors:[{name:'Pink',hex:'#e8a0a8'},{name:'Black',hex:'#111'}], sizes:['S','M','L','XL'], inStock:false, available:false, rating:4.3, reviewCount:76, stockQty:0 }),
  // WOMEN - Sale / New
  mk({ id:'mk014', name:'Denim Shorts', description:'High-waisted cutoff shorts. Vintage finish.', categoryId:'cat_w_shorts', gender:'WOMEN', price:1299, images:['https://images.unsplash.com/photo-1581044777556-4cfa60707c03?w=800'], colors:[{name:'Blue',hex:'#5b7ca6'},{name:'Black',hex:'#222'}], sizes:['24','26','28','30'], inStock:true, available:true, isNew:true, rating:4.4, reviewCount:112, stockQty:64 }),
  mk({ id:'mk015', name:'Mini Skirt', description:'A-line corduroy mini. Pair with chunky boots.', categoryId:'cat_w_shorts', gender:'WOMEN', price:1399, images:['https://images.unsplash.com/photo-1581044777556-4cfa60707c03?w=800'], colors:[{name:'Tan',hex:'#b68a5a'},{name:'Black',hex:'#111'}], sizes:['XS','S','M','L'], inStock:true, available:true, rating:4.5, reviewCount:89, stockQty:41 }),
  // MEN
  mk({ id:'mk016', name:'Heavyweight Box Tee', description:'280gsm cotton, boxy fit. The perfect tee.', categoryId:'cat_m_tops', gender:'MEN', price:799, images:['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'], colors:[{name:'White',hex:'#fff'},{name:'Black',hex:'#111'},{name:'Grey',hex:'#888'}], sizes:['S','M','L','XL','XXL'], inStock:true, available:true, isFeatured:true, rating:4.7, reviewCount:723, stockQty:110 }),
  mk({ id:'mk017', name:'Graphic Street Tee', description:'Oversized street graphic on heavyweight cotton.', categoryId:'cat_m_tops', gender:'MEN', price:899, compareAtPrice:1199, images:['https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800'], colors:[{name:'White',hex:'#fff'},{name:'Natural',hex:'#d6c7b8'}], sizes:['S','M','L','XL'], inStock:true, available:true, badge:'25% OFF', rating:4.6, reviewCount:334, stockQty:76 }),
  mk({ id:'mk018', name:'Oxford Shirt', description:'Classic oxford, relaxed fit. Dress up denim.', categoryId:'cat_m_shirts', gender:'MEN', price:1899, images:['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800'], colors:[{name:'White',hex:'#fff'},{name:'Blue',hex:'#5b7ca6'}], sizes:['S','M','L','XL','XXL'], inStock:true, available:true, rating:4.8, reviewCount:201, stockQty:48 }),
  mk({ id:'mk019', name:'Relaxed Jeans - Mens', description:'Loose relaxed jean with tapered leg.', categoryId:'cat_m_jeans', gender:'MEN', price:2699, images:['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800'], colors:[{name:'Vintage',hex:'#6b8cae'},{name:'Black',hex:'#111'}], sizes:['30','32','34','36','38'], inStock:true, available:true, rating:4.5, reviewCount:410, stockQty:66 }),
  mk({ id:'mk020', name:'Straight Chino', description:'Garment-dyed chino, straight leg. Everyday chinos.', categoryId:'cat_m_jeans', gender:'MEN', price:2199, images:['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800'], colors:[{name:'Khaki',hex:'#c2b280'},{name:'Navy',hex:'#1e2a4a'},{name:'Olive',hex:'#6b7c3a'}], sizes:['30','32','34','36'], inStock:true, available:true, isNew:true, rating:4.4, reviewCount:156, stockQty:52 }),
  mk({ id:'mk021', name:'Cotton Cargo Shorts', description:'Cotton cargo shorts with side pockets.', categoryId:'cat_m_shorts', gender:'MEN', price:1499, images:['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800'], colors:[{name:'Stone',hex:'#c2b280'},{name:'Black',hex:'#111'}], sizes:['S','M','L','XL'], inStock:true, available:true, rating:4.5, reviewCount:98, stockQty:39 }),
  mk({ id:'mk022', name:'Fleece Pullover', description:'Half-zip fleece with high neck.', categoryId:'cat_m_active', gender:'MEN', price:2199, compareAtPrice:2799, images:['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'], colors:[{name:'Navy',hex:'#1e2a4a'},{name:'Grey',hex:'#888'}], sizes:['S','M','L','XL'], inStock:true, available:true, badge:'25% OFF', rating:4.6, reviewCount:187, stockQty:45 }),
  mk({ id:'mk023', name:'Active Shorts', description:'Quick-dry training shorts.', categoryId:'cat_m_active', gender:'MEN', price:999, images:['https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?w=800'], colors:[{name:'Black',hex:'#111'},{name:'Blue',hex:'#5b7ca6'}], sizes:['S','M','L','XL'], inStock:true, available:true, rating:4.4, reviewCount:76, stockQty:58 }),
  // KIDS
  mk({ id:'mk024', name:'Kids Graphic Tee', description:'Fun cotton tee with playful graphic.', categoryId:'cat_k_girls', gender:'KIDS', price:499, images:['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800'], colors:[{name:'Pink',hex:'#e8a0a8'},{name:'White',hex:'#fff'}], sizes:['4Y','6Y','8Y','10Y','12Y'], inStock:true, available:true, isNew:true, rating:4.8, reviewCount:54, stockQty:88 }),
  mk({ id:'mk025', name:'Kids Denim Jacket', description:'Classic denim trucker for kids.', categoryId:'cat_k_boys', gender:'KIDS', price:1499, images:['https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800'], colors:[{name:'Blue',hex:'#5b7ca6'}], sizes:['4Y','6Y','8Y','10Y'], inStock:true, available:true, rating:4.7, reviewCount:42, stockQty:33 }),
  mk({ id:'mk026', name:'Baby Bodysuit 3 Pack', description:'Organic cotton bodysuits, 3 per pack.', categoryId:'cat_k_baby', gender:'BABY', price:899, images:['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800'], colors:[{name:'White',hex:'#fff'},{name:'Beige',hex:'#d9c7b8'}], sizes:['0-6M','6-12M','12-18M'], inStock:true, available:true, rating:4.9, reviewCount:31, stockQty:62 }),
  mk({ id:'mk027', name:'Kids Fleece Hoodie', description:'Cozy fleece for play.', categoryId:'cat_k_girls', gender:'KIDS', price:999, images:['https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800'], colors:[{name:'Yellow',hex:'#f9d976'},{name:'Blue',hex:'#7aa9d6'}], sizes:['4Y','6Y','8Y','10Y'], inStock:true, available:true, rating:4.6, reviewCount:38, stockQty:44 }),
  mk({ id:'mk028', name:'Kids Jogger', description:'Soft jersey jogger with elastic cuffs.', categoryId:'cat_k_boys', gender:'KIDS', price:799, images:['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800'], colors:[{name:'Grey',hex:'#9aa0a6'},{name:'Navy',hex:'#1e2a4a'}], sizes:['4Y','6Y','8Y','10Y'], inStock:true, available:true, rating:4.5, reviewCount:29, stockQty:51 }),
  // Accessories / Outerwear
  mk({ id:'mk029', name:'Puffer Jacket', description:'Lightweight puffer, packable.', categoryId:'cat_outer', gender:'UNISEX', price:3499, compareAtPrice:4499, images:['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800','https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800'], colors:[{name:'Black',hex:'#111'},{name:'Cream',hex:'#f5efe6'},{name:'Olive',hex:'#6b7c5a'}], sizes:['S','M','L','XL'], inStock:true, available:true, badge:'25% OFF', rating:4.8, reviewCount:312, stockQty:28 }),
  mk({ id:'mk030', name:'Trench Coat', description:'Classic trench with belt.', categoryId:'cat_outer', gender:'WOMEN', price:3999, images:['https://images.unsplash.com/photo-1548883354-94bcfe321cbb?w=800'], colors:[{name:'Beige',hex:'#c9b8a3'},{name:'Black',hex:'#111'}], sizes:['S','M','L'], inStock:true, available:true, rating:4.7, reviewCount:98, stockQty:22 }),
  mk({ id:'mk031', name:'Cross Body Bag', description:'Utility cross body, water-repellent.', categoryId:'cat_accessories', gender:'UNISEX', price:1199, images:['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'], colors:[{name:'Black',hex:'#111'},{name:'Khaki',hex:'#c2b280'}], sizes:['One Size'], inStock:true, available:true, rating:4.6, reviewCount:210, stockQty:73 }),
  mk({ id:'mk032', name:'Bucket Hat', description:'Cotton canvas bucket hat.', categoryId:'cat_accessories', gender:'UNISEX', price:799, images:['https://images.unsplash.com/photo-1556306535-38febf6782e7?w=800'], colors:[{name:'Natural',hex:'#d6c7b8'},{name:'Black',hex:'#111'}], sizes:['S/M','M/L'], inStock:true, available:true, isNew:true, rating:4.5, reviewCount:44, stockQty:90 }),
  // Add more sale items to support promotion engine
  mk({ id:'mk033', name:'Linen Blend Shorts', description:'Breathable shorts for summer.', categoryId:'cat_w_shorts', gender:'WOMEN', price:999, compareAtPrice:1399, images:['https://images.unsplash.com/photo-1581044777556-4cfa60707c03?w=800'], colors:[{name:'White',hex:'#fff'},{name:'Stripe',hex:'#7aa9d6'}], sizes:['XS','S','M','L'], inStock:true, available:true, badge:'25% OFF', rating:4.3, reviewCount:67, stockQty:55 }),
  mk({ id:'mk034', name:'Satin Cami', description:'Satin cami with lace trim.', categoryId:'cat_w_tops', gender:'WOMEN', price:1199, images:['https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800'], colors:[{name:'Black',hex:'#111'},{name:'Pink',hex:'#e8a0a8'}], sizes:['S','M','L'], inStock:true, available:true, rating:4.6, reviewCount:88, stockQty:36 }),
  mk({ id:'mk035', name:'Mom Jeans', description:'High-waisted mom jean, relaxed.', categoryId:'cat_w_jeans', gender:'WOMEN', price:2399, images:['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800'], colors:[{name:'Light Wash',hex:'#8fb0d6'},{name:'Mid Blue',hex:'#5b7ca6'}], sizes:['26','28','30','32'], inStock:true, available:true, rating:4.7, reviewCount:445, stockQty:61 }),
  mk({ id:'mk036', name:'Kids Holiday Set', description:'Matching tee & short set for kids.', categoryId:'cat_k_girls', gender:'KIDS', price:1299, images:['https://images.unsplash.com/photo-1522771930-78848d9293e?w=600'], colors:[{name:'Yellow',hex:'#f9d976'}], sizes:['4Y','6Y','8Y'], inStock:true, available:true, badge:'2 FOR ₹1999', rating:4.8, reviewCount:22, stockQty:47 }),
];

export const DEFAULT_HERO: HeroSection = {
  id:'hero_01',
  type:'image',
  src:'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600',
  mobileSrc:'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800',
  eyebrow:'THE FASHION EVENT',
  title:'25% OFF SITEWIDE',
  subtitle:'Plus extra deals in-store & online. Ends Sunday midnight.',
  finePrint:'Online exclusive. Terms apply. Excludes gift cards.',
  ctaLabel:'WOMEN',
  ctaLink:'/collection/women',
  cta2Label:'MEN',
  cta2Link:'/collection/men',
  cta3Label:'KIDS',
  cta3Link:'/collection/kids',
  alignment:'center',
  verticalAlign:'center',
  overlayOpacity:0.28,
  isActive:true,
};

export const DEFAULT_TICKER: TickerConfig = {
  enabled:true,
  text:'★ MANIKUNJ • FREE DELIVERY OVER ₹1999  •  25% OFF SITEWIDE  •  FREE RETURNS 30 DAYS  •  2 FOR ₹1999 ON SELECTED STYLES  •',
  speed:22,
  bgColor:'#111111',
  textColor:'#ffffff',
  link:'/collection/all',
};

export const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  { id:'a1', text:'FREE DELIVERY ON ORDERS ₹1999+ • FREE RETURNS ONLINE & IN-STORE', mobileText:'FREE DELIVERY ₹1999+', link:'/delivery', bgColor:'#111111', textColor:'#ffffff', enabled:true, priority:1 },
  { id:'a2', text:'JOIN MANIKUNJ REWARDS & EARN POINTS ON EVERY PURCHASE', mobileText:'JOIN REWARDS & EARN POINTS', link:'/account/rewards', bgColor:'#ff4d6d', textColor:'#ffffff', enabled:true, priority:2 },
  { id:'a3', text:'THE FASHION EVENT — 25% OFF SITEWIDE • ENDS SUNDAY', mobileText:'25% OFF SITEWIDE', link:'/collection/all', bgColor:'#ffefeb', textColor:'#111111', enabled:true, priority:3 },
];

export const DEFAULT_COUPONS: Coupon[] = [
  { id:'c1', code:'WELCOME10', type:'percent', value:10, minBasket:1499, isActive:true, usedCount:0, description:'10% off first order over ₹1499 — ManiKunj' },
  { id:'c2', code:'MANIKUNJ25', type:'percent', value:25, minBasket:0, isActive:true, usedCount:0, description:'ManiKunj Fashion Event 25% off sitewide' },
  { id:'c3', code:'FREEDEL', type:'free_shipping', value:0, minBasket:1999, isActive:true, usedCount:0, description:'Free shipping over ₹1999' },
  { id:'c4', code:'SAVE500', type:'fixed', value:500, minBasket:3999, maxDiscount:500, isActive:true, usedCount:0, description:'₹500 off over ₹3999' },
  { id:'c5', code:'BOGO50', type:'bogo', value:50, minBasket:0, isActive:true, usedCount:0, description:'Buy 1 Get 1 50% Off' },
];

export const DEFAULT_SECTION_IMAGES: UniqloSectionImage[] = [
  { id:'s1', title:'WOMEN', image:'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800', link:'/collection/women', sortOrder:1, isActive:true },
  { id:'s2', title:'MEN', image:'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800', link:'/collection/men', sortOrder:2, isActive:true },
  { id:'s3', title:'KIDS', image:'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800', link:'/collection/kids', sortOrder:3, isActive:true },
  { id:'s4', title:'BABY', image:'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800', link:'/collection/baby', sortOrder:4, isActive:true },
];

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSection[] = [
  { id:'hs_hero', type:'hero', title:'25% OFF SITEWIDE', eyebrow:'THE FASHION EVENT', subtitle:'Extra deals on trending styles. Ends Sunday midnight.', ctaLabel:'SHOP WOMEN', ctaLink:'/collection/women', cta2Label:'SHOP MEN', cta2Link:'/collection/men', cta3Label:'SHOP KIDS', cta3Link:'/collection/kids', image:'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600', mobileImage:'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800', bgColor:'#111111', textColor:'#ffffff', textAlign:'center', desktopHeight:'72vh', mobileHeight:'58vh', overlayOpacity:0.28, sortOrder:1, isActive:true },
  { id:'hs_tiles', type:'category_tiles', title:'SHOP BY CATEGORY', sortOrder:2, isActive:true, categoryIds:['cat_women','cat_men','cat_kids','cat_accessories'] },
  { id:'hs_carousel_new', type:'new_arrivals', title:'NEW IN', subtitle:'Fresh drops just landed', sortOrder:3, isActive:true },
  { id:'hs_promo', type:'promo_banner', eyebrow:'TRENDING NOW', title:'2 FOR ₹1999', subtitle:'On selected tees & shorts', ctaLabel:'SHOP NOW', ctaLink:'/collection/all', bgColor:'#ff4d6d', textColor:'#ffffff', textAlign:'center', sortOrder:4, isActive:true },
  { id:'hs_carousel_trending', type:'product_carousel', title:'TRENDING', sortOrder:5, isActive:true },
  { id:'hs_image_text', type:'image_with_text', title:'THE DENIM EDIT', subtitle:'Baggy, straight, low-rise — find your perfect fit. Designed in India, made for everywhere.', image:'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1000', ctaLabel:'SHOP JEANS', ctaLink:'/collection/women-jeans', bgColor:'#fff7ed', textColor:'#111111', textAlign:'left', sortOrder:6, isActive:true },
  { id:'hs_sale', type:'sale_collection', title:'SALE — UP TO 50% OFF', sortOrder:7, isActive:true, bgColor:'#111111', textColor:'#ffffff' },
];

export const DEFAULT_NAVIGATION: NavigationItem[] = [
  { id:'n_women', label:'WOMEN', href:'/collection/women', sortOrder:1, isActive:true, children:[
    { id:'n_w_new', label:'New In', href:'/collection/women?sort=new', sortOrder:1, isActive:true },
    { id:'n_w_clothing', label:'Clothing', href:'/collection/women', sortOrder:2, isActive:true, children:[
      { id:'n_w_tops', label:'Tops', href:'/collection/women-tops', sortOrder:1, isActive:true },
      { id:'n_w_jeans', label:'Jeans', href:'/collection/women-jeans', sortOrder:2, isActive:true },
      { id:'n_w_pants', label:'Pants', href:'/collection/women-pants', sortOrder:3, isActive:true },
      { id:'n_w_dresses', label:'Dresses', href:'/collection/dresses', sortOrder:4, isActive:true },
      { id:'n_w_active', label:'Activewear', href:'/collection/women-activewear', sortOrder:5, isActive:true },
      { id:'n_w_sweats', label:'Sweats', href:'/collection/women-sweats', sortOrder:6, isActive:true },
      { id:'n_w_shorts', label:'Shorts & Skirts', href:'/collection/women-shorts', sortOrder:7, isActive:true },
    ]},
    { id:'n_w_trending', label:'Trending', href:'/collection/women?sort=popular', sortOrder:3, isActive:true, badge:'NEW' },
    { id:'n_w_sale', label:'Sale', href:'/collection/women?filter=sale', sortOrder:4, isActive:true, badge:'25% OFF', badgeColor:'#ff4d6d' },
  ]},
  { id:'n_men', label:'MEN', href:'/collection/men', sortOrder:2, isActive:true, children:[
    { id:'n_m_new', label:'New In', href:'/collection/men?sort=new', sortOrder:1, isActive:true },
    { id:'n_m_tops', label:'Tops & Tees', href:'/collection/men-tops', sortOrder:2, isActive:true },
    { id:'n_m_shirts', label:'Shirts', href:'/collection/men-shirts', sortOrder:3, isActive:true },
    { id:'n_m_jeans', label:'Jeans', href:'/collection/men-jeans', sortOrder:4, isActive:true },
    { id:'n_m_shorts', label:'Shorts', href:'/collection/men-shorts', sortOrder:5, isActive:true },
    { id:'n_m_active', label:'Activewear', href:'/collection/men-activewear', sortOrder:6, isActive:true },
    { id:'n_m_sale', label:'Sale', href:'/collection/men?filter=sale', sortOrder:7, isActive:true, badge:'25% OFF', badgeColor:'#ff4d6d' },
  ]},
  { id:'n_kids', label:'KIDS', href:'/collection/kids', sortOrder:3, isActive:true, children:[
    { id:'n_k_girls', label:'Girls 2-14', href:'/collection/girls-2-14', sortOrder:1, isActive:true },
    { id:'n_k_boys', label:'Boys 2-14', href:'/collection/boys-2-14', sortOrder:2, isActive:true },
    { id:'n_k_baby', label:'Baby 0-2', href:'/collection/baby-0-2', sortOrder:3, isActive:true },
  ]},
  { id:'n_new', label:'NEW', href:'/collection/all?sort=new', sortOrder:4, isActive:true, badge:'NEW', badgeColor:'#111111' },
  { id:'n_sale', label:'SALE', href:'/collection/all?filter=sale', sortOrder:5, isActive:true, badge:'25% OFF', badgeColor:'#ff4d6d' },
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brandName:'ManiKunj',
  logo:'/manikunj-logo.svg',
  favicon:'/favicon.ico',
  supportEmail:'hello@manikunj.com',
  supportPhone:'+91 98765 43210',
  address:'MG Road, Bangalore, Karnataka 560001, India',
  currency:'INR',
  currencySymbol:'₹',
  announcementEnabled:true,
  freeShippingThreshold:1999,
  shippingStandard:99,
  shippingExpress:149,
  headerStyle:'sticky',
  footerLinks:[
    { title:'SHOPPING & ORDER', links:[{label:'Delivery & Tracking', href:'/delivery'},{label:'Returns & Exchanges', href:'/returns'},{label:'Size Guide', href:'/size-guide'},{label:'Find a Store', href:'/stores'}]},
    { title:'CUSTOMER CARE', links:[{label:'Contact Us', href:'/contact'},{label:'Gift Cards', href:'/gift-cards'},{label:'Rewards', href:'/account/rewards'},{label:'Product Recall', href:'/recall'}]},
    { title:'ABOUT MANIKUNJ', links:[{label:'Our Story', href:'/about'},{label:'Careers', href:'/careers'},{label:'Community', href:'/community'},{label:'Sustainability', href:'/sustainability'}]},
  ],
  socialLinks:[
    { platform:'instagram', url:'https://instagram.com/manikunj' },
    { platform:'facebook', url:'https://facebook.com/manikunj' },
    { platform:'tiktok', url:'https://tiktok.com/@manikunj' },
  ],
  newsletterEnabled:true,
};
