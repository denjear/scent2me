"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { AlertCircle, X } from "lucide-react";

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
  const [isGuest, setIsGuest] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in (has token)
    const token = localStorage.getItem("token");
    if (!token) {
      setIsGuest(true);
      setLoading(false);
      return;
    }

    // fetch authenticated user's wishlist using token
    const headers: Record<string, string> = {};
    headers["Authorization"] = `Bearer ${token}`;

    fetch("http://127.0.0.1:8000/wishlist", { headers })
      .then((res) => res.json())
      .then((data) => {
        const w = data.wishlist;
        // backend may return either an array (legacy) or a mapping { email: [items], ... }
        if (Array.isArray(w)) {
          setWishlist(w);
          return;
        }

        // try to get current user's email from localStorage
        try {
          const userStr = localStorage.getItem("user");
          if (userStr) {
            const user = JSON.parse(userStr as string);
            const email = user?.email;
            if (email && w && typeof w === "object" && Array.isArray(w[email])) {
              setWishlist(w[email]);
              return;
            }
          }
        } catch (e) {
          console.error("Error parsing user from localStorage", e);
        }

        // If server returned a mapping, only show the current user's list.
        // Do NOT fall back to a shared 'global' list when authenticated —
        // that would expose other users' items.
        setWishlist([]);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [router]);

  const clearWishlist = async () => {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    // include current user's email when clearing per-user storage
    let body: any = {};
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr as string);
        if (user?.email) body.email = user.email;
      }
    } catch (e) {
      console.error("Error reading user for clearWishlist", e);
    }

    await fetch("http://127.0.0.1:8000/wishlist/clear", { method: "POST", headers, body: JSON.stringify(body) });
    setWishlist([]);
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-600 font-poppins">
        Loading wishlist...
      </div>
    );

  // Guest notification toast (no overlay, floating)
  if (isGuest) {
    return (
      <main className="min-h-screen bg-[#f8f6ef] font-poppins">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-12">
          {/* Header */}
          <h1 className="text-4xl font-semibold mb-10 text-center text-[#4B4B4B]">
            Your Wishlist
          </h1>

          {/* Floating Toast Notification */}
          <div className="fixed top-20 left-1/2 bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 flex flex-col items-center text-center z-50 animate-slide-in-top">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#fff5f5] mb-3">
              <AlertCircle size={24} className="text-[#d32f2f]" />
            </div>
            <h2 className="text-lg font-semibold text-[#4B4B4B] mb-2">
              Login Required
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              To save and view your wishlist, please login with your account.
            </p>
            <div className="flex gap-2 w-full">
              <button
                onClick={() => router.push("/homepage")}
                className="flex-1 px-3 py-2 text-sm bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Continue as Guest
              </button>
              <button
                onClick={() => router.push("/login")}
                className="flex-1 px-3 py-2 text-sm bg-[#a6bfa3] text-white rounded-lg font-semibold hover:bg-[#93ad8f] transition"
              >
                Login
              </button>
            </div>
          </div>

          {/* Page content dimmed out */}
          <div className="opacity-40 pointer-events-none">
            <p className="text-center text-gray-500 text-lg">
              No perfumes saved yet. Go find your perfect scent!
            </p>
          </div>
        </div>
      </main>
    );
  }

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
