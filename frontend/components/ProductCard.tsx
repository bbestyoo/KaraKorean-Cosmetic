'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: {
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
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addItem } = useCart();
  const [showSecondaryImage, setShowSecondaryImage] = useState(false);

  const isWishlisted = isInWishlist(product.product_id);

  const discount = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

  const avgRating = product.ratings?.stats?.avg_rating || 0;
  const totalRatings = product.ratings?.stats?.total_ratings || 0;

  const mainImage = product.images?.[0]?.image || '/placeholder.png';

  return (
    <Link href={`/products/${product.product_id}`}>
      <div
        className="group cursor-pointer"
        onMouseEnter={() => setShowSecondaryImage(true)}
        onMouseLeave={() => setShowSecondaryImage(false)}
      >
        <div className="relative aspect-square bg-gray-100 rounded mb-6 overflow-hidden">
          {product.images && product.images.length > 0 && (
            <Image
              src={showSecondaryImage && product.images.length > 1 ? product.images[1].image : product.images[0].image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-all duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}

          {discount > 0 && (
            <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 text-xs font-semibold">
              -{discount}%
            </div>
          )}

          {/* Actions Overlay */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                });
              }}
              className="p-2 rounded-full bg-white shadow-sm hover:scale-105 transition-all text-neutral-900"
            >
              <Heart
                size={18}
                className={isWishlisted ? 'fill-[#c9a46b] text-[#c9a46b]' : 'text-neutral-900'}
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
                  image: mainImage,
                });
              }}
              className="p-2 rounded-full bg-white shadow-sm hover:scale-105 transition-all text-neutral-900"
            >
              <ShoppingBag
                size={18}
                className="text-neutral-900 hover:text-[#c9a46b] transition-colors"
              />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-medium">
              {product.category_name}
            </p>
            <h3 className="text-base font-light text-gray-900 group-hover:text-black transition-colors line-clamp-2">
              {product.name}
            </h3>
          </div>

          {totalRatings > 0 && (
            <div className="flex items-center gap-2 pt-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={
                      i < Math.round(avgRating)
                        ? 'fill-gray-900 text-gray-900'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">({totalRatings})</span>
            </div>
          )}

          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-base font-light text-gray-900">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.old_price && (
              <span className="text-xs text-gray-500 line-through">
                {product.old_price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
