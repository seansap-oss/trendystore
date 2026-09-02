'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import { useAdminStore } from '@/lib/supermarket/adminStore';

export default function ImportPage() {
  const addBatch = useAdminStore(s=>s.addBatch);
  const batches = useAdminStore(s=>s.batches);
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState<any | null>(null);

  const downloadTemplate = (type: 'csv'|'xlsx') => {
    const headers = ['sku','barcode','product_name','brand','department','category','subcategory','supplier','supplier_code','cost_price','retail_price','special_price','package_size','package_unit','stock','image_url','description','dietary_tags','allergen_tags','country_of_origin','status'];
    const csv = headers.join(',') + '\n' + 'FB-000001,9341234567890,FreshBasket Milk 2L,FreshBasket,Dairy, Milk,,FreshCo,SUP001,2.50,3.60,,2L,L,50,https://...,Daily Choice milk,Vegan,,Australia,Published\n';
    const blob = new Blob([csv], {type:'text/csv'});
    const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`template.${type==='csv'?'csv':'xlsx'}`; a.click(); URL.revokeObjectURL(url);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f=e.target.files?.[0]; if(!f) return;
    setFileName(f.name);
    // mock validation — in prod parse CSV/XLSX server-side
    const mock = {
      rows: 124,
      newProducts: 12,
      existing: 110,
      priceChanges: 18,
      stockChanges: 34,
      categoryChanges: 5,
      invalid: 2,
      duplicates: [{sku:'FB-000010', reason:'Duplicate SKU'}, {barcode:'9341234567890', reason:'Duplicate barcode'}],
      missing: [{row: 45, field:'product_name'}, {row:88, field:'retail_price'}],
      errors: ['Row 45: missing product_name', 'Row 88: retail_price required'],
      warnings: ['Row 12: price change >20% requires approval'],
    };
    setPreview(mock);
  };

  const approve = () => {
    if (!preview) return;
    const batch={ id:`IMPORT-${new Date().toISOString().slice(0,10)}-${String(batches.length+1).padStart(3,'0')}`, filename:fileName, createdAt:new Date().toISOString(), rows:preview.rows, newProducts:preview.newProducts, priceChanges:preview.priceChanges, stockChanges:preview.stockChanges, errors:preview.errors, status:'Approved' as const, changes:[] };
    addBatch(batch);
    alert('APPROVED & PUBLISHED — changes written to production. Batch '+batch.id+' can be rolled back.');
    setPreview(null); setFileName('');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        <h1 className="text-2xl font-black">Bulk Import — CSV / XLSX</h1>
        <p className="text-sm text-slate-500">Template → Upload → Validation → Preview → Approve & Publish (never directly modify prod)</p>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h3 className="font-bold">1. Download Template</h3>
            <div className="flex gap-2 mt-2">
              <button onClick={()=>downloadTemplate('csv')} className="flex-1 border border-slate-200 py-2 rounded-full text-sm font-medium">Download CSV Template</button>
              <button onClick={()=>downloadTemplate('xlsx')} className="flex-1 border border-slate-200 py-2 rounded-full text-sm font-medium">Download XLSX Template</button>
            </div>
            <p className="text-xs text-slate-500 mt-2">Columns: sku, barcode, product_name, brand, department, category, supplier, cost_price, retail_price, special_price, package_size, stock, image_url, dietary_tags...</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h3 className="font-bold">2. Upload File</h3>
            <label className="block mt-2 border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-300">
              <span className="text-sm font-medium">{fileName || 'Click to upload CSV/XLSX or drag & drop'}</span>
              <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFile} />
            </label>
            <p className="text-xs text-slate-500 mt-2">Supports supplier feeds via CSV/Excel/API/SFTP — approval rules apply</p>
          </div>
        </div>

        {preview && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mt-4">
            <h3 className="font-bold">Validation Preview — {fileName}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              <div className="bg-slate-50 rounded-xl p-3 text-center"><p className="text-2xl font-black">{preview.rows}</p><p className="text-xs">Rows detected</p></div>
              <div className="bg-emerald-50 rounded-xl p-3 text-center"><p className="text-2xl font-black">{preview.newProducts}</p><p className="text-xs">New products</p></div>
              <div className="bg-amber-50 rounded-xl p-3 text-center"><p className="text-2xl font-black">{preview.priceChanges}</p><p className="text-xs">Price changes</p></div>
              <div className="bg-red-50 rounded-xl p-3 text-center"><p className="text-2xl font-black">{preview.invalid}</p><p className="text-xs">Invalid rows</p></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <h4 className="font-bold">Duplicates</h4>
                {preview.duplicates.map((d:any,i:number)=> <p key={i} className="text-xs text-amber-700">{d.sku || d.barcode} — {d.reason}</p>)}
                <h4 className="font-bold mt-2">Missing fields</h4>
                {preview.missing.map((m:any,i:number)=> <p key={i} className="text-xs text-red-600">Row {m.row}: {m.field}</p>)}
              </div>
              <div>
                <h4 className="font-bold">Errors</h4>
                {preview.errors.map((e:string,i:number)=> <p key={i} className="text-xs text-red-600">{e}</p>)}
                <h4 className="font-bold mt-2">Warnings</h4>
                {preview.warnings.map((w:string,i:number)=> <p key={i} className="text-xs text-amber-700">{w}</p>)}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={approve} className="flex-1 bg-emerald-600 text-white py-3 rounded-full font-black">APPROVE & PUBLISH</button>
              <button onClick={()=>setPreview(null)} className="flex-1 border border-slate-200 py-3 rounded-full font-bold">Cancel</button>
            </div>
            <p className="text-xs text-slate-500 mt-2">Large price changes (&gt;20%) require Pricing Manager approval — configured in Approval Workflow</p>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 p-4 mt-4">
          <h3 className="font-bold">Import Batches (Rollback)</h3>
          {batches.length===0 ? <p className="text-sm text-slate-500">No batches yet — uploads create IMPORT-2026-XXXXX</p> : (
            <div className="space-y-2 mt-2">
              {batches.map(b=>(
                <div key={b.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl text-sm">
                  <div><p className="font-medium">{b.id} — {b.filename}</p><p className="text-xs text-slate-500">{b.rows} rows • {b.newProducts} new • {new Date(b.createdAt).toLocaleString()}</p></div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${b.status==='Approved'?'bg-emerald-600 text-white':b.status==='Rolled Back'?'bg-red-600 text-white':'bg-amber-100'}`}>{b.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
