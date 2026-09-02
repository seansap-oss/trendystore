'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ManiKunjHeader from '@/components/manikunj/Header';
import ManiKunjFooter from '@/components/manikunj/Footer';
import { useUniqloStore, calcCartTotals } from '@/lib/uniqlo/store';
import { useUserStore } from '@/lib/userStore';

export default function CheckoutPage(){
  const cart=useUniqloStore(s=>s.cart);
  const coupons=useUniqloStore(s=>s.coupons);
  const addOrder=useUniqloStore(s=>s.addOrder);
  const clearCart=useUniqloStore(s=>s.clearCart);
  const session=useUserStore(s=>s.session);
  const router=useRouter();

  const [code,setCode]=useState('');
  const [applied,setApplied]=useState<string|undefined>(undefined);
  const [couponMsg,setCouponMsg]=useState('');
  const [payment,setPayment]=useState<'upi'|'gpay'|'card'|'cod'>('upi');
  const siteSettings = useUniqloStore(s=> s.siteSettings);
  const [address,setAddress]=useState(siteSettings.address || 'MG Road, Bangalore 560001');
  const [email,setEmail]=useState('');
  const [upiId,setUpiId]=useState('manikunj@upi');
  const [isPaying,setIsPaying]=useState(false);

  const totals = calcCartTotals(cart, coupons, applied, siteSettings);

  if(cart.length===0) return <div className="min-h-screen bg-white"><ManiKunjHeader /><div className="max-w-[1420px] mx-auto px-4 py-10 text-center">Cart empty. <Link href="/collection/all" className="underline">Shop Trendy Store</Link></div><ManiKunjFooter /></div>;

  const apply=()=>{
    const c=coupons.find(x=>x.code.toUpperCase()===code.toUpperCase() && x.isActive);
    if(!c){ setCouponMsg('Invalid code'); return; }
    const chk=calcCartTotals(cart, coupons, code, siteSettings);
    if(c.type!=='free_shipping' && chk.discount===0 && !chk.freeShipping){ setCouponMsg('Requirements not met (min basket?)'); return; }
    setApplied(code.toUpperCase()); setCouponMsg('Applied âœ“ â€” discount will apply at payment');
  };

  const pay=async()=>{
    if(!session?.loggedIn){ router.push('/login'); return; }
    if(cart.some(c=> !c.product.available || !c.product.inStock)){ alert('Some items are not available. Remove them.'); return; }
    setIsPaying(true);
    // Simulate UPI/GPay intent
    if(payment==='upi' || payment==='gpay'){
      // UPI deep link simulation: upi://pay?pa=...&am=...&cu=EUR
      await new Promise(r=>setTimeout(r, 900));
    } else {
      await new Promise(r=>setTimeout(r, 900));
    }
    const orderId='MK-'+Date.now().toString(36).toUpperCase();
    addOrder({
      id: orderId,
      orderNumber: orderId,
      username: session.username,
      items: [...cart],
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      tax: totals.tax,
      total: totals.total,
      couponCode: applied,
      status: 'paid',
      paymentMethod: payment as any,
      shippingAddress: address,
      createdAt: Date.now(),
    });
    try{
      const userStore = (await import('@/lib/userStore')).useUserStore.getState();
      userStore.addUserOrder(session.username, {
        id: orderId,
        items: cart.map(c=>({ name:c.product.name, quantity:c.quantity, price:c.product.price})),
        total: totals.total,
        paymentMethod: payment,
        createdAt: Date.now(),
      });
    }catch{}
    // bump coupon usage
    if(applied){
      const cp=coupons.find(c=>c.code===applied);
      if(cp) useUniqloStore.getState().updateCoupon(cp.id, { usedCount: cp.usedCount+1 });
    }
    clearCart();
    setIsPaying(false);
    router.push(`/confirmation?order=${orderId}`);
  };

  const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(siteSettings.brandName)}&am=${totals.total.toFixed(2)}&cu=INR&tn=${encodeURIComponent(applied ? `Order MK discount ${applied}` : `${siteSettings.brandName} Order`)}`;

  return (
    <div className="min-h-screen bg-[#f8f7f5]">
      <ManiKunjHeader />
      <div className="max-w-[1420px] mx-auto px-3 sm:px-4 py-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-neutral-200 p-4">
            <h3 className="font-black text-sm" style={{ fontFamily: 'var(--font-space-grotesk)' }}>1. SHIPPING ADDRESS {!session?.loggedIn && <Link href="/login" className="ml-2 text-xs underline font-normal">Sign in to checkout</Link>}</h3>
            <input value={address} onChange={e=>setAddress(e.target.value)} className="mt-3 w-full border border-neutral-300 px-3 py-2.5 text-sm" placeholder="Address" />
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email for receipt (optional)" className="mt-2 w-full border border-neutral-300 px-3 py-2.5 text-sm" />
          </div>

          <div className="bg-white border border-neutral-200 p-4">
            <h3 className="font-black text-sm" style={{ fontFamily: 'var(--font-space-grotesk)' }}>2. DISCOUNT CODE</h3>
            <p className="text-xs text-neutral-500 mt-1">Admin can generate 10% (or any %) sale codes â€” they apply here instantly.</p>
            <div className="flex gap-2 mt-3">
              <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Try WELCOME10, TRENDY10, MANIKUNJ25" className="flex-1 border border-neutral-300 px-3 py-2 text-sm uppercase font-mono" />
              <button onClick={apply} className="bg-black text-white px-5 py-2 text-xs font-black tracking-widest hover:bg-neutral-800">APPLY</button>
              {applied && <button onClick={()=>{setApplied(undefined); setCode(''); setCouponMsg('Removed');}} className="border border-neutral-300 px-3 py-2 text-xs">CLEAR</button>}
            </div>
            {couponMsg && <p className={`text-xs mt-2 font-bold ${couponMsg.includes('Applied') ? 'text-green-700' : 'text-red-600'}`}>{couponMsg}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              {coupons.filter(c=>c.isActive).slice(0,4).map(c=>(
                <button key={c.id} onClick={()=>setCode(c.code)} className="text-xs border border-dashed border-neutral-300 px-2 py-1 hover:border-black">{c.code} â€” {c.type==='percent' ? `${c.value}%` : c.type==='fixed' ? `â‚¬${c.value}` : 'Free Ship'}{c.minBasket ? ` â€¢ min â‚¬${c.minBasket}`:''}</button>
              ))}
            </div>
            <p className="text-[11px] text-neutral-500 mt-2">Generate new codes in <Link href="/admin" className="underline font-bold">Admin â†’ Coupons â†’ Generate Discount Coupon</Link></p>
          </div>

          <div className="bg-white border border-neutral-200 p-4">
            <h3 className="font-black text-sm" style={{ fontFamily: 'var(--font-space-grotesk)' }}>3. PAYMENT GATEWAY â€” UPI / GPay / Card</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
              <button onClick={()=>setPayment('upi')} className={`p-3 border text-xs font-black flex flex-col items-center gap-1 ${payment==='upi'?'bg-black text-white border-black':'border-neutral-300 hover:border-black'}`}>
                <span className="text-base">â¬¢</span> UPI
                <span className="text-[10px] font-normal">Instant</span>
              </button>
              <button onClick={()=>setPayment('gpay')} className={`p-3 border text-xs font-black flex flex-col items-center gap-1 ${payment==='gpay'?'bg-black text-white border-black':'border-neutral-300 hover:border-black'}`}>
                <span className="text-base">G</span> GPay
                <span className="text-[10px] font-normal">Google Pay</span>
              </button>
              <button onClick={()=>setPayment('card')} className={`p-3 border text-xs font-black flex flex-col items-center gap-1 ${payment==='card'?'bg-black text-white border-black':'border-neutral-300 hover:border-black'}`}>
                <span> CARD</span><span className="text-[10px] font-normal">Visa/MC</span>
              </button>
              <button onClick={()=>setPayment('cod')} className={`p-3 border text-xs font-black ${payment==='cod'?'bg-black text-white border-black':'border-neutral-300 hover:border-black'}`}>COD</button>
            </div>

            {(payment==='upi' || payment==='gpay') && (
              <div className="mt-4 border border-neutral-200 bg-[#f9fafb] p-3">
                <p className="text-xs font-bold">UPI ID</p>
                <div className="flex gap-2 mt-1">
                  <input value={upiId} onChange={e=>setUpiId(e.target.value)} className="flex-1 border border-neutral-300 px-3 py-2 text-sm font-mono" placeholder="yourname@upi" />
                  <a href={upiLink} target="_blank" rel="noopener noreferrer" className="bg-black text-white px-4 py-2 text-xs font-black">PAY VIA {payment.toUpperCase()}</a>
                </div>
                <p className="text-[11px] text-neutral-500 mt-2">Test mode â€” clicking opens UPI intent `upi://pay?pa={upiId}&am={totals.total} & cu=INR`.</p>
                <div className="mt-3 flex gap-2">
                  <div className="w-20 h-20 bg-white border border-neutral-200 flex items-center justify-center text-[7px] font-bold text-center leading-none">QR<br/>UPI<br/>GPay</div>
                  <p className="text-xs text-neutral-600">Scan with any UPI/GPay app â€” amount auto-filled {siteSettings.currencySymbol}{totals.total.toFixed(2)} {applied ? `(with ${applied} âˆ’${siteSettings.currencySymbol}${totals.discount.toFixed(2)})` : ''}</p>
                </div>
              </div>
            )}
            {payment==='card' && (
              <div className="mt-3 space-y-2">
                <input placeholder="Card number 4242 4242 4242 4242" className="w-full border border-neutral-300 px-3 py-2 text-sm" defaultValue="4242 4242 4242 4242" />
                <div className="grid grid-cols-2 gap-2"><input placeholder="MM/YY" className="border border-neutral-300 px-3 py-2 text-sm" defaultValue="12/28" /><input placeholder="CVC" className="border border-neutral-300 px-3 py-2 text-sm" defaultValue="123" /></div>
                <p className="text-xs text-neutral-500">Test mode â€” no real charge. Gateway connected.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-neutral-200 p-4 h-fit sticky top-[80px]">
          <h3 className="font-black" style={{ fontFamily: 'var(--font-space-grotesk)' }}>ORDER SUMMARY</h3>
          <div className="space-y-1 text-sm mt-3 max-h-48 overflow-auto">
            {cart.map(i=> <div key={i.product.id+i.size} className="flex justify-between"><span className="truncate pr-2">{i.product.name} x{i.quantity}</span><span>{siteSettings.currencySymbol}{(i.product.price*i.quantity).toFixed(2)}</span></div>)}
          </div>
          <div className="border-t border-neutral-200 mt-3 pt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{siteSettings.currencySymbol}{totals.subtotal.toFixed(2)}</span></div>
            {totals.discount>0 && <div className="flex justify-between text-green-700 font-bold"><span>Discount {applied}</span><span>âˆ’{siteSettings.currencySymbol}{totals.discount.toFixed(2)}</span></div>}
            <div className="flex justify-between"><span>Shipping</span><span>{totals.shipping===0?'FREE':`${siteSettings.currencySymbol}${totals.shipping.toFixed(2)}`}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>{siteSettings.currencySymbol}{totals.tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-black text-lg border-t border-neutral-200 pt-2" style={{ fontFamily: 'var(--font-space-grotesk)' }}><span>TOTAL</span><span>{siteSettings.currencySymbol}{totals.total.toFixed(2)}</span></div>
            {totals.savings>0 && <p className="text-xs text-[#ff4d6d]">You save {siteSettings.currencySymbol}{totals.savings.toFixed(2)} on MRP</p>}
          </div>
          <button onClick={pay} disabled={isPaying} className="w-full bg-black hover:bg-neutral-900 disabled:opacity-50 text-white py-3.5 text-xs font-black tracking-[0.12em] mt-4" style={{ fontFamily: 'var(--font-space-grotesk)' }}>{isPaying ? 'PROCESSINGâ€¦' : `PAY ${siteSettings.currencySymbol}${totals.total.toFixed(2)} VIA ${payment.toUpperCase()}`}</button>
          {!session?.loggedIn && <p className="text-xs text-red-600 mt-2 text-center font-bold">Please sign in to place order.</p>}
          <p className="text-[11px] text-neutral-500 text-center mt-2">{siteSettings.brandName} â€¢ All items, prices, coupons & payments are admin-controlled.</p>
        </div>
      </div>
      <ManiKunjFooter />
    </div>
  );
}
