// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // longgar dulu biar semua host lolos; nanti bisa dipersempit
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" }, // beberapa CDN masih http
    ],
    // kalau ada SVG external
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
