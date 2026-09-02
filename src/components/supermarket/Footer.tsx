import Link from 'next/link';
import { BRAND } from '@/lib/brand';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-12">
      <div className="max-w-[1440px] mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black">F</div>
            <span className="font-black text-white text-lg">{BRAND.name}</span>
          </div>
          <p className="text-sm text-slate-400">Fresh groceries delivered fast. Shop 1000+ products with delivery or pickup.</p>
          <p className="text-xs text-slate-500 mt-3">{BRAND.address} • {BRAND.supportPhone}</p>
        </div>
        <div>
          <h4 className="font-semibold text-white text-sm mb-3">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shop/specials" className="hover:text-white">Specials</Link></li>
            <li><Link href="/shop/fruit-veg" className="hover:text-white">Fruit & Veg</Link></li>
            <li><Link href="/shop/meat-seafood" className="hover:text-white">Meat & Seafood</Link></li>
            <li><Link href="/shop/pantry" className="hover:text-white">Pantry</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white text-sm mb-3">Help</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/stores" className="hover:text-white">Store Locator</Link></li>
            <li><Link href="/delivery" className="hover:text-white">Delivery</Link></li>
            <li><Link href="/help" className="hover:text-white">Customer Support</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white text-sm mb-3">Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/login" className="hover:text-white">Sign in</Link></li>
            <li><Link href="/lists" className="hover:text-white">Shopping Lists</Link></li>
            <li><Link href="/orders" className="hover:text-white">Orders</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white text-sm mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="max-w-[1440px] mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} {BRAND.companyLegal}. All rights reserved.</span>
          <span>Powered by <a href="https://www.avitsolutions.tech" className="text-slate-400 hover:text-white">AVIT Solutions</a> • 9774242635</span>
        </div>
      </div>
    </footer>
  );
}
