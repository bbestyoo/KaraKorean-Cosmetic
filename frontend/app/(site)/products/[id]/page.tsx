'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { ProductRecommendations } from '@/components/ProductRecommendations';

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
  price_adjustment: number;
  stock: number;
}

interface Product {
  product_id: string;
  name: string;
  category: string;
  price: number;
  old_price: number | null;
  before_deal_price: number | null;
  stock: number;
  images: ProductImage[];
  ratings: Rating;
  variants: Variant[];
  sizes: Size[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/shop';
const API_ORIGIN = API_BASE_URL.replace(/\/shop\/?$/, '');

const emptyRatingDict = (): Record<number, number> => ({
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
});

interface ApiProduct extends Omit<Product, 'category' | 'images'> {
  category?: string | null;
  images?: ProductImage[];
}

function resolveImageUrl(image?: string | null) {
  if (!image) return '/images/placeholder.png';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;

  const normalizedPath = image.startsWith('/') ? image : `/${image}`;
  return new URL(normalizedPath, API_ORIGIN).toString();
}

function normalizeProduct(product: ApiProduct): Product {
  return {
    ...product,
    category: product.category || 'Uncategorized',
    images: Array.isArray(product.images)
      ? product.images.map((image) => ({
        ...image,
        image: resolveImageUrl(image.image),
      }))
      : [],
  };
}

function formatRs(amount: number): string {
  const formatted = amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `Rs${formatted}`;
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

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [openPolicy, setOpenPolicy] = useState<string | null>(null);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {


    const fetchProduct = async () => {
      try {
        const resolvedParams = await params;
        const response = await fetch(`${API_BASE_URL}/api/${resolvedParams.id}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }

        const data = (await response.json()) as ApiProduct;
        const normalizedProduct = normalizeProduct(data);

        setProduct(normalizedProduct);

        if (normalizedProduct.images.length > 0) {
          setMainImage(normalizedProduct.images[0].image);
        }

      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params]);

  const getSizeAdjustment = () => {
    if (!selectedSize || !product?.sizes) return 0;
    const selectedSizeObj = product.sizes.find((s) => s.name === selectedSize);
    return selectedSizeObj?.price_adjustment || 0;
  };

  const getFinalPrice = () => {
    return product ? product.price + getSizeAdjustment() : 0;
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowValidationErrors(true);
      return;
    }

    if (product && mainImage) {
      addItem({
        product_id: product.product_id,
        name: product.name,
        price: getFinalPrice(),
        size: selectedSize,
        quantity,
        image: mainImage,
      });

      if (typeof window !== 'undefined' && 'gtag' in window) {
        (
          window as Window & {
            gtag?: (event: string, action: string, data: Record<string, unknown>) => void;
          }
        ).gtag?.('event', 'add_to_cart', {
          currency: 'USD',
          value: getFinalPrice() * quantity,
          items: [
            {
              item_id: product.product_id,
              item_name: product.name,
              price: getFinalPrice(),
              quantity,
              item_category: product.category,
            },
          ],
        });
      }

      setQuantity(1);
      setShowValidationErrors(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse space-y-4 w-full max-w-sm px-6">
          <div className="aspect-[3/4] w-full bg-neutral-200" />
          <div className="h-4 w-2/3 bg-neutral-200" />
          <div className="h-10 w-full bg-neutral-200" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-neutral-500 text-lg">Product not found</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <div className="flex flex-col lg:flex-row lg:items-start">
        <section
          className="w-full lg:w-1/2 flex flex-col"
          aria-label="Product gallery"
        >
          {(product.images.length > 0 ? product.images : [{ image: '/images/placeholder.png' }]).map((img, idx) => (
            <div
              key={`${img.image}-${idx}`}
              className="relative w-full aspect-[3/4] bg-neutral-100"
            >
              <Image
                src={img.image}
                alt={`${product.name} — view ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={idx === 0}
              />
            </div>
          ))}
        </section>

        <aside className="w-full lg:w-1/2 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto bg-white px-6 py-10 sm:px-12 sm:py-14 lg:p-20 scrollbar-hide">
          <div className="max-w-[580px] space-y-12">
            {/* Header / Title */}
            <header className="space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-light tracking-wide text-neutral-900 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-baseline">
                <p
                  className="text-2xl sm:text-3xl lg:text-[2rem] text-neutral-800"
                  style={{ fontFamily: 'var(--font-playfair), serif' }}
                >
                  {formatRs(getFinalPrice())}
                </p>
              </div>
            </header>

            {/* Add to Cart Button */}
            <div>
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full max-w-[320px] border border-[#0f3b2b] bg-[#0f3b2b] py-4.5 text-sm font-semibold tracking-widest text-white uppercase transition-all duration-300 hover:bg-transparent hover:text-[#0f3b2b] rounded-md shadow-md"
              >
                Add to cart
              </button>
            </div>

            {/* Selectors */}
            <div className="space-y-8 pt-4">
              {/* Size */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-6">
                <span className="text-base md:text-lg font-semibold text-neutral-900">Size:</span>
                <div className="relative w-full max-w-[280px] border border-neutral-300 rounded-md bg-neutral-50 px-1 py-0.5">
                  <select
                    value={selectedSize ?? ''}
                    onChange={(e) => setSelectedSize(e.target.value || null)}
                    className="w-full appearance-none bg-transparent py-2.5 pl-3 pr-10 text-base text-neutral-700 outline-none cursor-pointer font-medium"
                  >
                    <option value="">Select Size</option>
                    {product.sizes && product.sizes.length > 0 ? (
                      product.sizes.map((size) => {
                        return <option key={size.id} value={size.name} disabled={size.stock <= 0}>{size.name}{size.stock <= 0 ? ' — out of stock' : ''}</option>;
                      })
                    ) : (
                      ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))
                    )}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-neutral-500" />
                </div>
              </div>

              {/* Quantity */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-6 pt-2">
                <span className="text-base md:text-lg font-semibold text-neutral-900">Quantity:</span>
                <span className="text-base md:text-lg text-neutral-900 pl-3">{quantity}</span>
              </div>

              {showValidationErrors && !selectedSize && (
                <p className="text-sm text-red-600 mt-2">Please select a size.</p>
              )}
            </div>

            {/* Accordions */}
            <div className="pt-8">
              <ul className="flex flex-col">
                {POLICY_SECTIONS.map((section) => {
                  const open = openPolicy === section.id;
                  return (
                    <li key={section.id} className="border-b border-neutral-300">
                      <button
                        type="button"
                        onClick={() => setOpenPolicy(open ? null : section.id)}
                        className="flex w-full items-center justify-between py-5 text-left text-sm md:text-base font-bold tracking-widest uppercase text-neutral-800 hover:text-[#0f3b2b] transition-colors"
                      >
                        {section.title}
                        <ChevronDown
                          className={`size-5 shrink-0 text-neutral-500 transition-transform ${open ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {open && (
                        <p className="pb-6 text-base md:text-lg leading-relaxed text-neutral-600">{section.body}</p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <ProductRecommendations productId={product.product_id} />
      </div>
    </main>
  );
}

