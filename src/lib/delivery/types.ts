export type DeliveryFeeMode = 'FLAT' | 'DISTANCE' | 'ZONE' | 'ORDER_VALUE' | 'FREE_ABOVE' | 'COMBINED';
export type DeliverySettings = {
  tenantId: string;
  enabled: boolean;
  minimumOrder: number; // ₹
  freeDeliveryThreshold: number; // ₹999
  maximumRadiusKm: number;
  allowedPostcodes?: string[];
  deliveryAreas?: string[];
  slotDurationMins: number;
  maxOrdersPerSlot: number;
  codAllowed: boolean;
  onlinePaymentRequired: boolean;
  contactless: boolean;
  feeMode: DeliveryFeeMode;
  flatRate?: number; // ₹40
  distanceBase?: number; // ₹30
  distanceIncludedKm?: number; // 2
  distancePerKm?: number; // ₹10
  zoneRates?: { zone:string; rate:number }[]; // A 30, B 50
  operatingHours?: { open:string; close:string };
  snapshotOnOrder: boolean; // freeze fee on order
};

export type Driver = {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  email?: string;
  photo?: string;
  status: 'online'|'offline';
  vehicleType?: string;
  vehicleReg?: string;
  serviceZone?: string;
  isActive: boolean;
  currentJobId?: string;
};

export type DeliveryJob = {
  id: string;
  tenantId: string;
  orderId: string;
  storeId: string;
  status: 'READY_FOR_DRIVER'|'OFFERED'|'DRIVER_ASSIGNED'|'DRIVER_AT_STORE'|'PICKED_UP'|'ON_THE_WAY'|'ARRIVED'|'DELIVERED'|'FAILED'|'RETURNED'|'CANCELLED';
  deliveryFeeCustomer: number;
  driverPayout: number;
  distanceKm?: number;
  zone?: string;
  assignedDriverId?: string;
  offeredAt?: string;
  acceptedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  failureReason?: string;
  otp?: string; // proof of delivery
  createdAt: string;
  updatedAt: string;
};

export type DeliveryOffer = {
  jobId: string;
  driverId: string;
  status: 'offered'|'viewed'|'accepted'|'declined'|'expired';
  offeredAt: string;
  acceptedAt?: string;
  declinedAt?: string;
};

export type PushSubscription = {
  userId: string;
  tenantId: string;
  role: 'customer'|'driver'|'admin';
  endpoint: string;
  keys: { p256dh:string; auth:string };
  createdAt: string;
};
