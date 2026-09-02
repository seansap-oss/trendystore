'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useMemo, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/supermarket/Footer';
import ProductCard from '@/components/supermarket/ProductCard';
import { PRODUCTS } from '@/lib/supermarket/products';
import { DEPARTMENTS } from '@/lib/supermarket/departments';
import { searchProducts } from '@/lib/supermarket/search';
import { useTenantStore } from '@/lib/supermarket/india/tenantStore';
import { searchMaster } from '@/lib/supermarket/india/masterCatalogue';
import { PRODUCT_ALIASES, INDIA_DEPARTMENTS } from '@/lib/supermarket/india/taxonomy';
import { SlidersHorizontal, X } from 'lucide-react';
import Link from 'next/link';

const SORTS = [
  { id:'recommended', label:'Recommended' },
  { id:'price_asc', label:'Price: Low to High' },
  { id:'price_desc', label:'Price: High to Low' },
  { id:'unit_price', label:'Best Unit Price' },
  { id:'alpha', label:'Alphabetical' },
  { id:'newest', label:'Newest' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get('search') || '';
  const deptSlug = searchParams.get('dept') || '';
  const brandFilter = searchParams.get('brand') || '';
  const specialOnly = searchParams.get('special') === '1';
  const dietary = searchParams.get('dietary') || '';
  const sort = searchParams.get('sort') || 'recommended';
  const [showFilters, setShowFilters] = useState(false);
  // Tenant-aware display — preserves approved UI, upgrades data layer
  const tenantDisplay = useTenantStore(s=>s.getDisplayProducts());
  const marketCode = useTenantStore(s=>(s as any).marketCode || 'IN');
  const baseCatalogue = tenantDisplay.length > 0 ? tenantDisplay as any[] : [...PRODUCTS] as any[];
  const deptSource: any[] = marketCode==='IN' ? (INDIA_DEPARTMENTS as any) : (DEPARTMENTS as any);

  const filtered = useMemo(()=> {
    // Search across master + tenant aliases (atta/dal etc) + legacy
    let list: any[] = [];
    if (q) {
      const nq = q.toLowerCase();
      // expand aliases
      let expanded = [nq];
      for (const [k,v] of Object.entries(PRODUCT_ALIASES)) {
        if (nq.includes(k)) expanded.push(...v);
        v.forEach(alias=> { if (nq.includes(alias)) expanded.push(k); });
      }
      const legacy = searchProducts(q) as any[];
      const masterHits = searchMaster(q) as any[];
      // merge tenant display filtered by q/aliases
      const tenantHits = baseCatalogue.filter((p:any) => expanded.some(term => `${p.name} ${p.brandName} ${p.barcode||''} ${p.slug}`.toLowerCase().includes(term)));
      // combine and dedupe by id
      const map = new Map();
      [...tenantHits, ...masterHits.map(m=> baseCatalogue.find(b=>b.id===m.id) || m), ...legacy].forEach((p:any)=> { if(p && p.id) map.set(p.id, p); });
      list = Array.from(map.values());
      if (list.length===0) list = tenantHits.length? tenantHits : legacy;
    } else {
      list = [...baseCatalogue];
    }
    if (deptSlug) {
      const dept = (deptSource as any[]).find((d:any)=>d.slug===deptSlug) || DEPARTMENTS.find(d=>d.slug===deptSlug);
      if (dept) list = list.filter(p=>p.departmentId===dept.id);
    }
    if (brandFilter) list = list.filter(p=>p.brandName===brandFilter);
    if (specialOnly) list = list.filter(p=>p.isSpecial);
    if (dietary) list = list.filter(p=>p.dietaryTags?.includes(dietary as any));
    // sorting
    if (sort==='price_asc') list.sort((a,b)=> (a.isSpecial&&a.specialPrice?a.specialPrice:a.retailPrice) - (b.isSpecial&&b.specialPrice?b.specialPrice:b.retailPrice));
    if (sort==='price_desc') list.sort((a,b)=> (b.isSpecial&&b.specialPrice?b.specialPrice:b.retailPrice) - (a.isSpecial&&a.specialPrice?a.specialPrice:a.retailPrice));
    if (sort==='alpha') list.sort((a,b)=> a.name.localeCompare(b.name));
    if (sort==='newest') list.sort((a,b)=> (b.isNew?1:0)-(a.isNew?1:0));
    return list;
  }, [q, deptSlug, brandFilter, specialOnly, dietary, sort]);

  const setParam = (k:string, v:string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!v) params.delete(k); else params.set(k,v);
    router.push(`/shop?${params.toString()}`);
  };

  const clearAll = () => router.push('/shop');

  const brands = [...new Set(baseCatalogue.map((p:any)=>p.brandName))];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 py-4">
        {/* breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <Link href="/" className="hover:text-slate-700">Home</Link> / <span className="font-medium text-slate-900">Shop</span>
          {q && <span> / Search: “{q}”</span>}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar — desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sticky top-24">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm">Filters</h3>
                <button onClick={clearAll} className="text-xs text-emerald-700 font-medium">Clear all</button>
              </div>

              <p className="text-xs font-semibold text-slate-700 mb-2">Department</p>
              <div className="space-y-1 mb-4">
                {deptSource.filter((d:any)=>(d as any).isActive!==false).slice(0,10).map((d:any)=>(
                  <button key={d.id} onClick={()=>setParam('dept', deptSlug===d.slug?'':d.slug)} className={`w-full text-left px-3 py-2 rounded-xl text-sm ${deptSlug===d.slug ? 'bg-emerald-50 text-emerald-700 font-bold' : 'hover:bg-slate-50'}`}>{d.icon} {d.name}</button>
                ))}
              </div>

              <p className="text-xs font-semibold text-slate-700 mb-2">Brand</p>
              <select value={brandFilter} onChange={e=>setParam('brand', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mb-4">
                <option value="">All brands</option>
                {brands.map(b=> <option key={b} value={b}>{b}</option>)}
              </select>

              <label className="flex items-center gap-2 py-2">
                <input type="checkbox" checked={specialOnly} onChange={e=>setParam('special', e.target.checked ? '1' : '')} className="rounded" />
                <span className="text-sm">Specials only</span>
              </label>
              <label className="flex items-center gap-2 py-2">
                <input type="checkbox" checked={dietary==='Vegan'} onChange={e=>setParam('dietary', e.target.checked ? 'Vegan' : '')} className="rounded" />
                <span className="text-sm">Vegan</span>
              </label>
              <label className="flex items-center gap-2 py-2">
                <input type="checkbox" checked={dietary==='Gluten Free'} onChange={e=>setParam('dietary', e.target.checked ? 'Gluten Free' : '')} className="rounded" />
                <span className="text-sm">Gluten Free</span>
              </label>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1">
            {/* Active filter chips */}
            {(q || deptSlug || brandFilter || specialOnly || dietary) && (
              <div className="flex flex-wrap gap-2 mb-3">
                {q && <span className="inline-flex items-center gap-1 bg-white border border-slate-200 rounded-full px-3 py-1 text-sm">Search: {q} <button onClick={()=>setParam('search','')}><X className="w-4 h-4" /></button></span>}
                {deptSlug && <span className="inline-flex items-center gap-1 bg-white border border-slate-200 rounded-full px-3 py-1 text-sm">{deptSlug} <button onClick={()=>setParam('dept','')}><X className="w-4 h-4" /></button></span>}
                {specialOnly && <span className="inline-flex items-center gap-1 bg-red-50 border border-red-200 rounded-full px-3 py-1 text-sm text-red-700">Specials <button onClick={()=>setParam('special','')}><X className="w-4 h-4" /></button></span>}
                <button onClick={clearAll} className="text-sm text-emerald-700 font-medium">Clear all</button>
              </div>
            )}

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 mb-4 bg-white rounded-2xl border border-slate-200 p-3">
              <p className="text-sm text-slate-600"><span className="font-bold text-slate-900">{filtered.length}</span> products {q && `for “${q}”`}</p>
              <div className="flex items-center gap-2">
                <select value={sort} onChange={e=>setParam('sort', e.target.value)} className="border border-slate-200 rounded-full px-3 py-2 text-sm bg-white">
                  {SORTS.map(s=> <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                <button onClick={()=>setShowFilters(true)} className="lg:hidden flex items-center gap-1 border border-slate-200 rounded-full px-4 py-2 text-sm font-medium"><SlidersHorizontal className="w-4 h-4" /> Filters</button>
              </div>
            </div>

            {filtered.length===0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
                <p className="font-bold text-slate-900">No products found</p>
                <p className="text-sm text-slate-500 mt-1">Try adjusting filters or search for something else</p>
                <Link href="/shop" className="inline-flex mt-4 bg-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold">Clear filters</Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {filtered.map(p=> <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter sheet */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setShowFilters(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Filters</h3>
              <button onClick={()=>setShowFilters(false)}><X className="w-6 h-6" /></button>
            </div>
            <p className="text-xs font-semibold mb-2">Department</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {deptSource.filter((d:any)=>(d as any).isActive!==false).slice(0,8).map((d:any)=>(
                <button key={d.id} onClick={()=>setParam('dept', d.slug)} className={`p-3 rounded-xl border text-sm ${deptSlug===d.slug ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white'}`}>{d.name}</button>
              ))}
            </div>
            <button onClick={()=>setShowFilters(false)} className="w-full bg-slate-900 text-white py-3 rounded-full font-bold">Show {filtered.length} products</button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading shop…</div>}>
      <ShopContent />
    </Suspense>
  );
}
