'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useUniqloStore } from '@/lib/uniqlo/store';

export default function AnnouncementBar(){
  const announcements = useUniqloStore(s=> s.announcements);
  const active = announcements.filter(a=> a.enabled).sort((a,b)=> a.priority - b.priority);
  const [idx, setIdx] = useState(0);

  useEffect(()=>{
    if(active.length <=1) return;
    const id = setInterval(()=> setIdx(i=> (i+1)%active.length), 4000);
    return ()=> clearInterval(id);
  }, [active.length]);

  if(active.length===0) return null;
  const cur = active[idx % active.length];

  return (
    <div className="w-full flex items-center justify-between gap-2 px-2 sm:px-4 py-2 text-[11px] sm:text-xs font-bold tracking-widest" style={{ background: cur.bgColor, color: cur.textColor }}>
      <button onClick={()=> setIdx(i=> (i-1+active.length)%active.length)} className="p-1 hover:opacity-70 hidden sm:flex"><ChevronLeft className="w-4 h-4" /></button>
      <Link href={cur.link || '/'} className="flex-1 text-center truncate hover:underline">
        <span className="hidden sm:inline">{cur.text}</span>
        <span className="sm:hidden">{cur.mobileText || cur.text}</span>
      </Link>
      <button onClick={()=> setIdx(i=> (i+1)%active.length)} className="p-1 hover:opacity-70 hidden sm:flex"><ChevronRight className="w-4 h-4" /></button>
      <span className="hidden sm:inline text-[10px] opacity-60">{idx+1}/{active.length}</span>
    </div>
  );
}
