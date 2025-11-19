// src/lib/api.ts
const RAW_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

if (!RAW_API_BASE && typeof window !== "undefined") {
  // Bisa bantu debug di client
  console.error("NEXT_PUBLIC_API_BASE_URL is not set");
}

export const API_BASE = RAW_API_BASE.replace(/\/+$/, ""); // buang trailing slash

export function apiUrl(path: string) {
  // buang leading slash di path
  const cleanPath = path.replace(/^\/+/, "");
  return `${API_BASE}/${cleanPath}`;
}
