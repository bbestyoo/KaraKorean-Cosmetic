'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// ── Reveal on scroll ────────────────────────────────────────────────────────
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
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
      }}
    >
      {children}
    </div>
  );
}

// ── Floating label input ─────────────────────────────────────────────────────
function FloatingInput({
  id,
  label,
  type = 'text',
  required = false,
  value,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="peer w-full bg-transparent border-b border-[#ccc] pt-5 pb-2 text-sm text-[#111] outline-none transition-colors focus:border-[#0f3b2b] placeholder-transparent"
        placeholder={label}
        autoComplete="off"
      />
      <label
        htmlFor={id}
        className={`absolute left-0 transition-all duration-200 pointer-events-none select-none ${lifted
          ? 'top-0 text-[10px] font-bold tracking-[0.18em] uppercase text-[#5c6e69]'
          : 'top-5 text-sm text-neutral-400'
          }`}
      >
        {label}
        {required && <span className="text-[#c9a46b] ml-0.5">*</span>}
      </label>
      <span
        className={`absolute bottom-0 left-0 h-[2px] bg-[#0f3b2b] transition-all duration-300 ${focused ? 'w-full' : 'w-0'
          }`}
      />
    </div>
  );
}

// ── Floating label textarea ──────────────────────────────────────────────────
function FloatingTextarea({
  id,
  label,
  required = false,
  value,
  onChange,
}: {
  id: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div className="relative">
      <textarea
        id={id}
        required={required}
        value={value}
        rows={5}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="peer w-full bg-transparent border-b border-[#ccc] pt-5 pb-2 text-sm text-[#111] outline-none resize-none transition-colors focus:border-[#0f3b2b] placeholder-transparent"
        placeholder={label}
      />
      <label
        htmlFor={id}
        className={`absolute left-0 transition-all duration-200 pointer-events-none select-none ${lifted
          ? 'top-0 text-[10px] font-bold tracking-[0.18em] uppercase text-[#5c6e69]'
          : 'top-5 text-sm text-neutral-400'
          }`}
      >
        {label}
        {required && <span className="text-[#c9a46b] ml-0.5">*</span>}
      </label>
      <span
        className={`absolute bottom-0 left-0 h-[2px] bg-[#0f3b2b] transition-all duration-300 ${focused ? 'w-full' : 'w-0'
          }`}
      />
    </div>
  );
}

// ── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-neutral-700">
      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0f3b2b]/8 flex items-center justify-center text-[#0f3b2b]">
        {icon}
      </span>
      <span>{text}</span>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    // Simulate a brief network delay, replace with real API call if needed
    await new Promise((res) => setTimeout(res, 1200));
    setStatus('sent');
    setName(''); setPhone(''); setEmail(''); setComment('');
  }

  return (
    <>
      {/* <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .hero-title {
          background: linear-gradient(120deg, #0f3b2b 0%, #5c8a72 40%, #c9a46b 70%, #0f3b2b 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 5s linear infinite;
        }
        .glass-card {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(18px) saturate(160%);
          -webkit-backdrop-filter: blur(18px) saturate(160%);
          border: 1px solid rgba(201,164,107,0.18);
          box-shadow: 0 8px 40px -12px rgba(0,0,0,0.10), 0 2px 10px -2px rgba(201,164,107,0.08);
        }
        .submit-btn {
          position: relative;
          overflow: hidden;
        }
        .submit-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.12);
          transform: translateX(-100%);
          transition: transform 0.4s ease;
        }
        .submit-btn:hover::after {
          transform: translateX(0);
        }
      `}</style> */}

      <main className="bg-[#f7f6f2] text-[#111] min-h-screen">

        {/* ── HERO ──────────────────────────────────────────────── */}
        <section
          className="relative w-full overflow-hidden py-20 sm:py-10 md:py-10 flex flex-col items-center justify-center text-center px-6"
          style={{
            background: 'linear-gradient(160deg, #f7f6f2 0%, #edf3ef 50%, #f7f6f2 100%)',
          }}
        >
          {/* subtle decorative circles */}
          <div
            className="absolute -top-3 -left-32 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(92,138,114,0.12) 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(201,164,107,0.10) 0%, transparent 70%)' }}
          />

          <div style={{ animation: 'fadeUp 0.9s ease both' }}>
            <p className="text-[10px] font-black tracking-[0.4em] uppercase text-[#5c8a72] mb-5">
              We&apos;re here to help
            </p>
            <h1
              className="hero-title text-5xl sm:text-7xl md:text-5xl text-[#0f3b2b] font-black uppercase tracking-tight leading-none mb-6"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Contact Us
            </h1>
            <p className="text-base sm:text-lg text-neutral-500 max-w-md mx-auto leading-relaxed">
              Questions about an order, skincare advice, or just want to say hi? We&apos;d love to hear from you.
            </p>
          </div>

          {/* scroll cue */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
            <div className="w-px h-8 bg-[#0f3b2b] animate-pulse" />
          </div>
        </section>

        {/* ── MAIN CONTENT ──────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 xl:gap-16 items-start">

            {/* ── LEFT: Email Form ─────────────────────────────── */}
            <Reveal className="lg:col-span-3">
              <div className="glass-card rounded-3xl p-8 sm:p-12">
                <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#c9a46b] mb-3">
                  Get in Touch
                </p>
                <h2
                  className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-tight mb-3"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Send us an email
                </h2>
                <p className="text-sm text-neutral-500 mb-10 leading-relaxed">
                  Have a question or comment? Use the form below and we&apos;ll get back to you within 24&ndash;36 hours.
                </p>

                {status === 'sent' ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-5 text-center">
                    <span
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl"
                      style={{ background: 'linear-gradient(135deg, #0f3b2b, #5c8a72)' }}
                    >
                      ✓
                    </span>
                    <h3 className="text-xl font-black uppercase tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
                      Message Sent!
                    </h3>
                    <p className="text-sm text-neutral-500 max-w-xs leading-relaxed">
                      Thank you for reaching out. Our team will be in touch shortly.
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="mt-2 text-[10px] font-black tracking-[0.22em] uppercase border-b border-[#111] pb-0.5 hover:opacity-50 transition-opacity"
                    >
                      Send another message →
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <FloatingInput id="contact-name" label="Name" value={name} onChange={setName} />
                    <FloatingInput id="contact-phone" label="Phone Number" type="tel" value={phone} onChange={setPhone} />
                    <FloatingInput id="contact-email" label="Email" type="email" required value={email} onChange={setEmail} />
                    <FloatingTextarea id="contact-comment" label="Comment" required value={comment} onChange={setComment} />

                    <button
                      id="contact-submit"
                      type="submit"
                      disabled={status === 'sending'}
                      className="submit-btn self-start mt-2 px-10 py-4 text-white text-[11px] font-black tracking-[0.22em] uppercase rounded-full transition-all duration-300 hover:opacity-90 hover:scale-[1.03] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background: 'linear-gradient(135deg, #0f3b2b 0%, #1d5c42 100%)',
                        boxShadow: '0 6px 20px -6px rgba(15,59,43,0.5)',
                      }}
                    >
                      {status === 'sending' ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                          Sending…
                        </span>
                      ) : (
                        'Submit Contact'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </Reveal>

            {/* ── RIGHT: Info panel ────────────────────────────── */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* Live Help card */}
              <Reveal delay={120}>
                <div
                  className="rounded-3xl p-8"
                  style={{
                    background: 'linear-gradient(145deg, #0f3b2b 0%, #1c5c42 100%)',
                  }}
                >
                  <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#c9a46b] mb-3">
                    Immediate Assistance
                  </p>
                  <h3
                    className="text-2xl font-black uppercase tracking-tight text-white mb-4"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    Live Help
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed mb-7">
                    If you have an urgent issue, reach us directly via WhatsApp or email. We strive to reply within 24&ndash;36 hours.
                  </p>

                  <div className="flex flex-col gap-3 mb-7">
                    <a
                      href="https://wa.me/9849900249"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 text-sm text-white/90 hover:text-white transition-colors group"
                    >
                      <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors flex-shrink-0">
                        {/* WhatsApp icon */}
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                      </span>
                      WhatsApp: 9849900249
                    </a>
                    <a
                      href="mailto:karakoreanstore@gmail.com
"
                      className="flex items-center gap-3 text-sm text-white/90 hover:text-white transition-colors group"
                    >
                      <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors flex-shrink-0">
                        {/* Email icon */}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <path d="m2 7 10 7 10-7" />
                        </svg>
                      </span>
                      karakoreanstore@gmail.com
                    </a>
                  </div>

                  <a
                    href="https://wa.me/123123123"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[11px] font-black tracking-[0.2em] uppercase text-[#0f3b2b] transition-all duration-200 hover:scale-[1.04] active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #c9a46b 0%, #e8c98c 100%)', boxShadow: '0 4px 14px -4px rgba(201,164,107,0.5)' }}
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </Reveal>

              {/* Opening hours + address card */}
              <Reveal delay={200}>
                <div className="glass-card rounded-3xl p-8 flex flex-col gap-6">
                  <div>
                    <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#5c8a72] mb-3">
                      Store Hours
                    </p>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-500 font-medium">Mon – Fri</span>
                        <span className="font-semibold text-[#111]">10:00 – 20:00</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-500 font-medium">Sat – Sun</span>
                        <span className="font-semibold text-[#111]">11:00 – 18:00</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-[#e5e5e5]" />

                  <div>
                    <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#5c8a72] mb-3">
                      Our Address
                    </p>
                    <address className="not-italic text-sm text-neutral-700 leading-relaxed">
                      Kara Korean Beauty Store<br />
                      Kathmandu, Nepal<br />
                      Nepal
                    </address>
                    <a
                      href="https://www.google.com/maps/place/Kara+Korean+Beauty+Store/@27.737714,85.3347341,20.39z"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-4 text-[10px] font-black tracking-[0.22em] uppercase border-b border-[#111] pb-0.5 hover:opacity-50 transition-opacity"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                </div>
              </Reveal>

              {/* FAQ teaser */}
              {/* <Reveal delay={280}>
                <div
                  className="rounded-3xl p-8"
                  style={{
                    background: 'linear-gradient(145deg, #f3ede3 0%, #ede4d3 100%)',
                    border: '1px solid rgba(201,164,107,0.22)',
                  }}
                >
                  <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#c9a46b] mb-2">
                    Quick Answers
                  </p>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-3 text-[#111]" style={{ fontFamily: 'Georgia, serif' }}>
                    Browse our FAQ
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-5">
                    Shipping times, return policies, product authenticity — find instant answers in our help centre.
                  </p>
                  <Link
                    href="/faq"
                    className="text-[10px] font-black tracking-[0.22em] uppercase border-b border-[#111] pb-0.5 hover:opacity-50 transition-opacity"
                  >
                    Visit FAQ →
                  </Link>
                </div>
              </Reveal> */}
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
