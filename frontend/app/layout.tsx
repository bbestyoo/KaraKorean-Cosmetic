import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import { LenisProvider } from "@/components/LenisProvider";

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
  title: "Kara — Korean Beauty Store",
  description:
    "Kara brings authentic Korean skincare and beauty products to Kathmandu and across Nepal. Shop curated K‑beauty brands, discover routines, and enjoy local delivery.",
  keywords: [
    "Kara",
    "Korean beauty",
    "K-beauty",
    "skincare",
    "Kathmandu",
    "Nepal",
    "COSRX",
    "Isntree",
  ],
  openGraph: {
    title: "Kara — Korean Beauty Store",
    description: "Kara brings authentic Korean skincare and beauty products to Kathmandu and across Nepal.",
    url: "https://karakoreanbeauty.com",
    siteName: "Kara",
    images: [
      {
        url: "/images/logos/karalogo.jpg",
        width: 1200,
        height: 630,
        alt: "Kara Korean Beauty Store",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kara — Korean Beauty Store",
    description: "Kara brings authentic Korean skincare and beauty products to Kathmandu and across Nepal.",
    images: ["/images/logos/karalogo.jpg"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/images/logos/karalogo.jpg',
    shortcut: '/images/logos/karalogo.jpg',
    apple: '/images/logos/karalogo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/logos/karalogo.png" />
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
