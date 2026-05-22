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
const HERO_SCROLL_VH = 88;

type HomeHeroProps = {
  children: ReactNode;
};

export function HomeHero({ children }: HomeHeroProps) {
  const scrollRootRef = useRef<HTMLElement>(null);
  const belowRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const glowLikeRef = useRef<HTMLDivElement>(null);
  const neverBeforeRef = useRef<HTMLDivElement>(null);
  const beautyRef = useRef<HTMLDivElement>(null);
  const eleganceRef = useRef<HTMLDivElement>(null);

  /**
   * On-load animation for all visible hero elements:
   * - Left panel slides in from the left
   * - Right panel slides in from the right
   * - Brands bar fades up
   * - Labels (ELEGANCE/BEAUTY) and headline fade in
   */

  /**
   * Scroll animation: ONLY the "below" content (BestSellers+) slides up.
   * Everything else in the hero is visible from the start.
   */
  useLayoutEffect(() => {
    const root = scrollRootRef.current;
    const below = belowRef.current;
    const leftPanel = leftPanelRef.current;
    const rightPanel = rightPanelRef.current;
    const glowLike = glowLikeRef.current;
    const neverBefore = neverBeforeRef.current;
    const beauty = beautyRef.current;
    const elegance = eleganceRef.current;
    if (!root || !below) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set(below, { y: 0, clearProps: "willChange" });
      return;
    }

    const lift = Math.round(window.innerHeight);
    const belowStart = 1;
    const belowDur = 10;

    const ctx = gsap.context(() => {
      gsap.set(below, { y: lift, willChange: "transform" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 5%",
          end: "bottom bottom",
          scrub: 2,
          invalidateOnRefresh: false,
        },
      });

      tl.fromTo(
        below,
        { y: lift },
        {
          y: 0,
          duration: belowDur,
          ease: "easein",
        },
        belowStart
      );

      // On-load animations for left and right panels
      if (leftPanel) {
        gsap.fromTo(
          leftPanel,
          { x: -50, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.2 }
        );
      }

      if (rightPanel) {
        gsap.fromTo(
          rightPanel,
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.2 }
        );
      }

      // On-load animations for elegance/beauty labels
      if (elegance) {
        gsap.fromTo(
          elegance,
          { x: -50, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.3 }
        );
      }

      if (beauty) {
        gsap.fromTo(
          beauty,
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.3 }
        );
      }

      // On-load animations for headline elements
      if (glowLike) {
        gsap.fromTo(
          glowLike,
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.4, ease: "power3.out", delay: 0.4 }
        );
      }

      if (neverBefore) {
        gsap.fromTo(
          neverBefore,
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.4, ease: "power3.out", delay: 0.5 }
        );
      }
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
        <div className="sticky top-0  flex h-[88dvh] min-h-[540px] w-full flex-1 items-center justify-center overflow-hidden bg-[#f7f6f2] px-6 py-16 text-sm uppercase tracking-[0.3em] text-[#6b766f]">

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
            ref={leftPanelRef}
            className="absolute left-10 top-16 z-20 flex flex-col gap-0"
          >
            <span className="self-start border border-[#0f3b2b] text-[#0f3b2b] text-mdz tracking-[0.25em] font-sans px-4 py-1 rounded-full mb-5">
              ✦ NEW ARRIVALS
            </span>

            <div className="bg-[#eeebd8]/70 py-4 flex gap-3 mb-6">
              <div className="w-48 h-64 bg-[#d4cfa8]/60 shrink-0 flex items-center justify-center">
                <span className="text-[#6b766f] text-[0.5rem] font-sans">
                  <Image
                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop"
                    alt="Hero image"
                    width={400}
                    height={400}
                    className=""
                    priority
                  />
                </span>
              </div>
              <div className="flex flex-col justify-between px-4">
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
            className="pointer-events-none absolute inset-0 z-20"
          >
            <div
              ref={beautyRef}
              className="absolute left-[65%] bottom-64 text-4xl uppercase tracking-[0.4em] text-[#6b766f]"
            >
              BEAUTY
            </div>
            <div
              ref={eleganceRef}
              className="absolute left-[25%] bottom-64 text-4xl uppercase tracking-[0.4em] text-[#6b766f]"
            >
              ELEGANCE
            </div>
          </div>

          {/* Headline — glow like / never before */}
          <div className="absolute inset-0 z-10">
            <div
              ref={glowLikeRef}
              className="pointer-events-none absolute top-40 right-40 opacity-95"
            >
              <div className="font-symphony lowercase text-[#0f3b2b] text-6xl md:text-[6.8rem] lg:text-[14rem] leading-none">
                glow like
              </div>
            </div>
            <div
              ref={neverBeforeRef}
              className="pointer-events-auto absolute top-90 right-24"
            >
              <span className="font-serif lowercase text-[#0f3b2b] text-[8rem] leading-tight tracking-tight">
                never before
              </span>
            </div>
          </div>

          {/* Right panel — tagline + CTAs */}
          <div
            ref={rightPanelRef}
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
          <div className="absolute inset-x-0 bottom-0 z-20">
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
