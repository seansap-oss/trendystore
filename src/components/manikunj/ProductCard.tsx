'use client';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { useUniqloStore } from '@/lib/uniqlo/store';
import type { UniqloProduct } from '@/lib/uniqlo/types';

export default function ManiKunjProductCard({ product, showQuickAdd=true }: { product: UniqloProduct; showQuickAdd?: boolean }){
  const toggleWishlist = useUniqloStore(s=> s.toggleWishlist);
  const wishlist = useUniqloStore(s=> s.wishlist);
  const addToCart = useUniqloStore(s=> s.addToCart);
  const siteSettings = useUniqloStore(s=> s.siteSettings);
  const isWishlisted = wishlist.includes(product.id);
  const [hover, setHover] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [selSize, setSelSize] = useState(product.sizes[0]);
  const [selColor, setSelColor] = useState(product.colors[0]?.name);

  const hasSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPct = hasSale ? Math.round((1 - product.price / product.compareAtPrice!) * 100) : 0;

  return (
    <div className="group relative bg-white" onMouseEnter={()=> setHover(true)} onMouseLeave={()=> { setHover(false); setQuickOpen(false); }}>
      {/* image */}
      <Link href={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-neutral-100 border border-neutral-200">
        <img
          src={hover && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition duration-700"
          loading="lazy"
        />
        {/* badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {product.isNew && <span className="bg-black text-white text-[10px] font-black px-2 py-1 tracking-widest">NEW</span>}
          {hasSale && <span className="bg-[#ff4d6d] text-white text-[10px] font-black px-2 py-1">{discountPct}% OFF</span>}
          {product.badge && !hasSale && <span className="bg-black text-white text-[10px] font-black px-2 py-1">{product.badge}</span>}
          {!product.inStock && <span className="bg-neutral-600 text-white text-[10px] font-bold px-2 py-1">SOLD OUT</span>}
        </div>
        {/* wishlist */}
        <button
          onClick={(e)=>{ e.preventDefault(); toggleWishlist(product.id); }}
          className={`absolute top-2 right-2 w-8 h-8 flex items-center justify-center border ${isWishlisted ? 'bg-black text-white border-black' : 'bg-white text-black border-neutral-200 hover:bg-black hover:text-white'}`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>
        {/* quick add overlay desktop */}
        {showQuickAdd && product.inStock && product.available && (
          <div className={`hidden lg:flex absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-neutral-200 p-2 gap-1 ${hover || quickOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'} transition`}>
            {!quickOpen ? (
              <button onClick={(e)=>{ e.preventDefault(); setQuickOpen(true); }} className="flex-1 bg-black text-white py-2 text-xs font-black tracking-widest hover:bg-neutral-900 flex items-center justify-center gap-1">
                <ShoppingBag className="w-3.5 h-3.5" /> QUICK ADD
              </button>
            ) : (
              <div className="flex-1 space-y-2">
                <div className="flex gap-1 flex-wrap">
                  {product.sizes.slice(0,6).map(sz=>(
                    <button key={sz} onClick={(e)=>{ e.preventDefault(); setSelSize(sz);}} className={`text-xs px-2 py-1 border font-bold ${selSize===sz ? 'bg-black text-white border-black' : 'bg-white border-neutral-300 hover:border-black'}`}>{sz}</button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={(e)=>{ e.preventDefault(); addToCart(product, 1, selSize, selColor); setQuickOpen(false); }} className="flex-1 bg-black text-white py-2 text-xs font-black">ADD TO BAG</button>
                  <button onClick={(e)=>{ e.preventDefault(); setQuickOpen(false); }} className="px-3 border border-neutral-300 text-xs font-bold">✕</button>
                </div>
              </div>
            )}
          </div>
        )}
      </Link>

      {/* info */}
      <div className="pt-2.5 pb-1">
        <Link href={`/product/${product.id}`} className="block">
          <p className="text-[13px] font-medium leading-tight line-clamp-2 min-h-[34px] group-hover:underline">{product.name}</p>
        </Link>
        <div className="flex items-baseline gap-2 mt-1">
          <span className={`text-sm font-bold ${hasSale ? 'text-[#ff4d6d]' : 'text-black'}`}>{siteSettings.currencySymbol}{product.price.toLocaleString('en-IN')}</span>
          {hasSale && <span className="text-xs text-neutral-500 line-through">{siteSettings.currencySymbol}{product.compareAtPrice!.toLocaleString('en-IN')}</span>}
        </div>
        {product.colors.length>1 && (
          <div className="flex items-center gap-1.5 mt-1.5">
            {product.colors.slice(0,5).map(c=>(
              <span key={c.name} title={c.name} className="w-4 h-4 rounded-full border border-neutral-200" style={{ background: c.hex }} />
            ))}
            {product.colors.length>5 && <span className="text-[11px] text-neutral-500">+{product.colors.length-5}</span>}
          </div>
        )}
        {/* mobile quick add */}
        {showQuickAdd && product.inStock && (
          <button onClick={()=> addToCart(product,1, selSize, selColor)} className="lg:hidden mt-2 w-full border border-black py-2 text-xs font-black tracking-widest hover:bg-black hover:text-white">ADD TO BAG</button>
        )}
      </div>
    </div>
  );
}
