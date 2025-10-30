"use client";

import { useEffect, useState } from "react";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
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
      <div className="p-10 text-center text-gray-600">Loading wishlist...</div>
    );

  return (
    <main className="min-h-screen bg-[#f8f6ef] px-6 md:px-20 py-12 font-poppins">
      <h1 className="text-3xl font-bold mb-10 text-center text-[#4B4B4B]">
        Your Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500">
          No perfumes saved yet. Go find your perfect scent!
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
          {wishlist.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Image Section (same ratio as recommendations) */}
              <div className="w-full h-[280px] bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={item.image_url || "/images/parfumdummy.jpg"}
                  alt={item.name_display}
                  className="object-contain w-full h-full scale-100 hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Info Section */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-lg text-[#1a1a1a] leading-tight line-clamp-2">
                  {item.name_display}
                </h3>
                <p className="text-sm text-gray-500 mb-1">
                  {item.brand_display}
                </p>
                <p className="text-[#4B4B4B] font-semibold mb-2">
                  {item.price_num
                    ? `Rp ${item.price_num.toLocaleString("id-ID")}`
                    : "N/A"}
                </p>
                <a
                  href={item.buy_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7AA885] text-sm underline hover:text-[#62866d] mt-auto"
                >
                  Tap to view product →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {wishlist.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={clearWishlist}
            className="bg-[#9DBE9C] text-white px-6 py-3 rounded-lg hover:bg-[#8CAF8C] font-semibold transition-colors"
          >
            Clear Wishlist
          </button>
        </div>
      )}

      <footer className="text-center py-8 text-gray-500 text-sm mt-16">
        Scent2Me © 2025 All Rights Reserved.
      </footer>
    </main>
  );
}
