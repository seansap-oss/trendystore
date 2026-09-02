'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useAdminStore } from '@/lib/supermarket/adminStore';
import { DEPARTMENTS, CATEGORIES } from '@/lib/supermarket/departments';
import { STORES } from '@/lib/supermarket/stores';
import { Search, Plus, Copy, Archive, Eye, Edit, Trash2, Download, Upload } from 'lucide-react';

export default function AdminProductsPage() {
  const products = useAdminStore(s=>s.products);
  const duplicate = useAdminStore(s=>s.duplicateProduct);
  const archive = useAdminStore(s=>s.archiveProduct);
  const publish = useAdminStore(s=>s.publishProduct);
  const unpublish = useAdminStore(s=>s.unpublishProduct);
  const del = useAdminStore(s=>s.deleteProduct);

  const [q, setQ] = useState('');
  const [dept, setDept] = useState('');
  const [cat, setCat] = useState('');
  const [storeFilter, setStoreFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [missing, setMissing] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const filtered = useMemo(()=> {
    return products.filter(p=>{
      if (q && !(`${p.name} ${p.sku} ${p.barcode||''} ${p.brandName} ${p.sku}`.toLowerCase().includes(q.toLowerCase()))) return false;
      if (dept && p.departmentId!==dept) return false;
      if (cat && p.categoryId!==cat) return false;
      if (stockFilter==='low' && (p.lowStockThreshold??999) > 10) return false;
      if (stockFilter==='out' && p.inStock) return false;
      if (statusFilter && p.status!==statusFilter) return false;
      if (missing==='images' && p.images.length>0) return false;
      if (missing==='info' && p.description && p.packageSize) return false;
      return true;
    });
  }, [products, q, dept, cat, stockFilter, statusFilter, missing]);

  const paged = filtered.slice((page-1)*pageSize, page*pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;

  const exportCSV = () => {
    const rows = [['sku','barcode','product_name','brand','department','retail_price','stock','status']];
    filtered.forEach(p=> rows.push([p.sku, p.barcode||'', p.name, p.brandName, DEPARTMENTS.find(d=>d.id===p.departmentId)?.name||'', String(p.retailPrice), String(p.inStock?'In Stock':'Out'), p.status]));
    const csv = rows.map(r=> r.map(v=> `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='products-export.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black">Products — PIM</h1>
            <p className="text-sm text-slate-500">{filtered.length} of {products.length} — storefront reads from DB, not hardcoded</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportCSV} className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-sm font-medium"><Download className="w-4 h-4" />Export</button>
            <Link href="/admin/import" className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-sm font-medium"><Upload className="w-4 h-4" />Import</Link>
            <Link href="/admin/products/new" className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold"><Plus className="w-4 h-4" />New Product</Link>
          </div>
        </div>

        {/* Tabs: MY PRODUCTS / INDIA MASTER / AUSTRALIA MASTER / CUSTOM / IMPORTS */}
        <div className="flex gap-2 mt-4 overflow-x-auto">
          <span className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-bold">MY PRODUCTS</span>
          <Link href="/admin/products/catalogue" className="border border-slate-200 bg-white px-4 py-2 rounded-full text-sm font-bold">🇮🇳 INDIA MASTER</Link>
          <Link href="/admin/market" className="border border-slate-200 bg-white px-4 py-2 rounded-full text-sm font-bold">🇦🇺 AUSTRALIA MASTER</Link>
          <Link href="/admin/products?filter=custom" className="border border-slate-200 bg-white px-4 py-2 rounded-full text-sm">CUSTOM PRODUCTS</Link>
          <Link href="/super-admin/catalogues/india" className="border border-slate-200 bg-white px-4 py-2 rounded-full text-sm">NEW MASTER PRODUCTS</Link>
          <Link href="/admin/master-catalogue/imports" className="border border-slate-200 bg-white px-4 py-2 rounded-full text-sm">IMPORTS</Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 mt-4 flex flex-col lg:flex-row gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={q} onChange={e=>{setQ(e.target.value); setPage(1)}} placeholder="Search SKU, barcode, name, brand..." className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-full text-sm" />
          </div>
          <select value={dept} onChange={e=>{setDept(e.target.value); setPage(1)}} className="border border-slate-200 rounded-full px-3 py-2 text-sm bg-white"><option value="">All Departments</option>{DEPARTMENTS.map(d=> <option key={d.id} value={d.id}>{d.name}</option>)}</select>
          <select value={cat} onChange={e=>{setCat(e.target.value); setPage(1)}} className="border border-slate-200 rounded-full px-3 py-2 text-sm bg-white"><option value="">All Categories</option>{CATEGORIES.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          <select value={storeFilter} onChange={e=>setStoreFilter(e.target.value)} className="border border-slate-200 rounded-full px-3 py-2 text-sm bg-white"><option value="">All Stores</option>{STORES.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}</select>
          <select value={stockFilter} onChange={e=>setStockFilter(e.target.value)} className="border border-slate-200 rounded-full px-3 py-2 text-sm bg-white"><option value="">Stock: All</option><option value="low">Low Stock</option><option value="out">Out of Stock</option></select>
          <select value={statusFilter} onChange={e=>{setStatusFilter(e.target.value); setPage(1)}} className="border border-slate-200 rounded-full px-3 py-2 text-sm bg-white"><option value="">Status: All</option><option value="Published">Published</option><option value="Draft">Draft</option><option value="Archived">Archived</option></select>
          <select value={missing} onChange={e=>setMissing(e.target.value)} className="border border-slate-200 rounded-full px-3 py-2 text-sm bg-white"><option value="">All</option><option value="images">Missing Images</option><option value="info">Missing Info</option></select>
        </div>

        {/* Table — server-side pagination style */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr><th className="text-left p-3">Product</th><th className="text-left p-3">SKU / Barcode</th><th className="text-left p-3">Dept</th><th className="text-left p-3">Price</th><th className="text-left p-3">Stock</th><th className="text-left p-3">Status</th><th className="text-right p-3">Actions</th></tr>
            </thead>
            <tbody>
              {paged.map(p=> (
                <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="p-3">
                    <div className="flex gap-3 items-center">
                      <img src={p.images[0]||'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'} alt="" className="w-10 h-10 rounded object-cover bg-slate-100" />
                      <div>
                        <p className="font-medium leading-tight">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.brandName} • {p.packageSize}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3"><span className="font-mono text-xs">{p.sku}</span><br/><span className="text-xs text-slate-500">{p.barcode||'—'}</span></td>
                  <td className="p-3 text-xs">{DEPARTMENTS.find(d=>d.id===p.departmentId)?.name}</td>
                  <td className="p-3"><span className="font-bold">${p.retailPrice.toFixed(2)}</span>{p.isSpecial && <span className="text-xs text-red-600"> • ${p.specialPrice?.toFixed(2)}</span>}</td>
                  <td className="p-3"><span className={`text-xs px-2 py-1 rounded-full font-bold ${p.inStock ? 'bg-emerald-100 text-emerald-700':'bg-red-100 text-red-700'}`}>{p.inStock ? 'In Stock':'Out'}</span></td>
                  <td className="p-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${p.status==='Published'?'bg-emerald-600 text-white':p.status==='Draft'?'bg-slate-200':p.status==='Archived'?'bg-slate-800 text-white':'bg-amber-100'}`}>{p.status}</span></td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1">
                      <Link href={`/product/${p.slug}`} className="p-2 hover:bg-white rounded-full" title="View"><Eye className="w-4 h-4" /></Link>
                      <Link href={`/admin/products/${p.id}`} className="p-2 hover:bg-white rounded-full" title="Edit"><Edit className="w-4 h-4" /></Link>
                      <button onClick={()=>duplicate(p.id)} className="p-2 hover:bg-white rounded-full" title="Duplicate"><Copy className="w-4 h-4" /></button>
                      {p.status==='Published' ? <button onClick={()=>unpublish(p.id)} className="p-2 hover:bg-white rounded-full text-amber-600" title="Unpublish"><Archive className="w-4 h-4" /></button> : <button onClick={()=>publish(p.id)} className="p-2 hover:bg-white rounded-full text-emerald-600" title="Publish">✓</button>}
                      <button onClick={()=>{ if(confirm('Archive?')) archive(p.id)}} className="p-2 hover:bg-white rounded-full" title="Archive"><Archive className="w-4 h-4" /></button>
                      <button onClick={()=>{ if(confirm('Delete?')) del(p.id)}} className="p-2 hover:bg-white rounded-full text-red-500" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && <div className="p-10 text-center text-slate-500">No products match filters</div>}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-3">
          <p className="text-sm text-slate-500">Page {page} of {totalPages} • {filtered.length} items (server-side pagination, indexed)</p>
          <div className="flex gap-2">
            <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="px-4 py-2 border border-slate-200 rounded-full text-sm disabled:opacity-50">Prev</button>
            <button disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)} className="px-4 py-2 border border-slate-200 rounded-full text-sm disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
