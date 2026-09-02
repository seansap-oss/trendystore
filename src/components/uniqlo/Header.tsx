'use client';
import Link from 'next/link';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useUniqloStore } from '@/lib/uniqlo/store';
import { useUserStore } from '@/lib/userStore';

export default function UniqloHeader(){
  const cart = useUniqloStore(s=>s.cart);
  const wishlist = useUniqloStore(s=>s.wishlist);
  const session = useUserStore(s=>s.session);
  const logout = useUserStore(s=>s.logout);
  const count = cart.reduce((a,c)=>a+c.quantity,0);
  const [open,setOpen]=useState(false);
  const [q,setQ]=useState('');
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      {/* top utility bar */}
      <div className="hidden md:flex h-7 bg-[#f4f4f4] text-[11px] items-center justify-end gap-4 px-4">
        <Link href="/admin" className="hover:underline font-bold">Admin</Link>
        <span className="text-neutral-400">|</span>
        <span>Help</span>
        <span>Stores</span>
        <span>English • EUR (€)</span>
      </div>
      {/* main header */}
      <div className="max-w-[1420px] mx-auto px-3 sm:px-4 h-[64px] flex items-center gap-4">
        {/* logo - PlanetFashion PF */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="w-[46px] h-[46px] bg-[#e10600] flex flex-col items-center justify-center leading-none shadow-sm">
            <span className="text-white font-black text-[15px] tracking-[0.02em]" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>PF</span>
            <span className="text-white/90 font-bold text-[6px] tracking-[0.18em] -mt-0.5">PLANET</span>
          </div>
          <div className="hidden sm:block leading-none">
            <span className="block text-[20px] font-black tracking-tighter" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>PlanetFashion</span>
            <span className="block text-[9px] tracking-[0.18em] font-bold text-neutral-500 -mt-1">WEAR YOUR PLANET</span>
          </div>
        </Link>

        {/* nav - desktop */}
        <nav className="hidden lg:flex items-center gap-6 ml-6 text-[13px] font-bold tracking-wide" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
          <Link href="/collection/women" className="hover:text-[#e10600]">WOMEN</Link>
          <Link href="/collection/men" className="hover:text-[#e10600]">MEN</Link>
          <Link href="/collection/kids" className="hover:text-[#e10600]">KIDS</Link>
          <Link href="/collection/baby" className="hover:text-[#e10600]">BABY</Link>
        </nav>

        {/* search */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-[560px] flex items-center border border-neutral-300 rounded-none px-3 py-2 gap-2 bg-white">
            <Search className="w-4 h-4 text-neutral-500" />
            <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){ window.location.href='/collection/all?q='+encodeURIComponent(q)}}} placeholder="Search PlanetFashion" className="flex-1 text-sm outline-none placeholder:text-neutral-400" style={{ fontFamily: 'var(--font-inter), sans-serif' }} />
            <Link href={`/collection/all?q=${encodeURIComponent(q)}`} className="text-xs font-bold border border-neutral-900 px-3 py-1 hover:bg-neutral-900 hover:text-white">SEARCH</Link>
          </div>
        </div>

        {/* actions */}
        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
          <Link href="/wishlist" className="relative p-2 hover:bg-neutral-100 hidden sm:flex">
            <Heart className="w-5 h-5" />
            {wishlist.length>0 && <span className="absolute -top-1 -right-1 bg-[#e10600] text-white text-[10px] w-4 h-4 flex items-center justify-center font-bold">{wishlist.length}</span>}
          </Link>
          <Link href="/cart" className="relative p-2 hover:bg-neutral-100 flex items-center gap-1">
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline text-xs font-bold">CART</span>
            {count>0 && <span className="bg-[#e10600] text-white text-[11px] min-w-5 h-5 px-1 flex items-center justify-center font-bold">{count}</span>}
          </Link>
          {session?.loggedIn ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/profile" className="flex items-center gap-1.5 p-2 hover:bg-neutral-100">
                <User className="w-5 h-5" />
                <span className="text-xs font-bold max-w-[80px] truncate">{session.username}</span>
              </Link>
              <button onClick={logout} className="text-xs font-bold border border-neutral-900 px-2 py-1 hover:bg-neutral-900 hover:text-white">LOGOUT</button>
            </div>
          ) : (
            <Link href="/login" className="hidden sm:flex items-center gap-1.5 p-2 hover:bg-neutral-100">
              <User className="w-5 h-5" /><span className="text-xs font-bold">LOGIN</span>
            </Link>
          )}
          <button onClick={()=>setOpen(!open)} className="lg:hidden p-2 border border-neutral-200 ml-1">{open? <X className="w-5 h-5"/>: <Menu className="w-5 h-5"/>}</button>
        </div>
      </div>

      {/* mobile drawer */}
      {open && (
        <div className="lg:hidden border-t border-neutral-200 bg-white">
          <nav className="grid grid-cols-2 gap-2 p-3">
            <Link href="/collection/women" onClick={()=>setOpen(false)} className="p-3 border border-neutral-200 text-sm font-bold text-center">WOMEN</Link>
            <Link href="/collection/men" onClick={()=>setOpen(false)} className="p-3 border border-neutral-200 text-sm font-bold text-center">MEN</Link>
            <Link href="/collection/kids" onClick={()=>setOpen(false)} className="p-3 border border-neutral-200 text-sm font-bold text-center">KIDS</Link>
            <Link href="/collection/baby" onClick={()=>setOpen(false)} className="p-3 border border-neutral-200 text-sm font-bold text-center">BABY</Link>
          </nav>
          <div className="px-3 pb-3 flex gap-2">
            <Link href="/login" onClick={()=>setOpen(false)} className="flex-1 border border-neutral-900 py-2 text-center text-sm font-bold">LOGIN / REGISTER</Link>
            <Link href="/admin" onClick={()=>setOpen(false)} className="flex-1 bg-[#e10600] text-white py-2 text-center text-sm font-bold">ADMIN</Link>
          </div>
        </div>
      )}

      {/* category secondary bar */}
      <div className="hidden lg:flex max-w-[1420px] mx-auto px-4 h-9 items-center gap-5 text-[12px] font-medium border-t border-neutral-100">
        <span className="font-bold" style={{ fontFamily: 'var(--font-space-grotesk)' }}>Categories:</span>
        <Link href="/collection/all" className="hover:underline">All</Link>
        <Link href="/collection/outerwear" className="hover:underline">Outerwear</Link>
        <Link href="/collection/tops" className="hover:underline">Tops</Link>
        <Link href="/collection/bottoms" className="hover:underline">Bottoms</Link>
        <Link href="/collection/dresses" className="hover:underline">Dresses</Link>
        <Link href="/collection/loungewear" className="hover:underline">Loungewear</Link>
        <Link href="/collection/sport-utility" className="hover:underline">Sport Utility</Link>
        <Link href="/collection/accessories" className="hover:underline">Accessories</Link>
        <span className="ml-auto text-[11px] text-neutral-500">Free shipping over €99 • 30 days free returns</span>
      </div>
    </header>
  );
}
