'use client';
import Link from 'next/link';
import { useMemo } from 'react';
import ManiKunjHeader from '@/components/manikunj/Header';
import ManiKunjHero from '@/components/manikunj/Hero';
import ManiKunjProductCard from '@/components/manikunj/ProductCard';
import ManiKunjFooter from '@/components/manikunj/Footer';
import { useUniqloStore } from '@/lib/uniqlo/store';

export default function HomePage(){
  const products = useUniqloStore(s=> s.products);
  const homepageSections = useUniqloStore(s=> s.homepageSections);
  const categories = useUniqloStore(s=> s.categories);
  const sections = useMemo(()=> homepageSections.filter(x=> x.isActive).sort((a,b)=> a.sortOrder - b.sortOrder), [homepageSections]);

  const topCats = categories.filter(c=> !c.parentId).slice(0,4);
  const newArrivals = products.filter(p=> p.isNew).slice(0,8);
  const featured = products.filter(p=> p.isFeatured).slice(0,8);
  const sale = products.filter(p=> p.compareAtPrice && p.compareAtPrice>p.price).slice(0,8);
  const trending = products.slice(0,8);

  return (
    <div className="min-h-screen bg-white">
      <ManiKunjHeader />
      <ManiKunjHero />

      {/* CMS-driven homepage sections */}
      <main className="space-y-0">
        {sections.map(sec=>{
          // Skip hero already rendered
          if(sec.type==='hero') return null;

          if(sec.type==='category_tiles'){
            const cats = sec.categoryIds?.length ? categories.filter(c=> sec.categoryIds!.includes(c.id)) : topCats;
            return (
              <section key={sec.id} className="max-w-[1440px] mx-auto px-3 sm:px-4 py-6">
                <div className="flex items-end justify-between mb-4">
                  <h2 className="text-[18px] sm:text-[22px] font-black tracking-tighter">{sec.title || 'SHOP BY CATEGORY'}</h2>
                  <Link href="/collection/all" className="text-xs font-bold border border-black px-3 py-1.5 hover:bg-black hover:text-white">VIEW ALL</Link>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {cats.map(cat=>(
                    <Link key={cat.id} href={`/collection/${cat.slug}`} className="relative h-[220px] sm:h-[280px] overflow-hidden group border border-neutral-200">
                      <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
                      <span className="absolute bottom-3 left-3 bg-white px-3 py-2 text-xs font-black tracking-widest">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          }

          if(sec.type==='promo_banner'){
            return (
              <section key={sec.id} className="py-0">
                <div className="text-center py-6 sm:py-8" style={{ background: sec.bgColor || '#ff4d6d', color: sec.textColor || '#ffffff' }}>
                  {sec.eyebrow && <p className="text-[11px] tracking-[0.2em] font-black opacity-90">{sec.eyebrow}</p>}
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tighter mt-1">{sec.title}</h3>
                  {sec.subtitle && <p className="text-sm mt-1 opacity-90">{sec.subtitle}</p>}
                  {sec.ctaLabel && <Link href={sec.ctaLink || '/collection/all'} className="inline-block mt-4 bg-white text-black px-8 py-2.5 text-xs font-black tracking-widest hover:bg-black hover:text-white">{sec.ctaLabel}</Link>}
                </div>
              </section>
            );
          }

          if(sec.type==='product_carousel' || sec.type==='new_arrivals' || sec.type==='featured_products' || sec.type==='sale_collection'){
            let list: typeof products = [];
            let title = sec.title || 'TRENDING';
            if(sec.type==='new_arrivals' || sec.title?.includes('NEW')) { list = newArrivals; title = sec.title || 'NEW IN'; }
            else if(sec.type==='sale_collection' || sec.title?.includes('SALE')) { list = sale; title = sec.title || 'SALE — UP TO 50% OFF'; }
            else if(sec.type==='featured_products') { list = featured; }
            else { list = trending; title = sec.title || 'TRENDING NOW'; }
            if(list.length===0) return null;
            return (
              <section key={sec.id} className="max-w-[1440px] mx-auto px-3 sm:px-4 py-6">
                <div className="flex items-baseline gap-3 mb-4">
                  <h3 className="text-lg font-black tracking-tight">{title}</h3>
                  {sec.subtitle && <span className="text-xs text-neutral-500 hidden sm:inline">{sec.subtitle}</span>}
                  <Link href="/collection/all" className="ml-auto text-xs font-bold underline hidden sm:inline">Shop All</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {list.map(p=> <ManiKunjProductCard key={p.id} product={p} />)}
                </div>
              </section>
            );
          }

          if(sec.type==='image_with_text'){
            return (
              <section key={sec.id} className="max-w-[1440px] mx-auto px-3 sm:px-4 py-6">
                <div className="grid md:grid-cols-2 gap-0 border border-neutral-200 overflow-hidden" style={{ background: sec.bgColor || '#fff7ed' }}>
                  <div className="h-[320px] sm:h-[420px] relative overflow-hidden">
                    <img src={sec.image} alt={sec.title} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="p-6 sm:p-10 flex flex-col justify-center" style={{ color: sec.textColor || '#111' }}>
                    {sec.eyebrow && <p className="text-[11px] tracking-[0.2em] font-black opacity-60">{sec.eyebrow}</p>}
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tighter mt-2">{sec.title}</h3>
                    {sec.subtitle && <p className="text-sm mt-3 leading-relaxed text-neutral-600">{sec.subtitle}</p>}
                    {sec.ctaLabel && <Link href={sec.ctaLink || '/'} className="inline-block mt-6 bg-black text-white px-8 py-3 text-xs font-black tracking-widest hover:bg-neutral-800 self-start">{sec.ctaLabel}</Link>}
                  </div>
                </div>
              </section>
            );
          }

          if(sec.type==='text_banner'){
            return (
              <section key={sec.id} className="text-center py-8 px-4" style={{ background: sec.bgColor || '#111', color: sec.textColor || '#fff' }}>
                <h3 className="text-lg font-black tracking-widest">{sec.title}</h3>
                {sec.subtitle && <p className="text-sm mt-2 opacity-80 max-w-2xl mx-auto">{sec.subtitle}</p>}
              </section>
            );
          }

          return null;
        })}

        {/* fallback if no sections: show defaults */}
        {sections.filter(s=> s.type!=='hero').length===0 && (
          <>
            <section className="max-w-[1440px] mx-auto px-3 sm:px-4 py-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {topCats.map(cat=>(
                  <Link key={cat.id} href={`/collection/${cat.slug}`} className="relative h-[280px] overflow-hidden group">
                    <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover" />
                    <span className="absolute bottom-3 left-3 bg-white px-3 py-2 text-xs font-black">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </section>
            <section className="max-w-[1440px] mx-auto px-3 sm:px-4 py-6">
              <h3 className="text-lg font-black mb-3">NEW IN</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{newArrivals.map(p=> <ManiKunjProductCard key={p.id} product={p} />)}</div>
            </section>
          </>
        )}

        {/* editorial - Women / Men */}
        <section className="max-w-[1440px] mx-auto px-3 sm:px-4 py-6">
          <div className="grid md:grid-cols-2 gap-3">
            <Link href="/collection/women" className="relative h-[360px] overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1000" alt="Women" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-6 left-6 text-white"><p className="text-2xl font-black tracking-tight">WOMEN&apos;S NEW SEASON</p><span className="inline-block mt-3 bg-white text-black px-5 py-2 text-xs font-black">SHOP WOMEN</span></div>
            </Link>
            <Link href="/collection/men" className="relative h-[360px] overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1000" alt="Men" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-6 left-6 text-white"><p className="text-2xl font-black tracking-tight">MEN&apos;S ESSENTIALS</p><span className="inline-block mt-3 bg-white text-black px-5 py-2 text-xs font-black">SHOP MEN</span></div>
            </Link>
          </div>
        </section>

        {/* benefits strip Cotton On style */}
        <div className="max-w-[1440px] mx-auto px-3 sm:px-4 pb-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="border border-neutral-200 p-4 flex items-center gap-3 bg-[#fff7ed]"><span className="w-10 h-10 bg-black text-white flex items-center justify-center text-lg">◍</span><div><p className="font-black">Click & Collect</p><p className="text-neutral-600">Ready in 2 hours</p></div></div>
          <div className="border border-neutral-200 p-4 flex items-center gap-3 bg-[#fff0f3]"><span className="w-10 h-10 bg-[#ff4d6d] text-white flex items-center justify-center">◎</span><div><p className="font-black">Free Delivery</p><p className="text-neutral-600">Over ₹1999</p></div></div>
          <div className="border border-neutral-200 p-4 flex items-center gap-3 bg-[#f0fdf4]"><span className="w-10 h-10 bg-black text-white flex items-center justify-center">✓</span><div><p className="font-black">Free Returns</p><p className="text-neutral-600">Within 30 days</p></div></div>
        </div>

        {/* brand bar */}
        <div className="bg-black text-white p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div><p className="font-black text-lg" style={{ fontFamily:'var(--font-space-grotesk)' }}>ManiKunj — WEAR YOUR STORY</p><p className="text-xs text-white/80 mt-1">Pay with UPI • Card • COD • Free Delivery over ₹1999 • Generate codes in Admin → Coupons</p></div>
          <Link href="/admin" className="bg-white text-black px-6 py-3 text-xs font-black tracking-widest hover:bg-neutral-100">OPEN ADMIN CMS</Link>
        </div>
      </main>

      <ManiKunjFooter />

      {/* Mobile bottom nav - Cotton On style */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 flex justify-around py-2 z-40 text-[10px] font-bold">
        <Link href="/" className="flex flex-col items-center text-black"><span className="text-base">⌂</span>HOME</Link>
        <Link href="/collection/all" className="flex flex-col items-center text-neutral-600"><span className="text-base">▦</span>SHOP</Link>
        <Link href="/cart" className="flex flex-col items-center text-neutral-600"><span className="text-base">🛒</span>BAG</Link>
        <Link href="/wishlist" className="flex flex-col items-center text-neutral-600"><span className="text-base">♡</span>SAVED</Link>
        <Link href="/profile" className="flex flex-col items-center text-neutral-600"><span className="text-base">◯</span>YOU</Link>
      </div>
      <div className="lg:hidden h-14" />
    </div>
  );
}
