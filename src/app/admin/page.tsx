'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ManiKunjHeader from '@/components/manikunj/Header';
import { useUniqloStore, forceSave, getStorageInfo } from '@/lib/uniqlo/store';
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
  const [tab,setTab]=useState<'hero'|'ticker'|'announcements'|'site'|'products'|'categories'|'coupons'|'sections'|'profiles'|'orders'>('hero');
  const [toast,setToast]=useState<string|null>(null);
  const showToast=(msg:string)=>{ setToast(msg); setTimeout(()=>setToast(null),2500); };
  const [storageInfo,setStorageInfo]=useState<{exists:boolean,size:number,hero:any}|null>(null);

  useEffect(()=>{
    const info=getStorageInfo();
    setStorageInfo(info);
  },[tab]);

  // Auto-save: whenever any store state changes, persist to localStorage as backup
  useEffect(()=>{
    const unsub = useUniqloStore.subscribe(()=>{
      forceSave();
    });
    return unsub;
  },[]);

  // hero draft — edits stay local until Publish
  const hero=store.hero;
  const ticker=store.ticker;
  const [heroDraft,setHeroDraft]=useState<HeroSection>(hero);
  const [tickerDraft,setTickerDraft]=useState<TickerConfig>(ticker);
  const [siteDraft,setSiteDraft]=useState(store.siteSettings);
  const [hasHeroChanges,setHasHeroChanges]=useState(false);
  const [hasTickerChanges,setHasTickerChanges]=useState(false);
  const [hasSiteChanges,setHasSiteChanges]=useState(false);
  useEffect(()=>{ setHeroDraft(hero); },[hero]);
  useEffect(()=>{ setTickerDraft(ticker); },[ticker]);
  useEffect(()=>{ setSiteDraft(store.siteSettings); },[store.siteSettings]);

  const [newProd,setNewProd]=useState<Partial<UniqloProduct>>({ name:'', description:'', price:19.90, categoryId: store.categories[0]?.id || '', gender:'UNISEX', sizes:['S','M','L'], colors:[{name:'Black',hex:'#111111'}], images:[] });
  const [editId,setEditId]=useState<string | null>(null);

  const siteSettings = store.siteSettings;
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <ManiKunjHeader />
      <div className="max-w-[1420px] mx-auto px-3 sm:px-4 py-4">
        <div className="bg-black text-white p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3"><div className="w-10 h-10 bg-white text-black flex flex-col items-center justify-center leading-none"><span className="font-black text-[14px]">MK</span><span className="font-bold text-[6px] tracking-[0.18em]">MANIKUNJ</span></div><div><h1 className="font-black text-lg" style={{ fontFamily: 'var(--font-space-grotesk)' }}>Trendy Store — Admin CMS</h1><p className="text-xs text-white/80">Manage your store: Hero & banners • Sections • Products • Categories • Coupons • Customers • Orders</p></div></div>
          <div className="flex gap-2 flex-wrap items-center">
            <span className="hidden sm:inline bg-white/10 px-3 py-2 text-xs font-bold border border-white/20">{siteSettings.brandName}</span>
            <span className={`hidden sm:inline px-2 py-1 text-[10px] font-bold border ${storageInfo?.exists ? 'bg-green-900 border-green-600 text-green-300' : 'bg-red-900 border-red-600 text-red-300'}`}>
              {storageInfo?.exists ? `STORED ${(storageInfo.size/1024).toFixed(0)}KB` : 'NO STORAGE'}
            </span>
            <button onClick={()=>{ 
              const result=forceSave();
              if(result.ok) showToast(`✓ FORCE SAVED (${(result.size!/1024).toFixed(0)}KB)`);
              else showToast(`✗ Save failed: ${result.error}`);
              setStorageInfo(getStorageInfo());
            }} className="bg-green-600 text-white px-3 py-2 text-xs font-bold border border-green-700">FORCE SAVE</button>
            <button onClick={()=>{ localStorage.removeItem('manikunj-store-v5'); localStorage.removeItem('manikunj-store-v4'); localStorage.removeItem('manikunj-store-v3'); location.reload(); }} className="hidden sm:inline bg-white/20 text-white px-3 py-2 text-xs font-bold border border-white/30">RESET CACHE</button>
            <Link href="/" className="bg-white text-black px-4 py-2 text-xs font-black">VIEW STORE</Link>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
          {(['hero','ticker','announcements','site','sections','products','categories','coupons','profiles','orders'] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)} className={`px-3 py-2 text-[11px] font-black border whitespace-nowrap ${tab===t ? 'bg-black text-white border-black' : 'bg-white border-neutral-300'}`}>{t.toUpperCase()} {t==='announcements'?'• TOP BAR':''} {t==='site'?'• HEADER/FOOTER':''}</button>
          ))}
        </div>
        {toast && <div className="bg-green-600 text-white text-xs font-bold px-4 py-2 mb-3">{toast}</div>}

        {tab==='hero' && (
          <div className="bg-white border border-neutral-200 p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div><h2 className="font-black">HERO SECTION — Title / 10% OFF Editor</h2><p className="text-xs text-neutral-500">Edit draft, preview, then Publish to go live on website & app instantly.</p></div>
              <div className="flex gap-2">
                <button onClick={()=>{ setHeroDraft(hero); setHasHeroChanges(false); showToast('Draft reset'); }} className="border border-neutral-300 px-3 py-1.5 text-xs font-bold">RESET</button>
                <button onClick={()=>{ 
                  const payload = { ...heroDraft, draft:false, publishedAt: Date.now() } as any;
                  store.updateHero(payload);
                  const hs = store.homepageSections.find(s=>s.type==='hero');
                  if(hs) store.updateHomepageSection(hs.id, { title: heroDraft.title, eyebrow: heroDraft.eyebrow, subtitle: heroDraft.subtitle, image: heroDraft.src, mobileImage: heroDraft.mobileSrc, overlayOpacity: heroDraft.overlayOpacity, isActive: heroDraft.isActive });
                  forceSave();
                  setHasHeroChanges(false); showToast('✓ Published — saved & live on website & app'); 
                }} className="bg-black text-white px-5 py-1.5 text-xs font-black">PUBLISH</button>
              </div>
            </div>
            {hasHeroChanges && <p className="text-xs text-amber-600 font-bold">● Unsaved changes — press Publish to go live</p>}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-3 max-h-[70vh] overflow-auto pr-1">
                <label className="text-xs font-bold">TYPE</label>
                <select value={heroDraft.type} onChange={e=> { setHeroDraft({...heroDraft, type: e.target.value as any}); setHasHeroChanges(true); }} className="w-full border border-neutral-300 px-3 py-2 text-sm">
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
                <label className="text-xs font-bold">HERO MEDIA (upload)</label>
                <input type="file" accept={heroDraft.type==='video' ? 'video/*' : 'image/*'} onChange={async e=>{
                  const f=e.target.files?.[0]; if(!f) return; const data=await toBase64(f); setHeroDraft({...heroDraft, src: data}); setHasHeroChanges(true);
                }} className="w-full border border-neutral-300 p-2 text-sm" />
                <input value={heroDraft.src} onChange={e=> { setHeroDraft({...heroDraft, src: e.target.value}); setHasHeroChanges(true); }} placeholder="https://... or /video.mp4" className="w-full border border-neutral-300 px-3 py-2 text-sm" />
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-xs font-bold">TITLE (e.g. 10% OFF)</label><input value={heroDraft.title} onChange={e=> { const v=e.target.value; setHeroDraft({...heroDraft, title: v}); setHasHeroChanges(true); store.updateHero({ title: v }); const hs=store.homepageSections.find(s=>s.type==='hero'); if(hs) store.updateHomepageSection(hs.id,{ title: v }); }} className="w-full border border-neutral-300 px-3 py-2 text-sm" /></div>
                  <div><label className="text-xs font-bold">EYEBROW</label><input value={heroDraft.eyebrow || ''} onChange={e=> { const v=e.target.value; setHeroDraft({...heroDraft, eyebrow: v}); setHasHeroChanges(true); store.updateHero({ eyebrow: v }); const hs=store.homepageSections.find(s=>s.type==='hero'); if(hs) store.updateHomepageSection(hs.id,{ eyebrow: v }); }} className="w-full border border-neutral-300 px-3 py-2 text-sm" /></div>
                </div>
                <label className="text-xs font-bold">SUBTITLE</label><textarea value={heroDraft.subtitle || ''} onChange={e=> { const v=e.target.value; setHeroDraft({...heroDraft, subtitle: v}); setHasHeroChanges(true); store.updateHero({ subtitle: v }); const hs=store.homepageSections.find(s=>s.type==='hero'); if(hs) store.updateHomepageSection(hs.id,{ subtitle: v }); }} className="w-full border border-neutral-300 px-3 py-2 text-sm" rows={2} />
                {/* TYPOGRAPHY PALETTE */}
                <div className="border border-neutral-200 p-3 bg-[#fafafa] space-y-3">
                  <p className="text-xs font-black">TYPOGRAPHY & COLOR PALETTE — Hero Title</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-xs font-bold">Title Color</label><div className="flex gap-1"><input type="color" value={heroDraft.titleColor || '#ffffff'} onChange={e=> { const v=e.target.value; setHeroDraft({...heroDraft, titleColor: v}); setHasHeroChanges(true); store.updateHero({ titleColor: v }); const hs=store.homepageSections.find(s=>s.type==='hero'); if(hs) store.updateHomepageSection(hs.id,{ title: heroDraft.title }); }} className="w-10 h-9 border" /><input value={heroDraft.titleColor || '#ffffff'} onChange={e=> { const v=e.target.value; setHeroDraft({...heroDraft, titleColor: v}); setHasHeroChanges(true); store.updateHero({ titleColor: v }); }} className="flex-1 border px-2 text-xs" /></div></div>
                    <div><label className="text-xs font-bold">Eyebrow Color</label><div className="flex gap-1"><input type="color" value={heroDraft.eyebrowColor || '#ffffff'} onChange={e=> { const v=e.target.value; setHeroDraft({...heroDraft, eyebrowColor: v}); setHasHeroChanges(true); store.updateHero({ eyebrowColor: v }); }} className="w-10 h-9 border" /><input value={heroDraft.eyebrowColor || '#ffffff'} onChange={e=> { const v=e.target.value; setHeroDraft({...heroDraft, eyebrowColor: v}); setHasHeroChanges(true); store.updateHero({ eyebrowColor: v }); }} className="flex-1 border px-2 text-xs" /></div></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-xs font-bold">Subtitle Color</label><div className="flex gap-1"><input type="color" value={heroDraft.subtitleColor || '#ffffff'} onChange={e=> { const v=e.target.value; setHeroDraft({...heroDraft, subtitleColor: v}); setHasHeroChanges(true); store.updateHero({ subtitleColor: v }); }} className="w-10 h-9 border" /><input value={heroDraft.subtitleColor || '#ffffff'} onChange={e=> { const v=e.target.value; setHeroDraft({...heroDraft, subtitleColor: v}); setHasHeroChanges(true); store.updateHero({ subtitleColor: v }); }} className="flex-1 border px-2 text-xs" /></div></div>
                    <div><label className="text-xs font-bold">Accent (first letter) Color</label><div className="flex gap-1"><input type="color" value={heroDraft.titleAccentColor || '#ff4d6d'} onChange={e=> { const v=e.target.value; setHeroDraft({...heroDraft, titleAccentColor: v}); setHasHeroChanges(true); store.updateHero({ titleAccentColor: v }); }} className="w-10 h-9 border" /><label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={!!heroDraft.titleAccentEnabled} onChange={e=> { const v=e.target.checked; setHeroDraft({...heroDraft, titleAccentEnabled: v}); setHasHeroChanges(true); store.updateHero({ titleAccentEnabled: v }); }} /> Enable per-letter</label></div></div>
                  </div>
                  <div><label className="text-xs font-bold">Title Font</label><select value={heroDraft.titleFontFamily || 'Space Grotesk'} onChange={e=> { setHeroDraft({...heroDraft, titleFontFamily: e.target.value}); setHasHeroChanges(true); }} className="w-full border px-2 py-1.5 text-sm">
                    <option>Space Grotesk</option><option>Inter</option><option>Playfair Display</option><option>Dancing Script</option><option>Great Vibes</option><option>Caveat</option><option>Bebas Neue</option><option>Montserrat</option>
                  </select></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-xs font-bold">Title Size ({heroDraft.titleFontSize || 56}px)</label><input type="range" min={20} max={96} value={heroDraft.titleFontSize || 56} onChange={e=> { setHeroDraft({...heroDraft, titleFontSize: Number(e.target.value)}); setHasHeroChanges(true); }} className="w-full" /></div>
                    <div><label className="text-xs font-bold">Weight</label><select value={heroDraft.titleFontWeight || 900} onChange={e=> { setHeroDraft({...heroDraft, titleFontWeight: Number(e.target.value)}); setHasHeroChanges(true); }} className="w-full border px-2 py-1.5 text-sm"><option value={400}>400 Regular</option><option value={600}>600 Semi</option><option value={700}>700 Bold</option><option value={800}>800 ExtraBold</option><option value={900}>900 Black</option></select></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={!!heroDraft.titleItalic} onChange={e=> { setHeroDraft({...heroDraft, titleItalic: e.target.checked}); setHasHeroChanges(true); }} /> Italic / Slant</label>
                    <div><label className="text-xs font-bold">Letter spacing ({heroDraft.titleLetterSpacing ?? -0.04}em)</label><input type="range" min={-0.1} max={0.2} step={0.01} value={heroDraft.titleLetterSpacing ?? -0.04} onChange={e=> { setHeroDraft({...heroDraft, titleLetterSpacing: Number(e.target.value)}); setHasHeroChanges(true); }} className="w-full" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-xs font-bold">Subtitle Font</label><select value={heroDraft.subtitleFontFamily || 'Inter'} onChange={e=> { setHeroDraft({...heroDraft, subtitleFontFamily: e.target.value}); setHasHeroChanges(true); }} className="w-full border px-2 py-1.5 text-sm"><option>Inter</option><option>Space Grotesk</option><option>Playfair Display</option><option>Dancing Script</option><option>Caveat</option><option>Montserrat</option></select></div>
                    <div><label className="text-xs font-bold">Subtitle Size ({heroDraft.subtitleFontSize || 16}px)</label><input type="range" min={10} max={28} value={heroDraft.subtitleFontSize || 16} onChange={e=> { setHeroDraft({...heroDraft, subtitleFontSize: Number(e.target.value)}); setHasHeroChanges(true); }} className="w-full" /></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-xs font-bold">CTA LABEL</label><input value={heroDraft.ctaLabel || ''} onChange={e=> { setHeroDraft({...heroDraft, ctaLabel: e.target.value}); setHasHeroChanges(true); }} className="w-full border px-3 py-2 text-sm" /></div>
                  <div><label className="text-xs font-bold">CTA LINK</label><input value={heroDraft.ctaLink || ''} onChange={e=> { setHeroDraft({...heroDraft, ctaLink: e.target.value}); setHasHeroChanges(true); }} className="w-full border px-3 py-2 text-sm" /></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-xs font-bold">ALIGNMENT</label><select value={heroDraft.alignment || 'center'} onChange={e=> { setHeroDraft({...heroDraft, alignment: e.target.value as any}); setHasHeroChanges(true); }} className="w-full border px-3 py-2 text-sm"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></div>
                  <div><label className="text-xs font-bold">OVERLAY</label><input type="range" min={0} max={0.8} step={0.05} value={heroDraft.overlayOpacity ?? 0.28} onChange={e=> { setHeroDraft({...heroDraft, overlayOpacity: parseFloat(e.target.value)}); setHasHeroChanges(true); }} className="w-full" /></div>
                </div>
                <label className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={heroDraft.isActive} onChange={e=> { setHeroDraft({...heroDraft, isActive: e.target.checked}); setHasHeroChanges(true); }} /> Active</label>
                <div className="flex gap-2 pt-2">
                  <button onClick={()=>{ setHeroDraft({...heroDraft, draft:true}); showToast('Draft saved (not live)'); setHasHeroChanges(false); }} className="flex-1 border border-neutral-900 py-2 text-xs font-bold">SAVE DRAFT</button>
                  <button onClick={()=>{ 
                    const payload = { ...heroDraft, draft:false, publishedAt: Date.now() } as any;
                    store.updateHero(payload);
                    const hs = store.homepageSections.find(s=>s.type==='hero');
                    if(hs) store.updateHomepageSection(hs.id, { title: heroDraft.title, eyebrow: heroDraft.eyebrow, subtitle: heroDraft.subtitle, image: heroDraft.src, mobileImage: heroDraft.mobileSrc, overlayOpacity: heroDraft.overlayOpacity, isActive: heroDraft.isActive });
                    forceSave();
                    setHasHeroChanges(false); showToast('✓ Published — saved & live on website & app'); 
                  }} className="flex-1 bg-black text-white py-2 text-xs font-black">PUBLISH LIVE</button>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold mb-2">LIVE PREVIEW — draft</p>
                <div className="relative h-[340px] overflow-hidden border border-neutral-200 bg-neutral-100">
                  {heroDraft.type==='video' ? <video src={heroDraft.src} poster={heroDraft.poster} autoPlay loop muted playsInline className="w-full h-full object-cover" /> : <img src={heroDraft.src} alt="" className="w-full h-full object-cover" />}
                  <div className="absolute inset-0" style={{ background:`rgba(0,0,0,${heroDraft.overlayOpacity ?? 0.28})`}} />
                  <div className={`absolute inset-0 flex p-6 ${heroDraft.alignment==='center'?'justify-center text-center':heroDraft.alignment==='right'?'justify-end text-right':'justify-start text-left'} items-center`}>
                    <div>
                      {heroDraft.eyebrow && <p style={{ color: heroDraft.eyebrowColor || '#fff', fontFamily: heroDraft.eyebrowFontFamily ? `var(--font-${heroDraft.eyebrowFontFamily.toLowerCase().replace(/\s/g,'')})` : undefined }} className="text-[11px] tracking-[0.2em] font-black mb-2">{heroDraft.eyebrow}</p>}
                      <p style={{
                        color: heroDraft.titleColor || '#fff',
                        fontFamily: `var(--font-${(heroDraft.titleFontFamily||'Space Grotesk').toLowerCase().replace(/\s/g,'')})`,
                        fontSize: `${heroDraft.titleFontSize || 40}px`,
                        fontWeight: heroDraft.titleFontWeight || 900,
                        fontStyle: heroDraft.titleItalic ? 'italic' : undefined,
                        letterSpacing: `${heroDraft.titleLetterSpacing ?? -0.04}em`,
                        lineHeight: 0.9
                      }} className="font-black whitespace-pre-line">
                        {heroDraft.titleAccentEnabled ? heroDraft.title.split(/(\s+)/).map((part,i)=> part.trim()==='' ? <span key={i}>{part}</span> : <span key={i}><span style={{ color: heroDraft.titleAccentColor }}>{part.charAt(0)}</span>{part.slice(1)}</span>) : heroDraft.title}
                      </p>
                      {heroDraft.subtitle && <p style={{ color: heroDraft.subtitleColor || '#fff', fontFamily: heroDraft.subtitleFontFamily ? `var(--font-${heroDraft.subtitleFontFamily.toLowerCase().replace(/\s/g,'')})` : undefined, fontSize: `${heroDraft.subtitleFontSize || 14}px` }} className="mt-2">{heroDraft.subtitle}</p>}
                      {heroDraft.ctaLabel && <span className="inline-block mt-3 bg-white text-black px-3 py-1 text-xs font-black">{heroDraft.ctaLabel}</span>}
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-500 mt-2">Publish to update hero on homepage (`/`), PWA and APK. Draft stays local until publish.</p>
              </div>
            </div>
          </div>
        )}

        {tab==='ticker' && (
          <div className="bg-white border border-neutral-200 p-4 space-y-3">
            <div className="flex justify-between"><div><h2 className="font-black">ANNOUNCEMENT TICKER — Top Bar (tap to change)</h2><p className="text-xs text-neutral-500">This is the scrolling bar under header. Edit text, tap link, colors, then Publish.</p></div>
              <button onClick={()=>{ store.updateTicker(tickerDraft); forceSave(); setHasTickerChanges(false); showToast('✓ Ticker published — live'); }} className="bg-black text-white px-4 py-1.5 text-xs font-black h-fit">PUBLISH</button>
            </div>
            {hasTickerChanges && <p className="text-xs text-amber-600 font-bold">● Unsaved</p>}
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={tickerDraft.enabled} onChange={e=> { setTickerDraft({...tickerDraft, enabled: e.target.checked}); setHasTickerChanges(true); }} /> Enabled</label>
            <label className="text-xs font-bold">TEXT (tap to edit what shows — will loop)</label>
            <textarea value={tickerDraft.text} onChange={e=> { const v=e.target.value; setTickerDraft({...tickerDraft, text: v}); setHasTickerChanges(true); store.updateTicker({ text: v }); }} rows={2} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
            <div className="grid grid-cols-3 gap-2">
              <div><label className="text-xs font-bold">BG COLOR</label><div className="flex gap-1"><input type="color" value={tickerDraft.bgColor} onChange={e=> { const v=e.target.value; setTickerDraft({...tickerDraft, bgColor: v}); setHasTickerChanges(true); store.updateTicker({ bgColor: v }); }} className="w-10 h-9 border" /><input value={tickerDraft.bgColor} onChange={e=> { const v=e.target.value; setTickerDraft({...tickerDraft, bgColor: v}); setHasTickerChanges(true); store.updateTicker({ bgColor: v }); }} className="flex-1 border px-2 text-xs" /></div></div>
              <div><label className="text-xs font-bold">TEXT COLOR</label><div className="flex gap-1"><input type="color" value={tickerDraft.textColor} onChange={e=> { const v=e.target.value; setTickerDraft({...tickerDraft, textColor: v}); setHasTickerChanges(true); store.updateTicker({ textColor: v }); }} className="w-10 h-9 border" /><input value={tickerDraft.textColor} onChange={e=> { const v=e.target.value; setTickerDraft({...tickerDraft, textColor: v}); setHasTickerChanges(true); store.updateTicker({ textColor: v }); }} className="flex-1 border px-2 text-xs" /></div></div>
              <div><label className="text-xs font-bold">SPEED (sec)</label><input type="number" value={tickerDraft.speed} onChange={e=> { setTickerDraft({...tickerDraft, speed: Number(e.target.value)}); setHasTickerChanges(true); }} className="w-full border px-3 py-2 text-sm" /></div>
            </div>
            <label className="text-xs font-bold">LINK (where ticker taps to)</label><input value={tickerDraft.link || ''} onChange={e=> { setTickerDraft({...tickerDraft, link: e.target.value}); setHasTickerChanges(true); }} className="w-full border px-3 py-2 text-sm" placeholder="/collection/all" />
            <div className="border p-2" style={{ background: tickerDraft.bgColor, color: tickerDraft.textColor }}><p className="text-xs font-bold">{tickerDraft.text}</p></div>
            <div className="flex gap-2"><button onClick={()=>{ setTickerDraft(ticker); setHasTickerChanges(false); }} className="border px-3 py-1.5 text-xs">RESET</button><button onClick={()=>{ store.updateTicker(tickerDraft); forceSave(); setHasTickerChanges(false); showToast('✓ Ticker published'); }} className="bg-black text-white px-4 py-1.5 text-xs font-black">SAVE & PUBLISH</button></div>
          </div>
        )}
        {tab==='announcements' && (
          <div className="bg-white border border-neutral-200 p-4 space-y-3">
            <div className="flex justify-between"><div><h2 className="font-black">TOP ANNOUNCEMENT BAR</h2><p className="text-xs text-neutral-500">Rotating bar at very top (FREE DELIVERY, JOIN REWARDS). Tap any row to edit, then Publish.</p></div><button onClick={()=>showToast('✓ Announcements published — live on website & app')} className="bg-black text-white px-4 py-1.5 text-xs font-black h-fit">PUBLISH ALL</button></div>
            {store.announcements.map(a=>(
              <div key={a.id} className="border p-3 space-y-2" style={{ background: a.bgColor, color: a.textColor, borderColor: '#e5e7eb' }}>
                <div className="grid md:grid-cols-2 gap-2">
                  <input value={a.text} onChange={e=> store.updateAnnouncement(a.id, { text: e.target.value })} className="border px-2 py-1.5 text-sm bg-white text-black" placeholder="Desktop text (tap to edit)" />
                  <input value={a.mobileText || ''} onChange={e=> store.updateAnnouncement(a.id, { mobileText: e.target.value })} className="border px-2 py-1.5 text-sm bg-white text-black" placeholder="Mobile text" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex gap-1"><input type="color" value={a.bgColor} onChange={e=> store.updateAnnouncement(a.id, { bgColor: e.target.value })} className="w-8 h-8 border" /><span className="text-xs self-center">BG</span></div>
                  <div className="flex gap-1"><input type="color" value={a.textColor} onChange={e=> store.updateAnnouncement(a.id, { textColor: e.target.value })} className="w-8 h-8 border" /><span className="text-xs self-center">TEXT</span></div>
                  <label className="flex items-center gap-1 text-xs bg-white text-black px-2"><input type="checkbox" checked={a.enabled} onChange={e=> store.updateAnnouncement(a.id, { enabled: e.target.checked })} /> Enabled</label>
                </div>
                <input value={a.link || ''} onChange={e=> store.updateAnnouncement(a.id, { link: e.target.value })} className="w-full border px-2 py-1 text-xs bg-white text-black" placeholder="Link on tap" />
              </div>
            ))}
            <p className="text-xs text-neutral-500">Changes save instantly and appear on website + app (same store). Reorder via priority in code later.</p>
          </div>
        )}
        {tab==='site' && (
          <div className="bg-white border border-neutral-200 p-4 space-y-4">
            <div className="flex justify-between"><div><h2 className="font-black">HEADER & FOOTER — Site Settings</h2><p className="text-xs text-neutral-500">Edit “Join Manikunj” footer, brand name, header promo, then Publish to go live everywhere.</p></div>
              <button onClick={()=>{ store.updateSiteSettings(siteDraft); forceSave(); setHasSiteChanges(false); showToast('✓ Site published — header/footer live on website & app'); }} className="bg-black text-white px-4 py-1.5 text-xs font-black h-fit">PUBLISH</button>
            </div>
            {hasSiteChanges && <p className="text-xs text-amber-600 font-bold">● Unsaved — press Publish</p>}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold">Brand Name (header/footer)</label><input value={siteDraft.brandName} onChange={e=> { setSiteDraft({...siteDraft, brandName: e.target.value}); setHasSiteChanges(true); }} className="w-full border px-3 py-2 text-sm" />
                <label className="text-xs font-bold">Footer — JOIN Title (editable)</label><input value={siteDraft.newsletterTitle || ''} onChange={e=> { setSiteDraft({...siteDraft, newsletterTitle: e.target.value}); setHasSiteChanges(true); }} className="w-full border px-3 py-2 text-sm" placeholder="JOIN MANIKUNJ REWARDS" />
                <label className="text-xs font-bold">Footer — Subtitle</label><textarea value={siteDraft.newsletterSubtitle || ''} onChange={e=> { setSiteDraft({...siteDraft, newsletterSubtitle: e.target.value}); setHasSiteChanges(true); }} className="w-full border px-3 py-2 text-sm" rows={2} />
                <label className="text-xs font-bold">Footer — Button Label</label><input value={siteDraft.newsletterButtonLabel || ''} onChange={e=> { setSiteDraft({...siteDraft, newsletterButtonLabel: e.target.value}); setHasSiteChanges(true); }} className="w-full border px-3 py-2 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold">Header — Promo Text (top ticker press target info)</label><input value={siteDraft.headerPromoText || ''} onChange={e=> { setSiteDraft({...siteDraft, headerPromoText: e.target.value}); setHasSiteChanges(true); }} className="w-full border px-3 py-2 text-sm" />
                <label className="text-xs font-bold">Support Email</label><input value={siteDraft.supportEmail} onChange={e=> { setSiteDraft({...siteDraft, supportEmail: e.target.value}); setHasSiteChanges(true); }} className="w-full border px-3 py-2 text-sm" />
                <label className="text-xs font-bold">Address</label><input value={siteDraft.address} onChange={e=> { setSiteDraft({...siteDraft, address: e.target.value}); setHasSiteChanges(true); }} className="w-full border px-3 py-2 text-sm" />
                <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={siteDraft.newsletterEnabled ?? true} onChange={e=> { setSiteDraft({...siteDraft, newsletterEnabled: e.target.checked}); setHasSiteChanges(true); }} /> Show newsletter footer</label>
              </div>
            </div>
            <div className="flex gap-2"><button onClick={()=>{ setSiteDraft(store.siteSettings); setHasSiteChanges(false); }} className="border px-3 py-1.5 text-xs">RESET</button>              <button onClick={()=>{ store.updateSiteSettings(siteDraft); forceSave(); setHasSiteChanges(false); showToast('✓ Saved & Published — footer/header live'); }} className="bg-black text-white px-5 py-1.5 text-xs font-black">SAVE & PUBLISH LIVE</button></div>
            <div className="border p-3 bg-[#111] text-white"><p className="text-xs font-black">{siteDraft.newsletterTitle || 'JOIN MANIKUNJ REWARDS'}</p><p className="text-xs text-white/70">{siteDraft.newsletterSubtitle}</p></div>
          </div>
        )}

        {tab==='sections' && (
          <div className="bg-white border border-neutral-200 p-4 space-y-3">
            <div className="flex justify-between"><h2 className="font-black">HOMEPAGE SECTIONS</h2><button onClick={()=>showToast('✓ Sections published — live')} className="bg-black text-white px-3 py-1 text-xs font-black h-fit">PUBLISH</button></div>
            <p className="text-xs text-neutral-500">Category tiles and homepage blocks — upload images, change titles and links.</p>
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
            <div className="flex justify-between"><h2 className="font-black">PRODUCTS — upload images, change price, “not available”, discounts</h2><button onClick={()=>showToast('✓ Products published — live on website & app')} className="bg-black text-white px-3 py-1 text-xs font-black h-fit">PUBLISH</button></div>

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
            <div className="flex justify-between"><h2 className="font-black">CATEGORIES</h2><button onClick={()=>showToast('✓ Categories published')} className="bg-black text-white px-3 py-1 text-xs font-black h-fit">PUBLISH</button></div>
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
            <div className="flex justify-between"><h2 className="font-black text-lg" style={{ fontFamily: 'var(--font-space-grotesk)' }}>COUPONS / DISCOUNT CODE GENERATOR</h2><button onClick={()=>showToast('✓ Coupons published — live at checkout')} className="bg-black text-white px-3 py-1 text-xs font-black h-fit">PUBLISH</button></div>
            <p className="text-xs text-neutral-500">Generate sale codes (e.g. 10% off) — they apply instantly at checkout (Cart & Checkout). UPI/GPay total updates automatically.</p>

            {/* Generator */}
            <div className="border-2 border-black bg-[#fafafa] p-4">
              <p className="font-black text-sm">GENERATE NEW DISCOUNT COUPON</p>
              <p className="text-xs text-neutral-600">Create a code — it applies instantly at cart & checkout.</p>
              <div className="grid md:grid-cols-4 gap-2 mt-3">
                <input id="gen-code" placeholder="CODE e.g. TRENDY10" className="border border-neutral-300 px-3 py-2 text-sm font-mono uppercase" defaultValue="TRENDY10" />
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
                  let code=codeEl.value.trim().toUpperCase(); if(!code) code='TRENDY'+Math.floor(10+Math.random()*90);
                  const type=typeEl.value as any; const value=Number(valEl.value)||10; const minBasket=Number(minEl.value)||0;
                  store.addCoupon({ id:'c'+Date.now().toString(36), code, type, value, minBasket: minBasket||undefined, isActive:true, usedCount:0, description: `${value}${type==='percent'?'%':'₹'} off ${minBasket?`over ₹${minBasket}`:''} — Trendy Store` });
                  codeEl.value='';
                }} className="bg-black text-white px-6 py-2 text-xs font-black tracking-widest">GENERATE CODE</button>
                <button onClick={()=>{
                  const code='SALE'+Math.floor(10+Math.random()*90);
                  store.addCoupon({ id:'c'+Date.now().toString(36), code, type:'percent', value:10, isActive:true, usedCount:0, description:'10% sale — Trendy Store' });
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
