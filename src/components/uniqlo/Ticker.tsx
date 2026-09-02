'use client';
import Link from 'next/link';
import { useUniqloStore } from '@/lib/uniqlo/store';

export default function Ticker(){
  const ticker = useUniqloStore(s=>s.ticker);
  if(!ticker.enabled || !ticker.text) return null;
  return (
    <div className="w-full overflow-hidden whitespace-nowrap border-b" style={{ background: ticker.bgColor, color: ticker.textColor }}>
      <Link href={ticker.link || '#'} className="block">
        <div className="animate-marquee inline-flex items-center gap-8 py-2 text-xs font-bold tracking-widest uppercase">
          <span className="px-4">{ticker.text}</span>
          <span className="px-4" aria-hidden>{ticker.text}</span>
          <span className="px-4" aria-hidden>{ticker.text}</span>
          <span className="px-4" aria-hidden>{ticker.text}</span>
        </div>
      </Link>
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}} .animate-marquee{animation: marquee ${ticker.speed}s linear infinite;}`}</style>
    </div>
  );
}
