'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/supermarket/Footer';
import { useSupermarketStore } from '@/lib/supermarket/store';
import { PRODUCTS } from '@/lib/supermarket/products';
import { Trash2, Plus, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function ListsPage() {
  const lists = useSupermarketStore(s=>s.lists);
  const createList = useSupermarketStore(s=>s.createList);
  const deleteList = useSupermarketStore(s=>s.deleteList);
  const addToCart = useSupermarketStore(s=>s.addToCart);
  const [name, setName] = useState('');

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-[1440px] mx-auto px-4 py-6">
        <h1 className="text-2xl font-black">Shopping Lists</h1>
        <p className="text-sm text-slate-500 mb-4">Create lists and add them to cart in one tap</p>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-2 mb-6">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="New list name (e.g. Weekly Shop)" className="flex-1 border border-slate-200 rounded-full px-4 py-2.5 text-sm" />
          <button onClick={()=>{ if(name.trim()){createList(name); setName('');}}} className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-1"><Plus className="w-4 h-4" />Create</button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map(list=> {
            const items = list.items.map(i=> ({ ...i, product: PRODUCTS.find(p=>p.id===i.productId)}));
            return (
              <div key={list.id} className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{list.name}</h3>
                    <p className="text-xs text-slate-500">{list.items.length} items • updated {new Date(list.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <button onClick={()=>deleteList(list.id)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                  {items.length===0 ? <p className="text-sm text-slate-400">No items yet</p> : items.map(it=>(
                    <div key={it.productId} className="flex items-center gap-2 text-sm">
                      <img src={it.product?.images[0]} alt="" className="w-8 h-8 rounded object-cover" />
                      <span className="flex-1 truncate">{it.product?.name}</span>
                      <span className="font-medium">x{it.quantity}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={()=>{
                    items.forEach(it=> { if(it.product) addToCart(it.product, it.quantity); });
                  }}
                  disabled={items.length===0}
                  className="w-full mt-3 bg-slate-900 disabled:bg-slate-200 text-white py-2.5 rounded-full font-bold flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" /> Add list to cart
                </button>
                <button
                  onClick={()=> {
                    const url = `${window.location.origin}/lists?share=${list.id}`;
                    navigator.clipboard.writeText(url);
                    alert('Link copied: ' + url);
                  }}
                  className="w-full mt-2 border border-slate-200 py-2 rounded-full text-sm font-medium"
                >Share list</button>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
