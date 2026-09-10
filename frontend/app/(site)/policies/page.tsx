import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { FiMail, FiPhone, FiShield, FiRefreshCcw, FiTruck } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Privacy, Refund & Shipping Policies | Kara Korean Beauty Store",
  description:
    "Understand how Kara Korean Beauty Store protects your data, processes refunds, and delivers orders across Nepal. Read our full Privacy, Refund, and Shipping policies.",
  alternates: {
    canonical: "https://www.karakoreanbeauty.com/policies",
  },
  openGraph: {
    title: "Policies | Kara Korean Beauty Store",
    description:
      "Our complete Privacy, Refund, and Shipping policies for ordering authentic K-Beauty in Nepal.",
    url: "https://www.karakoreanbeauty.com/policies",
  },
};

const navItems = [
  { id: "privacy", label: "Privacy Policy", icon: FiShield },
  { id: "refund", label: "Refund Policy", icon: FiRefreshCcw },
  { id: "shipping", label: "Shipping Policy", icon: FiTruck },
];

const privacySections = [
  {
    title: "Information We Collect",
    body: "We collect only the information needed to process and fulfil your orders. This includes your name, phone number, delivery address, email address, and payment details provided during checkout. When you contact us or create an account, we may store your communication history and order preferences to serve you better.",
  },
  {
    title: "How We Use Your Information",
    body: "Your information is used to process orders, arrange delivery, provide customer support, and keep you updated about your purchases. With your consent, we may occasionally share skincare tips, product launches, and exclusive offers. We never sell your personal data to third parties.",
  },
  {
    title: "Cookies and Analytics",
    body: "We use cookies and privacy-respecting analytics to understand how visitors use our store so we can improve your shopping experience. Cookies help remember items in your cart, your preferences, and past browsing to make future visits smoother. You can disable cookies in your browser at any time, though some features may not work as well.",
  },
  {
    title: "Payment and Data Security",
    body: "All transactions are handled securely. For Cash on Delivery (COD) orders, no card details are ever collected. For online payments via QR code or bank transfer, your financial details are never stored on our servers. We follow reasonable security practices to protect your personal information against unauthorised access, alteration, disclosure, or destruction.",
  },
  {
    title: "Third-Party Sharing",
    body: "We share only the necessary information with trusted delivery partners to deliver your order to the correct address, and with service providers who help operate our website. These partners are bound to protect your data and may not use it for any other purpose. We do not rent or sell your personal information.",
  },
  {
    title: "Your Privacy Rights",
    body: "You may request a copy, correction, or deletion of the personal information we hold about you at any time. To exercise your rights, contact us and we will respond within a reasonable time. You may also opt out of our promotional messages at any point by replying or unsubscribing.",
  },
];

const refundSections = [
  {
    title: "7-Day Return Window",
    body: "We accept returns on items that are unopened, unused, undamaged, and in their original packaging within 7 days of delivery. To be eligible, the product must not have been tampered with and all tags, seals, and packaging must remain intact.",
  },
  {
    title: "Hygiene Exceptions",
    body: "For your safety and by industry hygiene standards, we cannot accept returns or exchanges on opened or used cosmetics, skincare products, or any item where the seal or packaging has been broken — unless the product is proven to be defective or damaged upon delivery.",
  },
  {
    title: "How to Request a Return",
    body: "Message us on WhatsApp at 9849900249 or email karakoreanstore@gmail.com within 7 days of delivery with your order number, the product name, and clear photos of the item. Our team will guide you through the return process and arrange the pickup or drop-off.",
  },
  {
    title: "Refund Processing",
    body: "Once your returned product is received and inspected, we will approve or reject your refund within 2 business days. Approved refunds are processed back to your original payment method (or bank account for COD orders) within 5–7 business days after approval.",
  },
  {
    title: "Non-Refundable Items",
    body: "Opened or used products, custom or personalised orders, products damaged due to customer misuse, and items returned after the 7-day window are non-refundable. Shipping charges are generally not refunded unless the return is due to our error or a defective product.",
  },
  {
    title: "Damaged or Incorrect Orders",
    body: "If you receive a damaged, defective, or incorrect item, please contact us within 48 hours of delivery with photos. We will replace the item or issue a full refund at our cost, including any shipping charges incurred.",
  },
];

const shippingSections = [
  {
    title: "Order Processing",
    body: "Orders are processed and dispatched within 1–2 business days after confirmation. Orders placed on weekends or public holidays are dispatched on the next business day. For online (QR / bank transfer) payments, dispatch begins after payment confirmation.",
  },
  {
    title: "Delivery Timeframes",
    body: "Orders within the Kathmandu and Pokhara valleys are typically delivered within 1–2 business days. Orders to other locations across Nepal usually arrive within 3–5 business days, depending on your area. Remote areas may require additional transit time.",
  },
  {
    title: "Shipping Charges & Free Delivery",
    body: "We offer free shipping across Nepal on all orders above NPR 3,500. For orders below this amount, a small delivery fee applies based on your location: Kathmandu & Pokhara valley NPR 99, Tier 2 cities NPR 135, Tier 3 cities NPR 160, and remote areas NPR 220.",
  },
  {
    title: "Cash on Delivery (COD)",
    body: "We offer Cash on Delivery across Nepal. Please keep the exact amount ready to smooth the payment for our delivery partner. A small handling fee may apply to COD orders in select areas.",
  },
  {
    title: "Tracking Your Order",
    body: "Once your order is dispatched, you will be updated via WhatsApp or SMS from our delivery partner. For any delivery questions, your order details, or delivery-day contact, our team is available to help at all times.",
  },
  {
    title: "Failed or Missed Deliveries",
    body: "If a delivery cannot be completed because the recipient is unreachable or the address is incorrect, we will attempt to coordinate a redelivery. Repeated failed delivery attempts may result in the order being returned to us; redelivery charges may apply.",
  },
];

