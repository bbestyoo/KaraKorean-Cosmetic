import { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: "Contact Us | Kara Korean Beauty Store",
  description:
    "Get in touch with Kara Korean Beauty. Reach us via WhatsApp, email, or visit our store in Kathmandu, Nepal. We respond within 24 hours.",
  alternates: {
    canonical: "https://karakoreanbeauty.com/contact",
  },
  openGraph: {
    title: "Contact Us | Kara Korean Beauty Store",
    description: "Questions about orders, skincare advice, or partnerships? Contact Kara Korean Beauty in Kathmandu.",
    url: "https://karakoreanbeauty.com/contact",
  },
};

export default function Page() {
  return <ContactPageClient />;
}
