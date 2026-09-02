import type { Promotion, Banner, HomepageModule } from './types';

export const PROMOTIONS: Promotion[] = [
  { id:'promo_half_price', title:'Half Price Pantry', description:'Half price on selected pantry favourites', type:'percentage', value:50, isActive:true },
  { id:'promo_2for12', title:'2 for $12', description:'Mix & match selected snacks', type:'multibuy', value:12, isActive:true },
  { id:'promo_welcome10', code:'WELCOME10', title:'Welcome $10 Off', description:'$10 off your first order over $80', type:'fixed', value:10, minBasket:80, isActive:true },
  { id:'promo_freedelivery', code:'FREEDEL', title:'Free Delivery', description:'Free delivery over $99', type:'free_delivery', value:0, minBasket:99, isActive:true },
];

export const BANNERS: Banner[] = [
  { id:'banner_hero_1', title:'Fresh Deals of the Week', description:'Save big on fresh fruit, veg & more', image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200', ctaLabel:'Shop Now', ctaLink:'/shop?filter=specials', isActive:true, sortOrder:1 },
  { id:'banner_hero_2', title:'Half Price Specials', description:'Hundreds of products at half price', image:'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=1200', ctaLabel:'View Specials', ctaLink:'/shop?filter=half-price', isActive:true, sortOrder:2 },
  { id:'banner_hero_3', title:'Dinner Made Easy', description:'Ready meals & kits from $7.99', image:'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200', ctaLabel:'Shop Dinner', ctaLink:'/shop/dinner', isActive:true, sortOrder:3 },
];

export const HOMEPAGE_MODULES: HomepageModule[] = [
  { id:'mod_hero', type:'hero_carousel', sortOrder:1, isActive:true, bannerIds:['banner_hero_1','banner_hero_2','banner_hero_3'] },
  { id:'mod_specials_half', type:'specials_carousel', title:'Half Price', subtitle:'This week only', sortOrder:2, isActive:true },
  { id:'mod_fresh', type:'product_row', title:'Fresh Produce Offers', subtitle:'Picked daily', sortOrder:3, isActive:true },
  { id:'mod_departments', type:'department_grid', title:'Shop by Department', sortOrder:4, isActive:true },
  { id:'mod_recommended', type:'product_row', title:'Recommended for you', sortOrder:5, isActive:true },
  { id:'mod_new', type:'product_row', title:'New to FreshBasket', sortOrder:6, isActive:true },
];
