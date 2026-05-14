'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { PremiumProductCard } from './PremiumProductCard';

interface Product {
  product_id: string;
  name: string;
  price: number;
  old_price?: number;
  category_name: string;
  images: Array<{ image: string }>;
}

interface EditorialProductSectionProps {
  title: string;
  subtitle: string;
  description?: string;
  products: Product[];
  categorySlug: string;
  featuredImage: string;
  imagePosition?: 'left' | 'right';
  theme?: 'light' | 'warm';
}

export default function EditorialProductSection({
  title,
  subtitle,
  description,
  products,
  categorySlug,
  featuredImage,
  imagePosition = 'left',
  theme = 'light'
}: EditorialProductSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps',
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

  const bgColor = theme === 'warm' ? 'bg-teal-50' : 'bg-red-50';


  return (
    <section className={`py-26 pl-8 ${bgColor} overflow-hidden`}>
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col lg:flex-row gap-12 lg:gap-20 ${imagePosition === 'right' ? 'lg:flex-row-reverse' : ''}`}>
          
          {/* Editorial Image Side */}
          <div className="lg:w-[40%] flex flex-col justify-between">
            <div className="">
              <span className="block text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 mb-4">
                Collection
              </span>
              <h2 className="font-playfair text-5xl md:text-6xl lg:text-7xl leading-[0.9] text-neutral-900 mb-6">
                {title}
              </h2>
              <p className="text-lg md:text-xl text-neutral-600 font-light leading-relaxed max-w-md italic font-serif">
                {subtitle}
              </p>
              {description && (
                <p className="mt-4 text-sm text-neutral-500 leading-relaxed max-w-md">
                  {description}
                </p>
              )}
              
              <div className="mt-8 flex items-center gap-4">
                 <Link 
                  href={`/shop?category=${categorySlug}`}
                  className="inline-flex items-center text-xs font-bold uppercase tracking-[0.15em] border-b border-neutral-900 pb-1 hover:text-neutral-600 hover:border-neutral-400 transition-colors"
                >
                  View All Products
                </Link>
                
                {/* Controls */}
                <div className="flex gap-2 ml-auto lg:ml-8">
                  <button 
                    onClick={scrollPrev}
                    disabled={!canScrollPrev}
                    className="p-3 border border-neutral-200 rounded-full hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={scrollNext}
                    disabled={!canScrollNext}
                    className="p-3 border border-neutral-200 rounded-full hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* <div className="relative aspect-[3/4] w-full overflow-hidden hidden lg:block">
               <Image
                 src={featuredImage}
                 alt={title}
                 fill
                 className="object-cover"
                 sizes="(max-width: 1024px) 100vw, 40vw"
               />
               <div className="absolute inset-0 bg-black/5" />
            </div> */}
          </div>

          {/* Product Carousel Side */}
          <div className="relative">
             {/* Mobile Image (Visible only on mobile/tablet) */}
             <div className="relative aspect-[12/9] w-full overflow-hidden mb-8 lg:hidden rounded-sm">
               <Image
                 src={featuredImage}
                 alt={title}
                 fill
                 className="object-cover"
                 sizes="100vw"
               />
             </div>

             <div className="overflow-hidden" ref={emblaRef}>
               <div className="flex gap-4 ">
                  {products.map((product) => (
                    <div 
                      key={product.product_id}
                      className="flex-[0_0_75%] sm:flex-[0_0_45%] "
                    >
                      <PremiumProductCard product={product} />
                    </div>
                  ))}
               </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
