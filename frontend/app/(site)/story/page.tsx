"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type PageLayout = "text-only" | "image-top" | "image-full" | "image-split";

type PageSide = {
  kicker?: string;
  title: string;
  subtitle?: string;
  body?: string;
  isCover?: boolean;
  isClosing?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  image?: string;
  imageCaption?: string;
  layout?: PageLayout;
};

type Spread = {
  left: PageSide;
  right: PageSide;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function Page({ side, pageNumber }: { side: PageSide; pageNumber?: number }) {
  const isImageFull = side.layout === "image-full";

  return (
    <div
      className={`h-full w-full flex flex-col bg-[#FDFBF7] overflow-hidden relative ${
        isImageFull ? "p-0" : "p-8 sm:p-10"
      }`}
    >
      {/* Decorative Border for non-full-image pages */}
      {!isImageFull && (
        <div className="absolute inset-4 border border-black/5 pointer-events-none" />
      )}

      {/* Content Container */}
      <div
        className={`flex-1 flex flex-col h-full ${
          isImageFull ? "justify-end" : ""
        }`}
      >
        {/* Kicker */}
        {!isImageFull && side.kicker && (
          <div className="text-[10px] tracking-[0.3em] font-medium text-neutral-500 mb-6 uppercase text-center font-sans">
            {side.kicker}
          </div>
        )}

        {/* Layout: Image Top */}
        {side.layout === "image-top" && side.image && (
          <div className="mb-6 relative aspect-[4/3] w-full bg-neutral-100 overflow-hidden shadow-inner">
            <Image
              src={side.image}
              alt={side.title}
              fill
              className="object-cover sepia-[0.2]"
            />
          </div>
        )}

        {/* Layout: Image Split (e.g. for side-by-side feel if we had width, but here vertical stack) */}
        {side.layout === "image-split" && side.image && (
          <div className="mb-6 relative h-1/2 w-full bg-neutral-100 overflow-hidden">
            <Image
              src={side.image}
              alt={side.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Full Image Background */}
        {isImageFull && side.image && (
          <div className="absolute inset-0 z-0">
            <Image
              src={side.image}
              alt={side.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
        )}

        {/* Text Content */}
        <div
          className={`relative z-10 ${
            isImageFull ? "p-10 text-white text-center" : ""
          }`}
        >
          {side.isCover ? (
            <div className="h-full flex flex-col justify-center text-center">
              <div className="mb-6 mx-auto w-16 h-16 border rounded-full flex items-center justify-center border-neutral-300 text-neutral-400">
                <span className="font-playfair text-2xl italic">A</span>
              </div>
              <h1 className="text-5xl sm:text-7xl font-playfair font-medium text-neutral-900 leading-[0.9] tracking-tight mb-4">
                {side.title}
              </h1>
              {side.subtitle && (
                <p className="text-lg sm:text-xl text-neutral-500 font-playfair italic">
                  {side.subtitle}
                </p>
              )}
              {side.body && (
                <div className="mt-8 flex justify-center">
                  <p className="text-sm text-neutral-600 leading-loose max-w-xs font-serif border-t border-black/10 pt-6">
                    {side.body}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className={isImageFull ? "" : "text-center"}>
              <h2
                className={`text-2xl sm:text-3xl font-playfair font-medium mb-3 ${
                  isImageFull ? "text-white" : "text-neutral-900"
                }`}
              >
                {side.title}
              </h2>
              {side.subtitle && (
                <p
                  className={`text-sm tracking-widest uppercase mb-6 ${
                    isImageFull ? "text-white/80" : "text-neutral-500"
                  }`}
                >
                  {side.subtitle}
                </p>
              )}
              {side.body && (
                <p
                  className={`text-[15px] leading-7 font-serif ${
                    isImageFull
                      ? "text-white/90 drop-shadow-md"
                      : "text-neutral-700"
                  }`}
                >
                  {side.body}
                </p>
              )}

              {side.isClosing && side.ctaHref && side.ctaLabel && (
                <div className="mt-12">
                  <Link
                    href={side.ctaHref}
                    className="inline-block px-8 py-3 bg-neutral-900 text-white text-xs tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors"
                  >
                    {side.ctaLabel}
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Page Number */}
      <div
        className={`mt-4 text-center text-[10px] tracking-widest font-mono ${
          isImageFull ? "text-white/50 relative z-10" : "text-neutral-300"
        }`}
      >
        {pageNumber}
      </div>
    </div>
  );
}

export default function StoryPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const spreads: Spread[] = useMemo(
    () => [
      {
        left: {
          isCover: true,
          title: "Aama Ko Nana",
          subtitle: "The warmth of a mother’s love",
          body: "A journey from a simple question to a beloved brand, stitched with care for Nepal’s newborns.",
          layout: "text-only",
        },
        right: {
          kicker: "CHAPTER I",
          title: "The Beginning",
          subtitle: "Where it all started",
          body: "Our story didn’t start in a boardroom—it started at home. Watching baby clothes lose shape, fade, and tear after a single wash left us asking a hard question: why should parents accept less for their children? from frustration came purpose.",
          image: "/images/story/beginning.jpg", // Placeholder logic handled by Image component (will show broken or alt if missing, I should probably add a real placeholder fallback in src)
          layout: "image-top",
        },
      },
      {
        left: {
          kicker: "CHAPTER I (CONT.)",
          title: "The First Step",
          body: "With belief stronger than resources, we invested Rs. 50,000 in premium malmal fabric. 50 sets, stitched by hand, testing every seam for softness. They sold out in 7 days. It wasn't just a sale; it was trust.",
          layout: "text-only",
        },
        right: {
          kicker: "CHAPTER II",
          title: "Launch Day",
          subtitle: "A name rooted in love",
          body: "When 'Aama' was taken, we chose 'Aamako Nana'—grandmother's clothes. A reminder of warmth, wisdom, and care. That name became our identity and our responsibility to every family we serve.",
          layout: "image-full",
          image: "/images/story/launch.jpg",
        },
      },
      {
        left: {
          kicker: "CHAPTER III",
          title: "Growing Together",
          body: "Social media became our voice. Through honest conversations and behind-the-scenes moments, families across Nepal connected with us. From a small room to our own factory in Basundhara, we grew without losing our soul.",
          layout: "image-top",
          image:
            "https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=",
        },
        right: {
          kicker: "CHAPTER III (CONT.)",
          title: "Thoughtful Design",
          subtitle: "Essentials re-imagined",
          body: "We design newborn essentials, Pasni outfits, and bedding that feel as comforting as home. Nothing is mass-produced without intention. Every piece carries cultural meaning and modern design.",
          layout: "text-only",
        },
      },
      {
        left: {
          kicker: "CHAPTER IV",
          title: "Premium Materials",
          body: "Fabric is where quality begins. We select the finest cotton, malmal, and flannel. Breathability, softness, durability—we test for it all. We design for real life: washing, wearing, and repeating.",
          layout: "image-split",
          image: "/images/story/materials.jpg",
        },
        right: {
          kicker: "CHAPTER V",
          title: "Our Values",
          subtitle: "Quality is non-negotiable",
          body: "Our pricing reflects honest craftsmanship. We test colors for safety, check seams for strength, and review every detail. Quality isn’t a feature; it’s a promise we keep for your little ones.",
          layout: "text-only",
        },
      },
      {
        left: {
          kicker: "CHAPTER VI",
          title: "No Shortcuts",
          body: "We refuse shortcuts because babies don’t get second chances at comfort. From sourcing to packaging, every step is intentional. Parents should never have to question what touches their baby’s skin.",
          layout: "image-top",
          image: "/images/story/quality.jpg",
        },
        right: {
          kicker: "CHAPTER VII",
          title: "Our Impact",
          subtitle: "Empowering our community",
          body: "We employ 18 skilled individuals, training women in traditional crafts. By creating stable income and skills, we’re helping families grow stronger. Business can be compassionate.",
          layout: "text-only",
        },
      },
      {
        left: {
          kicker: "THE FUTURE",
          title: "Our Vision",
          body: "We imagine a future where every newborn in Nepal has access to safe, high-quality clothing. Aamako Nana is a platform for preservation, empowerment, and setting a new standard for care.",
          layout: "image-full",
          image: "/images/story/vision.jpg",
        },
        right: {
          isClosing: true,
          title: "Join Our Story",
          body: "Every choice supports thoughtful design and ethical production. Together, we are stitching comfort, culture, and compassion into every beginning.",
          ctaLabel: "Shop Our Collection",
          ctaHref: "/products",
          layout: "text-only",
        },
      },
    ],
    []
  );

  const maxFlip = spreads.length - 1;
  const [targetProgress, setTargetProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    let rafId = 0;
    const tick = () => {
      setDisplayProgress((prev) => {
        const next = prev + (targetProgress - prev) * 0.1;
        return Math.abs(next - targetProgress) < 0.0005 ? targetProgress : next;
      });
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [targetProgress]);

  useEffect(() => {
    const metrics = {
      containerTop: 0,
      containerHeight: 0,
      windowHeight: 0,
      totalScrollableDistance: 0,
    };

    const updateMetrics = () => {
      if (!containerRef.current) return;
      metrics.containerTop = containerRef.current.offsetTop;
      metrics.containerHeight = containerRef.current.offsetHeight;
      metrics.windowHeight = window.innerHeight;
      metrics.totalScrollableDistance =
        metrics.containerHeight - metrics.windowHeight;
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      if (metrics.containerHeight === 0) updateMetrics();

      const scrollTop = window.scrollY;
      const scrolledInContainer = scrollTop - metrics.containerTop;

      let progress = 0;
      if (metrics.totalScrollableDistance > 0) {
        progress = scrolledInContainer / metrics.totalScrollableDistance;
      }

      const clamped = clamp(progress, 0, 1);
      setTargetProgress(clamped * maxFlip);
    };

    const handleResize = () => {
      updateMetrics();
      handleScroll();
    };

    updateMetrics();
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [maxFlip]);

  const activeIndex = clamp(Math.floor(displayProgress), 0, maxFlip);
  const localT = clamp(displayProgress - activeIndex, 0, 1);
  const turnT = easeInOutCubic(localT);

  const currentSpread = spreads[activeIndex];
  const nextSpread = spreads[Math.min(activeIndex + 1, maxFlip)];

  const baseLeftSide = currentSpread.left;
  const baseLeftNum = activeIndex * 2 + 1;

  const baseRightSide = nextSpread.right;
  const baseRightNum = (activeIndex + 1) * 2 + 2;

  const flipFrontSide = currentSpread.right;
  const flipFrontNum = activeIndex * 2 + 2;

  const flipBackSide = nextSpread.left;
  const flipBackNum = (activeIndex + 1) * 2 + 1;

  const rotation = -180 * turnT;
  const faceSwap = smoothstep(0.48, 0.52, localT);

  return (
    <div
      ref={containerRef}
      className="relative bg-[#EAE8E4]"
      style={{
        height: `${spreads.length * 100}vh`,
      }}
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center p-4 pt-18 overflow-hidden">
        <div className="w-full max-w-6xl flex flex-col items-center transform scale-[0.85] sm:scale-100 transition-transform duration-300">
          {/* Progress UI */}
          <div className="mb-8 text-center opacity-80">
            <p className="text-[10px] tracking-[0.2em] font-medium text-neutral-500 mb-2 uppercase">
              Story Progress
            </p>
            <div className="h-1 w-32 mx-auto rounded-full bg-neutral-200 overflow-hidden">
              <div
                className="h-full bg-neutral-800 transition-all duration-300"
                style={{ width: `${(displayProgress / maxFlip) * 100}%` }}
              />
            </div>
          </div>

          <div
            className="relative shadow-2xl rounded-sm"
            style={{ perspective: "2000px", overflow: "visible" }}
          >
            {/* Static Background Layer - Using absolute to match flip layer dimensions exactly */}
            <div
              className="relative bg-[#FDFBF7]"
              style={{ minHeight: "550px", width: "900px", maxWidth: "90vw" }}
            >
              {/* Left Static Page */}
              <div
                className="absolute top-0 left-0 w-1/2 h-full z-0"
                style={{
                  transform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                }}
              >
                <Page side={baseLeftSide} pageNumber={baseLeftNum} />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/5 to-transparent" />
              </div>

              {/* Right Static Page */}
              <div
                className="absolute top-0 right-0 w-1/2 h-full z-0"
                style={{
                  transform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                }}
              >
                <Page side={baseRightSide} pageNumber={baseRightNum} />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-l from-black/5 to-transparent" />
              </div>

              {/* Spine Detail - Moved inside the container */}
              <div className="absolute inset-y-0 left-1/2 w-[1px] -translate-x-1/2 bg-black/10 z-10" />
              <div className="absolute inset-y-0 left-1/2 w-12 -translate-x-1/2 bg-gradient-to-r from-transparent via-black/[0.05] to-transparent z-10" />

              {/* Flipping Sheet */}
              {displayProgress < maxFlip && (
                <div
                  className="absolute top-0 right-0 h-full w-1/2"
                  style={{
                    transformStyle: "preserve-3d",
                    transformOrigin: "left center",
                    transform: `rotateY(${rotation}deg)`,
                    zIndex: 20,
                    willChange: "transform",
                  }}
                >
                  {/* Front of the flipping page (Current Right) */}
                  <div
                    className="absolute inset-0 backface-hidden bg-[#FDFBF7]"
                    style={{
                      backfaceVisibility: "hidden",
                      opacity: 1 - faceSwap,
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <Page side={flipFrontSide} pageNumber={flipFrontNum} />
                    <div className="absolute inset-0 bg-gradient-to-l from-black/5 to-transparent pointer-events-none" />
                  </div>

                  {/* Back of the flipping page (Next Left) */}
                  <div
                    className="absolute inset-0 bg-[#FDFBF7]"
                    style={{
                      transform: "rotateY(180deg)",
                      opacity: faceSwap,
                      // backfaceVisibility: 'hidden',
                      // WebkitBackfaceVisibility: 'hidden'
                    }}
                  >
                    <Page side={flipBackSide} pageNumber={flipBackNum} />
                    {/* Shadow/Lighting for back face */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent pointer-events-none" />
                  </div>

                  {/* Dynamic Lighting Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(0,0,0,0.02), rgba(255,255,255,0.1), rgba(0,0,0,0.02))",
                      opacity: Math.sin(Math.PI * localT) * 0.4,
                      mixBlendMode: "multiply",
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <p className="mt-8 text-center text-[10px] tracking-widest text-neutral-400 font-medium uppercase animate-pulse">
            Scroll to read
          </p>
        </div>
      </div>
    </div>
  );
}
