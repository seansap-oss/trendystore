'use client';
import { useState, useEffect } from 'react';

export default function PWAInstallBanner() {
  const [deferred, setDeferred] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(()=>{
    const handler = (e:any)=> { e.preventDefault(); setDeferred(e); setShow(true); };
    window.addEventListener('beforeinstallprompt', handler);
    // iOS home screen guidance
    const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    const isStandalone = (window.matchMedia('(display-mode: standalone)').matches) || (navigator as any).standalone;
    if (isIOS && !isStandalone) setShow(true);
    return ()=> window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!show) return null;

  return (
    <div className="bg-emerald-600 text-white p-3 flex items-center justify-between text-sm">
      <span>Add FreshBasket to Home Screen for delivery tracking & driver alerts</span>
      <div className="flex gap-2">
        {deferred && <button onClick={async()=>{
          deferred.prompt(); const {outcome}=await deferred.userChoice; setShow(false);
        }} className="bg-white text-emerald-700 px-4 py-1 rounded-full font-bold">Install</button>}
        <button onClick={()=>setShow(false)} className="border border-white/50 px-3 py-1 rounded-full">Later</button>
      </div>
    </div>
  );
}
