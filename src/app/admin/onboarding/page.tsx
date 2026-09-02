'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import { useTenantStore } from '@/lib/supermarket/india/tenantStore';
import { MASTER_CATALOGUE } from '@/lib/supermarket/india/masterCatalogue';
import Link from 'next/link';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [storeType, setStoreType] = useState('Standard Indian Supermarket');
  const [starter, setStarter] = useState('standard');
  const tenant = useTenantStore(s=>s.tenantId);
  const bulkEnable = useTenantStore(s=>s.bulkEnable);

  const counts: Record<string,number> = {
    kirana: 1500,
    mini: 3200,
    standard: 4386,
    large: MASTER_CATALOGUE.length,
  };

  const applyStarter = () => {
    const n = counts[starter];
    const ids = MASTER_CATALOGUE.slice(0,n).map(m=>m.id);
    bulkEnable(ids, true);
    // disable rest
    const rest = MASTER_CATALOGUE.slice(n).map(m=>m.id);
    bulkEnable(rest, false);
    setStep(9);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-black">New Supermarket Onboarding</h1>
        <p className="text-sm text-slate-500">Tenant: {tenant} — Master → Tenant → Store (isolated)</p>
        <div className="flex gap-1 mt-3">
          {[1,2,3,4,5,6,7,8,9].map(n=> <div key={n} className={`flex-1 h-2 rounded-full ${step>=n ? 'bg-emerald-600':'bg-slate-200'}`} />)}
        </div>

        {step===1 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mt-4">
            <h3 className="font-bold">Step 1 — Business Details</h3>
            <input placeholder="Store Name" className="w-full border rounded-xl px-3 py-2 mt-2 text-sm" defaultValue="My Kirana Store" />
            <input placeholder="GSTIN" className="w-full border rounded-xl px-3 py-2 mt-2 text-sm" />
            <button onClick={()=>setStep(2)} className="mt-3 bg-emerald-600 text-white px-6 py-2 rounded-full font-bold">Next</button>
          </div>
        )}
        {step===2 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mt-4">
            <h3 className="font-bold">Step 2 — Store Location</h3>
            <input placeholder="Address, City, Pincode" className="w-full border rounded-xl px-3 py-2 mt-2 text-sm" />
            <button onClick={()=>setStep(3)} className="mt-3 bg-emerald-600 text-white px-6 py-2 rounded-full font-bold">Next</button>
          </div>
        )}
        {step===3 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mt-4">
            <h3 className="font-bold">Step 3 — Store Type</h3>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Full Supermarket','Mini Market','Kirana Store','Premium Grocery','Organic Store'].map(t=>(
                <button key={t} onClick={()=>setStoreType(t)} className={`p-3 rounded-xl border text-sm ${storeType===t?'bg-emerald-600 text-white':'bg-white'}`}>{t}</button>
              ))}
            </div>
            <button onClick={()=>setStep(4)} className="mt-3 bg-emerald-600 text-white px-6 py-2 rounded-full font-bold">Next</button>
          </div>
        )}
        {step===4 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mt-4">
            <h3 className="font-bold">Step 4 — Starter Catalogue</h3>
            <div className="space-y-2 mt-2">
              {[
                {id:'kirana', name:'Kirana Essentials', desc:'1,000–2,000 SKUs'},
                {id:'mini', name:'Mini Supermarket', desc:'2,500–4,000 SKUs'},
                {id:'standard', name:'Standard Indian Supermarket', desc:'4,000–8,000 SKUs (recommended, 70% coverage)'},
                {id:'large', name:'Large Supermarket', desc:'Full catalogue'},
              ].map(p=>(
                <label key={p.id} className={`flex items-center gap-3 p-3 rounded-xl border ${starter===p.id?'border-emerald-600 bg-emerald-50':'border-slate-200'}`}>
                  <input type="radio" checked={starter===p.id} onChange={()=>setStarter(p.id)} />
                  <div><p className="font-bold text-sm">{p.name}</p><p className="text-xs text-slate-500">{p.desc}</p></div>
                </label>
              ))}
            </div>
            <button onClick={()=>setStep(5)} className="mt-3 bg-emerald-600 text-white px-6 py-2 rounded-full font-bold">Next</button>
          </div>
        )}
        {step===5 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mt-4">
            <h3 className="font-bold">Step 5 — Choose Departments (ON by default)</h3>
            <p className="text-xs text-slate-500">Uncheck Meat if you don't sell meat — disables category, not master</p>
            <div className="mt-2 space-y-1">
              {['Staples','Dairy','Snacks','Beverages','Meat & Seafood','Pooja Needs'].map(d=>(
                <label key={d} className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> {d}</label>
              ))}
            </div>
            <button onClick={()=>setStep(6)} className="mt-3 bg-emerald-600 text-white px-6 py-2 rounded-full font-bold">Next</button>
          </div>
        )}
        {step===6 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mt-4">
            <h3 className="font-bold">Step 6 — Product Selection: {counts[starter]} available</h3>
            <div className="flex gap-2 mt-2">
              <button onClick={applyStarter} className="flex-1 bg-emerald-600 text-white py-2 rounded-full text-sm font-bold">Activate All Recommended</button>
              <button onClick={()=>setStep(7)} className="flex-1 border py-2 rounded-full text-sm">Select Categories</button>
            </div>
            <p className="text-xs text-slate-500 mt-2">You can Deactivate Selected later in /admin/products/catalogue</p>
          </div>
        )}
        {step===7 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mt-4">
            <h3 className="font-bold">Step 7 — Pricing</h3>
            <label className="flex items-center gap-2 mt-2"><input type="radio" name="price" defaultChecked /> Use reference MRP initially (convenience, verification date stored)</label>
            <label className="flex items-center gap-2 mt-2"><input type="radio" name="price" /> Import my prices (CSV)</label>
            <label className="flex items-center gap-2 mt-2"><input type="radio" name="price" /> Enter manually later</label>
            <button onClick={()=>setStep(8)} className="mt-3 bg-emerald-600 text-white px-6 py-2 rounded-full font-bold">Next</button>
          </div>
        )}
        {step===8 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mt-4">
            <h3 className="font-bold">Step 8 — Inventory</h3>
            <label className="flex items-center gap-2 mt-2"><input type="radio" name="stock" defaultChecked /> Import stock</label>
            <label className="flex items-center gap-2 mt-2"><input type="radio" name="stock" /> Start at zero</label>
            <label className="flex items-center gap-2 mt-2"><input type="radio" name="stock" /> Enable without stock</label>
            <button onClick={applyStarter} className="mt-3 bg-emerald-600 text-white px-6 py-2 rounded-full font-bold">Publish Store</button>
          </div>
        )}
        {step===9 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mt-4 text-center">
            <h3 className="font-black text-emerald-700">Store Published! 🎉</h3>
            <p className="text-sm mt-2">{counts[starter]} products enabled — storefront now shows only enabled products</p>
            <Link href="/shop" className="inline-block mt-3 bg-emerald-600 text-white px-6 py-2 rounded-full font-bold">View Storefront</Link>
            <Link href="/admin/products/catalogue" className="inline-block mt-3 ml-2 border px-6 py-2 rounded-full font-bold">Activation Manager</Link>
          </div>
        )}
      </div>
    </div>
  );
}
