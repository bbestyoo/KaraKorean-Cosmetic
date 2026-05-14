'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { PremiumProductCard } from '@/components/PremiumProductCard';
import { ChevronLeft, ChevronRight, X, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/shop';

// Colorful Category Bubbles configuration
const CATEGORY_COLORS: Record<string, string> = {
  'Moms': 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  'Babies': 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  'All': 'bg-gray-100 text-gray-800 hover:bg-gray-200',
};

interface Product {
  product_id: string;
  name: string;
  price: number;
  old_price?: number;
  category_name: string;
  images: Array<{ image: string }>;
  ratings?: {
    stats: {
      avg_rating: number;
      total_ratings: number;
    };
  };
}

interface ProductsResponse {
  links: {
    next: string | null;
    previous: string | null;
  };
  count: number;
  total_pages: number;
  current_page: number;
  results: Product[];
}

const CATEGORIES = ['All', 'Moms', 'Babies'];

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Search state
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Derived state
  const currentPage = Number(searchParams.get('page')) || 1;
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('ordering') || '';
  const minPrice = Number(searchParams.get('min_price')) || 0;
  const maxPrice = Number(searchParams.get('max_price')) || 100000;
  const minRating = Number(searchParams.get('min_rating')) || 0;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('page', currentPage.toString());

        if (currentCategory && currentCategory !== '') params.set('category', currentCategory);
        if (currentSearch) params.set('search', currentSearch);
        if (currentSort) params.set('ordering', currentSort);
        if (minPrice > 0) params.set('min_price', minPrice.toString());
        if (maxPrice < 100000) params.set('max_price', maxPrice.toString());
        if (minRating > 0) params.set('min_rating', minRating.toString());

        const endpoint = params.get("search") ? `${API_BASE_URL}/api/search/` : `${API_BASE_URL}/api/`;
        const response = await fetch(`${endpoint}?${params.toString()}`);

        if (response.ok) {
          const data: ProductsResponse = await response.json();
          setProducts(data.results);
          setTotalPages(data.total_pages);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, currentCategory, currentSearch, currentSort, minPrice, maxPrice, minRating]);

  const updateParams = (newParams: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) params.delete(key);
      else params.set(key, value.toString());
    });
    if (!newParams.page) params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  const handleSearchInput = (value: string) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!value.trim()) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setSearchLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/search/?search=${encodeURIComponent(value.trim())}`);
        if (response.ok) {
          const data = await response.json();
          setSearchSuggestions(data.results.slice(0, 6));
          setShowSuggestions(true);
        }
      } catch (e) { console.error(e); }
      finally { setSearchLoading(false); }
    }, 300);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Vibrant Hero - using a fallback colorful gradient/image approach */}
      <div className="relative w-full h-[40vh] md:h-[40vh] overflow-hidden bg-gradient-to-r from-rose-100 to-teal-100">
        {/* If we had the image, we'd use it here. For now, a placeholder illustrative banner style */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/banner3.png" // Fallback to existing banner or a new one if available
            alt="Shop Banner"
            fill
            className="object-cover opacity-90"
            onError={(e) => {
              // Fallback to gradient if image fails
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-black/20"></div> {/* Dark overlay for text pop */}
        </div>
        <nav className="flex absolute top-8 left-2 items-center gap-2 font-bold text-sm text-gray-800 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <span className="text-black">Shop</span>
          <span>/</span>
          <span className="text-black">{currentCategory}</span>
        </nav>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-serif text-white font-bold drop-shadow-md mb-2">
            {currentCategory || 'Our Collection'}
          </h1>
          <p className="text-white/90 text-lg md:text-xl font-medium max-w-lg drop-shadow-sm">
            Soft, stylish, and made with love.
          </p>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Filters Sidebar */}
          <aside
            className={`${mobileFiltersOpen ? 'fixed inset-0 z-50 bg-white p-6' : 'hidden'
              } lg:block lg:w-60 flex-shrink-0 lg:sticky lg:top-24 h-fit`}
          >
            {mobileFiltersOpen && (
              <div className="flex items-center justify-between mb-8 lg:hidden">
                <h2 className="text-lg font-bold">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            <div className="space-y-8">
              {/* Colorful Categories */}
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Category</h3>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => updateParams({ category: cat === 'All' ? null : cat })}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-transform active:scale-95 ${(currentCategory === cat || (currentCategory === '' && cat === 'All'))
                        ? 'bg-black text-white shadow-md'
                        : CATEGORY_COLORS[cat] || 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Price</h3>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={minPrice}
                  onChange={(e) => updateParams({ min_price: e.target.value })}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between items-center mt-2 text-xs font-mono text-gray-600">
                  <span>Rs. {minPrice.toLocaleString()}</span>
                  <span>Rs. {maxPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Rating</h3>
                <div className="space-y-2">
                  {[
                    { value: 0, label: 'All Ratings' },
                    { value: 4, label: '4★ & Above' },
                    { value: 3, label: '3★ & Above' },
                  ].map((option) => (
                    <div
                      key={option.value}
                      onClick={() => updateParams({ min_rating: option.value || null })}
                      className={`cursor-pointer text-sm py-1 transition-colors ${minRating === option.value
                        ? 'font-bold text-gray-800'
                        : 'text-gray-800 hover:text-black'
                        }`}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 w-full min-w-0">
            {/* Toolbar */}
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md py-3 mb-6 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between rounded-b-xl shadow-sm px-4">

              <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-50 rounded-md border border-gray-200"
                >
                  <SlidersHorizontal size={18} />
                </button>

                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-transparent hover:bg-gray-100 focus:bg-white focus:border-rose-200 focus:ring-2 focus:ring-rose-100 rounded-full text-sm outline-none transition-all"
                    defaultValue={currentSearch}
                    onChange={(e) => handleSearchInput(e.target.value)}
                    onFocus={() => showSuggestions && setShowSuggestions(true)}
                  />
                  {showSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-40 max-h-96 overflow-y-auto">
                      {searchLoading ? (
                        <div className="p-4 text-center text-gray-500">Searching...</div>
                      ) : searchSuggestions.length > 0 ? (
                        <div>
                          {searchSuggestions.map((product) => (
                            <Link
                              key={product.product_id}
                              href={`/products/${product.product_id}`}
                              className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 text-left"
                              onClick={() => setShowSuggestions(false)}
                            >
                              <Image
                                src={product.images[0]?.image || '/images/placeholder.png'}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="w-12 h-12 object-contain rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                <p className="text-xs text-gray-500">Rs. {product.price}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500">No suggestions</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider hidden sm:block">{products.length} Items</span>
                <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 uppercase tracking-widest hidden sm:block">Sort</span>
                  <div className="relative group">
                    <select
                      value={currentSort}
                      onChange={(e) => updateParams({ ordering: e.target.value })}
                      className="appearance-none bg-transparent pl-2 pr-6 py-1 text-sm font-bold cursor-pointer outline-none text-right hover:text-rose-600 transition-colors"
                    >
                      <option value="">Featured</option>
                      <option value="price">Low Price</option>
                      <option value="-price">High Price</option>
                    </select>
                    <ArrowUpDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Grid - Standard Square Aspect */}
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-gray-100 mb-3 rounded-xl"></div>
                    <div className="h-3 bg-gray-100 w-3/4 mb-2 rounded"></div>
                    <div className="h-3 bg-gray-100 w-1/4 rounded"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product, idx) => (
                    <div
                      key={product.product_id}
                      className="opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-forwards"
                      style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'forwards' }}
                    >
                      <PremiumProductCard product={product} />
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-2 mt-20">
                  <button
                    onClick={() => updateParams({ page: Math.max(1, currentPage - 1) })}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full hover:border-rose-500 hover:text-rose-500 disabled:opacity-30 disabled:border-gray-200 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="flex items-center gap-1 font-mono text-sm">
                    <span className="font-bold ">{currentPage}</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-400">{totalPages}</span>
                  </div>

                  <button
                    onClick={() => updateParams({ page: Math.min(totalPages, currentPage + 1) })}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full hover:border-rose-500 hover:text-rose-500 disabled:opacity-30 disabled:border-gray-200 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </>
            ) : (
              <div className="py-20 text-center">
                <p className="text-gray-500">No products found.</p>
                <button onClick={() => router.push('/products')} className="mt-4 text-sm font-bold underline text-rose-500">Clear Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white"></div>}>
      <ProductsContent />
    </Suspense>
  );
}
