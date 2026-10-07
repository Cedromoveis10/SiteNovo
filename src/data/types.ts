export type CategorySlug = "mesas" | "cadeiras" | "banquetas";
export type EnvironmentSlug = "sala-de-jantar" | "gourmet";

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
  materials?: string[];
  finishes?: string[];
  images: ProductImage[];
  featured?: boolean;
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
