'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { AlertCircle, Heart, Sparkles, Trash2 } from "lucide-react";
import { apiUrl, API_BASE } from '@/lib/api';

// Developer asset path reference (uploaded image in session)
// /mnt/data/4b54be40-83f3-4aac-b37d-ed5c988b4467.png

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const router = useRouter();

  // --- Fetch wishlist (email-based, unchanged API logic) ---
  useEffect(() => {
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

    const fetchWishlist = async () => {
      try {
        const res = await fetch(apiUrl(`auth/wishlist?email=${encodeURIComponent(email as string)}`));
        if (!res.ok) {
          console.error("Failed to fetch wishlist", await res.text());
          setWishlist([]);
          return;
        }
        const data = await res.json();
        const w = data.wishlist;

        if (Array.isArray(w)) {
          setWishlist(w);
        } else if (w && typeof w === "object" && Array.isArray(w[email])) {
          setWishlist(w[email]);
        } else if (Array.isArray(data.items)) {
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

  // Scroll-to-top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // --- Clear wishlist (email-based, unchanged API logic) ---
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
      setCurrentPage(1);
    } catch (err) {
      console.error("Error clearing wishlist:", err);
    }
  };

  // --- Remove single item (email-based, unchanged API logic) ---
  const removeFromWishlist = async (nameDisplay: string) => {
    const userStr = localStorage.getItem("user");
    let email: string | undefined;
    try {
      const user = userStr ? JSON.parse(userStr) : null;
      email = user?.email;
    } catch (e) {
      console.error("Error reading user for removeFromWishlist", e);
    }

    const body: Record<string, any> = { name_display: nameDisplay };
    if (email) body.email = email;

    try {
      await fetch(apiUrl('auth/wishlist/remove'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error("Error removing wishlist item:", err);
    }

    setWishlist(prev => {
      const updated = prev.filter(item => item.name_display !== nameDisplay);
      const totalPages = Math.ceil(updated.length / itemsPerPage) || 1;
      if (currentPage > totalPages) setCurrentPage(totalPages);
      return updated;
    });
  };

  // --- Derived values for pagination ---
  const totalItems = wishlist.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginated = wishlist.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- UI states ---
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#f8f6ef] via-[#f0ede6] to-[#e9e4dc] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#A3B899] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#5A5A5A] font-medium animate-pulse">Loading your wishlist...</p>
        </div>
      </main>
    );
  }

  // Guest view (user not logged in)
  if (isGuest) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#f8f6ef] via-[#f0ede6] to-[#e9e4dc] font-poppins relative overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-[#A3B899]/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-[#9DBE9C]/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#B8D4B0]/15 rounded-full blur-lg animate-pulse delay-500"></div>

        <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-12 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 shadow-sm w-fit mx-auto mb-6">
              <Heart size={16} className="text-[#A3B899]" />
              <span className="text-sm font-medium text-[#4B4B4B]">Your Wishlist</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-light mb-6 bg-gradient-to-r from-[#2D2D2D] via-[#4B4B4B] to-[#2D2D2D] bg-clip-text text-transparent">
              Fragrances Collection
            </h1>
            <p className="text-lg md:text-xl text-[#5A5A5A] max-w-3xl mx-auto leading-relaxed font-light">
              Save your favorite fragrances and build your personal collection of perfect scents
            </p>
          </div>

          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 flex flex-col items-center text-center z-50 animate-slide-in-top border border-white/30">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#fff5f5] to-[#ffeaea] mb-4 shadow-lg">
              <AlertCircle size={32} className="text-[#d32f2f]" />
            </div>
            <h2 className="text-xl font-semibold text-[#4B4B4B] mb-3">
              Login Required
            </h2>
            <p className="text-[#6B6B6B] text-sm mb-6 leading-relaxed">
              To save and view your wishlist, please login with your account to access your personalized collection.
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => router.push("/homepage")}
                className="flex-1 px-4 py-3 text-sm bg-gray-100 text-gray-800 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Continue as Guest
              </button>
              <button
                onClick={() => router.push("/login")}
                className="flex-1 px-4 py-3 text-sm bg-gradient-to-r from-[#A3B899] to-[#9DBE9C] text-white rounded-2xl font-semibold hover:from-[#9DBE9C] hover:to-[#8CAF8C] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Login Now
              </button>
            </div>
          </div>

          <div className="opacity-30 pointer-events-none blur-sm">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12 text-center">
              <Heart size={48} className="text-[#A3B899] mx-auto mb-4 opacity-50" />
              <p className="text-[#5A5A5A] text-xl font-light">
                No perfumes saved yet. Go find your perfect scent!
              </p>
              <p className="text-[#6B6B6B] mt-2 font-light">
                Explore our collection and start building your wishlist
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Main authenticated view
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f8f6ef] via-[#f0ede6] to-[#e9e4dc] font-poppins relative overflow-hidden flex flex-col">
      <div className="absolute top-20 left-10 w-20 h-20 bg-[#A3B899]/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-[#9DBE9C]/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#B8D4B0]/15 rounded-full blur-lg animate-pulse delay-500"></div>

      <div className="flex-grow relative z-10">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-12">
          <div className="text-center mb-8">
            {/* <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 shadow-sm w-fit mx-auto mb-6">
              <Heart size={16} className="text-[#A3B899]" />
              <span className="text-sm font-medium text-[#4B4B4B]">Your Wishlist</span>
            </div> */}
            <h1 className="text-3xl md:text-4xl font-serif font-light mb-6 bg-gradient-to-r from-[#2D2D2D] via-[#4B4B4B] to-[#2D2D2D] bg-clip-text text-transparent">
              Fragrances Collection
            </h1>
            <p className="text-lg md:text-xl text-[#5A5A5A] max-w-3xl mx-auto leading-relaxed font-light">
              Your personal collection of favorite fragrances, carefully selected and saved for you
            </p>
          </div>

          {totalItems === 0 ? (
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12 text-center">
              <Heart size={48} className="text-[#A3B899] mx-auto mb-4 opacity-50" />
              <p className="text-[#5A5A5A] text-xl font-light">
                No perfumes saved yet. Go find your perfect scent!
              </p>
              <p className="text-[#6B6B6B] mt-2 font-light">
                Explore our collection and start building your wishlist
              </p>
              <button
                onClick={() => router.push("/explore")}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#A3B899] to-[#9DBE9C] text-white font-semibold rounded-2xl hover:from-[#9DBE9C] hover:to-[#8CAF8C] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
              >
                <Sparkles size={18} />
                Explore Now
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 shadow-sm">
                  <Heart size={14} className="text-[#A3B899]" />
                  <span className="text-[#4B4B4B] text-sm font-medium">
                    {totalItems} {totalItems === 1 ? 'fragrance' : 'fragrances'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mb-8">
                {paginated.map((item, idx) => (
                  <div key={item.id || idx} className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 group">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWishlist(item.name_display);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 cursor-pointer"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={16} />
                    </button>

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

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mb-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className="cursor-pointer px-4 py-2 bg-white backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-25 disabled:cursor-not-allowed"
                  >
                    <span className="text-xl font-semibold text-black select-none">{'<'}</span>
                  </button>

                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm">
                    <span className="text-sm text-[#4B4B4B] font-medium">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className="cursor-pointer px-4 py-2 bg-white backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-25 disabled:cursor-not-allowed"
                  >
                    <span className="text-xl font-semibold text-black select-none">{'>'}</span>
                  </button>
                </div>
              )}

              <div className="flex justify-center ">
                <button
                  onClick={clearWishlist}
                  className="cursor-pointer inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold rounded-2xl hover:from-red-500 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  <Trash2 size={20} />
                  Clear Wishlist
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <footer className="w-full mt-auto pt-8 pb-8">
          <div className="flex flex-col items-center gap-4">
            <p className="text-xs text-[#8B8B8B] text-center">
              © 2025 Scent2Me. All rights reserved.
            </p>
          </div>
      </footer>
    </main>
  );
}
