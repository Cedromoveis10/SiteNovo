import type { Product } from "@/data/types";
import { ProductCard } from "./ProductCard";

export function RelatedProducts({
  products,
  title = "Complete o ambiente",
}: {
  products: Product[];
  title?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-line py-20">
      <p className="eyebrow mb-4">Continuar explorando</p>
      <h2 className="font-display text-4xl tracking-tight">{title}</h2>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
