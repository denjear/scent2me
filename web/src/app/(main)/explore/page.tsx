"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Sparkles, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import ProductCard from "../../../components/ProductCard";

const API_BASE = "";

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

  // Load brands on mount
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const res = await fetch(`${API_BASE}/brands`);
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

  // Debounced search
  const debouncedSearch = useCallback(
    debounce(async (query: string, brand: string) => {
      if (!query.trim() && !brand) {
        setSearchResults([]);
        return;
      }

      setLoadingSearch(true);
      try {
        const params = new URLSearchParams();
        if (query.trim()) params.set("name", query.trim());
        if (brand) params.set("brand", brand);

        const res = await fetch(`${API_BASE}/search?${params}`);
        const json = await res.json();
        if (!res.ok || json.error) throw new Error(json.error || `HTTP ${res.status}`);

        setSearchResults(json.results || []);
      } catch (e: any) {
        toast.error(e?.message || "Search failed");
        setSearchResults([]);
      } finally {
        setLoadingSearch(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery, selectedBrand);
  }, [searchQuery, selectedBrand, debouncedSearch]);

  // Load trending on mount
  useEffect(() => {
    const loadTrending = async () => {
      try {
        const res = await fetch(`${API_BASE}/trending`);
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
      const res = await fetch(`${API_BASE}/random`);
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
    <main className="min-h-screen bg-[#f8f6ef] py-10 text-gray-800">
      <div className="container mx-auto px-6 max-w-6xl">
        <h1 className="text-3xl font-semibold mb-8 text-center">Explore Perfumes</h1>

        {/* Search Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
          {/* Name Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by perfume name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9fb79a] focus:border-transparent"
            />
          </div>

          {/* Brand Dropdown */}
          <div className="relative flex-1 max-w-md brand-dropdown">
            <button
              onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9fb79a] focus:border-transparent cursor-pointer hover:border-gray-400 transition-colors flex items-center justify-between"
              disabled={loadingBrands}
            >
              <span className={selectedBrand ? "text-gray-900" : "text-gray-500"}>
                {loadingBrands ? "Loading brands..." : selectedBrand || "All Brands"}
              </span>
              <ChevronDown className={`text-gray-500 transition-transform ${isBrandDropdownOpen ? "rotate-180" : ""}`} size={20} />
            </button>
            {isBrandDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-500 border-b border-gray-100"
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
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-900"
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

        {/* Search Results */}
        {(searchQuery || selectedBrand) && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Search Results</h2>
            {loadingSearch ? (
              <p className="text-center text-gray-500">Searching...</p>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {searchResults.map((perfume, idx) => (
                  <ProductCard
                    key={`${perfume.id || idx}-${perfume.name_display}`}
                    imageUrl={perfume.image_url}
                    name={perfume.name_display}
                    brand={perfume.brand_display}
                    price={formatPrice(perfume.price_num)}
                    buy_url={perfume.buy_url}
                    rating_num={perfume.rating_num}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No results found for "{searchQuery}" {selectedBrand && `in ${selectedBrand}`}</p>
            )}
          </section>
        )}

        {/* Surprise Me */}
        <section className="mb-12 text-center">
          <button
            onClick={handleSurpriseMe}
            disabled={loadingRandom}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#a8bfa5] text-white rounded-xl hover:bg-[#90a88d] transition disabled:opacity-60"
          >
            <Sparkles size={20} />
            {loadingRandom ? "Finding your surprise..." : "Surprise Me!"}
          </button>
          {randomPerfume && (
            <div className="mt-6 max-w-sm mx-auto">
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
          )}
        </section>

        {/* Trending */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Trending Perfumes</h2>
          {loadingTrending ? (
            <p className="text-center text-gray-500">Loading trending...</p>
          ) : trending.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {trending.map((perfume, idx) => (
                <ProductCard
                  key={perfume.id || idx}
                  imageUrl={perfume.image_url}
                  name={perfume.name_display}
                  brand={perfume.brand_display}
                  price={formatPrice(perfume.price_num)}
                  buy_url={perfume.buy_url}
                  rating_num={perfume.rating_num}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No trending perfumes available</p>
          )}
        </section>

        <footer className="text-center mt-12 text-sm text-gray-500">Scent2Me © 2025 All Rights Reserved.</footer>
      </div>
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
