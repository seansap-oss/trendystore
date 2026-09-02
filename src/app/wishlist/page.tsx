'use client';
import Link from 'next/link';
import UniqloHeader from '@/components/uniqlo/Header';
import Ticker from '@/components/uniqlo/Ticker';
import ProductCard from '@/components/uniqlo/ProductCard';
import UniqloFooter from '@/components/uniqlo/Footer';
import { useUniqloStore } from '@/lib/uniqlo/store';

export default function WishlistPage(){
  const wishlist=useUniqloStore(s=>s.wishlist);
  const products=useUniqloStore(s=>s.products);
  const list=products.filter(p=> wishlist.includes(p.id));
  return (
    <div className="min-h-screen bg-white">
      <UniqloHeader /><Ticker />
      <div className="max-w-[1420px] mx-auto px-3 sm:px-4 py-6">
        <h1 className="text-xl font-black">WISHLIST ({list.length})</h1>
        {list.length===0 ? <div className="py-16 text-center"><p className="text-sm text-neutral-500">No favorites yet.</p><Link href="/collection/all" className="inline-block mt-4 bg-black text-white px-6 py-2 text-xs font-black">SHOP NOW</Link></div> : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">{list.map(p=> <ProductCard key={p.id} product={p} />)}</div>
        )}
      </div>
      <UniqloFooter />
    </div>
  );
}
