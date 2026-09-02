'use client';
import Header from '@/components/Header';
import { MARKET_CATALOGUES } from '@/lib/supermarket/markets';
import { useTenantStore } from '@/lib/supermarket/india/tenantStore';
import { useState } from 'react';
import Link from 'next/link';

export default function MarketCataloguePage() {
  const marketCode = useTenantStore(s=>(s as any).marketCode || 'IN');
  const setMarket = useTenantStore(s=>(s as any).setMarket);
  const replaceWithMarket = useTenantStore(s=>(s as any).replaceWithMarket);
  const mergeMarket = useTenantStore(s=>(s as any).mergeMarket);
  const [preview, setPreview] = useState<string|null>(null);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-black">ADMIN → Product Management → Market Catalogue</h1>
        <p className="text-sm text-slate-500">Super Admin sees both; Tenant has default market. Do not silently merge.</p>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {MARKET_CATALOGUES.map(m=>(
            <div key={m.id} className={`bg-white rounded-2xl border p-4 ${marketCode===m.code ? 'border-emerald-600 ring-2 ring-emerald-100' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{m.code==='IN' ? '🇮🇳':'🇦🇺'}</span>
                <div>
                  <p className="font-bold">{m.name} ({m.code})</p>
                  <p className="text-xs text-slate-500">{m.currency} • {m.locale} {m.isDefault ? '• Default' : ''}</p>
                </div>
                {marketCode===m.code && <span className="ml-auto bg-emerald-600 text-white text-xs px-3 py-1 rounded-full font-bold">Active</span>}
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={()=>{
                  setMarket(m.code);
                  setPreview(`Switched default market to ${m.code} — storefront now shows ${m.code==='IN' ? 'India' : 'Australia'} taxonomy (same visual components, different DB data)`);
                }} className={`flex-1 py-2 rounded-full font-bold text-sm ${marketCode===m.code?'bg-emerald-600 text-white':'border border-slate-200'}`}>Select Market</button>
                <Link href={m.code==='IN' ? '/admin/products/catalogue' : '/admin/products'} className="flex-1 text-center border border-slate-200 py-2 rounded-full text-sm font-bold">View Catalogue</Link>
              </div>
            </div>
          ))}
        </div>

        {preview && <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mt-4 text-sm">{preview}</div>}

        <div className="bg-white rounded-2xl border border-slate-200 p-4 mt-4">
          <h3 className="font-bold">Switching / Adding Market — Three Actions (preview before apply)</h3>
          <p className="text-xs text-slate-500">Current tenant market: <b>{marketCode}</b> — Available: {marketCode==='IN' ? 'AU' : 'IN'}</p>
          <div className="grid md:grid-cols-3 gap-3 mt-3">
            <div className="border border-slate-200 rounded-xl p-3">
              <p className="font-bold text-sm">Option A — Replace Starter</p>
              <p className="text-xs text-slate-500">Replace demo assignments with {marketCode==='IN' ? 'AU' : 'IN'} catalogue. Do NOT destroy custom products/orders.</p>
              <button onClick={()=>{
                const target = marketCode==='IN' ? 'AU' : 'IN';
                if(confirm(`Replace with ${target}? Preview: will disable ${target==='IN' ? 'AU' : 'IN'} demo, enable ${target} Standard (4k). Preserve custom products.`)) {
                  replaceWithMarket(target as any);
                  setPreview(`Replaced — now showing ${target} catalogue`);
                }
              }} className="w-full mt-2 bg-slate-900 text-white py-2 rounded-full text-sm font-bold">REPLACE DEMO CATALOGUE</button>
            </div>
            <div className="border border-slate-200 rounded-xl p-3">
              <p className="font-bold text-sm">Option B — Merge</p>
              <p className="text-xs text-slate-500">Add India products while preserving existing, run duplicate detection (GTIN exact).</p>
              <button onClick={()=>{
                const target = marketCode==='IN' ? 'AU' : 'IN';
                mergeMarket(target as any);
                setPreview(`Merged ${target} — duplicates detected by GTIN, not duplicated`);
              }} className="w-full mt-2 bg-emerald-600 text-white py-2 rounded-full text-sm font-bold">MERGE INDIA PRODUCTS</button>
            </div>
            <div className="border border-slate-200 rounded-xl p-3">
              <p className="font-bold text-sm">Option C — Select Categories</p>
              <p className="text-xs text-slate-500">Add only Atta, Rice & Dal / Masalas / Munchies etc</p>
              <Link href="/admin/products/catalogue" className="block text-center w-full mt-2 border border-slate-200 py-2 rounded-full text-sm font-bold">SELECT CATEGORIES</Link>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Market isolation: Tenant A India vs Tenant B Australia — changing India tree does not modify Australia tree.</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-4 text-xs">
          <p className="font-bold">Preservation:</p>
          <p>Replace preserves tenant-created products, orders, customers, sales history, prices, uploaded images, inventory history unless mapped/approved.</p>
        </div>
      </div>
    </div>
  );
}
