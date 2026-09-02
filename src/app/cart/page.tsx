'use client';
import Link from 'next/link';
import { useState } from 'react';
import ManiKunjHeader from '@/components/manikunj/Header';
import ManiKunjFooter from '@/components/manikunj/Footer';
import { useUniqloStore, calcCartTotals } from '@/lib/uniqlo/store';
import { Trash2, Minus, Plus } from 'lucide-react';

export default function CartPage(){
  const cart=useUniqloStore(s=>s.cart);
  const updateQty=useUniqloStore(s=>s.updateQty);
  const remove=useUniqloStore(s=>s.removeFromCart);
  const clear=useUniqloStore(s=>s.clearCart);
  const coupons=useUniqloStore(s=>s.coupons);
  const siteSettings=useUniqloStore(s=>s.siteSettings);
  const [code,setCode]=useState('');
  const [applied,setApplied]=useState<string|undefined>(undefined);
  const [msg,setMsg]=useState('');

  const totals = calcCartTotals(cart, coupons, applied, siteSettings);
  const freeProgress = Math.min(100, (totals.subtotal / siteSettings.freeShippingThreshold) * 100);
  const remaining = Math.max(0, siteSettings.freeShippingThreshold - totals.subtotal);

  const apply=()=>{
    const found = coupons.find(c=> c.code.toUpperCase()===code.toUpperCase() && c.isActive);
    if(!found){ setMsg('Invalid code — generate in Admin → Coupons'); return; }
    const chk = calcCartTotals(cart, coupons, code, siteSettings);
    if(found.type!=='free_shipping' && chk.discount===0 && !chk.freeShipping){ setMsg('Requirements not met (min basket?)'); return; }
    setApplied(code.toUpperCase()); setMsg('Coupon applied: '+code.toUpperCase());
  };

  if(cart.length===0){
    return <div className="min-h-screen bg-white"><ManiKunjHeader /><div className="max-w-[1440px] mx-auto px-4 py-16 text-center"><p className="text-xl font-black tracking-tight">YOUR BAG IS EMPTY</p><p className="text-sm text-neutral-500 mt-2">ManiKunj — joyful everyday fashion. Free delivery over {siteSettings.currencySymbol}{siteSettings.freeShippingThreshold}.</p><Link href="/collection/all" className="inline-block mt-6 bg-black text-white px-8 py-3 text-xs font-black tracking-widest">CONTINUE SHOPPING</Link></div><ManiKunjFooter /></div>;
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <ManiKunjHeader />
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 py-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-3"><h1 className="font-black tracking-tight">SHOPPING BAG ({cart.reduce((a,c)=>a+c.quantity,0)}) • {siteSettings.brandName}</h1><button onClick={clear} className="text-xs underline">Clear all</button></div>

          {/* free delivery progress */}
          <div className="bg-white border border-neutral-200 p-3 mb-3">
            {remaining>0 ? <p className="text-xs font-bold">You&apos;re {siteSettings.currencySymbol}{remaining.toLocaleString('en-IN')} away from FREE DELIVERY.</p> : <p className="text-xs font-bold text-green-700">You&apos;ve unlocked FREE STANDARD DELIVERY!</p>}
            <div className="h-2 bg-neutral-200 mt-2"><div className="h-2 bg-black transition-all" style={{ width: `${freeProgress}%` }} /></div>
            <p className="text-[11px] text-neutral-500 mt-1">Free standard delivery over {siteSettings.currencySymbol}{siteSettings.freeShippingThreshold}</p>
          </div>

          <div className="space-y-3">
            {cart.map(item=>(
              <div key={item.product.id+item.size+item.color} className="bg-white border border-neutral-200 p-3 flex gap-3">
                <img src={item.product.images[0]} alt={item.product.name} className="w-24 h-32 object-cover bg-neutral-50 border border-neutral-100" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs text-neutral-500">{item.product.gender} • MK</p>
                      <Link href={`/product/${item.product.id}`} className="font-bold text-sm leading-tight hover:underline">{item.product.name}</Link>
                      <p className="text-xs text-neutral-500 mt-1">Size: {item.size} • Colour: {item.color}</p>
                      {item.product.badge && <span className="inline-block mt-1 bg-[#ff4d6d] text-white text-[10px] px-1.5 py-0.5 font-bold">{item.product.badge}</span>}
                    </div>
                    <button onClick={()=>remove(item.product.id,item.size,item.color)} className="p-1 text-neutral-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-neutral-300">
                      <button onClick={()=>updateQty(item.product.id, item.quantity-1, item.size, item.color)} className="w-8 h-8 flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button onClick={()=>updateQty(item.product.id, item.quantity+1, item.size, item.color)} className="w-8 h-8 flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                    </div>
                    <span className="font-black">{siteSettings.currencySymbol}{(item.product.price*item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-neutral-200 p-4 h-fit sticky top-[80px]">
          <h3 className="font-black text-sm tracking-tight">ORDER SUMMARY</h3>
          <div className="space-y-2 text-sm mt-3">
            <div className="flex justify-between"><span className="text-neutral-600">Subtotal</span><span>{siteSettings.currencySymbol}{totals.subtotal.toLocaleString('en-IN')}</span></div>
            {totals.savings>0 && <div className="flex justify-between text-[#ff4d6d]"><span>You save</span><span>−{siteSettings.currencySymbol}{totals.savings.toLocaleString('en-IN')}</span></div>}
            {totals.discount>0 && <div className="flex justify-between text-green-700 font-bold"><span>Coupon ({applied})</span><span>−{siteSettings.currencySymbol}{totals.discount.toLocaleString('en-IN')}</span></div>}
            <div className="flex justify-between"><span className="text-neutral-600">Delivery</span><span>{totals.shipping===0 ? 'FREE' : `${siteSettings.currencySymbol}${totals.shipping}`}</span></div>
            <div className="flex gap-2 py-2">
              <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Discount code" className="flex-1 border border-neutral-300 px-3 py-2 text-sm uppercase" />
              <button onClick={apply} className="bg-black text-white px-4 py-2 text-xs font-black">APPLY</button>
            </div>
            {msg && <p className={`text-xs font-bold ${msg.includes('applied') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
            <p className="text-xs text-neutral-500">Use code <span className="font-mono font-bold">MANIKUNJ25</span> for 25% off • <Link href="/admin" className="underline">Admin → Coupons</Link></p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {coupons.filter(c=>c.isActive).slice(0,5).map(c=>(
                <button key={c.id} onClick={()=>setCode(c.code)} className="text-[11px] border border-dashed px-2 py-1 hover:border-black font-mono">{c.code}</button>
              ))}
            </div>
            <div className="flex justify-between font-black text-lg border-t border-neutral-200 pt-3"><span>TOTAL</span><span>{siteSettings.currencySymbol}{totals.total.toLocaleString('en-IN')}</span></div>
            <p className="text-[11px] text-neutral-500">Tax included where applicable.</p>
          </div>
          <Link href="/checkout" className="block w-full bg-black hover:bg-neutral-900 text-white text-center py-3.5 text-xs font-black tracking-widest mt-4">PROCEED TO CHECKOUT</Link>
          <Link href="/collection/all" className="block text-center text-xs underline mt-3">Continue shopping</Link>
          <div className="mt-4 border border-neutral-200 p-3 bg-[#fff7ed] text-xs">
            <p className="font-bold">Need help?</p><p className="text-neutral-600 mt-1">Contact {siteSettings.supportEmail} • {siteSettings.supportPhone}</p>
          </div>
        </div>
      </div>
      <ManiKunjFooter />
    </div>
  );
}
