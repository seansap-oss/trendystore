'use client';
import Header from '@/components/Header';
import Footer from '@/components/supermarket/Footer';
import ProductCard from '@/components/supermarket/ProductCard';
import { PRODUCTS } from '@/lib/supermarket/products';

// mock order history
const MOCK_BUY_AGAIN = PRODUCTS.slice(0,12);

export default function BuyAgainPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-[1440px] mx-auto px-4 py-6">
        <h1 className="text-2xl font-black">Buy Again</h1>
        <p className="text-sm text-slate-500 mb-4">Based on your previous orders</p>
        <div className="flex gap-2 mb-4">
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold">Recently purchased</button>
          <button className="border border-slate-200 bg-white px-4 py-2 rounded-full text-sm">Frequently purchased</button>
          <button className="border border-slate-200 bg-white px-4 py-2 rounded-full text-sm">On special</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {MOCK_BUY_AGAIN.map(p=> <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
      <Footer />
    </div>
  );
}
