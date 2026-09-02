'use client';
import Link from 'next/link';
import { Music2, Heart } from 'lucide-react';
import { useUniqloStore } from '@/lib/uniqlo/store';
import { useState } from 'react';

export default function ManiKunjFooter(){
  const siteSettings = useUniqloStore(s=> s.siteSettings);
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const links = siteSettings.footerLinks || [];
  return (
    <footer className="bg-[#111111] text-white mt-8">
      {/* newsletter - editable via Admin → Site */}
      {siteSettings.newsletterEnabled && (
        <div className="border-b border-white/10">
          <div className="max-w-[1440px] mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div>
              <p className="text-sm font-black tracking-widest">{siteSettings.newsletterTitle || 'JOIN MANIKUNJ REWARDS'}</p>
              <p className="text-xs text-white/70 mt-1">{siteSettings.newsletterSubtitle || 'Get 10% off your first order, early access to sales & earn points.'}</p>
            </div>
            <div className="flex gap-2 w-full lg:w-auto">
              <input value={email} onChange={e=> setEmail(e.target.value)} placeholder="Enter your email" className="flex-1 lg:w-[320px] px-4 py-3 text-sm bg-white text-black placeholder:text-neutral-500 outline-none" />
              <button onClick={()=>{ if(email.includes('@')){ setDone(true); setEmail(''); setTimeout(()=>setDone(false),3000); }}} className="bg-white text-black px-6 py-3 text-xs font-black tracking-widest border border-white hover:bg-black hover:text-white hover:border-white transition">
                {done ? 'THANKS!' : (siteSettings.newsletterButtonLabel || 'JOIN NOW')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-4 py-10 grid grid-cols-2 lg:grid-cols-5 gap-8">
        {links.map(col=>(
          <div key={col.title}>
            <p className="text-[11px] font-black tracking-widest text-white/90 mb-3">{col.title}</p>
            <div className="space-y-2">
              {col.links.map(l=> <Link key={l.label} href={l.href} className="block text-xs text-white/70 hover:text-white hover:underline">{l.label}</Link>)}
            </div>
          </div>
        ))}
        <div className="col-span-2 lg:col-span-2">
          <p className="text-[11px] font-black tracking-widest mb-3">CONNECT</p>
          <div className="flex gap-3">
            <a href={siteSettings.socialLinks?.find(s=>s.platform==='instagram')?.url} target="_blank" className="w-9 h-9 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black text-xs font-bold">IG</a>
            <a href={siteSettings.socialLinks?.find(s=>s.platform==='facebook')?.url} target="_blank" className="w-9 h-9 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black text-xs font-bold">FB</a>
            <a href={siteSettings.socialLinks?.find(s=>s.platform==='tiktok')?.url} target="_blank" className="w-9 h-9 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black"><Music2 className="w-4 h-4" /></a>
          </div>
          <div className="mt-6 space-y-1 text-xs text-white/60">
            <p>{siteSettings.address}</p>
            <p>{siteSettings.supportEmail} • {siteSettings.supportPhone}</p>
          </div>
          <div className="mt-6 flex gap-2 items-center">
            <span className="text-[11px] font-bold text-white/80">We accept:</span>
            <span className="text-[10px] border border-white/20 px-2 py-1">VISA</span>
            <span className="text-[10px] border border-white/20 px-2 py-1">MC</span>
            <span className="text-[10px] border border-white/20 px-2 py-1">UPI</span>
            <span className="text-[10px] border border-white/20 px-2 py-1">COD</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 py-4 flex flex-col md:flex-row gap-3 justify-between items-center text-[11px] text-white/60">
          <p>© {new Date().getFullYear()} {siteSettings.brandName} — {siteSettings.brandName} Fashion Pvt Ltd. All rights reserved. Not affiliated with Cotton On.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:text-white hover:underline">Terms</Link>
            <Link href="/admin" className="hover:text-white hover:underline">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
