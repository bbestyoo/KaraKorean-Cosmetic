"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProductAPI } from "@/hooks/useProductAPI";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: string;
  oldPrice?: string;
  image: string;
  link?: string;
}

interface NewArrivalsCarouselProps {
  compact?: boolean;
}

export default function NewArrivalsCarousel({ compact = false }: NewArrivalsCarouselProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [fadeState, setFadeState] = useState<"in" | "out">("in");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { getProducts, loading, error } = useProductAPI();
  const [products, setProducts] = useState<Product[]>([]);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!products || products.length <= 1) return;
    timerRef.current = setInterval(() => {
      handleNext();
    }, 4000);
  };

  useEffect(() => {
    if (!isPaused) {
      startTimer();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, products.length]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getProducts(1, { trending: true, page_size: 6 });
        const items = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
        if (!mounted) return;
        const mapped = items.map((item: any, index: number) => {
          const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
          const API_ORIGIN = API_BASE_URL ? API_BASE_URL.replace(/\/shop\/?$/, '') : '';
          const resolveImageUrl = (image?: string | null) => {
            if (!image) return '/images/placeholder.png';
            if (image.startsWith('http://') || image.startsWith('https://')) return image;
            const normalizedPath = image.startsWith('/') ? image : `/${image}`;
            return new URL(normalizedPath, API_ORIGIN).toString();
          };

          const images = Array.isArray(item.images)
            ? item.images
            : item.images
              ? [item.images]
              : item.image
                ? [item.image]
                : [];

          const image = images.length ? resolveImageUrl(images[0].image ?? images[0]) : '/images/placeholder.png';

          return {
            id: item.product_id ?? String(item.id ?? item.pk ?? index),
            name: item.name ?? item.title ?? item.product_name ?? 'Product',
            brand: item.brand ?? item.brand_name ?? item.category_name ?? '',
            price: `Rs. ${Number(item.price ?? 0).toLocaleString()}`,
            oldPrice: item.old_price !== undefined ? `Rs. ${Number(item.old_price).toLocaleString()}` : undefined,
            image,
            link: `/products/${item.product_id ?? item.id ?? ''}`,
          } as Product;
        });
        setProducts(mapped);
        setCurrentIndex(0);
      } catch (err) {
        console.error('Failed to load new arrivals', err);
        if (mounted) setProducts([]);
      }
    })();
    return () => { mounted = false; };
  }, [getProducts]);

  const handleNext = () => {
    if (!products || products.length <= 1) return;
    setFadeState("out");
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
      setFadeState("in");
    }, 300);
  };

  const handlePrev = () => {
    if (!products || products.length <= 1) return;
    setFadeState("out");
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
      setFadeState("in");
    }, 300);
  };

  const handleDotClick = (index: number) => {
    if (!products || products.length <= 1) return;
    if (index === currentIndex) return;
    setFadeState("out");
    setTimeout(() => {
      setCurrentIndex(index);
      setFadeState("in");
    }, 300);
  };

  const currentProduct = products[currentIndex] ?? products[0];

  const { addItem } = useCart();

  const parsePrice = (priceStr: string) => {
    const digits = priceStr.replace(/[^\d.]/g, '');
    return Number(digits) || 0;
  };

  const handleAddToBag = (product: Product) => {
    addItem({
      product_id: String(product.id),
      name: product.name,
      price: parsePrice(product.price),
      size: 'One Size',
      quantity: 1,
      image: product.image,
    });
  };

  const loadingClass = compact ? "flex flex-col w-full h-full items-center justify-center" : "flex flex-col lg:w-[480px] items-center justify-center p-4";

  if (products.length === 0) {
    if (loading) {
      return (
        <div className={loadingClass}>
          <div className="text-sm text-neutral-500">Loading new arrivals…</div>
        </div>
      );
    }
    if (error) {
      return (
        <div className={loadingClass}>
          <div className="text-sm text-red-500">Failed to load new arrivals</div>
        </div>
      );
    }
    return (
      <div className={loadingClass}>
        <div className="text-sm text-neutral-500">No new arrivals</div>
      </div>
    );
  }

  if (compact) {
    // ── COMPACT MODE (right hero panel) ──
    return (
      <div
        className="flex flex-col w-full h-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Compact product card */}
        <div
          onClick={() => router.push(`/products/${currentProduct.id}`)}
          className="bg-[#eeebd8]/60 flex flex-row gap-2 p-2 rounded-lg border border-[#0f3b2b]/5 relative overflow-hidden transition-all duration-300 hover:shadow-sm hover:bg-[#eeebd8]/80 cursor-pointer flex-1 min-h-0"
        >
          {/* Image */}
          <div className="w-16 shrink-0 bg-[#d4cfa8]/50 flex items-center justify-center overflow-hidden relative rounded-md">
            <Image
              src={currentProduct.image}
              alt={currentProduct.name}
              fill
              sizes="64px"
              className={`object-cover transition-opacity duration-300 ${fadeState === "in" ? "opacity-100" : "opacity-0"}`}
              priority
            />
          </div>

          {/* Details */}
          <div
            className={`flex flex-col justify-between py-0.5 flex-1 transition-opacity duration-300 ${fadeState === "in" ? "opacity-100" : "opacity-0"}`}
          >
            <p className="font-serif italic text-[#0f3b2b] text-xs leading-tight line-clamp-2">
              {currentProduct.name}
            </p>
            <p className="font-sans text-[#0f3b2b] text-[0.6rem] font-semibold normal-case">
              {currentProduct.price}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToBag(currentProduct);
              }}
              className="bg-[#0f3b2b] cursor-pointer text-[#f7f6f2] text-[0.5rem] tracking-[0.15em] font-sans px-2 py-1 hover:bg-[#1a5c42] transition-colors duration-300 self-start rounded-sm"
              aria-label={`Add ${currentProduct.name} to bag`}
            >
              ADD TO BAG
            </button>
          </div>
        </div>

        {/* Compact controls */}
        <div className="flex items-center justify-between pt-2 px-1">
          <div className="flex gap-1.5">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === index ? "bg-[#0f3b2b] w-4" : "bg-[#0f3b2b]/20 hover:bg-[#0f3b2b]/40 w-1"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={handlePrev}
              className="p-1 border border-[#0f3b2b]/20 rounded-full text-[#0f3b2b] hover:bg-[#0f3b2b] hover:text-[#f7f6f2] transition-all duration-300 cursor-pointer"
              aria-label="Previous product"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button
              onClick={handleNext}
              className="p-1 border border-[#0f3b2b]/20 rounded-full text-[#0f3b2b] hover:bg-[#0f3b2b] hover:text-[#f7f6f2] transition-all duration-300 cursor-pointer"
              aria-label="Next product"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── DEFAULT (full size) MODE ──
  return (
    <div
      className="flex flex-col lg:w-[480px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Featured product card */}
      <div 
        onClick={() => router.push(`/products/${currentProduct.id}`)}
        className="bg-[#eeebd8]/70  flex flex-col md:flex-row  gap-3 p-1 sm:gap-10 mb-4 rounded-lg shadow-sm border border-[#0f3b2b]/5 relative overflow-hidden transition-all duration-300 hover:shadow-md hover:bg-[#eeebd8]/90 cursor-pointer"
      >

        {/* Product Image Container */}
        <div className=" sm:w-38 md:w-42 h-28 w-32 sm:h-64 bg-[#d4cfa8]/60 shrink-0 flex items-center justify-center overflow-hidden relative rounded-md">
          <Image
            src={currentProduct.image}
            alt={currentProduct.name}
            fill
            sizes="(max-width: 768px) 192px, 192px"
            className={`object-cover transition-opacity duration-300 ${fadeState === "in" ? "opacity-100" : "opacity-0"
              }`}
            priority
          />
        </div>

        {/* Product Details */}
        <div
          className={`flex flex-col gap-3 sm:gap-0 justify-between py-1 flex-1 transition-opacity duration-300 ${fadeState === "in" ? "opacity-100" : "opacity-0"
            }`}
        >
          <div>
            <p className="font-serif italic text-[#0f3b2b] text-sm sm:text-2xl leading-tight">
              {currentProduct.name}
            </p>
          </div>
          <div>
            <p className="font-sans text-[#0f3b2b] text-xs sm:text-lg font-semibold normal-case">
              {currentProduct.price}
            </p>
            <p className="hidden md:block font-sans line-through text-[#0f3b2b]/60 text-sm normal-case mt-0.5">
              {currentProduct.oldPrice}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToBag(currentProduct);
            }}
            className="bg-[#0f3b2b] cursor-pointer text-[#f7f6f2] text-[10px] sm:text-xs tracking-[0.2em] font-sans  p-1 px-2 sm:px-4 sm:py-2 hover:bg-[#1a5c42] transition-colors duration-300 self-start rounded-sm shadow-sm curosr-pointer"
            aria-label={`Add ${currentProduct.name} to bag`}
          >
            ADD TO BAG
          </button>
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="flex items-center justify-between px-2">
        {/* Navigation Dots */}
        <div className="flex gap-2">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === index ? "bg-[#0f3b2b] w-5" : "bg-[#0f3b2b]/20 hover:bg-[#0f3b2b]/40 w-1.5"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Arrow Navigation */}
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            className="p-1.5 border border-[#0f3b2b]/20 rounded-full text-[#0f3b2b] hover:bg-[#0f3b2b] hover:text-[#f7f6f2] hover:border-[#0f3b2b] transition-all duration-300 cursor-pointer"
            aria-label="Previous product"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 border border-[#0f3b2b]/20 rounded-full text-[#0f3b2b] hover:bg-[#0f3b2b] hover:text-[#f7f6f2] hover:border-[#0f3b2b] transition-all duration-300 cursor-pointer"
            aria-label="Next product"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
