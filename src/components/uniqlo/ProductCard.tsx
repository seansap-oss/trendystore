'use client';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import type { UniqloProduct } from '@/lib/uniqlo/types';
import { useUniqloStore } from '@/lib/uniqlo/store';

export default function ProductCard({ product }: { product: UniqloProduct }){
  const wishlist = useUniqloStore(s=>s.wishlist);
  const toggle = useUniqloStore(s=>s.toggleWishlist);
  const addToCart = useUniqloStore(s=>s.addToCart);
  const isWish = wishlist.includes(product.id);
  const hasDiscount = !!product.compareAtPrice && product.compareAtPrice > product.price;
  return (
    <div className="group bg-white border border-neutral-200 hover:border-neutral-300 flex flex-col">
      <Link href={`/product/${product.id}`} className="relative aspect-[3/4] overflow-hidden bg-neutral-50 block">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        {!product.available || !product.inStock ? (
          <span className="absolute top-2 left-2 bg-neutral-900 text-white text-[10px] font-black px-2 py-1 tracking-widest">SOLD OUT</span>
        ) : hasDiscount ? (
          <span className="absolute top-2 left-2 bg-[#ff0000] text-white text-[10px] font-black px-2 py-1">SALE</span>
        ) : product.isNew ? (
          <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-black px-2 py-1">NEW</span>
        ) : null}
        <button onClick={(e)=>{e.preventDefault(); toggle(product.id);}} className="absolute top-2 right-2 w-7 h-7 bg-white/90 hover:bg-white flex items-center justify-center border border-neutral-200">
          <Heart className={`w-4 h-4 ${isWish ? 'fill-red-500 text-red-500' : 'text-neutral-700'}`} />
        </button>
      </Link>
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div className="flex gap-1">
          {product.colors.slice(0,4).map((c,i)=><span key={i} className="w-3.5 h-3.5 rounded-full border border-neutral-200" style={{ background: c.hex }} title={c.name} />)}
          {product.colors.length>4 && <span className="text-[10px] text-neutral-500 ml-1">+{product.colors.length-4}</span>}
        </div>
        <Link href={`/product/${product.id}`} className="text-[13px] leading-[1.3] font-medium line-clamp-2 hover:underline min-h-[34px]">{product.name}</Link>
        <div className="flex items-baseline gap-2">
          <span className={`text-sm font-black ${hasDiscount ? 'text-[#ff0000]' : 'text-black'}`}>€{product.price.toFixed(2)}</span>
          {hasDiscount && <span className="text-xs text-neutral-400 line-through">€{product.compareAtPrice!.toFixed(2)}</span>}
        </div>
        <div className="flex items-center gap-1 text-[11px] text-neutral-500">
          <span className="text-[#ffa800]">★</span> {product.rating?.toFixed(1)} <span className="text-neutral-400">({product.reviewCount})</span>
          <span className="ml-auto text-[11px]">{product.sizes.slice(0,4).join(', ')}</span>
        </div>
        <button
          onClick={()=>addToCart(product,1,product.sizes[0], product.colors[0]?.name)}
          disabled={!product.available || !product.inStock}
          className="mt-1 w-full border border-neutral-900 py-2 text-xs font-black tracking-widest hover:bg-neutral-900 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {!product.available || !product.inStock ? 'NOT AVAILABLE' : 'ADD TO CART'}
        </button>
      </div>
    </div>
  );
}
