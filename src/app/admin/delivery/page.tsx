'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import { useDeliveryStore, calculateDeliveryFee } from '@/lib/delivery/store';
import { useTenantStore } from '@/lib/supermarket/india/tenantStore';
import Link from 'next/link';

export default function AdminDeliveryPage() {
  const tenantId = useTenantStore(s=>s.tenantId);
  const settings = useDeliveryStore(s=>s.getSettings(tenantId));
  const update = useDeliveryStore(s=>s.updateSettings);
  const drivers = useDeliveryStore(s=>s.drivers.filter(d=>d.tenantId===tenantId));
  const jobs = useDeliveryStore(s=>s.jobs.filter(j=>j.tenantId===tenantId));
  const [tab, setTab] = useState<'settings'|'drivers'|'dispatch'>('settings');
  const [testDistance, setTestDistance] = useState(3);
  const [testOrder, setTestOrder] = useState(450);
  const fee = calculateDeliveryFee(settings, testDistance, testOrder, 'A');

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-4">
        <h1 className="text-2xl font-black">Delivery Management — Tenant Control</h1>
        <p className="text-sm text-slate-500">Tenant controls delivery; settings snapshot on order; tenant isolation enforced</p>
        <div className="flex gap-2 mt-3">
          <button onClick={()=>setTab('settings')} className={`px-4 py-2 rounded-full text-sm font-bold ${tab==='settings'?'bg-slate-900 text-white':'border'}`}>Settings</button>
          <button onClick={()=>setTab('drivers')} className={`px-4 py-2 rounded-full text-sm font-bold ${tab==='drivers'?'bg-slate-900 text-white':'border'}`}>Drivers</button>
          <button onClick={()=>setTab('dispatch')} className={`px-4 py-2 rounded-full text-sm font-bold ${tab==='dispatch'?'bg-slate-900 text-white':'border'}`}>Dispatch Dashboard</button>
          <Link href="/driver" className="ml-auto border px-4 py-2 rounded-full text-sm">Driver App →</Link>
        </div>

        {tab==='settings' && (
          <div className="space-y-4 mt-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <label className="flex items-center gap-2 font-bold"><input type="checkbox" checked={settings.enabled} onChange={e=>update(tenantId,{enabled:e.target.checked})} /> Enable Delivery</label>
              <div className="grid md:grid-cols-2 gap-3 mt-3">
                <label><span className="text-xs font-semibold">Minimum Order ₹</span><input type="number" value={settings.minimumOrder} onChange={e=>update(tenantId,{minimumOrder:Number(e.target.value)})} className="w-full border rounded-xl px-3 py-2 text-sm mt-1" /></label>
                <label><span className="text-xs font-semibold">Free Above ₹</span><input type="number" value={settings.freeDeliveryThreshold} onChange={e=>update(tenantId,{freeDeliveryThreshold:Number(e.target.value)})} className="w-full border rounded-xl px-3 py-2 text-sm mt-1" /></label>
                <label><span className="text-xs font-semibold">Max Radius km</span><input type="number" value={settings.maximumRadiusKm} onChange={e=>update(tenantId,{maximumRadiusKm:Number(e.target.value)})} className="w-full border rounded-xl px-3 py-2 text-sm mt-1" /></label>
                <label><span className="text-xs font-semibold">Slot Duration mins</span><input type="number" value={settings.slotDurationMins} onChange={e=>update(tenantId,{slotDurationMins:Number(e.target.value)})} className="w-full border rounded-xl px-3 py-2 text-sm mt-1" /></label>
                <label><span className="text-xs font-semibold">Max Orders/Slot</span><input type="number" value={settings.maxOrdersPerSlot} onChange={e=>update(tenantId,{maxOrdersPerSlot:Number(e.target.value)})} className="w-full border rounded-xl px-3 py-2 text-sm mt-1" /></label>
                <label className="flex items-center gap-2 mt-6"><input type="checkbox" checked={settings.codAllowed} onChange={e=>update(tenantId,{codAllowed:e.target.checked})} /> Cash on Delivery</label>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <h3 className="font-bold">Delivery Fee Mode</h3>
              <select value={settings.feeMode} onChange={e=>update(tenantId,{feeMode:e.target.value as any})} className="w-full border rounded-xl px-3 py-2 text-sm mt-2">
                <option value="FLAT">Flat Rate</option>
                <option value="DISTANCE">Distance Based</option>
                <option value="ZONE">Zone Based</option>
                <option value="FREE_ABOVE">Free Above Threshold</option>
                <option value="COMBINED">Combined Rules</option>
              </select>
              {settings.feeMode==='FLAT' && <label className="block mt-2"><span className="text-xs">Flat Rate ₹</span><input type="number" value={settings.flatRate} onChange={e=>update(tenantId,{flatRate:Number(e.target.value)})} className="w-full border rounded-xl px-3 py-2 text-sm mt-1" /></label>}
              {settings.feeMode==='DISTANCE' && (
                <div className="grid md:grid-cols-3 gap-2 mt-2">
                  <label><span className="text-xs">Base ₹</span><input type="number" value={settings.distanceBase} onChange={e=>update(tenantId,{distanceBase:Number(e.target.value)})} className="w-full border rounded-xl px-3 py-2 text-sm" /></label>
                  <label><span className="text-xs">Included km</span><input type="number" value={settings.distanceIncludedKm} onChange={e=>update(tenantId,{distanceIncludedKm:Number(e.target.value)})} className="w-full border rounded-xl px-3 py-2 text-sm" /></label>
                  <label><span className="text-xs">Per km ₹</span><input type="number" value={settings.distancePerKm} onChange={e=>update(tenantId,{distancePerKm:Number(e.target.value)})} className="w-full border rounded-xl px-3 py-2 text-sm" /></label>
                </div>
              )}
              {settings.feeMode==='ZONE' && (
                <div className="mt-2">
                  {settings.zoneRates?.map((z,i)=>(
                    <div key={i} className="flex gap-2 mt-1">
                      <input value={z.zone} onChange={e=>{
                        const arr=[...(settings.zoneRates||[])]; arr[i]={...arr[i], zone:e.target.value}; update(tenantId,{zoneRates:arr});
                      }} className="border rounded-xl px-3 py-2 text-sm w-20" />
                      <input type="number" value={z.rate} onChange={e=>{
                        const arr=[...(settings.zoneRates||[])]; arr[i]={...arr[i], rate:Number(e.target.value)}; update(tenantId,{zoneRates:arr});
                      }} className="border rounded-xl px-3 py-2 text-sm w-24" />
                    </div>
                  ))}
                </div>
              )}
              <div className="bg-slate-50 rounded-xl p-3 mt-3 flex gap-2 items-center text-sm">
                <span>Test: distance</span><input type="number" value={testDistance} onChange={e=>setTestDistance(Number(e.target.value))} className="w-16 border rounded-full px-2 py-1 text-sm" />km
                <span>order</span><input type="number" value={testOrder} onChange={e=>setTestOrder(Number(e.target.value))} className="w-20 border rounded-full px-2 py-1 text-sm" />₹
                <span className="font-bold">= Fee ₹{fee} (snapshot on order, future rule changes not affect old totals)</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Examples: Tenant A flat ₹40, Tenant B ₹30+distance — same software, different results, never shared</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs">
              <p className="font-bold">Delivery Areas / Postcodes / Operating Hours — serviceability validated server-side via pincode + lat/lng</p>
              <p>Customer address: street, postcode, city, state, landmark, lat/lng, delivery instructions — validated before slot offer.</p>
            </div>
          </div>
        )}

        {tab==='drivers' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mt-4">
            <div className="flex justify-between">
              <h3 className="font-bold">Drivers — tenant isolated, cannot see other tenants</h3>
              <button onClick={()=>{
                const name=prompt('Driver name'); if(!name) return;
                useDeliveryStore.getState().addDriver({ id:`drv_${Date.now()}`, tenantId, name, phone: '98'+Math.floor(Math.random()*1e8), status:'offline', isActive:true });
              }} className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold">Invite Driver</button>
            </div>
            <div className="mt-3 space-y-2">
              {drivers.map(d=>(
                <div key={d.id} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl text-sm">
                  <img src={`https://i.pravatar.cc/100?u=${d.id}`} alt="" className="w-8 h-8 rounded-full" />
                  <div className="flex-1"><p className="font-bold">{d.name}</p><p className="text-xs text-slate-500">{d.phone} • {d.vehicleType} {d.serviceZone? `• Zone ${d.serviceZone}`:''}</p></div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${d.status==='online' ? 'bg-emerald-100 text-emerald-700':'bg-slate-200'}`}>{d.status}</span>
                  <button onClick={()=> useDeliveryStore.getState().setDriverStatus(d.id, d.status==='online'?'offline':'online')} className="border px-3 py-1 rounded-full text-xs">{d.status==='online'?'Set Offline':'Set Online'}</button>
                  <span className="text-xs">{d.currentJobId ? `Job ${d.currentJobId.slice(-4)}` : 'No job'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='dispatch' && (
          <div className="space-y-3 mt-4">
            <div className="grid md:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl p-3 border"><p className="text-xs text-slate-500">Waiting for Driver</p><p className="text-xl font-black">{jobs.filter(j=>j.status==='READY_FOR_DRIVER'||j.status==='OFFERED').length}</p></div>
              <div className="bg-white rounded-xl p-3 border"><p className="text-xs text-slate-500">Assigned</p><p className="text-xl font-black">{jobs.filter(j=>j.status==='DRIVER_ASSIGNED').length}</p></div>
              <div className="bg-white rounded-xl p-3 border"><p className="text-xs text-slate-500">On the Way</p><p className="text-xl font-black">{jobs.filter(j=>j.status==='ON_THE_WAY').length}</p></div>
              <div className="bg-white rounded-xl p-3 border"><p className="text-xs text-slate-500">Delivered Today</p><p className="text-xl font-black">{jobs.filter(j=>j.status==='DELIVERED').length}</p></div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <h3 className="font-bold">Jobs</h3>
              {jobs.length===0 ? <p className="text-sm text-slate-500">No jobs — create order in checkout (delivery) to generate job. First-accept-wins via transaction.</p> : (
                <div className="space-y-2 mt-2">
                  {jobs.map(j=>(
                    <div key={j.id} className="flex justify-between p-2 border border-slate-100 rounded-xl text-sm">
                      <span>{j.id.slice(-6)} • {j.status} • Fee ₹{j.deliveryFeeCustomer} / Payout ₹{j.driverPayout}</span>
                      <span className="text-xs">{j.assignedDriverId || 'Unassigned'}</span>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={()=>{
                const jobId=`job_${Date.now()}`;
                const fee=40;
                const otp=Math.floor(1000+Math.random()*9000).toString();
                useDeliveryStore.getState().createJob({ id:jobId, tenantId, orderId:`ord_${Date.now()}`, storeId:'store_syd_cbd', status:'READY_FOR_DRIVER', deliveryFeeCustomer:fee, driverPayout:30, assignedDriverId: undefined, otp, createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() });
                useDeliveryStore.getState().offerToDrivers(jobId, drivers.filter(d=>d.status==='online').map(d=>d.id));
                alert(`Job ${jobId} offered to online drivers — OTP ${otp}`);
              }} className="mt-3 bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold">Create Demo Job (offer to online)</button>
              <p className="text-xs text-slate-500 mt-2">If no driver accepts in time → notify store → retry/expand/manual assign. Driver payout separate from customer fee.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
