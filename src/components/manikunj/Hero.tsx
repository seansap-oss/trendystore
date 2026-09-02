'use client';
import Link from 'next/link';
import { useUniqloStore } from '@/lib/uniqlo/store';

const FONT_MAP: Record<string,string> = {
  'Space Grotesk': 'var(--font-space-grotesk)',
  'Inter': 'var(--font-inter)',
  'Playfair Display': 'var(--font-playfair)',
  'Dancing Script': 'var(--font-dancing)',
  'Great Vibes': 'var(--font-greatvibes)',
  'Caveat': 'var(--font-caveat)',
  'Bebas Neue': 'var(--font-bebas)',
  'Montserrat': 'var(--font-montserrat)',
};

function renderTitle(title: string, accentEnabled?: boolean, accentColor?: string){
  if(!accentEnabled || !accentColor) return title;
  // color first letter of each word
  return title.split(/(\s+)/).map((part,i)=>{
    if(part.trim()==='') return <span key={i}>{part}</span>;
    const first = part.charAt(0);
    const rest = part.slice(1);
    return <span key={i}><span style={{ color: accentColor }}>{first}</span>{rest}</span>;
  });
}

export default function ManiKunjHero(){
  const hero = useUniqloStore(s=> s.hero);
  const homepage = useUniqloStore(s=> s.homepageSections);
  const hsHero = homepage.find(s=> s.type==='hero' && s.isActive);
  const data = hsHero ? {
    eyebrow: hsHero.eyebrow,
    title: hsHero.title || hero.title,
    subtitle: hsHero.subtitle || hero.subtitle,
    finePrint: hero.finePrint,
    src: hsHero.image || hero.src,
    mobileSrc: hsHero.mobileImage || hero.mobileSrc,
    ctaLabel: hsHero.ctaLabel || hero.ctaLabel,
    ctaLink: hsHero.ctaLink || hero.ctaLink,
    cta2Label: hsHero.cta2Label || hero.cta2Label,
    cta2Link: hsHero.cta2Link || hero.cta2Link,
    cta3Label: hsHero.cta3Label || hero.cta3Label,
    cta3Link: hsHero.cta3Link || hero.cta3Link,
    overlayOpacity: hsHero.overlayOpacity ?? hero.overlayOpacity,
  } : {
    eyebrow: hero.eyebrow,
    title: hero.title,
    subtitle: hero.subtitle,
    finePrint: hero.finePrint,
    src: hero.src,
    mobileSrc: hero.mobileSrc,
    ctaLabel: hero.ctaLabel,
    ctaLink: hero.ctaLink,
    cta2Label: hero.cta2Label,
    cta2Link: hero.cta2Link,
    cta3Label: hero.cta3Label,
    cta3Link: hero.cta3Link,
    overlayOpacity: hero.overlayOpacity,
  };

  if(!hero.isActive && !hsHero?.isActive) return null;

  const overlay = data.overlayOpacity ?? 0.28;
  const titleStyle: React.CSSProperties = {
    color: hero.titleColor || '#ffffff',
    fontFamily: FONT_MAP[hero.titleFontFamily || 'Space Grotesk'] || 'var(--font-space-grotesk)',
    fontSize: hero.titleFontSize ? `${hero.titleFontSize}px` : undefined,
    fontWeight: hero.titleFontWeight as any,
    fontStyle: hero.titleItalic ? 'italic' : undefined,
    letterSpacing: hero.titleLetterSpacing ? `${hero.titleLetterSpacing}em` : undefined,
  };
  const subtitleStyle: React.CSSProperties = {
    color: hero.subtitleColor || 'rgba(255,255,255,0.9)',
    fontFamily: FONT_MAP[hero.subtitleFontFamily || 'Inter'] || 'var(--font-inter)',
    fontSize: hero.subtitleFontSize ? `${hero.subtitleFontSize}px` : undefined,
  };
  const eyebrowStyle: React.CSSProperties = {
    color: hero.eyebrowColor || 'rgba(255,255,255,0.9)',
    fontFamily: FONT_MAP[hero.eyebrowFontFamily || 'Inter'] || 'var(--font-inter)',
  };

  return (
    <section className="relative w-full overflow-hidden bg-neutral-100">
      <img src={data.src} alt={data.title || 'ManiKunj Campaign'} className="hidden sm:block w-full h-[62vh] lg:h-[72vh] object-cover" style={{ objectPosition: 'center 30%' }} />
      <img src={data.mobileSrc || data.src} alt={data.title || 'ManiKunj Campaign'} className="sm:hidden w-full h-[68vh] object-cover" style={{ objectPosition: 'center top' }} />
      <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${overlay})` }} />
      <div className="absolute inset-0 flex items-center justify-center text-center px-4">
        <div className="max-w-3xl">
          {data.eyebrow && <p className="text-[11px] sm:text-xs tracking-[0.28em] font-black mb-2 sm:mb-3" style={eyebrowStyle}>{data.eyebrow}</p>}
          <h1 className="font-black leading-[0.9] whitespace-pre-line drop-shadow-sm text-[30px] sm:text-[48px] lg:text-[56px]" style={titleStyle}>{renderTitle(data.title || '', hero.titleAccentEnabled, hero.titleAccentColor)}</h1>
          {data.subtitle && <p className="text-sm sm:text-base mt-3 font-medium max-w-xl mx-auto" style={subtitleStyle}>{data.subtitle}</p>}
          {(data.ctaLabel || data.cta2Label || data.cta3Label) && (
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mt-6">
              {data.ctaLabel && data.ctaLink && <Link href={data.ctaLink} className="bg-white text-black px-6 sm:px-8 py-3 text-xs font-black tracking-widest hover:bg-black hover:text-white transition">{data.ctaLabel}</Link>}
              {data.cta2Label && data.cta2Link && <Link href={data.cta2Link} className="bg-white text-black px-6 sm:px-8 py-3 text-xs font-black tracking-widest hover:bg-black hover:text-white transition">{data.cta2Label}</Link>}
              {data.cta3Label && data.cta3Link && <Link href={data.cta3Link} className="bg-white text-black px-6 sm:px-8 py-3 text-xs font-black tracking-widest hover:bg-black hover:text-white transition">{data.cta3Label}</Link>}
            </div>
          )}
          {data.finePrint && <p className="text-white/70 text-[10px] mt-4 tracking-wide">{data.finePrint}</p>}
        </div>
      </div>
    </section>
  );
}
