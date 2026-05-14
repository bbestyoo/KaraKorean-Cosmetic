"use client";
import Image from "next/image";
import { RevealOnScroll } from "./RevealOnScroll";

export default function NewnessSection() {
  return (
    <section className="relative w-full bg-white py-24 overflow-hidden min-h-[120vh]">
      {/* Top Tagline */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full text-center z-10 px-4">
        <RevealOnScroll direction="down" delay={100}>
          <p className="text-sm md:text-base text-neutral-500 font-sans tracking-tight">
            ALWAYS BE ON TOP WITH OUR COSMETICS
          </p>
        </RevealOnScroll>
      </div>

      {/* Typography layer */}
      <div className="absolute top-32 left-0 w-full px-4 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center pointer-events-none z-0">
        <RevealOnScroll direction="left" delay={200} className="w-full">
          <h2 className="text-[12vw] md:text-[8vw] font-bold leading-none tracking-tighter text-[#0f3b2b] uppercase">
            NEWNESS
          </h2>
        </RevealOnScroll>

        <RevealOnScroll direction="right" delay={300} className="w-full text-right mt-10 md:mt-0 flex flex-col items-end">
          <h2 className="text-[12vw] md:text-[8vw] font-bold leading-none tracking-tighter text-[#0f3b2b] uppercase relative">
            DESIRE SERIES
          </h2>
          <p className="text-sm md:text-base text-neutral-500 font-sans max-w-[200px] text-right mt-2 mr-2 leading-snug">
            12 cosmetics for your beauty
          </p>
        </RevealOnScroll>
      </div>

      {/* Images Grid Layer */}
      <div className="relative w-full h-full max-w-[1400px] mx-auto mt-72 px-4 md:px-12 z-10">
        <div className="grid grid-cols-12 grid-rows-6 gap-4 md:gap-8 min-h-[800px] grid-flow-row-dense">

          {/* Left large leaf/face image */}
          <RevealOnScroll direction="up" delay={200} className="col-span-12 md:col-span-4 row-span-6 relative h-[60vh] md:h-full">
            <div className="w-full h-full relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop"
                alt="Natural beauty"
                fill
                unoptimized
                className="object-cover transition-all duration-700 hover:scale-110 hover:opacity-80 cursor-pointer"
              />
            </div>
          </RevealOnScroll>

          {/* Center cosmetics image */}
          <RevealOnScroll direction="up" delay={400} className="col-span-6 md:col-span-4 row-span-3 col-start-1 md:col-start-6 row-start-2 md:row-start-2 relative mt-20 md:mt-0 flex flex-col items-center">
            <div className="w-full max-w-[250px] aspect-[3/4] relative overflow-hidden mb-4">
              <Image
                src="https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=600&auto=format&fit=crop"
                alt="Capture Day Creme"
                fill
                unoptimized
                className="object-cover transition-all duration-700 hover:scale-110 hover:opacity-80 cursor-pointer"
              />
            </div>
            <p className="text-xs font-bold tracking-widest uppercase">Capture Day Creme</p>
          </RevealOnScroll>

          {/* Right white tube image */}
          <RevealOnScroll direction="left" delay={600} className="col-span-6 md:col-span-3 row-span-3 col-start-7 md:col-start-10 row-start-1 md:row-start-1 relative flex flex-col items-center">
            <div className="w-full max-w-[220px] aspect-[4/5] relative overflow-hidden mb-4">
              <Image
                src="https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=600&auto=format&fit=crop"
                alt="Capture Le Serum"
                fill
                unoptimized
                className="object-cover transition-all duration-700 hover:scale-110 hover:opacity-80 cursor-pointer"
              />
            </div>
            <p className="text-xs font-bold tracking-widest uppercase">Capture Le Sérum</p>
          </RevealOnScroll>

          {/* Bottom right cropped image */}
          <RevealOnScroll direction="up" delay={800} className="col-span-8 md:col-span-4 row-span-2 col-start-5 md:col-start-8 row-start-5 md:row-start-5 relative h-[250px] md:h-[300px]">
            <div className="w-full h-full relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=600&auto=format&fit=crop"
                alt="Cosmetic detail"
                fill
                unoptimized
                className="object-cover transition-all duration-700 hover:scale-110 hover:opacity-80 cursor-pointer"
              />
            </div>
          </RevealOnScroll>

        </div>
      </div>
    </section>
  );
}
