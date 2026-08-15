"use client";
import Image from "next/image";
import Link from "next/link";
import { RevealOnScroll } from "./RevealOnScroll";

export default function SpringCollection() {
  const toCategory = (s?: string) => (s ? s.split(/\s+/).join("-").toLowerCase() : "");
  return (
    <section className="w-full bg-[#f4f4f4] py-10 md:py-24 px-4 md:px-12 overflow-hidden">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-12 min-h-0 md:min-h-[80vh]">

          {/* Left Column - Person Image */}
          <RevealOnScroll direction="right" delay={100} className="relative h-[45vw] md:h-full w-full overflow-hidden group">
            <Link
              href={(() => {
                const category = toCategory("Sunscreen");
                return `/products${category ? `?category=${encodeURIComponent(category)}` : ""}`;
              })()}
              className="group relative h-full w-full block overflow-hidden"
            >
              <div className="absolute inset-0">
                <Image
                  src="/images/boj-sunscreen.webp" // Black and white fashion portrait
                  alt="BOJ Sunscreen"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-80 cursor-pointer "
                />
              </div>
            </Link>
          </RevealOnScroll>

          {/* Middle Column - Text Content */}
          <RevealOnScroll direction="up" delay={300} className="flex flex-col items-center justify-center text-center px-4 md:px-8 py-8 md:py-0">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1a1a1a] mb-4 md:mb-6 uppercase">
              Spring<br />Collection
            </h2>
            <p className="text-sm md:text-base text-neutral-500 mb-6 md:mb-10 max-w-sm mx-auto leading-relaxed">
            Will be auto hidden after collections are added.
              Body text content goes here. This is where the main content will be displayed.
            </p>
            <Link
              href={(() => {
                const category = toCategory("Spring Collection");
                return `/products${category ? `?category=${encodeURIComponent(category)}` : ""}`;
              })()}
              className="border border-[#1a1a1a] text-[#1a1a1a] px-10 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#0f3b2b] hover:text-white transition-colors duration-300 inline-block text-center"
            >
              Shop Now
            </Link>
          </RevealOnScroll>

          {/* Right Column - Shoes Image */}
          <RevealOnScroll direction="left" delay={500} className="relative h-[45vw] md:h-full w-full overflow-hidden group bg-white flex items-center justify-center">
            <div className="absolute inset-0">
              <Link
                href={(() => {
                  const category = toCategory("Serum");
                  return `/products${category ? `?category=${encodeURIComponent(category)}` : ""}`;
                })()}
                className="group relative h-full w-full block overflow-hidden"
              >
                <Image
                  src="/images/anua-serum.webp" // Sneakers stacked
                  alt="Anua Serum"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-80 cursor-pointer"
                />
              </Link>
            </div>
          </RevealOnScroll>

        </div>
      </div>
    </section>
  );
}
