'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { DEPARTMENTS, CATEGORIES, SUBCATEGORIES } from '@/lib/supermarket/departments';

export default function MegaMenu() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <nav className="hidden lg:flex items-center gap-1 px-4">
      {DEPARTMENTS.filter(d=>d.isActive).slice(0,8).map(dept => {
        const cats = CATEGORIES.filter(c=>c.departmentId===dept.id);
        return (
          <div key={dept.id} className="relative" onMouseEnter={()=>setOpen(dept.id)} onMouseLeave={()=>setOpen(null)}>
            <Link href={`/shop/${dept.slug}`} className="flex items-center gap-1 px-3 py-3 text-sm font-medium text-slate-700 hover:text-emerald-700">
              <span>{dept.icon}</span>{dept.name} {cats.length>0 && <ChevronDown className="w-3.5 h-3.5" />}
            </Link>
            {cats.length>0 && open===dept.id && (
              <div className="absolute top-full left-0 w-[720px] bg-white rounded-2xl shadow-xl border border-slate-200 p-6 z-40 grid grid-cols-3 gap-6">
                {cats.map(cat => {
                  const subs = SUBCATEGORIES.filter(s=>s.categoryId===cat.id);
                  return (
                    <div key={cat.id}>
                      <Link href={`/shop/${dept.slug}/${cat.slug}`} className="font-semibold text-sm text-slate-900 hover:text-emerald-700">{cat.name}</Link>
                      <ul className="mt-2 space-y-1">
                        {subs.map(sub => (
                          <li key={sub.id}><Link href={`/shop/${dept.slug}/${cat.slug}/${sub.slug}`} className="text-sm text-slate-600 hover:text-emerald-700">{sub.name}</Link></li>
                        ))}
                        {subs.length===0 && <li className="text-xs text-slate-400">Browse all {cat.name}</li>}
                      </ul>
                    </div>
                  );
                })}
                <div className="col-span-3 pt-4 border-t border-slate-100 flex justify-between">
                  <Link href={`/shop/${dept.slug}`} className="text-sm font-medium text-emerald-700 hover:underline">View all {dept.name} →</Link>
                  <span className="text-xs text-slate-400">Over 100 products</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <Link href="/shop/specials" className="px-3 py-1.5 bg-red-600 text-white rounded-full text-sm font-bold">Specials</Link>
    </nav>
  );
}
