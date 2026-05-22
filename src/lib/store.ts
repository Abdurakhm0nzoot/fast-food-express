import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./products";

export type Address = {
  formatted: string;
  lat: number;
  lng: number;
  entrance?: string;
} | null;

type CartItem = { id: string; qty: number };

type AppState = {
  // auth (demo)
  phone: string | null;
  setPhone: (p: string | null) => void;

  // address
  address: Address;
  setAddress: (a: Address) => void;

  // cart
  items: CartItem[];
  add: (p: Product) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;

  // ui
  cartOpen: boolean;
  setCartOpen: (b: boolean) => void;
  loginOpen: boolean;
  setLoginOpen: (b: boolean) => void;
  addressOpen: boolean;
  setAddressOpen: (b: boolean) => void;
  checkoutOpen: boolean;
  setCheckoutOpen: (b: boolean) => void;
};

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      phone: null,
      setPhone: (phone) => set({ phone }),

      address: null,
      setAddress: (address) => set({ address }),

      items: [],
      add: (p) =>
        set((s) => {
          const ex = s.items.find((i) => i.id === p.id);
          return ex
            ? { items: s.items.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i)) }
            : { items: [...s.items, { id: p.id, qty: 1 }] };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items: qty <= 0 ? s.items.filter((i) => i.id !== id) : s.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        })),
      clear: () => set({ items: [] }),

      cartOpen: false,
      setCartOpen: (cartOpen) => set({ cartOpen }),
      loginOpen: false,
      setLoginOpen: (loginOpen) => set({ loginOpen }),
      addressOpen: false,
      setAddressOpen: (addressOpen) => set({ addressOpen }),
      checkoutOpen: false,
      setCheckoutOpen: (checkoutOpen) => set({ checkoutOpen }),
    }),
    {
      name: "evos-clone-app",
      partialize: (s) => ({ phone: s.phone, address: s.address, items: s.items }),
    },
  ),
);
