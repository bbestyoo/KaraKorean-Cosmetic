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
const STRIP_TEXT = ['Korean Beauty · Est. 2023', 'Kara', 'Authentic K-Beauty', 'Kara', 'Crafted with Care', 'Kara'];

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
            {/* Fallback: poster image will show if video fails */}
          </video>

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Hero text */}
          <div className="relative h-full flex flex-col items-center justify-center text-white text-center px-6">
            <p className="text-[11px] tracking-[0.35em] uppercase mb-6 opacity-80 font-medium">
              Est. 2023 · Kathmandu, Nepal
            </p>
            <h1
              className="text-6xl sm:text-8xl md:text-[9rem] font-black uppercase tracking-tight leading-none mb-6"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Kara
            </h1>
            <p className="text-lg sm:text-xl font-light tracking-[0.15em] uppercase opacity-90 mb-10">
              Korean Beauty, Delivered to Your Door
            </p>
            <Link
              href="/products"
              className="border border-white text-white px-10 py-3.5 text-[11px] uppercase tracking-[0.22em] font-bold hover:bg-white hover:text-[#111] transition-colors duration-300"
            >
              Shop the Collection
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
        {/* ABOUT THE BRAND — editorial 2-col                         */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Images left */}
            <Reveal className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop"
                  alt="Korean skincare products"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[3/4] overflow-hidden mt-10">
                <Image
                  src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop"
                  alt="Skincare routine"
                  fill
                  className="object-cover"
                />
              </div>
            </Reveal>

            {/* Text right */}
            <Reveal delay={150} className="flex flex-col justify-center pt-4 lg:pt-16">
              <p className="text-[11px] font-black tracking-[0.3em] uppercase text-neutral-400 mb-5">
                About the Brand
              </p>
              <h2
                className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black uppercase leading-none tracking-tight mb-8"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Kara
                <span className="block text-2xl sm:text-3xl font-light tracking-widest mt-2 text-neutral-500" style={{ fontFamily: 'Georgia, serif' }}>
                  Korean Beauty
                </span>
              </h2>
              <p className="text-base text-neutral-600 leading-relaxed mb-5">
                Kara was born out of a simple love for Korean beauty rituals — the mindful routines, the glass-skin philosophy, and the science-backed ingredients that have transformed skincare worldwide.
              </p>
              <p className="text-base text-neutral-600 leading-relaxed mb-5">
                We curate only the most trusted K-beauty brands — from cult classics like COSRX and Anua to emerging labels — and bring them directly to doorsteps across Nepal, making authentic Korean skincare accessible to everyone.
              </p>
              <p className="text-base text-neutral-600 leading-relaxed mb-10">
                Every product we stock is carefully selected for quality, ingredient integrity, and genuine efficacy. We believe that great skin is not a luxury — it's a ritual anyone can adopt.
              </p>
              <Link
                href="/products"
                className="self-start text-[11px] font-black tracking-[0.22em] uppercase border-b-2 border-[#111] pb-0.5 hover:opacity-60 transition-opacity"
              >
                Learn More About Our Products →
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* FULL-WIDTH EDITORIAL IMAGE                                 */}
        {/* ══════════════════════════════════════════════════════════ */}
        <Reveal>
          <section className="relative w-full h-[60vh] lg:h-[80vh] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1800&auto=format&fit=crop"
              alt="Korean beauty skincare flat lay"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <blockquote className="text-white text-center max-w-2xl px-8">
                <p
                  className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase leading-tight tracking-tight mb-6"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  "Skin is the story you wear every day."
                </p>
                <cite className="text-[11px] tracking-[0.3em] uppercase opacity-70 not-italic">— The Kara Philosophy</cite>
              </blockquote>
            </div>
          </section>
        </Reveal>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* THREE PILLARS — like the reference's 3-col section        */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="border-t border-[#ddd] max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-[#ddd]">

            {[
              {
                label: 'Our Story',
                img: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&auto=format&fit=crop',
                body: 'Founded in 2023, Kara started as a passion project between two friends obsessed with Korean skincare routines. What began as personal imports quickly grew into Nepal\'s most trusted K-beauty destination.',
                link: '/about',
              },
              {
                label: 'Our Mission',
                img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop',
                body: 'We believe everyone deserves access to skincare that actually works. Our mission is to demystify K-beauty, educate our community, and make the best Korean formulations available at fair prices.',
                link: '/quiz',
              },
              {
                label: 'Our Promise',
                img: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&auto=format&fit=crop',
                body: 'Every product is 100% authentic, sourced directly from Korean brands and authorised distributors. No fakes. No grey market. Just genuine K-beauty delivered with care and trust.',
                link: '/products',
              },
            ].map(({ label, img, body, link }, i) => (
              <Reveal key={label} delay={i * 120} className="px-0 sm:px-10 py-10 sm:py-0">
                <div className="relative w-full aspect-[4/3] overflow-hidden mb-7">
                  <Image src={img} alt={label} fill className="object-cover" />
                </div>
                <p className="text-[10px] font-black tracking-[0.3em] uppercase text-neutral-400 mb-3">{label}</p>
                <p className="text-sm text-neutral-600 leading-relaxed mb-5">{body}</p>
                <Link
                  href={link}
                  className="text-[10px] font-black tracking-[0.25em] uppercase border-b border-[#111] pb-0.5 hover:opacity-50 transition-opacity"
                >
                  Learn More →
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STORE LOCATION                                             */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="max-w-[1700px] mx-auto px-6 lg:px-12 py-24">
          <Reveal>
            <p className="text-[11px] tracking-[0.35em] uppercase text-neutral-400 mb-4">Visit Us</p>
            <h2
              className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-6"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Our Store Location
            </h2>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
            <div className="relative w-full col-span-2 aspect-[16/9] overflow-hidden rounded-lg shadow">
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
              <p className="text-sm text-neutral-600 mb-4">Open daily 10:00 — 20:00. Call ahead for availability.</p>
              <a
                href="https://www.google.com/maps/place/Kara+Korean+Beauty+Store/@27.737714,85.3347341,20.39z/data=!4m6!3m5!1s0x39eb19005b6234c9:0x240b20f661c49f26!8m2!3d27.7376772!4d85.3348645!16s%2Fg%2F11xl9w0yvf?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-black tracking-[0.22em] uppercase border-b border-[#111] pb-0.5 hover:opacity-60 transition-opacity"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* IMAGE MOSAIC                                               */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <Reveal>
            <p className="text-[11px] tracking-[0.35em] uppercase text-neutral-400 mb-4 text-center">Life at Kara</p>
            <h2
              className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-center mb-14"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Behind the Shelves
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { src: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=600&auto=format&fit=crop', tall: true },
                { src: 'https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=600&auto=format&fit=crop', tall: false },
                { src: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&auto=format&fit=crop', tall: false },
                { src: 'https://images.unsplash.com/photo-1614159102043-d3b56a98b8bc?w=600&auto=format&fit=crop', tall: true },
              ].map(({ src, tall }, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden ${tall ? 'aspect-[3/4]' : 'aspect-square'}`}
                >
                  <Image src={src} alt={`Gallery ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </Reveal>
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
          </Reveal>
        </section>
      </main>
    </>
  );
}
