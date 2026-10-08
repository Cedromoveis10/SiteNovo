import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : "ykefocnpqamfzgacxykn.supabase.co";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHost,
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: supabaseHost,
        pathname: "/storage/v1/render/image/public/**",
      },
    ],
  },
  async headers() {
    const cached = [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable",
      },
    ];
    return [
      { source: "/products/:file*", headers: cached },
      { source: "/environments/:file*", headers: cached },
      { source: "/brand/:file*", headers: cached },
      { source: "/videos/:file*", headers: cached },
    ];
  },
};

export default nextConfig;
