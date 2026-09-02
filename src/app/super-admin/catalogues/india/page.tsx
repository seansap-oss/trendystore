'use client';
import Header from '@/components/Header';
import { MASTER_CATALOGUE, getQualityScore } from '@/lib/supermarket/india/masterCatalogue';
import { useState } from 'react';

export default function SuperAdminIndiaPage() {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'all'|'new'|'lowQuality'>('all');
  const filtered = MASTER_CATALOGUE.filter(m=>{
    if(q && !`${m.productName} ${m.brandName} ${m.barcode}`.toLowerCase().includes(q.toLowerCase())) return false;
    if(filter==='lowQuality' && getQualityScore(m) >= 90) return false;
    return true;
  }).slice(0,50);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        <h1 className="text-2xl font-black">/super-admin/catalogues/india — Super Admin</h1>
        <p className="text-sm text-slate-500">Search all India products, review new, merge duplicates, correct categories, update MRP, replace master image, promote tenant custom, archive SKU, bulk import</p>

        <div className="bg-white rounded-2xl border border-slate-200 p-3 mt-3 flex gap-2">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search GTIN/barcode/brand/name" className="flex-1 border border-slate-200 rounded-full px-4 py-2 text-sm" />
          <select value={filter} onChange={e=>setFilter(e.target.value as any)} className="border border-slate-200 rounded-full px-3 py-2 text-sm"><option value="all">All</option><option value="lowQuality">Low Quality (&lt;90%)</option><option value="new">New Products</option></select>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold">Bulk Import</button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs"><tr><th className="text-left p-2">Image</th><th className="text-left p-2">Product</th><th className="text-left p-2">GTIN</th><th className="text-left p-2">MRP</th><th className="text-left p-2">Quality</th><th className="text-right p-2">Actions</th></tr></thead>
            <tbody>
              {filtered.map(m=>(
                <tr key={m.id} className="border-t border-slate-100">
                  <td className="p-2"><img src={m.imageUrl} alt="" className="w-10 h-10 rounded object-cover" /></td>
                  <td className="p-2"><p className="font-medium">{m.productName}</p><p className="text-xs text-slate-500">{m.brandName} • {m.packSize}</p></td>
                  <td className="p-2 font-mono text-xs">{m.gtin}</td>
                  <td className="p-2">₹{m.referenceMrp}</td>
                  <td className="p-2"><span className={`text-xs px-2 py-1 rounded-full font-bold ${getQualityScore(m)>=90?'bg-emerald-100 text-emerald-700':'bg-amber-100 text-amber-700'}`}>{getQualityScore(m)}% {getQualityScore(m)>=90?'COMPLETE':'REVIEW'}</span></td>
                  <td className="p-2 text-right">
                    <div className="flex gap-1 justify-end">
                      <button className="border px-2 py-1 rounded-full text-xs">Merge duplicate</button>
                      <button className="border px-2 py-1 rounded-full text-xs">Update MRP</button>
                      <button className="border px-2 py-1 rounded-full text-xs">Replace image</button>
                      <button className="bg-emerald-600 text-white px-2 py-1 rounded-full text-xs">Promote</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-4 mt-4 text-xs">
          <p className="font-bold">Tenant isolation:</p>
          <p>Tenant can modify sellingPrice/stock/enabled/customImage only — cannot modify global master. Reset to Master available.</p>
        </div>
      </div>
    </div>
  );
}
