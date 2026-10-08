import type { Metadata } from "next";
import { QuoteForm } from "@/components/quote/QuoteForm";
import { QuoteList } from "@/components/quote/QuoteList";

export const metadata: Metadata = {
  title: "Solicitar orçamento",
  description:
    "Solicite uma proposta Cedro. Escolha o showroom mais próximo e fale com um especialista.",
  alternates: { canonical: "/orcamento" },
};

export default function QuotePage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-[5.25rem] pb-8 max-md:-mb-20 md:px-8 md:pt-[6.75rem] md:pb-10">
      <div className="max-w-3xl">
        <p className="eyebrow">Proposta</p>
        <h1 className="mt-1.5 font-display text-[2rem] tracking-tight md:text-[2.5rem]">
          Solicitar orçamento
        </h1>
        <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted">
          Escolha o showroom mais próximo. No WhatsApp, nome e telefone são opcionais — se
          preencher, guardamos para o atendimento.
        </p>
      </div>

      <div className="mt-5 grid items-start gap-6 lg:mt-7 lg:grid-cols-12 lg:gap-10">
        <div className="order-2 lg:order-1 lg:col-span-4">
          <p className="eyebrow mb-3">Minha seleção</p>
          <QuoteList compact />
        </div>
        <div className="order-1 lg:order-2 lg:col-span-8">
          <QuoteForm source="orcamento_page" />
        </div>
      </div>
    </div>
  );
}
