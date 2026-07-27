'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown, Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { ProductRecommendations } from '@/components/ProductRecommendations';
import ProductReviews from '@/components/ProductReviews';
import DOMPurify from "dompurify";

function safeSanitize(html: string): string {
  if (typeof window === 'undefined') return html;
  try {
    return DOMPurify.sanitize(html);
  } catch {
    return html;
  }
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
  price_adjustment: number;
  stock: number;
}

export interface Product {
  product_id: string;
  name: string;
  description?: string | null;
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
  const [product] = useState<Product>(initialProduct);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string>(initialProduct.images?.[0]?.image || '');
  const [quantity, setQuantity] = useState(1);
  const [openPolicy, setOpenPolicy] = useState<string | null>(null);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const { addItem } = useCart();

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

  const getSizeAdjustment = () => {
    if (!selectedSize || !product?.sizes) return 0;
    const selectedSizeObj = product.sizes.find((s) => s.name === selectedSize);
    return selectedSizeObj?.price_adjustment || 0;
  };

  const getFinalPrice = () => {
    return product ? product.price + getSizeAdjustment() : 0;
  };

  const getSelectedSizeStock = () => {
    if (!product) return Infinity;
    if (product.sizes && selectedSize) {
      const s = product.sizes.find((s) => s.name === selectedSize);
      return s?.stock ?? product.stock ?? Infinity;
    }
    return product.stock ?? Infinity;
  };

  const handleIncrement = () => {
    setQuantity((q) => {
      const stock = getSelectedSizeStock();
      return Math.min(stock, q + 1);
    });
  };

  const handleDecrement = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  useEffect(() => {
    if (!product) return;
    const stock = getSelectedSizeStock();
    if (quantity > stock) {
      setQuantity(Math.max(1, Math.min(stock, quantity)));
    }
  }, [selectedSize, product?.sizes]);

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

  return <main className="min-h-screen bg-white text-neutral-900">
    <div className="flex flex-col lg:flex-row lg:items-start">
      <section
        className="w-full lg:w-1/2 flex flex-col "
        aria-label="Product gallery"
      >
        {(product.images.length > 0 ? product.images : [{ image: '/images/placeholder.png' }]).map((img, idx) => (
          <div key={`${img.image}-${idx}`} className="w-full bg-neutral-100 overflow-hidden">
            <Image
              src={img.image}
              alt={`${product.name} — view ${idx + 1}`}
              width={1200}
              height={1600}
              className="w-full h-auto object-contain  select-none pointer-events-none"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={idx === 0}
            />
          </div>
        ))}
      </section>

      <aside className="w-full  lg:w-1/2 lg:sticky lg:top-0 bg-white px-6 py-10 sm:px-12 sm:py-14 lg:p-20">
        <div className="max-w-[880px] space-y-3">
          {/* Header / Title */}
          <header className="space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] capitalize font-light tracking-wide text-neutral-900 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-baseline">
              <p
                className="text-2xl sm:text-3xl lg:text-[2rem] text-neutral-800"
                style={{ fontFamily: 'var(--font-playfair), serif' }}
              >
                Rs.&nbsp;{(getFinalPrice())}
              </p>
            </div>
          </header>

          {/* Add to Cart Button */}
          <div>
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full max-w-[320px] cursor-pointer border border-[#0f3b2b] bg-[#0f3b2b] py-4.5 text-sm font-semibold tracking-widest text-white uppercase transition-all duration-300 hover:bg-transparent hover:text-[#0f3b2b] rounded-md shadow-md"
            >
              Add to cart
            </button>
          </div>

          {/* Selectors */}
          <div className="space-y-8 pt-4">
            {/* Size */}
            <div className="grid grid-cols-[100px_1fr] items-start gap-6">
              <span className="text-base md:text-lg font-semibold text-neutral-900 pt-2">Size:</span>
              <div className="w-full max-w-[420px]">
                <div className="flex flex-wrap gap-2">
                  {product.sizes && product.sizes.length > 0 ? (
                    product.sizes.map((size) => {
                      const disabled = size.stock <= 0;
                      const selected = selectedSize === size.name;
                      return (
                        <button
                          key={size.id}
                          type="button"
                          onClick={() => !disabled && setSelectedSize(size.name)}
                          aria-pressed={selected}
                          aria-disabled={disabled}
                          disabled={disabled}
                          className={`px-3 py-2  border rounded-md text-sm font-medium ${selected ? 'bg-[#0f3b2b] text-white border-[#0f3b2b]' : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {size.name}{disabled ? ' — out of stock' : ''}
                        </button>
                      );
                    })
                  ) : (
                    ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 cursor-pointer py-2 border rounded-md text-sm font-medium ${selectedSize === s ? 'bg-[#0f3b2b] text-white border-[#0f3b2b]' : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'}`}
                      >
                        {s}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="grid grid-cols-[100px_1fr] items-center gap-6 pt-2">
              <span className="text-base md:text-lg font-semibold text-neutral-900">Quantity:</span>
              <div className="flex items-center gap-3 pl-3">
                <button
                  type="button"
                  onClick={handleDecrement}
                  aria-label="Decrease quantity"
                  className="px-3 py-2 cursor-pointer border border-neutral-300 rounded hover:bg-neutral-100"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-base md:text-lg">{quantity}</span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  aria-label="Increase quantity"
                  className="px-3 py-2 border cursor-pointer border-neutral-300 rounded hover:bg-neutral-100"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {showValidationErrors && !selectedSize && (
              <p className="text-sm text-red-600 mt-2">Please select a size.</p>
            )}

            {/* Description */}
            <div className=" items-start gap-6">
              <span className="text-base md:text-lg font-semibold text-neutral-900 pt-2">Description:</span>
              <div
                className="text-md text-neutral-700 mt-[10px]"
                dangerouslySetInnerHTML={{
                  __html: safeSanitize(product.description ?? "No description available."),
                }}
              />
            </div>
          </div>

          {/* Accordions */}
          <div className="pt-8 1">
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
        </div>
      </aside>
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
