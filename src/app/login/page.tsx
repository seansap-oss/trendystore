'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UniqloHeader from '@/components/uniqlo/Header';
import Ticker from '@/components/uniqlo/Ticker';
import { useUserStore } from '@/lib/userStore';

export default function LoginPage(){
  const [name,setName]=useState(''); const [pin,setPin]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  const signUp=useUserStore(s=>s.signUp); const login=useUserStore(s=>s.login); const session=useUserStore(s=>s.session); const router=useRouter();
  useEffect(()=>{ if(session?.loggedIn) router.replace('/profile'); }, [session, router]);
  const submit=()=>{
    setError(''); setLoading(true);
    if(name.trim().length<4){ setError('Name must be at least 4 letters'); setLoading(false); return; }
    if(!/^\d{4}$/.test(pin)){ setError('PIN must be 4 digits'); setLoading(false); return; }
    const lr=login(name.trim(), pin);
    if(lr.success){ router.push('/profile'); setLoading(false); return; }
    const sr=signUp(name.trim(), pin);
    if(sr.success) router.push('/profile'); else setError(sr.error||'Failed');
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <UniqloHeader /><Ticker />
      <div className="max-w-[420px] mx-auto px-4 py-10">
        <div className="bg-white border border-neutral-200 p-6">
          <div className="text-center mb-6"><div className="w-12 h-12 bg-[#e10600] flex items-center justify-center mx-auto"><span className="text-white font-black text-xs">PF</span></div><h1 className="font-black mt-3" style={{ fontFamily: 'var(--font-space-grotesk)' }}>SIGN IN / REGISTER</h1><p className="text-xs text-neutral-500 mt-1">Name + 4-digit PIN — stored locally (DB sign-in/sign-out). All profiles work.</p></div>
          <div className="space-y-4">
            <div><label className="text-xs font-bold">YOUR NAME</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Min 4 letters" className="w-full border border-neutral-300 px-3 py-3 text-sm mt-1" maxLength={30} /></div>
            <div><label className="text-xs font-bold">4-DIGIT PIN</label><input type="password" inputMode="numeric" maxLength={4} value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,''))} placeholder="••••" className="w-full border border-neutral-300 px-3 py-3 text-sm mt-1 text-center tracking-[0.5em] font-mono" /></div>
            {error && <p className="text-xs text-red-600 text-center">{error}</p>}
            <button onClick={submit} disabled={!name || !pin || loading} className="w-full bg-black text-white py-3 text-xs font-black tracking-widest disabled:opacity-50">{loading ? 'PLEASE WAIT...' : 'LOGIN / SIGN UP'}</button>
          </div>
        </div>
        <p className="text-xs text-neutral-500 text-center mt-3">Admin can view all profiles in /admin. Logout clears session only.</p>
      </div>
    </div>
  );
}