function Section(
  { id, badge, title, intro, sections, items }: {
    id: string;
    badge: string;
    title: string;
    intro: string;
    sections: { title: string; body: string }[];
    items?: string[];
  },
) {
  return (
    <section id={id} className="scroll-mt-32">
      <div className="mb-8">
        <p className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase text-[#c9a46b] mb-3">
          {badge}
        </p>
        <h2 className="text-3xl sm:text-4xl font-serif text-[#0f3b2b] mb-4">
          {title}
        </h2>
        <p className="text-[#6b766f] font-sans text-sm sm:text-[15px] leading-relaxed max-w-2xl">
          {intro}
        </p>
      </div>

      {items && (
        <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 bg-white rounded-xl border border-neutral-100 shadow-sm px-4 py-3.5"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0f3b2b]/8 flex items-center justify-center">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-[#0f3b2b]">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="text-[#111] font-sans text-sm font-medium">{item}</span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-5">
        {sections.map((s, i) => (
          <div
            key={s.title}
            className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 sm:p-8"
          >
            <h3 className="font-serif text-lg sm:text-xl text-[#0f3b2b] mb-3 flex items-baseline gap-3">
              <span className="text-[#c9a46b] text-sm font-bold font-sans">0{i + 1}</span>
              {s.title}
            </h3>
            <p className="text-[#6b766f] font-sans text-sm leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function PoliciesPage() {
  return (
    <main className="min-h-screen bg-[#f7f6f2]">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-[#0f3b2b] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_1px_1px,#c9a46b_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <p className="text-[11px] sm:text-xs tracking-[0.3em] uppercase font-bold text-[#c9a46b] mb-5">
            Kara Korean Beauty Store
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif mb-5">
            Our Policies
          </h1>
          <p className="max-w-2xl mx-auto text-white/75 font-sans text-sm sm:text-base leading-relaxed">
            Clear, honest, and human — everything you need to know about how we protect
            your data, refund your orders, and deliver authentic K-Beauty to your doorstep across Nepal.
          </p>
          <p className="mt-6 text-[11px] sm:text-xs tracking-[0.2em] uppercase font-bold text-white/60">
            Last updated: September 2026
          </p>
        </div>
      </section>

      {/* ── Sticky sub-nav ───────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-[#f7f6f2]/90 backdrop-blur border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 sm:gap-4 overflow-x-auto">
          {navItems.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="flex-shrink-0 inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-[11px] font-bold tracking-[0.15em] uppercase transition-colors text-[#0f3b2b] border border-[#0f3b2b]/20 bg-white hover:bg-[#0f3b2b] hover:text-white"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="space-y-20 sm:space-y-24">
          <Section
            id="privacy"
            badge="Privacy Policy"
            title="Your Privacy Matters"
            intro="We collect only what we need to serve you, and we guard it carefully. This policy explains what we gather, why, and the control you keep over your information."
            items={[
              "We never sell your personal data",
              "Payment details are never stored",
              "You can request data deletion anytime",
            ]}
            sections={privacySections}
          />

          <Section
            id="refund"
            badge="Refund Policy"
            title="Fair Returns, Zero Friction"
            intro="We want you to love your purchase. If something isn't right, our team makes returns and refunds simple, fast, and transparent."
            items={[
              "Returns accepted within 7 days",
              "Full refunds in 5–7 business days",
              "Replacement for damaged or incorrect items",
            ]}
            sections={refundSections}
          />

          <Section
            id="shipping"
            badge="Shipping Policy"
            title="Delivered Across Nepal"
            intro="From Kathmandu to the hills and everywhere in between — here's how your K-Beauty favourites make their way to you."
            items={[
              "Free delivery above NPR 3,500",
              "Valley orders in 1–2 business days",
              "Nationwide delivery in 3–5 business days",
            ]}
            sections={shippingSections}
          />
        </div>

        {/* ── Contact CTA ────────────────────────────────────── */}
        <div className="mt-20 sm:mt-24">
          <div
            className="rounded-3xl p-8 sm:p-12 text-center"
            style={{
              background: "linear-gradient(145deg, #0f3b2b 0%, #1d5c42 100%)",
              border: "1px solid rgba(201,164,107,0.25)",
            }}
          >
            <h2 className="text-3xl sm:text-4xl font-serif text-white mb-4">
              Still Have Questions?
            </h2>
            <p className="max-w-xl mx-auto text-white/75 font-sans text-sm sm:text-base leading-relaxed mb-8">
              Our team is happy to help with returns, delivery, or anything about your
              order. Reach out on WhatsApp or email — we reply fast.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://wa.me/9849900249"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#c9a46b] text-[#0f3b2b] text-[11px] font-black tracking-[0.2em] uppercase hover:bg-white transition-colors"
              >
                <FiPhone size={16} />
                WhatsApp 9849900249
              </a>
              <a
                href="mailto:karakoreanstore@gmail.com"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/40 text-white text-[11px] font-black tracking-[0.2em] uppercase hover:bg-white hover:text-[#0f3b2b] transition-colors"
              >
                <FiMail size={16} />
                Email Us
              </a>
            </div>
            <Link
              href="/faq"
              className="inline-block mt-8 text-white/80 text-[11px] font-bold tracking-[0.2em] uppercase border-b border-white/40 pb-0.5 hover:text-white transition-colors"
            >
              Browse the FAQ →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}