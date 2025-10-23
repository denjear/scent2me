"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";

type Product = {
  id?: string;
  image_url?: string;
  name_display: string;
  brand_display: string;
  price_num?: number;
  rating_num?: number;
  tags?: string;
  buy_url?: string;
};

export default function RecommendationResultsPage() {
  const router = useRouter();

  const [queryInfo, setQueryInfo] = useState<string>("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const q = localStorage.getItem("s2m_last_query") || "";
      const r = localStorage.getItem("s2m_last_results");

      if (!r) {
        router.push("/recommendations"); // balik ke form kalau belum ada hasil
        return;
      }

      let parsed: Product[] = [];
      try {
        parsed = JSON.parse(r);
        if (!Array.isArray(parsed)) parsed = [];
      } catch {
        parsed = [];
      }

      setQueryInfo(q);
      setResults(parsed);
    } catch (err) {
      console.error("Error loading results:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f6ef] text-gray-700">
        <p className="text-lg animate-pulse">Loading your recommendations...</p>
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8f6ef] text-gray-700">
        <p className="text-lg mb-4">No recommendations found 😢</p>
        <button
          onClick={() => router.push("/recommendation")}
          className="px-5 py-2 bg-[#a8bfa5] text-white rounded-lg hover:bg-[#8fa98d] transition"
        >
          Back to Preferences
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f6ef] min-h-screen flex flex-col items-center">
      <div className="w-full max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold text-[#4B4B4B]">
            Recommendations for You
          </h1>
          <p className="mt-2 text-md text-gray-500">
            Based on your preferences, here are your personalized scents
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {results.map((item, idx) => (
            <ProductCard
              key={item.id || idx}
              imageUrl={item.image_url || "/images/parfumdummy.jpg"}
              name={item.name_display}
              brand={item.brand_display}
              price={
                typeof item.price_num === "number"
                  ? `Rp ${item.price_num.toLocaleString("id-ID")}`
                  : "N/A"
              }
              tags={item.tags}
              buy_url={item.buy_url}
              rating_num={item.rating_num}
            />
          ))}
        </div>

       {/* Actions */}
        <div className="flex items-center gap-3 justify-center">
          <button
            className="bg-[#A3B899] text-white px-6 py-3 rounded-lg hover:bg-[#93a78a] transition-colors"
            // TODO: implement save to wishlist
            onClick={() => alert("Coming soon: save to wishlist")}
          >
            Save Recommendation
          </button>
          
          {/* --- TOMBOL YANG DIPERBAIKI --- */}
          <button
            className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-100 transition"
            onClick={() => router.push("/recommendations")}
          >
            Refine Preferences
          </button>
          {/* --- END PERBAIKAN --- */}

        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm w-full">
        Scent2Me © 2025 All Rights Reserved.
      </footer>
    </div>
  );
}
