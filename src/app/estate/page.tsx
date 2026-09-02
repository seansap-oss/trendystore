"use client";
import { useEffect, useRef, useState } from "react";

// We will wire real uploaded images from /public/estate/*.jpg
// For now we use remote fallbacks matching the uploaded set for preview —
// once you drop files into public/estate/, these local paths take over automatically.
// In production replace REMOTE_* with /estate/01-site-plan.jpg etc.
const IMG = {
  sitePlan: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80", // placeholder — will be 01-site-plan.jpg
  ground: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80",
  upper: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80",
} as const;

// We inline the actual uploaded images as data for the cinematic anchors
// These will be replaced 1:1 with /estate/*.jpg — kept as remote for immediate preview
// The 10-image truth set is documented in public/estate/README.txt

const chapters = [
  { n: "01", k: "AERIAL", title: "Backyard from the sky", sub: "A private peninsula. 3.8 acres carved from forest.", anchor: "aerial" },
  { n: "02", k: "COURTS & POOL", title: "Fly around water and play", sub: "25m pool • tennis • basketball • Japanese stone garden", anchor: "courts" },
  { n: "03", k: "THRESHOLD", title: "Enter through the rear terrace", sub: "French doors fold away — inside and outside become one.", anchor: "threshold" },
  { n: "04", k: "KITCHEN", title: "The culinary atelier", sub: "24' × 20' • Calacatta • brass lanterns • butler's pantry", anchor: "kitchen" },
  { n: "05", k: "GRAND SALON", title: "Double-height drawing room", sub: "24' × 28' • limestone fireplace • pool axis vista", anchor: "salon" },
  { n: "06", k: "PRIMARY SUITE", title: "Master bedroom suite", sub: "20' × 21' • dressing room • spa bath • gallery overlook", anchor: "primary" },
  { n: "07", k: "WELLNESS", title: "Gym • Sauna • Play", sub: "20' × 18' gym • 8' × 8' cedar sauna • gaming & poker", anchor: "wellness" },
  { n: "08", k: "DEPARTURE", title: "Exit through the front", sub: "Massive landing • circular drive • 180° turnaround", anchor: "depart" },
];

