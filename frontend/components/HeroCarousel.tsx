"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from 'embla-carousel-react';

type Slide = {
  title: string;
  eyebrow?: string;
  copy: string;
  imageSrc?: string;
  imageAlt: string;
  reverse?: boolean;
};

const slides: Slide[] = [
  {
    eyebrow: "New Arrival • Spring '25",
    title: "Premium, luxury layers. Designed in Nepal, Worn worldwide.",
    copy: "Tailored silhouettes in soft-touch fabrics with mindful details. Crafted for comfort, built to last. Only built with the highest quality sustainable materials, inside our factory in Kathmandu.",
    imageSrc: "/babyimage.avif",
    imageAlt: "Premium apparel hero look",
  },
];

// simple product carousel data
type Product = {
  id: number;
  name: string;
  subtitle: string;
  price: string;
  image: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Baby Flannel Shirt",
    subtitle: "Soft Cotton, Cozy Fit",
    price: "RS 2,999",
    image: "https://www.kokroma.com/cdn/shop/files/kokroma_EasyLineHalf-SleeveShirtL001._1.webp?v=1751883667&width=800",
  },
  {
    id: 2,
    name: "Organic Cotton Onesie",
    subtitle: "Eco-Friendly, Gentle Fabric",
    price: "RS 1,999",
    image: "https://via.placeholder.com/100?text=Item+2",
  },
  {
    id: 3,
    name: "Frock for Baby Girls",
    subtitle: "Lightweight, Adorable Design",
    price: "RS 3,499",
    image: "https://via.placeholder.com/100?text=Item+3",
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const advance = () => setIndex((i) => (i + 1) % slides.length);
    timerRef.current = window.setInterval(advance, 5000);
    
    return () => { 
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const go = (i: number) => {
    setIndex(((i % slides.length) + slides.length) % slides.length);
  };

  const slide = slides[index];

  // embla instance for product overlay carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    loop: false,
    dragFree: true,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelectEmbla = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelectEmbla();
    emblaApi.on('select', onSelectEmbla);
    emblaApi.on('reInit', onSelectEmbla);
    return () => {
      emblaApi.off('select', onSelectEmbla);
      emblaApi.off('reInit', onSelectEmbla);
    };
  }, [emblaApi, onSelectEmbla]);

  const scrollPrevEmbla = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNextEmbla = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="relative overflow-hidden">
      {/* Luxe background aura */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(201,164,107,0.22)] via-[rgba(201,164,107,0.08)] to-transparent" />
        <div className="absolute -top-24 -left-24 h-[38rem] w-[38rem] rounded-full blur-[96px] bg-[color:var(--foreground)/0.08]" />
        <div className="absolute -bottom-24 -right-24 h-[36rem] w-[36rem] rounded-full blur-[96px] bg-[color:var(--soft)/0.08]" />
      </div>

      <div
        className="relative flex h-[90vh] flex-col min-h-[75vh] overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/images/brandkit3.png')" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 px-4 md:px-8 py-8 md:py-12 w-full">
          <div className="ml-8">
            {slide.eyebrow && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[color:var(--line-color)] bg-[color:var(--foreground)/0.06] text-[color:var(--soft)] text-sm page-load-fade-in">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--foreground)]" />
                {slide.eyebrow}
              </span>
            )}
            <h1 className="font-serif text-[color:var(--foreground)] text-4xl md:text-6xl leading-[1.05] tracking-[-0.03em] mt-4 mb-4 page-load-fade-in">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[color:var(--foreground)] to-purple-800">
                {slide.title}
              </span>
            </h1>
            <p className="text-[color:var(--soft)] text-lg md:text-xl max-w-[60ch] page-load-fade-in">
              {slide.copy}
            </p>
            <div className="mt-6 flex items-center gap-3 page-load-fade-in">
              <button
                onClick={() => go(index + 1)}
                className="px-5 py-2.5 hover:font-bold hover:scale-105 rounded-full bg-[color:var(--foreground)] text-[color:var(--background)] text-sm tracking-wide hover:opacity-95 transition-all"
              >
                Explore Collection
              </button>
              <button
                className="px-5 py-2.5 hover:font-bold hover:scale-105 rounded-full border border-[color:var(--line-color)] text-[color:var(--foreground)] text-sm tracking-wide hover:bg-[color:var(--foreground)/0.06] transition-all"
              >
                Sustainability
              </button>
            </div>
          </div>

        </div>
          {/* Frosted overlay chips and product card */}
          <div className="absolute inset-0 pointer-events-none">
            {/* left-side small chips near product */}
            <div className="absolute right-12 top-14 w-44 pointer-events-auto">
              <div className="backdrop-blur-sm  border border-white/20 rounded-xl p-3 shadow-md text-sm text-[color:var(--background)]">
                <div className="flex items-start gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-[color:var(--foreground)] mt-1" />
                  <div>
                    <div className="font-medium text-black">Massive Discounts</div>
                    <div className="text-xs text-[color:var(--soft)]">Ending : March 31st</div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="absolute left-1/2 top-24 w-44 pointer-events-auto">
              <div className="backdrop-blur-sm bg-white/16 border border-white/16 rounded-xl p-3 shadow-md text-sm text-[color:var(--background)]">
                <div className="flex items-start gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-[color:var(--foreground)] mt-1" />
                  <div>
                    <div className="font-medium text-black">Limited Stocks</div>
                    <div className="text-xs text-[color:var(--soft)]"> Selling Fast!</div>
                  </div>
                </div>
              </div>
            </div> */}

            {/* product carousel (embla) */}
            <div className="absolute left-16 bottom-16 rounded-2xl w-2xl pointer-events-auto">
              <div className="relative">
                <div className="overflow-hidden" ref={emblaRef}>
                  <div className="flex gap-4">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="backdrop-blur-md bg-white/12 border border-white/10 rounded-2xl h-36 text-[color:var(--background)] flex-shrink-0 p-4 w-2xl"
                      >
                        <div className="flex items-center pb-4 gap-3">
                          <div className="h-32 w-32 bg-[color:var(--background)]/5 rounded-lg flex items-center justify-center overflow-hidden">
                            <Image
                              src={p.image}
                              alt={p.name}
                              width={128}
                              height={128}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-lg text-black">
                              {p.name}
                            </div>
                            <div className="text-xs text-[color:var(--soft)]">
                              {p.subtitle}
                            </div>
                          </div>
                          <div className="flex flex-col items-end md:pr-8 gap-2">
                            <div className="font-medium text-black">
                              {p.price}
                            </div>
                            <button className="bg-[color:var(--background)]/95 text-[color:var(--foreground)] rounded-xl p-2 shadow-sm hover:scale-105 transition-transform">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 6h14"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* arrows */}
                <button
                  onClick={scrollPrevEmbla}
                  disabled={!canScrollPrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full backdrop-blur-sm disabled:opacity-40"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[color:var(--foreground)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={scrollNextEmbla}
                  disabled={!canScrollNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full backdrop-blur-sm disabled:opacity-40"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[color:var(--foreground)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        



        {/* Brand marquee for premium feel */}
        <div className="absolute bottom-0 left-1/3 py-8 flex items-center justify-center gap-8 opacity-70">
          <span className="text-sm tracking-[0.25em] text-[color:var(--soft)]">ORGANIC</span>
          <span className="text-sm tracking-[0.25em] text-[color:var(--soft)]">SUSTAINABLE</span>
          <span className="text-sm tracking-[0.25em] text-[color:var(--soft)]">HANDMADE</span>
          <span className="text-sm tracking-[0.25em] text-[color:var(--soft)]">ETHICAL</span>
        </div>
      </div>
    </section>
  );
}
