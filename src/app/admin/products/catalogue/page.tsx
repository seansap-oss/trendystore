'use client';
import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import { useTenantStore } from '@/lib/supermarket/india/tenantStore';
import { MASTER_CATALOGUE } from '@/lib/supermarket/india/masterCatalogue';
import { INDIA_DEPARTMENTS } from '@/lib/supermarket/india/taxonomy';

export default function ActivationManagerPage() {
  const tenantId = useTenantStore(s=>s.tenantId);
  const overrides = useTenantStore(s=>s.overrides);
  const inventory = useTenantStore(s=>s.inventory);
  const bulkEnable = useTenantStore(s=>s.bulkEnable);
  const setOverride = useTenantStore(s=>s.setOverride);
  const setStock = useTenantStore(s=>s.setStock);
  const setSellingPrice = useTenantStore(s=>s.setSellingPrice);

  const [q, setQ] = useState('');
  const [dept, setDept] = useState('');
  const [filter, setFilter] = useState<'all'|'enabled'|'disabled'|'out'|'missingPrice'|'missingImage'>('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const pageSize=25;

  const display = useMemo(()=> {
    let list = MASTER_CATALOGUE.map(mp=>{
      const ov = overrides.find(o=>o.masterProductId===mp.id && o.tenantId===tenantId);
      const inv = inventory.find(i=>i.masterProductId===mp.id && i.tenantId===tenantId);
      return { mp, ov, inv, enabled: ov? ov.enabled : true, price: ov?.sellingPrice ?? mp.referenceMrp, stock: inv?.quantityAvailable ?? 20 };
    });
    if (q) list = list.filter(x=> `${x.mp.productName} ${x.mp.brandName} ${x.mp.barcode}`.toLowerCase().includes(q.toLowerCase()));
    if (dept) list = list.filter(x=> x.mp.departmentId===dept);
    if (filter==='enabled') list = list.filter(x=> x.enabled);
    if (filter==='disabled') list = list.filter(x=> !x.enabled);
    if (filter==='out') list = list.filter(x=> (x.inv ? !x.inv.inStock : false) || x.stock===0);
    if (filter==='missingPrice') list = list.filter(x=> !x.price);
    if (filter==='missingImage') list = list.filter(x=> !x.mp.imageUrl);
    return list;
  }, [overrides, inventory, q, dept, filter, tenantId]);

  const paged = display.slice((page-1)*pageSize, page*pageSize);
  const allIds = display.map(d=>d.mp.id);
  const toggleAll = (checked:boolean)=> setSelected(checked? allIds : []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        <h1 className="text-2xl font-black">Product Activation Manager — India Master Catalogue</h1>
        <p className="text-sm text-slate-500">Master Catalogue ↓ Tenant Catalogue ↓ Store Inventory → Storefront (only enabled for this tenant appear). 70% coverage starter pack.</p>

        {/* Tenant switcher (SaaS demo) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 mt-3 flex flex-wrap gap-2 items-center">
          <span className="text-sm font-bold">Tenant:</span>
          <select value={tenantId} onChange={e=>{
            const id=e.target.value; useTenantStore.getState().setTenant(id, id==='tenant_demo'?'FreshBasket Demo': id==='tenant_a'?'Supermarket A': 'Supermarket B');
            setSelected([]);
          }} className="border border-slate-200 rounded-full px-3 py-2 text-sm">
            <option value="tenant_demo">FreshBasket Demo (Standard 4,386)</option>
            <option value="tenant_a">Supermarket A (Multi-tenant test)</option>
            <option value="tenant_b">Supermarket B (Multi-tenant test)</option>
          </select>
          <span className="text-xs text-slate-500">A ≠ B isolation: change A price/stock does not affect B</span>
          <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold">{display.filter(d=>d.enabled).length} enabled / {MASTER_CATALOGUE.length} master ({Math.round(display.filter(d=>d.enabled).length/MASTER_CATALOGUE.length*100)}%)</span>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 mt-3 flex flex-wrap gap-2">
          <input value={q} onChange={e=>{setQ(e.target.value); setPage(1)}} placeholder="Search name, brand, barcode, GTIN..." className="flex-1 min-w-[200px] border border-slate-200 rounded-full px-4 py-2 text-sm" />
          <select value={dept} onChange={e=>{setDept(e.target.value); setPage(1)}} className="border border-slate-200 rounded-full px-3 py-2 text-sm"><option value="">All Departments</option>{INDIA_DEPARTMENTS.map(d=> <option key={d.id} value={d.id}>{d.name}</option>)}</select>
          <select value={filter} onChange={e=>setFilter(e.target.value as any)} className="border border-slate-200 rounded-full px-3 py-2 text-sm">
            <option value="all">All</option><option value="enabled">Enabled</option><option value="disabled">Disabled</option><option value="out">Out of Stock</option><option value="missingPrice">Missing Price</option><option value="missingImage">Missing Image</option>
          </select>
          <label className="flex items-center gap-1 text-sm"><input type="checkbox" checked={selected.length===allIds.length && allIds.length>0} onChange={e=>toggleAll(e.target.checked)} /> Select all {display.length}</label>
        </div>

        {/* Bulk actions */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-3 flex flex-wrap gap-2 items-center text-sm">
          <span className="font-bold">Bulk ({selected.length}):</span>
          <button onClick={()=>{ bulkEnable(selected,true); setSelected([]); }} className="bg-emerald-600 text-white px-4 py-2 rounded-full font-bold">Enable</button>
          <button onClick={()=>{ bulkEnable(selected,false); setSelected([]); }} className="border border-slate-300 bg-white px-4 py-2 rounded-full font-bold">Disable</button>
          <button onClick={()=>{
            const cat=prompt('Change category override to (dept id):'); if(!cat) return;
            selected.forEach(id=> setOverride(id,{categoryOverride:cat}));
            alert(`Category overridden for ${selected.length}`);
          }} className="border px-4 py-2 rounded-full">Change Category</button>
          <button onClick={()=>{
            const price=Number(prompt('Set selling price ₹:')); if(!price) return;
            selected.forEach(id=> setSellingPrice(id,price));
          }} className="border px-4 py-2 rounded-full">Set Price</button>
          <button onClick={()=>{
            const disc=Number(prompt('Discount %:')); if(!disc) return;
            selected.forEach(id=> {
              const mp=MASTER_CATALOGUE.find(m=>m.id===id)!;
              const special = Math.round(mp.referenceMrp*(1-disc/100));
              setOverride(id,{specialPrice:special, specialStart:new Date().toISOString()});
            });
          }} className="border px-4 py-2 rounded-full">Create Discount</button>
          <button onClick={()=>{
            const stock=Number(prompt('Set Stock quantity:')); if(stock===null||isNaN(stock)) return;
            selected.forEach(id=> setStock(id,'store_syd_cbd', stock));
          }} className="border px-4 py-2 rounded-full">Set Stock</button>
          <button onClick={()=>{
            if(confirm('Enable Entire Category? This will enable all in filtered dept')) bulkEnable(display.map(d=>d.mp.id),true);
          }} className="ml-auto bg-slate-900 text-white px-4 py-2 rounded-full font-bold">Enable Entire Category</button>
        </div>

        {/* Table — spec: [✓] Image | Product | Brand | Pack | Barcode | Category | MRP | My Price | Stock | Live */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs"><tr><th className="p-2">[✓]</th><th className="text-left p-2">Image</th><th className="text-left p-2">Product</th><th className="text-left p-2">Brand</th><th className="text-left p-2">Pack</th><th className="text-left p-2">Barcode</th><th className="text-left p-2">Category</th><th className="text-right p-2">MRP</th><th className="text-right p-2">My Price</th><th className="text-right p-2">Stock</th><th className="text-center p-2">Live</th></tr></thead>
            <tbody>
              {paged.map(({mp,ov,inv,enabled,price,stock})=> (
                <tr key={mp.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="p-2 text-center"><input type="checkbox" checked={selected.includes(mp.id)} onChange={e=> setSelected(e.target.checked? [...selected,mp.id]: selected.filter(x=>x!==mp.id))} /></td>
                  <td className="p-2"><img src={ov?.customImage || mp.imageUrl} alt="" className="w-10 h-10 rounded object-cover bg-slate-100" /></td>
                  <td className="p-2"><p className="font-medium leading-tight text-xs">{ov?.customName || mp.productName}</p></td>
                  <td className="p-2 text-xs font-medium">{mp.brandName}</td>
                  <td className="p-2 text-xs">{mp.packSize}</td>
                  <td className="p-2 font-mono text-xs">{mp.barcode}</td>
                  <td className="p-2 text-xs">{INDIA_DEPARTMENTS.find(d=>d.id===mp.departmentId)?.name}</td>
                  <td className="p-2 text-right">₹{mp.referenceMrp}</td>
                  <td className="p-2 text-right">
                    <input type="number" value={price} onChange={e=> setSellingPrice(mp.id, Number(e.target.value))} className={`w-20 border rounded-full px-2 py-1 text-sm text-right ${price>mp.referenceMrp ? 'border-red-500 bg-red-50' : 'border-slate-200'}`} />
                    {price>mp.referenceMrp && <p className="text-[10px] text-red-600">Exceeds MRP!</p>}
                  </td>
                  <td className="p-2 text-right">
                    <input type="number" value={stock} onChange={e=> setStock(mp.id,'store_syd_cbd', Number(e.target.value))} className="w-16 border border-slate-200 rounded-full px-2 py-1 text-sm text-right" />
                  </td>
                  <td className="p-2 text-center">
                    <button onClick={()=> bulkEnable([mp.id], !enabled)} className={`px-3 py-1 rounded-full text-xs font-bold border ${enabled?'bg-emerald-600 text-white border-emerald-600':'bg-slate-100 text-slate-600 border-slate-200'}`}>{enabled?'LIVE':'OFF'}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Header checkbox for select all search results */}
        <div className="flex gap-2 mt-2 text-xs">
          <button onClick={()=> setSelected(display.map(d=>d.mp.id))} className="border px-3 py-1 rounded-full">Select all {display.length} search results</button>
          <button onClick={()=> setSelected([])} className="border px-3 py-1 rounded-full">Clear selection</button>
          <span className="text-slate-500 py-1">Tick updates tenant catalogue instantly — storefront shows only enabled</span>
        </div>

        <div className="flex justify-between items-center mt-3">
          <p className="text-sm text-slate-500">Page {page} — {display.length} matches — only enabled appear on storefront</p>
          <div className="flex gap-2">
            <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="px-4 py-2 border rounded-full text-sm disabled:opacity-50">Prev</button>
            <button disabled={page*pageSize>=display.length} onClick={()=>setPage(p=>p+1)} className="px-4 py-2 border rounded-full text-sm disabled:opacity-50">Next</button>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mt-4 text-xs">
          <p className="font-bold">Starter Packs (same master, filtered):</p>
          <p>Kirana 1-2k • Mini 2.5-4k • Standard 4-8k • Large full catalogue — not duplicated, just selections.</p>
          <p className="mt-1">Multi-tenant test: Switch Tenant A/B above — same Aashirvaad Atta 5kg can be ₹290 stock 30 in A, ₹310 stock 5 in B — isolation via tenantId+RLS.</p>
        </div>
      </div>
    </div>
  );
}
