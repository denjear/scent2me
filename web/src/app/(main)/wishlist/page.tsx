"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { AlertCircle } from "lucide-react";
import { apiUrl, API_BASE } from '@/lib/api';

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
    // cek user login dari localStorage (bukan token, karena kita belum pakai JWT)
    const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;

    if (!userStr) {
      setIsGuest(true);
      setLoading(false);
      return;
    }

    let email: string | undefined;
    try {
      const user = JSON.parse(userStr);
      email = user?.email;
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
    }

    if (!email) {
      setIsGuest(true);
      setLoading(false);
      return;
    }

    // fetch wishlist berdasarkan email user
    const fetchWishlist = async () => {
      try {
        const res = await fetch(
          apiUrl(`auth/wishlist?email=${encodeURIComponent(email as string)}`)
        );

        if (!res.ok) {
          console.error("Failed to fetch wishlist", await res.text());
          setWishlist([]);
          return;
        }

        const data = await res.json();

        // backend bisa balikin:
        // 1) { wishlist: [ ... ] }
        // 2) { wishlist: { [email]: [ ... ] } }
        const w = data.wishlist;

        if (Array.isArray(w)) {
          setWishlist(w);
        } else if (w && typeof w === "object" && Array.isArray(w[email])) {
          setWishlist(w[email]);
        } else if (Array.isArray(data.items)) {
          // fallback kalau nanti namanya beda
          setWishlist(data.items);
        } else {
          setWishlist([]);
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const clearWishlist = async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      setIsGuest(true);
      setWishlist([]);
      return;
    }

    let email: string | undefined;
    try {
      const user = JSON.parse(userStr);
      email = user?.email;
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
    }

    if (!email) return;

    try {
      await fetch(apiUrl('auth/wishlist/clear'), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      setWishlist([]);
    } catch (err) {
      console.error("Error clearing wishlist:", err);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-600 font-poppins">
        Loading wishlist...
      </div>
    );

  // Guest state (belum login)
  if (isGuest) {
    return (
      <main className="min-h-screen bg-[#f8f6ef] font-poppins">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-12">
          <h1 className="text-4xl font-semibold mb-10 text-center text-[#4B4B4B]">
            Your Wishlist
          </h1>

          {/* Floating Toast Notification */}
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 flex flex-col items-center text-center z-50 animate-slide-in-top">
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
      <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-12">
        <h1 className="text-4xl font-semibold mb-10 text-center text-[#4B4B4B]">
          Your Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No perfumes saved yet. Go find your perfect scent!
          </p>
        ) : (
          <>
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

      <footer className="text-center py-8 text-gray-500 text-sm mt-8">
        Scent2Me © 2025 All Rights Reserved.
      </footer>
    </main>
  );
}
