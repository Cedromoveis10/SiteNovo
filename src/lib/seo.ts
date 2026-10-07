import { siteConfig } from "@/config/site";
import type { Product } from "@/data/types";
import { absoluteMediaUrl } from "./media";
import { categoryLabel, productPath } from "./products";
import { instagramHref } from "./utils";
import { toE164Digits } from "./whatsapp";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.legalName,
    url: siteConfig.url,
    logo: absoluteMediaUrl("/brand/logo-transparent.png"),
    foundingDate: siteConfig.founded,
    sameAs: [
      instagramHref(siteConfig.instagram),
      ...siteConfig.showrooms.map((showroom) => instagramHref(showroom.instagram)),
    ].filter((value, index, array) => array.indexOf(value) === index),
  };
}

export function localBusinessJsonLd() {
  return siteConfig.showrooms.map((showroom) => ({
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    name: `${siteConfig.legalName} — ${showroom.name}`,
    image: absoluteMediaUrl("/brand/logo-transparent.png"),
    url: `${siteConfig.url}/showroom`,
    telephone: showroom.phone ? `+${toE164Digits(showroom.phone)}` : undefined,
    sameAs: showroom.instagram ? [instagramHref(showroom.instagram)] : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: showroom.street,
      addressLocality: showroom.city,
      addressRegion: showroom.state,
      postalCode: showroom.zip,
      addressCountry: "BR",
    },
  }));
}

export function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((image) => absoluteMediaUrl(image.src)),
    brand: {
      "@type": "Brand",
      name: siteConfig.legalName,
    },
    category: categoryLabel(product.category),
    url: `${siteConfig.url}${productPath(product)}`,
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

export function itemListJsonLd(
  name: string,
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: `${siteConfig.url}${item.path}`,
    })),
  };
}
