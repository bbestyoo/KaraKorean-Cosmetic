"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.karakoreanbeauty.com/shop";
const API_ORIGIN = API_BASE_URL.replace(/\/shop\/?$/, "");

interface SearchResult {
  id: string;
  name: string;
  image: string;
  price: number;
}

function resolveImageUrl(image?: string | null) {
  if (!image) return "/images/placeholder.png";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  const normalizedPath = image.startsWith("/") ? image : `/${image}`;
  return new URL(normalizedPath, API_ORIGIN).toString();
}

export function NavSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search logic
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `${API_ORIGIN}/shop/api/navsearch/?search=${encodeURIComponent(query)}`
        );
        if (!response.ok) throw new Error("Search failed");
        const data = await response.json();
        setResults(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle click outside to close dropdown and collapse search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (query === "") {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [query]);

  // Handle key down events for accessibility / keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setIsExpanded(false);
      inputRef.current?.blur();
      return;
    }

    if (results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1 < results.length ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 >= 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        handleSelectProduct(results[activeIndex].id);
      }
    }
  };

  const handleSelectProduct = (productId: string) => {
    setIsOpen(false);
    setQuery("");
    setIsExpanded(false);
    router.push(`/products/${productId}`);
  };

  const handleIconClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative flex items-center z-50">
      {/* Search Input Container */}
      <div
        className={cn(
          "flex items-center rounded-full transition-all duration-300 ease-out h-10 select-none",
          isExpanded
            ? "w-44 sm:w-52 md:w-60 lg:w-64 bg-[#f2efe9] border border-[#c9a46b]/30 px-3"
            : "w-10 justify-center cursor-pointer hover:bg-gray-100"
        )}
        onClick={handleIconClick}
      >
        <Search
          size={20}
          className={cn(
            "text-gray-900 transition-colors shrink-0",
            isExpanded ? "text-[#c9a46b]" : "hover:text-[#c9a46b]"
          )}
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          className={cn(
            "w-full bg-transparent border-none outline-none text-sm text-neutral-800 placeholder-neutral-400 font-medium ml-2 transition-all duration-200",
            isExpanded ? "opacity-100 w-full" : "w-0 opacity-0 pointer-events-none"
          )}
        />

        {/* Action Button (Clear or Close) */}
        {isExpanded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (query) {
                handleClear();
              } else {
                setIsExpanded(false);
                setIsOpen(false);
              }
            }}
            className="p-1 rounded-full hover:bg-neutral-200/50 text-neutral-500 hover:text-neutral-800 transition-colors shrink-0 ml-1"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && query.trim().length >= 2 && (
        <div
          className="absolute right-0 top-full mt-3 w-[300px] sm:w-[350px] md:w-[400px] rounded-2xl shadow-2xl transition-all duration-200"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px) saturate(160%)",
            WebkitBackdropFilter: "blur(20px) saturate(160%)",
            border: "1px solid rgba(201, 164, 107, 0.2)",
            boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(201, 164, 107, 0.1)",
            animation: "searchFadeIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both",
          }}
        >
          <style>{`
            @keyframes searchFadeIn {
              from { opacity: 0; transform: translateY(-8px) scale(0.98); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>

          {/* Loading state */}
          {loading && (
            <div className="py-8 flex flex-col items-center justify-center text-[#5c6e69]">
              <Loader2 className="w-6 h-6 animate-spin text-[#c9a46b]" />
              <p className="text-xs font-semibold tracking-wider uppercase mt-2 opacity-80">Searching products...</p>
            </div>
          )}

          {/* Results list */}
          {!loading && results.length > 0 && (
            <div className="max-h-[360px] overflow-y-auto py-2" data-lenis-prevent>
              <div className="px-4 py-1.5 text-[0.65rem] font-bold tracking-widest text-[#5c6e69] uppercase border-b border-neutral-100">
                Products Found ({results.length})
              </div>
              {results.map((product, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={cn(
                      "w-full text-left flex cursor-pointer items-center gap-3.5 px-4 py-3 border-b border-neutral-100 last:border-none transition-all duration-200 group",
                      isActive ? "bg-[#c9a46b]/10" : "hover:bg-neutral-50"
                    )}
                  >
                    {/* Thumbnail Image */}
                    <div className="relative w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden shrink-0 border border-neutral-200/50">
                      <Image
                        src={resolveImageUrl(product.image)}
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="min-w-0 flex-1">
                      <h4
                        className={cn(
                          "text-sm font-semibold text-neutral-800 line-clamp-2 leading-tight transition-colors",
                          isActive ? "text-[#a07840]" : "group-hover:text-[#a07840]"
                        )}
                      >
                        {product.name}
                      </h4>
                      <p className="text-xs font-medium text-neutral-900 mt-1">
                        Rs. {product.price.toLocaleString()}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* No results state */}
          {!loading && results.length === 0 && (
            <div className="py-8 px-5 text-center text-neutral-500">
              <span className="text-lg">✨</span>
              <p className="text-sm font-medium text-neutral-800 mt-2">No products found</p>
              <p className="text-xs text-neutral-400 mt-1">We couldn&apos;t find matches for &ldquo;{query}&rdquo;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
