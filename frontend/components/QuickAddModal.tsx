'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, getDiscountPercentage } from '@/lib/pricing';
import type { ProductSizeLite } from '@/lib/cart';

export interface QuickAddProduct {
  product_id: string;
  name: string;
  price: number;
  old_price?: number | null;
  images: Array<{ image: string }>;
  sizes: ProductSizeLite[];
  category_name?: string;
}

interface QuickAddModalProps {
  product: QuickAddProduct | null;
  onClose: () => void;
}

export default function QuickAddModal({ product, onClose }: QuickAddModalProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const sizes = product?.sizes ?? [];

  // Auto-select the only size so single-size products can be added in one tap.
  useEffect(() => {
    if (!product) {
      setSelectedSize(null);
    } else if (product.sizes.length === 1) {
      setSelectedSize(product.sizes[0].name);
    } else {
      setSelectedSize(null);
    }
    setQuantity(1);
    setShowValidationErrors(false);
  }, [product]);

  // Close on Escape and lock background scroll while the modal is open.
  useEffect(() => {
    if (!product) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [product, onClose]);

  const selectedSizeObj = useMemo(
    () => (selectedSize ? sizes.find((s) => s.name === selectedSize) ?? null : null),
    [selectedSize, sizes]
  );

  const finalPrice = selectedSizeObj ? selectedSizeObj.price : product?.price ?? 0;
  const discountPercentage = getDiscountPercentage(finalPrice, product?.old_price);
  const selectedStock = selectedSizeObj ? selectedSizeObj.stock : 0;
  const selectedOutOfStock = Boolean(selectedSizeObj) && selectedStock <= 0;

  if (!product) return null;

  const image = product.images?.[0]?.image || '/images/placeholder.png';

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      setShowValidationErrors(true);
      return;
    }

    addItem({
      product_id: product.product_id,
      name: product.name,
      price: finalPrice,
      size: selectedSize || '',
      quantity,
      image,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} quick view`}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 shadow-sm text-neutral-700 hover:text-black hover:scale-105 transition-all"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Image preview */}
          <div className="relative aspect-square sm:aspect-auto sm:min-h-[420px] bg-[#f2f2f2]">
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            {discountPercentage > 0 && (
              <div className="absolute top-3 left-3 bg-[#0f3b2b] text-white text-[9px] uppercase tracking-widest px-2 py-1">
                {discountPercentage}% Off
              </div>
            )}
          </div>

          {/* Details / options */}
          <div className="p-6 sm:p-8 flex flex-col gap-6">
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-light tracking-wide text-neutral-900 leading-snug">
                {product.name}
              </h2>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                {discountPercentage > 0 && product.old_price ? (
                  <span className="text-base text-[#ec7cfd] line-through">
                    {formatPrice(product.old_price)}
                  </span>
                ) : null}
                <span className="text-xl sm:text-2xl font-medium text-neutral-800">
                  {formatPrice(finalPrice)}
                </span>
                {discountPercentage > 0 && (
                  <span className="text-[10px] font-semibold tracking-widest text-[#0f3b2b] bg-[#E9F3A4] px-1.5 py-0.5">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Size selector */}
            {sizes.length > 0 && (
              <div className="space-y-3">
                <span className="text-sm font-semibold tracking-wide text-neutral-900">
                  Select a size
                </span>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const disabled = size.stock <= 0;
                    const selected = selectedSize === size.name;
                    return (
                      <button
                        key={size.id ?? size.name}
                        type="button"
                        onClick={() => {
                          if (disabled) return;
                          setSelectedSize(size.name);
                          setShowValidationErrors(false);
                          setQuantity(1);
                        }}
                        disabled={disabled}
                        aria-pressed={selected}
                        className={`px-3 py-2 text-sm font-medium border rounded-md transition-colors ${
                          selected
                            ? 'bg-[#0f3b2b] text-white border-[#0f3b2b]'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {size.name}
                        {disabled ? ' — out of stock' : ''}
                      </button>
                    );
                  })}
                </div>
                {showValidationErrors && !selectedSize && (
                  <p className="text-sm text-red-600">Please select a size.</p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <span className="text-sm font-semibold tracking-wide text-neutral-900">
                Quantity
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="p-2 border border-neutral-300 rounded hover:bg-neutral-100 cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-base">{quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) =>
                      selectedStock > 0 ? Math.min(selectedStock, q + 1) : q
                    )
                  }
                  aria-label="Increase quantity"
                  disabled={!selectedSizeObj || selectedStock <= 0}
                  className="p-2 border border-neutral-300 rounded hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <Plus size={14} />
                </button>
              </div>
              {selectedSizeObj && selectedOutOfStock && (
                <p className="text-sm text-red-600">
                  Size {selectedSize} is out of stock.
                </p>
              )}
            </div>

            <div className="mt-auto space-y-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={selectedOutOfStock}
                className={`w-full border py-3.5 text-sm font-semibold tracking-widest uppercase rounded-md transition-all duration-300 ${
                  selectedOutOfStock
                    ? 'cursor-not-allowed bg-neutral-200 text-neutral-400 border-neutral-200'
                    : 'cursor-pointer bg-[#0f3b2b] text-white border-[#0f3b2b] hover:bg-transparent hover:text-[#0f3b2b]'
                }`}
              >
                {selectedOutOfStock ? 'Out of stock' : 'Add to cart'}
              </button>
              <Link
                href={`/products/${product.product_id}`}
                className="block text-center text-[11px] uppercase tracking-widest text-neutral-500 underline hover:text-neutral-900"
              >
                View full details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
