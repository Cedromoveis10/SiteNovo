"use client";

import { QuoteProvider } from "@/context/QuoteProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <QuoteProvider>{children}</QuoteProvider>;
}
