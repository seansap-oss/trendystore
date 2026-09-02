'use client';
import Link from 'next/link';
import { Search, ShoppingBag, Heart, User, Menu, X, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useUniqloStore } from '@/lib/uniqlo/store';
import { useUserStore } from '@/lib/userStore';
import MegaMenu from './MegaMenu';
import AnnouncementBar from './AnnouncementBar';

export default function ManiKunjHeader(){
  const cart = useUniqloStore(s=> s.cart);
  const wishlist = useUniqloStore(s=> s.wishlist);
  const nav = useUniqloStore(s=> s.navigation);
  const siteSettings = useUniqloStore(s=> s.siteSettings);
  const session = useUserStore(s=> s.session);
  const logout = useUserStore(s=> s.logout);
  const count = cart.reduce((a,c)=>a+c.quantity,0);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const products = useUniqloStore(s=> s.products);
  const filtered = q.length>=2 ? products.filter(p=> p.name.toLowerCase().includes(q.toLowerCase())).slice(0,5) : [];

  return (
    <header className={`${siteSettings.headerStyle==='sticky' ? 'sticky top-0' : ''} z-40 bg-white`}>
      <AnnouncementBar />
      {/* utility */}
      <div className="hidden md:flex h-7 bg-[#fafafa] text-[11px] items-center justify-between px-4 border-b border-neutral-100">
        <div className="flex items-center gap-4 text-neutral-600">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Find a Store</span>
          <span>Help</span>
          <span>Gift Cards</span>
        </div>
        <div className="flex items-center gap-4 font-medium">
          <Link href="/admin" className="hover:underline font-bold">Admin CMS</Link>
          <span className="text-neutral-300">|</span>
          <span>EN • {siteSettings.currency} ({siteSettings.currencySymbol})</span>
        </div>
      </div>

      {/* main */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 h-[56px] sm:h-[64px] flex items-center gap-3 sm:gap-6">
        {/* logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-[42px] h-[42px] bg-black text-white flex flex-col items-center justify-center leading-none">
            <span className="font-black text-[16px] tracking-[0.05em]">MK</span>
            <span className="text-[6px] tracking-[0.22em] font-bold text-white/90 -mt-0.5">MANIKUNJ</span>
          </div>
          <div className="hidden lg:block leading-none">
            <span className="block text-[20px] font-black tracking-tighter" style={{ fontFamily:'var(--font-space-grotesk), sans-serif' }}>{siteSettings.brandName}</span>
            <span className="block text-[9px] tracking-[0.2em] font-bold text-neutral-500 -mt-0.5">WEAR YOUR STORY</span>
          </div>
        </Link>

        {/* desktop nav */}
        <nav className="hidden lg:flex items-center gap-6 ml-2"
          onMouseLeave={()=> setMega(null)}
        >
          {nav.filter(n=> n.isActive).map(item=>(
            <div key={item.id} className="relative py-4" onMouseEnter={()=> setMega(item.id)}>
              <Link href={item.href} className="text-[13px] font-black tracking-widest hover:opacity-70 flex items-center gap-1.5">
                {item.label}
                {item.badge && <span className="text-[10px] px-1.5 py-0.5 text-white font-black" style={{ background: item.badgeColor || '#111' }}>{item.badge}</span>}
              </Link>
            </div>
          ))}
        </nav>

        {/* search - desktop */}
        <div className="flex-1 hidden sm:flex justify-center">
          <div className="relative w-full max-w-[480px]">
            <div className="flex items-center border border-neutral-300 px-3 py-2 gap-2 bg-white">
              <Search className="w-4 h-4 text-neutral-500" />
              <input
                value={q}
                onChange={e=> { setQ(e.target.value); setSearchOpen(e.target.value.length>=2); }}
                onFocus={()=> q.length>=2 && setSearchOpen(true)}
                onBlur={()=> setTimeout(()=> setSearchOpen(false), 200)}
                onKeyDown={e=>{ if(e.key==='Enter'){ window.location.href='/collection/all?q='+encodeURIComponent(q)} }}
                placeholder="Search"
                className="flex-1 text-sm outline-none placeholder:text-neutral-400"
              />
              {q && <button onClick={()=>{setQ(''); setSearchOpen(false);}} className="text-xs text-neutral-500">✕</button>}
            </div>
            {searchOpen && filtered.length>0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-neutral-200 shadow-lg mt-1 z-50">
                <div className="p-2 text-xs font-bold text-neutral-500">PRODUCTS</div>
                {filtered.map(p=>(
                  <Link key={p.id} href={`/product/${p.id}`} className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-50 border-t border-neutral-100">
                    <img src={p.images[0]} alt={p.name} className="w-10 h-12 object-cover border border-neutral-200" />
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{p.name}</p><p className="text-xs text-neutral-600">{siteSettings.currencySymbol}{p.price}</p></div>
                  </Link>
                ))}
                <Link href={`/collection/all?q=${encodeURIComponent(q)}`} className="block text-center py-2 text-xs font-black border-t border-neutral-200 hover:bg-neutral-900 hover:text-white">VIEW ALL RESULTS</Link>
              </div>
            )}
          </div>
        </div>

        {/* actions */}
        <div className="flex items-center gap-0.5 sm:gap-2 flex-shrink-0">
          <button onClick={()=> setSearchOpen(v=>!v)} className="sm:hidden p-2"><Search className="w-5 h-5" /></button>
          <Link href="/wishlist" className="relative p-2 hover:bg-neutral-100 hidden sm:flex"><Heart className="w-5 h-5" />{wishlist.length>0 && <span className="absolute -top-0.5 -right-0.5 bg-[#ff4d6d] text-white text-[10px] min-w-4 h-4 px-1 flex items-center justify-center font-bold rounded-full">{wishlist.length}</span>}</Link>
          <Link href="/cart" className="relative p-2 hover:bg-neutral-100 flex items-center gap-1">
            <ShoppingBag className="w-5 h-5" /><span className="hidden sm:inline text-xs font-black">BAG</span>{count>0 && <span className="bg-black text-white text-[11px] min-w-5 h-5 px-1 flex items-center justify-center font-bold">{count}</span>}
          </Link>
          {session?.loggedIn ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/profile" className="flex items-center gap-1 p-2 hover:bg-neutral-100"><User className="w-5 h-5" /><span className="text-xs font-bold max-w-[80px] truncate">{session.username}</span></Link>
              <button onClick={logout} className="text-xs font-bold border border-black px-2 py-1 hover:bg-black hover:text-white">LOGOUT</button>
            </div>
          ) : (
            <Link href="/login" className="hidden sm:flex items-center gap-1 p-2 hover:bg-neutral-100"><User className="w-5 h-5" /><span className="text-xs font-bold">LOGIN</span></Link>
          )}
          <button onClick={()=> setOpen(!open)} className="lg:hidden p-2 border border-neutral-200 ml-1">{open ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}</button>
        </div>
      </div>

      {/* mega menu dropdown */}
      {mega && <MegaMenu openId={mega} onClose={()=> setMega(null)} />}

      {/* mobile search bar */}
      {searchOpen && (
        <div className="sm:hidden px-3 pb-3">
          <div className="flex items-center border border-neutral-300 px-3 py-2 gap-2 bg-white">
            <Search className="w-4 h-4 text-neutral-500" />
            <input value={q} onChange={e=> setQ(e.target.value)} placeholder="Search ManiKunj" className="flex-1 text-sm outline-none" autoFocus />
          </div>
          {q.length>=2 && filtered.length>0 && (
            <div className="bg-white border border-neutral-200 mt-1">
              {filtered.map(p=> (
                <Link key={p.id} href={`/product/${p.id}`} className="flex gap-3 p-3 border-b border-neutral-100">
                  <img src={p.images[0]} alt={p.name} className="w-12 h-14 object-cover" />
                  <div><p className="text-sm font-bold">{p.name}</p><p className="text-xs">{siteSettings.currencySymbol}{p.price}</p></div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* mobile drawer */}
      {open && (
        <div className="lg:hidden border-t border-neutral-200 bg-white max-h-[80vh] overflow-auto">
          <nav className="p-3 space-y-1">
            {nav.filter(n=> n.isActive).map(item=>(
              <div key={item.id} className="border border-neutral-200">
                <Link href={item.href} onClick={()=> setOpen(false)} className="flex justify-between items-center p-3 font-black text-sm">
                  {item.label}{item.badge && <span className="text-xs px-2 py-0.5 text-white" style={{background: item.badgeColor||'#111'}}>{item.badge}</span>}
                </Link>
                {item.children && (
                  <div className="px-3 pb-3 grid grid-cols-2 gap-2">
                    {item.children.flatMap(col=> col.children ? col.children : [col]).slice(0,8).map(sub=>(
                      <Link key={sub.id} href={sub.href} onClick={()=> setOpen(false)} className="text-xs py-1 text-neutral-700 hover:underline">{sub.label}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="px-3 pb-4 grid grid-cols-2 gap-2">
            <Link href="/login" onClick={()=> setOpen(false)} className="border border-black py-2.5 text-center text-xs font-black">LOGIN / REGISTER</Link>
            <Link href="/admin" onClick={()=> setOpen(false)} className="bg-black text-white py-2.5 text-center text-xs font-black">ADMIN CMS</Link>
          </div>
          <div className="px-3 pb-4 flex items-center justify-around text-xs">
            <Link href="/wishlist" className="flex flex-col items-center gap-1"><Heart className="w-5 h-5" />Wishlist ({wishlist.length})</Link>
            <Link href="/cart" className="flex flex-col items-center gap-1"><ShoppingBag className="w-5 h-5" />Bag ({count})</Link>
            <Link href="/profile" className="flex flex-col items-center gap-1"><User className="w-5 h-5" />Account</Link>
          </div>
        </div>
      )}

      {/* free delivery strip (siteSettings threshold) */}
      <div className="hidden lg:flex bg-[#fff7ed] border-y border-neutral-200 text-[11px] justify-center items-center gap-6 py-1.5 font-medium">
        <span>Free Standard Delivery over {siteSettings.currencySymbol}{siteSettings.freeShippingThreshold}</span>
        <span className="text-neutral-300">|</span>
        <span>Free Returns — 30 Days</span>
        <span className="text-neutral-300">|</span>
        <span>Pay with UPI • Card • COD</span>
      </div>
    </header>
  );
}
