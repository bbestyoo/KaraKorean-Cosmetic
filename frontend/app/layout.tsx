import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import { LenisProvider } from "@/components/LenisProvider";
import { MetaPixelPageView } from "@/components/MetaPixelPageView";

const META_PIXEL_ID = (process.env.NEXT_PUBLIC_META_PIXEL_ID || "").trim();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.karakoreanbeauty.com"),
  title: {
    default: "Kara — Korean Beauty Store | Authentic K-Beauty in Nepal",
    template: "%s | Kara Korean Beauty",
  },
  description:
    "Kara brings authentic Korean skincare and beauty products to Kathmandu and across Nepal. Shop curated K-beauty brands like COSRX, Isntree, Anua, and more with local delivery.",
  keywords: [
    "Kara",
    "Korean beauty",
    "K-beauty",
    "skincare",
    "Kathmandu",
    "Nepal",
    "COSRX",
    "Isntree",
    "Anua",
    "Korean skincare",
    "K-beauty Nepal",
    "Korean beauty products",
    "glass skin",
    "skincare routine",
  ],
  openGraph: {
    title: "Kara — Korean Beauty Store | Authentic K-Beauty in Nepal",
    description: "Kara brings authentic Korean skincare and beauty products to Kathmandu and across Nepal. Shop curated K-beauty brands with local delivery.",
    url: "https://www.karakoreanbeauty.com",
    siteName: "Kara Korean Beauty",
    images: [
      {
        url: "/images/logos/karalogo.jpg",
        width: 1200,
        height: 630,
        alt: "Kara Korean Beauty Store",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kara — Korean Beauty Store | Authentic K-Beauty in Nepal",
    description: "Kara brings authentic Korean skincare and beauty products to Kathmandu and across Nepal.",
    images: ["/images/logos/karalogo.jpg"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/images/logos/karalogo.jpg',
    shortcut: '/images/logos/karalogo.jpg',
    apple: '/images/logos/karalogo.jpg',
  },
  alternates: {
    canonical: "https://www.karakoreanbeauty.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Kara Korean Beauty',
    url: 'https://www.karakoreanbeauty.com',
    logo: 'https://www.karakoreanbeauty.com/images/logos/karalogo.jpg',
    description:
      'Authentic Korean skincare and beauty products delivered to Kathmandu and across Nepal.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kathmandu',
      addressCountry: 'NP',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+977-9849900249',
      contactType: 'customer service',
      email: 'karakoreanstore@gmail.com',
    },
    sameAs: [],
  };

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/banner/kara-banner.avif"
          type="image/avif"
          fetchPriority="high"
        />
        <link rel="icon" href="/images/logos/karalogo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {META_PIXEL_ID && (
          <script
            id="meta-pixel"
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');if(!window.location.pathname.startsWith('/admin')){fbq('track','PageView');}`,
            }}
          />
        )}
        {/* Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-X327RLYMX5" />
        <Script id="google-analytics">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-X327RLYMX5');`}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased min-h-full bg-[var(--background)] text-[color:var(--foreground)] selection:bg-[var(--foreground)] selection:text-[var(--background)]`}
      >
        <LenisProvider>
          <MetaPixelPageView />
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                {children}
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
