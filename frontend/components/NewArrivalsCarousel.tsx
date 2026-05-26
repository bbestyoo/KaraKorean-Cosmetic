"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  oldPrice: string;
  image: string;
  link: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Glow Ampoule",
    brand: "COSRX · 30ml",
    price: "Rs. 2,800",
    oldPrice: "Rs. 3,800",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop",
    link: "/skincare",
  },
  {
    id: 2,
    name: "Relief Sun",
    brand: "Beauty of Joseon · 50ml",
    price: "Rs. 2,900",
    oldPrice: "Rs. 3,900",
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=600&auto=format&fit=crop",
    link: "/skincare",
  },
  {
    id: 3,
    name: "Snail Mucin",
    brand: "COSRX · 100ml",
    price: "Rs. 3,200",
    oldPrice: "Rs. 4,200",
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop",
    link: "/skincare",
  },
  {
    id: 4,
    name: "Heartleaf Toner",
    brand: "Anua · 250ml",
    price: "Rs. 3,500",
    oldPrice: "Rs. 4,500",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop",
    link: "/skincare",
  },
];

export default function NewArrivalsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [fadeState, setFadeState] = useState<"in" | "out">("in");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
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
  }, [currentIndex, isPaused]);

  const handleNext = () => {
    setFadeState("out");
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
      setFadeState("in");
    }, 300);
  };

  const handlePrev = () => {
    setFadeState("out");
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
      setFadeState("in");
    }, 300);
  };

  const handleDotClick = (index: number) => {
    if (index === currentIndex) return;
    setFadeState("out");
    setTimeout(() => {
      setCurrentIndex(index);
      setFadeState("in");
    }, 300);
  };

  const currentProduct = products[currentIndex];

  return (
    <div
      className="flex flex-col lg:w-[520px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Featured product card */}
      <div className="bg-[#eeebd8]/70  flex flex-col md:flex-row gap-3 p-1 sm:gap-3 mb-4 rounded-lg shadow-sm border border-[#0f3b2b]/5 relative overflow-hidden transition-all duration-300 hover:shadow-md hover:bg-[#eeebd8]/90">

        {/* Product Image Container */}
        <div className=" sm:w-38 h-28 w-32 sm:h-64 bg-[#d4cfa8]/60 shrink-0 flex items-center justify-center overflow-hidden relative rounded-md">
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
            <p className="font-sans text-xs text-[#6b766f] tracking-widest mt-1 normal-case">
              {currentProduct.brand}
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
          <Link
            href={currentProduct.link}
            className="bg-[#0f3b2b] text-[#f7f6f2] text-[10px] sm:text-xs tracking-[0.2em] font-sans  p-1 px-2 sm:px-4 sm:py-2 hover:bg-[#1a5c42] transition-colors duration-300 self-start rounded-sm shadow-sm"
          >
            ADD TO BAG
          </Link>
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