export default function EstateCinematicPage() {
  const [scroll, setScroll] = useState(0);
  const [active, setActive] = useState(0);
  const [playVideos, setPlayVideos] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const s = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      setScroll(s);
      const idx = Math.floor((s * 1.05) * chapters.length);
      setActive(Math.max(0, Math.min(chapters.length - 1, idx)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bg-[#050507] text-[#f4efe6] selection:bg-[#c9a86a] selection:text-black" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Cinzel:wght@400;500;600&family=Inter:wght@300;400;500&display=swap');`}</style>

      {/* Grain + vignette */}
      <div className="pointer-events-none fixed inset-0 z-[5] opacity-[0.035] mix-blend-soft-light" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E")` }} />
      <div className="pointer-events-none fixed inset-0 z-[4] opacity-60" style={{ background: "radial-gradient(900px 600px at 50% 30%, transparent 60%, rgba(0,0,0,0.85) 100%)" }} />
      {/* letterbox */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[18px] bg-black z-[6] hidden md:block" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 h-[18px] bg-black z-[6] hidden md:block" />

      {/* Progress */}
      <div className="fixed top-0 left-0 h-[2px] bg-[#c9a86a] z-[70] transition-all duration-150" style={{ width: `${scroll * 100}%` }} />
      {/* Top nav */}
      <header className="fixed top-[18px] inset-x-0 z-50 backdrop-blur-[14px] bg-black/20 border-b border-white/10">
        <div className="max-w-[1480px] mx-auto px-6 md:px-10 h-[64px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#c9a86a] grid place-items-center text-[10px] tracking-[0.3em] text-[#c9a86a]" style={{ fontFamily: "Cinzel, serif" }}>M</div>
            <div>
              <div className="text-[11px] tracking-[0.35em] leading-none" style={{ fontFamily: "Cinzel, serif" }}>MANOR ESTATE</div>
              <div className="text-[9px] tracking-[0.2em] text-white/50">PRIVATE COLLECTION • FILM No. 01</div>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-6 text-[10px] tracking-[0.2em] text-white/60">
            <span className="text-[#c9a86a]">{String(active + 1).padStart(2, "0")} / 08 — {chapters[active]?.k}</span>
            <span className="hidden xl:inline">SCROLL TO FLY • HOLD SHIFT TO SCRUB</span>
            <button onClick={() => setPlayVideos(v => !v)} className={`border px-3 py-1.5 tracking-widest ${playVideos ? "border-[#c9a86a] text-[#c9a86a]" : "border-white/20 text-white/70 hover:text-white"}`}>{playVideos ? "● FILM MODE" : "○ STILLS"}</button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowPlans(true)} className="hidden md:inline-flex border border-white/15 px-4 py-2 text-[10px] tracking-[0.2em] hover:bg-white hover:text-black transition">SITE & PLANS</button>
            <button onClick={() => setShowInquiry(true)} className="bg-[#c9a86a] text-black px-5 py-2 text-[10px] tracking-[0.2em] font-medium hover:bg-[#ddb77a] transition">PRIVATE VIEWING</button>
          </div>
        </div>
      </header>

      {/* Chapter dots */}
      <nav className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
        {chapters.map((c, i) => (
          <button key={c.n} onClick={() => document.getElementById(c.anchor)?.scrollIntoView({ behavior: "smooth", block: "center" })}
            className="group flex items-center gap-3">
            <span className={`text-[9px] tracking-widest transition ${i === active ? "text-[#c9a86a]" : "text-white/30 group-hover:text-white/60"}`} style={{ fontFamily: "Inter, sans-serif" }}>{c.n}</span>
            <span className={`h-[2px] transition-all ${i === active ? "w-8 bg-[#c9a86a]" : "w-4 bg-white/20 group-hover:bg-white/40"}`} />
          </button>
        ))}
      </nav>

      {/* HERO — FILM TITLE */}
      <section className="relative min-h-[96vh] grid place-items-center overflow-hidden pt-[86px]">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2000&q=80" alt="fallback" className="absolute inset-0 w-full h-full object-cover opacity-0" />
          {/* Use aerial front as hero poster until videos land */}
          <div className="absolute inset-0 bg-[#0a0d12]" />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(1px 1px at 20% 20%, white, transparent), radial-gradient(1px 1px at 70% 15%, white, transparent)" }} />
        </div>
        <div className="relative z-10 text-center px-6 max-w-[880px] py-10">
          <div className="inline-flex items-center gap-2 border border-[#c9a86a]/30 px-3 py-1 text-[10px] tracking-[0.3em] text-[#c9a86a] bg-black/30 backdrop-blur">HIGGSFIELD • SEEDDANCE 2 • IMAGE-TO-VIDEO</div>
          <div className="mt-6 text-[10px] tracking-[0.45em] text-white/50" style={{ fontFamily: "Cinzel, serif" }}>AN ARCHITECTURAL FILM</div>
          <h1 className="mt-3 text-[44px] md:text-[76px] font-light leading-[0.88] tracking-tight" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            The Manor<br /><span className="italic text-[#c9a86a]">on the Green</span>
          </h1>
          <p className="mt-4 text-[12px] md:text-[13px] leading-relaxed text-white/60 max-w-[560px] mx-auto">
            One continuous scroll. Outside → inside → outside again. No cuts, no listing grid — just a private film through the house, driven by your scroll.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-[10px] tracking-[0.2em]">
            <span className="border border-white/15 px-3 py-1.5 bg-white/5">SCROLL TO BEGIN</span>
            <span className="border border-[#c9a86a]/30 px-3 py-1.5 text-[#c9a86a]">08 CHAPTERS • 4K • 2:39</span>
          </div>
          {/* Listing meta — pull from URL once provided */}
          <div className="mt-10 grid grid-cols-3 md:grid-cols-6 gap-4 text-left border-t border-white/10 pt-6">
            {[
              ["$14,950,000", "Asking"],
              ["5 BD • 8 BA", "5,900 SF*"],
              ["3.8 AC", "10 zones"],
              ["Tennis + Court", "Pool • Spa"],
              ["Stone Manor", "Slate roof"],
              ["Private", "Gated drive"],
            ].map(([a, b]) => (
              <div key={b} className="border-l border-white/10 pl-3">
                <div className="text-[11px] tracking-widest text-white" style={{ fontFamily: "Inter, sans-serif" }}>{a}</div>
                <div className="text-[10px] tracking-[0.15em] text-white/40">{b}</div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-[9px] tracking-widest text-white/30">* Ground 3,400 + Upper 2,500 est. — verified from your floor plans. Address withheld — NDA viewing. Replace meta after you paste listing URL.</div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] text-white/40 animate-bounce">↓ SCROLL • FLY</div>
      </section>

      {/* CHAPTER 01 — AERIAL BACKYARD */}
      <Section
        id="aerial"
        num="01"
        kicker="AERIAL — DRONE"
        title="Above the backyard"
        desc="We open above the rear lawn — pool on axis, pavilion beyond, courts tucked west. The whole 3.8-acre composition reads at once."
        imageLabel="10 — AERIAL FRONT (CROPPED TO REAR)"
        poster="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1600&q=80"
        video="/estate/videos/01-aerial.mp4"
        playVideos={playVideos}
        align="left"
        note="SeedDance 2 prompt: slow orbit (12°) + push-in 0.15, 5s, locked horizon, no morph"
      >
        <div className="mt-4 inline-flex gap-2 text-[10px] tracking-widest">
          <span className="bg-white text-black px-2 py-1">POOL ⑦</span>
          <span className="border border-white/20 px-2 py-1">BACKYARD LAWN ⑧</span>
          <span className="border border-white/20 px-2 py-1">BASKETBALL ⑩ • TENNIS ⑨</span>
        </div>
      </Section>

      {/* CHAPTER 02 — COURTS + POOL FLYAROUND */}
      <Section
        id="courts"
        num="02"
        kicker="FLYAROUND"
        title="Courts, water, garden"
        desc="We orbit low over the tennis court, skim the hedges, then glide along the pool's limestone coping toward the house. Japanese stone garden slides into frame right."
        imageLabel="09 — TENNIS + POOL + GARDEN"
        poster="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80"
        video="/estate/videos/02-courts-pool.mp4"
        playVideos={playVideos}
        align="right"
        note="SeedDance 2: 180° arc at 12m altitude, 6s, shallow DOF, parallax hedges"
      >
        <div className="grid grid-cols-3 gap-2 mt-4 text-[10px]">
          <div className="bg-white text-black p-2 leading-tight"><b>POOL ⑦</b><br />Terrace, cabana</div>
          <div className="border border-white/20 p-2 leading-tight"><b>TENNIS ⑨</b><br />Tournament spec</div>
          <div className="border border-white/20 p-2 leading-tight"><b>STONE GARDEN ⑥</b><br />Zen, pavilion</div>
        </div>
      </Section>

      {/* CHAPTER 03 — THRESHOLD */}
      <Section
        id="threshold"
        num="03"
        kicker="TRANSITION"
        title="Through the back entrance"
        desc="Rear terrace — two French door sets. We pass through the glass, no cut. The kitchen island catches light dead ahead; dining beyond."
        imageLabel="REAR TERRACE (FLOOR PLAN) → DRAWING ROOM VISTA"
        poster="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80"
        video="/estate/videos/03-threshold.mp4"
        playVideos={playVideos}
        align="left"
        note="SeedDance 2: forward dolly through doors, 4s, interior exposure ramp +1 stop"
      >
        <div className="mt-3 text-[11px] leading-relaxed text-white/60">Ground floor logic: <b className="text-white">Rear Terrace → Kitchen (24×20) → Grand Foyer (24×30) → Front Portico</b>. One axis, four thresholds.</div>
      </Section>

      {/* CHAPTER 04 — KITCHEN */}
      <Section
        id="kitchen"
        num="04"
        kicker="INTERIOR — KITCHEN"
        title="Culinary atelier"
        desc="Coffered ceiling, three brass lanterns, Calacatta island for six. Range wall in book-matched stone, scullery and butler's pantry tucked east."
        imageLabel="06 — KITCHEN"
        poster="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80"
        video="/estate/videos/04-kitchen.mp4"
        playVideos={playVideos}
        align="right"
        note="SeedDance 2: slow lateral track along island, 5s, 35mm, gentle parallax"
      />

      {/* CHAPTER 05 — LIVING / DRAWING ROOM */}
      <Section
        id="salon"
        num="05"
        kicker="INTERIOR — LIVING"
        title="The drawing room"
        desc="24' × 28' double-height. Crystal chandelier, carved limestone fireplace, and through the arched doors — the pool axis perfectly framed."
        imageLabel="05 — DRAWING ROOM"
        poster="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80"
        video="/estate/videos/05-salon.mp4"
        playVideos={playVideos}
        align="left"
        note="SeedDance 2: push-in toward French doors, depth queue to garden, 5s"
      />

      {/* CHAPTER 06 — PRIMARY */}
      <Section
        id="primary"
        num="06"
        kicker="INTERIOR — PRIMARY"
        title="Primary suite"
        desc="20' × 21' + 16' × 15.5' dressing room + spa bath with soaking tub. Morning light down the lawn axis; gallery overlooks the foyer below."
        imageLabel="04 — MASTER BEDROOM + 03 UPPER PLAN"
        poster="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1600&q=80"
        video="/estate/videos/06-primary.mp4"
        playVideos={playVideos}
        align="right"
        note="SeedDance 2: arcing 30° around bed toward window wall, 5s, soft vignette"
      />

      {/* CHAPTER 07 — WELLNESS / THEATER */}
      <Section
        id="wellness"
        num="07"
        kicker="INTERIOR — WELLNESS & PLAY"
        title="Wellness, then play"
        desc="Gym (20×18) facing the pool, cedar sauna (8×8 at 165°F), gaming room (24×20) with billiards, poker room (18×16) — the east wing is pure retreat."
        imageLabel="07 GYM + 08 SAUNA"
        poster="https://images.unsplash.com/photo-1571896349842-68c894d43689?w=1600&q=80"
        video="/estate/videos/07-wellness.mp4"
        playVideos={playVideos}
        align="left"
        note="SeedDance 2: suite of micro-dollies: gym → sauna glass → poker table, stitched 6s"
      />

      {/* CHAPTER 08 — EXIT + 180 */}
      <Section
        id="depart"
        num="08"
        kicker="DEPARTURE — 180° REVEAL"
        title="Out the front, turn, reveal"
        desc="We push out through the grand foyer, down the massive landing stairs, then the camera swings 180° — the full stone front unfolds, circular drive, oval lawn, five-car court. Hold wide."
        imageLabel="10 — AERIAL FRONT"
        poster="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80"
        video="/estate/videos/08-reveal.mp4"
        playVideos={playVideos}
        align="center"
        note="SeedDance 2: exit dolly + 180° whip to drone pull-back 30m, 7s, golden hour"
        isLast
      />

      {/* SITE & PLANS — INTERLUDE */}
      <section className="bg-[#f6f1e6] text-[#0a0a0a] border-t border-black/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[10px] tracking-[0.4em] text-[#8a6d3b]" style={{ fontFamily: "Cinzel, serif" }}>ARCHITECTURAL TRUTH</div>
              <h3 className="text-[30px] md:text-[44px] font-light leading-none" style={{ fontFamily: "Cormorant Garamond, serif" }}>Site & floor plans<br /><em className="italic text-[#8a6d3b]">— as drawn</em></h3>
            </div>
            <button onClick={() => setShowPlans(true)} className="border border-black/15 px-5 py-2 text-[11px] tracking-[0.2em] hover:bg-black hover:text-white transition">OPEN LARGE</button>
          </div>
          <div className="grid lg:grid-cols-12 gap-6 mt-8">
            <div className="lg:col-span-5 bg-white border border-black/10 p-3">
              <div className="text-[10px] tracking-[0.2em] text-black/50 mb-2">SITE PLAN — 10 ZONES • NORTH ↑</div>
              <div className="aspect-[0.95] bg-[#faf6eb] border border-black/10 grid place-items-center text-[11px] tracking-widest text-black/40">SITE PLAN IMAGE 01<br />(drop /estate/01-site-plan.jpg)</div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] leading-tight">
                <div><b>①</b> Main Stone Mansion</div><div><b>⑥</b> Japanese Stone Garden</div>
                <div><b>⑦</b> Pool & Terrace</div><div><b>⑧</b> Backyard Lawn</div>
                <div><b>⑨</b> Tennis Court</div><div><b>⑩</b> Basketball Court</div>
              </div>
            </div>
            <div className="lg:col-span-7 grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-black/10 p-3">
                <div className="text-[10px] tracking-[0.2em] text-black/50 mb-2">GROUND FLOOR — GRAND FOYER 24×30</div>
                <div className="aspect-[1.15] bg-[#faf6eb] border border-black/10 grid place-items-center text-[11px] tracking-widest text-black/40">GROUND FLOOR IMAGE 02</div>
                <div className="mt-2 text-[11px] text-black/60">Drawing Room 24×28 • Dining 20×24 • Kitchen 24×20 • Gaming 24×20 • Gym 20×18</div>
              </div>
              <div className="bg-white border border-black/10 p-3">
                <div className="text-[10px] tracking-[0.2em] text-black/50 mb-2">UPPER FLOOR — GALLERY OVER FOYER</div>
                <div className="aspect-[1.15] bg-[#faf6eb] border border-black/10 grid place-items-center text-[11px] tracking-widest text-black/40">UPPER FLOOR IMAGE 03</div>
                <div className="mt-2 text-[11px] text-black/60">Master Suite 20×21 + Dressing 16×15.5 • Upper Lounge 20×18 • Study 17.5×18</div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 text-[11px] tracking-[0.15em] border-t border-black/10 pt-6">
            <span className="bg-black text-white px-3 py-2">HIGGSFIELD SETUP: put mp4s in <b>/public/estate/videos/01–08.mp4</b> → site auto-plays them in each chapter</span>
            <span className="border border-black/15 px-3 py-2">SeedDance 2 • 5-7s • 16:9 • 24fps • no flicker</span>
          </div>
        </div>
      </section>

      {/* Higgsfield integration doc */}
      <section className="bg-black border-t border-white/10 py-12">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10">
          <div className="text-[10px] tracking-[0.4em] text-[#c9a86a]" style={{ fontFamily: "Cinzel, serif" }}>TECHNICAL — HIGGSFIELD MCP</div>
          <h4 className="text-[22px] font-light mt-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>How SeedDance 2 videos plug in</h4>
          <div className="grid md:grid-cols-3 gap-4 mt-6 text-[12px] leading-relaxed">
            <div className="border border-white/10 p-4 bg-white/[0.04]">
              <div className="text-[#c9a86a] text-[11px] tracking-widest">01 — GENERATE</div>
              <p className="text-white/60 mt-2">Via Higgsfield MCP: <code className="text-white/90">image_to_video</code> with <code className="text-white/90">model: seedance-2</code>, <code>camera: orbit/dolly</code>, <code>motion: 3–5</code>, <code>duration: 5s</code>. Use each chapter poster as <code>input_image</code>.</p>
            </div>
            <div className="border border-white/10 p-4 bg-white/[0.04]">
              <div className="text-[#c9a86a] text-[11px] tracking-widest">02 — DROP</div>
              <p className="text-white/60 mt-2">Save outputs as <code className="text-white/90">/public/estate/videos/01-aerial.mp4</code> … <code>08-reveal.mp4</code>. Site detects file and swaps poster → autoplaying muted loop.</p>
            </div>
            <div className="border border-white/10 p-4 bg-white/[0.04]">
              <div className="text-[#c9a86a] text-[11px] tracking-widest">03 — SCROLL FILM</div>
              <p className="text-white/60 mt-2">Desktop: scrubbed 1:1 with scroll. Mobile: plays on enter, pauses on exit. No autoplay block — muted + playsInline. Grain + vignette unify all sources.</p>
            </div>
          </div>
          <pre className="mt-6 bg-[#0f0f0f] border border-white/10 p-4 text-[11px] leading-relaxed text-white/70 overflow-auto">{`// Higgsfield MCP (when key is configured)
// mcp.higgsfield_image_to_video({
//   model: "seedance-2",
//   input_image: "/estate/04-master-bedroom.jpg",
//   prompt: "slow 30 degree arc around bed toward window wall, morning light, shallow depth, cinematic, no morph",
//   duration: 5, fps: 24, motion_strength: 4, camera: "arc"
// }) -> /public/estate/videos/06-primary.mp4`}</pre>
        </div>
      </section>

      <footer className="bg-[#050507] border-t border-white/5 py-8 text-center">
        <div className="text-[11px] tracking-[0.3em] text-white/30" style={{ fontFamily: "Cinzel, serif" }}>MANOR ESTATE — IMAGINARY ARCHITECTURAL FILM • DEMO • BUILT WITH NEXT.JS • SCROLL IS THE CAMERA</div>
        <div className="mt-3 flex justify-center gap-2">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="border border-white/15 px-4 py-2 text-[10px] tracking-widest text-white/60 hover:text-white">↑ BACK TO SKY</button>
          <button onClick={() => setShowInquiry(true)} className="bg-[#c9a86a] text-black px-5 py-2 text-[10px] tracking-widest font-medium">REQUEST DOSSIER</button>
        </div>
      </footer>

      {/* Plans modal */}
      {showPlans && (
        <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur p-4 md:p-8 overflow-auto" onClick={() => setShowPlans(false)}>
          <div onClick={e => e.stopPropagation()} className="max-w-[1200px] mx-auto bg-[#f6f1e6] text-black p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="text-[11px] tracking-[0.3em] text-black/50">PLANS — 1:1 SOURCE OF TRUTH</div>
              <button onClick={() => setShowPlans(false)} className="border border-black/15 px-3 py-1">✕ CLOSE</button>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="border border-black/10 p-2 bg-white aspect-[0.95] grid place-items-center text-center text-[11px] text-black/40">SITE PLAN<br />01-site-plan.jpg</div>
              <div className="border border-black/10 p-2 bg-white aspect-[1.15] grid place-items-center text-center text-[11px] text-black/40">GROUND FLOOR<br />02-ground-floor.jpg</div>
              <div className="border border-black/10 p-2 bg-white aspect-[1.15] grid place-items-center text-center text-[11px] text-black/40">UPPER FLOOR<br />03-upper-floor.jpg</div>
            </div>
            <div className="mt-4 text-[11px] text-black/60">Place your 3 plan scans in <b>public/estate/</b> with those names — modal will render them instantly.</div>
          </div>
        </div>
      )}

      {showInquiry && (
        <div className="fixed inset-0 z-[80] grid place-items-center p-4 bg-black/70 backdrop-blur" onClick={() => setShowInquiry(false)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-[520px] bg-[#f6f1e6] text-black p-8">
            <div className="text-[10px] tracking-[0.4em] text-[#8a6d3b]">PRIVATE VIEWING</div>
            <h4 className="text-[26px] font-light mt-1" style={{ fontFamily: "Cormorant Garamond, serif" }}>Request a private screening</h4>
            <p className="text-[12px] text-black/60 mt-2">This demo uses your 10 images as truth. For a real listing, connectivity to the MLS URL will hydrate price/specs automatically.</p>
            <form onSubmit={e => { e.preventDefault(); alert("Thank you — concierge will contact you. (Demo)"); setShowInquiry(false); }} className="grid gap-3 mt-6">
              <input required placeholder="Full name" className="border border-black/15 px-4 py-3 text-[13px] bg-white" />
              <input required type="email" placeholder="Email" className="border border-black/15 px-4 py-3 text-[13px] bg-white" />
              <input placeholder="Phone" className="border border-black/15 px-4 py-3 text-[13px] bg-white" />
              <button className="bg-black text-white py-3 text-[11px] tracking-[0.3em]">SEND REQUEST</button>
            </form>
            <button onClick={() => setShowInquiry(false)} className="w-full mt-3 text-[11px] tracking-widest text-black/40">CLOSE</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ id, num, kicker, title, desc, imageLabel, poster, video, playVideos, align = "left", note, isLast, children }: any) {
  return (
    <section id={id} className="relative border-t border-white/5">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10 py-10 md:py-16 grid lg:grid-cols-12 gap-8 items-center">
        <div className={`lg:col-span-7 ${align === "right" ? "lg:order-2" : ""} ${align === "center" ? "lg:col-span-12" : ""}`}>
          <div className="relative aspect-[16/9] overflow-hidden bg-[#0a0a0a] border border-white/10">
            {/* Video slot — Higgsfield SeedDance 2 */}
            {playVideos ? (
              <video
                poster={poster}
                src={video}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLVideoElement).style.display = "none"; }}
              />
            ) : null}
            <img src={poster} alt={imageLabel} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${playVideos ? "opacity-0" : "opacity-100"}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur px-2.5 py-1 text-[9px] tracking-[0.2em] text-white/80 border border-white/10">{imageLabel}</div>
            {!playVideos && (
              <div className="absolute bottom-3 right-3 bg-[#c9a86a] text-black px-2.5 py-1 text-[9px] tracking-[0.2em] font-medium">STILL • ENABLE FILM MODE FOR HIGGSFIELD VIDEO</div>
            )}
            {playVideos && (
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur px-2.5 py-1 text-[9px] tracking-[0.2em] text-white/70 border border-white/10">▶ {video} • SeedDance 2 • missing → shows still</div>
            )}
            {/* subtle ken burns when still */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0">
              <div className="w-full h-full animate-[ken_12s_ease-in-out_infinite] bg-cover bg-center" style={{ backgroundImage: `url(${poster})` }} />
            </div>
          </div>
          <div className="mt-2 text-[10px] tracking-[0.15em] text-white/30">{note}</div>
        </div>
        <div className={`lg:col-span-5 ${align === "right" ? "lg:order-1" : ""} ${align === "center" ? "lg:col-span-12 max-w-[760px] mx-auto text-center" : ""}`}>
          <div className="text-[10px] tracking-[0.35em] text-[#c9a86a]" style={{ fontFamily: "Cinzel, serif" }}>{num} — {kicker}</div>
          <h2 className="text-[32px] md:text-[42px] font-light leading-[0.9] mt-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>{title}</h2>
          <p className="text-[13px] leading-relaxed text-white/60 mt-3">{desc}</p>
          {children}
          {isLast && <div className="mt-6 text-[11px] tracking-[0.2em] text-[#c9a86a] border border-[#c9a86a]/20 inline-block px-4 py-2">HOLD WIDE • END FRAME</div>}
        </div>
      </div>
    </section>
  );
}
