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

export default function Home() {
  return (
    <main>
      <div className="flex h-auto md:h-[90vh] md:min-h-[90vh] bg-[#f7f6f2] relative overflow-hidden">
        <div className="flex  md:flex-row flex-1 relative  justify-start md:justify-center px-4 md:px-6 pt-5 sm:pt-12 pb-32 md:py-16 text-sm uppercase tracking-[0.3em] text-[#6b766f] w-full gap-6 md:gap-0">

          {/* Desktop Model — absolute positioned, highest z-index */}
          <Image
            src="/images/heromodel.png"
            alt="Hero image"
            width={800}
            height={1200}
            className="hidden md:block absolute z-20 top-[-10%] select-none pointer-events-none"
            priority
          />

          {/* Mobile Model — centered and scaled down */}
          <div className="block md:hidden relative w-[350px] -mt-10  h-[500px] z-20 -ml-30 shrink-0 order-3">
            <Image
              src="/images/heromodel.png"
              alt="Hero image"
              fill
              sizes="180px"
              className="object-contain select-none pointer-events-none"
              priority
            />
          </div>

          {/* ── LEFT SIDE ── */}
          <RevealOnScroll direction="left" delay={200} className="relative top-12 md:absolute md:left-10 md:top-12 z-20 flex flex-col gap-0 md:items-start w-full md:w-auto max-w-sm mt-6 md:mt-0 order-1 md:order-none">

            {/* New arrivals badge */}
            {/* <span className=" border border-[#0f3b2b] text-[#0f3b2b] text-[0.5rem] md:text-mdz tracking-[0.25em] font-sans p-1 w-full rounded-full mb-2">
              ✦ NEW ARRIVALS
            </span> */}
            <span className="inline-flex items-center gap-2 border border-[#0f3b2b] text-[#0f3b2b] text-[0.5rem] md:text-xs tracking-[0.2em] font-sans px-4 py-2 w-fit rounded-full mb-2">
  <span>✦</span>
  <span>NEW ARRIVALS</span>
</span>

            {/* Featured product card carousel */}
            <NewArrivalsCarousel />

            {/* Divider */}
            <div className="hidden md:block w-full h-px bg-[#e0ddd5] mb-5 mt-5" />

            {/* Trust signals */}
            <div className="hidden md:flex flex-col gap-4 mb-5">
              {[
                { title: "100% Authentic", sub: "Sourced directly from Korea" },
                { title: "Free Delivery", sub: "On orders above Rs. 3,500" },
                { title: "Expert Curation", sub: "Skin-matched routines for you" },
              ].map(({ title, sub }) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="text-[#0f3b2b] text-xs mt-0.5">✦</span>
                  <div>
                    <p className="font-sans text-lg sm:text-[0.65rem] font-semibold text-[#0f3b2b] tracking-wide normal-case">{title}</p>
                    <p className="font-sans text-sm sm:text-[0.6rem] text-[#6b766f] normal-case">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="hidden md:block w-full h-px bg-[#e0ddd5] mb-4" />

            {/* Skin quiz */}
            <p className="hidden md:block font-sans text-[0.6rem] text-[#6b766f] normal-case tracking-wide mb-1">Not sure where to start?</p>
            <Link
              href="/skincare-test"
              className="hidden md:block font-sans text-[0.65rem] text-[#0f3b2b] normal-case tracking-wide hover:underline underline-offset-4"
            >
              → Take the Skin Quiz
            </Link>
          </RevealOnScroll>

          {/* ELEGANCE / BEAUTY labels — hidden on mobile */}
          <div className="hidden md:block absolute left-[65%] bottom-64 text-4xl uppercase tracking-[0.4em] text-[#6b766f] z-20">
            BEAUTY
          </div>
          <div className="hidden md:block absolute left-[25%] bottom-64 text-4xl uppercase tracking-[0.4em] text-[#6b766f] z-20">
            ELEGANCE
          </div>

          {/* Hero typography */}
          <RevealOnScroll direction="down" delay={200} className="hidden md:block relative -top-90 ml-4 text-left md:absolute md:top-40 md:right-40 pointer-events-none opacity-95 z-10 w-full md:w-auto md:text-left order-1 md:order-none">
            <div className="font-symphony lowercase text-[#0f3b2b] text-6xl sm:text-6xl md:text-[6.8rem] lg:text-[14rem] leading-none">
              glow like
            </div>
          </RevealOnScroll>
          <RevealOnScroll direction="up" delay={300} className="hidden md:block relative -top-60 text-left md:absolute md:top-90 md:right-24 z-10 w-full md:w-auto md:text-left mt-[-20px] md:mt-0 order-2 md:order-none">
            <span className="font-serif lowercase text-[#0f3b2b] text-4xl sm:text-6xl md:text-[8rem] leading-tight tracking-tight block">
              never before
            </span>
          </RevealOnScroll>

          {/* ── RIGHT CTA ── hidden on mobile */}
          <RevealOnScroll direction="right" delay={400} className="hidden md:flex absolute right-10 bottom-40 z-20 flex-col items-start gap-5 text-left">
            <p className="font-sans text-xs tracking-[0.2em] text-[#6b766f] leading-relaxed normal-case">
              Rituals rooted in nature.<br />
              Crafted for your skin&apos;s story.
            </p>
            <Link
              href="/skincare"
              className="inline-block bg-[#0f3b2b] text-[#f7f6f2] text-[0.6rem] tracking-[0.35em] uppercase px-8 py-3 hover:bg-[#1a5c42] transition-colors duration-500 font-sans"
            >
              Explore the Ritual
            </Link>
            <Link
              href="/journal"
              className="flex items-center gap-3 text-[#6b766f] text-[0.6rem] tracking-[0.25em] uppercase font-sans hover:text-[#0f3b2b] transition-colors duration-300 normal-case"
            >
              <span className="block w-8 h-px bg-current" />
              Learn Our Story
            </Link>
          </RevealOnScroll>

          <Brands />

        </div>
      </div>

      <BestSellers />

      {/* Collections Section */}

      <FeaturedProducts />
      <Collections />

      <NewnessSection />

      <SpringCollection />

    </main>
  );
}
