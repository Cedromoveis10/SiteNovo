import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import {
  AddToQuoteButton,
  QuoteButton,
  SpecialistButton,
} from "@/components/quote/QuoteButton";
import { ProductViewTracker } from "@/components/analytics/Trackers";
import { Breadcrumbs } from "@/components/ui/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { categories } from "@/data/taxonomy";
import {
  categoryLabel,
  environmentLabel,
  getProductBySlug,
  getRelatedProducts,
  productPath,
  products,
} from "@/lib/products";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return products.map((product) => ({
    category: product.category,
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description:
      product.description ||
      `${product.name} — móvel de alto padrão da curadoria Cedro.`,
    alternates: { canonical: productPath(product) },
    openGraph: {
      title: `${product.name} | Cedro`,
      description: product.description,
      images: product.images.map((image) => ({
        url: image.src,
        alt: image.alt,
      })),
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || product.category !== category) notFound();

  const categoryMeta = categories.find((item) => item.slug === product.category);
  const related = getRelatedProducts(product);

  const variationLabel = isMechanism(product.subcategory)
    ? "Mecanismo"
    : "Variação";

  const specs = [
    product.collection ? ["Coleção", product.collection] : null,
    product.subcategory ? [variationLabel, product.subcategory] : null,
    product.dimensions ? ["Dimensões", product.dimensions] : null,
    product.materials?.length
      ? ["Materiais", product.materials.join(", ")]
      : null,
    product.finishes?.length
      ? ["Acabamentos", product.finishes.join(", ")]
      : null,
    product.environment.length
      ? ["Ambientes", product.environment.map(environmentLabel).join(", ")]
      : null,
  ].filter(Boolean) as Array<[string, string]>;

  return (
    <div className="mx-auto max-w-7xl px-5 pt-28 pb-24 md:px-8 md:pt-36">
      <ProductViewTracker
        id={product.id}
        name={product.name}
        category={product.category}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Produtos", path: "/produtos" },
          { name: categoryLabel(product.category), path: `/produtos/${product.category}` },
          { name: product.name, path: productPath(product) },
        ])}
      />
      <JsonLd data={productJsonLd(product)} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Produtos", href: "/produtos" },
          { label: categoryLabel(product.category), href: `/produtos/${product.category}` },
          { label: product.name },
        ]}
      />

      <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} name={product.name} />
        </div>
        <div className="lg:col-span-5 lg:pt-4">
          <p className="eyebrow">{categoryMeta?.singular ?? categoryLabel(product.category)}</p>
          <h1 className="mt-3 font-display text-5xl tracking-tight">{product.name}</h1>
          {product.description ? (
            <p className="mt-6 text-[1.02rem] leading-7 text-muted">{product.description}</p>
          ) : null}

          {specs.length > 0 ? (
            <dl className="mt-10 divide-y divide-line border-y border-line">
              {specs.map(([label, value]) => (
                <div
                  key={label}
                  className="grid gap-2 py-4 sm:grid-cols-[8rem_1fr] sm:items-baseline sm:gap-6"
                >
                  <dt className="eyebrow">{label}</dt>
                  <dd className="text-sm leading-6 sm:text-right">{value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          <div className="sticky bottom-20 mt-10 flex flex-col gap-3 bg-white py-4 md:static md:bottom-auto">
            <QuoteButton product={product} source="product_page" className="w-full" />
            <SpecialistButton source="product_page" className="w-full" />
            <AddToQuoteButton product={product} />
          </div>
        </div>
      </div>

      <RelatedProducts products={related} />
    </div>
  );
}

function isMechanism(value?: string) {
  return Boolean(value && /^(Retrátil|Fixo|Retrátil\/Fixo)$/.test(value));
}
