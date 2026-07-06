"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BannerSlide {
  id: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: { label: string; href: string };
  image: string;
  imageAlt: string;
  accentColor: string;
}

const slides: BannerSlide[] = [
  {
    id: 1,
    eyebrow: "✦ NEW SEASON",
    title: "Glow From\nWithin",
    subtitle: "Discover K-beauty rituals curated for your skin",
    cta: { label: "Shop Now", href: "/products" },
    image: "/images/karaimages/kara.webp",
    imageAlt: "K-beauty makeup model",
    accentColor: "#c8a97e",
  },
  {
    id: 2,
    eyebrow: "✦ TRENDING",
    title: "Skin First,\nAlways",
    subtitle: "Authentic Korean skincare, delivered to your door",
    cta: { label: "Explore", href: "/products" },
    image: "/images/karaimages/image1.avif",
    imageAlt: "Korean skincare collection",
    accentColor: "#a8c4a2",
  },
  {
    id: 3,
    eyebrow: "✦ BEST SELLERS",
    title: "Pure Care,\nRadiant Results",
    subtitle: "Science-backed formulas for luminous, healthy skin",
    cta: { label: "Discover", href: "/products" },
    image: "/images/karaimages/image3.webp",
    imageAlt: "K-beauty product collection",
    accentColor: "#d4a8b0",
  },
  {
    id: 4,
    eyebrow: "✦ NEW ARRIVALS",
    title: "Sun Protection\nReinvented",
    subtitle: "Premium SPF formulas that feel like skincare",
    cta: { label: "View Collection", href: "/products" },
    image: "/images/karaimages/sunscreen.webp",
    imageAlt: "Sunscreen collection",
    accentColor: "#c8d4a0",
  },
];

export default function HeroBannerCarousel() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent(((index % slides.length) + slides.length) % slides.length);
        setIsTransitioning(false);
      }, 400);
    },
    [isTransitioning]
  );

  const goNext = useCallback(() => {
    goTo(current + 1);
  }, [current, goTo]);

  const goPrev = useCallback(() => {
    goTo(current - 1);
  }, [current, goTo]);

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(goNext, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, goNext]);

  const slide = slides[current];

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Hero banner carousel"
    >
      {/* Background image with parallax-like effect */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={s.image}
            alt={s.imageAlt}
            fill
            priority={i === 0}
            className="object-contain object-center"
            sizes="(max-width: 768px) 100vw, 70vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f3b2b]/70 via-[#0f3b2b]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1f18]/50 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10 z-10"
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? "translateY(10px)" : "translateY(0)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        {/* Eyebrow */}
        <span className="inline-flex items-center gap-2 border border-white/30 text-white/80 text-[0.55rem] sm:text-[0.65rem] tracking-[0.3em] font-sans px-3 py-1.5 w-fit rounded-full mb-3 backdrop-blur-sm bg-white/5">
          {slide.eyebrow}
        </span>

        {/* Title */}
        <h2 className="font-symphony lowercase text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-3 drop-shadow-md whitespace-pre-line">
          {slide.title}
        </h2>

        {/* Subtitle */}
        <p className="font-sans text-white/70 text-xs sm:text-sm tracking-wide normal-case max-w-[40ch] mb-6">
          {slide.subtitle}
        </p>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link
            href={slide.cta.href}
            className="inline-block bg-white text-[#0f3b2b] font-sans text-[0.6rem] sm:text-xs tracking-[0.3em] uppercase font-semibold px-6 py-3 hover:bg-[#f7f6f2] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 rounded-sm"
          >
            {slide.cta.label}
          </Link>
          {/* Slide counter */}
          <span className="font-sans text-white/50 text-[0.6rem] tracking-[0.2em]">
            {String(current + 1).padStart(2, "0")} /{" "}
            {String(slides.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 md:bottom-10 md:right-10 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${i === current
              ? "bg-white w-6"
              : "bg-white/30 w-1.5 hover:bg-white/60"
              }`}
          />
        ))}
      </div>

      {/* Arrow navigation */}
      <button
        onClick={goPrev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 cursor-pointer group"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={goNext}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 cursor-pointer group"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/10 z-20">
        <div
          className="h-full bg-white/60 transition-all duration-300"
          style={{ width: `${((current + 1) / slides.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
