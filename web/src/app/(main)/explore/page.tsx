"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Sparkles, ChevronDown, Compass } from "lucide-react";
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
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/30">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {searchResults.map((perfume, idx) => (
                  <div key={`${perfume.id || idx}-${perfume.name_display}`} className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300 hover:scale-105">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {trending.map((perfume, idx) => (
                <div key={perfume.id || idx} className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300 hover:scale-105">
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
    </main>
  );
}

// Debounce utility
function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
}
