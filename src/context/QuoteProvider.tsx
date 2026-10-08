"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "@/data/types";
import { track } from "@/lib/analytics";
import { products } from "@/lib/products";

type QuoteItem = {
  id: string;
  name: string;
  slug: string;
  category: Product["category"];
  image: string;
};

type QuoteContextValue = {
  items: QuoteItem[];
  add: (product: Product) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
  toast: string | null;
};

const STORAGE_KEY = "cedro-quote-list";
const QuoteContext = createContext<QuoteContextValue | null>(null);

function toItem(product: Product): QuoteItem {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category,
    image: product.images[0]?.src ?? "",
  };
}

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setItems(stored ? sanitizeQuoteItems(JSON.parse(stored)) : []);
    } catch {
      setItems([]);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const add = useCallback((product: Product) => {
    setItems((current) => {
      if (current.some((item) => item.id === product.id)) return current;
      track("add_to_quote", { item_id: product.id, item_name: product.name });
      setToast(`${product.name} foi adicionada à sua seleção.`);
      return [...current, toItem(product)];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((current) => {
      const item = current.find((entry) => entry.id === id);
      if (item) track("remove_from_quote", { item_id: id, item_name: item.name });
      return current.filter((entry) => entry.id !== id);
    });
  }, []);

  const has = useCallback(
    (id: string) => items.some((item) => item.id === id),
    [items],
  );

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, add, remove, has, clear, toast }),
    [items, add, remove, has, clear, toast],
  );

  return (
    <QuoteContext.Provider value={value}>
      {children}
      {toast ? (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 border border-cedar bg-[color-mix(in_srgb,var(--cedar)_18%,white)] px-5 py-3 text-center text-[0.72rem] tracking-[0.16em] text-ink uppercase md:bottom-8"
        >
          {toast}
        </div>
      ) : null}
    </QuoteContext.Provider>
  );
}

function sanitizeQuoteItems(raw: unknown): QuoteItem[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const next: QuoteItem[] = [];
  for (const entry of raw) {
    const id =
      entry && typeof entry === "object" && "id" in entry
        ? String((entry as { id?: unknown }).id)
        : "";
    const product = products.find((item) => item.id === id);
    if (!product || seen.has(product.id)) continue;
    seen.add(product.id);
    next.push(toItem(product));
    if (next.length >= 30) break;
  }
  return next;
}

export function useQuote() {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error("useQuote must be used within QuoteProvider");
  }
  return context;
}
