"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { AlertCircle } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

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
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    try {
      const q = localStorage.getItem("s2m_last_query") || "";
      const r = localStorage.getItem("s2m_last_results");

      if (!r) {
        router.push("/recommendations");
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

  // Close notification when user logs in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setShowLoginPrompt(false);
    }
  }, []);

  // ✅ Toggle individual selection
  const toggleSelect = (index: number) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) newSet.delete(index);
      else newSet.add(index);
      return newSet;
    });
  };

  // ✅ Select all or clear all
const toggleSelectAll = () => {
  if (selected.size === results.length) {
    setSelected(new Set());
  } else {
    setSelected(new Set(results.map((_, idx) => idx)));
  }
};

// ✅ Save selected perfumes only
const handleSaveWishlist = async () => {
  // 1. Cek user dari localStorage
  const userStr =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;

  if (!userStr) {
    setShowLoginPrompt(true);
    return;
  }

  let user: { email?: string } | null = null;
  try {
    user = JSON.parse(userStr);
  } catch (e) {
    console.error("Failed to parse user from localStorage", e);
    setShowLoginPrompt(true);
    return;
  }

  if (!user?.email) {
    console.error("User email not found in localStorage", user);
    setShowLoginPrompt(true);
    return;
  }

  // 2. Ambil hanya item yang ter-select
  const selectedProducts = results
    .map((item, idx) => ({ item, idx }))
    .filter(({ idx }) => selected.has(idx))
    .map(({ item }) => ({
      // ✅ paksa string di field yang didefinisikan string di backend
      id:
        item.id !== undefined && item.id !== null
          ? String(item.id)
          : undefined,

      image_url:
        item.image_url !== undefined && item.image_url !== null
          ? String(item.image_url)
          : undefined,

      name_display: String(item.name_display || "Unknown Perfume"),

      brand_display: String(item.brand_display || "Unknown Brand"),

      // number only
      price_num:
        typeof item.price_num === "number" ? item.price_num : undefined,

      rating_num:
        typeof item.rating_num === "number" ? item.rating_num : undefined,

      // tags sudah string di tipe kamu → aman, tapi tetep dibungkus
      tags:
        item.tags !== undefined && item.tags !== null
          ? String(item.tags)
          : undefined,

      buy_url:
        item.buy_url !== undefined && item.buy_url !== null
          ? String(item.buy_url)
          : undefined,
    }));

  if (selectedProducts.length === 0) {
    alert("Silakan pilih minimal 1 parfum dulu 👍");
    return;
  }

  const payload = {
    email: user.email,
    products: selectedProducts,
  };

  console.log(">>> Payload dikirim ke /auth/wishlist/add:", payload);

  try {
    const res = await fetch(`${API_BASE}/auth/wishlist/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    let json: any = null;
    try {
      json = await res.json();
    } catch (e) {
      console.error("Gagal parse JSON response:", e);
    }

    console.log(">>> Response /auth/wishlist/add:", res.status, json);

    if (!res.ok || json?.success === false) {
      console.error("Backend error saving wishlist:", json);
      alert(
        `❌ Failed to save wishlist.\nStatus: ${res.status}\nMessage: ${
          json?.message || JSON.stringify(json?.detail || "Unknown error")
        }`
      );
      return;
    }

    alert("✅ Selected perfumes saved to wishlist!");
    router.push("/wishlist");
  } catch (err) {
    console.error("Error saving wishlist:", err);
    alert("❌ Failed to save wishlist.");
  }
};


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
          onClick={() => router.push("/recommendations")}
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

        {/* Controls */}
<div className="flex justify-end mb-6">
  <button
    onClick={toggleSelectAll}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm border
      ${
        selected.size === results.length
          ? "bg-[#E9F5E7] text-[#5F8160] border-[#A5C5A2] hover:bg-[#DBEDDA]"
          : "bg-white text-[#7AA885] border-[#C6DCC5] hover:bg-[#F6F9F5]"
      }`}
  >
    {selected.size === results.length ? (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
        Clear All
      </>
    ) : (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293A1 1 0 103.293 10.707l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
            clipRule="evenodd"
          />
        </svg>
        Select All
      </>
    )}
  </button>
</div>


        {/* Grid — maksimum 3 kolom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {results.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`relative rounded-2xl transition-transform duration-300 ${
                selected.has(idx) ? "ring-4 ring-[#9DBE9C]" : ""
              }`}
            >
              {/* Overlay checkbox */}
              <div
                onClick={() => toggleSelect(idx)}
                className="absolute top-3 right-3 bg-white border border-gray-300 rounded-md w-6 h-6 flex items-center justify-center cursor-pointer z-10 hover:bg-gray-100"
              >
                {selected.has(idx) && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-[#7AA885]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293A1 1 0 103.293 10.707l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>

              <ProductCard
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
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 justify-center">
          {/* Save to Wishlist */}
          <button
            onClick={handleSaveWishlist}
            disabled={selected.size === 0}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              selected.size > 0
                ? "bg-[#A3B899] text-white hover:bg-[#93a78a]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Save Recommendation ({selected.size})
          </button>

          {/* Refine Preferences */}
          <button
            className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-100 transition"
            onClick={() => router.push("/recommendations")}
          >
            Refine Preferences
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm w-full">
        Scent2Me © 2025 All Rights Reserved.
      </footer>

      {/* Floating Toast Notification (no background overlay) */}
      {showLoginPrompt && (
        <div className="fixed top-20 left-1/2 bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 flex flex-col items-center text-center z-50 animate-slide-in-top">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#fff5f5] mb-3">
            <AlertCircle size={24} className="text-[#d32f2f]" />
          </div>
          <h2 className="text-lg font-semibold text-[#4B4B4B] mb-2">
            Login Required
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            To save perfumes to your wishlist, please login with your account.
          </p>
          <div className="flex gap-2 w-full">
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="flex-1 px-3 py-2 text-sm bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Close
            </button>
            <button
              onClick={() => router.push("/login")}
              className="flex-1 px-3 py-2 text-sm bg-[#a6bfa3] text-white rounded-lg font-semibold hover:bg-[#93ad8f] transition"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
