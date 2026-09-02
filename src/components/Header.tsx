'use client';
import SupermarketHeader from '@/components/supermarket/Header';

// FreshBasket header — replaces cafe header
export default function Header(props: { title?: string; showBack?: boolean; showSettings?: boolean }) {
  // props kept for compat but ignored — supermarket header handles everything
  return <SupermarketHeader />;
}
