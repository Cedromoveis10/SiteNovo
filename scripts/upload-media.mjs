import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { loadEnvLocal } from "./load-env.mjs";

loadEnvLocal();

const mime = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
};

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
}

const supabase = createClient(url, key);
const roots = ["public/brand", "public/products", "public/videos"];

for (const root of roots) {
  for (const file of walk(root)) {
    const type = mime[extname(file).toLowerCase()];
    if (!type) continue;
    const objectPath = relative("public", file).replaceAll("\\", "/");
    const body = readFileSync(file);
    const { error } = await supabase.storage.from("media").upload(objectPath, body, {
      contentType: type,
      upsert: true,
    });
    if (error) {
      console.error(objectPath, error.message);
      process.exitCode = 1;
    } else {
      console.log("uploaded", objectPath);
    }
  }
}
