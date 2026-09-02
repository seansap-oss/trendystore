'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import { MASTER_CATALOGUE } from '@/lib/supermarket/india/masterCatalogue';

export default function MasterImportReviewPage() {
  const [batch] = useState({
    id:'BATCH-2026-08-28-001',
    source:'Dukaan Storefront (ashirwad-supermarket)',
    productsFound: 4386,
    exactMatches: 1240,
    possibleMatches: 320,
    newProducts: 1820,
    missingBarcode: 210,
    missingCategory: 45,
    missingMrp: 12,
    missingImages: 180,
    conflicts: 8,
    errors: ['Row 12: invalid barcode', 'Row 88: price 0'],
  });

  // Mock source products
  const [filter, setFilter] = useState<'all'|'new'|'possible'>('all');

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        <h1 className="text-2xl font-black">Master Catalogue — Import Review</h1>
        <p className="text-sm text-slate-500">Dukaan discovery via window.DukaanData (public storefront only, no auth/CAPTCHA bypass). Source → Validate → Normalize → Match → Review → Master</p>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 mt-3">
          <div className="flex flex-wrap gap-2">
            <span className="font-bold">Batch:</span> {batch.id} • {batch.source}
            <span className="ml-auto text-xs bg-slate-900 text-white px-3 py-1 rounded-full">Only public data — rate-limit respected</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            <div className="bg-slate-50 rounded-xl p-3 text-center"><p className="text-xl font-black">{batch.productsFound}</p><p className="text-xs">Products Found</p></div>
            <div className="bg-emerald-50 rounded-xl p-3 text-center"><p className="text-xl font-black">{batch.exactMatches}</p><p className="text-xs">Exact GTIN Matches</p></div>
            <div className="bg-amber-50 rounded-xl p-3 text-center"><p className="text-xl font-black">{batch.possibleMatches}</p><p className="text-xs">Possible Matches</p></div>
            <div className="bg-blue-50 rounded-xl p-3 text-center"><p className="text-xl font-black">{batch.newProducts}</p><p className="text-xs">New Master Products</p></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2 text-sm">
            <div>Missing Barcode: <b>{batch.missingBarcode}</b></div>
            <div>Missing Category: <b>{batch.missingCategory}</b> → map via source_category_mapping</div>
            <div>Missing MRP: <b>{batch.missingMrp}</b></div>
            <div>Missing Images: <b>{batch.missingImages}</b> → AI_GENERIC placeholder flagged</div>
          </div>
          <div className="mt-3">
            <p className="text-xs font-bold">Normalized Import Schema:</p>
            <p className="text-xs text-slate-500">externalId, name, brand, barcode, gtin, sku, description, categoryPath, packSize, mrp, sellingPrice, imageUrl, availability, source, rawData → common pipeline for Dukaan/CSV/GS1/Manufacturer</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 mt-4">
          <div className="flex gap-2">
            <button onClick={()=>setFilter('all')} className={`px-4 py-2 rounded-full text-sm font-bold ${filter==='all'?'bg-slate-900 text-white':'border'}`}>All</button>
            <button onClick={()=>setFilter('new')} className={`px-4 py-2 rounded-full text-sm font-bold ${filter==='new'?'bg-slate-900 text-white':'border'}`}>New</button>
            <button onClick={()=>setFilter('possible')} className={`px-4 py-2 rounded-full text-sm font-bold ${filter==='possible'?'bg-amber-500 text-white':'border'}`}>Possible Matches (manual review)</button>
            <span className="ml-auto text-xs">Matching priority: GTIN → SKU → brand+name+pack → fuzzy (high confidence only)</span>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs"><tr><th className="text-left p-2">Source Product</th><th className="text-left p-2">Barcode</th><th className="text-left p-2">Match</th><th className="text-left p-2">Category Map</th><th className="text-right p-2">Actions</th></tr></thead>
              <tbody>
                {MASTER_CATALOGUE.slice(0,12).map(m=>(
                  <tr key={m.id} className="border-t border-slate-100">
                    <td className="p-2">{m.productName} • {m.brandName} • {m.packSize}</td>
                    <td className="p-2 font-mono text-xs">{m.barcode}</td>
                    <td className="p-2"><span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">NEW PRODUCT</span></td>
                    <td className="p-2 text-xs">Dukaan: Atta → Master: Staples → Wheat Atta (mapped)</td>
                    <td className="p-2 text-right">
                      <div className="flex gap-1 justify-end">
                        <button className="border px-2 py-1 rounded-full text-xs">Review</button>
                        <button className="bg-emerald-600 text-white px-2 py-1 rounded-full text-xs">Approve</button>
                        <button className="border px-2 py-1 rounded-full text-xs">Merge</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-2 mt-4">
            <button className="flex-1 bg-emerald-600 text-white py-3 rounded-full font-black">Approve Selected → Master Catalogue</button>
            <button className="flex-1 border border-slate-300 py-3 rounded-full font-bold">Reject</button>
            <button className="border px-4 py-3 rounded-full text-sm">Map Category</button>
          </div>

          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs">
            <p className="font-bold">Image Policy:</p>
            <p>Branded packs → prefer manufacturer/GS1/supplier authorized; unauthorized competitor photos not copied. Missing → neutral placeholder + flag IMAGE REQUIRED. AI only for fresh/unbranded.</p>
            <p className="font-bold mt-2">Pricing Safety:</p>
            <p>MRP ₹250 → selling ₹275 → WARNING exceeds MRP, requires correction.</p>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-4 mt-4 text-xs">
          <p className="font-bold">Import Audit (run before completion):</p>
          <p>SOURCE PRODUCTS FOUND: {batch.productsFound} | EXACT GTIN: {batch.exactMatches} | FUZZY: {batch.possibleMatches} | NEW MASTER: {batch.newProducts} | WITH MRP: {batch.productsFound-batch.missingMrp} | WITH IMAGES: {batch.productsFound-batch.missingImages} | UNMAPPED CATEGORIES: {batch.missingCategory} | ERRORS: {batch.errors.length}</p>
        </div>
      </div>
    </div>
  );
}
