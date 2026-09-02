'use client';
import Link from 'next/link';
import { Heart, Plus, Minus, ListPlus } from 'lucide-react';
import type { SupermarketProduct } from '@/lib/supermarket/types';
import { useSupermarketStore } from '@/lib/supermarket/store';
import { useState } from 'react';

export default function ProductCard({ product }: { product: SupermarketProduct }) {
  const addToCart = useSupermarketStore(s=>s.addToCart);
  const updateQty = useSupermarketStore(s=>s.updateQty);
  const cart = useSupermarketStore(s=>s.cart);
  const toggleFav = useSupermarketStore(s=>s.toggleFavourite);
  const favourites = useSupermarketStore(s=>s.favourites);
  const addToList = useSupermarketStore(s=>s.addToList);
  const lists = useSupermarketStore(s=>s.lists);
  const [showLists, setShowLists] = useState(false);

  const cartItem = cart.find(c=>c.product.id===product.id);
  const qty = cartItem?.quantity || 0;
  const isFav = favourites.includes(product.id);
  const price = product.isSpecial && product.specialPrice ? product.specialPrice : product.retailPrice;
  const was = product.isSpecial && product.specialPrice ? product.retailPrice : undefined;
  const saving = was ? was - price : 0;
  const unitPrice = product.pricePerKg ? `$${product.pricePerKg.toFixed(2)}/kg` : `$${product.unitPrice.toFixed(2)} per ${product.packageUnit}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:shadow-lg transition-shadow group relative">
      {/* badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.isSpecial && <span className="bg-red-600 text-white text-xs font-black px-2 py-1 rounded-full">1/2 Price</span>}
        {product.isNew && <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full">New</span>}
        {!product.inStock && <span className="bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded-full">Out of stock</span>}
      </div>
      <button
        onClick={()=>toggleFav(product.id)}
        className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center border ${isFav ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-slate-200 text-slate-400 hover:text-red-500'}`}
        aria-label="Favourite"
      >
        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
      </button>

      <Link href={`/product/${product.slug}`} className="block">
        <div className="aspect-square bg-slate-50 p-4 flex items-center justify-center overflow-hidden">
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
        </div>
      </Link>

      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-slate-500 font-medium">{product.brandName}</p>
        <Link href={`/product/${product.slug}`} className="font-medium text-sm leading-tight line-clamp-2 min-h-[2.5rem] hover:text-emerald-700">{product.name}</Link>
        <p className="text-xs text-slate-500 mt-1">{product.packageSize} • {unitPrice}</p>

        {product.healthStarRating && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[10px] bg-slate-900 text-white px-1.5 py-0.5 rounded font-bold">{product.healthStarRating} ★ Health Star</span>
          </div>
        )}

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-black text-slate-900">${price.toFixed(2)}</span>
          {was && <span className="text-sm text-slate-400 line-through">${was.toFixed(2)}</span>}
          {saving>0 && <span className="text-xs font-bold text-red-600">Save ${saving.toFixed(2)}</span>}
        </div>
        {product.variableWeight && <p className="text-xs text-slate-500">approx. {product.estimatedWeight}kg • ${product.pricePerKg?.toFixed(2)}/kg</p>}

        {/* actions */}
        <div className="mt-3 flex items-center gap-2">
          {qty===0 ? (
            <button
              onClick={()=>addToCart(product,1)}
              disabled={!product.inStock}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-2.5 rounded-full text-sm flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          ) : (
            <div className="flex-1 flex items-center justify-between bg-emerald-600 text-white rounded-full p-1">
              <button onClick={()=>updateQty(product.id, qty-1)} className="w-8 h-8 rounded-full bg-white text-emerald-700 flex items-center justify-center"><Minus className="w-4 h-4" /></button>
              <span className="font-black text-sm">{qty}</span>
              <button onClick={()=>addToCart(product,1)} className="w-8 h-8 rounded-full bg-white text-emerald-700 flex items-center justify-center"><Plus className="w-4 h-4" /></button>
            </div>
          )}
          <div className="relative">
            <button onClick={()=>setShowLists(!showLists)} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              <ListPlus className="w-5 h-5 text-slate-600" />
            </button>
            {showLists && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-20">
                <p className="text-xs font-semibold px-2 py-1">Add to list</p>
                {lists.map(l=>(
                  <button key={l.id} onClick={()=>{addToList(l.id, product.id); setShowLists(false);}} className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl text-sm">{l.name}</button>
                ))}
                <Link href="/lists" className="block text-xs text-emerald-700 font-medium px-2 py-1">Manage lists</Link>
              </div>
            )}
          </div>
        </div>
        {!product.inStock && <p className="text-xs text-red-600 mt-2 font-medium">Unavailable at this store</p>}
      </div>
    </div>
  );
}
