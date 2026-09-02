'use client';
import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import { useAdminStore } from '@/lib/supermarket/adminStore';
import { STORES } from '@/lib/supermarket/stores';

export default function InventoryPage() {
  const products = useAdminStore(s=>s.products);
  const inventory = useAdminStore(s=>s.inventory);
  const adjust = useAdminStore(s=>s.adjustInventory);
  const txs = useAdminStore(s=>s.transactions);
  const [store, setStore] = useState(STORES[0].id);
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<Record<string, number>>({});

  const filtered = useMemo(()=> products.filter(p=> !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase())).slice(0, 80), [products, q]);

  const exportCSV = () => {
    const rows = [['sku','product','store','available','reserved','available_to_sell','status']];
    filtered.forEach(p=> {
      const avail = inventory[p.id]?.[store] ?? 20;
      const reserved = 2;
      rows.push([p.sku, p.name, STORES.find(s=>s.id===store)?.name||store, String(avail), String(reserved), String(avail-reserved), avail===0 ? 'Out of Stock' : avail<5 ? 'Low Stock' : 'In Stock']);
    });
    const csv=rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`inventory-${store}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black">Inventory — Store Specific</h1>
            <p className="text-sm text-slate-500">Available / Reserved / Available To Sell • Every adjustment creates transaction history</p>
          </div>
          <button onClick={exportCSV} className="border border-slate-200 bg-white px-4 py-2 rounded-full text-sm font-medium">Export CSV</button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-3 mt-4 flex flex-wrap gap-2">
          <select value={store} onChange={e=>setStore(e.target.value)} className="border border-slate-200 rounded-full px-4 py-2 text-sm bg-white">
            {STORES.map(s=> <option key={s.id} value={s.id}>{s.name} — {s.suburb}</option>)}
          </select>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search SKU / name" className="flex-1 min-w-[200px] border border-slate-200 rounded-full px-4 py-2 text-sm" />
          <label className="flex items-center gap-2 text-sm border border-slate-200 rounded-full px-3 py-2"><input type="file" accept=".csv,.xlsx" className="hidden" onChange={()=>{
            alert('CSV import — validation preview before publish (see /admin/import)');
          }} />📥 Import CSV</label>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs"><tr><th className="text-left p-2">SKU</th><th className="text-left p-2">Product</th><th className="text-left p-2">Store</th><th className="text-right p-2">Available</th><th className="text-right p-2">Reserved</th><th className="text-right p-2">Available To Sell</th><th className="text-center p-2">Threshold</th><th className="text-left p-2">Status</th><th className="text-right p-2">Adjust</th></tr></thead>
            <tbody>
              {filtered.map(p=>{
                const avail = inventory[p.id]?.[store] ?? 20;
                const reserved = 2;
                const ats = avail - reserved;
                const status = avail===0 ? 'Out of Stock' : avail<((p as any).lowStockThreshold||5) ? 'Low Stock' : 'In Stock';
                return (
                  <tr key={p.id} className="border-t border-slate-100">
                    <td className="p-2 font-mono text-xs">{p.sku}</td>
                    <td className="p-2">{p.name}</td>
                    <td className="p-2 text-xs">{STORES.find(s=>s.id===store)?.code}</td>
                    <td className="p-2 text-right">
                      {editing[p.id]!==undefined ? (
                        <input type="number" value={editing[p.id]} onChange={e=> setEditing({...editing, [p.id]: Number(e.target.value)})} className="w-20 border border-emerald-500 rounded-full px-2 py-1 text-sm text-right" />
                      ) : <span className="font-bold">{avail}</span>}
                    </td>
                    <td className="p-2 text-right">{reserved}</td>
                    <td className="p-2 text-right font-bold">{ats}</td>
                    <td className="p-2 text-center">{(p as any).lowStockThreshold}</td>
                    <td className="p-2"><span className={`text-xs px-2 py-1 rounded-full ${status==='In Stock'?'bg-emerald-100 text-emerald-700':status==='Low Stock'?'bg-amber-100 text-amber-700':'bg-red-100 text-red-700'}`}>{status}</span></td>
                    <td className="p-2 text-right">
                      {editing[p.id]!==undefined ? (
                        <div className="flex gap-1 justify-end">
                          <button onClick={()=>{
                            const delta = editing[p.id] - avail;
                            adjust(p.id, store, delta, 'Manual Correction', 'Direct edit');
                            const ne={...editing}; delete ne[p.id]; setEditing(ne);
                          }} className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs">Save</button>
                          <button onClick={()=>{
                            const ne={...editing}; delete ne[p.id]; setEditing(ne);
                          }} className="border px-3 py-1 rounded-full text-xs">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex gap-1 justify-end">
                          <button onClick={()=> setEditing({...editing, [p.id]: avail})} className="border px-3 py-1 rounded-full text-xs">Edit</button>
                          <button onClick={()=> adjust(p.id, store, 10, 'Supplier Delivery', '+10 delivery')} className="bg-slate-900 text-white px-2 py-1 rounded-full text-xs">+10</button>
                          <button onClick={()=> adjust(p.id, store, -3, 'Damage', '-3 damaged')} className="border border-red-200 text-red-600 px-2 py-1 rounded-full text-xs">-3</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 mt-4">
          <h3 className="font-bold">Inventory Transaction History (never overwrite without history)</h3>
          <div className="mt-2 space-y-1 max-h-64 overflow-y-auto text-sm">
            {txs.length===0 ? <p className="text-xs text-slate-500">No transactions yet — adjustments create records: Supplier Delivery +100, Customer Order -4, Damage -3, Cancellation +1</p> : txs.slice(0,20).map(t=>(
              <div key={t.id} className="flex justify-between border-b border-slate-100 py-1 text-xs">
                <span>{t.productId} • {STORES.find(s=>s.id===t.storeId)?.code} • {t.type} {t.adjustment>0?`+${t.adjustment}`:t.adjustment} • {t.prev} → {t.newQty}</span>
                <span className="text-slate-500">{new Date(t.timestamp).toLocaleString()} • {t.admin}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
