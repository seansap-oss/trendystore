'use client';
import Link from 'next/link';
import { ShoppingCart, Heart, ClipboardList, User, Menu, X, Repeat2, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useSupermarketStore } from '@/lib/supermarket/store';
import SearchBar from './SearchBar';
import LocationSelector from './LocationSelector';
import MegaMenu from './MegaMenu';
import { BRAND } from '@/lib/brand';

export default function SupermarketHeader() {
  const cart = useSupermarketStore(s=>s.cart);
  const favourites = useSupermarketStore(s=>s.favourites);
  const [mobileOpen, setMobileOpen] = useState(false);
  const count = cart.reduce((a,c)=>a+c.quantity,0);
  const total = cart.reduce((a,c)=> {
    const price = c.product.isSpecial && c.product.specialPrice ? c.product.specialPrice : c.product.retailPrice;
    return a + price * c.quantity;
  },0);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      {/* Top header */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 h-[64px] flex items-center gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg">F</div>
          <div className="hidden sm:block">
            <p className="font-black text-lg leading-none tracking-tight text-slate-900">{BRAND.name}</p>
            <p className="text-[10px] text-slate-500 leading-none">Fresh groceries</p>
          </div>
        </Link>

        {/* Location selector */}
        <div className="hidden md:block">
          <LocationSelector />
        </div>

        {/* Search */}
        <div className="flex-1 flex justify-center px-2">
          <SearchBar />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <Link href="/lists" className="hidden lg:flex flex-col items-center px-2 py-1 hover:bg-slate-50 rounded-xl">
            <ClipboardList className="w-5 h-5 text-slate-700" />
            <span className="text-[11px] font-medium">Lists</span>
          </Link>
          <Link href="/buy-again" className="hidden lg:flex flex-col items-center px-2 py-1 hover:bg-slate-50 rounded-xl">
            <Repeat2 className="w-5 h-5 text-slate-700" />
            <span className="text-[11px] font-medium">Buy Again</span>
          </Link>
          <Link href="/favourites" className="hidden sm:flex flex-col items-center px-2 py-1 hover:bg-slate-50 rounded-xl relative">
            <Heart className="w-5 h-5 text-slate-700" />
            {favourites.length>0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{favourites.length}</span>}
            <span className="text-[11px] font-medium hidden lg:block">Favourites</span>
          </Link>
          <Link href="/login" className="flex flex-col items-center px-2 py-1 hover:bg-slate-50 rounded-xl">
            <User className="w-5 h-5 text-slate-700" />
            <span className="text-[11px] font-medium hidden lg:block">Sign in</span>
          </Link>
          <Link href="/cart" className="relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 sm:px-4 py-2.5 rounded-full font-bold text-sm">
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">${total.toFixed(2)}</span>
            {count>0 && <span className="bg-white text-emerald-700 text-xs w-5 h-5 rounded-full flex items-center justify-center font-black">{count}</span>}
          </Link>
          <button onClick={()=>setMobileOpen(!mobileOpen)} className="lg:hidden p-2 hover:bg-slate-100 rounded-xl">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Second level nav — desktop */}
      <div className="hidden lg:flex items-center justify-between max-w-[1440px] mx-auto px-4 border-t border-slate-100">
        <MegaMenu />
        <div className="flex items-center gap-4 text-sm">
          <Link href="/stores" className="font-medium text-slate-700 hover:text-emerald-700 flex items-center gap-1"><MapPin className="w-4 h-4" />Stores</Link>
          <Link href="/rewards" className="font-medium text-slate-700 hover:text-emerald-700">Rewards</Link>
          <Link href="/admin" className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-full">Admin</Link>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-3 max-h-[80vh] overflow-y-auto">
          <LocationSelector />
          <div className="grid grid-cols-2 gap-2">
            <Link href="/lists" onClick={()=>setMobileOpen(false)} className="p-3 bg-slate-50 rounded-xl text-sm font-medium">Lists</Link>
            <Link href="/favourites" onClick={()=>setMobileOpen(false)} className="p-3 bg-slate-50 rounded-xl text-sm font-medium">Favourites</Link>
            <Link href="/stores" onClick={()=>setMobileOpen(false)} className="p-3 bg-slate-50 rounded-xl text-sm font-medium">Stores</Link>
            <Link href="/shop/specials" onClick={()=>setMobileOpen(false)} className="p-3 bg-red-50 text-red-700 rounded-xl text-sm font-bold">Specials</Link>
          </div>
          <div className="space-y-1">
            {['New','Specials','Fruit & Veg','Meat & Seafood','Pantry','Drinks','Bakery','Dairy'].map(n=>(
              <Link key={n} href={`/shop/${n.toLowerCase().replace(/\s+/g,'-')}`} onClick={()=>setMobileOpen(false)} className="block px-3 py-2 hover:bg-slate-50 rounded-xl text-sm">{n}</Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
