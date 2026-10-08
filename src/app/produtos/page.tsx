import type { Metadata } from "next";
import { Suspense } from "react";
import { Filters } from "@/components/catalog/Filters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CategoryViewTracker } from "@/components/analytics/Trackers";
import { Breadcrumbs } from "@/components/ui/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { products, filterProducts, productCountLabel, productPath } from "@/lib/products";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Coleção de móveis de alto padrão",
  description:
    "Explore mesas, cadeiras, banquetas, estofados e poltronas da curadoria Cedro. Design contemporâneo para ambientes de alto padrão.",
  alternates: { canonical: "/produtos" },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filtered = filterProducts(products, {
    category: stringParam(params.categoria),
    environment: stringParam(params.ambiente),
    material: stringParam(params.material),
    finish: stringParam(params.acabamento),
  });

  return (
    <div className="mx-auto max-w-7xl px-5 pt-28 pb-24 md:px-8 md:pt-36">
      <CategoryViewTracker category="colecao" />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Produtos", path: "/produtos" },
        ])}
      />
      <JsonLd
        data={itemListJsonLd(
          "Coleção Cedro",
          filtered.map((product) => ({
            name: product.name,
            path: productPath(product),
          })),
        )}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Produtos" },
        ]}
      />
      <div className="mt-8 max-w-2xl">
        <p className="eyebrow">Coleção</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight md:text-6xl">Produtos</h1>
        <p className="mt-5 text-muted">
          Mesas, cadeiras, banquetas, estofados e poltronas selecionadas para ambientes que pedem presença e permanência.
        </p>
        <p className="mt-4 text-sm text-muted">{productCountLabel(filtered.length)}</p>
      </div>
      <div className="mt-10">
        <Suspense>
          <Filters products={products} />
        </Suspense>
      </div>
      <div className="mt-12">
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}

function stringParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
