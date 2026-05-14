import Image from "next/image";
import Link from "next/link";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export default function Collections() {
  return (
    <section className="w-full h-screen bg-white p-2 md:p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 h-full w-full overflow-hidden">
        {/* Left Side - Big Image */}
        <RevealOnScroll direction="left" delay={100} className="relative h-[50vh] md:h-full w-full bg-gray-100 group overflow-hidden">
          <Image
            src="/images/model3.png" // placeholder
            alt="Main Collection"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </RevealOnScroll>

        {/* Right Side - Grid */}
        <RevealOnScroll direction="right" delay={300} className="flex flex-col gap-2 md:gap-4 h-[50vh] md:h-full">
          {/* Top Right - Half height, full width */}
          <div className="relative flex-1 bg-gray-100 group overflow-hidden flex flex-col items-center justify-center">
            <Image
              src="/images/model1.png" // placeholder
              alt="Accessories"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Overlay for text */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
            <div className="absolute z-10 flex flex-col items-center">
              <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-widest mb-4 drop-shadow-lg">
                ACCESSORIES
              </h3>
              <Link
                href="/shop/accessories"
                className="bg-white/90 text-black px-6 py-2 md:px-8 md:py-3 text-xs md:text-sm font-semibold uppercase tracking-widest hover:bg-white transition-colors shadow-lg"
              >
                SHOP LOOKBOOK
              </Link>
            </div>
          </div>

          {/* Bottom Right - Half height, split into two */}
          <div className="flex-1 grid grid-cols-2 gap-2 md:gap-4">
            {/* Bottom Right 1 */}
            <div className="relative h-full w-full bg-gray-100 group overflow-hidden">
              <Image
                src="/images/model2.png" // placeholder
                alt="Collection Items"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            {/* Bottom Right 2 */}
            <div className="relative h-full w-full bg-gray-100 group overflow-hidden">
              <Image
                src="/images/model3.png" // placeholder
                alt="More Items"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
