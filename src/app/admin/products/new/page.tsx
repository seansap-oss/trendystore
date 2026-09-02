'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProductRedirect() {
  const router = useRouter();
  useEffect(()=> {
    const id = `prod_${Date.now()}`;
    router.replace(`/admin/products/${id}?new=1`);
  }, [router]);
  return <div className="p-10">Creating product...</div>;
}
