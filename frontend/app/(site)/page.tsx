import BestSellers from "@/components/best-sellers";
import Brands from "../../components/brands";
import Image from "next/image";
import Link from "next/link";
import Collections from "@/components/collections";
import FeaturedProducts from "@/components/FeaturedProducts";
import NewnessSection from "@/components/NewnessSection";
import SpringCollection from "@/components/SpringCollection";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import NewArrivalsCarousel from "@/components/NewArrivalsCarousel";
import WhyChooseKara from "@/components/WhyChooseKara";
import { Heart } from "lucide-react";

export default function Home() {
  return (
    <main>
      {/* ── DESKTOP HERO SECTION (md and up) ── */}
      <div className="hidden md:flex h-[83vh] sm:h-auto md:h-[90vh] md:min-h-[90vh] bg-[#f7f6f2] relative overflow-hidden">
        <div className="flex xl:flex-row flex-1 relative  px-4 md:px-6 pt-10  sm:pt-12 pb-32 md:py-5 text-sm uppercase tracking-[0.3em] text-[#6b766f] w-full md:gap-0 ">

          <div
            className=" 
    relative  z-20 shrink-0 min-[420px]:shrink 
    h-[480px] sm:h-[500px] md:h-[760px] xl:h-[43vw] 
    md:aspect-[2/3] /* Forces the container to scale proportionally to the height */
    -mt-10 lg:mt-0 order-2 pointer-events-none
  "
          >
            <Image
              src="/images/newheromodel.webp"
              alt="Hero image"
              fill
              priority
              className=" object-contain translate-x-[13vw]"
              sizes="
        (max-width: 640px) 280px,
        (max-width: 768px) 420px,
        (max-width: 1024px) 500px,
        (max-width: 1280px) 800px,
        600px
      "
            />
          </div>

          {/* ── LEFT SIDE ── */}
          <RevealOnScroll
            direction="left"
            delay={200}
            className="relative top-32 md:absolute md:left-12 lg:left-16 md:top-[10%] z-20 flex flex-col gap-0 md:items-start w-full max-w-[90vw] md:w-[45vw] xl:w-[50vw] md:mt-0 order-1 md:order-1"
          >
            <WhyChooseKara />
          </RevealOnScroll>

          {/* Hero typography */}
          <RevealOnScroll
            direction="down"
            delay={200}
            className="hidden 2xl:block relative ml-4 text-left md:absolute md:top-40 2xl:top-16 md:right-40 xl:right-13 xl:top-30 2xl:right-20 pointer-events-none opacity-95 z-10 w-full md:w-auto md:text-left order-1 md:order-none"
          >
            <div className="font-symphony lowercase text-[#0f3b2b] text-6xl sm:text-6xl md:text-[6rem] xl:text-[4.5rem] 2xl:text-[10rem] leading-none">
              glow like
            </div>
          </RevealOnScroll>
          <RevealOnScroll
            direction="up"
            delay={300}
            className="hidden 2xl:block relative text-left md:absolute md:top-60 2xl:top-[180px] xl:top-48 xl:right-16 2xl:right-10 z-10 w-full md:w-auto md:text-left mt-[-20px] md:mt-0 order-2 md:order-none"
          >
            <span className="font-serif lowercase text-[#0f3b2b] text-4xl sm:text-6xl md:text-[3rem] xl:text-[2.8rem] 2xl:text-[5.5rem] leading-tight tracking-tight block">
              never before
            </span>
          </RevealOnScroll>

          {/* ── RIGHT CTA ── hidden on mobile */}
          <RevealOnScroll
            direction="right"
            delay={400}
            className="hidden xl:flex absolute right-10 bottom-40 lg:bottom-35 2xl:bottom-40 z-20 flex-col items-end gap-2 text-left"
          >
            <span className="inline-flex items-center gap-2 border border-[#0f3b2b] text-[#0f3b2b] text-[0.5rem] md:text-xs tracking-[0.2em] font-sans px-4 py-2 w-fit rounded-full mb-2 bg-[#f7f6f2]">
              <span>✦</span>
              <span>NEW ARRIVALS</span>
            </span>

            {/* Featured product card carousel */}
            <NewArrivalsCarousel />
          </RevealOnScroll>

          <Brands />
        </div>
      </div>

      {/* ── MOBILE HERO SECTION (below md) ── */}
      <div className="flex md:hidden flex-col bg-[#f7f6f2] w-full pt-2 overflow-hidden relative">
        {/* why choose kara text at the center */}
        <div className=" text-center px-4">
          <h2 className="text-[#0f3b2b] text-3xl sm:text-4xl  leading-tight tracking-tight uppercase font-elementary">
            Why Choose
            <br />
            <span className="text-[#a4659f] inline-flex font-elementary items-center gap-2 justify-center">
              KARA?
              <Heart className="w-6 h-6 text-[#a4659f] fill-current" />
            </span>
          </h2>
        </div>

        {/* fulll wdth banner below that */}
        <div className="w-full ">
          <WhyChooseKara hideHeading={true} isMobile={true} />
        </div>

        {/* hero model below that with glow like and never before text on either side of the hero model image */}
        <div className="relative w-full flex justify-center items-center h-[340px] overflow-hidden">
          {/* glow like on the left */}
          <div className="absolute left-6 top-[60%] -translate-y-1/2 z-10 pointer-events-none select-none">
            <span className="font-symphony lowercase text-[#0f3b2b] text-5xl sm:text-5xl leading-none">
              glow like
            </span>
          </div>

          {/* Model image in the center */}
          <div className="relative h-full aspect-[3/4] -mt-13 z-0">
            <Image
              src="/images/crophero.webp"
              alt="Hero model"
              fill
              priority
              className="object-contain select-none pointer-events-none"
              sizes="(max-width: 640px) 240px, 320px"
            />
          </div>

          {/* never before on the right */}
          <div className="absolute right-3 bottom-1/3 translate-y-1/2 z-10 pointer-events-none select-none text-right">
            <span className="font-serif lowercase text-[#0f3b2b] text-2xl sm:text-3xl leading-tight tracking-tight block">
              never before
            </span>
          </div>
        </div>

        {/* brand logo below that */}
        <Brands />
      </div>
      <BestSellers />
      {/* Collections Section */}
      <div className=" py-10 mt-0 md:py-20 mdLmt-10">
        <FeaturedProducts />
      </div>
      <Collections />
      <NewnessSection />
      <SpringCollection />
    </main>
  );
}