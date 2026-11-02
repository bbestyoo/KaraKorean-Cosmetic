'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';

// Reveal-on-scroll wrapper
function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(36px)',
      }}
    >
      {children}
    </div>
  );
}

// ─── Marquee strip ────────────────────────────────────────────────────────────
const STRIP_TEXT = ['Korean Beauty · Est. 2018', 'Kara', 'Authentic K-Beauty', 'Kara', 'Crafted with Care', 'Kara', '100% Authentic', 'Kara'];

export default function AboutPage() {
  return (
    <>
      <main className="bg-[#f7f6f2] text-[#111] overflow-x-hidden">

        {/* ══════════════════════════════════════════════════════════ */}
        {/* HERO — full-viewport video                                */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="relative w-full h-screen overflow-hidden">
          {/* Background video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=1600&auto=format&fit=crop"
          >
            <source
              src="/videos/clip4.mp4"
              type="video/mp4"
            />
          </video>

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Hero text */}
          <div className="relative h-full flex flex-col items-center justify-center text-white text-center px-6">
            <p className="text-[11px] tracking-[0.35em] uppercase mb-6 opacity-80 font-medium">
              Experience Importing Beauty Since 2018 · Kathmandu, Nepal
            </p>
            <h1
              className="text-6xl sm:text-8xl md:text-[9rem] font-black uppercase tracking-tight leading-none mb-6"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Kara
            </h1>
            <p className="text-lg sm:text-xl font-light tracking-[0.15em] uppercase opacity-90 mb-10">
              Authentic Korean Beauty Store
            </p>
            <Link
              href="/products"
              className="border border-white text-white px-10 py-3.5 text-[11px] uppercase tracking-[0.22em] font-bold hover:bg-white hover:text-[#111] transition-colors duration-300"
            >
              Explore Collection
            </Link>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60">
            <span className="text-[10px] tracking-[0.25em] uppercase">Scroll</span>
            <div className="w-px h-10 bg-white/40 animate-pulse" />
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* MARQUEE STRIP                                              */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div className="border-y border-[#111] bg-[#f7f6f2] overflow-hidden py-3.5">
          <div
            className="flex gap-10 whitespace-nowrap"
            style={{ animation: 'marquee 22s linear infinite' }}
          >
            {[...STRIP_TEXT, ...STRIP_TEXT].map((t, i) => (
              <span key={i} className="text-[11px] font-black uppercase tracking-[0.3em] text-[#111]">
                {t}
              </span>
            ))}
          </div>
          <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* WELCOME INTRODUCTION                                      */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="max-w-5xl mx-auto px-6 lg:px-12 py-24 lg:py-32 text-center">
          <Reveal>
            <p className="text-[11px] font-black tracking-[0.3em] uppercase text-neutral-400 mb-6">
              Welcome to Kara
            </p>
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase leading-tight tracking-tight mb-10"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Authentic Beauty. <br className="hidden sm:block" />
              Lasting Trust.
            </h2>
            <div className="max-w-3xl mx-auto space-y-6 text-base text-neutral-600 leading-relaxed">
              <p>
                Welcome to Kara Korean Beauty Store, your trusted destination for authentic Korean skincare and beauty products. Built on a passion for beauty and a commitment to authenticity, we bring together carefully selected beauty essentials to help you discover products you can feel confident choosing.
              </p>
              <p>
                We believe that beauty is personal, skincare is self-care, and trust is the foundation of every lasting relationship. Our commitment goes beyond products — it is about providing a beauty experience built on quality, transparency, and care.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* THE KARA AESTHETIC — offset image triptych                 */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="max-w-[1700px] mx-auto px-2 sm:px-6 lg:px-12 pb-24 lg:pb-32">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 items-end">
            <Reveal className="col-span-2 md:col-span-1">
              <figure className="group relative aspect-[3/4] overflow-hidden bg-neutral-200">
                <Image
                  src="/images/karaimages/makeupmodel.webp"
                  alt="Korean beauty makeup ritual"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <figcaption className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white text-[10px] uppercase tracking-[0.25em] opacity-0 group-hover:opacity-100 transition-opacity">
                  The Ritual
                </figcaption>
              </figure>
            </Reveal>

            <Reveal delay={100} className="md:pb-14">
              <figure className="group relative aspect-[4/5] overflow-hidden bg-neutral-200">
                <Image
                  src="/images/karacollection9.jpg"
                  alt="Kara Korean beauty selection"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <figcaption className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white text-[10px] uppercase tracking-[0.25em] opacity-0 group-hover:opacity-100 transition-opacity">
                  The Selection
                </figcaption>
              </figure>
            </Reveal>

            <Reveal delay={200}>
              <figure className="group relative aspect-[3/4] overflow-hidden bg-neutral-200">
                <Image
                  src="/images/model3.webp"
                  alt="Korean skincare glow"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <figcaption className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white text-[10px] uppercase tracking-[0.25em] opacity-0 group-hover:opacity-100 transition-opacity">
                  The Glow
                </figcaption>
              </figure>
            </Reveal>

            <Reveal delay={300} className="md:pb-14">
              <figure className="group relative aspect-[4/5] overflow-hidden bg-neutral-200">
                <Image
                  src="/images/karaimages/bojmodel.webp"
                  alt="Beauty of Joseon Korean beauty"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <figcaption className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white text-[10px] uppercase tracking-[0.25em] opacity-0 group-hover:opacity-100 transition-opacity">
                  The Trust
                </figcaption>
              </figure>
            </Reveal>
          </div>
          <Reveal delay={150}>
            <p className="text-center text-[10px] tracking-[0.35em] uppercase text-neutral-400 mt-8">
              Korean beauty, thoughtfully curated
            </p>
          </Reveal>
        </section>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* OUR STORY — editorial 2-col                               */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Images left */}
            <Reveal className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/about-product-1.webp"
                  alt="Korean skincare products"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[3/4] overflow-hidden mt-10">
                <Image
                  src="/images/about-product-2.jpg"
                  alt="Skincare routine"
                  fill
                  className="object-cover object-left"
                />
              </div>
            </Reveal>

            {/* Text right */}
            <Reveal delay={150} className="flex flex-col justify-center">
              <p className="text-[11px] font-black tracking-[0.3em] uppercase text-neutral-400 mb-5">
                Our Story
              </p>
              <h2
                className="text-4xl sm:text-5xl lg:text-[3.2rem] font-black uppercase leading-none tracking-tight mb-8"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                A Journey Built
                <span className="block mt-2">on Authenticity</span>
              </h2>
              <div className="space-y-5 text-base text-neutral-600 leading-relaxed mb-10">
                <p>
                  At Kara Korean Beauty Store, our journey is driven by a simple yet powerful vision: to make genuine Korean beauty products accessible to customers who value quality and authenticity.
                </p>
                <p>
                  With experience importing beauty products since 2018, we have developed a deep appreciation for the evolving world of Korean skincare and cosmetics. Over the years, our focus has remained on bringing authentic products to our customers while building relationships founded on trust and reliability.
                </p>
                <p>
                  What began with a passion for beauty continues to grow with one purpose — to make discovering and shopping for genuine beauty products a reassuring, enjoyable, and rewarding experience.
                </p>
              </div>
              <Link
                href="/products"
                className="self-start text-[11px] font-black tracking-[0.22em] uppercase border-b-2 border-[#111] pb-0.5 hover:opacity-60 transition-opacity"
              >
                Shop Authentic K-Beauty →
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* THE JOURNEY — numbered timeline with imagery               */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="border-y border-[#ddd] bg-[#f3f2ee]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
            <Reveal>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-16">
                <div>
                  <p className="text-[11px] font-black tracking-[0.3em] uppercase text-neutral-400 mb-4">
                    Since 2018
                  </p>
                  <h2
                    className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black uppercase leading-none tracking-tight"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    The Journey
                  </h2>
                </div>
                <p className="max-w-sm text-sm text-neutral-600 leading-relaxed sm:text-right">
                  From a passion for Korean beauty to a trusted store — every step shaped by authenticity.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
              {[
                {
                  step: '01',
                  year: '2018',
                  title: 'A Passion Begins',
                  body: 'Our story starts with importing beauty products and a growing appreciation for Korean skincare philosophy.',
                  img: '/images/about-bts-1.jpg',
                },
                {
                  step: '02',
                  year: 'Today',
                  title: 'Trusted Selection',
                  body: 'A carefully curated collection of cleansers, toners, serums, moisturizers, sunscreens, masks, and makeup.',
                  img: '/images/karacollection2.webp',
                },
                {
                  step: '03',
                  year: 'Tomorrow',
                  title: 'Beauty Without Borders',
                  body: 'Growing with purpose — serving beauty lovers across Nepal and around the world with genuine products.',
                  img: '/images/karacollection3.webp',
                },
              ].map(({ step, year, title, body, img }, i) => (
                <Reveal key={step} delay={i * 120}>
                  <article className="group">
                    <div className="relative aspect-[4/3] overflow-hidden mb-6">
                      <Image
                        src={img}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span
                        className="absolute top-3 left-3 text-[10px] font-black tracking-[0.2em] uppercase bg-[#f7f6f2] text-[#111] px-3 py-1.5"
                      >
                        {year}
                      </span>
                    </div>
                    <div className="flex items-start gap-4">
                      <span
                        className="text-3xl font-black text-neutral-300 leading-none"
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        {step}
                      </span>
                      <div>
                        <h3 className="text-lg font-black uppercase tracking-wide mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                          {title}
                        </h3>
                        <p className="text-sm text-neutral-600 leading-relaxed">{body}</p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* FULL-WIDTH EDITORIAL IMAGE                                 */}
        {/* ══════════════════════════════════════════════════════════ */}
        <Reveal>
          <section className="relative w-full h-[60vh] lg:h-[80vh] overflow-hidden">
            <Image
              src="/images/about-banner-1.jpg"
              alt="Korean beauty skincare flat lay"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <blockquote className="text-white text-center max-w-3xl px-8">
                <p
                  className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase leading-tight tracking-tight mb-6"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  "Skin is the story you wear every day."
                </p>
                <cite className="text-[11px] tracking-[0.3em] uppercase opacity-80 not-italic">— The Kara Philosophy</cite>
              </blockquote>
            </div>
          </section>
        </Reveal>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* COMMITMENT TO AUTHENTICITY                                */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="max-w-6xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-[11px] font-black tracking-[0.3em] uppercase text-neutral-400 mb-5">
                Our Commitment
              </p>
              <h2
                className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black uppercase leading-none tracking-tight mb-6"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                100% Authentic Products.
                <span className="block mt-2">No Compromise.</span>
              </h2>
              <p className="max-w-2xl mx-auto text-base text-neutral-600 leading-relaxed">
                Authenticity is at the heart of everything we do. We understand that when it comes to skincare and cosmetics, knowing what you are purchasing matters.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <Reveal className="relative">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/images/about-product-3.webp"
                  alt="Authentic Korean beauty products"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {/* Overlapping detail image */}
              <div className="absolute -bottom-8 -right-4 sm:-right-8 w-32 sm:w-44 aspect-[3/4] overflow-hidden border-4 border-[#f7f6f2] shadow-xl">
                <Image
                  src="/images/karaimages/bojproduct.webp"
                  alt="Genuine Korean beauty product"
                  fill
                  sizes="176px"
                  className="object-cover"
                />
              </div>
              {/* Authenticity seal */}
              <div className="absolute -top-5 -left-3 sm:-left-5 h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-[#111] text-white flex flex-col items-center justify-center text-center">
                <span className="text-[9px] tracking-[0.2em] uppercase opacity-70">Verified</span>
                <span className="text-xl sm:text-2xl font-black leading-none" style={{ fontFamily: 'Georgia, serif' }}>100%</span>
                <span className="text-[8px] tracking-[0.15em] uppercase opacity-70 mt-1">Authentic</span>
              </div>
            </Reveal>
            <Reveal delay={150} className="space-y-6 md:pl-4 lg:pl-10">
              <p className="text-base text-neutral-600 leading-relaxed">
                That is why we are committed to sourcing genuine products through reliable supply channels and providing clear product information.
              </p>
              <p className="text-base text-neutral-600 leading-relaxed">
                Every beauty purchase should come with confidence. Our goal is to give our customers greater peace of mind by prioritizing authenticity, product quality, and transparency.
              </p>
              <p className="text-lg font-semibold text-[#111] leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                At Kara, trust is not just a promise. It is the standard we strive to uphold with every order.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#ddd]">
                <div>
                  <p className="text-3xl font-black leading-none mb-2" style={{ fontFamily: 'Georgia, serif' }}>2018</p>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">Importing Since</p>
                </div>
                <div>
                  <p className="text-3xl font-black leading-none mb-2" style={{ fontFamily: 'Georgia, serif' }}>Nepal+</p>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">Worldwide Delivery</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* FROM KOREA TO YOU                                         */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="border-y border-[#ddd] bg-[#f3f2ee]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <Reveal className="order-2 lg:order-1 space-y-6">
                <p className="text-[11px] font-black tracking-[0.3em] uppercase text-neutral-400">
                  From Korea's Beauty Innovation
                </p>
                <h2
                  className="text-4xl sm:text-5xl lg:text-[3.2rem] font-black uppercase leading-none tracking-tight"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  To Your Daily Routine
                </h2>
                <div className="space-y-5 text-base text-neutral-600 leading-relaxed">
                  <p>
                    Inspired by Korean skincare philosophies, innovative formulations, and thoughtful beauty rituals, we offer a carefully curated selection of skincare and cosmetics for different preferences and beauty needs.
                  </p>
                  <p>
                    From cleansers, toners, essences, serums, and moisturizers to sunscreens, masks, and makeup essentials, our collection is designed to help you explore and build a routine that works for you.
                  </p>
                  <p>
                    Whether you are beginning your skincare journey or refining a routine you already love, we aim to make your beauty discoveries easier and more enjoyable.
                  </p>
                </div>
                <Link
                  href="/products"
                  className="inline-block text-[11px] font-black tracking-[0.22em] uppercase border-b-2 border-[#111] pb-0.5 hover:opacity-60 transition-opacity"
                >
                  Discover Our Collection →
                </Link>
              </Reveal>
              <Reveal delay={150} className="order-1 lg:order-2 relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/images/about-product-4.webp"
                  alt="Korean beauty routine"
                  fill
                  className="object-cover"
                />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* WHY CHOOSE KARA                                            */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-[11px] font-black tracking-[0.3em] uppercase text-neutral-400 mb-5">
                A Better Beauty Experience
              </p>
              <h2
                className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black uppercase leading-none tracking-tight mb-6"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Why Choose Kara
              </h2>
              <p className="max-w-2xl mx-auto text-base text-neutral-600 leading-relaxed">
                A beauty experience built around you.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Authenticity You Can Trust',
                body: 'We prioritize genuine products and responsible sourcing so you can shop with greater confidence.',
                img: '/images/karaimages/bojproduct.webp',
              },
              {
                title: 'Experience That Matters',
                body: 'Our experience in importing beauty products since 2018 reflects our ongoing commitment to understanding the beauty market and serving our customers.',
                img: '/images/karacollection2.webp',
              },
              {
                title: 'Customer-First Approach',
                body: 'We value every customer and strive to provide responsive assistance, clear communication, and a smooth shopping experience.',
                img: '/images/karaimages/makeupmodel.webp',
              },
              {
                title: 'Thoughtfully Selected Beauty',
                body: 'We focus on bringing together skincare and beauty essentials that help customers make informed choices according to their individual needs and preferences.',
                img: '/images/anua-serum.webp',
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 100} className="group border-t border-[#111] pt-6">
                <div className="relative aspect-square overflow-hidden bg-neutral-200 mb-6">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span
                    className="absolute top-2 left-2 text-[10px] font-black tracking-[0.2em] text-[#111] bg-[#f7f6f2]/90 px-2 py-1"
                  >
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-black uppercase tracking-wide mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* MISSION & VISION                                          */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="border-t border-[#ddd]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <Reveal className="border-b lg:border-b-0 lg:border-r border-[#ddd]">
              <div className="max-w-xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
                <div className="relative aspect-[16/9] overflow-hidden mb-10">
                  <Image
                    src="/images/karaimages/image1.avif"
                    alt="Kara mission — authentic Korean beauty"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <p className="text-[11px] font-black tracking-[0.3em] uppercase text-neutral-400 mb-5">
                  Our Mission
                </p>
                <h2
                  className="text-4xl sm:text-5xl font-black uppercase leading-none tracking-tight mb-8"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Making Authentic K-Beauty Accessible
                </h2>
                <p className="text-base text-neutral-600 leading-relaxed">
                  Our mission is to make authentic Korean beauty accessible through genuine products, thoughtful selection, transparent service, and a customer experience built on trust. We want every customer to feel informed, valued, and confident throughout their beauty journey.
                </p>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="max-w-xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
                <div className="relative aspect-[16/9] overflow-hidden mb-10">
                  <Image
                    src="/images/karaimages/image2.webp"
                    alt="Kara vision — growing with trust"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <p className="text-[11px] font-black tracking-[0.3em] uppercase text-neutral-400 mb-5">
                  Our Vision
                </p>
                <h2
                  className="text-4xl sm:text-5xl font-black uppercase leading-none tracking-tight mb-8"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Growing Together with Trust
                </h2>
                <p className="text-base text-neutral-600 leading-relaxed">
                  Our vision is to grow as a respected name in Korean beauty, connecting customers with authentic products and a more thoughtful approach to skincare and self-care. We aspire to build lasting relationships with our customers through consistency, integrity, and a genuine passion for beauty.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* BEAUTY WITHOUT BORDERS                                    */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="bg-[#111] text-white overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <Reveal className="relative min-h-[420px] lg:min-h-[720px] order-1">
              <Image
                src="/images/crophero.webp"
                alt="Kara Korean beauty model"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-[center_30%]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-[#111]/70 lg:to-[#111]" />
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-[10px] tracking-[0.35em] uppercase opacity-70 mb-2">Kathmandu · Worldwide</p>
                <p className="text-2xl sm:text-3xl font-black uppercase tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                  A Glow That Travels
                </p>
              </div>
            </Reveal>

            <Reveal delay={150} className="order-2 flex items-center">
              <div className="px-6 sm:px-12 lg:px-16 py-20 lg:py-28">
                <p className="text-[11px] tracking-[0.35em] uppercase mb-6 opacity-60">
                  From Nepal to the World
                </p>
                <h2
                  className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase leading-tight tracking-tight mb-8"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Beauty
                  <span className="block">Without Borders</span>
                </h2>
                <div className="space-y-6 text-base leading-relaxed opacity-90">
                  <p>
                    We believe that authentic beauty should be accessible beyond geographical boundaries.
                  </p>
                  <p>
                    Through our commitment to customer care and convenient shopping, we aim to serve beauty lovers across Nepal and internationally, helping them discover the world of Korean skincare and cosmetics wherever eligible delivery is available.
                  </p>
                  <p>
                    Wherever you are, we want your experience with Kara to feel personal, dependable, and reassuring.
                  </p>
                </div>
                <div className="flex flex-wrap gap-x-10 gap-y-4 mt-10 pt-8 border-t border-white/20">
                  {[
                    { k: 'Nepal', v: 'Nationwide Delivery' },
                    { k: 'Worldwide', v: 'International Shipping' },
                    { k: '100%', v: 'Authentic Products' },
                  ].map(({ k, v }) => (
                    <div key={k}>
                      <p className="text-xl font-black uppercase tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>{k}</p>
                      <p className="text-[10px] tracking-[0.2em] uppercase opacity-60 mt-1">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* THE KARA PROMISE                                          */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="max-w-4xl mx-auto px-6 lg:px-12 py-24 lg:py-32 text-center">
          <Reveal>
            <p className="text-[11px] font-black tracking-[0.3em] uppercase text-neutral-400 mb-6">
              Our Promise
            </p>
            <h2
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black uppercase leading-none tracking-tight mb-10"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              The Kara Promise
            </h2>
            <div className="space-y-6 text-base text-neutral-600 leading-relaxed mb-12">
              <p>
                We promise to keep authenticity at the center of our business, treat our customers with care, communicate transparently, and continuously work to improve your shopping experience.
              </p>
              <p className="text-lg text-[#111]" style={{ fontFamily: 'Georgia, serif' }}>
                Your trust inspires us. Your confidence motivates us. And your beauty journey is what we are proud to be part of.
              </p>
            </div>
            <p className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-3" style={{ fontFamily: 'Georgia, serif' }}>
              Discover Your Beauty. Trust Your Choice.
            </p>
            <p className="text-sm text-neutral-500">
              Thank you for choosing Kara Korean Beauty Store and becoming part of our journey.
            </p>
          </Reveal>
        </section>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STORE LOCATION                                             */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="border-t border-[#ddd] max-w-[1700px] mx-auto px-6 lg:px-12 py-24">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-[11px] tracking-[0.35em] uppercase text-neutral-400 mb-4">Visit Us</p>
              <h2
                className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-6"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Our Store Location
              </h2>
              <p className="text-base text-neutral-600">Reliable Delivery, Wherever You Are</p>
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
            <div className="relative w-full col-span-2 aspect-[16/9] overflow-hidden">
              <iframe
                src="https://www.google.com/maps?q=27.7376772,85.3348645&z=18&output=embed"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kara Korean Beauty Store location"
              />
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-base text-neutral-600 mb-4">Visit our store at:</p>
              <address className="not-italic text-neutral-900 font-semibold mb-4">Kara Korean Beauty Store<br />Kathmandu, Nepal</address>
              <p className="text-sm text-neutral-600 mb-4">Open daily 10:00 — 20:00</p>
              <p className="text-sm text-neutral-600 mb-6">We are committed to making beauty shopping convenient through nationwide delivery across Nepal and international shipping to customers around the world, subject to destination and shipping availability.</p>
              <a
                href="https://www.google.com/maps/place/Kara+Korean+Beauty+Store/@27.737714,85.3347341,20.39z/data=!4m6!3m5!1s0x39eb19005b6234c9:0x240b20f661c49f26!8m2!3d27.7376772!4d85.3348645!16s%2Fg%2F11xl9w0yvf?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-black tracking-[0.22em] uppercase border-b border-[#111] pb-0.5 hover:opacity-60 transition-opacity self-start"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* LIFE AT KARA — asymmetric gallery mosaic                   */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-[11px] tracking-[0.35em] uppercase text-neutral-400 mb-4">Life at Kara</p>
              <h2
                className="text-4xl sm:text-5xl font-black uppercase tracking-tight"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Behind the Shelves
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[160px] sm:auto-rows-[220px] lg:auto-rows-[240px] gap-2 sm:gap-4">
            {[
              { src: '/images/karaimages/image1.avif', alt: 'Korean beauty editorial', span: 'col-span-2 row-span-2' },
              { src: '/images/karaimages/clenser.webp', alt: 'Korean cleanser', span: 'col-span-1 row-span-1' },
              { src: '/images/karaimages/facemask.webp', alt: 'Korean face mask', span: 'col-span-1 row-span-1' },
              { src: '/images/model1.webp', alt: 'K-beauty model', span: 'col-span-1 row-span-1' },
              { src: '/images/karaimages/sunscreen.webp', alt: 'Korean sunscreen', span: 'col-span-1 row-span-1' },
              { src: '/images/karaimages/bojproduct.webp', alt: 'Beauty of Joseon product', span: 'col-span-2 row-span-1' },
              { src: '/images/karaimages/makeupmodel.webp', alt: 'Makeup ritual', span: 'col-span-1 row-span-2' },
              { src: '/images/anua-serum.webp', alt: 'Anua serum', span: 'col-span-1 row-span-1' },
              { src: '/images/karaimages/image5.webp', alt: 'Kara collection', span: 'col-span-2 lg:col-span-2 row-span-1' },
            ].map(({ src, alt, span }, i) => (
              <Reveal key={i} delay={i * 60} className={`group relative overflow-hidden bg-neutral-200 ${span}`}>
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* SHOP THE ROUTINE — category tiles                          */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="border-t border-[#ddd] bg-[#f3f2ee]">
          <div className="max-w-[1700px] mx-auto px-6 lg:px-12 py-24 lg:py-32">
            <Reveal>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
                <div>
                  <p className="text-[11px] font-black tracking-[0.3em] uppercase text-neutral-400 mb-4">
                    Build Your Routine
                  </p>
                  <h2
                    className="text-4xl sm:text-5xl font-black uppercase leading-none tracking-tight"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    Explore the Collection
                  </h2>
                </div>
                <Link
                  href="/products"
                  className="self-start text-[11px] font-black tracking-[0.22em] uppercase border-b-2 border-[#111] pb-0.5 hover:opacity-60 transition-opacity"
                >
                  Shop All Products →
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
              {[
                { label: 'Cleansers', cat: 'cleanser', img: '/images/karaimages/clenser.webp' },
                { label: 'Toners', cat: 'toner', img: '/images/karaimages/image4.webp' },
                { label: 'Serums', cat: 'serum', img: '/images/anua-serum.webp' },
                { label: 'Moisturizers', cat: 'moisturizer', img: '/images/karaimages/bojproduct.webp' },
                { label: 'Sunscreens', cat: 'sunscreen', img: '/images/karaimages/sunscreen.webp' },
                { label: 'Masks', cat: 'mask', img: '/images/karaimages/facemask.webp' },
              ].map(({ label, cat, img }, i) => (
                <Reveal key={label} delay={i * 80}>
                  <Link
                    href={`/products?category=${encodeURIComponent(cat)}`}
                    className="group block"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-200">
                      <Image
                        src={img}
                        alt={label}
                        fill
                        sizes="(max-width: 768px) 50vw, 17vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <p className="text-white text-sm sm:text-base font-black uppercase tracking-widest drop-shadow">
                          {label}
                        </p>
                        <span className="inline-block mt-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/0 group-hover:text-white/90 transition-colors">
                          Shop now →
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* CTA STRIP                                                  */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="border-t border-[#ddd] bg-[#f7f6f2] py-24 px-6 text-center">
          <Reveal>
            <p className="text-[11px] tracking-[0.35em] uppercase text-neutral-400 mb-5">Find your routine</p>
            <h2
              className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-6"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Not sure where to start?
            </h2>
            <p className="text-base text-neutral-500 max-w-md mx-auto mb-10 leading-relaxed">
              Take our 2-minute skin quiz and we'll recommend the perfect Korean beauty routine personalised just for you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/quiz"
                className="px-10 py-4 bg-[#111] text-white text-[11px] font-black tracking-[0.22em] uppercase hover:bg-[#333] transition-colors"
              >
                Take the Skin Quiz
              </Link>
              <Link
                href="/products"
                className="px-10 py-4 border border-[#111] text-[#111] text-[11px] font-black tracking-[0.22em] uppercase hover:bg-[#111] hover:text-white transition-colors"
              >
                Shop All Products
              </Link>
            </div>
            <p className="text-lg sm:text-xl font-black uppercase tracking-tight mt-12" style={{ fontFamily: 'Georgia, serif' }}>
              Kara Korean Beauty Store — Authentic Beauty. Lasting Trust. A Glow That Is Uniquely Yours.
            </p>
          </Reveal>
        </section>
      </main>
    </>
  );
}
