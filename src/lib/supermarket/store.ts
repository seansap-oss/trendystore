'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SupermarketCartItem, SupermarketProduct, ShoppingList } from './types';

type Fulfilment = 'Delivery' | 'Pickup' | null;
type LocationState = {
  fulfilment: Fulfilment;
  postcode?: string;
  suburb?: string;
  address?: string;
  storeId?: string;
  deliverySlotId?: string;
  pickupSlotId?: string;
};

interface SupermarketState {
  cart: SupermarketCartItem[];
  favourites: string[]; // productIds
  lists: ShoppingList[];
  location: LocationState;
  recentSearches: string[];
  // cart actions
  addToCart: (product: SupermarketProduct, qty?: number, note?: string) => void;
  updateQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  // favourites
  toggleFavourite: (productId: string) => void;
  // lists
  createList: (name: string) => void;
  addToList: (listId: string, productId: string, qty?: number) => void;
  removeFromList: (listId: string, productId: string) => void;
  deleteList: (listId: string) => void;
  addListToCart: (listId: string) => void;
  // location
  setLocation: (loc: Partial<LocationState>) => void;
  // search
  addRecentSearch: (q: string) => void;
}

export const useSupermarketStore = create<SupermarketState>()(
  persist(
    (set, get) => ({
      cart: [],
      favourites: [],
      lists: [
        { id: 'list_weekly', name: 'Weekly Shop', items: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 'list_fav', name: 'Favourites', items: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ],
      location: { fulfilment: null },
      recentSearches: [],

      addToCart: (product, qty = 1, note) =>
        set((s) => {
          const idx = s.cart.findIndex((c) => c.product.id === product.id && (c.note || '') === (note || ''));
          if (idx >= 0) {
            const copy = [...s.cart];
            copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty };
            return { cart: copy };
          }
          return { cart: [...s.cart, { product, quantity: qty, note, substitutionPreference: 'allow' }] };
        }),

      updateQty: (productId, qty) =>
        set((s) => {
          if (qty <= 0) return { cart: s.cart.filter((c) => c.product.id !== productId) };
          return { cart: s.cart.map((c) => (c.product.id === productId ? { ...c, quantity: qty } : c)) };
        }),

      removeFromCart: (productId) => set((s) => ({ cart: s.cart.filter((c) => c.product.id !== productId) })),
      clearCart: () => set({ cart: [] }),

      toggleFavourite: (productId) =>
        set((s) => ({
          favourites: s.favourites.includes(productId)
            ? s.favourites.filter((id) => id !== productId)
            : [...s.favourites, productId],
        })),

      createList: (name) =>
        set((s) => ({
          lists: [
            ...s.lists,
            { id: `list_${Date.now()}`, name, items: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          ],
        })),

      addToList: (listId, productId, qty = 1) =>
        set((s) => ({
          lists: s.lists.map((l) =>
            l.id === listId
              ? {
                  ...l,
                  items: l.items.find((i) => i.productId === productId)
                    ? l.items.map((i) => (i.productId === productId ? { ...i, quantity: i.quantity + qty } : i))
                    : [...l.items, { productId, quantity: qty }],
                  updatedAt: new Date().toISOString(),
                }
              : l
          ),
        })),

      removeFromList: (listId, productId) =>
        set((s) => ({
          lists: s.lists.map((l) => (l.id === listId ? { ...l, items: l.items.filter((i) => i.productId !== productId) } : l)),
        })),

      deleteList: (listId) => set((s) => ({ lists: s.lists.filter((l) => l.id !== listId) })),

      addListToCart: (listId) => {
        const list = get().lists.find((l) => l.id === listId);
        if (!list) return;
        // dynamic import to avoid cycle — we load products here lazily via global
        // caller should resolve product objects; we handle via event — for now just store ids and expect UI to expand
        // Instead we directly push by looking up from PRODUCTS in UI layer; here we no-op and UI will call addToCart per item
      },

      setLocation: (loc) => set((s) => ({ location: { ...s.location, ...loc } })),

      addRecentSearch: (q) =>
        set((s) => {
          const filtered = s.recentSearches.filter((x) => x !== q);
          return { recentSearches: [q, ...filtered].slice(0, 8) };
        }),
    }),
    {
      name: 'freshbasket-store',
      version: 1,
    }
  )
);


