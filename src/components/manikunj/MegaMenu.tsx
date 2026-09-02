'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useUniqloStore } from '@/lib/uniqlo/store';

export default function MegaMenu({ openId, onClose }: { openId: string | null; onClose: ()=>void }){
  const nav = useUniqloStore(s=> s.navigation);
  const item = nav.find(n=> n.id===openId);
  if(!item || !item.children || item.children.length===0) return null;

  return (
    <div className="absolute left-0 right-0 top-full bg-white border-t border-neutral-200 shadow-xl z-30" onMouseLeave={onClose}>
      <div className="max-w-[1420px] mx-auto px-6 py-8 grid grid-cols-12 gap-8">
        {/* columns */}
        <div className="col-span-9 grid grid-cols-4 gap-8">
          {item.children.map(col=>(
            <div key={col.id}>
              <Link href={col.href} className="text-sm font-black tracking-wide hover:underline flex items-center gap-2">
                {col.label}
                {col.badge && <span className="text-[10px] px-1.5 py-0.5 text-white font-bold" style={{ background: col.badgeColor || '#111' }}>{col.badge}</span>}
              </Link>
              {col.children && col.children.length>0 && (
                <div className="mt-3 space-y-2">
                  {col.children.map(sub=>(
                    <Link key={sub.id} href={sub.href} className="block text-[13px] text-neutral-700 hover:text-black hover:underline">
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
              {!col.children && col.id.includes('trending') && (
                <div className="mt-3 space-y-2 text-[13px] text-neutral-700">
                  <Link href="/collection/all?filter=sale" className="block hover:underline text-[#ff4d6d] font-bold">Sale — 25% OFF</Link>
                  <Link href="/collection/all?sort=new" className="block hover:underline">New Arrivals</Link>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* promo image */}
        <div className="col-span-3">
          <Link href="/collection/all" className="block relative h-[260px] overflow-hidden bg-neutral-100">
            <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=600" alt="Promo" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-xs font-bold tracking-widest">THE FASHION EVENT</p>
              <p className="text-lg font-black">25% OFF SITEWIDE</p>
              <span className="inline-block mt-2 bg-white text-black px-4 py-1.5 text-xs font-black">SHOP NOW</span>
            </div>
          </Link>
          <p className="text-[11px] text-neutral-500 mt-2 text-center">Online exclusive. Ends Sunday.</p>
        </div>
      </div>
    </div>
  );
}
