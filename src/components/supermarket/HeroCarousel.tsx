'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BANNERS } from '@/lib/supermarket/promotions';

export default function HeroCarousel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(()=> setIdx(i=> (i+1)%BANNERS.length), 5000);
    return ()=> clearInterval(t);
  }, []);
  const b = BANNERS[idx];
  return (
    <div className="relative overflow-hidden rounded-2xl h-[280px] sm:h-[360px]">
      <img src={b.image} alt={b.title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      <div className="relative h-full flex flex-col justify-center p-6 sm:p-10 max-w-xl">
        <span className="inline-flex w-fit bg-white text-slate-900 text-xs font-bold px-3 py-1 rounded-full mb-3">Limited Time</span>
        <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">{b.title}</h2>
        <p className="text-white/90 mt-2 text-sm sm:text-base">{b.description}</p>
        <Link href={b.ctaLink} className="mt-4 inline-flex w-fit bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-full text-sm">{b.ctaLabel}</Link>
      </div>
      <button onClick={()=>setIdx(i=> (i-1+BANNERS.length)%BANNERS.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white"><ChevronLeft className="w-5 h-5" /></button>
      <button onClick={()=>setIdx(i=> (i+1)%BANNERS.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white"><ChevronRight className="w-5 h-5" /></button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {BANNERS.map((_,i)=> <span key={i} className={`w-2 h-2 rounded-full ${i===idx ? 'bg-white' : 'bg-white/50'}`} />)}
      </div>
    </div>
  );
}
