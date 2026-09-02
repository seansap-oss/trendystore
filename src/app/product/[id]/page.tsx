'use client';
import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import ManiKunjHeader from '@/components/manikunj/Header';
import ManiKunjFooter from '@/components/manikunj/Footer';
import ManiKunjProductCard from '@/components/manikunj/ProductCard';
import { useUniqloStore } from '@/lib/uniqlo/store';
import { Heart, Truck, RefreshCw, ShieldCheck, ChevronDown } from 'lucide-react';

export default function ProductPage(){
  const params=useParams(); const id=params.id as string;
  const products = useUniqloStore(s=>s.products);
  const product = useMemo(() => products.find(p=>p.id===id), [products, id]);
  const more = useMemo(()=> products.filter(p=> p.categoryId===product?.categoryId && p.id!==product?.id).slice(0,4), [products, product]);
  const addToCart = useUniqloStore(s=>s.addToCart);
  const wishlist = useUniqloStore(s=>s.wishlist);
  const toggleWishlist=useUniqloStore(s=>s.toggleWishlist);
  const siteSettings = useUniqloStore(s=> s.siteSettings);
  const [activeImg,setActiveImg]=useState(0);
  const [selSize,setSelSize]=useState<string | undefined>(undefined);
  const [selColor,setSelColor]=useState<string | undefined>(undefined);
  const [qty,setQty]=useState(1);
  const [openAcc, setOpenAcc]=useState<string>('description');

  if(!product){
    return <div className="min-h-screen bg-white"><ManiKunjHeader /><div className="max-w-[1440px] mx-auto px-4 py-12">Product not found. <Link href="/" className="underline">Go home</Link></div></div>;
  }
  const hasDiscount = !!product.compareAtPrice && product.compareAtPrice>product.price;
  const isWish = wishlist.includes(product.id);
  const discountAmt = hasDiscount ? product.compareAtPrice! - product.price : 0;

  return (
    <div className="min-h-screen bg-white">
      <ManiKunjHeader />
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 py-4">
        <div className="text-xs text-neutral-500 mb-3 flex flex-wrap gap-1"><Link href="/" className="hover:underline">Home</Link> <span>/</span> <Link href={`/collection/${product.gender.toLowerCase()}`} className="hover:underline">{product.gender}</Link> <span>/</span> <span className="text-black font-medium">{product.name}</span></div>
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 lg:gap-10">
          {/* gallery */}
          <div>
            <div className="aspect-[3/4] bg-neutral-50 border border-neutral-200 overflow-hidden relative">
              <img src={product.images[activeImg] || product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              {product.isNew && <span className="absolute top-3 left-3 bg-black text-white text-xs font-black px-2 py-1">NEW</span>}
              {hasDiscount && <span className="absolute top-3 left-3 bg-[#ff4d6d] text-white text-xs font-black px-2 py-1" style={product.isNew? {top:'38px'}:{}}>{Math.round(discountAmt/product.compareAtPrice!*100)}% OFF</span>}
            </div>
            <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
              {product.images.map((img,i)=>(
                <button key={i} onClick={()=>setActiveImg(i)} className={`w-20 h-24 border flex-shrink-0 overflow-hidden ${i===activeImg?'border-black':'border-neutral-200'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* info sticky */}
          <div className="lg:pl-2">
            <p className="text-xs tracking-widest font-bold text-neutral-500">MANIKUNJ</p>
            <h1 className="text-[20px] sm:text-[24px] font-bold leading-tight mt-1">{product.name}</h1>
            <p className="text-sm text-neutral-600 mt-2">{product.description}</p>
            <div className="flex items-baseline gap-3 mt-4">
              <span className={`text-xl font-black ${hasDiscount?'text-[#ff4d6d]':''}`}>{siteSettings.currencySymbol}{product.price.toLocaleString('en-IN')}</span>
              {hasDiscount && <span className="text-sm text-neutral-400 line-through">{siteSettings.currencySymbol}{product.compareAtPrice!.toLocaleString('en-IN')}</span>}
              {hasDiscount && <span className="text-xs bg-[#ff4d6d] text-white px-2 py-1 font-bold">SAVE {siteSettings.currencySymbol}{discountAmt.toLocaleString('en-IN')}</span>}
            </div>
            <div className="text-xs text-neutral-500 mt-1">★ {product.rating} ({product.reviewCount} reviews) • SKU: {product.id} {product.stockQty!==undefined ? `• ${product.stockQty} in stock` : ''} {product.badge && `• ${product.badge}`}</div>

            {product.stockQty!==undefined && product.stockQty < 10 && product.stockQty>0 && <p className="text-xs text-[#ff4d6d] font-bold mt-2">Low stock — only {product.stockQty} left!</p>}
            {!product.available || !product.inStock ? (
              <div className="mt-6 border border-red-200 bg-red-50 p-4 text-sm"><p className="font-bold text-red-700">Out of stock</p><p className="text-neutral-600 text-xs mt-1">This item is temporarily unavailable. Save to wishlist to be notified.</p></div>
            ) : null}

            {/* colour */}
            <div className="mt-6">
              <p className="text-xs font-black tracking-widest">COLOUR: <span className="font-normal">{selColor || product.colors[0]?.name}</span></p>
              <div className="flex gap-2 mt-2">
                {product.colors.map(c=>(
                  <button key={c.name} onClick={()=>setSelColor(c.name)} className={`w-9 h-9 rounded-full border-2 ${selColor===c.name || (!selColor && c.name===product.colors[0]?.name) ? 'border-black' : 'border-neutral-200'}`} style={{ background:c.hex }} title={c.name} />
                ))}
              </div>
            </div>
            {/* size */}
            <div className="mt-5">
              <div className="flex justify-between items-center"><p className="text-xs font-black tracking-widest">SIZE</p><Link href="/size-guide" className="text-xs underline">Size guide</Link></div>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {product.sizes.map(s=>(
                  <button key={s} onClick={()=>setSelSize(s)} className={`border py-2.5 text-xs font-bold ${selSize===s ? 'bg-black text-white border-black' : 'border-neutral-300 hover:border-black'}`}>{s}</button>
                ))}
              </div>
            </div>

            {/* qty + add */}
            <div className="mt-6 flex gap-3">
              <div className="flex items-center border border-neutral-300">
                <button onClick={()=>setQty(Math.max(1, qty-1))} className="px-3 py-3 text-sm">−</button>
                <span className="px-4 text-sm font-bold w-10 text-center">{qty}</span>
                <button onClick={()=>setQty(qty+1)} className="px-3 py-3 text-sm">+</button>
              </div>
              <button
                onClick={()=>{
                  if(!selSize) setSelSize(product.sizes[0]);
                  if(!selColor) setSelColor(product.colors[0]?.name);
                  addToCart(product, qty, selSize || product.sizes[0], selColor || product.colors[0]?.name);
                }}
                disabled={!product.available || !product.inStock}
                className="flex-1 bg-black hover:bg-neutral-900 text-white font-black tracking-widest text-xs py-3 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {!product.available || !product.inStock ? 'OUT OF STOCK' : 'ADD TO BAG'}
              </button>
              <button onClick={()=>toggleWishlist(product.id)} className={`w-12 border flex items-center justify-center ${isWish ? 'bg-black text-white border-black' : 'border-neutral-300 hover:border-black'}`}>
                <Heart className={`w-5 h-5 ${isWish ? 'fill-white' : ''}`} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 text-xs border border-neutral-200 p-4 bg-[#fff7ed]">
              <p className="flex items-center gap-2"><Truck className="w-4 h-4" /> Free delivery over {siteSettings.currencySymbol}{siteSettings.freeShippingThreshold} • {siteSettings.currencySymbol}{siteSettings.shippingStandard} standard</p>
              <p className="flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Free returns within 30 days — online & in-store</p>
              <p className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Secure checkout • UPI • Card • COD</p>
            </div>

            {/* accordions Cotton On style */}
            <div className="mt-6 border-t border-neutral-200">
              {[
                {id:'description', title:'Description', content: product.description + ' — Designed for everyday ease, ManiKunj quality you can feel.'},
                {id:'details', title:'Details & Fit', content:'Model is 175cm wearing size M. Relaxed fit. Check size guide for measurements.'},
                {id:'materials', title:'Materials & Care', content: product.composition || 'Cotton blend. Machine wash cold, tumble dry low. Do not bleach.'},
                {id:'delivery', title:'Delivery', content:`Standard ${siteSettings.currencySymbol}${siteSettings.shippingStandard} • Express ${siteSettings.currencySymbol}${siteSettings.shippingExpress} • Free over ${siteSettings.currencySymbol}${siteSettings.freeShippingThreshold}. Dispatch in 24h.`},
                {id:'returns', title:'Returns', content:'30 days free returns online & in-store. Items must be unworn with tags. Excludes gift cards.'},
              ].map(sec=>(
                <div key={sec.id} className="border-b border-neutral-200">
                  <button onClick={()=> setOpenAcc(openAcc===sec.id ? '' : sec.id)} className="w-full flex justify-between items-center py-3 text-xs font-black tracking-widest">
                    {sec.title}<ChevronDown className={`w-4 h-4 transition ${openAcc===sec.id ? 'rotate-180' : ''}`} />
                  </button>
                  {openAcc===sec.id && <p className="pb-3 text-xs leading-relaxed text-neutral-600">{sec.content}</p>}
                </div>
              ))}
            </div>

            <p className="text-[11px] text-neutral-500 mt-4">Product code: {product.id} • Available colours: {product.colors.map(c=>c.name).join(', ')}</p>
          </div>
        </div>

        {/* complete the look / you may also like */}
        {more.length>0 && (
          <div className="mt-12">
            <h3 className="text-lg font-black mb-4">YOU MAY ALSO LIKE</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{more.map(p=> <ManiKunjProductCard key={p.id} product={p} />)}</div>
          </div>
        )}
      </div>
      <ManiKunjFooter />
      {/* sticky add to bag mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-3 flex gap-3 z-40">
        <span className="flex-1 flex flex-col justify-center"><span className="text-sm font-black">{siteSettings.currencySymbol}{product.price.toLocaleString('en-IN')}</span><span className="text-xs text-neutral-500">{product.name}</span></span>
        <button onClick={()=> addToCart(product,1, selSize||product.sizes[0], selColor||product.colors[0]?.name)} disabled={!product.inStock} className="bg-black text-white px-8 py-3 text-xs font-black disabled:opacity-30">ADD TO BAG</button>
      </div>
      <div className="lg:hidden h-[72px]" />
    </div>
  );
}
