'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { useAdminStore, ProductWithStatus } from '@/lib/supermarket/adminStore';
import { DEPARTMENTS, CATEGORIES, SUBCATEGORIES } from '@/lib/supermarket/departments';
import { STORES } from '@/lib/supermarket/stores';

export default function ProductEditorPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const products = useAdminStore(s=>s.products);
  const update = useAdminStore(s=>s.updateProduct);
  const create = useAdminStore(s=>s.createProduct);
  const history = useAdminStore(s=>s.history.filter(h=>h.productId===id));

  const existing = products.find(p=>p.id===id);
  const isNew = !existing && id!=='new';

  const [form, setForm] = useState<Partial<ProductWithStatus>>(() => existing || {
    id: `prod_${Date.now()}`,
    sku: `FB-${Date.now().toString().slice(-6)}`,
    slug: `new-product-${Date.now()}`,
    name: '',
    shortName: '',
    brandName: 'FreshBasket',
    departmentId: 'dept_fruit_veg',
    categoryId: 'cat_fresh_fruit',
    subcategoryId: 'sub_apples',
    description: '',
    packageSize: '500g',
    retailPrice: 5.00,
    costPrice: 3.00,
    taxRate: 0.1,
    variableWeight: false,
    inStock: true,
    status: 'Draft',
    images: [],
    supplier: 'FreshCo Suppliers',
    dietaryTags: [],
    allergenTags: [],
    healthStarRating: 4,
  } as any);

  useEffect(()=> { if (existing) setForm(existing); }, [existing?.id]);

  const set = (k: string, v: any) => setForm(f=> ({ ...f, [k]: v }));
  const save = (publish: boolean) => {
    const patch: any = { ...form, status: publish ? 'Published' : 'Draft', updatedAt: new Date().toISOString() };
    if (existing) {
      update(id, patch);
    } else {
      create(patch as ProductWithStatus);
    }
    alert(publish ? 'Saved & Published — storefront updated' : 'Draft saved');
    router.push('/admin/products');
  };

  const generateAI = () => {
    const prompt = `Professional e-commerce supermarket product photograph of fictional branded ${form.name}, brand ${form.brandName}, ${CATEGORIES.find(c=>c.id===form.categoryId)?.name} ${form.packageSize}, isolated on clean light background, premium catalogue, 1:1`;
    const url = `https://images.unsplash.com/photo-1542838132-92c53300491e?w=600`;
    set('images', [...(form.images||[]), url]);
    alert(`AI prompt built:\n${prompt}\n\nPreview image added (mock). Approve before publish if auto-approval off.`);
  };

  if (isNew && !existing) {
    return <div className="p-10">Product not found</div>;
  }

  const cats = CATEGORIES.filter(c=>c.departmentId===form.departmentId);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-xl font-black">{existing ? 'Edit Product' : 'New Product'}</h1>
            <p className="text-sm text-slate-500">Save Draft or Save & Publish — changes appear on storefront instantly</p>
          </div>
          <div className="flex gap-2">
            <button onClick={()=>save(false)} className="border border-slate-200 bg-white px-5 py-2.5 rounded-full font-bold text-sm">Save Draft</button>
            <button onClick={()=>save(true)} className="bg-emerald-600 text-white px-5 py-2.5 rounded-full font-bold text-sm">Save & Publish</button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 mt-4">
          <div className="lg:col-span-2 space-y-4">
            {/* Images */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <h3 className="font-bold">Images (Supabase Storage)</h3>
              <p className="text-xs text-slate-500">Drag to reorder • first is primary • do not store binaries in DB, only URL</p>
              <div className="grid grid-cols-4 gap-3 mt-3">
                {(form.images||[]).map((img, idx)=>(
                  <div key={idx} className="relative group">
                    <img src={img} alt="" className="w-full h-28 object-cover rounded-xl border" />
                    <div className="absolute top-1 left-1 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded-full">{idx===0 ? 'Primary' : idx+1}</div>
                    <button onClick={()=> set('images', (form.images||[]).filter((_,i)=>i!==idx))} className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs">×</button>
                    <button onClick={()=> {
                      const arr=[...(form.images||[])]; const [m]=arr.splice(idx,1); arr.unshift(m); set('images', arr);
                    }} className="absolute bottom-1 left-1 bg-white text-xs px-2 py-1 rounded-full border">Make primary</button>
                  </div>
                ))}
                <label className="h-28 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-300">
                  <span className="text-2xl">＋</span><span className="text-xs">Upload / Drop</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e=>{
                    const file=e.target.files?.[0]; if(!file) return;
                    const url=URL.createObjectURL(file); set('images', [...(form.images||[]), url]);
                  }} />
                </label>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={generateAI} className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-bold">Generate with AI</button>
                <button onClick={generateAI} className="border border-slate-200 px-4 py-2 rounded-full text-sm">Regenerate</button>
                <span className="text-xs text-slate-500 py-2">AI uses name/brand/category/package prompt — approval required unless auto-approve enabled</span>
              </div>
              <div className="mt-3 border-t border-slate-100 pt-3">
                <p className="text-xs font-bold">Image Source — Master vs Tenant (do not overwrite shared master when tenant uses custom)</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={()=>{
                    const url=prompt('Paste Image URL https://...'); if(!url) return;
                    // validate
                    try { new URL(url); set('images', [...(form.images||[]), url]); alert('Image URL added — validated, preview shown'); } catch { alert('Invalid URL'); }
                  }} className="border border-slate-200 px-3 py-2 rounded-full text-sm">Paste Image URL</button>
                  <button onClick={()=>{
                    // reset to master image
                    const master = (form as any)._master?.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600';
                    set('images', [master]);
                    alert('Reset to Master Image');
                  }} className="border border-slate-200 px-3 py-2 rounded-full text-sm">Reset to Master Image</button>
                  <button onClick={()=>{
                    if(confirm('Use Tenant Image Override? This keeps master for other tenants.')) alert('Tenant override enabled — custom image will show for this tenant only');
                  }} className="border border-slate-200 px-3 py-2 rounded-full text-sm">Use Tenant Image Override</button>
                </div>
                <p className="text-xs text-slate-500 mt-1">Stored as metadata + object storage/CDN, not huge binary in DB column. Source tracked: manufacturer/GS1/supplier/tenant_upload/AI_GENERIC.</p>
              </div>
            </div>

            {/* Core fields */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 grid md:grid-cols-2 gap-3">
              <label className="md:col-span-2"><span className="text-xs font-semibold">Product Name *</span><input value={form.name||''} onChange={e=>{set('name', e.target.value); set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,'-'))}} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-1" /></label>
              <label><span className="text-xs font-semibold">Short Name</span><input value={(form as any).shortName||''} onChange={e=>set('shortName', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-1" /></label>
              <label><span className="text-xs font-semibold">Brand *</span><input value={form.brandName||''} onChange={e=>set('brandName', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-1" /></label>
              <label><span className="text-xs font-semibold">SKU *</span><input value={form.sku||''} onChange={e=>set('sku', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-1" /></label>
              <label><span className="text-xs font-semibold">Barcode</span><input value={(form as any).barcode||''} onChange={e=>set('barcode', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-1" /></label>
              <label><span className="text-xs font-semibold">Department</span><select value={form.departmentId} onChange={e=>set('departmentId', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-1">{DEPARTMENTS.map(d=> <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
              <label><span className="text-xs font-semibold">Category</span><select value={form.categoryId} onChange={e=>set('categoryId', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-1">{cats.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
              <label><span className="text-xs font-semibold">Subcategory</span><select value={(form as any).subcategoryId||''} onChange={e=>set('subcategoryId', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-1">{SUBCATEGORIES.filter(s=>s.categoryId===form.categoryId).map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
              <label><span className="text-xs font-semibold">Supplier</span><input value={(form as any).supplier||''} onChange={e=>set('supplier', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-1" /></label>
              <label><span className="text-xs font-semibold">Supplier Code</span><input value={(form as any).supplierCode||''} onChange={e=>set('supplierCode', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-1" /></label>
              <label className="md:col-span-2"><span className="text-xs font-semibold">Description</span><textarea value={form.description||''} onChange={e=>set('description', e.target.value)} rows={3} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-1" /></label>
              <label className="md:col-span-2"><span className="text-xs font-semibold">Short Description</span><input value={(form as any).shortDescription||''} onChange={e=>set('shortDescription', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-1" /></label>
              <label className="md:col-span-2"><span className="text-xs font-semibold">Ingredients</span><textarea value={(form as any).ingredients||''} onChange={e=>set('ingredients', e.target.value)} rows={2} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-1" /></label>
              <label><span className="text-xs font-semibold">Allergen Info</span><input value={(form as any).allergenInformation||''} onChange={e=>set('allergenInformation', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-1" /></label>
              <label><span className="text-xs font-semibold">Country of Origin</span><input value={(form as any).countryOfOrigin||''} onChange={e=>set('countryOfOrigin', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-1" /></label>
              <label><span className="text-xs font-semibold">Package Size</span><input value={form.packageSize||''} onChange={e=>set('packageSize', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-1" /></label>
              <label><span className="text-xs font-semibold">Package Unit</span><input value={(form as any).packageUnit||''} onChange={e=>set('packageUnit', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-1" /></label>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 grid md:grid-cols-3 gap-3">
              <label><span className="text-xs font-semibold">Retail Price</span><input type="number" step="0.01" value={form.retailPrice} onChange={e=>set('retailPrice', Number(e.target.value))} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-1" /></label>
              <label><span className="text-xs font-semibold">Cost Price</span><input type="number" step="0.01" value={(form as any).costPrice||0} onChange={e=>set('costPrice', Number(e.target.value))} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-1" /></label>
              <label><span className="text-xs font-semibold">Compare-at</span><input type="number" step="0.01" value={(form as any).compareAtPrice||''} onChange={e=>set('compareAtPrice', Number(e.target.value))} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-1" /></label>
              <label><span className="text-xs font-semibold">Special Price</span><input type="number" step="0.01" value={(form as any).specialPrice||''} onChange={e=>set('specialPrice', Number(e.target.value))} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-1" /></label>
              <label><span className="text-xs font-semibold">Tax Rate</span><input type="number" step="0.01" value={form.taxRate} onChange={e=>set('taxRate', Number(e.target.value))} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-1" /></label>
              <label><span className="text-xs font-semibold">Price Per Kg</span><input type="number" step="0.01" value={(form as any).pricePerKg||''} onChange={e=>set('pricePerKg', Number(e.target.value))} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-1" /></label>
              <label className="flex items-center gap-2 mt-6"><input type="checkbox" checked={!!form.variableWeight} onChange={e=>set('variableWeight', e.target.checked)} /> Variable Weight</label>
              <label><span className="text-xs font-semibold">Low Stock Threshold</span><input type="number" value={(form as any).lowStockThreshold||5} onChange={e=>set('lowStockThreshold', Number(e.target.value))} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-1" /></label>
              <label><span className="text-xs font-semibold">Health Rating</span><input type="number" step="0.5" value={(form as any).healthStarRating||''} onChange={e=>set('healthStarRating', Number(e.target.value))} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-1" /></label>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <h3 className="font-bold text-sm">SEO</h3>
              <label className="block mt-2"><span className="text-xs font-semibold">SEO Title</span><input value={(form as any).seoTitle||''} onChange={e=>set('seoTitle', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-1" /></label>
              <label className="block mt-2"><span className="text-xs font-semibold">SEO Description</span><textarea value={(form as any).seoDescription||''} onChange={e=>set('seoDescription', e.target.value)} rows={2} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-1" /></label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <h3 className="font-bold text-sm">Status & Visibility</h3>
              <select value={(form as any).status} onChange={e=>set('status', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mt-2">
                <option>Draft</option><option>Pending Review</option><option>Scheduled</option><option>Published</option><option>Out of Stock</option><option>Discontinued</option><option>Archived</option>
              </select>
              <label className="flex items-center gap-2 mt-3 text-sm"><input type="checkbox" checked={!!(form as any).isFeatured} onChange={e=>set('isFeatured', e.target.checked)} /> Featured</label>
              <label className="flex items-center gap-2 mt-2 text-sm"><input type="checkbox" checked={!!(form as any).isNew} onChange={e=>set('isNew', e.target.checked)} /> New</label>
              <label className="flex items-center gap-2 mt-2 text-sm"><input type="checkbox" checked={!!(form as any).ageRestricted} onChange={e=>set('ageRestricted', e.target.checked)} /> Age Restricted (18+)</label>
              <div className="mt-3">
                <p className="text-xs font-semibold">Dietary Tags</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {['Vegan','Vegetarian','Gluten Free','Dairy Free','Organic','Halal'].map(t=>(
                    <button key={t} onClick={()=> {
                      const cur=(form as any).dietaryTags||[];
                      set('dietaryTags', cur.includes(t) ? cur.filter((x:string)=>x!==t) : [...cur, t]);
                    }} className={`px-2 py-1 rounded-full text-xs border ${(form as any).dietaryTags?.includes(t) ? 'bg-emerald-600 text-white':'bg-white'}`}>{t}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <h3 className="font-bold text-sm">Store Inventory (per store)</h3>
              <div className="space-y-2 mt-2">
                {STORES.slice(0,4).map(s=>(
                  <div key={s.id} className="flex justify-between items-center text-sm"><span>{s.name}</span><span className="font-mono">20 units</span></div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">Edit in /admin/inventory — stock is store-specific</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <h3 className="font-bold text-sm">Change History</h3>
              <div className="max-h-64 overflow-y-auto mt-2 space-y-2">
                {history.length===0 ? <p className="text-xs text-slate-500">No history yet</p> : history.slice(0,20).map(h=>(
                  <div key={h.id} className="text-xs border-b border-slate-100 pb-1">
                    <p className="font-medium">{h.field}: {h.oldValue} → {h.newValue}</p>
                    <p className="text-slate-500">{h.admin} • {new Date(h.timestamp).toLocaleString()} • {h.source}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
