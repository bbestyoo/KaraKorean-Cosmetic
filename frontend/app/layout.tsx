import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
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
  title: "Aama Ko Nana – आमाको न्यानोपनको अनुभूति (Coming Soon)",
  description:
    "Aama Ko Nana – आमाको न्यानोपनको अनुभूति | Countdown to a new crafted experience blending design, narrative & commerce.",
  keywords: [
    "Aama Ko Nana",
    "coming soon",
    "design",
    "portfolio",
    "commerce",
    "Nepal",
  ],
  openGraph: {
    title: "Aama Ko Nana — Coming Soon",
    description: "आमाको न्यानोपनको अनुभूति. A bold creative & commerce destination in the making.",
    url: "https://example.com",
    siteName: "Aama Ko Nana",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aama Ko Nana Coming Soon",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aama Ko Nana — Coming Soon",
    description: "आमाको न्यानोपनको अनुभूति.",
    images: ["/og-image.png"],
  },
  robots: { index: false, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
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
              {children}
            </CartProvider>
          </AuthProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
