"use client";
import { useEffect, useRef, useState } from "react";

type Room = {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  desc: string;
  size: string;
  feature: string;
  x: number;
  y: number;
};

const ROOMS: Room[] = [
  {
    id: "hall",
    name: "Grand Hall",
    subtitle: "Entrée Monumentale",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80",
    desc: "Double-height hall with 7m vaulted ceiling, Loire limestone fireplace and bespoke Murano chandelier.",
    size: "185 m²",
    feature: "Hand-carved limestone • Heated stone",
    x: 50, y: 45,
  },
  {
    id: "salon",
    name: "Drawing Room",
    subtitle: "Salon de Réception",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80",
    desc: "South-facing salon opening onto formal gardens through 4m arched steel windows. Herringbone oak parquetry.",
    size: "142 m²",
    feature: "Garden panorama • Steinway alcove",
    x: 32, y: 52,
  },
  {
    id: "kitchen",
    name: "Culinary Atelier",
    subtitle: "Cuisine Molteni",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80",
    desc: "Molteni + Gaggenau gastronomic kitchen with 5m Calacatta island, chef's hearth and sommelier's cellar access.",
    size: "98 m²",
    feature: "Wine cellar stair • Private terrace",
    x: 72, y: 48,
  },
  {
    id: "library",
    name: "Library",
    subtitle: "Bibliothèque",
    image: "https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=1600&q=80",
    desc: "Walnut-paneled library with hidden bar, fireplace and mezzanine. Curated for 4000 volumes.",
    size: "76 m²",
    feature: "Secret door • Mezzanine",
    x: 22, y: 72,
  },
  {
    id: "master",
    name: "Primary Suite",
    subtitle: "Suite Maîtresse",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1600&q=80",
    desc: "Entire west wing. Bedroom, dual dressing rooms, onyx spa bath and private loggia overlooking the lake.",
    size: "210 m²",
    feature: "Lake view loggia • Onyx spa",
    x: 78, y: 70,
  },
  {
    id: "spa",
    name: "Spa & Pool",
    subtitle: "Bains Romains",
    image: "https://images.unsplash.com/photo-1571896349842-68c894d43689?w=1600&q=80",
    desc: "25m infinity pool, hammam, cryo chamber and treatment pavilion in travertine and brass.",
    size: "320 m²",
    feature: "Infinity pool • Hammam",
    x: 50, y: 78,
  },
];

