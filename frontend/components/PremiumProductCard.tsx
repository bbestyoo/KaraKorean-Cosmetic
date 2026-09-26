'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { formatPrice, getDiscountPercentage } from '@/lib/pricing';
import { hasSizes, type ProductSizeLite } from '@/lib/cart';

interface PremiumProductCardProps {
  product: {
    product_id: string;
    name: string;
    price: number;
    old_price?: number;
    category_name: string;
    in_stock?: boolean;
    sizes?: ProductSizeLite[];
    images: Array<{ image: string }>;
  };
  variant?: 'default' | 'minimal';
}

export function PremiumProductCard({ product }: PremiumProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addItem } = useCart();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = isInWishlist(product.product_id);

  const discount = getDiscountPercentage(product.price, product.old_price);

  const mainImage = product.images?.[0]?.image || '/placeholder.png';
  const secondImage = product.images?.[1]?.image || mainImage;
  const isInStock = product.in_stock !== false;

  return (
    <Link href={`/products/${product.product_id}`} className="block group">
      <div
        className="relative aspect-square bg-gray-100 overflow-hidden mb-3 transition-transform duration-500 ease-out"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Images */}
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className={`object-contain transition-opacity duration-700 ease-in-out ${isHovered ? 'opacity-0' : 'opacity-100'}`}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        <Image
          src={secondImage}
          alt={product.name}
          fill
          className={`object-contain transition-all duration-700 ease-out transform ${isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />

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
                old_price: product.old_price,
                image: mainImage,
                category_name: product.category_name,
                in_stock: isInStock,
                has_sizes: hasSizes(product.sizes),
              });
            }}
            className="p-2 rounded-full bg-white/90 shadow-sm hover:scale-105 transition-all text-neutral-900"
          >
            <Heart
              size={16}
              className={isWishlisted ? 'fill-[#c9a46b] text-[#c9a46b]' : 'text-neutral-900'}
            />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isInStock) return;
              // Sized products need a size chosen on the detail page.
              if (hasSizes(product.sizes)) {
                router.push(`/products/${product.product_id}`);
                return;
              }
              addItem({
                product_id: product.product_id,
                name: product.name,
                price: product.price,
                size: '',
                quantity: 1,
                image: mainImage,
              });
            }}
            disabled={!isInStock}
            aria-disabled={!isInStock}
            aria-label={!isInStock ? 'Out of stock' : hasSizes(product.sizes) ? 'Select size' : 'Add to cart'}
            title={!isInStock ? 'Out of stock' : hasSizes(product.sizes) ? 'Select a size' : 'Add to cart'}
            className={`p-2 rounded-full bg-white/90 shadow-sm hover:scale-105 transition-all text-neutral-900 ${isInStock ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'}`}
          >
            <ShoppingBag
              size={16}
              className="text-neutral-900 hover:text-[#c9a46b] transition-colors"
            />
          </button>
        </div>

        {/* Badges - Minimal */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 text-[10px] uppercase tracking-wider font-medium text-neutral-900">
            -{discount}%
          </div>
        )}

        {/* Quick Add Overlay */}
        <div className={`absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/40 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button className="w-full py-3 bg-white text-black text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-black hover:text-white transition-colors">
            Quick View
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="text-center group-hover:opacity-80 transition-opacity duration-300">
        <h3 className="font-serif text-lg text-neutral-900 leading-snug mb-1">
          {product.name}
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs tracking-widest uppercase">
          {discount > 0 && (
            <span className="text-neutral-400 line-through">
              {formatPrice(product.old_price)}
            </span>
          )}
          <span className="font-medium text-neutral-900">
            {formatPrice(product.price)}
          </span>
          {discount > 0 && (
            <span className="font-semibold text-[#0f3b2b] bg-[#E9F3A4] px-1.5 py-0.5 normal-case">
              {discount}% OFF
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
