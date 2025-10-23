"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Star } from "lucide-react";

type ProductCardProps = {
  imageUrl: string;
  name: string;
  brand: string;
  price: string;
  tags?: string;
  buy_url?: string;
  rating_num?: number;
};

function sanitizeUrl(src?: string): string {
  if (!src) return "/images/parfumdummy.jpg";
  let s = src.trim().replace(/\s/g, "%20");

  // kalau protokol hilang, anggap https
  if (!/^https?:\/\//i.test(s)) s = `https://${s}`;

  // beberapa CDN masih http → coba upgrade ke https
  if (s.startsWith("http://")) s = s.replace(/^http:\/\//i, "https://");
  return s;
}

export default function ProductCard({
  imageUrl,
  name,
  brand,
  price,
  tags,
  buy_url,
  rating_num,
}: ProductCardProps) {
  const initial = useMemo(() => sanitizeUrl(imageUrl), [imageUrl]);
  const [src, setSrc] = useState(initial);

  const handleClick = () => {
    if (buy_url) window.open(buy_url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 w-full max-w-sm mx-auto"
    >
      <div className="relative bg-gray-50 rounded-t-2xl h-56 md:h-60 lg:h-64">
        <Image
          src={src || "/images/parfumdummy.jpg"}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 300px"
          className="object-contain p-4"
          // bypass optimizer utk host yg “rewel”
          unoptimized
          // fallback ke dummy kalau gagal load
          onError={() => setSrc("/images/parfumdummy.jpg")}
          // placeholder blur kecil biar mulus
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTQwJyBoZWlnaHQ9JzE0MCcgZmlsbD0nI2Y5ZjlmNScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4="
          priority={false}
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-base md:text-lg text-gray-800 line-clamp-1">{name}</h3>
        <p className="text-sm text-gray-500">{brand}</p>

        {typeof rating_num === "number" && (
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.round(rating_num) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
              />
            ))}
            <span className="ml-2 text-xs text-gray-600">{rating_num.toFixed(1)}</span>
          </div>
        )}

        {tags && <p className="text-xs text-gray-600 italic line-clamp-2 mt-1">{tags}</p>}

        <div className="mt-3">
          <p className="text-[#5a7050] font-semibold text-sm md:text-base">{price}</p>
          {buy_url && <p className="text-xs text-[#8fa98d] underline">Tap to view product →</p>}
        </div>
      </div>
    </div>
  );
}
