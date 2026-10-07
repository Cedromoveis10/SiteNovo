"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/types";
import { track } from "@/lib/analytics";
import { categoryLabel, productPath } from "@/lib/products";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  dark = false,
}: {
  product: Product;
  featured?: boolean;
  dark?: boolean;
}) {
  const image = product.images[0];
  const detail = product.collection
    ? `Coleção ${product.collection}`
    : product.subcategory || "";

  return (
    <article className="flex h-full flex-col">
      <Link
        href={productPath(product)}
        className="group flex h-full flex-col"
        aria-label={`Conhecer ${product.name}`}
        onClick={() =>
          track("select_product", {
            item_id: product.id,
            item_name: product.name,
            item_category: product.category,
          })
        }
      >
        <div
          className={cn(
            "relative aspect-square overflow-hidden",
            dark ? "bg-ink-soft" : "bg-white",
          )}
        >
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-contain object-center p-8 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          ) : null}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-5 opacity-0 transition-opacity duration-400 group-hover:opacity-100">
            <span className={cn("btn", dark ? "btn-light" : "btn-primary")}>
              Conhecer produto
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col pt-5">
          <p className="eyebrow min-h-4">{categoryLabel(product.category)}</p>
          <h3
            className={cn(
              "mt-2 min-h-[3.2rem] font-display text-2xl leading-tight tracking-tight",
              dark ? "text-paper" : "text-ink",
            )}
          >
            {product.name}
          </h3>
          <p className="mt-1 min-h-5 text-sm text-muted">{detail}</p>
        </div>
      </Link>
    </article>
  );
}
