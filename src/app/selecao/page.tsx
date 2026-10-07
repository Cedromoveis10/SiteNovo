import type { Metadata } from "next";
import { QuoteList } from "@/components/quote/QuoteList";

export const metadata: Metadata = {
  title: "Minha seleção",
  description: "Lista de peças para solicitar orçamento na Cedro.",
  robots: { index: false, follow: false },
};

export default function SelectionPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-28 pb-24 md:px-8 md:pt-36">
      <p className="eyebrow">Lista de orçamento</p>
      <h1 className="mt-3 font-display text-5xl tracking-tight">Minha seleção</h1>
      <p className="mt-5 text-muted">
        Reúna as peças de interesse e envie tudo em uma única conversa com um especialista.
      </p>
      <div className="mt-12">
        <QuoteList />
      </div>
    </div>
  );
}
