'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';

type PickerOrder = {
  id: string;
  items: any[];
  total: number;
  status: string;
};

export default function PickerPage() {
  const [orders, setOrders] = useState<PickerOrder[]>([]);
  const [store, setStore] = useState('SYD001');
  useEffect(()=> {
    const o = JSON.parse(localStorage.getItem('freshbasket_orders')||'[]');
    setOrders(o);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-black">Picker Interface — Store {store}</h1>
        <p className="text-sm text-slate-500 mb-4">Pick orders, enter actual weights, handle substitutions</p>
        <select value={store} onChange={e=>setStore(e.target.value)} className="border border-slate-200 rounded-xl px-3 py-2 text-sm mb-4">
          <option value="SYD001">Sydney CBD</option>
          <option value="MEL001">Melbourne CBD</option>
          <option value="BNE001">Brisbane City</option>
        </select>

        {orders.length===0 ? <p className="text-sm text-slate-500">No orders assigned to this store yet.</p> : (
          <div className="space-y-4">
            {orders.map(order=>(
              <div key={order.id} className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="flex justify-between">
                  <p className="font-bold text-sm">Order {order.id.slice(-8)} • {order.status}</p>
                  <span className="text-sm font-black">${Number(order.total).toFixed(2)}</span>
                </div>
                <div className="mt-3 space-y-2">
                  {order.items?.map((it:any, idx:number)=>(
                    <div key={idx} className="flex gap-3 p-2 bg-slate-50 rounded-xl">
                      <img src={it.product?.images?.[0]} alt="" className="w-12 h-12 rounded object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{it.product?.name || 'Product'}</p>
                        <p className="text-xs text-slate-500">Qty {it.quantity} {it.product?.variableWeight && `• ${it.product.pricePerKg}/kg`}</p>
                        {it.note && <p className="text-xs bg-amber-100 px-2 py-1 rounded">Note: {it.note}</p>}
                      </div>
                      <div className="flex flex-col gap-1">
                        <button className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-full">Pick</button>
                        <button className="text-xs border border-slate-200 px-3 py-1 rounded-full">Substitute</button>
                        <button className="text-xs border border-red-200 text-red-600 px-3 py-1 rounded-full">Unavailable</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <input placeholder="Actual weight e.g. 0.95kg" className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm" />
                  <button className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold">Complete Picking</button>
                </div>
                <p className="text-xs text-slate-500 mt-2">System recalculates total after entering actual weights. Do not charge above authorised maximum.</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
