import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs | Kara Korean Beauty Store",
  description:
    "Frequently Asked Questions about orders, shipping, returns, and authentic Korean skincare products at Kara Korean Beauty Store.",
  alternates: {
    canonical: "https://www.karakoreanbeauty.com/faq",
  },
  openGraph: {
    title: "FAQs | Kara Korean Beauty Store",
    description: "Find answers about shipping, returns, product authenticity, and more at Kara Korean Beauty.",
    url: "https://www.karakoreanbeauty.com/faq",
  },
};

const faqs = [
  {
    question: "Are your products 100% authentic?",
    answer: "Yes, absolutely. We source all our products directly from authorized distributors and brand manufacturers in South Korea. Authenticity is our highest priority.",
  },
  {
    question: "How long does shipping take?",
    answer: "For orders within Kathmandu valley, delivery takes 1-2 business days. For orders outside the valley, it usually takes 3-5 business days depending on your location.",
  },
  {
    question: "Do you offer free delivery?",
    answer: "Yes, we offer free shipping across Nepal on all orders above NPR 3,500.",
  },
  {
    question: "What is your return policy?",
    answer: "We accept returns on unused, unopened, and undamaged products within 7 days of delivery. Due to hygiene reasons, we cannot accept returns on opened or used cosmetics unless there is a proven defect.",
  },
  {
    question: "Can I get a skin consultation?",
    answer: "Yes! You can contact us via Whatsapp or Instagram for a personalized skincare curation session with our experts, or take our automated Skin Quiz on the homepage.",
  },
];

export default function FAQPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <main className="min-h-screen bg-[#f7f6f2] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-serif text-[#0f3b2b] text-center mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-center text-neutral-600 mb-12 font-sans tracking-wide">
            Have questions? We have answers. If you don't find what you are looking for, feel free to contact us.
          </p>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
                <h3 className="text-lg font-bold text-[#0f3b2b] font-sans mb-2">
                  {faq.question}
                </h3>
                <p className="text-[#6b766f] font-sans text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