export default function ChateauPage() {
  const [entered, setEntered] = useState(false);
  const [active, setActive] = useState<Room>(ROOMS[0]);
  const [floorOpen, setFloorOpen] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [panX, setPanX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef(0);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      setMouse({ x: (e.clientX / window.innerWidth - 0.5) * 20, y: (e.clientY / window.innerHeight - 0.5) * 20 });
    };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  const onDown = (e: React.PointerEvent) => { setDragging(true); dragStart.current = e.clientX - panX; (e.target as Element).setPointerCapture(e.pointerId); };
  const onMove = (e: React.PointerEvent) => { if (!dragging) return; setPanX(e.clientX - dragStart.current); };
  const onUp = () => setDragging(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f1e8] selection:bg-[#c9a86a] selection:text-black" style={{ fontFamily: "Georgia, serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500&family=Cinzel:wght@400;500&display=swap');`}</style>

      {/* TOP CRUISE BAR */}
      <div className="fixed top-0 inset-x-0 z-50 pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-between px-6 md:px-10 py-5 backdrop-blur-[14px] bg-black/18 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#c9a86a] grid place-items-center text-[10px] tracking-[0.3em] text-[#c9a86a]" style={{ fontFamily: "Cinzel, serif" }}>CL</div>
            <div>
              <div className="text-[11px] tracking-[0.35em] text-white/90" style={{ fontFamily: "Cinzel, serif" }}>CHÂTEAU LUMIÈRE</div>
              <div className="text-[9px] tracking-[0.25em] text-white/50">CÔTE D&apos;AZUR • 1847 • RESTORED 2024</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-7 text-[11px] tracking-[0.2em] text-white/70" style={{ fontFamily: "Inter, sans-serif" }}>
            <button onClick={() => setFloorOpen(true)} className="hover:text-white transition">FLOOR PLAN</button>
            <button onClick={() => document.getElementById('estate')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition">ESTATE</button>
            <button onClick={() => setShowInquiry(true)} className="border border-[#c9a86a]/50 px-5 py-2 text-[#c9a86a] hover:bg-[#c9a86a] hover:text-black transition">PRIVATE VIEWING</button>
          </div>
          <button onClick={() => setFloorOpen(!floorOpen)} className="md:hidden border border-white/20 px-3 py-1.5 text-[10px] tracking-widest">PLAN</button>
        </div>
      </div>

      {/* HERO — MANSION AS PAGE */}
      <section ref={heroRef} className="relative h-[100svh] w-full overflow-hidden bg-[#06080a]">
        {/* Sky + Atmosphere */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(1200px 600px at 50% 0%, #1a2a3a 0%, #0a141e 45%, #040607 100%)" }} />
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(1px 1px at 20% 20%, white, transparent), radial-gradient(1px 1px at 70% 15%, white, transparent), radial-gradient(0.5px 0.5px at 50% 30%, white, transparent)" }} />

        {/* Distant hills silhouette */}
        <svg className="absolute bottom-[38%] left-0 w-full h-[22%] opacity-30" viewBox="0 0 1440 220" preserveAspectRatio="none"><path d="M0 180 Q 300 60 600 120 T 1200 100 L1440 180 L1440 220 L0 220 Z" fill="#0e1a24" /></svg>

        {/* Mansion Illustration — the hero is the house */}
        <div
          className="absolute left-1/2 bottom-[14%] -translate-x-1/2 w-[min(1100px,96vw)] h-[56vh] md:h-[62vh] transition-transform duration-700 ease-out"
          style={{ transform: `translate(-50%, 0) translate(${mouse.x * 0.6}px, ${mouse.y * 0.25}px)` }}
        >
          {/* Shadow ground */}
          <div className="absolute -bottom-6 left-[8%] right-[8%] h-10 bg-black/60 blur-[18px] rounded-[50%]" />

          {/* SVG Mansion */}
          <svg viewBox="0 0 1100 520" className="absolute inset-0 w-full h-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.9)]">
            {/* Base plinth */}
            <rect x="40" y="430" width="1020" height="18" rx="2" fill="#1a241e" stroke="#c9a86a33" />
            {/* Main corps */}
            <rect x="220" y="180" width="660" height="250" fill="linear-gradient(180deg,#f3efe6,#d8cfb8)" style={{ fill: "#ece6d5" }} stroke="#c9a86a44" />
            {/* Stone quoins */}
            <rect x="220" y="180" width="16" height="250" fill="#d6cbb0" /><rect x="864" y="180" width="16" height="250" fill="#d6cbb0" />
            {/* Left wing */}
            <rect x="60" y="220" width="170" height="210" fill="#e8e0c9" stroke="#c9a86a33" />
            <polygon points="60,220 145,150 230,220" fill="#1a2a3a" stroke="#c9a86a66" />
            {/* Right wing */}
            <rect x="870" y="220" width="170" height="210" fill="#e8e0c9" stroke="#c9a86a33" />
            <polygon points="870,220 955,150 1040,220" fill="#1a2a3a" stroke="#c9a86a66" />
            {/* Central pediment */}
            <polygon points="350,180 550,70 750,180" fill="#0f1e2e" stroke="#c9a86a" strokeWidth="1.2" />
            <circle cx="550" cy="128" r="22" fill="#0a0a0a" stroke="#c9a86a" /><text x="550" y="133" textAnchor="middle" fontSize="14" fill="#c9a86a" fontFamily="Cinzel">L</text>
            {/* Roof */}
            <polygon points="230,180 330,110 770,110 870,180" fill="#0c1a28" />
            {/* Chimneys */}
            <rect x="300" y="85" width="18" height="45" fill="#1a2a3a" /><rect x="782" y="85" width="18" height="45" fill="#1a2a3a" />
            {/* Windows — lit */}
            {[0, 1, 2].map(i => (
              <g key={`w1-${i}`}>
                <rect x={280 + i * 90} y={240} width="46" height="68" rx="2" fill="#0b0b0b" stroke="#c9a86a55" />
                <rect x={282 + i * 90} y={242} width="42" height="64" fill="#ffdf8a" opacity="0.95" />
                <line x1={303 + i * 90} y1="242" x2={303 + i * 90} y2="306" stroke="#c9a86a66" />
                <line x1={282 + i * 90} y1="274" x2={324 + i * 90} y2="274" stroke="#c9a86a66" />
              </g>
            ))}
            {[0, 1, 2].map(i => (
              <g key={`w2-${i}`}>
                <rect x={580 + i * 90} y={240} width="46" height="68" rx="2" fill="#0b0b0b" stroke="#c9a86a55" />
                <rect x={582 + i * 90} y={242} width="42" height="64" fill="#ffdf8a" opacity="0.9" />
              </g>
            ))}
            {/* Upper windows */}
            {[0, 1, 2, 3, 4].map(i => (
              <g key={`wu-${i}`}>
                <rect x={300 + i * 110} y={150} width="36" height="44" rx="1" fill="#0b0b0b" />
                <rect x={302 + i * 110} y={152} width="32" height="40" fill="#ffe9a8" opacity="0.85" />
              </g>
            ))}
            {/* Grand doorway */}
            <g className="cursor-pointer" onClick={() => { setEntered(true); setTimeout(() => document.getElementById("explorer")?.scrollIntoView({ behavior: "smooth" }), 100); }}>
              <rect x="485" y="310" width="130" height="120" rx="2" fill="#080808" stroke="#c9a86a" strokeWidth="1.4" />
              <rect x="492" y="318" width="116" height="112" fill="#081018" stroke="#c9a86a66" />
              {/* double doors */}
              <rect x="500" y="330" width="48" height="90" fill="#1a1208" stroke="#c9a86a" />
              <rect x="552" y="330" width="48" height="90" fill="#1a1208" stroke="#c9a86a" />
              <circle cx="546" cy="375" r="3.5" fill="#c9a86a" /><circle cx="558" cy="375" r="3.5" fill="#c9a86a" />
              {/* fanlight */}
              <path d="M500 330 A 50 28 0 0 1 600 330" fill="none" stroke="#c9a86a" strokeWidth="1" />
              <line x1="550" y1="302" x2="550" y2="330" stroke="#c9a86a55" />
              {/* steps */}
              <rect x="470" y="430" width="160" height="6" fill="#d6cbb0" /><rect x="480" y="436" width="140" height="5" fill="#c9a86a" opacity="0.9" />
              {/* hover glow */}
              <rect x="485" y="310" width="130" height="120" fill="#c9a86a" opacity="0.06" className="hover:opacity-10 transition" />
            </g>
            {/* Lanterns */}
            <circle cx="475" cy="355" r="5" fill="#ffb84d" opacity="0.9" /><circle cx="625" cy="355" r="5" fill="#ffb84d" opacity="0.9" />
            {/* Trees silhouettes */}
            <g opacity="0.9" fill="#061018">
              <polygon points="30,430 55,320 80,430" /><polygon points="1020,430 1045,310 1070,430" />
              <polygon points="150,430 170,360 190,430" opacity="0.6" /><polygon points="910,430 930,360 950,430" opacity="0.6" />
            </g>
          </svg>

          {/* Floating labels */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-center pointer-events-none">
            <div className="text-[9px] tracking-[0.5em] text-[#c9a86a] font-light" style={{ fontFamily: "Inter, sans-serif" }}>DOMAINE PRIVÉ • CÔTE D&apos;AZUR</div>
          </div>
        </div>

        {/* Reflection on water */}
        <div className="absolute bottom-0 left-0 right-0 h-[16%] opacity-25" style={{ background: "linear-gradient(180deg, #0a141e 0%, transparent 100%)" }} />

        {/* Bottom info bar integrated as part of drawing plinth */}
        <div className="absolute bottom-0 inset-x-0">
          <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-6 flex flex-wrap gap-6 items-end justify-between border-t border-white/10 bg-gradient-to-t from-black/70 to-transparent backdrop-blur-[2px]">
            <div>
              <div className="text-[11px] tracking-[0.4em] text-[#c9a86a]" style={{ fontFamily: "Cinzel, serif" }}>€ 42.500.000</div>
              <h1 className="text-[30px] md:text-[44px] font-light leading-none tracking-tight" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                Château Lumière <span className="text-[#c9a86a]">—</span> Villa de Rêve
              </h1>
              <p className="text-[12px] md:text-[13px] text-white/60 max-w-[560px] mt-2 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                1,850 m² • 7 suites • 4.2 ha park • 180° Mediterranean view. 1847 heritage restored by Studio Liaigre. Mouse to look, click the doors to enter.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-[10px] tracking-widest text-white/60 border border-white/15 px-4 py-2" style={{ fontFamily: "Inter, sans-serif" }}>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> LIVE 3D TOUR • DRAG TO LOOK
              </div>
              <button
                onClick={() => { setEntered(true); setTimeout(() => document.getElementById("explorer")?.scrollIntoView({ behavior: "smooth" }), 100); }}
                className="bg-[#c9a86a] text-black px-8 py-3.5 text-[12px] tracking-[0.25em] hover:bg-[#ddb77a] transition font-medium"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                ENTER THE ESTATE →
              </button>
            </div>
          </div>
          {!entered && (
            <div className="text-center py-3 text-[10px] tracking-[0.3em] text-white/40 animate-bounce" style={{ fontFamily: "Inter, sans-serif" }}>SCROLL OR CLICK DOOR TO ENTER</div>
          )}
        </div>

        {/* Light rays */}
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: "radial-gradient(600px 300px at 50% 35%, #c9a86a22, transparent 70%)" }} />
      </section>

      {/* EXPLORER */}
      <section id="explorer" className="relative bg-[#0f0f0f] border-t border-[#c9a86a]/15">
        {/* Control bar */}
        <div className="sticky top-[68px] z-30 backdrop-blur-xl bg-[#0a0a0a]/85 border-y border-white/10">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {ROOMS.map(r => (
                <button
                  key={r.id}
                  onClick={() => setActive(r)}
                  className={`whitespace-nowrap px-4 py-2 text-[11px] tracking-[0.18em] border transition ${active.id === r.id ? "bg-[#c9a86a] text-black border-[#c9a86a]" : "border-white/15 text-white/70 hover:text-white hover:border-white/30"}`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {r.name.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setFloorOpen(true)} className="hidden md:inline-flex items-center gap-2 border border-[#c9a86a]/30 px-4 py-2 text-[11px] tracking-widest text-[#c9a86a] hover:bg-[#c9a86a]/10" style={{ fontFamily: "Inter, sans-serif" }}>
                ◰ FLOOR PLAN
              </button>
              <span className="text-[10px] tracking-widest text-white/40" style={{ fontFamily: "Inter, sans-serif" }}>DRAG IMAGE • CLICK HOTSPOTS</span>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[1.45fr_0.85fr] gap-0">
          {/* 360 Viewer */}
          <div
            className="relative h-[58vh] md:h-[72vh] overflow-hidden bg-[#050505] cursor-grab active:cursor-grabbing select-none group"
            onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}
          >
            {/* Panorama image with pan */}
            <div
              className="absolute inset-0 will-change-transform"
              style={{
                transform: `translateX(${panX * 0.45}px) scale(1.08)`,
                transition: dragging ? "none" : "transform 600ms ease-out",
              }}
            >
              <img src={active.image} alt={active.name} className="w-[125%] h-full object-cover max-w-none -ml-[12.5%]" draggable={false} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/18" />
            </div>

            {/* Hotspots */}
            <button onClick={() => setActive(ROOMS.find(r => r.id === "kitchen")!)} className="absolute w-9 h-9 rounded-full bg-white/90 grid place-items-center shadow-xl hover:scale-110 transition" style={{ left: "72%", top: "48%" }}>
              <span className="w-2 h-2 rounded-full bg-black animate-ping absolute" /><span className="w-2 h-2 rounded-full bg-black relative" />
            </button>
            <button onClick={() => setActive(ROOMS.find(r => r.id === "salon")!)} className="absolute w-9 h-9 rounded-full bg-white/90 grid place-items-center shadow-xl hover:scale-110 transition" style={{ left: "32%", top: "52%" }}>
              <span className="w-2 h-2 rounded-full bg-black animate-ping absolute" /><span className="w-2 h-2 rounded-full bg-black relative" />
            </button>

            {/* AR overlay */}
            <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] tracking-[0.2em] text-white/80 bg-black/45 backdrop-blur px-3 py-1.5 border border-white/10" style={{ fontFamily: "Inter, sans-serif" }}>
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> AR / VR READY • 8K • GYRO ENABLED
            </div>
            <div className="absolute top-4 right-4 bg-black/45 backdrop-blur px-3 py-1.5 border border-white/10 text-[11px] tracking-widest text-white/80" style={{ fontFamily: "Inter, sans-serif" }}>
              {active.size} • CLICK & DRAG
            </div>

            {/* Bottom title */}
            <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 bg-gradient-to-t from-black/80 to-transparent">
              <div className="text-[10px] tracking-[0.4em] text-[#c9a86a]" style={{ fontFamily: "Inter, sans-serif" }}>{active.subtitle.toUpperCase()}</div>
              <div className="text-[28px] md:text-[36px] font-light leading-none" style={{ fontFamily: "Cormorant Garamond, serif" }}>{active.name}</div>
              <div className="w-10 h-[1px] bg-[#c9a86a] mt-3" />
            </div>

            {/* Drag hint */}
            <div className="absolute inset-0 grid place-items-center pointer-events-none opacity-0 group-hover:opacity-100 transition">
              <div className="bg-black/60 backdrop-blur px-4 py-2 text-[10px] tracking-[0.25em] border border-white/15">← DRAG TO LOOK AROUND →</div>
            </div>
          </div>

          {/* Detail panel */}
          <div className="bg-[#141414] border-l border-white/5 p-6 md:p-8 flex flex-col">
            <div className="text-[11px] tracking-[0.3em] text-white/40" style={{ fontFamily: "Inter, sans-serif" }}>CURATED RESIDENCE • {ROOMS.findIndex(r => r.id === active.id) + 1} / {ROOMS.length}</div>
            <h2 className="text-[32px] font-light mt-2 leading-tight" style={{ fontFamily: "Cormorant Garamond, serif" }}>{active.name}</h2>
            <p className="text-white/60 text-[13px] leading-relaxed mt-3" style={{ fontFamily: "Inter, sans-serif" }}>{active.desc}</p>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="border border-white/10 p-4 bg-white/[0.02]">
                <div className="text-[10px] tracking-widest text-white/40" style={{ fontFamily: "Inter, sans-serif" }}>SURFACE</div>
                <div className="text-[18px] font-light" style={{ fontFamily: "Cormorant Garamond, serif" }}>{active.size}</div>
              </div>
              <div className="border border-white/10 p-4 bg-white/[0.02]">
                <div className="text-[10px] tracking-widest text-white/40" style={{ fontFamily: "Inter, sans-serif" }}>HIGHLIGHT</div>
                <div className="text-[11px] leading-tight text-white/80 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>{active.feature}</div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button onClick={() => { const i = ROOMS.findIndex(r => r.id === active.id); setActive(ROOMS[(i + 1) % ROOMS.length]); }} className="flex-1 py-3 border border-white/15 text-[11px] tracking-widest hover:bg-white hover:text-black transition" style={{ fontFamily: "Inter, sans-serif" }}>NEXT ROOM →</button>
              <button onClick={() => setShowInquiry(true)} className="flex-1 py-3 bg-[#c9a86a] text-black text-[11px] tracking-widest font-medium hover:bg-[#ddb77a] transition" style={{ fontFamily: "Inter, sans-serif" }}>ENQUIRE</button>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="text-[10px] tracking-[0.25em] text-white/40 mb-3" style={{ fontFamily: "Inter, sans-serif" }}>EXPLORE ANY CORNER</div>
              <div className="grid grid-cols-3 gap-2">
                {ROOMS.map(r => (
                  <button key={r.id} onClick={() => setActive(r)} className={`group relative h-16 overflow-hidden border ${active.id === r.id ? "border-[#c9a86a]" : "border-white/10 hover:border-white/20"}`}>
                    <img src={r.image} alt={r.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute inset-0 bg-black/45 group-hover:bg-black/25 transition" />
                    <span className="absolute bottom-1 left-1 text-[8px] tracking-widest text-white px-1" style={{ fontFamily: "Inter, sans-serif" }}>{r.name.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6 flex items-center justify-between text-[10px] tracking-widest text-white/30" style={{ fontFamily: "Inter, sans-serif" }}>
              <span>© CHÂTEAU LUMIÈRE — SOTHEBY’S</span><span>04 • 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* FLOOR PLAN MODAL */}
      {floorOpen && (
        <div className="fixed inset-0 z-[60] grid place-items-center p-4 bg-black/75 backdrop-blur-md" onClick={() => setFloorOpen(false)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-[920px] bg-[#0f0f0f] border border-[#c9a86a]/20 max-h-[90vh] overflow-auto">
            <div className="sticky top-0 flex items-center justify-between px-6 py-4 bg-[#0f0f0f] border-b border-white/10">
              <div>
                <div className="text-[10px] tracking-[0.4em] text-[#c9a86a]" style={{ fontFamily: "Inter, sans-serif" }}>FLOOR PLAN • CLICK ANY ROOM TO TELEPORT</div>
                <div className="text-[18px] font-light" style={{ fontFamily: "Cormorant Garamond, serif" }}>Estate Plan — Ground Floor • 1 : 400</div>
              </div>
              <button onClick={() => setFloorOpen(false)} className="w-8 h-8 grid place-items-center border border-white/15 hover:bg-white hover:text-black transition">✕</button>
            </div>
            <div className="p-4 md:p-8 bg-[#e9e1ca]">
              <svg viewBox="0 0 800 520" className="w-full h-auto">
                <rect x="20" y="20" width="760" height="480" fill="none" stroke="#1a1a1a" strokeWidth="2" />
                {/* Rooms as clickable zones */}
                {[
                  { id: "salon", label: "DRAWING\nROOM", x: 28, y: 28, w: 220, h: 200 },
                  { id: "hall", label: "GRAND\nHALL", x: 250, y: 28, w: 300, h: 200 },
                  { id: "kitchen", label: "KITCHEN", x: 552, y: 28, w: 220, h: 200 },
                  { id: "library", label: "LIBRARY", x: 28, y: 232, w: 180, h: 150 },
                  { id: "master", label: "MASTER\nSUITE", x: 552, y: 232, w: 220, h: 260 },
                  { id: "spa", label: "SPA / POOL", x: 28, y: 386, w: 522, h: 106 },
                ].map(z => {
                  const isActive = active.id === z.id;
                  return (
                    <g key={z.id} className="cursor-pointer" onClick={() => { const r = ROOMS.find(r => r.id === z.id); if (r) setActive(r); setFloorOpen(false); document.getElementById("explorer")?.scrollIntoView({ behavior: "smooth" }); }}>
                      <rect x={z.x} y={z.y} width={z.w} height={z.h} fill={isActive ? "#c9a86a" : "#fff"} fillOpacity={isActive ? 0.95 : 0.85} stroke="#111" strokeWidth={isActive ? 2 : 1} />
                      <text x={z.x + z.w / 2} y={z.y + z.h / 2} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontFamily="Inter, sans-serif" letterSpacing="1" fontWeight="600" fill="#111">{z.label}</text>
                      {isActive && <circle cx={z.x + z.w - 14} cy={z.y + 14} r="4" fill="#111" />}
                    </g>
                  );
                })}
                <text x="400" y="512" textAnchor="middle" fontSize="9" fill="#444" letterSpacing="3">N ↑ • DRAG ANYWHERE • TOTAL 1,850 M²</text>
              </svg>
              <div className="flex flex-wrap gap-2 mt-4 text-[10px] tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>
                <span className="bg-black text-white px-2 py-1">● YOU ARE HERE: {active.name.toUpperCase()}</span>
                <span className="border border-black/20 px-2 py-1">7 SUITES • 4 RECEPTION • HELIPAD</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ESTATE SPECS */}
      <section id="estate" className="bg-[#f5f1e8] text-[#0a0a0a] py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-5">
              <div className="text-[10px] tracking-[0.4em] text-[#8a6d3b]" style={{ fontFamily: "Inter, sans-serif" }}>L’ESTATE</div>
              <h3 className="text-[36px] md:text-[44px] font-light leading-[0.9] mt-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>A private<br /><em className="text-[#8a6d3b]">peninsula</em><br />above the sea.</h3>
              <p className="text-[13px] leading-relaxed text-black/60 mt-4 max-w-[420px]" style={{ fontFamily: "Inter, sans-serif" }}>
                Built for a silk merchant in 1847, restored over 4 years by Liaigre & landscape architect Louis Benech. 4.2 ha of olive, cypress and sculpture garden falling to a private cove. 25m travertine infinity pool aligned with the sunset axis.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-8 border-t border-black/10 pt-6">
                {[
                  ["1,850 m²", "Habitable"],
                  ["4.2 ha", "Park & Gardens"],
                  ["340 m", "Sea Front"],
                ].map(([v, k]) => (
                  <div key={k}><div className="text-[20px] font-light" style={{ fontFamily: "Cormorant Garamond, serif" }}>{v}</div><div className="text-[10px] tracking-widest text-black/40" style={{ fontFamily: "Inter, sans-serif" }}>{k}</div></div>
                ))}
              </div>
            </div>
            <div className="md:col-span-7 grid grid-cols-2 gap-3">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" alt="pool" className="h-[260px] w-full object-cover" />
              <img src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80" alt="interior" className="h-[260px] w-full object-cover" />
              <img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80" alt="estate" className="col-span-2 h-[220px] w-full object-cover" />
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-3 justify-between items-center border-t border-black/10 pt-6">
            <div className="text-[11px] tracking-widest text-black/50" style={{ fontFamily: "Inter, sans-serif" }}>SOTHEBY’S INTERNATIONAL REALTY • NDA & PROOF OF FUNDS REQUIRED • HELICOPTER TRANSFER FROM NICE</div>
            <button onClick={() => setShowInquiry(true)} className="bg-black text-white px-8 py-3 text-[11px] tracking-[0.25em] hover:bg-black/85 transition" style={{ fontFamily: "Inter, sans-serif" }}>REQUEST DOSSIER — €42.5M</button>
          </div>
        </div>
      </section>

      {/* INQUIRY */}
      {showInquiry && (
        <div className="fixed inset-0 z-[70] grid place-items-center p-4 bg-black/70 backdrop-blur" onClick={() => setShowInquiry(false)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-[520px] bg-[#f5f1e8] text-black p-8 border border-[#c9a86a]/30">
            <div className="text-[10px] tracking-[0.4em] text-[#8a6d3b]" style={{ fontFamily: "Inter, sans-serif" }}>PRIVATE VIEWING</div>
            <h4 className="text-[28px] font-light mt-1" style={{ fontFamily: "Cormorant Garamond, serif" }}>Request a private tour</h4>
            <p className="text-[12px] text-black/60 mt-2" style={{ fontFamily: "Inter, sans-serif" }}>This is a sample luxury demo. No real sale — but feel the experience. Leave your details for the concierge.</p>
            <form onSubmit={e => { e.preventDefault(); alert("Thank you — our concierge will contact you. (Demo)"); setShowInquiry(false); }} className="grid gap-3 mt-6">
              <input required placeholder="Full name" className="border border-black/15 px-4 py-3 text-[13px] bg-white" />
              <input required type="email" placeholder="Email" className="border border-black/15 px-4 py-3 text-[13px] bg-white" />
              <input placeholder="Phone (optional)" className="border border-black/15 px-4 py-3 text-[13px] bg-white" />
              <button className="bg-black text-white py-3 text-[11px] tracking-[0.25em] hover:bg-black/90" style={{ fontFamily: "Inter, sans-serif" }}>SEND REQUEST</button>
            </form>
            <button onClick={() => setShowInquiry(false)} className="w-full mt-3 py-2 text-[11px] tracking-widest text-black/40 hover:text-black">CLOSE</button>
          </div>
        </div>
      )}

      <footer className="bg-black text-white/40 text-center py-6 text-[10px] tracking-[0.3em] border-t border-white/5" style={{ fontFamily: "Inter, sans-serif" }}>
        CHÂTEAU LUMIÈRE — IMAGINARY AI CONCEPT • DEMO FOR PORTFOLIO • BUILT WITH NEXT.JS • 3D & AR-READY
      </footer>
    </div>
  );
}
