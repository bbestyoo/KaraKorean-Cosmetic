import BestSellers from "@/components/best-sellers";
import Brands from "../../components/brands";
import Image from "next/image";
import Link from "next/link";
import Collections from "@/components/collections";
import Footer from "@/components/footer";
import FeaturedProducts from "@/components/FeaturedProducts";
import NewnessSection from "@/components/NewnessSection";
import SpringCollection from "@/components/SpringCollection";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export default function Home() {
  return (
    <main>
      <div className="flex h-[90vh] min-h-[90vh] bg-[#f7f6f2]">
        <div className="flex flex-1 relative items-center justify-center px-6 py-16 text-sm uppercase tracking-[0.3em] text-[#6b766f]">

          <Image
            src="/images/heromodel.png"
            alt="Hero image"
            width={800}
            height={1200}
            className="absolute z-10 top-[-10%]"
          />

          {/* ── LEFT SIDE ── */}
          <RevealOnScroll direction="left" delay={200} className="absolute left-10 top-16 z-20 flex flex-col gap-0 ">

            {/* New arrivals badge */}
            <span className="self-start border border-[#0f3b2b] text-[#0f3b2b] text-mdz tracking-[0.25em] font-sans px-4 py-1 rounded-full mb-5">
              ✦ NEW ARRIVALS
            </span>

            {/* Featured product card */}
            <div className="bg-[#eeebd8]/70 p-3 flex gap-3 mb-6">
              <div className="w-48 h-64 bg-[#d4cfa8]/60 shrink-0 flex items-center justify-center">
                <span className="text-[#6b766f] text-[0.5rem] font-sans">img</span>
              </div>
              <div className="flex flex-col justify-between py-1">
                <div>
                  <p className="font-serif italic text-[#0f3b2b] text-2xl leading-tight">Glow Ampoule</p>
                  <p className="font-sans text-lg text-[#6b766f] tracking-widest mt-0.5 normal-case">COSRX · 30ml</p>
                </div>
                <div>

                  <p className="font-sans text-[#0f3b2b] text-lg font-semibold normal-case">Rs. 2,800</p>
                  <p className="font-sans line-through text-[#0f3b2b] text-lg font-semibold normal-case">Rs. 3,800</p>
                </div>
                <Link
                  href="/skincare"
                  className="bg-[#0f3b2b] text-[#f7f6f2] tracking-[0.2em] font-sans px-3 py-1.5 hover:bg-[#1a5c42] transition-colors duration-300 self-start"
                >
                  ADD TO BAG
                </Link>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-[#e0ddd5] mb-5" />

            {/* Trust signals */}
            <div className="flex flex-col gap-4 mb-5">
              {[
                { title: "100% Authentic", sub: "Sourced directly from Korea" },
                { title: "Free Delivery", sub: "On orders above Rs. 3,500" },
                { title: "Expert Curation", sub: "Skin-matched routines for you" },
              ].map(({ title, sub }) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="text-[#0f3b2b] text-xs mt-0.5">✦</span>
                  <div>
                    <p className="font-sans text-[0.65rem] font-semibold text-[#0f3b2b] tracking-wide normal-case">{title}</p>
                    <p className="font-sans text-[0.6rem] text-[#6b766f] normal-case">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-[#e0ddd5] mb-4" />

            {/* Skin quiz */}
            <p className="font-sans text-[0.6rem] text-[#6b766f] normal-case tracking-wide mb-1">Not sure where to start?</p>
            <Link
              href="/skincare-test"
              className="font-sans text-[0.65rem] text-[#0f3b2b] normal-case tracking-wide hover:underline underline-offset-4"
            >
              → Take the Skin Quiz
            </Link>
          </RevealOnScroll>

          {/* ELEGANCE / BEAUTY labels */}
          <div className="absolute left-[60%] bottom-64 text-4xl uppercase tracking-[0.4em] text-[#6b766f] z-20">
            BEAUTY
          </div>
          <div className="absolute left-[30%] bottom-64 text-4xl uppercase tracking-[0.4em] text-[#6b766f] z-20">
            ELEGANCE
          </div>

          {/* Hero typography */}
          <RevealOnScroll direction="down" delay={200} className="absolute top-40 right-40 pointer-events-none opacity-95 z-10">
            <div className="font-symphony lowercase text-[#0f3b2b] text-6xl md:text-[6.8rem] lg:text-[14rem] leading-none">
              glow like
            </div>
          </RevealOnScroll>
          <RevealOnScroll direction="up" delay={300} className="absolute top-90 right-24 z-10">
            <span className="font-serif lowercase text-[#0f3b2b] text-[8rem] leading-tight tracking-tight">
              never before
            </span>
          </RevealOnScroll>

          {/* ── RIGHT CTA ── */}
          <RevealOnScroll direction="right" delay={400} className="absolute right-10 bottom-40 z-20 flex flex-col items-start gap-5 text-left">
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

      {/* Footer Section */}
      <Footer />
    </main>
  );
}