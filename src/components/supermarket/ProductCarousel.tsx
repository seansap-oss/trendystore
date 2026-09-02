'use client';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { SupermarketProduct } from '@/lib/supermarket/types';
import ProductCard from './ProductCard';

export default function ProductCarousel({ title, subtitle, products, cta }: { title: string; subtitle?: string; products: SupermarketProduct[]; cta?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left'|'right') => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir==='left' ? -320 : 320, behavior:'smooth' });
  };
  if (products.length===0) return null;
  return (
    <section className="py-6">
      <div className="flex items-end justify-between mb-3">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
        <div className="hidden sm:flex gap-2">
          <button onClick={()=>scroll('left')} className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50"><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={()=>scroll('right')} className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>
      <div ref={ref} className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-4 px-4">
        {products.map(p=> (
          <div key={p.id} className="flex-shrink-0 w-[170px] sm:w-[200px] snap-start">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
