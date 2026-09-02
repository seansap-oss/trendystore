'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { getAutocomplete } from '@/lib/supermarket/search';
import { useSupermarketStore } from '@/lib/supermarket/store';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const addRecent = useSupermarketStore(s => s.addRecentSearch);
  const recent = useSupermarketStore(s => s.recentSearches);

  const ac = getAutocomplete(query);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const onSubmit = (q: string) => {
    if (!q.trim()) return;
    addRecent(q);
    setOpen(false);
    window.location.href = `/shop?search=${encodeURIComponent(q)}`;
  };

  return (
    <div ref={ref} className="relative flex-1 max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={e => { if (e.key === 'Enter') onSubmit(query); if (e.key === 'Escape') setOpen(false); }}
          placeholder="Search products, brands, recipes and categories"
          className="w-full pl-11 pr-10 py-3 bg-slate-100 border border-slate-200 rounded-full text-sm placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      {open && (query.length >= 2 || recent.length > 0) && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
          {query.length < 2 ? (
            <div className="p-3">
              {recent.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-slate-500 px-2 py-1">Recent searches</p>
                  {recent.map(r => (
                    <button key={r} onClick={() => onSubmit(r)} className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl text-sm">{r}</button>
                  ))}
                </>
              )}
              <p className="text-xs text-slate-400 px-2 pt-2">Try: milk, gluten free bread, chicken breast</p>
            </div>
          ) : (
            <>
              {ac.suggestions.length > 0 && (
                <div className="p-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 px-2 py-1">Suggestions</p>
                  {ac.suggestions.map(s => (
                    <button key={s} onClick={() => onSubmit(s)} className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl text-sm flex items-center gap-2">
                      <Search className="w-4 h-4 text-slate-400" /> {s}
                    </button>
                  ))}
                </div>
              )}
              {ac.products.length > 0 && (
                <div className="p-2">
                  <p className="text-xs font-semibold text-slate-500 px-2 py-1">Products</p>
                  {ac.products.map(p => (
                    <Link key={p.id} href={`/product/${p.slug}`} onClick={() => setOpen(false)} className="flex items-center gap-3 px-2 py-2 hover:bg-slate-50 rounded-xl">
                      <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.brandName} • {p.packageSize}</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-700">${p.isSpecial && p.specialPrice ? p.specialPrice.toFixed(2) : p.retailPrice.toFixed(2)}</span>
                    </Link>
                  ))}
                  <Link href={`/shop?search=${encodeURIComponent(query)}`} onClick={() => setOpen(false)} className="block text-center text-sm font-medium text-emerald-700 py-2 hover:bg-emerald-50 rounded-xl mt-1">View all results for “{query}”</Link>
                </div>
              )}
              {ac.products.length === 0 && (
                <div className="p-6 text-center">
                  <p className="text-sm text-slate-600">No results for “{query}”</p>
                  <p className="text-xs text-slate-400 mt-1">Try checking spelling or use a different term</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
