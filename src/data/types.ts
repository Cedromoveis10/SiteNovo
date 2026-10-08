export type CategorySlug =
  | "mesas"
  | "cadeiras"
  | "banquetas"
  | "estofados"
  | "poltronas";
export type EnvironmentSlug = "sala-de-jantar" | "gourmet" | "sala-de-estar";
export type SupplierFlag = "Home" | "Klassic";

export type ProductImage = {
  src: string;
  alt: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: CategorySlug;
  subcategory?: string;
  collection?: string;
  environment: EnvironmentSlug[];
  description?: string;
  dimensions?: string;
  materials?: string[];
  finishes?: string[];
  images: ProductImage[];
  featured?: boolean;
};

/** Catalog record with internal supplier flag. Never rendered in the public UI. */
export type CatalogProduct = Product & {
  supplier: SupplierFlag;
};

export type Category = {
  slug: CategorySlug;
  name: string;
  singular: string;
  description: string;
};

export type Environment = {
  slug: EnvironmentSlug;
  name: string;
  description: string;
  image: string;
};
