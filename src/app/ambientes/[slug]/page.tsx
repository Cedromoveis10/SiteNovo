import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import { QuoteButton, SpecialistButton } from "@/components/quote/QuoteButton";
import { Breadcrumbs } from "@/components/ui/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { environments } from "@/data/taxonomy";
import type { EnvironmentSlug } from "@/data/types";
import {
  getProductsByEnvironment,
  productCountLabel,
  productPath,
} from "@/lib/products";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return environments.map((environment) => ({ slug: environment.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const environment = environments.find((item) => item.slug === slug);
  if (!environment) return {};
  return {
    title: `Móveis para ${environment.name.toLowerCase()}`,
    description: environment.description,
    alternates: { canonical: `/ambientes/${environment.slug}` },
  };
}

export default async function EnvironmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const environment = environments.find((item) => item.slug === slug);
  if (!environment) notFound();

  const list = getProductsByEnvironment(environment.slug as EnvironmentSlug);

  return (
    <div className="mx-auto max-w-7xl px-5 pt-28 pb-24 md:px-8 md:pt-36">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Ambientes", path: "/ambientes" },
          { name: environment.name, path: `/ambientes/${environment.slug}` },
        ])}
      />
      <JsonLd
        data={itemListJsonLd(
          environment.name,
          list.map((product) => ({ name: product.name, path: productPath(product) })),
        )}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Ambientes", href: "/ambientes" },
          { label: environment.name },
        ]}
      />
      <div className="mt-8 max-w-2xl">
        <p className="eyebrow">Ambiente</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight md:text-6xl">
          {environment.name}
        </h1>
        <p className="mt-5 text-muted">{environment.description}</p>
        <p className="mt-4 text-sm text-muted">{productCountLabel(list.length)}</p>
      </div>
      <div className="mt-12">
        <ProductGrid products={list} />
      </div>
      <div className="mt-16 flex flex-col gap-3 sm:flex-row">
        <QuoteButton source={`environment_${environment.slug}`} />
        <SpecialistButton source={`environment_${environment.slug}`} />
      </div>
    </div>
  );
}
