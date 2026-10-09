import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Filters } from "@/components/catalog/Filters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CategoryViewTracker } from "@/components/analytics/Trackers";
import { Breadcrumbs } from "@/components/ui/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { categories } from "@/data/taxonomy";
import type { CategorySlug } from "@/data/types";
import {
  filterProducts,
  getProductsByCategory,
  productCountLabel,
  productPath,
} from "@/lib/products";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) return {};
  return {
    title: `${category.name} de alto padrão`,
    description: category.description,
    alternates: { canonical: `/produtos/${category.slug}` },
    openGraph: {
      title: `${category.name} | Cedro`,
      description: category.description,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { category: slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  const list = getProductsByCategory(category.slug as CategorySlug);
  const query = await searchParams;
  const filtered = filterProducts(list, {
    environment: stringParam(query.ambiente),
    material: stringParam(query.material),
    finish: stringParam(query.acabamento),
  });

  return (
    <div className="mx-auto max-w-7xl px-5 pt-28 pb-24 md:px-8 md:pt-36">
      <CategoryViewTracker category={category.slug} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Produtos", path: "/produtos" },
          { name: category.name, path: `/produtos/${category.slug}` },
        ])}
      />
      <JsonLd
        data={itemListJsonLd(
          category.name,
          filtered.map((product) => ({
            name: product.name,
            path: productPath(product),
          })),
        )}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Produtos", href: "/produtos" },
          { label: category.name },
        ]}
      />
      <div className="mt-8 max-w-2xl">
        <p className="eyebrow">Coleção</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight md:text-6xl">
          {category.name}
        </h1>
        <p className="mt-5 text-muted">{category.description}</p>
        <p className="mt-4 text-sm text-muted">{productCountLabel(filtered.length)}</p>
      </div>
      <div className="mt-8 lg:mt-10">
        <Suspense>
          <Filters products={list} />
        </Suspense>
      </div>
      <div className="mt-6 lg:mt-12">
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}

function stringParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
