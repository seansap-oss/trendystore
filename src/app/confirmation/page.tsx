'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import UniqloHeader from '@/components/uniqlo/Header';
import UniqloFooter from '@/components/uniqlo/Footer';

function Inner(){
  const sp=useSearchParams(); const order=sp.get('order') || '—';
  return (
    <div className="min-h-screen bg-white">
      <UniqloHeader />
      <div className="max-w-[720px] mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 bg-green-600 text-white flex items-center justify-center mx-auto text-2xl">✓</div>
        <h1 className="text-2xl font-black mt-4">ORDER CONFIRMED</h1>
        <p className="text-sm text-neutral-600 mt-2">Your order <span className="font-mono font-bold">{order}</span> has been placed successfully.</p>
        <p className="text-xs text-neutral-500 mt-2">You’ll receive a confirmation email shortly. Track your order in your profile.</p>
        <div className="flex gap-2 justify-center mt-8">
          <Link href="/profile" className="bg-black text-white px-8 py-3 text-xs font-black">VIEW ORDERS</Link>
          <Link href="/collection/all" className="border border-black px-8 py-3 text-xs font-black">CONTINUE SHOPPING</Link>
        </div>
      </div>
      <UniqloFooter />
    </div>
  );
}
export default function ConfirmationPage(){
  return <Suspense fallback={<div className="p-8">Loading...</div>}><Inner /></Suspense>;
}
