'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface PremiumProductCardProps {
  product: {
    product_id: string;
    name: string;
    price: number;
    old_price?: number;
    category_name: string;
    images: Array<{ image: string }>;
  };
  variant?: 'default' | 'minimal';
}

export function PremiumProductCard({ product }: PremiumProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const discount = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

  const mainImage = product.images?.[0]?.image || '/placeholder.png';
  const secondImage = product.images?.[1]?.image || mainImage;

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
          className={`object-contain transition-all duration-700 ease-out transform ${
            isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
          }`}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />

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
        <div className="flex items-center justify-center gap-3 text-xs tracking-widest uppercase">
          <span className="font-medium text-neutral-900">
            Rs. {product.price.toLocaleString()}
          </span>
          {product.old_price && (
            <span className="text-neutral-400 line-through">
              {product.old_price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
