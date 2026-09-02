'use client';
import { useState } from 'react';
import Link from 'next/link';
import UniqloHeader from '@/components/uniqlo/Header';
import { useUniqloStore } from '@/lib/uniqlo/store';
import { useUserStore } from '@/lib/userStore';
import type { UniqloProduct, UniqloCategory, HeroSection, TickerConfig, Coupon } from '@/lib/uniqlo/types';

function toBase64(file: File): Promise<string> {
  return new Promise((res, rej)=>{
    const r=new FileReader(); r.onload=()=>res(r.result as string); r.onerror=rej; r.readAsDataURL(file);
  });
}

export default function AdminPage(){
  const store=useUniqloStore();
  const users=useUserStore(s=>s.users);
  const orders=store.orders;
  const [tab,setTab]=useState<'hero'|'ticker'|'products'|'categories'|'coupons'|'sections'|'profiles'|'orders'>('hero');

  // hero local
  const hero=store.hero;
  const ticker=store.ticker;

  const [newProd,setNewProd]=useState<Partial<UniqloProduct>>({ name:'', description:'', price:19.90, categoryId: store.categories[0]?.id || '', gender:'UNISEX', sizes:['S','M','L'], colors:[{name:'Black',hex:'#111111'}], images:[] });
  const [editId,setEditId]=useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <UniqloHeader />
      <div className="max-w-[1420px] mx-auto px-3 sm:px-4 py-4">
        <div className="bg-[#e10600] text-white p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3"><div className="w-10 h-10 bg-white text-[#e10600] flex flex-col items-center justify-center leading-none"><span className="font-black text-[14px]">PF</span><span className="font-bold text-[6px] tracking-widest">PLANET</span></div><div><h1 className="font-black text-lg" style={{ fontFamily: 'var(--font-space-grotesk)' }}>PlanetFashion ADMIN</h1><p className="text-xs text-white/90">Hero video/image • Ticker • Sections • Products (price, “not available”, images) • Coupons • Profiles • Orders — UPI/GPay ready.</p></div></div>
          <Link href="/" className="bg-white text-[#e10600] px-4 py-2 text-xs font-black">VIEW STORE</Link>
        </div>

        <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
          {(['hero','ticker','sections','products','categories','coupons','profiles','orders'] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 text-xs font-black border whitespace-nowrap ${tab===t ? 'bg-black text-white border-black' : 'bg-white border-neutral-300'}`}>{t.toUpperCase()}</button>
          ))}
        </div>

        {tab==='hero' && (
          <div className="bg-white border border-neutral-200 p-4 space-y-4">
            <h2 className="font-black">HERO SECTION (Image or Video) — exactly like UNIQLO</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-bold">TYPE</label>
                <select value={hero.type} onChange={e=> store.updateHero({ type: e.target.value as any })} className="w-full border border-neutral-300 px-3 py-2 text-sm">
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>

                <label className="text-xs font-bold">HERO MEDIA (upload image or video)</label>
                <input type="file" accept={hero.type==='video' ? 'video/*' : 'image/*'} onChange={async e=>{
                  const f=e.target.files?.[0]; if(!f) return;
                  if(hero.type==='video'){
                    // for video we create object URL base64 may be large; use data URL
                    const data=await toBase64(f);
                    store.updateHero({ src: data });
                  } else {
                    const data=await toBase64(f);
                    store.updateHero({ src: data });
                  }
                }} className="w-full border border-neutral-300 p-2 text-sm" />
                <p className="text-xs text-neutral-500">Or paste URL:</p>
                <input value={hero.src} onChange={e=> store.updateHero({ src: e.target.value })} placeholder="https://... or /video.mp4" className="w-full border border-neutral-300 px-3 py-2 text-sm" />

                <label className="text-xs font-bold">POSTER (for video)</label>
                <input value={hero.poster || ''} onChange={e=> store.updateHero({ poster: e.target.value })} placeholder="Poster image URL" className="w-full border border-neutral-300 px-3 py-2 text-sm" />

                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-xs font-bold">TITLE</label><input value={hero.title} onChange={e=> store.updateHero({ title: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" /></div>
                  <div><label className="text-xs font-bold">CTA LABEL</label><input value={hero.ctaLabel || ''} onChange={e=> store.updateHero({ ctaLabel: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" /></div>
                </div>
                <label className="text-xs font-bold">SUBTITLE</label><textarea value={hero.subtitle || ''} onChange={e=> store.updateHero({ subtitle: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" rows={2} />
                <label className="text-xs font-bold">CTA LINK</label><input value={hero.ctaLink || ''} onChange={e=> store.updateHero({ ctaLink: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-xs font-bold">ALIGNMENT</label><select value={hero.alignment || 'left'} onChange={e=> store.updateHero({ alignment: e.target.value as any })} className="w-full border border-neutral-300 px-3 py-2 text-sm"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></div>
                  <div><label className="text-xs font-bold">OVERLAY</label><input type="range" min={0} max={0.8} step={0.05} value={hero.overlayOpacity ?? 0.35} onChange={e=> store.updateHero({ overlayOpacity: parseFloat(e.target.value)})} className="w-full" /></div>
                </div>
                <label className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={hero.isActive} onChange={e=> store.updateHero({ isActive: e.target.checked })} /> Active</label>
              </div>
              <div>
                <p className="text-xs font-bold mb-2">PREVIEW</p>
                <div className="relative h-[300px] overflow-hidden border border-neutral-200 bg-neutral-100">
                  {hero.type==='video' ? <video src={hero.src} poster={hero.poster} autoPlay loop muted playsInline className="w-full h-full object-cover" /> : <img src={hero.src} alt="" className="w-full h-full object-cover" />}
                  <div className="absolute inset-0" style={{ background:`rgba(0,0,0,${hero.overlayOpacity ?? 0.35})`}} />
                  <div className="absolute bottom-4 left-4 right-4 text-white"><p className="font-black">{hero.title}</p><p className="text-xs">{hero.subtitle}</p>{hero.ctaLabel && <span className="inline-block mt-2 bg-white text-black px-3 py-1 text-xs font-black">{hero.ctaLabel}</span>}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab==='ticker' && (
          <div className="bg-white border border-neutral-200 p-4 space-y-3">
            <h2 className="font-black">TICKER (running text just below header)</h2>
            <p className="text-xs text-neutral-500">Enable to show special promos running across the top — exactly as requested.</p>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={ticker.enabled} onChange={e=> store.updateTicker({ enabled: e.target.checked })} /> Enabled</label>
            <label className="text-xs font-bold">TEXT (will loop)</label>
            <textarea value={ticker.text} onChange={e=> store.updateTicker({ text: e.target.value })} rows={2} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
            <div className="grid grid-cols-3 gap-2">
              <div><label className="text-xs font-bold">BG COLOR</label><input type="color" value={ticker.bgColor} onChange={e=> store.updateTicker({ bgColor: e.target.value })} className="w-full h-10 border border-neutral-300" /></div>
              <div><label className="text-xs font-bold">TEXT COLOR</label><input type="color" value={ticker.textColor} onChange={e=> store.updateTicker({ textColor: e.target.value })} className="w-full h-10 border border-neutral-300" /></div>
              <div><label className="text-xs font-bold">SPEED (sec)</label><input type="number" value={ticker.speed} onChange={e=> store.updateTicker({ speed: Number(e.target.value)})} className="w-full border border-neutral-300 px-3 py-2 text-sm" /></div>
            </div>
            <label className="text-xs font-bold">LINK (optional)</label><input value={ticker.link || ''} onChange={e=> store.updateTicker({ link: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
            <div className="border border-neutral-200 p-2" style={{ background: ticker.bgColor, color: ticker.textColor }}><p className="text-xs font-bold">{ticker.text}</p></div>
          </div>
        )}

        {tab==='sections' && (
          <div className="bg-white border border-neutral-200 p-4 space-y-3">
            <h2 className="font-black">SECTION PHOTOS (all sections editable)</h2>
            <p className="text-xs text-neutral-500">These are the 4 category tiles on homepage + any future sections. Upload new image or change link.</p>
            <div className="grid md:grid-cols-2 gap-3">
              {store.sections.map(sec=>(
                <div key={sec.id} className="border border-neutral-200 p-3 space-y-2">
                  <img src={sec.image} alt={sec.title} className="w-full h-40 object-cover border border-neutral-200" />
                  <input value={sec.title} onChange={e=> store.updateSection(sec.id, { title: e.target.value })} className="w-full border border-neutral-300 px-2 py-1 text-sm" placeholder="Title" />
                  <input value={sec.image} onChange={e=> store.updateSection(sec.id, { image: e.target.value })} className="w-full border border-neutral-300 px-2 py-1 text-sm" placeholder="Image URL" />
                  <input type="file" accept="image/*" onChange={async e=>{ const f=e.target.files?.[0]; if(!f) return; const d=await toBase64(f); store.updateSection(sec.id,{ image: d });}} className="w-full text-xs" />
                  <input value={sec.link} onChange={e=> store.updateSection(sec.id, { link: e.target.value })} className="w-full border border-neutral-300 px-2 py-1 text-sm" placeholder="Link" />
                  <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={sec.isActive} onChange={e=> store.updateSection(sec.id,{ isActive: e.target.checked })} /> Active</label>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='products' && (
          <div className="bg-white border border-neutral-200 p-4 space-y-4">
            <h2 className="font-black">PRODUCTS — upload images, change price, “not available”, discounts</h2>

            {/* add new */}
            <div className="border border-neutral-900 p-3 bg-[#fffbeb]">
              <p className="font-bold text-sm">ADD NEW PRODUCT</p>
              <div className="grid md:grid-cols-3 gap-2 mt-2">
                <input placeholder="Name" value={newProd.name || ''} onChange={e=> setNewProd({...newProd, name:e.target.value})} className="border border-neutral-300 px-2 py-2 text-sm" />
                <input type="number" placeholder="Price" value={newProd.price ?? ''} onChange={e=> setNewProd({...newProd, price: parseFloat(e.target.value)})} className="border border-neutral-300 px-2 py-2 text-sm" />
                <input type="number" placeholder="Compare at (sale)" value={(newProd as any).compareAtPrice || ''} onChange={e=> setNewProd({...newProd, compareAtPrice: parseFloat(e.target.value) as any})} className="border border-neutral-300 px-2 py-2 text-sm" />
                <select value={newProd.categoryId} onChange={e=> setNewProd({...newProd, categoryId:e.target.value})} className="border border-neutral-300 px-2 py-2 text-sm">
                  {store.categories.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select value={newProd.gender} onChange={e=> setNewProd({...newProd, gender: e.target.value as any})} className="border border-neutral-300 px-2 py-2 text-sm">
                  <option value="WOMEN">WOMEN</option><option value="MEN">MEN</option><option value="KIDS">KIDS</option><option value="BABY">BABY</option><option value="UNISEX">UNISEX</option>
                </select>
                <input placeholder="Image URL (or upload below)" value={(newProd.images?.[0] || '')} onChange={e=> setNewProd({...newProd, images:[e.target.value]})} className="border border-neutral-300 px-2 py-2 text-sm" />
              </div>
              <input type="file" accept="image/*" onChange={async e=>{ const f=e.target.files?.[0]; if(!f) return; const d=await toBase64(f); setNewProd({...newProd, images:[d]});}} className="mt-2 text-xs" />
              <textarea placeholder="Description" value={newProd.description || ''} onChange={e=> setNewProd({...newProd, description:e.target.value})} className="w-full border border-neutral-300 px-2 py-2 text-sm mt-2" rows={2} />
              <button onClick={()=>{
                if(!newProd.name || !newProd.price) return alert('Name & price required');
                const id='p'+Date.now().toString(36);
                const slug=newProd.name!.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-'+id;
                const prod: UniqloProduct = {
                  id, slug, name: newProd.name!, description: newProd.description || '', categoryId: newProd.categoryId!, gender: (newProd.gender as any) || 'UNISEX',
                  price: newProd.price!, compareAtPrice: (newProd as any).compareAtPrice,
                  images: newProd.images && newProd.images[0] ? newProd.images as string[] : ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
                  colors: newProd.colors || [{name:'Black',hex:'#111'}],
                  sizes: newProd.sizes || ['S','M','L'],
                  inStock:true, available:true, createdAt:Date.now(), updatedAt:Date.now(),
                };
                store.addProduct(prod); setNewProd({ name:'', description:'', price:19.90, categoryId: store.categories[0]?.id, gender:'UNISEX', sizes:['S','M','L'], colors:[{name:'Black',hex:'#111'}], images:[] });
              }} className="mt-3 bg-black text-white px-6 py-2 text-xs font-black">ADD PRODUCT</button>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {store.products.map(p=>(
                <div key={p.id} className="border border-neutral-200 p-3 flex gap-3">
                  <img src={p.images[0]} alt={p.name} className="w-20 h-20 object-cover border border-neutral-200" />
                  <div className="flex-1 min-w-0">
                    {editId===p.id ? (
                      <div className="space-y-2">
                        <input value={p.name} onChange={e=> store.updateProduct(p.id,{ name:e.target.value })} className="w-full border border-neutral-300 px-2 py-1 text-sm" />
                        <div className="grid grid-cols-2 gap-2">
                          <input type="number" value={p.price} onChange={e=> store.updateProduct(p.id,{ price: parseFloat(e.target.value)})} className="border border-neutral-300 px-2 py-1 text-sm" />
                          <input type="number" value={p.compareAtPrice || ''} placeholder="Compare" onChange={e=> store.updateProduct(p.id,{ compareAtPrice: e.target.value ? parseFloat(e.target.value): undefined })} className="border border-neutral-300 px-2 py-1 text-sm" />
                        </div>
                        <input value={p.images[0]} onChange={e=> store.updateProduct(p.id,{ images:[e.target.value] })} className="w-full border border-neutral-300 px-2 py-1 text-sm" />
                        <input type="file" accept="image/*" onChange={async e=>{ const f=e.target.files?.[0]; if(!f) return; const d=await toBase64(f); store.updateProduct(p.id,{ images:[d] });}} className="w-full text-xs" />
                        <textarea value={p.description} onChange={e=> store.updateProduct(p.id,{ description:e.target.value })} className="w-full border border-neutral-300 px-2 py-1 text-sm" rows={2} />
                        <div className="flex gap-2">
                          <button onClick={()=> store.updateProduct(p.id,{ available: !p.available, inStock: !p.available ? false : p.inStock })} className={`px-3 py-1 text-xs font-bold border ${p.available ? 'bg-green-600 text-white border-green-600' : 'bg-red-600 text-white border-red-600'}`}>{p.available ? 'AVAILABLE' : 'NOT AVAILABLE'}</button>
                          <button onClick={()=>setEditId(null)} className="px-3 py-1 text-xs border">Done</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="font-bold text-sm truncate">{p.name}</p>
                        <p className="text-xs text-neutral-500">{p.gender} • {store.categories.find(c=>c.id===p.categoryId)?.name}</p>
                        <p className="text-sm font-black">€{p.price.toFixed(2)} {p.compareAtPrice && <span className="text-xs line-through text-neutral-400 ml-1">€{p.compareAtPrice.toFixed(2)}</span>}</p>
                        <p className={`text-xs font-bold mt-1 ${p.available ? 'text-green-700' : 'text-red-600'}`}>{p.available ? '✓ Available' : '✗ Not Available'}</p>
                        <div className="flex gap-2 mt-2">
                          <button onClick={()=>setEditId(p.id)} className="text-xs border border-neutral-900 px-3 py-1 font-bold">EDIT</button>
                          <button onClick={()=>{ if(confirm('Delete?')) store.deleteProduct(p.id);}} className="text-xs border border-red-600 text-red-600 px-3 py-1 font-bold">DELETE</button>
                          <button onClick={()=> store.updateProduct(p.id,{ available: !p.available })} className="text-xs bg-neutral-100 px-2 py-1">{p.available ? 'Mark unavailable' : 'Mark available'}</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='categories' && (
          <div className="bg-white border border-neutral-200 p-4 space-y-3">
            <h2 className="font-black">CATEGORIES</h2>
            <div className="space-y-2">
              {store.categories.map(c=>(
                <div key={c.id} className="flex items-center gap-2 border border-neutral-200 p-2">
                  <input value={c.name} onChange={e=> store.updateCategory(c.id,{ name:e.target.value })} className="flex-1 border border-neutral-300 px-2 py-1 text-sm" />
                  <select value={c.gender} onChange={e=> store.updateCategory(c.id,{ gender: e.target.value as any })} className="border border-neutral-300 px-2 py-1 text-xs">
                    <option>WOMEN</option><option>MEN</option><option>KIDS</option><option>BABY</option><option>UNISEX</option>
                  </select>
                  <label className="text-xs flex items-center gap-1"><input type="checkbox" checked={c.isActive} onChange={e=> store.updateCategory(c.id,{ isActive:e.target.checked })} />Active</label>
                  <button onClick={()=> store.deleteCategory(c.id)} className="text-xs text-red-600 border border-red-200 px-2 py-1">Delete</button>
                </div>
              ))}
            </div>
            <button onClick={()=>{
              const name=prompt('Category name?'); if(!name) return;
              const gender=prompt('Gender WOMEN/MEN/KIDS/BABY/UNISEX','UNISEX') as any;
              const id='cat_'+Date.now().toString(36); store.addCategory({ id, slug: name.toLowerCase().replace(/[^a-z0-9]+/g,'-'), name, gender: gender || 'UNISEX', sortOrder: store.categories.length+1, isActive:true });
            }} className="bg-black text-white px-4 py-2 text-xs font-black">+ ADD CATEGORY</button>
          </div>
        )}

        {tab==='coupons' && (
          <div className="bg-white border border-neutral-200 p-4 space-y-4">
            <h2 className="font-black text-lg" style={{ fontFamily: 'var(--font-space-grotesk)' }}>COUPONS / DISCOUNT CODE GENERATOR</h2>
            <p className="text-xs text-neutral-500">Generate sale codes (e.g. 10% off) — they apply instantly at checkout (Cart & Checkout). UPI/GPay total updates automatically.</p>

            {/* Generator */}
            <div className="border-2 border-[#e10600] bg-[#fff5f5] p-4">
              <p className="font-black text-sm">GENERATE NEW DISCOUNT COUPON</p>
              <p className="text-xs text-neutral-600">Store having 10% sale? Generate code and it applies to those things from admin price.</p>
              <div className="grid md:grid-cols-4 gap-2 mt-3">
                <input id="gen-code" placeholder="CODE e.g. PLANET10" className="border border-neutral-300 px-3 py-2 text-sm font-mono uppercase" defaultValue="PLANET10" />
                <select id="gen-type" className="border border-neutral-300 px-3 py-2 text-sm" defaultValue="percent">
                  <option value="percent">Percent %</option>
                  <option value="fixed">Fixed €</option>
                  <option value="free_shipping">Free Shipping</option>
                </select>
                <input id="gen-value" type="number" placeholder="Value (10 for 10%)" className="border border-neutral-300 px-3 py-2 text-sm" defaultValue={10} />
                <input id="gen-min" type="number" placeholder="Min basket € (optional)" className="border border-neutral-300 px-3 py-2 text-sm" defaultValue={0} />
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={()=>{
                  const codeEl=document.getElementById('gen-code') as HTMLInputElement;
                  const typeEl=document.getElementById('gen-type') as HTMLSelectElement;
                  const valEl=document.getElementById('gen-value') as HTMLInputElement;
                  const minEl=document.getElementById('gen-min') as HTMLInputElement;
                  let code=codeEl.value.trim().toUpperCase(); if(!code) code='PLANET'+Math.floor(10+Math.random()*90);
                  const type=typeEl.value as any; const value=Number(valEl.value)||10; const minBasket=Number(minEl.value)||0;
                  store.addCoupon({ id:'c'+Date.now().toString(36), code, type, value, minBasket: minBasket||undefined, isActive:true, usedCount:0, description: `${value}${type==='percent'?'%':'€'} off ${minBasket?`over €${minBasket}`:''} — PlanetFashion` });
                  codeEl.value='';
                }} className="bg-[#e10600] text-white px-6 py-2 text-xs font-black tracking-widest">GENERATE CODE</button>
                <button onClick={()=>{
                  const code='SALE'+Math.floor(10+Math.random()*90);
                  store.addCoupon({ id:'c'+Date.now().toString(36), code, type:'percent', value:10, isActive:true, usedCount:0, description:'10% sale — PlanetFashion' });
                }} className="border border-black px-6 py-2 text-xs font-black">QUICK 10% SALE</button>
              </div>
            </div>

            <div className="space-y-2">
              {store.coupons.map(cp=>(
                <div key={cp.id} className="border border-neutral-200 p-3 grid md:grid-cols-7 gap-2 items-center bg-white">
                  <input value={cp.code} onChange={e=> store.updateCoupon(cp.id,{ code: e.target.value.toUpperCase() })} className="border border-neutral-300 px-2 py-1 text-sm font-mono font-bold" />
                  <select value={cp.type} onChange={e=> store.updateCoupon(cp.id,{ type: e.target.value as any })} className="border border-neutral-300 px-2 py-1 text-sm">
                    <option value="percent">Percent %</option><option value="fixed">Fixed €</option><option value="free_shipping">Free Ship</option>
                  </select>
                  <input type="number" value={cp.value} onChange={e=> store.updateCoupon(cp.id,{ value: Number(e.target.value) })} className="border border-neutral-300 px-2 py-1 text-sm" />
                  <input type="number" value={cp.minBasket || 0} onChange={e=> store.updateCoupon(cp.id,{ minBasket: Number(e.target.value) })} className="border border-neutral-300 px-2 py-1 text-sm" placeholder="Min" />
                  <span className="text-xs text-neutral-500">Used {cp.usedCount}x</span>
                  <label className="text-xs flex items-center gap-1 font-bold"><input type="checkbox" checked={cp.isActive} onChange={e=> store.updateCoupon(cp.id,{ isActive: e.target.checked })} />Active</label>
                  <button onClick={()=> store.deleteCoupon(cp.id)} className="text-xs border border-red-200 text-red-600 px-2 py-1 font-bold">Delete</button>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-neutral-500">Checkout validates via <span className="font-mono">calcCartTotals</span> — percent / fixed / free shipping, min basket, active flag. Codes apply from admin price.</p>
          </div>
        )}

        {tab==='profiles' && (
          <div className="bg-white border border-neutral-200 p-4">
            <h2 className="font-black">ALL PROFILES</h2>
            <p className="text-xs text-neutral-500">All user profiles (sign-in database). Managed via login system.</p>
            <div className="mt-3 space-y-2">
              {users.length===0 ? <p className="text-sm text-neutral-500">No profiles yet. Create via /login</p> : users.map(u=>(
                <div key={u.username} className="border border-neutral-200 p-3 flex justify-between items-center">
                  <div><p className="font-bold text-sm">{u.username}</p><p className="text-xs text-neutral-500">Created {new Date(u.createdAt).toLocaleString()}</p></div>
                  <span className="text-xs bg-black text-white px-2 py-1">Profile</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='orders' && (
          <div className="bg-white border border-neutral-200 p-4">
            <h2 className="font-black">ORDERS</h2>
            {orders.length===0 ? <p className="text-sm text-neutral-500 mt-2">No orders yet.</p> : (
              <div className="space-y-2 mt-3">
                {orders.map(o=>(
                  <div key={o.id} className="border border-neutral-200 p-3">
                    <div className="flex justify-between text-xs"><span className="font-mono font-bold">{o.orderNumber}</span><span>{new Date(o.createdAt).toLocaleString()}</span></div>
                    <p className="text-xs text-neutral-500">{o.username} • {o.paymentMethod} • {o.status}</p>
                    <p className="text-sm mt-1">{o.items.map(i=> `${i.quantity}x ${i.product.name}`).join(', ')}</p>
                    <p className="font-black text-sm mt-1">€{o.total.toFixed(2)} {o.couponCode && `(coupon ${o.couponCode})`}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
