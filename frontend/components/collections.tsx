import Image from "next/image";
import Link from "next/link";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export default function Collections() {
  return (
    <section className="w-full h-auto md:h-screen bg-white p-2 md:p-4">
      {/* Mobile: 4-column equal stack; Desktop: bento two-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 h-full w-full overflow-hidden">
        <div className="relative h-[45vw] sm:h-[50vw] group cursor-pointer md:h-full">
          {/* Left Side - Big Image */}
          <RevealOnScroll direction="left" delay={100} className="relative h-full w-full bg-gray-100  overflow-hidden">
            <Link
              href={(() => {
                const parts = '/shop/serum'.split('/').filter(Boolean);
                const category = parts.length ? parts[parts.length - 1] : '';
                return `/products${category ? `?category=${encodeURIComponent(category)}` : ''}`;
              })()}
              className="group relative h-full w-full block overflow-hidden"
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/karaimages/image2.webp"
                  alt="Main Collection"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                <h3 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-widest mb-3 drop-shadow-lg">
                  Serums
                </h3>
                <span className="bg-white/90 text-black px-5 py-2 md:px-8 md:py-3 text-[0.65rem] md:text-sm font-semibold uppercase tracking-widest hover:bg-white transition-colors shadow-lg">
                  SHOP LOOKBOOK
                </span>
              </div>
            </Link>
          </RevealOnScroll>
        </div>

        {/* Right Side - on mobile: 3 equal tiles stacked; on desktop: flex-col split */}
        <RevealOnScroll direction="right" delay={300} className="grid grid-cols-1 md:flex md:flex-col gap-2 md:gap-4 md:h-full">
          {/* Tile 1: Moisturizers */}
          <Link
            href={(() => {
              const parts = '/shop/moisturizer'.split('/').filter(Boolean);
              const category = parts.length ? parts[parts.length - 1] : '';
              return `/products${category ? `?category=${encodeURIComponent(category)}` : ''}`;
            })()}
            className="group relative h-[45vw] sm:h-[50vw] md:flex-1 bg-gray-100 overflow-hidden flex flex-col items-center justify-center"
          >
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/karaimages/image3.webp"
                alt="Accessories"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
            <div className="absolute z-10 flex flex-col items-center">
              <h3 className="text-white text-xl md:text-3xl lg:text-4xl font-bold uppercase tracking-widest mb-3 drop-shadow-lg">
                Moisturizers
              </h3>
              <span className="bg-white/90 text-black px-5 py-2 md:px-8 md:py-3 text-[0.65rem] md:text-sm font-semibold uppercase tracking-widest hover:bg-white transition-colors shadow-lg">
                SHOP LOOKBOOK
              </span>
            </div>
          </Link>

          {/* Tile 2 & 3: on mobile stacked; on desktop side-by-side in bottom half */}
          <div className="grid grid-cols-1  md:grid-cols-2 gap-2 md:gap-4 md:flex-1">
            {/* Hydration */}
            <Link
              href={(() => {
                const parts = '/shop/cream'.split('/').filter(Boolean);
                const category = parts.length ? parts[parts.length - 1] : '';
                return `/products${category ? `?category=${encodeURIComponent(category)}` : ''}`;
              })()}
              className="group relative h-[45vw] sm:h-[50vw] md:h-full w-full bg-gray-100 overflow-hidden"
            >
              <Image
                src="/images/karaimages/image4.webp"
                alt="Collection Items"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                <h3 className="text-white text-sm sm:text-2xl md:text-3xl lg:text-2xl font-bold uppercase tracking-widest mb-2 md:mb-4 drop-shadow-lg">
                  Creams
                </h3>
                <span className="bg-white/90 text-black px-3 py-1.5 md:px-8 md:py-3 text-[0.55rem] md:text-sm font-semibold uppercase tracking-widest hover:bg-white transition-colors shadow-lg">
                  SHOP LOOKBOOK
                </span>
              </div>
            </Link>
            {/* Accessories */}
            <Link
              href={(() => {
                const parts = '/shop/sunscreen'.split('/').filter(Boolean);
                const category = parts.length ? parts[parts.length - 1] : '';
                return `/products${category ? `?category=${encodeURIComponent(category)}` : ''}`;
              })()}
              className="group relative h-[45vw] sm:h-[50vw] md:h-full w-full bg-gray-100 overflow-hidden"
            >
              <Image
                src="/images/karaimages/image5.webp"
                alt="More Items"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                <h3 className="text-white text-sm sm:text-2xl md:text-3xl lg:text-2xl font-bold uppercase tracking-widest mb-2 md:mb-4 drop-shadow-lg">
                  Sunscreens
                </h3>
                <span className="bg-white/90 text-black px-3 py-1.5 md:px-8 md:py-3 text-[0.55rem] md:text-sm font-semibold uppercase tracking-widest hover:bg-white transition-colors shadow-lg">
                  SHOP LOOKBOOK
                </span>
              </div>
            </Link>
          </div>
        </RevealOnScroll>
      </div >
    </section >
  );
}
