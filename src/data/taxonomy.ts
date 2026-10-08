import { mediaUrl } from "@/lib/media";
import type { Category, Environment } from "./types";

export const categories: Category[] = [
  {
    slug: "mesas",
    name: "Mesas",
    singular: "Mesa",
    description:
      "Mesas de jantar com presença escultórica, pensadas para acompanhar o cotidiano e o convívio.",
  },
  {
    slug: "cadeiras",
    name: "Cadeiras",
    singular: "Cadeira",
    description:
      "Cadeiras com desenho atemporal, em madeira, palhinha e estofados selecionados.",
  },
  {
    slug: "banquetas",
    name: "Banquetas",
    singular: "Banqueta",
    description:
      "Banquetas para ilha e gourmet, com o mesmo cuidado de proporção das cadeiras da coleção.",
  },
  {
    slug: "estofados",
    name: "Estofados",
    singular: "Estofado",
    description:
      "Estofados para a sala de estar, em configurações fixas e retráteis.",
  },
  {
    slug: "poltronas",
    name: "Poltronas",
    singular: "Poltrona",
    description: "Poltronas para a sala de estar.",
  },
];

export const environments: Environment[] = [
  {
    slug: "sala-de-jantar",
    name: "Sala de jantar",
    description:
      "Mesas e cadeiras para o ambiente de convívio — onde o desenho da peça organiza a sala.",
    image: mediaUrl("/products/mesa-escocia.png"),
  },
  {
    slug: "gourmet",
    name: "Gourmet",
    description:
      "Banquetas para ilha e espaços gourmet, com conforto e continuidade visual da coleção.",
    image: mediaUrl("/products/banqueta-lucia-02.png"),
  },
  {
    slug: "sala-de-estar",
    name: "Sala de estar",
    description:
      "Estofados e poltronas para o estar — peças para composição e conforto do ambiente.",
    image: mediaUrl("/products/estofado-rivo.png"),
  },
];

export const categoryBySlug = Object.fromEntries(
  categories.map((category) => [category.slug, category]),
) as Record<Category["slug"], Category>;

export const environmentBySlug = Object.fromEntries(
  environments.map((environment) => [environment.slug, environment]),
) as Record<Environment["slug"], Environment>;
