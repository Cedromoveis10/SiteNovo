const MEDIA_BUCKET = "media";

export function supabaseUrl() {
  return (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
}

export function mediaUrl(path: string) {
  const normalized = path.replace(/^\//, "");
  const base = supabaseUrl();
  if (!base || !normalized) return `/${normalized}`;
  return `${base}/storage/v1/object/public/${MEDIA_BUCKET}/${normalized}`;
}

export function absoluteMediaUrl(path: string) {
  const src = path.startsWith("http") ? path : mediaUrl(path);
  if (src.startsWith("http")) return src;
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  );
  return `${site}${src.startsWith("/") ? src : `/${src}`}`;
}
