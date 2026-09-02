import Link from 'next/link';
export default function UniqloFooter(){
  return (
    <footer className="bg-[#0a0a0a] text-white mt-8">
      <div className="max-w-[1420px] mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-5 gap-6 text-xs">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 bg-[#e10600] flex flex-col items-center justify-center leading-none">
              <span className="text-white font-black text-[11px] tracking-wide" style={{ fontFamily: 'var(--font-space-grotesk)' }}>PF</span>
              <span className="text-white/90 text-[5px] tracking-widest font-bold">PLANET</span>
            </div>
            <span className="font-black tracking-tighter" style={{ fontFamily: 'var(--font-space-grotesk)' }}>PlanetFashion</span>
          </div>
          <p className="text-white/60 leading-relaxed">Wear Your Planet — minimal, modern, timeless everyday clothing. Curated LifeWear for Women, Men, Kids & Baby. Slow fashion, planet-friendly essentials.</p>
        </div>
        <div>
          <p className="font-black mb-3 tracking-widest" style={{ fontFamily: 'var(--font-space-grotesk)' }}>ABOUT PF</p>
          <ul className="space-y-2 text-white/70">
            <li><Link href="#">Our Story</Link></li>
            <li><Link href="#">Store Locator</Link></li>
            <li><Link href="#">Careers</Link></li>
            <li><Link href="#">Sustainability</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-black mb-3 tracking-widest" style={{ fontFamily: 'var(--font-space-grotesk)' }}>HELP</p>
          <ul className="space-y-2 text-white/70">
            <li><Link href="#">FAQ</Link></li>
            <li><Link href="#">Shipping & UPI/GPay</Link></li>
            <li><Link href="#">Returns</Link></li>
            <li><Link href="#">Order Status</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-black mb-3 tracking-widest" style={{ fontFamily: 'var(--font-space-grotesk)' }}>MEMBERSHIP</p>
          <ul className="space-y-2 text-white/70">
            <li><Link href="/login">Join / Login</Link></li>
            <li><Link href="/profile">My Account</Link></li>
            <li><Link href="/wishlist">Wishlist</Link></li>
            <li><Link href="/admin">Admin — Coupon Generator</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-black mb-3 tracking-widest" style={{ fontFamily: 'var(--font-space-grotesk)' }}>GET THE APP</p>
          <p className="text-white/60">PWA installable — iOS & Android ready. Scan to install.</p>
          <div className="mt-3 w-20 h-20 bg-white text-black flex items-center justify-center text-[8px] font-black leading-none text-center">PF<br/>PLANET<br/>FASHION</div>
          <p className="text-white/50 text-[10px] mt-2">Pay with UPI • GPay • Card at checkout</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-[11px] text-white/50">
        © {new Date().getFullYear()} PlanetFashion — Wear Your Planet. All rights reserved. <Link href="/admin" className="underline text-white">Admin</Link> • <span className="text-white/70">hello@planetfashion.com</span>
      </div>
    </footer>
  );
}
