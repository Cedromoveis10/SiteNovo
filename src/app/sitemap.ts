import { siteConfig } from "@/config/site";
import { categories, environments } from "@/data/taxonomy";
import { products } from "@/lib/products";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const toEntry = (path: string) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: now,
  });

  return [
    "",
    "/produtos",
    "/ambientes",
    "/a-marca",
    "/showroom",
    "/orcamento",
    "/privacidade",
    ...categories.map((category) => `/produtos/${category.slug}`),
    ...environments.map((environment) => `/ambientes/${environment.slug}`),
    ...products.map((product) => `/produtos/${product.category}/${product.slug}`),
  ].map(toEntry);
}
