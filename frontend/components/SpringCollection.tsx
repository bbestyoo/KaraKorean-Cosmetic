"use client";
import Image from "next/image";
import { RevealOnScroll } from "./RevealOnScroll";

export default function SpringCollection() {
  return (
    <section className="w-full bg-[#f4f4f4] py-10 md:py-24 px-4 md:px-12 overflow-hidden">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-12 min-h-0 md:min-h-[80vh]">

          {/* Left Column - Person Image */}
          <RevealOnScroll direction="right" delay={100} className="relative h-[45vw] md:h-full w-full overflow-hidden group">
            <Image
              src="images/karaimages/bojproduct.png" // Black and white fashion portrait
              alt="Spring Collection Model"
              fill
              unoptimized
              className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-80 cursor-pointer "
            />
          </RevealOnScroll>

          {/* Middle Column - Text Content */}
          <RevealOnScroll direction="up" delay={300} className="flex flex-col items-center justify-center text-center px-4 md:px-8 py-8 md:py-0">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1a1a1a] mb-4 md:mb-6 uppercase">
              Spring<br />Collection
            </h2>
            <p className="text-sm md:text-base text-neutral-500 mb-6 md:mb-10 max-w-sm mx-auto leading-relaxed">
              Body text content goes here. This is where the main content will be displayed.
            </p>
            <button className="border border-[#1a1a1a] text-[#1a1a1a] px-10 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#1a1a1a] hover:text-white transition-colors duration-300">
              Shop Now
            </button>
          </RevealOnScroll>

          {/* Right Column - Shoes Image */}
          <RevealOnScroll direction="left" delay={500} className="relative h-[45vw] md:h-full w-full overflow-hidden group bg-white flex items-center justify-center">
            <div className="absolute inset-0">
              <Image
                src="images/karaimages/bojmodel.png" // Sneakers stacked
                alt="Spring Collection Sneakers"
                fill
                unoptimized
                className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-80 cursor-pointer"
              />
            </div>
          </RevealOnScroll>

        </div>
      </div>
    </section>
  );
}
