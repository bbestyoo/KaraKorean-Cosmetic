'use client';

import { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ChevronDown, ChevronLeft, ChevronRight, X, Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/shop';
const API_ORIGIN = API_BASE_URL.replace(/\/shop\/?$/, '');

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under Rs. 2,000', min: 0, max: 2000 },
  { label: 'Rs. 2,000 – 3,000', min: 2000, max: 3000 },
  { label: 'Rs. 3,000 – 4,000', min: 3000, max: 4000 },
  { label: 'Above Rs. 4,000', min: 4000, max: Infinity },
];
const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A–Z' },
];

const ITEMS_PER_PAGE = 8;

interface ApiProduct {
  product_id: string;
  name: string;
  price: number | string;
  old_price?: number | string | null;
  category_name?: string | null;
  category?: string | { name?: string } | null;
  brand?: string | { name?: string } | null;
  brandName?: string | null;
  images?: Array<{ image: string }>;
}

interface Product {
  product_id: string;
  name: string;
  price: number;
  old_price?: number | null;
  category_name: string;
  brand: string;
  images: Array<{ image: string }>;
}

function resolveImageUrl(image?: string | null) {
  if (!image) return '/images/placeholder.png';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;

  const normalizedPath = image.startsWith('/') ? image : `/${image}`;
  return new URL(normalizedPath, API_ORIGIN).toString();
}

function normalizeProduct(product: ApiProduct): Product {
  const brandValue = typeof product.brand === 'string' ? product.brand : product.brand?.name;
  const categoryValue =
    product.category_name ||
    (typeof product.category === 'string' ? product.category : product.category?.name) ||
    'Uncategorized';

  return {
    product_id: product.product_id,
    name: product.name,
    price: Number(product.price) || 0,
    old_price:
      product.old_price === null || product.old_price === undefined ? null : Number(product.old_price),
    category_name: categoryValue,
    brand: product.brandName || brandValue || 'Unknown',
    images: Array.isArray(product.images)
      ? product.images.map((image) => ({ image: resolveImageUrl(image.image) }))
      : [],
  };
}

