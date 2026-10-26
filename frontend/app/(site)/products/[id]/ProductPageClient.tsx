'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronDown, Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { ProductRecommendations } from '@/components/ProductRecommendations';
import ProductReviews from '@/components/ProductReviews';
import { formatPrice, getDiscountPercentage } from '@/lib/pricing';
import { trackMetaEvent } from '@/lib/meta';
import DOMPurify from "dompurify";

function safeSanitize(html: string): string {
  if (typeof window === 'undefined') return html;
  try {
    return upgradeDescriptionHtml(DOMPurify.sanitize(html));
  } catch {
    return html;
  }
}

// Upgrade standalone all-caps section labels (e.g. "<p><strong>BENEFITS</strong></p>")
// found in product descriptions into styled section headings.
function upgradeDescriptionHtml(html: string): string {
  return html.replace(
    /<p>(\s*<strong>(?:\s*<u>)?[\s\S]*?(?:<\/u>)?\s*<\/strong>\s*)<\/p>/gi,
    (match, inner: string) => {
      if (!inner) return match;
      const text = inner
        .replace(/<\/?(?:strong|u)>/gi, '')
        .replace(/&nbsp;/gi, ' ')
        .trim();
      const stripped = text.replace(/[;:]/g, '');
      if (
        stripped &&
        stripped === stripped.toUpperCase() &&
        /[A-Z]/.test(stripped) &&
        stripped.length <= 40
      ) {
        return `<h3 class="product-desc-h">${stripped.replace(/\s+/g, ' ')}</h3>`;
      }
      return match;
    }
  );
}

interface ProductImage {
  image: string;
}

interface Rating {
  stats: {
    total_ratings: number;
    rating_dict: Record<number, number>;
    avg_rating: number;
  };
  data: Array<Record<string, unknown>>;
}

interface Variant {
  id: number;
  name: string;
  additional_price: number;
}

interface Size {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export interface Product {
  product_id: string;
  name: string;
  description?: string | null;
  category: string;
  category_name?: string | null;
  price: number;
  old_price: number | null;
  before_deal_price: number | null;
  stock_count: number;
  in_stock: boolean;
  images: ProductImage[];
  ratings: Rating;
  variants: Variant[];
  sizes: Size[];
}

const POLICY_SECTIONS = [
  {
    id: 'returns',
    title: 'Return & refund policy',
    body: 'We accept returns within 7 days of delivery for unused items with tags attached. Refunds are processed to the original payment method within 5–7 business days after we receive your return.',
  },
  {
    id: 'exchange',
    title: 'Exchange policy',
    body: 'Exchanges are available for a different size or color subject to stock. Initiate an exchange from your order page within 7 days. We cover one exchange per order.',
  },
  {
    id: 'shipping',
    title: 'Shipping policy',
    body: 'Orders ship within 2 business days. Standard delivery is 3–5 business days nationwide. You will receive tracking information by email once your package is on the way.',
  },
] as const;

export default function ProductPageClient({ initialProduct }: { initialProduct: Product }) {
  const [product, setProduct] = useState<Product>(initialProduct);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string>(initialProduct.images?.[0]?.image || '');
  const [quantity, setQuantity] = useState(1);
  const [openPolicy, setOpenPolicy] = useState<string | null>(null);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [stockError, setStockError] = useState(false);
  const { addItem, closeCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    const sellablePrices = initialProduct.sizes
      .filter((size) => size.stock > 0)
      .map((size) => size.price)
      .filter((price) => price > 0);
    const value = sellablePrices.length > 0
      ? Math.min(...sellablePrices)
      : initialProduct.price;

    trackMetaEvent('ViewContent', {
      currency: 'NPR',
      value,
      content_ids: [initialProduct.product_id],
      content_name: initialProduct.name,
      content_category: initialProduct.category_name || initialProduct.category,
      content_type: 'product',
    });
  }, [initialProduct]);

