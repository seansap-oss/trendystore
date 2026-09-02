'use client';
import { useState } from 'react';
import { MapPin, ChevronDown, Truck, Store as StoreIcon } from 'lucide-react';
import { useSupermarketStore } from '@/lib/supermarket/store';
import { STORES } from '@/lib/supermarket/stores';

export default function LocationSelector() {
  const location = useSupermarketStore(s => s.location);
  const setLocation = useSupermarketStore(s => s.setLocation);
  const [open, setOpen] = useState(false);
  const [postcode, setPostcode] = useState(location.postcode || '');

  const activeStore = STORES.find(s => s.id === location.storeId) || STORES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-sm"
      >
        <div className={`p-1.5 rounded-full ${location.fulfilment === 'Delivery' ? 'bg-emerald-100' : 'bg-orange-100'}`}>
          {location.fulfilment === 'Pickup' ? <StoreIcon className="w-4 h-4 text-orange-600" /> : <Truck className="w-4 h-4 text-emerald-600" />}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-xs font-semibold leading-none">{location.fulfilment || 'Choose location'}</p>
          <p className="text-xs text-slate-500 leading-none truncate max-w-[150px]">{location.postcode ? `${location.suburb || ''} ${location.postcode}`.trim() : activeStore.name}</p>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
        <MapPin className="w-4 h-4 text-slate-500 sm:hidden" />
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
          <h3 className="font-semibold text-sm mb-3">Where do you want to shop?</h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => setLocation({ fulfilment: 'Delivery' })}
              className={`p-3 rounded-xl border text-left ${location.fulfilment === 'Delivery' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}
            >
              <Truck className="w-5 h-5 mb-1" />
              <p className="text-sm font-semibold">Delivery</p>
              <p className="text-xs text-slate-500">To your door</p>
            </button>
            <button
              onClick={() => setLocation({ fulfilment: 'Pickup' })}
              className={`p-3 rounded-xl border text-left ${location.fulfilment === 'Pickup' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}
            >
              <StoreIcon className="w-5 h-5 mb-1" />
              <p className="text-sm font-semibold">Pickup</p>
              <p className="text-xs text-slate-500">Collect in store</p>
            </button>
          </div>

          <label className="text-xs font-medium text-slate-700">Postcode or suburb</label>
          <div className="flex gap-2 mt-1">
            <input
              value={postcode}
              onChange={e => setPostcode(e.target.value)}
              placeholder="e.g. 2000"
              className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
            />
            <button
              onClick={() => { setLocation({ postcode, suburb: '' }); setOpen(false); }}
              className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700"
            >Apply</button>
          </div>
          <button
            onClick={() => { if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(() => { setLocation({ postcode:'2000', suburb:'Sydney', fulfilment:'Delivery' }); setOpen(false); });
            }}}
            className="mt-2 text-xs text-emerald-700 font-medium hover:underline"
          >Use my location</button>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <p className="text-xs font-semibold mb-2">Nearest stores</p>
            {STORES.slice(0,3).map(s => (
              <button
                key={s.id}
                onClick={() => { setLocation({ storeId: s.id, postcode: s.postcode, suburb: s.suburb, fulfilment: location.fulfilment || 'Delivery' }); setOpen(false); }}
                className={`w-full text-left p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between ${location.storeId===s.id ? 'bg-emerald-50 border border-emerald-200' : ''}`}
              >
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-slate-500">{s.suburb} {s.postcode}</p>
                </div>
                <span className="text-xs text-slate-400">2.1 km</span>
              </button>
            ))}
            <a href="/stores" className="block text-center text-sm text-emerald-700 font-medium mt-2">View all stores</a>
          </div>
        </div>
      )}
    </div>
  );
}
