import pg from "pg";
import { loadEnvLocal } from "./load-env.mjs";

loadEnvLocal();

const sql = `
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  52428800,
  array['image/png','image/jpeg','image/webp','image/svg+xml','video/mp4']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anon upload media" on storage.objects;
drop policy if exists "Anon update media" on storage.objects;
drop policy if exists "Public read media" on storage.objects;
create policy "Public read media"
on storage.objects
for select
to public
using (bucket_id = 'media');

revoke insert, update, delete, truncate, references, trigger on storage.objects from anon, authenticated;

create table if not exists public.quote_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  showroom_id text not null,
  items text[] not null default '{}'::text[],
  message text,
  source text
);

alter table public.quote_leads enable row level security;
drop policy if exists "Site can insert quote leads" on public.quote_leads;
revoke all on table public.quote_leads from anon, authenticated, public;

alter table public.products enable row level security;
revoke all on table public.products from anon, authenticated, public;
`;

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(sql);
  const buckets = await client.query(
    "select id, public from storage.buckets where id = 'media'",
  );
  console.log("ok", buckets.rows[0]);
} finally {
  await client.end();
}