  // Refresh live stock after mount so size/count changes show without a hard
  // refresh (bypasses Next's fetch/router caches, which can serve stale data).
  useEffect(() => {
    let cancelled = false;
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.karakoreanbeauty.com/shop';

    const refreshStock = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/${initialProduct.product_id}/`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setProduct((prev) => {
          if (!prev) return prev;
          const freshSizes = Array.isArray(data?.sizes) ? data.sizes : [];
          const sizes = prev.sizes.map((s) => {
            const fresh = freshSizes.find(
              (f: { name?: string; stock?: number; price?: number }) => f.name === s.name
            );
            if (!fresh) return s;
            return {
              ...s,
              stock: Number(fresh.stock ?? s.stock),
              price: Number(fresh.price ?? s.price),
            };
          });
          // Per-size stock is the source of truth whenever the product has sizes.
          const stock_count = sizes.length > 0
            ? sizes.reduce((sum, s) => sum + s.stock, 0)
            : Number(data?.stock_count ?? prev.stock_count);
          return {
            ...prev,
            stock_count,
            in_stock: stock_count > 0,
            sizes,
          };
        });
      } catch {
        // Keep server-rendered stock if the refresh fails
      }
    };
    refreshStock();

    return () => {
      cancelled = true;
    };
  }, [initialProduct.product_id]);

  useEffect(() => {
    if (!product) {
      setSelectedSize(null);
      return;
    }
    if (product.sizes && product.sizes.length === 1) {
      setSelectedSize(product.sizes[0].name);
    } else {
      setSelectedSize(null);
    }
  }, [product]);

  const selectedSizeObj = useMemo(
    () => (selectedSize ? product?.sizes?.find((s) => s.name === selectedSize) ?? null : null),
    [selectedSize, product?.sizes]
  );

  // Each size carries its own absolute price; the product price is the fallback
  // for products that have no sizes.
  const getFinalPrice = () => {
    if (!product) return 0;
    if (product.sizes && product.sizes.length > 0) {
      return selectedSizeObj?.price ?? 0;
    }
    return product.price;
  };

  const getOriginalPrice = () => {
    if (!product?.old_price) return null;
    return product.old_price;
  };

  const discountPercentage = getDiscountPercentage(getFinalPrice(), getOriginalPrice());

  // Size stock is the only stock source once a product has sizes.
  const getSelectedSizeStock = () => {
    if (!product) return 0;
    if (product.sizes && product.sizes.length > 0) {
      return selectedSizeObj?.stock ?? 0;
    }
    return product.stock_count ?? 0;
  };

  const handleIncrement = () => {
    setQuantity((q) => {
      const stock = getSelectedSizeStock();
      if (stock <= 0) return q;
      return Math.min(stock, q + 1);
    });
  };

  const handleDecrement = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  useEffect(() => {
    if (!product) return;
    const stock = getSelectedSizeStock();
    if (stock > 0 && quantity > stock) {
      setQuantity(stock);
    }
  }, [selectedSize, product?.sizes]);

  const hasSizes = Boolean(product?.sizes && product.sizes.length > 0);
  const selectedSizeOutOfStock = hasSizes && selectedSizeObj?.stock === 0;

  const validateSelection = () => {
    if (!product || !product.in_stock) return false;

    if (hasSizes && !selectedSize) {
      setShowValidationErrors(true);
      return false;
    }

    if (getSelectedSizeStock() < quantity) {
      setStockError(true);
      return false;
    }

    setStockError(false);
    return true;
  };

  const addSelectionToCart = () => {
    if (!product || !mainImage) return;

    addItem({
      product_id: product.product_id,
      name: product.name,
      price: getFinalPrice(),
      size: selectedSize || '',
      quantity,
      image: mainImage,
    });

    if (typeof window !== 'undefined' && 'gtag' in window) {
      (
        window as Window & {
          gtag?: (event: string, action: string, data: Record<string, unknown>) => void;
        }
      ).gtag?.('event', 'add_to_cart', {
        currency: 'NPR',
        value: getFinalPrice() * quantity,
        items: [
          {
            item_id: product.product_id,
            item_name: product.name,
            price: getFinalPrice(),
            quantity,
            item_category: product.category,
            item_variant: selectedSize || undefined,
          },
        ],
      });
    }

    setQuantity(1);
    setShowValidationErrors(false);
  };

  const handleAddToCart = () => {
    if (!validateSelection()) return;
    addSelectionToCart();
  };

  const handleBuyNow = () => {
    if (!validateSelection()) return;
    addSelectionToCart();
    // addItem opens the cart drawer; keep it closed so checkout is clean.
    closeCart();
    router.push('/checkout');
  };

  // Shown inside the right column on desktop, and below the gallery on mobile.
  const infoSections = (
    <>
      {/* Description */}
      <div className="items-start gap-6">
        <span className="text-base md:text-lg font-semibold text-neutral-900 pt-2">Description:</span>
        <div
          className="product-description text-md text-neutral-700 mt-[10px]"
          dangerouslySetInnerHTML={{
            __html: safeSanitize(product.description ?? "No description available."),
          }}
        />
      </div>

      {/* Accordions */}
      <div className="pt-8">
        <ul className="flex flex-col">
          {POLICY_SECTIONS.map((section) => {
            const isOpen = openPolicy === section.id;
            return (
              <li key={section.id} className="border-b border-neutral-300">
                <button
                  onClick={() => setOpenPolicy(isOpen ? null : section.id)}
                  className="w-full flex items-center  justify-between py-5 text-sm md:text-base font-bold tracking-widest uppercase text-neutral-800 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span>{section.title}</span>
                  <ChevronDown className={`transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                </button>
                <div className={`${isOpen ? 'block' : 'hidden'} pb-6 text-base md:text-lg leading-relaxed text-neutral-600`}>
                  {section.body}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );

  return <main className="min-h-screen bg-white text-neutral-900">
    <div className="flex flex-col lg:flex-row lg:items-start">
      {/* On mobile this wrapper is `contents` so the gallery can sit between the
          title and the purchase panel; on desktop it is the sticky right column. */}
      <div className="contents lg:flex lg:flex-col lg:order-2 lg:w-1/2 lg:sticky lg:top-0 lg:bg-white lg:px-20 lg:py-20">
        {/* Title */}
        <div className="order-1 lg:order-none px-6 pt-8 pb-5 sm:px-12 sm:pt-10 sm:pb-6 lg:p-0">
          {product.category_name && (
            <span className="block mb-2.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.28em] text-[#c9a46b]">
              {product.category_name}
            </span>
          )}
          <h1
            className="text-[1.7rem] sm:text-4xl lg:text-[2.6rem] capitalize font-normal leading-[1.12] tracking-tight text-neutral-900"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            {product.name}
          </h1>
        </div>

        {/* Price, CTA & options */}
        <div className="order-3 lg:order-none px-6 pb-8 pt-5 sm:px-12 lg:p-0 lg:pt-8 space-y-4">
          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
            {discountPercentage > 0 && getOriginalPrice() !== null && (
              <>
                <p
                  className="text-base sm:text-lg text-[#ec7cfd] line-through"
                  style={{ fontFamily: 'var(--font-playfair), serif' }}
                >
                  {formatPrice(getOriginalPrice())}
                </p>
                <span className="text-xs font-semibold tracking-widest text-[#0f3b2b] bg-[#E9F3A4] px-2 py-0.5">
                  {discountPercentage}% OFF
                </span>
              </>
            )}
            <p
              className="text-2xl sm:text-3xl lg:text-[2rem] text-neutral-800"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              {formatPrice(getFinalPrice())}
            </p>
          </div>
          {/* Selectors */}
          <div className="space-y-4">
            <div className="flex flex-row items-start gap-5 sm:flex-col sm:gap-7">
              {/* Size */}
              {hasSizes && (
                <div className="flex-[1.4] min-w-0 space-y-2.5">
                  <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-black">
                    Size
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                      const disabled = size.stock <= 0;
                      const selected = selectedSize === size.name;
                      return (
                        <button
                          key={size.id}
                          type="button"
                          onClick={() => {
                            setStockError(false);
                            if (!disabled) setSelectedSize(size.name);
                          }}
                          aria-pressed={selected}
                          aria-disabled={disabled}
                          disabled={disabled}
                          title={disabled ? `${size.name} — out of stock` : size.name}
                          className={`min-w-[52px] px-3.5 py-2 text-xs sm:text-[13px] font-medium tracking-wide border rounded-full transition-all duration-200 ${
                            selected
                              ? 'bg-[#0f3b2b] text-white border-[#0f3b2b] shadow-sm'
                              : 'bg-white text-black border-neutral-300 hover:border-neutral-900'
                          } ${disabled ? 'opacity-40 cursor-not-allowed line-through' : 'cursor-pointer'}`}
                        >
                          {size.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex-1 min-w-0 space-y-2.5">
                <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-black">
                  Quantity
                </span>
                <div className="inline-flex items-center rounded-full border border-neutral-300 bg-white">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    aria-label="Decrease quantity"
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-l-full text-black transition-colors hover:bg-neutral-100"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-sm font-medium tabular-nums text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrement}
                    aria-label="Increase quantity"
                    disabled={getSelectedSizeStock() <= 0}
                    className="flex h-9 w-9 items-center justify-center rounded-r-full text-black transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            {showValidationErrors && hasSizes && !selectedSize && (
              <p className="text-sm text-red-600 mt-2">Please select a size.</p>
            )}

            {stockError && selectedSize && (
              <p className="text-sm text-red-600 mt-2">
                Only {getSelectedSizeStock()} left in size {selectedSize}. Please reduce the quantity.
              </p>
            )}

          </div>

          {/* Add to Cart / Buy Now */}
          <div>
            {!product.in_stock ? (
              <div className="w-full max-w-[320px] border border-neutral-300 bg-neutral-100 py-4.5 text-sm font-semibold tracking-widest text-neutral-500 uppercase rounded-md text-center">
                Out of stock
              </div>
            ) : (
              <div className="flex flex-row gap-3 max-w-[520px]">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={selectedSizeOutOfStock}
                  className={`flex-1 border border-[#0f3b2b] py-4.5 px-2 text-xs sm:text-sm font-semibold tracking-widest uppercase transition-all duration-300 rounded-md shadow-md ${
                    selectedSizeOutOfStock
                      ? 'cursor-not-allowed bg-neutral-200 text-neutral-400 border-neutral-200 shadow-none'
                      : 'cursor-pointer bg-[#0f3b2b] text-white hover:bg-transparent hover:text-[#0f3b2b]'
                  }`}
                >
                  {selectedSizeOutOfStock ? 'Out of stock' : 'Add to cart'}
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={selectedSizeOutOfStock}
                  className={`flex-1 border border-[#c9a46b] py-4.5 px-2 text-xs sm:text-sm font-semibold tracking-widest uppercase transition-all duration-300 rounded-md shadow-md ${
                    selectedSizeOutOfStock
                      ? 'cursor-not-allowed bg-neutral-200 text-neutral-400 border-neutral-200 shadow-none'
                      : 'cursor-pointer bg-[#c9a46b] text-white hover:bg-transparent hover:text-[#c9a46b]'
                  }`}
                >
                  Buy now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Description & policies (desktop) */}
        <div className="order-4 lg:order-none hidden lg:block lg:pt-8 space-y-3">{infoSections}</div>
      </div>

      {/* Gallery — horizontal snap slider on mobile, stacked column on desktop */}
      <section
        className="order-2 lg:order-1 w-full lg:w-1/2 flex flex-row items-start lg:flex-col lg:items-stretch overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory lg:snap-none scroll-smooth"
        aria-label="Product gallery"
      >
        {(product.images.length > 0 ? product.images : [{ image: '/images/placeholder.png' }]).map((img, idx) => (
          <div
            key={`${img.image}-${idx}`}
            className="w-full shrink-0 lg:shrink snap-center lg:snap-align-none bg-neutral-100 overflow-hidden"
          >
            <Image
              src={img.image}
              alt={`${product.name} — view ${idx + 1}`}
              width={1260}
              height={1344}
              className="block w-full h-auto select-none pointer-events-none"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={idx === 0}
            />
          </div>
        ))}
      </section>
    </div>

    {/* Description & policies (mobile) */}
    <div className="lg:hidden bg-white px-6 pb-12 sm:px-12">
      <div className="space-y-3">{infoSections}</div>
    </div>


    {/* Product Reviews Section */}
    <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-6">
      <ProductReviews productId={product.product_id} />
    </div>
    <div className="mx-auto max-w-[1800px] px-4 sm:px-6 md:mb-10 lg:px-8 py-12">
      <ProductRecommendations productId={product.product_id} />
    </div>
  </main>;
}
