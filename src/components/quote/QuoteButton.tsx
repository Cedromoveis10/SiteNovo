"use client";

import Link from "next/link";
import { useQuote } from "@/context/QuoteProvider";
import type { Product } from "@/data/types";
import { track } from "@/lib/analytics";
import { specialistMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { StoreChoiceButton } from "./StorePicker";

export function QuoteButton({
  product,
  source = "product",
  className,
}: {
  product?: Product;
  source?: string;
  className?: string;
}) {
  const { add } = useQuote();

  return (
    <Link
      href="/orcamento"
      className={cn("btn btn-primary", className)}
      onClick={() => {
        if (product) add(product);
        track("begin_quote", {
          source,
          item_id: product?.id,
          item_name: product?.name,
        });
      }}
    >
      Solicitar orçamento
    </Link>
  );
}

export function SpecialistButton({
  className,
  source = "specialist",
  product,
}: {
  className?: string;
  source?: string;
  product?: Product;
}) {
  return (
    <StoreChoiceButton
      source={source}
      className={cn("btn btn-secondary", className)}
      buildMessage={(showroom) => specialistMessage(showroom, product?.name)}
    >
      Falar com um especialista
    </StoreChoiceButton>
  );
}

export function AddToQuoteButton({ product }: { product: Product }) {
  const { add, has } = useQuote();
  const selected = has(product.id);

  return (
    <button
      type="button"
      onClick={() => add(product)}
      disabled={selected}
      className="btn btn-secondary w-full disabled:opacity-50"
    >
      {selected ? "Na sua seleção" : "Adicionar à minha lista de orçamento"}
    </button>
  );
}
