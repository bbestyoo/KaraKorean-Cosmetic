import { Metadata } from 'next';
import AboutPageClient from './AboutPageClient';

export const metadata: Metadata = {
  title: "About Kara Korean Beauty | Our K-Beauty Story",
  description:
    "Learn about Kara Korean Beauty — Nepal's trusted destination for authentic Korean skincare. Founded in 2023, we curate the best K-beauty brands for you.",
  alternates: {
    canonical: "https://karakoreanbeauty.com/about",
  },
  openGraph: {
    title: "About Kara Korean Beauty | Our K-Beauty Story",
    description: "Nepal's trusted destination for authentic Korean skincare. Learn about our mission and the brands we carry.",
    url: "https://karakoreanbeauty.com/about",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
