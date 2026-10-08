const SUPABASE_MEDIA_MARKER = "/storage/v1/object/public/media/";

/** Serve catalog media from the site origin (Vercel CDN), not Supabase Storage. */
export function mediaUrl(path: string) {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    try {
      const url = new URL(path);
      const index = url.pathname.indexOf(SUPABASE_MEDIA_MARKER);
      if (index !== -1) {
        return `/${url.pathname.slice(index + SUPABASE_MEDIA_MARKER.length)}`;
      }
    } catch {
      return path;
    }
    return path;
  }

  return path.startsWith("/") ? path : `/${path}`;
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
