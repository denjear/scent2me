// next.config.ts
import type { NextConfig } from "next";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_REC_SERVICE_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  images: {
    // longgar dulu biar semua host lolos; nanti bisa dipersempit
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" }, // beberapa CDN masih http
    ],
    dangerouslyAllowSVG: true,
  },

  async rewrites() {
    return [
      {
        // semua /auth/... di frontend → dialihkan ke backend /auth/...
        source: "/auth/:path*",
        destination: `${BACKEND_URL}/auth/:path*`,
      },
      {
        // kalau endpoint rekomendasi kamu misalnya /recommend
        source: "/recommend/:path*",
        destination: `${BACKEND_URL}/recommend/:path*`,
      },
      {
        source: "/wishlist/:path*",
        destination: `${BACKEND_URL}/wishlist/:path*`,
      },
    ];
  },
};

export default nextConfig;