import Image from "next/image";
import Link from "next/link";
import { RevealOnScroll } from "./RevealOnScroll";

export default function NewnessSection() {
  const toCategory = (s?: string) => (s ? s.split(/\s+/).join("-").toLowerCase() : "");
  return (
    <section className="relative w-full bg-white py-10 md:py-24 overflow-hidden">
      {/* Top Tagline — inline on mobile, absolute on md+ */}
      <div className="relative md:absolute md:top-12 md:left-1/2 md:-translate-x-1/2 w-full text-center z-10 px-4 mb-2 md:mb-0 pt-6 md:pt-0">
        <RevealOnScroll direction="down" delay={100}>
          <p className="text-xs md:text-base text-neutral-500 font-sans tracking-tight">
            ALWAYS BE ON TOP WITH OUR COSMETICS
          </p>
        </RevealOnScroll>
      </div>

      {/* Typography layer */}
      <div className="relative w-full max-w-full px-4 md:px-8 mx-auto pt-4 md:pt-16 md:pb-12 flex flex-col md:flex-row justify-between items-start md:items-center z-10">
        <RevealOnScroll direction="left" delay={200} className="w-full">
          <h2 className="text-[12vw] md:text-[8vw] font-bold leading-none tracking-tighter text-[#0f3b2b] uppercase">
            NEWNESS
          </h2>
        </RevealOnScroll>

        <RevealOnScroll direction="right" delay={300} className="w-full text-right mt-4 md:mt-10 md:mt-0 flex flex-col items-end">
          <h2 className="text-[12vw] md:text-[8vw] font-bold leading-none tracking-tighter text-[#0f3b2b] uppercase relative">
            DESIRE SERIES
          </h2>
          <p className="text-sm md:text-base text-neutral-500 font-sans max-w-[200px] text-right mt-2 mr-2 leading-snug">
            Cosmetics for your beauty
          </p>
        </RevealOnScroll>
      </div>

      {/* Images Grid Layer */}
      <div className="relative w-full h-full max-w-full mx-auto mt-6 md:mt-12 px-4 md:px-8 z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-6 gap-4 md:gap-8 min-h-0 md:min-h-[800px] grid-flow-row-dense">

          {/* Left large leaf/face image (covers 50% width) */}
          <RevealOnScroll direction="up" delay={200} className="col-span-1 md:col-span-2 row-span-6 relative h-[55vw] md:h-full">
            <Link
              href={(() => {
                const category = toCategory("Natural beauty");
                return `/products${category ? `?category=${encodeURIComponent(category)}` : ""}`;
              })()}
              className="w-full h-full block relative overflow-hidden group cursor-pointer shadow-md"
            >
              <Image
                src="/images/karacollection6.webp"
                alt="Natural beauty"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#0f3b2b]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-white text-[#0f3b2b] font-bold tracking-widest text-xs uppercase py-3 px-6 rounded-none shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#0f3b2b] hover:text-white">
                  Shop Now
                </span>
              </div>
            </Link>
          </RevealOnScroll>

          {/* Center cosmetics image (centered in middle-right 25% column) */}
          <RevealOnScroll direction="up" delay={400} className="col-span-1 md:col-span-1 md:col-start-3 md:row-start-2 md:row-span-4 relative flex flex-col justify-center items-center">
            <Link
              href={(() => {
                const category = toCategory("Capture Day Creme");
                return `/products${category ? `?category=${encodeURIComponent(category)}` : ""}`;
              })()}
              className="w-full max-w-[360px] aspect-[3/4] relative overflow-hidden mb-4 group cursor-pointer shadow-md"
            >
              <Image
                src="/images/karacollection1.jpg"
                alt="Tone Brightening Set Capsoule"
                fill
                sizes="(max-width: 768px) 100vw, 360px"
                className="object-cover transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#0f3b2b]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-white text-[#0f3b2b] font-bold tracking-widest text-xs uppercase py-3 px-6 rounded-none shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#0f3b2b] hover:text-white">
                  Shop Now
                </span>
              </div>
            </Link>
            <p className="text-xs font-bold tracking-widest uppercase text-[#5c6e69]">Tone Brightening Set Capsoule</p>
          </RevealOnScroll>

          {/* Right top white tube image (top stacked in far-right 25% column) */}
          <RevealOnScroll direction="left" delay={600} className="col-span-1 md:col-span-1 md:col-start-4 md:row-start-1 md:row-span-3 relative flex flex-col justify-end items-center mb-4 md:mb-0">
            <Link
              href={(() => {
                const category = toCategory("Capture Le Serum");
                return `/products${category ? `?category=${encodeURIComponent(category)}` : ""}`;
              })()}
              className="w-full max-w-[340px] aspect-[4/5] relative overflow-hidden mb-4 group cursor-pointer shadow-md"
            >
              <Image
                src="/images/karacollection9.webp"
                alt="The Vita-A Retinal Shot Tightening Booster"
                fill
                sizes="(max-width: 768px) 100vw, 340px"
                className="object-cover transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#0f3b2b]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-white text-[#0f3b2b] font-bold tracking-widest text-xs uppercase py-3 px-6 rounded-none shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#0f3b2b] hover:text-white">
                  Shop Now
                </span>
              </div>
            </Link>
            <p className="text-xs font-bold tracking-widest uppercase text-[#5c6e69]">The Vita-A Retinal Shot Tightening Booster</p>
          </RevealOnScroll>

          {/* Bottom right cropped image (bottom stacked in far-right 25% column) */}
          <RevealOnScroll direction="up" delay={800} className="col-span-1 md:col-span-1 md:col-start-4 md:row-start-4 md:row-span-3 relative h-[50vw] md:h-full pt-0 md:pt-0">
            <Link
              href={(() => {
                const category = toCategory("Cosmetic detail");
                return `/products${category ? `?category=${encodeURIComponent(category)}` : ""}`;
              })()}
              className="w-full h-full block relative overflow-hidden group cursor-pointer shadow-md"
            >
              <Image
                src="/images/karacollection4.webp"
                alt="Cosmetic detail"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#0f3b2b]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-white text-[#0f3b2b] font-bold tracking-widest text-xs uppercase py-3 px-6 rounded-none shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#0f3b2b] hover:text-white">
                  Shop Now
                </span>
              </div>
            </Link>
          </RevealOnScroll>

        </div>
      </div>
    </section>
  );
}
