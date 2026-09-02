'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UniqloProduct, UniqloCategory, HeroSection, TickerConfig, Coupon, UniqloCartItem, UniqloOrder, UniqloSectionImage, Announcement, HomepageSection, NavigationItem, SiteSettings } from './types';
import { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS, DEFAULT_HERO, DEFAULT_TICKER, DEFAULT_COUPONS, DEFAULT_SECTION_IMAGES, DEFAULT_ANNOUNCEMENTS, DEFAULT_HOMEPAGE_SECTIONS, DEFAULT_NAVIGATION, DEFAULT_SITE_SETTINGS } from './data';

interface UniqloStore {
  products: UniqloProduct[];
  categories: UniqloCategory[];
  hero: HeroSection;
  ticker: TickerConfig;
  announcements: Announcement[];
  coupons: Coupon[];
  sections: UniqloSectionImage[];
  homepageSections: HomepageSection[];
  navigation: NavigationItem[];
  siteSettings: SiteSettings;
  cart: UniqloCartItem[];
  orders: UniqloOrder[];
  wishlist: string[];
  _hydrated: boolean;
  setHydrated: (v: boolean) => void;
  // product
  setProducts: (p: UniqloProduct[]) => void;
  addProduct: (p: UniqloProduct) => void;
  updateProduct: (id: string, patch: Partial<UniqloProduct>) => void;
  deleteProduct: (id: string) => void;
  toggleAvailable: (id: string) => void;
  // category
  setCategories: (c: UniqloCategory[]) => void;
  addCategory: (c: UniqloCategory) => void;
  updateCategory: (id: string, patch: Partial<UniqloCategory>) => void;
  deleteCategory: (id: string) => void;
  // hero/ticker/announcements
  updateHero: (patch: Partial<HeroSection>) => void;
  updateTicker: (patch: Partial<TickerConfig>) => void;
  setAnnouncements: (a: Announcement[]) => void;
  updateAnnouncement: (id: string, patch: Partial<Announcement>) => void;
  // coupons
  setCoupons: (c: Coupon[]) => void;
  addCoupon: (c: Coupon) => void;
  updateCoupon: (id: string, patch: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  // sections
  setSections: (s: UniqloSectionImage[]) => void;
  updateSection: (id: string, patch: Partial<UniqloSectionImage>) => void;
  // homepage builder
  setHomepageSections: (s: HomepageSection[]) => void;
  addHomepageSection: (s: HomepageSection) => void;
  updateHomepageSection: (id: string, patch: Partial<HomepageSection>) => void;
  deleteHomepageSection: (id: string) => void;
  duplicateHomepageSection: (id: string) => void;
  reorderHomepageSections: (ids: string[]) => void;
  // navigation
  setNavigation: (n: NavigationItem[]) => void;
  updateNavigation: (updater: (prev: NavigationItem[]) => NavigationItem[]) => void;
  // site settings
  updateSiteSettings: (patch: Partial<SiteSettings>) => void;
  // cart
  addToCart: (product: UniqloProduct, qty?: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateQty: (productId: string, qty: number, size?: string, color?: string) => void;
  clearCart: () => void;
  // orders
  addOrder: (o: UniqloOrder) => void;
  updateOrder: (id: string, patch: Partial<UniqloOrder>) => void;
  // wishlist
  toggleWishlist: (productId: string) => void;
}

const STORAGE_KEY = 'manikunj-store-v5';

export const useUniqloStore = create<UniqloStore>()(
  persist(
    (set, get) => ({
      products: DEFAULT_PRODUCTS,
      categories: DEFAULT_CATEGORIES,
      hero: DEFAULT_HERO,
      ticker: DEFAULT_TICKER,
      announcements: DEFAULT_ANNOUNCEMENTS,
      coupons: DEFAULT_COUPONS,
      sections: DEFAULT_SECTION_IMAGES,
      homepageSections: DEFAULT_HOMEPAGE_SECTIONS,
      navigation: DEFAULT_NAVIGATION,
      siteSettings: DEFAULT_SITE_SETTINGS,
      cart: [],
      orders: [],
      wishlist: [],
      _hydrated: false,
      setHydrated: (v) => set({ _hydrated: v }),

      setProducts: (products) => set({ products }),
      addProduct: (p) => set((s) => ({ products: [p, ...s.products] })),
      updateProduct: (id, patch) => set((s) => ({ products: s.products.map(x => x.id===id ? {...x, ...patch, updatedAt: Date.now()} : x)})),
      deleteProduct: (id) => set((s) => ({ products: s.products.filter(x=>x.id!==id)})),
      toggleAvailable: (id) => set((s) => ({ products: s.products.map(x=> x.id===id ? {...x, available: !x.available, inStock: !x.available ? false : x.inStock, updatedAt: Date.now()} : x)})),

      setCategories: (categories) => set({ categories }),
      addCategory: (c) => set((s)=>({ categories:[...s.categories, c]})),
      updateCategory: (id,patch)=> set((s)=>({ categories: s.categories.map(x=> x.id===id ? {...x,...patch}:x)})),
      deleteCategory: (id)=> set((s)=>({ categories: s.categories.filter(x=>x.id!==id)})),

      updateHero: (patch)=> set((s)=>({ hero:{...s.hero, ...patch}})),
      updateTicker: (patch)=> set((s)=>({ ticker:{...s.ticker, ...patch}})),
      setAnnouncements: (announcements)=> set({ announcements }),
      updateAnnouncement: (id,patch)=> set((s)=>({ announcements: s.announcements.map(x=> x.id===id ? {...x,...patch}:x)})),

      setCoupons: (coupons)=> set({ coupons }),
      addCoupon: (c)=> set((s)=>({ coupons:[...s.coupons, c]})),
      updateCoupon: (id,patch)=> set((s)=>({ coupons: s.coupons.map(x=> x.id===id ? {...x,...patch}:x)})),
      deleteCoupon: (id)=> set((s)=>({ coupons: s.coupons.filter(x=>x.id!==id)})),

      setSections: (sections)=> set({ sections }),
      updateSection: (id,patch)=> set((s)=>({ sections: s.sections.map(x=> x.id===id ? {...x,...patch}:x)})),

      setHomepageSections: (homepageSections)=> set({ homepageSections }),
      addHomepageSection: (sec)=> set((s)=>({ homepageSections: [...s.homepageSections, sec].sort((a,b)=>a.sortOrder-b.sortOrder)})),
      updateHomepageSection: (id,patch)=> set((s)=>({ homepageSections: s.homepageSections.map(x=> x.id===id ? {...x,...patch}:x)})),
      deleteHomepageSection: (id)=> set((s)=>({ homepageSections: s.homepageSections.filter(x=>x.id!==id)})),
      duplicateHomepageSection: (id)=> set((s)=>{
        const found = s.homepageSections.find(x=>x.id===id);
        if(!found) return {};
        const clone = {...found, id: id + '_copy_' + Date.now(), title: (found.title||'Copy') + ' Copy'};
        return { homepageSections: [...s.homepageSections, clone]};
      }),
      reorderHomepageSections: (ids)=> set((s)=>{
        const map = new Map(s.homepageSections.map(x=>[x.id,x] as const));
        const reordered = ids.map((id,i)=> { const it = map.get(id); return it ? {...it, sortOrder: i+1} : null as any }).filter(Boolean);
        const missing = s.homepageSections.filter(x=> !ids.includes(x.id));
        return { homepageSections: [...reordered, ...missing]};
      }),

      setNavigation: (navigation)=> set({ navigation }),
      updateNavigation: (updater)=> set((s)=>({ navigation: updater(s.navigation)})),

      updateSiteSettings: (patch)=> set((s)=>({ siteSettings: {...s.siteSettings, ...patch}})),

      addToCart: (product, qty=1, size, color) => set((s)=>{
        const idx = s.cart.findIndex(c=> c.product.id===product.id && c.size===size && c.color===color);
        if(idx!==-1){ const copy=[...s.cart]; copy[idx].quantity+=qty; return {cart:copy};}
        return {cart:[...s.cart,{product, quantity:qty, size, color}]};
      }),
      removeFromCart: (productId, size, color)=> set((s)=>({ cart: s.cart.filter(c=> !(c.product.id===productId && c.size===size && c.color===color))})),
      updateQty: (productId, qty, size, color)=> set((s)=>{
        if(qty<=0) return {cart: s.cart.filter(c=> !(c.product.id===productId && c.size===size && c.color===color))};
        return {cart: s.cart.map(c=> c.product.id===productId && c.size===size && c.color===color ? {...c, quantity:qty}:c)};
      }),
      clearCart: ()=> set({cart:[]}),
      addOrder: (o)=> set((s)=>({ orders:[o,...s.orders]})),
      updateOrder: (id,patch)=> set((s)=>({ orders: s.orders.map(x=> x.id===id ? {...x,...patch}:x)})),
      toggleWishlist: (pid)=> set((s)=> ({ wishlist: s.wishlist.includes(pid) ? s.wishlist.filter(x=>x!==pid) : [...s.wishlist, pid]})),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') return { getItem: ()=>null, setItem: ()=>{}, removeItem: ()=>{} };
        return localStorage;
      }),
      partialize: (s)=> ({
        products: s.products,
        categories: s.categories,
        hero: s.hero,
        ticker: s.ticker,
        announcements: s.announcements,
        coupons: s.coupons,
        sections: s.sections,
        homepageSections: s.homepageSections,
        navigation: s.navigation,
        siteSettings: s.siteSettings,
        cart: s.cart,
        orders: s.orders,
        wishlist: s.wishlist,
      }),
    }
  )
);

export function forceSave(){
  try {
    const state = useUniqloStore.getState();
    const data = {
      state: {
        products: state.products,
        categories: state.categories,
        hero: state.hero,
        ticker: state.ticker,
        announcements: state.announcements,
        coupons: state.coupons,
        sections: state.sections,
        homepageSections: state.homepageSections,
        navigation: state.navigation,
        siteSettings: state.siteSettings,
        cart: state.cart,
        orders: state.orders,
        wishlist: state.wishlist,
      },
      version: -1,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return { ok: true, size: JSON.stringify(data).length };
  } catch(e: any) {
    return { ok: false, error: e?.message || 'Unknown error' };
  }
}

export function getStorageInfo(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { exists: false, size: 0, hero: null };
    const parsed = JSON.parse(raw);
    return { exists: true, size: raw.length, hero: parsed?.state?.hero || null };
  } catch {
    return { exists: false, size: 0, hero: null };
  }
}

export function calcCartTotals(cart: UniqloCartItem[], coupons: Coupon[], code?: string, siteSettings?: SiteSettings){
  const subtotal = cart.reduce((a,c)=> a + c.product.price * c.quantity, 0);
  let discount=0;
  const threshold = siteSettings?.freeShippingThreshold ?? 1999;
  const stdShipping = siteSettings?.shippingStandard ?? 99;
  let shipping = subtotal>0 ? stdShipping : 0;
  let freeShipping=false;
  if(code){
    const cp = coupons.find(x=> x.code.toUpperCase()===code.toUpperCase() && x.isActive);
    if(cp){
      const now = new Date(); const startOk = !cp.startDate || new Date(cp.startDate) <= now; const endOk = !cp.endDate || new Date(cp.endDate) >= now;
      const minOk = !cp.minBasket || subtotal >= cp.minBasket;
      if(startOk && endOk && minOk){
        if(cp.type==='percent'){ discount = subtotal * (cp.value/100); if(cp.maxDiscount) discount = Math.min(discount, cp.maxDiscount); }
        else if(cp.type==='fixed'){ discount = Math.min(cp.value, subtotal); }
        else if(cp.type==='free_shipping'){ freeShipping=true; }
        else if(cp.type==='bogo'){
          const totalQty = cart.reduce((a,c)=>a+c.quantity,0);
          if(totalQty>=2){
            const cheapest = Math.min(...cart.map(c=>c.product.price));
            discount = cheapest * 0.5;
          }
        }
      }
    }
  }
  if(freeShipping || subtotal>=threshold) shipping=0;
  const afterDiscount = subtotal - discount;
  const tax = 0;
  const total = afterDiscount + shipping + tax;
  const savings = cart.reduce((a,c)=> {
    if(c.product.compareAtPrice) return a + (c.product.compareAtPrice - c.product.price)*c.quantity;
    return a;
  },0);
  return { subtotal, discount, shipping, tax, total, savings, freeShipping };
}