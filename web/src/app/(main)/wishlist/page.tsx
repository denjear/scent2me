"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard"; // ✅ import component card

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

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/wishlist")
      .then((res) => res.json())
      .then((data) => setWishlist(data.wishlist || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const clearWishlist = async () => {
    await fetch("http://127.0.0.1:8000/wishlist/clear", { method: "POST" });
    setWishlist([]);
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-600 font-poppins">
        Loading wishlist...
      </div>
    );

  return (
    <main className="min-h-screen bg-[#f8f6ef] font-poppins">
      {/* Container mirip Explore */}
      <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-12">
        {/* Header */}
        <h1 className="text-4xl font-semibold mb-10 text-center text-[#4B4B4B]">
          Your Wishlist
        </h1>

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No perfumes saved yet. Go find your perfect scent!
          </p>
        ) : (
          <>
            {/* ✅ Reuse ProductCard component */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mb-12">
              {wishlist.map((item, idx) => (
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

            {/* Clear Wishlist Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={clearWishlist}
                className="bg-[#9DBE9C] text-white px-6 py-3 rounded-lg hover:bg-[#8CAF8C] font-semibold transition-colors"
              >
                Clear Wishlist
              </button>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm mt-8">
        Scent2Me © 2025 All Rights Reserved.
      </footer>
    </main>
  );
}
