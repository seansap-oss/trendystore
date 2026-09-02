'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { DeliverySettings, Driver, DeliveryJob, DeliveryOffer } from './types';

const DEFAULT_SETTINGS: DeliverySettings = {
  tenantId:'tenant_demo',
  enabled:true,
  minimumOrder:199,
  freeDeliveryThreshold:999,
  maximumRadiusKm:10,
  slotDurationMins:60,
  maxOrdersPerSlot:12,
  codAllowed:true,
  onlinePaymentRequired:false,
  contactless:false,
  feeMode:'FLAT',
  flatRate:40,
  distanceBase:30,
  distanceIncludedKm:2,
  distancePerKm:10,
  zoneRates:[{zone:'A', rate:30},{zone:'B', rate:50},{zone:'C', rate:80}],
  snapshotOnOrder:true,
};

interface DeliveryState {
  settings: Record<string, DeliverySettings>;
  drivers: Driver[];
  jobs: DeliveryJob[];
  offers: DeliveryOffer[];
  getSettings: (tenantId:string)=> DeliverySettings;
  updateSettings: (tenantId:string, patch:Partial<DeliverySettings>)=>void;
  addDriver: (d:Driver)=>void;
  setDriverStatus: (id:string, status:'online'|'offline')=>void;
  createJob: (job:DeliveryJob)=>void;
  offerToDrivers: (jobId:string, driverIds:string[])=>void;
  acceptJob: (jobId:string, driverId:string)=> { success:boolean; message:string };
  updateJobStatus: (jobId:string, status:DeliveryJob['status'])=>void;
  verifyOtp: (jobId:string, otp:string)=>boolean;
}

export const useDeliveryStore = create<DeliveryState>()(
  persist(
    (set,get)=> ({
      settings: { 'tenant_demo': DEFAULT_SETTINGS },
      drivers: [
        { id:'drv_1', tenantId:'tenant_demo', name:'Ravi Kumar', phone:'9876543210', status:'online', vehicleType:'Bike', isActive:true, serviceZone:'A' },
        { id:'drv_2', tenantId:'tenant_demo', name:'Amit Singh', phone:'9876543211', status:'online', vehicleType:'Bike', isActive:true, serviceZone:'B' },
        { id:'drv_3', tenantId:'tenant_demo', name:'Sunita', phone:'9876543212', status:'offline', vehicleType:'Scooter', isActive:true },
      ],
      jobs: [],
      offers: [],
      getSettings: (tenantId)=> get().settings[tenantId] || DEFAULT_SETTINGS,
      updateSettings: (tenantId, patch)=> set(s=> ({
        settings: { ...s.settings, [tenantId]: { ...(s.settings[tenantId]||DEFAULT_SETTINGS), ...patch, tenantId } }
      })),
      addDriver: (d)=> set(s=> ({ drivers: [...s.drivers, d]})),
      setDriverStatus: (id,status)=> set(s=> ({ drivers: s.drivers.map(d=> d.id===id ? {...d, status}:d)})),
      createJob: (job)=> set(s=> ({ jobs: [job, ...s.jobs]})),
      offerToDrivers: (jobId, driverIds)=> set(s=>{
        const now=new Date().toISOString();
        const newOffers = driverIds.map(driverId=> ({ jobId, driverId, status:'offered' as const, offeredAt: now }));
        return {
          offers: [...newOffers, ...s.offers],
          jobs: s.jobs.map(j=> j.id===jobId ? {...j, status:'OFFERED' as const, offeredAt: now}:j)
        };
      }),
      // First-accept-wins transactional (in-memory lock)
      acceptJob: (jobId, driverId)=> {
        const s=get();
        const job=s.jobs.find(j=>j.id===jobId);
        if(!job) return { success:false, message:'Job not found' };
        if(job.assignedDriverId) return { success:false, message:'Delivery has already been accepted.' };
        // success — assign
        set(state=> ({
          jobs: state.jobs.map(j=> j.id===jobId ? {...j, assignedDriverId:driverId, status:'DRIVER_ASSIGNED' as const, acceptedAt:new Date().toISOString()}:j),
          offers: state.offers.map(o=> o.jobId===jobId && o.driverId===driverId ? {...o, status:'accepted' as const, acceptedAt:new Date().toISOString()} : o.jobId===jobId ? {...o, status:'expired' as const} : o),
          drivers: state.drivers.map(d=> d.id===driverId ? {...d, currentJobId:jobId}:d),
        }));
        return { success:true, message:'Assigned to you' };
      },
      updateJobStatus: (jobId,status)=> set(s=> ({ jobs: s.jobs.map(j=> j.id===jobId ? {...j, status, updatedAt:new Date().toISOString(), ...(status==='PICKED_UP'?{pickedUpAt:new Date().toISOString()}:{}), ...(status==='DELIVERED'?{deliveredAt:new Date().toISOString()}:{})}:j)})),
      verifyOtp: (jobId, otp)=> {
        const job=get().jobs.find(j=>j.id===jobId);
        return !!job && job.otp===otp;
      },
    }),
    { name:'freshbasket-delivery', storage: createJSONStorage(() => typeof window !== 'undefined' ? localStorage : undefined as any), version:1 }
  )
);

export function calculateDeliveryFee(settings: DeliverySettings, distanceKm:number, orderValue:number, zone?:string): number {
  if (orderValue >= settings.freeDeliveryThreshold) return 0;
  switch(settings.feeMode) {
    case 'FLAT': return settings.flatRate||40;
    case 'DISTANCE': {
      const base=settings.distanceBase||30;
      const included=settings.distanceIncludedKm||2;
      const perKm=settings.distancePerKm||10;
      if (distanceKm <= included) return base;
      return base + Math.ceil(distanceKm - included)*perKm;
    }
    case 'ZONE': {
      const rate = settings.zoneRates?.find(z=>z.zone===zone)?.rate;
      return rate ?? (settings.flatRate ?? 40);
    }
    case 'ORDER_VALUE': return orderValue < 500 ? 40 : 20;
    case 'FREE_ABOVE': return orderValue>=settings.freeDeliveryThreshold?0:(settings.flatRate ?? 40);
    case 'COMBINED': {
      // zone + distance capped
      let fee = settings.flatRate||40;
      if(zone) fee = settings.zoneRates?.find(z=>z.zone===zone)?.rate ?? fee;
      if(distanceKm> (settings.maximumRadiusKm||10)) fee+=20;
      return fee;
    }
    default: return 40;
  }
}


