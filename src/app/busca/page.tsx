import type { Metadata } from "next";
import { ProductGrid } from "@/components/product/ProductGrid";
import { searchProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Busca",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim().slice(0, 80);
  const results = searchProducts(query);

  return (
    <div className="mx-auto max-w-7xl px-5 pt-28 pb-24 md:px-8 md:pt-36">
      <p className="eyebrow">Busca</p>
      <h1 className="mt-3 font-display text-5xl tracking-tight">
        {query ? `Resultados para “${query}”` : "Digite o que procura"}
      </h1>
      <p className="mt-4 text-sm text-muted">
        {query
          ? results.length === 1
            ? "1 peça encontrada"
            : `${results.length} peças encontradas`
          : "Busque por nome, categoria, coleção, material ou ambiente."}
      </p>
      <div className="mt-12">
        {results.length > 0 ? (
          <ProductGrid products={results} />
        ) : query ? (
          <p className="text-muted">Nenhuma peça corresponde a esta busca.</p>
        ) : null}
      </div>
    </div>
  );
}
