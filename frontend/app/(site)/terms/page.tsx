import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Kara Korean Beauty Store",
  description:
    "Terms and Conditions governing the use of Kara Korean Beauty Store services, orders, and website in Nepal.",
  alternates: {
    canonical: "https://karakoreanbeauty.com/terms",
  },
  openGraph: {
    title: "Terms and Conditions | Kara Korean Beauty Store",
    description: "Read the terms and conditions for using Kara Korean Beauty Store services.",
    url: "https://karakoreanbeauty.com/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f7f6f2] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-neutral-100">
        <h1 className="text-4xl font-serif text-[#0f3b2b] mb-8 border-b pb-4">
          Terms and Conditions
        </h1>

        <div className="space-y-6 text-[#6b766f] font-sans text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-[#0f3b2b] mb-2">1. Agreement to Terms</h2>
            <p>
              By accessing and using the Kara Korean Beauty Store website, you agree to comply with and be bound by these Terms and Conditions. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#0f3b2b] mb-2">2. Products and Orders</h2>
            <p>
              All products listed are subject to availability. We reserve the right to limit the quantity of products we supply or refuse any order. Price details are subject to change without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#0f3b2b] mb-2">3. Payment Methods</h2>
            <p>
              We offer Cash on Delivery (COD) and Online Bank Transfers/QR Code payments. By making a purchase, you agree to provide valid and accurate payment and billing details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#0f3b2b] mb-2">4. Returns and Refunds</h2>
            <p>
              Returns are accepted on unopened and unused products in their original packaging within 7 days of delivery. Custom products or opened cosmetics cannot be returned due to hygiene policies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#0f3b2b] mb-2">5. Privacy and Security</h2>
            <p>
              Your personal information is secure and managed in accordance with our Privacy Policy. We take all reasonable measures to protect transaction details.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
