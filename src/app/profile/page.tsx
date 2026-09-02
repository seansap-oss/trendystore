'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UniqloHeader from '@/components/uniqlo/Header';
import Ticker from '@/components/uniqlo/Ticker';
import UniqloFooter from '@/components/uniqlo/Footer';
import { useUserStore } from '@/lib/userStore';
import { useUniqloStore } from '@/lib/uniqlo/store';

export default function ProfilePage(){
  const session=useUserStore(s=>s.session);
  const logout=useUserStore(s=>s.logout);
  const getOrders=useUserStore(s=>s.getUserOrders);
  const getTotal=useUserStore(s=>s.getUserTotalSpent);
  const uniqloOrders=useUniqloStore(s=>s.orders);
  const router=useRouter();
  const [confirm,setConfirm]=useState(false);

  if(!session?.loggedIn){
    return <div className="min-h-screen bg-white"><UniqloHeader /><Ticker /><div className="max-w-[720px] mx-auto px-4 py-12 text-center"><p className="font-black text-lg">NOT SIGNED IN</p><p className="text-sm text-neutral-500 mt-2">Sign in to view your profile & orders. (Profiles required + database sign-in/sign-out).</p><Link href="/login" className="inline-block mt-6 bg-black text-white px-8 py-3 text-xs font-black">SIGN IN</Link><Link href="/collection/all" className="inline-block ml-2 border border-black px-8 py-3 text-xs font-black">SHOP</Link></div><UniqloFooter /></div>;
  }
  const orders=getOrders(session.username);
  const total=getTotal(session.username);
  const myUniqlo=uniqloOrders.filter(o=> o.username===session.username);

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <UniqloHeader /><Ticker />
      <div className="max-w-[720px] mx-auto px-3 sm:px-4 py-6">
        <div className="bg-white border border-neutral-200 p-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-[#ff0000] text-white flex items-center justify-center font-black text-xl">{session.username.charAt(0).toUpperCase()}</div>
          <div className="flex-1"><p className="font-black">{session.username}</p><p className="text-xs text-neutral-500">{orders.length + myUniqlo.length} orders • Total €{total.toFixed(2)}</p></div>
          <button onClick={()=>setConfirm(true)} className="border border-black px-4 py-2 text-xs font-black">LOGOUT</button>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white border border-neutral-200 p-4 text-center"><p className="text-xs text-neutral-500">Orders</p><p className="font-black text-lg">{orders.length + myUniqlo.length}</p></div>
          <div className="bg-white border border-neutral-200 p-4 text-center"><p className="text-xs text-neutral-500">Spent</p><p className="font-black text-lg">€{total.toFixed(2)}</p></div>
          <div className="bg-white border border-neutral-200 p-4 text-center"><p className="text-xs text-neutral-500">Wishlist</p><Link href="/wishlist" className="font-black text-lg underline">{useUniqloStore.getState().wishlist.length}</Link></div>
        </div>

        <div className="mt-6">
          <h2 className="font-black text-sm">ORDER HISTORY (All Profiles)</h2>
          {orders.length===0 && myUniqlo.length===0 ? (
            <div className="bg-white border border-neutral-200 p-8 text-center mt-3"><p className="text-sm text-neutral-500">No orders yet. Place an order via checkout — it appears here instantly.</p><Link href="/collection/all" className="inline-block mt-3 bg-black text-white px-6 py-2 text-xs font-black">SHOP NOW</Link></div>
          ) : (
            <div className="space-y-3 mt-3">
              {myUniqlo.map(o=>(
                <div key={o.id} className="bg-white border border-neutral-200 p-4">
                  <div className="flex justify-between text-xs"><span className="font-mono">{o.orderNumber}</span><span>{new Date(o.createdAt).toLocaleString()}</span></div>
                  <div className="mt-2 space-y-1 text-sm">{o.items.map((it,idx)=><div key={idx} className="flex justify-between"><span>{it.quantity}x {it.product.name} ({it.size}/{it.color})</span><span>€{(it.product.price*it.quantity).toFixed(2)}</span></div>)}</div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-neutral-200"><span className="text-xs uppercase">{o.paymentMethod} • {o.status}</span><span className="font-black">€{o.total.toFixed(2)}</span></div>
                  {o.couponCode && <p className="text-xs text-green-700 mt-1">Coupon: {o.couponCode} (−€{o.discount.toFixed(2)})</p>}
                </div>
              ))}
              {orders.map(o=>(
                <div key={o.id} className="bg-white border border-neutral-200 p-4">
                  <div className="flex justify-between text-xs"><span className="font-mono">{o.id.slice(-8)}</span><span>{new Date(o.createdAt).toLocaleString()}</span></div>
                  <div className="mt-2 space-y-1 text-sm">{o.items.map((it,idx)=><div key={idx} className="flex justify-between"><span>{it.quantity}x {it.name}</span><span>€{(it.price*it.quantity).toFixed(2)}</span></div>)}</div>
                  <div className="flex justify-between mt-2 pt-2 border-t border-neutral-200 font-black"><span className="text-xs font-normal uppercase">{o.paymentMethod}</span><span>€{o.total.toFixed(2)}</span></div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-2">
          <Link href="/collection/all" className="flex-1 bg-black text-white text-center py-3 text-xs font-black">CONTINUE SHOPPING</Link>
          <Link href="/admin" className="flex-1 border border-black text-center py-3 text-xs font-black">ADMIN</Link>
        </div>
      </div>

      {confirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 max-w-sm w-full">
            <p className="font-bold">Sign out?</p><p className="text-sm text-neutral-500 mt-1">You’ll need name + 4-digit PIN to sign in again (database sign-in/sign-out).</p>
            <div className="flex gap-2 mt-4"><button onClick={()=>setConfirm(false)} className="flex-1 border border-neutral-300 py-2 text-sm font-bold">Cancel</button><button onClick={()=>{logout(); router.push('/');}} className="flex-1 bg-black text-white py-2 text-sm font-bold">Sign Out</button></div>
          </div>
        </div>
      )}

      <UniqloFooter />
    </div>
  );
}
