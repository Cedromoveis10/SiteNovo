import { readFileSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";
import { loadEnvLocal } from "./load-env.mjs";

loadEnvLocal();

const products = JSON.parse(
  readFileSync(join(process.cwd(), "src/data/products.json"), "utf8"),
);
const suppliers = JSON.parse(
  readFileSync(join(process.cwd(), "scripts/product-suppliers.json"), "utf8"),
);

const schema = `
create table if not exists public.products (
  id text primary key,
  name text not null,
  slug text not null unique,
  category text not null,
  subcategory text,
  collection text,
  environment text[] not null default '{}'::text[],
  description text,
  dimensions text,
  width text,
  height text,
  depth text,
  dimension_lines text[] not null default '{}'::text[],
  materials text[] not null default '{}'::text[],
  finishes text[] not null default '{}'::text[],
  images jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  supplier text not null check (supplier in ('Home', 'Klassic')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products add column if not exists width text;
alter table public.products add column if not exists height text;
alter table public.products add column if not exists depth text;
alter table public.products add column if not exists dimension_lines text[] default '{}'::text[];

alter table public.products enable row level security;

revoke all on table public.products from anon, authenticated;
`;

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(schema);

  for (const product of products) {
    await client.query(
      `
      insert into public.products (
        id, name, slug, category, subcategory, collection,
        environment, description, dimensions, width, height, depth,
        dimension_lines, materials, finishes, images, featured, supplier, updated_at
      )
      values (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16::jsonb, $17, $18, now()
      )
      on conflict (id) do update set
        name = excluded.name,
        slug = excluded.slug,
        category = excluded.category,
        subcategory = excluded.subcategory,
        collection = excluded.collection,
        environment = excluded.environment,
        description = excluded.description,
        dimensions = excluded.dimensions,
        width = excluded.width,
        height = excluded.height,
        depth = excluded.depth,
        dimension_lines = excluded.dimension_lines,
        materials = excluded.materials,
        finishes = excluded.finishes,
        images = excluded.images,
        featured = excluded.featured,
        supplier = excluded.supplier,
        updated_at = now()
      `,
      [
        product.id,
        product.name,
        product.slug,
        product.category,
        product.subcategory ?? null,
        product.collection ?? null,
        product.environment ?? [],
        product.description ?? null,
        null,
        null,
        null,
        null,
        product.dimensionLines ?? [],
        product.materials ?? [],
        product.finishes ?? [],
        JSON.stringify(product.images ?? []),
        Boolean(product.featured),
        suppliers[product.id],
      ],
    );
  }

  const counts = await client.query(
    `select supplier, count(*)::int as n from public.products group by supplier order by supplier`,
  );
  console.log(counts.rows);
} finally {
  await client.end();
}
