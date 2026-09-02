'use client';
import Link from 'next/link';
import { useUniqloStore } from '@/lib/uniqlo/store';

export default function Hero(){
  const hero = useUniqloStore(s=>s.hero);
  if(!hero.isActive) return null;
  const overlay = hero.overlayOpacity ?? 0.3;
  return (
    <section className="relative w-full overflow-hidden bg-neutral-100">
      {hero.type==='video' ? (
        <video src={hero.src} poster={hero.poster} autoPlay loop muted playsInline className="w-full h-[58vh] sm:h-[64vh] lg:h-[72vh] object-cover" />
      ) : (
        <img src={hero.src} alt={hero.title} className="w-full h-[58vh] sm:h-[64vh] lg:h-[72vh] object-cover" />
      )}
      <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${overlay})`}} />
      <div className={`absolute inset-0 flex items-center ${hero.alignment==='center' ? 'justify-center text-center' : hero.alignment==='right' ? 'justify-end text-right pr-6 sm:pr-12' : 'justify-start pl-6 sm:pl-12'}`}>
        <div className="max-w-xl p-6 sm:p-8">
          <h1 className="text-white text-[28px] sm:text-[40px] lg:text-[48px] font-black leading-[0.95] tracking-tighter whitespace-pre-line">{hero.title}</h1>
          {hero.subtitle && <p className="text-white/90 text-sm sm:text-base mt-3 font-medium max-w-lg">{hero.subtitle}</p>}
          {hero.ctaLabel && hero.ctaLink && (
            <Link href={hero.ctaLink} className="inline-block mt-5 bg-white text-black px-7 py-3 text-xs font-black tracking-widest hover:bg-black hover:text-white transition">
              {hero.ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
