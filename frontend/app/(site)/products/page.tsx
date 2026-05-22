'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronDown, ChevronLeft, ChevronRight, X, Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/shop';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_PRODUCTS = [
  { product_id: '1', name: 'COSRX Snail Mucin 96% Power Repairing Essence', price: 2800, old_price: 3200, category_name: 'Essence', brand: 'COSRX', images: [{ image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&auto=format&fit=crop' }] },
  { product_id: '2', name: 'Anua Heartleaf 77% Soothing Toner', price: 3100, old_price: null, category_name: 'Toner', brand: 'Anua', images: [{ image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop' }] },
  { product_id: '3', name: 'Some By Mi AHA BHA PHA 30 Days Miracle Toner', price: 1950, old_price: 2400, category_name: 'Toner', brand: 'Some By Mi', images: [{ image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop' }] },
  { product_id: '4', name: 'Isntree Hyaluronic Acid Toner', price: 2200, old_price: null, category_name: 'Toner', brand: 'Isntree', images: [{ image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop' }] },
  { product_id: '5', name: 'Skin1004 Madagascar Centella Ampoule', price: 3500, old_price: 4000, category_name: 'Ampoule', brand: 'Skin1004', images: [{ image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop' }] },
  { product_id: '6', name: 'Medicube Age R Booster Shot', price: 5200, old_price: null, category_name: 'Serum', brand: 'Medicube', images: [{ image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop' }] },
  { product_id: '7', name: 'Roundlab 1025 Dokdo Cleanser', price: 1800, old_price: 2000, category_name: 'Cleanser', brand: 'Roundlab', images: [{ image: 'https://images.unsplash.com/photo-1601612628452-9e99ced43524?w=600&auto=format&fit=crop' }] },
  { product_id: '8', name: 'BOJ Ceramide Repair Cream', price: 4100, old_price: null, category_name: 'Moisturizer', brand: 'BOJ', images: [{ image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&auto=format&fit=crop' }] },
  { product_id: '9', name: 'COSRX Advanced Snail 92 All in one Cream', price: 3300, old_price: 3800, category_name: 'Moisturizer', brand: 'COSRX', images: [{ image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&auto=format&fit=crop' }] },
  { product_id: '10', name: 'Anua Heartleaf Pore Control Cleansing Oil', price: 2700, old_price: null, category_name: 'Cleanser', brand: 'Anua', images: [{ image: 'https://images.unsplash.com/photo-1614159102043-d3b56a98b8bc?w=600&auto=format&fit=crop' }] },
  { product_id: '11', name: 'Skin1004 Centella Hyalu-Cica Water-Fit Sun Serum', price: 2900, old_price: 3500, category_name: 'Sunscreen', brand: 'Skin1004', images: [{ image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&auto=format&fit=crop' }] },
  { product_id: '12', name: 'Isntree C-Niacin Toning Ampoule', price: 3800, old_price: null, category_name: 'Ampoule', brand: 'Isntree', images: [{ image: 'https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=600&auto=format&fit=crop' }] },
];

const CATEGORIES = ['All', 'Toner', 'Essence', 'Serum', 'Ampoule', 'Moisturizer', 'Cleanser', 'Sunscreen'];
const BRANDS = ['All', 'COSRX', 'Anua', 'Some By Mi', 'Isntree', 'Skin1004', 'Medicube', 'Roundlab', 'BOJ'];
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

interface Product {
  product_id: string;
  name: string;
  price: number;
  old_price?: number | null;
  category_name: string;
  brand: string;
  images: Array<{ image: string }>;
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All Prices');
  const [selectedSort, setSelectedSort] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered + sorted products
  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
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

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resetPage = () => setCurrentPage(1);

  const activeSortLabel = SORT_OPTIONS.find(o => o.value === selectedSort)?.label || 'Default';

  return (
    <main className="min-h-screen bg-white">

      {/* ── TOP FILTER BAR ── */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-[1600px] mx-auto flex items-stretch divide-x divide-gray-200">
          <FilterDropdown
            label="Category"
            options={CATEGORIES}
            value={selectedCategory}
            onChange={(v) => { setSelectedCategory(v); resetPage(); }}
          />
          <FilterDropdown
            label="Brand"
            options={BRANDS}
            value={selectedBrand}
            onChange={(v) => { setSelectedBrand(v); resetPage(); }}
          />
          <FilterDropdown
            label="Price"
            options={PRICE_RANGES.map(r => r.label)}
            value={selectedPriceRange}
            onChange={(v) => { setSelectedPriceRange(v); resetPage(); }}
          />
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-5">

        {/* ── SORT BAR + PAGINATION ── */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          {/* Sort by */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500 tracking-wider">Sort by</span>
            <div className="relative">
              <select
                value={selectedSort}
                onChange={(e) => { setSelectedSort(e.target.value); resetPage(); }}
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
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 text-[12px] flex items-center justify-center transition-colors ${currentPage === page
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-black'
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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

        {/* ── ACTIVE FILTERS ── */}
        {(selectedCategory !== 'All' || selectedBrand !== 'All' || selectedPriceRange !== 'All Prices') && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-[11px] text-gray-400 uppercase tracking-wider">Active filters:</span>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => { setSelectedCategory('All'); resetPage(); }}
                className="flex items-center gap-1.5 text-[11px] border border-gray-300 px-3 py-1 hover:border-gray-800 transition-colors"
              >
                {selectedCategory}
                <X size={10} />
              </button>
            )}
            {selectedBrand !== 'All' && (
              <button
                onClick={() => { setSelectedBrand('All'); resetPage(); }}
                className="flex items-center gap-1.5 text-[11px] border border-gray-300 px-3 py-1 hover:border-gray-800 transition-colors"
              >
                {selectedBrand}
                <X size={10} />
              </button>
            )}
            {selectedPriceRange !== 'All Prices' && (
              <button
                onClick={() => { setSelectedPriceRange('All Prices'); resetPage(); }}
                className="flex items-center gap-1.5 text-[11px] border border-gray-300 px-3 py-1 hover:border-gray-800 transition-colors"
              >
                {selectedPriceRange}
                <X size={10} />
              </button>
            )}
            <button
              onClick={() => { setSelectedCategory('All'); setSelectedBrand('All'); setSelectedPriceRange('All Prices'); resetPage(); }}
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

                  {/* Heart Icon Overlay */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist({
                        product_id: product.product_id,
                        name: product.name,
                        price: product.price,
                        old_price: product.old_price || undefined,
                        image: product.images[0]?.image || '/images/placeholder.png',
                        category_name: product.category_name,
                      });
                    }}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm"
                  >
                    <Heart
                      size={16}
                      className={isInWishlist(product.product_id) ? 'fill-red-600 text-red-600' : 'text-neutral-900'}
                    />
                  </button>

                  {/* Details */}
                  <Link href={`/products/${product.product_id}`} className="block">
                    <p className="text-[12px] text-gray-700 leading-snug mb-1.5 font-light line-clamp-2 group-hover:text-black transition-colors">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] text-gray-800">
                        Rs. {product.price.toLocaleString()}
                      </span>
                      {product.old_price && (
                        <span className="text-[12px] text-gray-400 line-through">
                          Rs. {product.old_price.toLocaleString()}
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
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30 transition-colors border border-gray-200"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 text-[12px] flex items-center justify-center transition-colors border ${currentPage === page
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'border-gray-200 text-gray-600 hover:border-gray-800 hover:text-black'
                    }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ProductsContent />
    </Suspense>
  );
}
