'use client';

import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { PremiumProductCard } from './PremiumProductCard';

interface Product {
  product_id: string;
  name: string;
  price: number;
  old_price?: number;
  category_name: string;
  images: Array<{ image: string }>;
}

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  products: Product[];
  categorySlug: string; // e.g., "Mothers" or "Newborns"
  darkBackground?: boolean;
}

export default function ProductCarousel({ 
  title, 
  subtitle, 
  products, 
  categorySlug,
  darkBackground = false 
}: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    loop: false,
    skipSnaps: false,
    dragFree: true
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
        emblaApi.off('select', onSelect);
        emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!products || products.length === 0) return null;

  return (
    <section className={`py-16 md:py-24 ${darkBackground ? 'bg-neutral-50' : 'bg-white'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-playfair text-3xl md:text-5xl text-neutral-900 mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-neutral-500 text-lg font-light leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-4">
             <Link 
                href={`/shop?category=${categorySlug}`}
                className="hidden md:flex items-center text-sm font-semibold uppercase tracking-widest text-neutral-900 hover:text-neutral-600 transition-colors group"
             >
                View All 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
             </Link>
             
             {/* Desktop Controls */}
             <div className="hidden md:flex items-center gap-2 ml-4">
                <button
                    onClick={scrollPrev}
                    disabled={!canScrollPrev}
                    className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-400 cursor-pointer disabled:cursor-not-allowed"
                >
                    <ChevronLeft size={18} />
                </button>
                <button
                    onClick={scrollNext}
                    disabled={!canScrollNext}
                    className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-400 cursor-pointer disabled:cursor-not-allowed"
                >
                    <ChevronRight size={18} />
                </button>
             </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative" ref={emblaRef}>
            <div className="flex gap-4 md:gap-8">
                {products.map((product) => (
                    <div 
                        key={product.product_id} 
                        className="flex-[0_0_80%] sm:flex-[0_0_45%] lg:flex-[0_0_28%] xl:flex-[0_0_22%] min-w-0"
                    >
                        <PremiumProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>

        {/* Mobile View All */}
        <div className="mt-8 md:hidden flex justify-center">
            <Link 
                href={`/shop?category=${categorySlug}`}
                className="inline-flex items-center text-sm font-semibold uppercase tracking-widest text-neutral-900"
             >
                View All <ArrowRight className="ml-2 h-4 w-4" />
             </Link>
        </div>

      </div>
    </section>
  );
}
