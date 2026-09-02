'use client';
import { useState } from 'react';
import Header from '@/components/Header';

type Supplier = { id:string; name:string; code:string; email:string; phone:string; leadTime:string; moq:string; products:number };

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id:'sup1', name:'FreshCo Suppliers', code:'FRESHCO', email:'orders@freshco.com.au', phone:'02 9000 1000', leadTime:'2 days', moq:'$500', products: 42 },
    { id:'sup2', name:'Harvest Distributors', code:'HARVEST', email:'supply@harvest.com.au', phone:'03 9000 2000', leadTime:'3 days', moq:'$300', products: 35 },
    { id:'sup3', name:'Aussie Foods', code:'AUSSIE', email:'hello@aussiefoods.au', phone:'07 9000 3000', leadTime:'1 day', moq:'$200', products: 28 },
  ]);
  const [form, setForm] = useState({ name:'', code:'', email:'', phone:'' });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        <h1 className="text-2xl font-black">Suppliers — Catalogue Feeds</h1>
        <p className="text-sm text-slate-500">Connect products to suppliers • CSV/Excel/API/SFTP feeds with approval rules</p>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 mt-4">
          <h3 className="font-bold">Add Supplier</h3>
          <div className="grid md:grid-cols-4 gap-2 mt-2">
            <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Supplier Name" className="border border-slate-200 rounded-xl px-3 py-2 text-sm" />
            <input value={form.code} onChange={e=>setForm({...form, code:e.target.value})} placeholder="Code" className="border border-slate-200 rounded-xl px-3 py-2 text-sm" />
            <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="Email" className="border border-slate-200 rounded-xl px-3 py-2 text-sm" />
            <input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} placeholder="Phone" className="border border-slate-200 rounded-xl px-3 py-2 text-sm" />
          </div>
          <button onClick={()=>{
            if(!form.name) return;
            setSuppliers([...suppliers, { id:`sup${Date.now()}`, name:form.name, code:form.code, email:form.email, phone:form.phone, leadTime:'2 days', moq:'$500', products:0 }]);
            setForm({name:'',code:'',email:'',phone:''});
          }} className="mt-2 bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold">Add Supplier</button>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {suppliers.map(s=>(
            <div key={s.id} className="bg-white rounded-2xl border border-slate-200 p-4">
              <h3 className="font-bold">{s.name} <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">{s.code}</span></h3>
              <p className="text-sm text-slate-600 mt-1">{s.email} • {s.phone}</p>
              <p className="text-xs text-slate-500 mt-1">Lead time {s.leadTime} • MOQ {s.moq} • {s.products} products</p>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 border border-slate-200 py-2 rounded-full text-sm">View Catalogue</button>
                <button className="flex-1 bg-slate-900 text-white py-2 rounded-full text-sm">Import Feed</button>
              </div>
              <p className="text-xs text-slate-500 mt-2">Feed can update: cost_price, availability, barcode, pack_size, RRP, name, status — governed by approval (20% price change → approval)</p>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-4 text-sm">
          <p className="font-bold">Approval Workflow</p>
          <p>Catalog Manager → create/edit • Pricing Manager → prices • Store Manager → local inventory • Marketing → promotions • Super Admin → approve large bulk ops</p>
          <p className="text-xs mt-1">Scheduled changes (e.g. $5.50 → $4.50 Sep 1–8) auto-revert via cron.</p>
        </div>
      </div>
    </div>
  );
}
