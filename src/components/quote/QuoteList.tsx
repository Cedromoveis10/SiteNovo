"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuote } from "@/context/QuoteProvider";
import { cn } from "@/lib/utils";

export function QuoteList({ compact = false }: { compact?: boolean }) {
  const { items, remove } = useQuote();
  const pathname = usePathname();

  if (items.length === 0) {
    return (
      <div
        className={cn(
          "border border-line bg-white text-left",
          compact ? "px-4 py-5" : "px-6 py-12 text-center",
        )}
      >
        <p className={cn("font-display tracking-tight", compact ? "text-2xl" : "text-3xl")}>
          {compact ? "Nenhuma peça ainda" : "Sua seleção está vazia"}
        </p>
        <p
          className={cn(
            "text-sm leading-6 text-muted",
            compact ? "mt-2" : "mx-auto mt-3 max-w-md",
          )}
        >
          Adicione peças à lista para consultar um especialista com a seleção completa.
        </p>
        <Link
          href="/produtos"
          className={cn("btn btn-primary", compact ? "mt-4 !min-h-11" : "mt-8")}
        >
          Conhecer a coleção
        </Link>
      </div>
    );
  }

  return (
    <div>
      <ul className="divide-y divide-line border-y border-line">
        {items.map((item) => (
          <li key={item.id} className={cn("flex items-center gap-4", compact ? "py-3" : "py-5")}>
            <div className={cn("relative shrink-0 bg-white", compact ? "h-14 w-14" : "h-20 w-20")}>
              {item.image ? (
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-contain p-2"
                  sizes={compact ? "56px" : "80px"}
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/produtos/${item.category}/${item.slug}`}
                className={cn(
                  "font-display tracking-tight",
                  compact ? "text-xl" : "text-2xl",
                )}
              >
                {item.name}
              </Link>
            </div>
            <button
              type="button"
              onClick={() => remove(item.id)}
              className="text-[0.68rem] tracking-[0.16em] text-muted uppercase hover:text-ink"
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
      {pathname !== "/orcamento" ? (
        <div className="mt-8">
          <Link href="/orcamento" className="btn btn-secondary">
            Completar dados
          </Link>
        </div>
      ) : null}
    </div>
  );
}
