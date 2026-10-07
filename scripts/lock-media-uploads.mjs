import pg from "pg";
import { loadEnvLocal } from "./load-env.mjs";

loadEnvLocal();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(`
    drop policy if exists "Anon upload media" on storage.objects;
    drop policy if exists "Anon update media" on storage.objects;
  `);
  console.log("upload policies removed");
} finally {
  await client.end();
}
