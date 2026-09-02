'use client';
import Header from '@/components/Header';
import Footer from '@/components/supermarket/Footer';
import ProductCard from '@/components/supermarket/ProductCard';
import { PRODUCTS } from '@/lib/supermarket/products';
import { useSupermarketStore } from '@/lib/supermarket/store';
import Link from 'next/link';

export default function FavouritesPage() {
  const favs = useSupermarketStore(s=>s.favourites);
  const items = PRODUCTS.filter(p=>favs.includes(p.id));
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-[1440px] mx-auto px-4 py-6">
        <h1 className="text-2xl font-black">Favourites</h1>
        <p className="text-sm text-slate-500 mb-4">{items.length} items</p>
        {items.length===0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <p className="font-bold">No favourites yet</p>
            <p className="text-sm text-slate-500">Tap the heart on any product to save it</p>
            <Link href="/shop" className="inline-flex mt-4 bg-emerald-600 text-white px-6 py-2 rounded-full font-bold">Start shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {items.map(p=> <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