// ─── Dropdown Filter Component ────────────────────────────────────────────────
function FilterDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-gray-700 hover:text-black transition-colors py-4 px-4 whitespace-nowrap"
      >
        {label}
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-0 w-52 bg-white border border-gray-200 shadow-lg z-30">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => { onChange(option); setOpen(false); }}
              className={`w-full text-left px-5 py-3 text-[12px] tracking-wide transition-colors border-b border-gray-50 last:border-b-0 ${value === option ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Content Component ───────────────────────────────────────────────────
function ProductsContent() {
  const searchParams = useSearchParams();
  const searchParamsString = searchParams ? searchParams.toString() : '';
  const router = useRouter();
  const pathname = usePathname();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addItem } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All Prices');
  const [selectedSort, setSelectedSort] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const sp = new URLSearchParams(searchParamsString);
    const categoryParam = sp.get('category');
    const brandParam = sp.get('brand');
    const priceParam = sp.get('price');
    const sortParam = sp.get('sort');
    const pageParam = sp.get('page');

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('All');
    }

    if (brandParam) {
      setSelectedBrand(brandParam);
    } else {
      setSelectedBrand('All');
    }

    if (priceParam) {
      setSelectedPriceRange(priceParam);
    } else {
      setSelectedPriceRange('All Prices');
    }

    if (sortParam) {
      setSelectedSort(sortParam);
    } else {
      setSelectedSort('');
    }

    if (pageParam) {
      setCurrentPage(Number(pageParam) || 1);
    } else {
      setCurrentPage(1);
    }
  }, [searchParamsString]);

  // Update URL only on explicit user actions to avoid navigation loops
  const updateUrl = (overrides: { category?: string; brand?: string; price?: string; sort?: string; page?: number } = {}) => {
    const category = overrides.category !== undefined ? overrides.category : selectedCategory;
    const brand = overrides.brand !== undefined ? overrides.brand : selectedBrand;
    const price = overrides.price !== undefined ? overrides.price : selectedPriceRange;
    const sort = overrides.sort !== undefined ? overrides.sort : selectedSort;
    const page = overrides.page !== undefined ? overrides.page : currentPage;

    const params = new URLSearchParams();
    if (category && category !== 'All') params.set('category', category);
    if (brand && brand !== 'All') params.set('brand', brand);
    if (price && price !== 'All Prices') params.set('price', price);
    if (sort) params.set('sort', sort);
    if (page && page > 1) params.set('page', String(page));

    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ''}`);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const firstResponse = await fetch(`${API_BASE_URL}/api/?page=1&page_size=100`);
        if (!firstResponse.ok) {
          throw new Error('Failed to fetch products');
        }

        const firstData = await firstResponse.json();
        const totalPages = Number(firstData?.total_pages) || 1;
        const results = Array.isArray(firstData?.results) ? firstData.results : [];

        const additionalPages = await Promise.all(
          Array.from({ length: Math.max(0, totalPages - 1) }, async (_, index) => {
            const page = index + 2;
            const response = await fetch(`${API_BASE_URL}/api/?page=${page}&page_size=100`);
            if (!response.ok) return [];
            const data = await response.json();
            return Array.isArray(data?.results) ? data.results : [];
          })
        );

        if (!isMounted) return;

        const merged = [...results, ...additionalPages.flat()].map(normalizeProduct);
        setProducts(merged);
      } catch (fetchError) {
        if (!isMounted) return;
        console.error('Error fetching products:', fetchError);
        setError('Unable to load products right now.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAllProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((product) => product.category_name).filter(Boolean)))],
    [products]
  );
  const brands = useMemo(
    () => ['All', ...Array.from(new Set(products.map((product) => product.brand).filter(Boolean)))],
    [products]
  );

  // Normalize selectedCategory/Brand to match actual option casing after products load
  useEffect(() => {
    if (categories.length > 1 && selectedCategory && selectedCategory !== 'All') {
      const match = categories.find((c) => c.toLowerCase() === selectedCategory.toLowerCase());
      if (match && match !== selectedCategory) setSelectedCategory(match);
    }

    if (brands.length > 1 && selectedBrand && selectedBrand !== 'All') {
      const matchB = brands.find((b) => b.toLowerCase() === selectedBrand.toLowerCase());
      if (matchB && matchB !== selectedBrand) setSelectedBrand(matchB);
    }
  }, [categories, brands]);

  // Filtered + sorted products
  const filteredProducts = products.filter((p) => {
    const priceRange = PRICE_RANGES.find(r => r.label === selectedPriceRange) || PRICE_RANGES[0];
    return (
      (selectedCategory === 'All' || p.category_name === selectedCategory) &&
      (selectedBrand === 'All' || p.brand === selectedBrand) &&
      (p.price >= priceRange.min && p.price <= priceRange.max)
    );
  }).sort((a, b) => {
    if (selectedSort === 'price_asc') return a.price - b.price;
    if (selectedSort === 'price_desc') return b.price - a.price;
    if (selectedSort === 'name_asc') return a.name.localeCompare(b.name);
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resetPage = () => setCurrentPage(1);

  return (
    <>
    <main className="min-h-screen bg-white">

      {/* ── TOP FILTER BAR ── */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-[1600px] mx-auto flex items-stretch divide-x divide-gray-200">
          <FilterDropdown
            label="Category"
            options={categories}
            value={selectedCategory}
            onChange={(v) => {
              setSelectedCategory(v);
              resetPage();
              updateUrl({ category: v, page: 1 });
            }}
          />
          <FilterDropdown
            label="Brand"
            options={brands}
            value={selectedBrand}
            onChange={(v) => {
              setSelectedBrand(v);
              resetPage();
              updateUrl({ brand: v, page: 1 });
            }}
          />
          <FilterDropdown
            label="Price"
            options={PRICE_RANGES.map(r => r.label)}
            value={selectedPriceRange}
            onChange={(v) => {
              setSelectedPriceRange(v);
              resetPage();
              updateUrl({ price: v, page: 1 });
            }}
          />
        </div>
      </div>

      <div className="max-w-[1700px] mx-auto px-4 sm:px-5">

        {/* ── SORT BAR + PAGINATION ── */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          {/* Sort by */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500 tracking-wider">Sort by</span>
            <div className="relative">
              <select
                value={selectedSort}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedSort(val);
                  resetPage();
                  updateUrl({ sort: val, page: 1 });
                }}
                className="appearance-none text-[12px] font-medium text-gray-800 pr-5 cursor-pointer bg-transparent outline-none border-b border-gray-300 pb-0.5 hover:border-gray-800 transition-colors"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={11} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
            </div>
          </div>

          {/* Pagination controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => {
                const newP = Math.max(1, p - 1);
                updateUrl({ page: newP });
                return newP;
              })}
              disabled={currentPage === 1}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                  updateUrl({ page });
                }}
                className={`w-7 h-7 text-[12px] flex items-center justify-center transition-colors ${currentPage === page
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-black'
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => {
                const newP = Math.min(totalPages, p + 1);
                updateUrl({ page: newP });
                return newP;
              })}
              disabled={currentPage === totalPages}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* ── PAGE TITLE ── */}
        <h1 className="text-3xl font-serif text-gray-800 mt-8 mb-8 font-normal">
          Korean Beauty Shop
        </h1>

        {loading && products.length === 0 && (
          <div className="py-24 text-center text-sm text-gray-500">
            Loading products...
          </div>
        )}

        {!loading && error && products.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-[11px] uppercase tracking-widest border border-gray-300 px-6 py-2.5 hover:border-gray-800 hover:text-black transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── ACTIVE FILTERS ── */}
        {(selectedCategory !== 'All' || selectedBrand !== 'All' || selectedPriceRange !== 'All Prices') && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-[11px] text-gray-400 uppercase tracking-wider">Active filters:</span>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => { setSelectedCategory('All'); resetPage(); updateUrl({ category: 'All', page: 1 }); }}
                className="flex items-center gap-1.5 text-[11px] border border-gray-300 px-3 py-1 hover:border-gray-800 transition-colors"
              >
                {selectedCategory}
                <X size={10} />
              </button>
            )}
            {selectedBrand !== 'All' && (
              <button
                onClick={() => { setSelectedBrand('All'); resetPage(); updateUrl({ brand: 'All', page: 1 }); }}
                className="flex items-center gap-1.5 text-[11px] border border-gray-300 px-3 py-1 hover:border-gray-800 transition-colors"
              >
                {selectedBrand}
                <X size={10} />
              </button>
            )}
            {selectedPriceRange !== 'All Prices' && (
              <button
                onClick={() => { setSelectedPriceRange('All Prices'); resetPage(); updateUrl({ price: 'All Prices', page: 1 }); }}
                className="flex items-center gap-1.5 text-[11px] border border-gray-300 px-3 py-1 hover:border-gray-800 transition-colors"
              >
                {selectedPriceRange}
                <X size={10} />
              </button>
            )}
            <button
              onClick={() => { setSelectedCategory('All'); setSelectedBrand('All'); setSelectedPriceRange('All Prices'); resetPage(); updateUrl({ category: 'All', brand: 'All', price: 'All Prices', page: 1 }); }}
              className="text-[11px] text-gray-400 underline hover:text-gray-800 ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* ── PRODUCT GRID ── */}
        {paginatedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 mb-20">
              {paginatedProducts.map((product) => (
                <div
                  key={product.product_id}
                  className="group relative"
                >
                  <Link href={`/products/${product.product_id}`} className="block">
                    {/* Image */}
                    <div className="aspect-square bg-[#f2f2f2] overflow-hidden relative mb-3">
                      <Image
                        src={product.images[0]?.image || '/images/placeholder.png'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.old_price && (
                        <div className="absolute top-3 left-3 bg-gray-900 text-white text-[9px] uppercase tracking-widest px-2 py-1">
                          Sale
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Actions Overlay */}
                  <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist({
                          product_id: product.product_id,
                          name: product.name,
                          price: product.price,
                          old_price: product.old_price || undefined,
                          image: product.images[0]?.image || '/images/placeholder.png',
                          category_name: product.category_name,
                        });
                      }}
                      className="p-2 rounded-full bg-white shadow-sm  cursor-pointer hover:scale-105 transition-all text-neutral-900"
                    >
                      <Heart
                        size={16}
                        className={`${isInWishlist(product.product_id) ? 'fill-[#c9a46b] text-[#c9a46b]' : 'text-neutral-900'}} hover:text-[#c9a46b] `}
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addItem({
                          product_id: product.product_id,
                          name: product.name,
                          price: product.price,
                          size: 'Standard',
                          quantity: 1,
                          image: product.images[0]?.image || '/images/placeholder.png',
                        });
                      }}
                      className="p-2 rounded-full bg-white  shadow-sm hover:scale-105 transition-all text-neutral-900 cursor-pointer"
                    >
                      <ShoppingBag
                        size={16}
                        className="text-neutral-900 hover:text-[#c9a46b] transition-colors "
                      />
                    </button>
                  </div>

                  {/* Details */}
                  <Link href={`/products/${product.product_id}`} className="block">
                    <p className="text-[12px] text-gray-700 leading-snug mb-1.5 font-light line-clamp-2 group-hover:text-black transition-colors">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] text-gray-800">
                        Rs.&nbsp;{product.price.toLocaleString()}
                      </span>
                      {product.old_price && (
                        <span className="text-[12px] text-gray-400 line-through">
                          Rs.&nbsp;{product.old_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* ── BOTTOM PAGINATION ── */}
            <div className="flex items-center justify-center gap-1 pb-20">
              <button
                onClick={() => setCurrentPage(p => {
                  const newP = Math.max(1, p - 1);
                  updateUrl({ page: newP });
                  return newP;
                })}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30 transition-colors border border-gray-200"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    updateUrl({ page });
                  }}
                  className={`w-8 h-8 text-[12px] flex items-center justify-center transition-colors border ${currentPage === page
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'border-gray-200 text-gray-600 hover:border-gray-800 hover:text-black'
                    }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => {
                  const newP = Math.min(totalPages, p + 1);
                  updateUrl({ page: newP });
                  return newP;
                })}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30 transition-colors border border-gray-200"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </>
        ) : (
          <div className="py-32 text-center">
            <p className="text-gray-400 text-sm mb-4">No products found.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSelectedBrand('All'); setSelectedPriceRange('All Prices'); }}
              className="text-[11px] uppercase tracking-widest border border-gray-300 px-6 py-2.5 hover:border-gray-800 hover:text-black transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </main>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ProductsContent />
    </Suspense>
  );
}
