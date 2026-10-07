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

drop policy if exists "Public read media" on storage.objects;
create policy "Public read media"
on storage.objects
for select
to public
using (bucket_id = 'media');

drop policy if exists "Anon upload media" on storage.objects;
create policy "Anon upload media"
on storage.objects
for insert
to anon
with check (bucket_id = 'media');

drop policy if exists "Anon update media" on storage.objects;
create policy "Anon update media"
on storage.objects
for update
to anon
using (bucket_id = 'media')
with check (bucket_id = 'media');

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
create policy "Site can insert quote leads"
on public.quote_leads
for insert
to anon
with check (char_length(name) >= 2 and char_length(phone) >= 10);
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
