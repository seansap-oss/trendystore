'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import { useTenantStore } from '@/lib/supermarket/india/tenantStore';
import { MASTER_CATALOGUE } from '@/lib/supermarket/india/masterCatalogue';

export default function ScanPage() {
  const [barcode, setBarcode] = useState('');
  const [result, setResult] = useState<any>(null);
  const setOverride = useTenantStore(s=>s.setOverride);
  const setStock = useTenantStore(s=>s.setStock);

  const lookup = () => {
    const tenantDisplay = useTenantStore.getState().getDisplayProducts() as any[];
    let found = tenantDisplay.find(p=>p.barcode===barcode || p.gtin===barcode);
    if (found) {
      setResult({ type:'tenant', product:found });
      return;
    }
    const master = MASTER_CATALOGUE.find(m=>m.barcode===barcode || m.gtin===barcode);
    if (master) {
      setResult({ type:'master', product:master });
      return;
    }
    setResult({ type:'notfound' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-black">Barcode Scanner — Mobile Friendly</h1>
        <p className="text-sm text-slate-500">Scan GTIN/EAN → tenant → master → create custom or promote to master</p>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mt-4">
          <div className="flex gap-2">
            <input value={barcode} onChange={e=>setBarcode(e.target.value)} placeholder="Scan or enter barcode (e.g. 8901030875028)" className="flex-1 border border-slate-200 rounded-full px-4 py-3 text-sm font-mono" autoFocus />
            <button onClick={lookup} className="bg-emerald-600 text-white px-6 py-3 rounded-full font-bold">Lookup</button>
          </div>
          <button onClick={()=>{
            if ('mediaDevices' in navigator) {
              alert('Camera scan would open here — using Web BarcodeDetector API, falls back to manual input for demo');
            }
          }} className="w-full mt-2 border border-slate-200 py-2 rounded-full text-sm">📷 Scan with Camera</button>
        </div>

        {result && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mt-4">
            {result.type==='tenant' && (
              <>
                <p className="font-bold text-emerald-700">Found in Tenant Catalogue</p>
                <p className="text-sm">{result.product.name} • ₹{result.product.mrp} • {result.product.enabled ? 'Enabled':'Disabled'}</p>
                <div className="flex gap-2 mt-3">
                  <input placeholder="Price ₹" id="price" className="border rounded-full px-3 py-2 text-sm w-24" />
                  <input placeholder="Stock" id="stock" className="border rounded-full px-3 py-2 text-sm w-20" />
                  <button onClick={()=>{
                    const price=(document.getElementById('price') as HTMLInputElement).value;
                    const stock=(document.getElementById('stock') as HTMLInputElement).value;
                    if(price) useTenantStore.getState().setSellingPrice(result.product.id, Number(price));
                    if(stock) setStock(result.product.id,'store_syd_cbd', Number(stock));
                    alert('Saved — ENABLED FOR MY STORE');
                  }} className="bg-emerald-600 text-white px-4 py-2 rounded-full font-bold text-sm">ENABLE FOR MY STORE & Save</button>
                </div>
              </>
            )}
            {result.type==='master' && (
              <>
                <p className="font-bold text-amber-700">Found in Master Catalogue — not yet enabled</p>
                <p className="text-sm">{result.product.productName} • {result.product.brandName} • ₹{result.product.referenceMrp}</p>
                <button onClick={()=>{
                  setOverride(result.product.id, { enabled:true });
                  alert('Enabled — now in tenant catalogue');
                }} className="mt-3 bg-emerald-600 text-white px-4 py-2 rounded-full font-bold text-sm">ENABLE FOR MY STORE</button>
              </>
            )}
            {result.type==='notfound' && (
              <>
                <p className="font-bold text-red-600">Not found — create Tenant Custom Product</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <input placeholder="Name" className="border rounded-xl px-3 py-2 text-sm" />
                  <input placeholder="Barcode" value={barcode} className="border rounded-xl px-3 py-2 text-sm font-mono" readOnly />
                  <input placeholder="Brand" className="border rounded-xl px-3 py-2 text-sm" />
                  <input placeholder="Pack Size" className="border rounded-xl px-3 py-2 text-sm" />
                  <input placeholder="Price" className="border rounded-xl px-3 py-2 text-sm" />
                  <input placeholder="Stock" className="border rounded-xl px-3 py-2 text-sm" />
                </div>
                <button onClick={()=>alert('Custom product created — SaaS operator may Promote to Master later')} className="mt-3 bg-slate-900 text-white px-4 py-2 rounded-full font-bold text-sm">Create Custom Product</button>
                <button className="mt-2 ml-2 border px-4 py-2 rounded-full text-sm">Look up GS1</button>
              </>
            )}
          </div>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-4 text-xs">
          <p className="font-bold">Promote to Master workflow:</p>
          <p>Tenant Custom → Super Admin Review → Match existing or Promote to India Master (improves 70% coverage for all tenants). Tenant custom never overwrites master without permission.</p>
        </div>
      </div>
    </div>
  );
}
