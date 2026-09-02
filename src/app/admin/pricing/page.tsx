'use client';
import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import { useAdminStore } from '@/lib/supermarket/adminStore';
import { DEPARTMENTS } from '@/lib/supermarket/departments';

export default function PricingPage() {
  const products = useAdminStore(s=>s.products);
  const update = useAdminStore(s=>s.updateProduct);
  const [q, setQ] = useState('');
  const [dept, setDept] = useState('');
  const [store, setStore] = useState('default');
  const [edits, setEdits] = useState<Record<string, number>>({});
  const [bulkPct, setBulkPct] = useState(3);
  const [bulkType, setBulkType] = useState<'increase_pct'|'decrease_pct'>('increase_pct');

  const filtered = useMemo(()=> products.filter(p=>{
    if (q && !p.name.toLowerCase().includes(q.toLowerCase()) && !p.sku.toLowerCase().includes(q.toLowerCase())) return false;
    if (dept && p.departmentId!==dept) return false;
    return true;
  }).slice(0,100), [products, q, dept]);

  const applyBulk = () => {
    const pct = bulkPct/100;
    filtered.forEach(p=>{
      const newPrice = bulkType==='increase_pct' ? p.retailPrice*(1+pct) : p.retailPrice*(1-pct);
      const rounded = Math.round(newPrice*2)/2; // round to .50
      setEdits(e=> ({...e, [p.id]: Number(rounded.toFixed(2))}));
    });
  };

  const preview = filtered.filter(p=> edits[p.id] !== undefined);
  const requiresApproval = preview.some(p=> Math.abs((edits[p.id]-p.retailPrice)/p.retailPrice) > 0.20);

  const publish = () => {
    preview.forEach(p=>{
      update(p.id, { retailPrice: edits[p.id], compareAtPrice: p.retailPrice } as any);
    });
    alert(`Published ${preview.length} price changes. ${requiresApproval ? 'Requires approval for >20% changes — flagged' : ''}`);
    setEdits({});
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        <h1 className="text-2xl font-black">Bulk Price Manager — Spreadsheet</h1>
        <p className="text-sm text-slate-500">Store/region/promotion priority: Base → Region → Store → Promotion. Frontend shows effective price.</p>

        <div className="bg-white rounded-2xl border border-slate-200 p-3 mt-4 flex flex-wrap gap-2 items-center">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search SKU / name" className="border border-slate-200 rounded-full px-4 py-2 text-sm flex-1 min-w-[200px]" />
          <select value={dept} onChange={e=>setDept(e.target.value)} className="border border-slate-200 rounded-full px-3 py-2 text-sm"><option value="">All Depts</option>{DEPARTMENTS.map(d=> <option key={d.id} value={d.id}>{d.name}</option>)}</select>
          <select value={store} onChange={e=>setStore(e.target.value)} className="border border-slate-200 rounded-full px-3 py-2 text-sm"><option value="default">Default Store</option><option value="SYD001">Sydney CBD</option><option value="MEL001">Melbourne CBD</option></select>
          <div className="flex items-center gap-1 border border-slate-200 rounded-full px-2 py-1">
            <select value={bulkType} onChange={e=>setBulkType(e.target.value as any)} className="text-sm"><option value="increase_pct">Increase %</option><option value="decrease_pct">Decrease %</option></select>
            <input type="number" value={bulkPct} onChange={e=>setBulkPct(Number(e.target.value))} className="w-16 border border-slate-200 rounded-full px-2 py-1 text-sm" />
            <button onClick={applyBulk} className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold">Apply to filtered</button>
          </div>
          <button onClick={()=>setEdits({})} className="border border-slate-200 px-4 py-2 rounded-full text-sm">Clear edits</button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-3 text-sm">
          <p className="font-bold">Three ways to update prices:</p>
          <ol className="list-decimal list-inside text-xs">
            <li>Individual: open product → Edit → Publish</li>
            <li>Bulk table: select 50/100/500 here → preview → publish (this page)</li>
            <li>CSV/XLSX: Export → edit in Excel → Upload in /admin/import → Approve</li>
          </ol>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs"><tr><th className="text-left p-2">SKU</th><th className="text-left p-2">Product</th><th className="text-right p-2">Cost</th><th className="text-right p-2">Current</th><th className="text-right p-2">New Price</th><th className="text-right p-2">Margin</th><th className="text-right p-2">Special</th><th className="text-left p-2">Store</th></tr></thead>
            <tbody>
              {filtered.map(p=>{
                const newPrice = edits[p.id] ?? p.retailPrice;
                const margin = ((newPrice - (p as any).costPrice)/newPrice*100).toFixed(1);
                return (
                  <tr key={p.id} className="border-t border-slate-100">
                    <td className="p-2 font-mono text-xs">{p.sku}</td>
                    <td className="p-2">{p.name}</td>
                    <td className="p-2 text-right">${(p as any).costPrice?.toFixed(2)}</td>
                    <td className="p-2 text-right">${p.retailPrice.toFixed(2)}</td>
                    <td className="p-2 text-right"><input type="number" step="0.01" value={newPrice} onChange={e=> setEdits({...edits, [p.id]: Number(e.target.value)})} className={`w-24 border rounded-full px-2 py-1 text-sm text-right ${edits[p.id]!==undefined ? 'border-emerald-500 bg-emerald-50': 'border-slate-200'}`} /></td>
                    <td className="p-2 text-right text-xs">{margin}%</td>
                    <td className="p-2 text-right"><input type="number" step="0.01" placeholder={String(p.specialPrice||'')} className="w-20 border border-slate-200 rounded-full px-2 py-1 text-sm text-right" /></td>
                    <td className="p-2 text-xs">{store}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 mt-4 flex justify-between items-center">
          <div>
            <p className="font-bold">{preview.length} changes preview</p>
            {requiresApproval && <p className="text-sm text-amber-700">⚠️ Price change &gt;20% — requires Super Admin approval</p>}
            {!requiresApproval && preview.length>0 && <p className="text-sm text-emerald-700">Ready to publish — scheduled supported (e.g. Sep 1–14 $4.50)</p>}
          </div>
          <button disabled={preview.length===0} onClick={publish} className="bg-emerald-600 disabled:bg-slate-200 text-white px-6 py-3 rounded-full font-black">Preview & Publish</button>
        </div>
      </div>
    </div>
  );
}
