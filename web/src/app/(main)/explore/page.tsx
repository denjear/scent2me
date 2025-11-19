"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, ChevronDown, Compass, AlertCircle, Save } from "lucide-react";
import toast from "react-hot-toast";
import ProductCard from "../../../components/ProductCard";
import { apiUrl, API_BASE } from '@/lib/api';

type Perfume = {
  id?: string;
  name_display: string;
  brand_display: string;
  image_url: string;
  buy_url?: string;
  price_num?: number;
  rating_num?: number;
};

export default function ExplorePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [brands, setBrands] = useState<string[]>([]);
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Perfume[]>([]);
  const [trending, setTrending] = useState<Perfume[]>([]);
  const [randomPerfume, setRandomPerfume] = useState<Perfume | null>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingRandom, setLoadingRandom] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedTrending, setSelectedTrending] = useState<Set<number>>(new Set());
  const [selectedSearch, setSelectedSearch] = useState<Set<number>>(new Set());
  const [selectedRandom, setSelectedRandom] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Close notification when user logs in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setShowLoginPrompt(false);
    }
  }, []);

  // Load brands on mount
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const res = await fetch(apiUrl('brands'));
        const json = await res.json();
        if (!res.ok || json.error) throw new Error(json.error || `HTTP ${res.status}`);
        setBrands(json.brands || []);
      } catch (e: any) {
        toast.error("Failed to load brands");
      } finally {
        setLoadingBrands(false);
      }
    };
    loadBrands();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isBrandDropdownOpen && !(event.target as Element).closest('.brand-dropdown')) {
        setIsBrandDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isBrandDropdownOpen]);

  // Hide search results when search query and brand are cleared
  useEffect(() => {
    if (!searchQuery.trim() && !selectedBrand && hasSearched) {
      setHasSearched(false);
      setSearchResults([]);
    }
  }, [searchQuery, selectedBrand, hasSearched]);

  // Search function
  const performSearch = async (query: string, brand: string) => {
    if (!query.trim() && !brand) {
      setSearchResults([]);
      return;
    }

    setLoadingSearch(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("name", query.trim());
      if (brand) params.set("brand", brand);

      const res = await fetch(apiUrl(`search?${params}`));
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || `HTTP ${res.status}`);

      setSearchResults(json.results || []);
      setHasSearched(true);
    } catch (e: any) {
      toast.error(e?.message || "Search failed");
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSearch = () => {
    performSearch(searchQuery, selectedBrand);
  };

  // Load trending on mount
  useEffect(() => {
    const loadTrending = async () => {
      try {
        const res = await fetch(apiUrl('trending'));
        const json = await res.json();
        if (!res.ok || json.error) throw new Error(json.error || `HTTP ${res.status}`);
        setTrending(json.results || []);
      } catch (e: any) {
        toast.error("Failed to load trending perfumes");
      } finally {
        setLoadingTrending(false);
      }
    };
    loadTrending();
  }, []);

  const handleSurpriseMe = async () => {
    setLoadingRandom(true);
    try {
      const res = await fetch(apiUrl('random'));
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || `HTTP ${res.status}`);
      const results = json.results || [];
      setRandomPerfume(results[0] || null);
      toast.success("Surprise! Here's a random perfume ✨");
    } catch (e: any) {
      toast.error(e?.message || "Failed to get random perfume");
    } finally {
      setLoadingRandom(false);
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return "Price not available";
    return `Rp ${price.toLocaleString()}`;
  };

  // Toggle individual selection for trending
  const toggleSelectTrending = (index: number) => {
    setSelectedTrending((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) newSet.delete(index);
      else newSet.add(index);
      return newSet;
    });
  };

  // Toggle individual selection for search
  const toggleSelectSearch = (index: number) => {
    setSelectedSearch((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) newSet.delete(index);
      else newSet.add(index);
      return newSet;
    });
  };

  // Toggle selection for random perfume
  const toggleSelectRandom = () => {
    setSelectedRandom((prev) => !prev);
  };

  // Select all or clear all for trending
  const toggleSelectAllTrending = () => {
    if (selectedTrending.size === trending.length) {
      setSelectedTrending(new Set());
    } else {
      setSelectedTrending(new Set(trending.map((_, idx) => idx)));
    }
  };

  // Select all or clear all for search
  const toggleSelectAllSearch = () => {
    if (selectedSearch.size === searchResults.length) {
      setSelectedSearch(new Set());
    } else {
      setSelectedSearch(new Set(searchResults.map((_, idx) => idx)));
    }
  };

  // Save selected perfumes to wishlist
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

    // 2. Ambil hanya item yang ter-select dari trending, search, dan random
    const selectedProducts = [
      ...trending
        .map((item, idx) => ({ item, idx }))
        .filter(({ idx }) => selectedTrending.has(idx))
        .map(({ item }) => ({
          id: item.id !== undefined && item.id !== null ? String(item.id) : undefined,
          image_url: item.image_url !== undefined && item.image_url !== null ? String(item.image_url) : undefined,
          name_display: String(item.name_display || "Unknown Perfume"),
          brand_display: String(item.brand_display || "Unknown Brand"),
          price_num: typeof item.price_num === "number" ? item.price_num : undefined,
          rating_num: typeof item.rating_num === "number" ? item.rating_num : undefined,
          tags: undefined, // No tags in explore
          buy_url: item.buy_url !== undefined && item.buy_url !== null ? String(item.buy_url) : undefined,
        })),
      ...searchResults
        .map((item, idx) => ({ item, idx }))
        .filter(({ idx }) => selectedSearch.has(idx))
        .map(({ item }) => ({
          id: item.id !== undefined && item.id !== null ? String(item.id) : undefined,
          image_url: item.image_url !== undefined && item.image_url !== null ? String(item.image_url) : undefined,
          name_display: String(item.name_display || "Unknown Perfume"),
          brand_display: String(item.brand_display || "Unknown Brand"),
          price_num: typeof item.price_num === "number" ? item.price_num : undefined,
          rating_num: typeof item.rating_num === "number" ? item.rating_num : undefined,
          tags: undefined,
          buy_url: item.buy_url !== undefined && item.buy_url !== null ? String(item.buy_url) : undefined,
        })),
      ...(randomPerfume && selectedRandom ? [{
        id: randomPerfume.id !== undefined && randomPerfume.id !== null ? String(randomPerfume.id) : undefined,
        image_url: randomPerfume.image_url !== undefined && randomPerfume.image_url !== null ? String(randomPerfume.image_url) : undefined,
        name_display: String(randomPerfume.name_display || "Unknown Perfume"),
        brand_display: String(randomPerfume.brand_display || "Unknown Brand"),
        price_num: typeof randomPerfume.price_num === "number" ? randomPerfume.price_num : undefined,
        rating_num: typeof randomPerfume.rating_num === "number" ? randomPerfume.rating_num : undefined,
        tags: undefined,
        buy_url: randomPerfume.buy_url !== undefined && randomPerfume.buy_url !== null ? String(randomPerfume.buy_url) : undefined,
      }] : []),
    ];

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
      const res = await fetch(apiUrl('/auth/wishlist/add'), {
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

      // Success toast
      toast.success("Selected perfumes were successfully saved!");

      setTimeout(() => {
        router.push("/wishlist");
      }, 800);
    } catch (err) {
      console.error("Error saving wishlist:", err);
      toast.error("Failed to save wishlist. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f8f6ef] via-[#f0ede6] to-[#e9e4dc] text-gray-800">
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-[#A3B899]/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-[#9DBE9C]/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#B8D4B0]/15 rounded-full blur-lg animate-pulse delay-500"></div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f8f6ef] via-[#f0ede6] to-[#e9e4dc] py-20">
        <div className="absolute inset-0 bg-[url('/images/parfum_bg_pattern.png')] opacity-5 bg-repeat bg-center"></div>
        <div className="relative container mx-auto px-6 text-center">
          {/* <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 shadow-sm w-fit mx-auto mb-6">
            <Compass size={16} className="text-[#A3B899]" />
            <span className="text-sm font-medium text-[#4B4B4B]">Explore Collection</span>
          </div> */}
          <h1 className="text-5xl md:text-6xl font-serif font-light mb-6 bg-gradient-to-r from-[#2D2D2D] via-[#4B4B4B] to-[#2D2D2D] bg-clip-text text-transparent tracking-tight">
            Discover Your Next Scent
          </h1>
          <p className="text-lg md:text-xl text-[#5A5A5A] max-w-3xl mx-auto leading-relaxed font-light">
            Browse through our curated collection of fragrances, search by name or brand, and let serendipity guide you to your perfect match
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#4B4B4B] mb-4">Find Your Perfume</h2>
              <p className="text-[#6B6B6B] max-w-2xl mx-auto">
                Search by name, filter by brand, or explore trending fragrances to discover something new
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-8">
              {/* Name Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by perfume name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  className="w-full pl-12 pr-12 py-4 bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B899] focus:border-transparent shadow-sm transition-all hover:shadow-md"
                />
                <button
                  onClick={handleSearch}
                  disabled={loadingSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#A3B899] transition-colors cursor-pointer"
                >
                  <Search size={20} />
                </button>
              </div>

              {/* Brand Dropdown */}
              <div className="relative flex-1 max-w-md brand-dropdown">
                <button
                  onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
                  className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A3B899] focus:border-transparent cursor-pointer hover:shadow-md transition-all flex items-center justify-between"
                  disabled={loadingBrands}
                >
                  <span className={selectedBrand ? "text-gray-900" : "text-gray-500"}>
                    {loadingBrands ? "Loading brands..." : selectedBrand || "All Brands"}
                  </span>
                  <ChevronDown className={`text-gray-500 transition-transform ${isBrandDropdownOpen ? "rotate-180" : ""}`} size={20} />
                </button>
                {isBrandDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white/90 backdrop-blur-sm border border-white/30 rounded-2xl shadow-xl max-h-60 overflow-y-auto">
                    <div
                      className="px-4 py-3 hover:bg-[#A3B899]/10 cursor-pointer text-gray-500 border-b border-gray-100 rounded-t-2xl"
                      onClick={() => {
                        setSelectedBrand("");
                        setIsBrandDropdownOpen(false);
                      }}
                    >
                      All Brands
                    </div>
                    {brands.map((brand) => (
                      <div
                        key={brand}
                        className="px-4 py-3 hover:bg-[#A3B899]/10 cursor-pointer text-gray-900"
                        onClick={() => {
                          setSelectedBrand(brand);
                          setIsBrandDropdownOpen(false);
                        }}
                      >
                        {brand}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Surprise Me & Submit Search Buttons */}
            <div className="text-center mb-8 flex flex-col sm:flex-row items-center gap-4 justify-center">
              <button
                onClick={handleSurpriseMe}
                disabled={loadingRandom}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#A3B899] to-[#9DBE9C] text-white font-semibold rounded-2xl hover:from-[#9DBE9C] hover:to-[#8CAF8C] transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                <Sparkles size={20} />
                {loadingRandom ? "Finding your surprise..." : "Surprise Me!"}
              </button>

              <button
                onClick={() => handleSearch()}
                disabled={!searchQuery.trim() && !selectedBrand}
                aria-disabled={!searchQuery.trim() && !selectedBrand}
                className={
                  (!searchQuery.trim() && !selectedBrand)
                    ? "inline-flex items-center gap-2 px-6 py-3 bg-gray-100 border border-gray-200 text-gray-500 font-medium rounded-2xl transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    : "inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-2xl transition-all duration-300 shadow-sm hover:shadow-2xl hover:scale-105 active:scale-95 cursor-pointer"
                }
              >
                <Search size={18} />
                <span>Submit Search</span>
              </button>
            </div>

            {/* Random Perfume Result */}
            {randomPerfume && (
              <div className="mt-8 max-w-sm mx-auto">
                <div className="relative rounded-2xl transition-transform duration-300">
                  {/* Overlay checkbox */}
                  <div
                    onClick={toggleSelectRandom}
                    className="absolute top-3 right-3 bg-white border border-gray-300 rounded-md w-6 h-6 flex items-center justify-center cursor-pointer z-10 hover:bg-gray-100"
                  >
                    {selectedRandom && (
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
                    key={randomPerfume.id || randomPerfume.name_display}
                    imageUrl={randomPerfume.image_url}
                    name={randomPerfume.name_display}
                    brand={randomPerfume.brand_display}
                    price={formatPrice(randomPerfume.price_num)}
                    buy_url={randomPerfume.buy_url}
                    rating_num={randomPerfume.rating_num}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Search Results */}
      {hasSearched && (
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-serif font-light mb-12 text-center bg-gradient-to-r from-[#2D2D2D] via-[#4B4B4B] to-[#2D2D2D] bg-clip-text text-transparent">
              Search Results
            </h2>
            {loadingSearch ? (
              <div className="text-center">
                <div className="inline-block w-8 h-8 border-4 border-[#A3B899] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-[#5A5A5A]">Searching...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                {/* Controls for Search Results */}
                <div className="flex items-center justify-between mb-8">
                  <button
                    onClick={toggleSelectAllSearch}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    {selectedSearch.size === searchResults.length ? "Clear All" : "Select All"}
                  </button>
                  <button
                    onClick={handleSaveWishlist}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#A3B899] to-[#9DBE9C] text-white font-semibold rounded-2xl hover:from-[#9DBE9C] hover:to-[#8CAF8C] transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Save size={20} />
                    Save to Wishlist
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {searchResults.map((perfume, idx) => (
                    <div
                      key={`${perfume.id || idx}-${perfume.name_display}`}
                      className={`relative rounded-2xl transition-transform duration-300 ${
                        selectedSearch.has(idx) ? "ring-4 ring-[#9DBE9C]" : ""
                      }`}
                    >
                      {/* Overlay checkbox */}
                      <div
                        onClick={() => toggleSelectSearch(idx)}
                        className="absolute top-3 right-3 bg-white border border-gray-300 rounded-md w-6 h-6 flex items-center justify-center cursor-pointer z-10 hover:bg-gray-100"
                      >
                        {selectedSearch.has(idx) && (
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
                        imageUrl={perfume.image_url}
                        name={perfume.name_display}
                        brand={perfume.brand_display}
                        price={formatPrice(perfume.price_num)}
                        buy_url={perfume.buy_url}
                        rating_num={perfume.rating_num}
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-[#5A5A5A] text-lg">No results found for "{searchQuery}" {selectedBrand && `in ${selectedBrand}`}</p>
                <p className="text-[#6B6B6B] mt-2">Try adjusting your search or explore trending perfumes below</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Trending */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-serif font-light mb-12 text-center bg-gradient-to-r from-[#2D2D2D] via-[#4B4B4B] to-[#2D2D2D] bg-clip-text text-transparent">
            Trending Perfumes
          </h2>
          {loadingTrending ? (
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-[#A3B899] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-[#5A5A5A]">Loading trending...</p>
            </div>
          ) : trending.length > 0 ? (
            <>
              {/* Controls for Trending */}
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={toggleSelectAllTrending}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  {selectedTrending.size === trending.length ? "Clear All" : "Select All"}
                </button>
                <button
                  onClick={handleSaveWishlist}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#A3B899] to-[#9DBE9C] text-white font-semibold rounded-2xl hover:from-[#9DBE9C] hover:to-[#8CAF8C] transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Save size={20} />
                  Save to Wishlist
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {trending.map((perfume, idx) => (
                  <div
                    key={perfume.id || idx}
                    className={`relative rounded-2xl transition-transform duration-300 ${
                      selectedTrending.has(idx) ? "ring-4 ring-[#9DBE9C]" : ""
                    }`}
                  >
                    {/* Overlay checkbox */}
                    <div
                      onClick={() => toggleSelectTrending(idx)}
                      className="absolute top-3 right-3 bg-white border border-gray-300 rounded-md w-6 h-6 flex items-center justify-center cursor-pointer z-10 hover:bg-gray-100"
                    >
                      {selectedTrending.has(idx) && (
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
                      imageUrl={perfume.image_url}
                      name={perfume.name_display}
                      brand={perfume.brand_display}
                      price={formatPrice(perfume.price_num)}
                      buy_url={perfume.buy_url}
                      rating_num={perfume.rating_num}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#5A5A5A] text-lg">No trending perfumes available</p>
              <p className="text-[#6B6B6B] mt-2">Check back later for the latest trends</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full mt-auto pt-8 pb-8">
          <div className="flex flex-col items-center gap-4">
            <p className="text-xs text-[#8B8B8B] text-center">
              © 2025 Scent2Me. All rights reserved.
            </p>
          </div>
      </footer>

      {/* Login Prompt */}
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
              className="cursor-pointer flex-1 px-3 py-2 text-sm bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Close
            </button>
            <button
              onClick={() => router.push("/login")}
              className="cursor-pointer flex-1 px-3 py-2 text-sm bg-[#a6bfa3] text-white rounded-lg font-semibold hover:bg-[#93ad8f] transition"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </main>
  );
}


