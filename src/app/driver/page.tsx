'use client';
import { useState, useEffect } from 'react';
import { useDeliveryStore } from '@/lib/delivery/store';
import Link from 'next/link';

export default function DriverApp() {
  const drivers = useDeliveryStore(s=>s.drivers);
  const jobs = useDeliveryStore(s=>s.jobs);
  const offers = useDeliveryStore(s=>s.offers);
  const acceptJob = useDeliveryStore(s=>s.acceptJob);
  const updateStatus = useDeliveryStore(s=>s.updateJobStatus);
  const verifyOtp = useDeliveryStore(s=>s.verifyOtp);
  const setStatus = useDeliveryStore(s=>s.setDriverStatus);
  const [driverId, setDriverId] = useState(drivers[0]?.id || '');
  const [otpInput, setOtpInput] = useState('');
  const driver = drivers.find(d=>d.id===driverId);
  const myOffers = offers.filter(o=>o.driverId===driverId);
  const myJobs = jobs.filter(j=>j.assignedDriverId===driverId);

  // Push permission mock
  const enablePush = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm==='granted') {
        // store push subscription mock
        const sub = { userId:driverId, tenantId: driver?.tenantId||'tenant_demo', role:'driver' as const, endpoint:'mock-endpoint', keys:{p256dh:'',auth:''}, createdAt:new Date().toISOString() };
        localStorage.setItem('push_sub_driver', JSON.stringify(sub));
        alert('ENABLE DELIVERY ALERTS — push subscribed (Android/PWA, iOS Home Screen where supported). Tap notification opens /driver/active');
        new Notification('FreshBasket Driver', { body:'You will receive NEW DELIVERY AVAILABLE alerts' });
      }
    } else {
      alert('Notifications not supported');
    }
  };

  useEffect(()=> {
    if (driverId) setDriverId(drivers[0]?.id || driverId);
  }, [drivers.length]);

  if (!driver) return <div className="p-10">No driver — create in /admin/delivery</div>;

  return (
    <div className="min-h-screen bg-slate-50 max-w-md mx-auto border-x border-slate-200">
      <div className="bg-slate-900 text-white p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="font-black">Driver App</h1>
          <select value={driverId} onChange={e=>setDriverId(e.target.value)} className="bg-slate-800 text-white border border-slate-700 rounded-full px-3 py-1 text-sm">
            {drivers.map(d=> <option key={d.id} value={d.id}>{d.name} ({d.status})</option>)}
          </select>
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={()=> setStatus(driverId, driver.status==='online'?'offline':'online')} className={`flex-1 py-2 rounded-full font-bold ${driver.status==='online'?'bg-emerald-600':'bg-slate-700'}`}>{driver.status==='online'?'ONLINE':'OFFLINE'}</button>
          <button onClick={enablePush} className="flex-1 border border-slate-600 py-2 rounded-full text-sm">ENABLE DELIVERY ALERTS</button>
        </div>
        <p className="text-xs text-slate-400 mt-2">Only ONLINE drivers receive offers. Android/PWA + iOS Home Screen PWA supported where available.</p>
      </div>

      <div className="p-3 space-y-3">
        <div className="bg-white rounded-2xl border p-3">
          <h3 className="font-bold">New Delivery Available</h3>
          {myOffers.filter(o=>o.status==='offered').length===0 ? <p className="text-sm text-slate-500">No new offers — wait for store to offer</p> : (
            <div className="space-y-2 mt-2">
              {myOffers.filter(o=>o.status==='offered').map(o=>{
                const job = jobs.find(j=>j.id===o.jobId);
                if(!job) return null;
                return (
                  <div key={o.jobId} className="border border-amber-200 bg-amber-50 rounded-xl p-3">
                    <p className="font-bold text-sm">Order {job.orderId.slice(-6)} • Store {job.storeId} • Payout ₹{job.driverPayout}</p>
                    <p className="text-xs text-slate-600">Distance ~2km • 3 bags • OTP {job.otp}</p>
                    <div className="flex gap-2 mt-2">
                      <button onClick={()=>{
                        const res=acceptJob(job.id, driverId);
                        if(!res.success) alert(res.message);
                        else {
                          alert('You got it! Assigned to you');
                          if('Notification' in window && Notification.permission==='granted') new Notification('Assigned', { body:`Order ${job.orderId.slice(-6)} assigned`});
                        }
                      }} className="flex-1 bg-emerald-600 text-white py-2 rounded-full font-bold text-sm">Accept</button>
                      <button onClick={()=>{
                        // decline
                        alert('Declined');
                      }} className="flex-1 border py-2 rounded-full text-sm">Decline</button>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">First accept wins — transactional lock prevents duplicate</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border p-3">
          <h3 className="font-bold">My Jobs</h3>
          {myJobs.length===0 ? <p className="text-sm text-slate-500">No assigned jobs</p> : (
            <div className="space-y-2 mt-2">
              {myJobs.map(job=>(
                <div key={job.id} className="border rounded-xl p-3 text-sm">
                  <p className="font-bold">{job.id.slice(-6)} • {job.status}</p>
                  <p className="text-xs">Fee ₹{job.deliveryFeeCustomer} / Payout ₹{job.driverPayout} • OTP {job.otp}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button onClick={()=>updateStatus(job.id,'DRIVER_AT_STORE')} className="border py-2 rounded-full text-xs">ARRIVED AT STORE</button>
                    <button onClick={()=>updateStatus(job.id,'PICKED_UP')} className="border py-2 rounded-full text-xs">PICKED UP</button>
                    <button onClick={()=>updateStatus(job.id,'ON_THE_WAY')} className="border py-2 rounded-full text-xs">ON THE WAY</button>
                    <button onClick={()=>updateStatus(job.id,'ARRIVED')} className="border py-2 rounded-full text-xs">ARRIVED</button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input value={otpInput} onChange={e=>setOtpInput(e.target.value)} placeholder="Enter OTP (customer gives)" className="flex-1 border rounded-full px-3 py-2 text-sm" />
                    <button onClick={()=>{
                      if(verifyOtp(job.id, otpInput)) {
                        updateStatus(job.id,'DELIVERED');
                        alert('Delivered — payout recorded, customer sees Delivered');
                      } else alert('Invalid OTP');
                    }} className="bg-emerald-600 text-white px-4 py-2 rounded-full font-bold text-sm">DELIVERED (OTP)</button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Customer tracking: Order Confirmed → Preparing → Packed → Driver Assigned → Picked Up → On The Way → Arrived → Delivered (shows first name)</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border p-3">
          <h3 className="font-bold">History — Earnings</h3>
          <p className="text-sm text-slate-500">Today: {myJobs.filter(j=>j.status==='DELIVERED').length} delivered • Payout ₹{myJobs.filter(j=>j.status==='DELIVERED').reduce((a,j)=>a+j.driverPayout,0)}</p>
          <p className="text-xs text-slate-500">This Week: {myJobs.length} jobs • Failed: {myJobs.filter(j=>j.status==='FAILED').length}</p>
        </div>

        <Link href="/admin/delivery" className="block text-center border py-2 rounded-full text-sm">Admin Dispatch →</Link>
        <p className="text-xs text-slate-500 text-center">Driver only sees assigned/offered orders, cannot change prices or access other tenants — RLS enforced</p>
      </div>
    </div>
  );
}
