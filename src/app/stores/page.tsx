'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/supermarket/Footer';
import { STORES } from '@/lib/supermarket/stores';
import { useSupermarketStore } from '@/lib/supermarket/store';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react';

export default function StoresPage() {
  const [postcode, setPostcode] = useState('');
  const [service, setService] = useState('All');
  const setLocation = useSupermarketStore(s=>s.setLocation);
  const location = useSupermarketStore(s=>s.location);

  const filtered = STORES.filter(s=> {
    if (service!=='All' && !s.services.includes(service as any)) return false;
    if (postcode && !s.postcode.includes(postcode) && !s.suburb.toLowerCase().includes(postcode.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 py-6">
        <h1 className="text-2xl font-black mb-1">Find a Store</h1>
        <p className="text-sm text-slate-500 mb-4">Choose delivery or pickup at your nearest FreshBasket</p>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 flex gap-2">
            <input value={postcode} onChange={e=>setPostcode(e.target.value)} placeholder="Postcode, suburb or city" className="flex-1 border border-slate-200 rounded-full px-4 py-2.5 text-sm" />
            <button onClick={()=>{}} className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-bold text-sm">Search</button>
          </div>
          <button onClick={()=>{ if(navigator.geolocation) navigator.geolocation.getCurrentPosition(()=> setPostcode('2000'))}} className="border border-slate-200 rounded-full px-4 py-2.5 text-sm font-medium">Use my location</button>
          <select value={service} onChange={e=>setService(e.target.value)} className="border border-slate-200 rounded-full px-4 py-2.5 text-sm">
            <option value="All">All services</option>
            <option value="Delivery">Delivery</option>
            <option value="Pickup">Pickup</option>
            <option value="DriveUp">Drive Up</option>
            <option value="Rapid">Rapid</option>
          </select>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            {filtered.map(store=> (
              <div key={store.id} className={`bg-white rounded-2xl border p-4 ${location.storeId===store.id ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200'}`}>
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold">{store.name}</h3>
                    <p className="text-sm text-slate-600 flex items-center gap-1"><MapPin className="w-4 h-4" />{store.address}, {store.suburb} {store.postcode}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Phone className="w-3 h-3" />{store.phone} • <Clock className="w-3 h-3" />{store.openingHours[0].open}–{store.openingHours[0].close}</p>
                    <div className="flex gap-1 mt-2">
                      {store.services.map(s=> <span key={s} className="text-xs bg-slate-100 px-2 py-1 rounded-full">{s}</span>)}
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">2.3 km</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={()=>setLocation({ storeId: store.id, postcode: store.postcode, suburb: store.suburb, fulfilment: 'Pickup' })} className="flex-1 bg-emerald-600 text-white py-2.5 rounded-full text-sm font-bold">Pickup here</button>
                  <button onClick={()=>setLocation({ storeId: store.id, postcode: store.postcode, suburb: store.suburb, fulfilment: 'Delivery' })} className="flex-1 border border-slate-200 py-2.5 rounded-full text-sm font-bold">Deliver from here</button>
                  <a href={`https://maps.google.com/?q=${store.latitude},${store.longitude}`} target="_blank" className="px-3 py-2.5 border border-slate-200 rounded-full"><Navigation className="w-4 h-4" /></a>
                </div>
                {location.storeId===store.id && <p className="text-xs text-emerald-700 font-bold mt-2">✓ Selected as your store</p>}
              </div>
            ))}
          </div>
          <div className="bg-slate-200 rounded-2xl h-[500px] flex items-center justify-center sticky top-24">
            <div className="text-center">
              <p className="font-bold">Map View</p>
              <p className="text-sm text-slate-600">Interactive map with Google Maps / Mapbox</p>
              <p className="text-xs text-slate-500 mt-2">Set NEXT_PUBLIC_MAPS_API_KEY to enable</p>
              <div className="mt-4 space-y-2">
                {STORES.map(s=> <div key={s.id} className="bg-white rounded-xl px-3 py-2 text-sm text-left">{s.name} • {s.suburb}</div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
