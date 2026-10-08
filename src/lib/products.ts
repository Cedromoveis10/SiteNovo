import productsData from "@/data/products.json";
import { categories, environments } from "@/data/taxonomy";
import type {
  CategorySlug,
  EnvironmentSlug,
  Product,
} from "@/data/types";
import { mediaUrl } from "./media";
import { unique } from "./utils";

export const products = (productsData as Product[]).map((product) => ({
  ...product,
  images: product.images.map((image) => ({
    ...image,
    src: mediaUrl(image.src),
  })),
}));

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(category: CategorySlug): Product[] {
  return products.filter((product) => product.category === category);
}

export function getProductsByEnvironment(
  environment: EnvironmentSlug,
): Product[] {
  return products.filter((product) =>
    product.environment.includes(environment),
  );
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCollection = product.collection
    ? products.filter(
        (item) =>
          item.id !== product.id && item.collection === product.collection,
      )
    : [];

  const sameCategory = products.filter(
    (item) =>
      item.id !== product.id &&
      item.category === product.category &&
      !sameCollection.some((related) => related.id === item.id),
  );

  const sameEnvironment = products.filter(
    (item) =>
      item.id !== product.id &&
      item.environment.some((env) => product.environment.includes(env)) &&
      !sameCollection.some((related) => related.id === item.id) &&
      !sameCategory.some((related) => related.id === item.id),
  );

  return [...sameCollection, ...sameCategory, ...sameEnvironment].slice(
    0,
    limit,
  );
}

export function productPath(product: Product): string {
  return `/produtos/${product.category}/${product.slug}`;
}

export function categoryPath(slug: CategorySlug): string {
  return `/produtos/${slug}`;
}

export function environmentPath(slug: EnvironmentSlug): string {
  return `/ambientes/${slug}`;
}

export function searchProducts(query: string): Product[] {
  const term = query.trim().toLowerCase();
  if (!term) return [];

  return products.filter((product) => {
    const haystack = [
      product.name,
      product.category,
      product.subcategory,
      product.collection,
      product.dimensions,
      ...(product.materials ?? []),
      ...(product.finishes ?? []),
      ...product.environment,
      product.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(term);
  });
}

export function getFilterOptions(list: Product[] = products) {
  return {
    categories: unique(list.map((product) => product.category)),
    environments: unique(list.flatMap((product) => product.environment)),
    materials: unique(list.flatMap((product) => product.materials ?? [])),
    finishes: unique(list.flatMap((product) => product.finishes ?? [])),
    collections: unique(
      list
        .map((product) => product.collection)
        .filter((value): value is string => Boolean(value)),
    ),
  };
}

export function filterProducts(
  list: Product[],
  filters: {
    category?: string;
    environment?: string;
    material?: string;
    finish?: string;
    collection?: string;
    query?: string;
  },
): Product[] {
  return list.filter((product) => {
    if (filters.category && product.category !== filters.category) return false;
    if (
      filters.environment &&
      !product.environment.includes(filters.environment as EnvironmentSlug)
    ) {
      return false;
    }
    if (
      filters.material &&
      !product.materials?.includes(filters.material)
    ) {
      return false;
    }
    if (filters.finish && !product.finishes?.includes(filters.finish)) {
      return false;
    }
    if (filters.collection && product.collection !== filters.collection) {
      return false;
    }
    if (filters.query) {
      return searchProducts(filters.query).some((item) => item.id === product.id);
    }
    return true;
  });
}

export function categoryLabel(slug: string): string {
  return categories.find((category) => category.slug === slug)?.name ?? slug;
}

export function environmentLabel(slug: string): string {
  return (
    environments.find((environment) => environment.slug === slug)?.name ?? slug
  );
}

export function productCountLabel(count: number): string {
  return count === 1 ? "1 peça" : `${count} peças`;
}
