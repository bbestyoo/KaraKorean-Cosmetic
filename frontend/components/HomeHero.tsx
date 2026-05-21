"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Brands from "@/components/brands";

gsap.registerPlugin(ScrollTrigger);

/**
 * Total scroll height for the hero "stage".
 * Keeps the BestSellers sticky slide-up effect.
 */
const HERO_SCROLL_VH = 96;

type HomeHeroProps = {
  children: ReactNode;
};

export function HomeHero({ children }: HomeHeroProps) {
  const scrollRootRef = useRef<HTMLElement>(null);
  const belowRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const brandsWrapRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  /**
   * On-load animation for all visible hero elements:
   * - Left panel slides in from the left
   * - Right panel slides in from the right
   * - Brands bar fades up
   * - Labels (ELEGANCE/BEAUTY) and headline fade in
   */
  useLayoutEffect(() => {
    const labels = labelsRef.current;
    const headline = headlineRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    const brands = brandsWrapRef.current;
    if (!labels || !headline || !left || !right || !brands) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set([labels, headline, left, right, brands], {
        autoAlpha: 1,
        x: 0,
        y: 0,
      });
      return;
    }

    const off = Math.min(120, window.innerWidth * 0.1);

    // Start everything hidden
    gsap.set([labels, headline], { autoAlpha: 0, y: 14 });
    gsap.set(left, { autoAlpha: 0, x: -off });
    gsap.set(right, { autoAlpha: 0, x: off });
    gsap.set(brands, { autoAlpha: 0, y: 30 });

    const intro = gsap.timeline({ defaults: { ease: "power2.out" } });
    // Labels and headline
    intro.to(labels, { autoAlpha: 1, y: 0, duration: 0.95 }, 0);
    intro.to(headline, { autoAlpha: 1, y: 0, duration: 1.05 }, 0.12);
    // Left panel slides in from left
    intro.to(left, { autoAlpha: 1, x: 0, duration: 1.1 }, 0.15);
    // Right panel slides in from right
    intro.to(right, { autoAlpha: 1, x: 0, duration: 1.1 }, 0.25);
    // Brands bar fades up
    intro.to(brands, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.35);

    return () => {
      intro.kill();
    };
  }, []);

  /**
   * Scroll animation: ONLY the "below" content (BestSellers+) slides up.
   * Everything else in the hero is visible from the start.
   */
  useLayoutEffect(() => {
    const root = scrollRootRef.current;
    const below = belowRef.current;
    if (!root || !below) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set(below, { y: 0, clearProps: "willChange" });
      return;
    }

    const lift = Math.round(window.innerHeight);
    const belowStart = 2;
    const belowDur = 10;

    const ctx = gsap.context(() => {
      gsap.set(below, { y: lift, willChange: "transform" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 2,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        below,
        { y: lift },
        {
          y: 0,
          duration: belowDur,
          ease: "power2.inOut",
        },
        belowStart
      );
    }, root);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <>
      <section
        ref={scrollRootRef}
        className="relative w-full bg-[#f7f6f2]"
        style={{ height: `${HERO_SCROLL_VH}vh` }}
        aria-label="Hero"
      >
        <div className="sticky top-0  flex h-[88vh] min-h-[540px] w-full flex-1 items-center justify-center overflow-hidden bg-[#f7f6f2] px-6 py-16 text-sm uppercase tracking-[0.3em] text-[#6b766f]">

          {/* Hero model — fills full viewport height, bottom-anchored */}
          <Image
            src="/images/heromodel.png"
            alt="Hero image"
            width={800}
            height={1800}
            className="absolute z-30 bottom-0 h-[96vh] w-auto select-none object-contain object-bottom"
            priority
          />1

          {/* Left panel — New Arrivals + Glow Ampoule card */}
          <div
            ref={leftRef}
            className="absolute left-10 top-16 z-20 flex flex-col gap-0"
          >
            <span className="self-start border border-[#0f3b2b] text-[#0f3b2b] text-mdz tracking-[0.25em] font-sans px-4 py-1 rounded-full mb-5">
              ✦ NEW ARRIVALS
            </span>

            <div className="bg-[#eeebd8]/70 p-3 flex gap-3 mb-6">
              <div className="w-48 h-64 bg-[#d4cfa8]/60 shrink-0 flex items-center justify-center">
                <span className="text-[#6b766f] text-[0.5rem] font-sans">img</span>
              </div>
              <div className="flex flex-col justify-between py-1">
                <div>
                  <p className="font-serif italic text-[#0f3b2b] text-2xl leading-tight">
                    Glow Ampoule
                  </p>
                  <p className="font-sans text-lg text-[#6b766f] tracking-widest mt-0.5 normal-case">
                    COSRX · 30ml
                  </p>
                </div>
                <div>
                  <p className="font-sans text-[#0f3b2b] text-lg font-semibold normal-case">
                    Rs. 2,800
                  </p>
                  <p className="font-sans line-through text-[#0f3b2b] text-lg font-semibold normal-case">
                    Rs. 3,800
                  </p>
                </div>
                <Link
                  href="/skincare"
                  className="bg-[#0f3b2b] text-[#f7f6f2] tracking-[0.2em] font-sans px-3 py-1.5 hover:bg-[#1a5c42] transition-colors duration-300 self-start"
                >
                  ADD TO BAG
                </Link>
              </div>
            </div>

            <div className="w-full h-px bg-[#e0ddd5] mb-5" />

            <div className="flex flex-col gap-4 mb-5">
              {[
                { title: "100% Authentic", sub: "Sourced directly from Korea" },
                { title: "Free Delivery", sub: "On orders above Rs. 3,500" },
                { title: "Expert Curation", sub: "Skin-matched routines for you" },
              ].map(({ title, sub }) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="text-[#0f3b2b] text-xs mt-0.5">✦</span>
                  <div>
                    <p className="font-sans text-[0.65rem] font-semibold text-[#0f3b2b] tracking-wide normal-case">
                      {title}
                    </p>
                    <p className="font-sans text-[0.6rem] text-[#6b766f] normal-case">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full h-px bg-[#e0ddd5] mb-4" />

            <p className="font-sans text-[0.6rem] text-[#6b766f] normal-case tracking-wide mb-1">
              Not sure where to start?
            </p>
            <Link
              href="/skincare-test"
              className="font-sans text-[0.65rem] text-[#0f3b2b] normal-case tracking-wide hover:underline underline-offset-4"
            >
              → Take the Skin Quiz
            </Link>
          </div>

          {/* ELEGANCE / BEAUTY labels */}
          <div
            ref={labelsRef}
            className="pointer-events-none absolute inset-0 z-20"
          >
            <div className="absolute left-[65%] bottom-64 text-4xl uppercase tracking-[0.4em] text-[#6b766f]">
              BEAUTY
            </div>
            <div className="absolute left-[25%] bottom-64 text-4xl uppercase tracking-[0.4em] text-[#6b766f]">
              ELEGANCE
            </div>
          </div>

          {/* Headline — glow like / never before */}
          <div ref={headlineRef} className="absolute inset-0 z-10">
            <div className="pointer-events-none absolute top-40 right-40 opacity-95">
              <div className="font-symphony lowercase text-[#0f3b2b] text-6xl md:text-[6.8rem] lg:text-[14rem] leading-none">
                glow like
              </div>
            </div>
            <div className="pointer-events-auto absolute top-90 right-24">
              <span className="font-serif lowercase text-[#0f3b2b] text-[8rem] leading-tight tracking-tight">
                never before
              </span>
            </div>
          </div>

          {/* Right panel — tagline + CTAs */}
          <div
            ref={rightRef}
            className="absolute right-10 bottom-40 z-20 flex flex-col items-start gap-5 text-left"
          >
            <p className="font-sans text-xs tracking-[0.2em] text-[#6b766f] leading-relaxed normal-case">
              Rituals rooted in nature.
              <br />
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
          </div>

          {/* Brands bar */}
          <div ref={brandsWrapRef} className="absolute inset-x-0 bottom-0 z-20">
            <Brands />
          </div>
        </div>
      </section>

      {/* BestSellers + rest of page — slides up over the hero on scroll */}
      <div
        ref={belowRef}
        className="relative z-[100] -mt-[100vh] bg-[#f7f6f2]"
      >
        {children}
      </div>
    </>
  );
}
