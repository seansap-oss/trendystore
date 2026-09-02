'use client';
import { useParams, useSearchParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import ManiKunjHeader from '@/components/manikunj/Header';
import ManiKunjFooter from '@/components/manikunj/Footer';
import ManiKunjProductCard from '@/components/manikunj/ProductCard';
import { useUniqloStore } from '@/lib/uniqlo/store';

export default function CollectionPage(){
  const params=useParams(); const slug=(params.slug as string) || 'all';
  const sp=useSearchParams();
  const q=sp.get('q')?.toLowerCase() || '';
  const filterSale = sp.get('filter')==='sale';
  const products=useUniqloStore(s=>s.products);
  const categories=useUniqloStore(s=>s.categories);
  const siteSettings=useUniqloStore(s=>s.siteSettings);

  const [sort,setSort]=useState(sp.get('sort') || 'featured');
  const [colour,setColour]=useState('');
  const [size,setSize]=useState('');
  const [price,setPrice]=useState('');
  const [gridCols, setGridCols]=useState(4);
  const [mobileFiltersOpen, setMobileFiltersOpen]=useState(false);

  const filtered = useMemo(()=>{
    let list=[...products];
    if(slug!=='all'){
      if(['women','men','kids','baby'].includes(slug)){
        list=list.filter(p=> p.gender.toLowerCase()===slug || p.categoryId.includes(slug) );
      } else {
        const cat = categories.find(c=>c.slug===slug);
        if(cat){
          // include children categories
          const childIds = categories.filter(c=> c.parentId===cat.id).map(c=>c.id);
          const ids = [cat.id, ...childIds];
          list=list.filter(p=> ids.includes(p.categoryId));
        } else {
          list=list.filter(p=> categories.find(c=>c.id===p.categoryId)?.slug===slug);
        }
      }
    }
    if(q) list=list.filter(p=> p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    if(filterSale) list=list.filter(p=> p.compareAtPrice && p.compareAtPrice>p.price);
    if(colour) list=list.filter(p=> p.colors.some(c=> c.name.toLowerCase()===colour.toLowerCase()));
    if(size) list=list.filter(p=> p.sizes.includes(size));
    if(price){
      if(price==='under1000') list=list.filter(p=> p.price < 1000);
      if(price==='1000-2000') list=list.filter(p=> p.price>=1000 && p.price<=2000);
      if(price==='over2000') list=list.filter(p=> p.price>2000);
    }
    if(sort==='price-low') list.sort((a,b)=>a.price-b.price);
    if(sort==='price-high') list.sort((a,b)=>b.price-a.price);
    if(sort==='new') list.sort((a,b)=> Number(b.isNew?1:0)-Number(a.isNew?1:0));
    if(sort==='popular') list.sort((a,b)=> (b.rating||0)-(a.rating||0));
    if(sort==='discount') list.sort((a,b)=> {
      const da = a.compareAtPrice ? a.compareAtPrice - a.price : 0;
      const db = b.compareAtPrice ? b.compareAtPrice - b.price : 0;
      return db-da;
    });
    return list;
  },[products,categories,slug,q,sort,colour,size,price,filterSale]);

  const title = slug==='all' ? 'ALL PRODUCTS' : categories.find(c=>c.slug===slug)?.name || slug.toUpperCase().replace(/-/g,' ');
  const catDesc = categories.find(c=>c.slug===slug)?.description;

  // colour counts for filter display
  const colourCounts = useMemo(()=>{
    const map: Record<string, number> = {};
    filtered.forEach(p=> p.colors.forEach(c=> { map[c.name]=(map[c.name]||0)+1; }));
    return Object.entries(map).slice(0,8);
  }, [filtered]);

  return (
    <div className="min-h-screen bg-white">
      <ManiKunjHeader />
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 py-3 text-xs text-neutral-500">
        <Link href="/" className="hover:underline">Home</Link> <span className="mx-1">/</span> <span className="text-black font-medium">{title}</span>
      </div>

      {/* campaign hero for category */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4">
        <div className="bg-neutral-50 border border-neutral-200 py-6 sm:py-8 text-center">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">{title}</h1>
          {catDesc && <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-2xl mx-auto">{catDesc}</p>}
          <p className="text-xs text-neutral-500 mt-2">{filtered.length} items {q && <>• Search: &quot;{q}&quot;</>}</p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 py-4 flex gap-6">
        {/* filters desktop */}
        <aside className="hidden lg:block w-[220px] flex-shrink-0">
          <div className="border border-neutral-200">
            <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
              <span className="text-xs font-black tracking-widest">FILTERS</span>
              {(colour||size||price) && <button onClick={()=>{setColour('');setSize('');setPrice('');}} className="text-xs underline">Clear all</button>}
            </div>

            <div className="p-4 border-b border-neutral-200">
              <p className="text-xs font-bold mb-2">COLOUR</p>
              <div className="space-y-1.5">
                {colourCounts.map(([name, cnt])=>(
                  <label key={name} className="flex items-center gap-2 text-xs cursor-pointer">
                    <input type="radio" name="colour" checked={colour===name} onChange={()=> setColour(colour===name?'':name)} className="accent-black" />
                    <span className="flex-1">{name}</span><span className="text-neutral-500">{cnt}</span>
                  </label>
                ))}
                {colourCounts.length===0 && <p className="text-xs text-neutral-500">No colours</p>}
              </div>
            </div>

            <div className="p-4 border-b border-neutral-200">
              <p className="text-xs font-bold mb-2">SIZE</p>
              <div className="grid grid-cols-3 gap-1.5">
                {['XS','S','M','L','XL','XXL','28','30','32'].map(s=>(
                  <button key={s} onClick={()=> setSize(size===s?'':s)} className={`border py-1.5 text-xs font-bold ${size===s ? 'bg-black text-white border-black' : 'border-neutral-300 hover:border-black'}`}>{s}</button>
                ))}
              </div>
            </div>

            <div className="p-4">
              <p className="text-xs font-bold mb-2">PRICE</p>
              <div className="space-y-1.5 text-xs">
                {[
                  {id:'', label:'All prices'},
                  {id:'under1000', label:'Under ₹1000'},
                  {id:'1000-2000', label:'₹1000 — ₹2000'},
                  {id:'over2000', label:'Over ₹2000'},
                ].map(o=>(
                  <label key={o.id} className="flex items-center gap-2 cursor-pointer"><input type="radio" name="price" checked={price===o.id} onChange={()=> setPrice(o.id)} className="accent-black" />{o.label}</label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {/* toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-3">
            <div className="flex items-center gap-2 text-xs">
              <button onClick={()=> setMobileFiltersOpen(!mobileFiltersOpen)} className="lg:hidden border border-black px-3 py-1.5 font-bold">FILTER</button>
              <span className="hidden sm:inline text-neutral-600">{filtered.length} products</span>
              {(colour||size||price) && <span className="hidden sm:inline bg-black text-white px-2 py-0.5 text-[11px]">{[colour,size,price].filter(Boolean).join(' • ')}</span>}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="hidden sm:inline text-neutral-500">View:</span>
              <div className="hidden sm:flex gap-1">
                {[2,4].map(c=> <button key={c} onClick={()=> setGridCols(c===2?2:4)} className={`w-7 h-7 border flex items-center justify-center ${gridCols===c ? 'bg-black text-white border-black' : 'border-neutral-300'}`}>{c}</button>)}
              </div>
              <select value={sort} onChange={e=>setSort(e.target.value)} className="border border-neutral-300 px-2 py-1.5 bg-white">
                <option value="featured">Most Popular</option>
                <option value="new">New In</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Best Rated</option>
                <option value="discount">Highest Discount</option>
              </select>
            </div>
          </div>

          {/* active chips */}
          {(colour||size||price) && (
            <div className="flex gap-2 py-3 flex-wrap">
              {colour && <span className="border border-black px-2 py-1 text-xs flex items-center gap-2">{colour} <button onClick={()=> setColour('')}>✕</button></span>}
              {size && <span className="border border-black px-2 py-1 text-xs flex items-center gap-2">Size {size} <button onClick={()=> setSize('')}>✕</button></span>}
              {price && <span className="border border-black px-2 py-1 text-xs flex items-center gap-2">{price} <button onClick={()=> setPrice('')}>✕</button></span>}
              <button onClick={()=>{setColour('');setSize('');setPrice('');}} className="text-xs underline">Clear all</button>
            </div>
          )}

          {/* mobile filters drawer */}
          {mobileFiltersOpen && (
            <div className="lg:hidden border border-neutral-200 p-4 mb-4 bg-neutral-50">
              <p className="text-xs font-black mb-3">FILTERS</p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-bold mb-2">Colour</p>
                  {colourCounts.slice(0,5).map(([n])=> <label key={n} className="flex gap-2 py-1"><input type="radio" checked={colour===n} onChange={()=> setColour(colour===n?'':n)} />{n}</label>)}
                </div>
                <div>
                  <p className="font-bold mb-2">Size</p>
                  <div className="grid grid-cols-3 gap-1">{['XS','S','M','L','XL'].map(s=> <button key={s} onClick={()=> setSize(size===s?'':s)} className={`border py-1 ${size===s?'bg-black text-white':''}`}>{s}</button>)}</div>
                </div>
              </div>
              <button onClick={()=> setMobileFiltersOpen(false)} className="w-full mt-3 bg-black text-white py-2 text-xs font-black">APPLY</button>
            </div>
          )}

          {filtered.length===0 ? (
            <div className="py-16 text-center">
              <p className="text-sm font-bold">No products found</p>
              <p className="text-xs text-neutral-500 mt-1">Try adjusting filters or search.</p>
              <Link href="/collection/all" className="inline-block mt-4 border border-black px-6 py-2 text-xs font-black">VIEW ALL PRODUCTS</Link>
            </div>
          ) : (
            <div className={`grid gap-3 pt-4 ${gridCols===2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
              {filtered.map(p=> <ManiKunjProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
      <ManiKunjFooter />
    </div>
  );
}
