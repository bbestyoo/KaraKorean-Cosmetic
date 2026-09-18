"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const API_ORIGIN = API_BASE_URL.replace(/\/shop\/?$/, "");

interface BannerData {
  id: number;
  name: string;
  text: string;
  link_text?: string | null;
  link_url?: string | null;
}

interface BannerState {
  banner: BannerData | null;
  hasBanners: boolean;
}

const DEFAULT_TEXT = "Teej Special Sale is Live! MASSIVE!! Up to 80% off on selected items.";

export function PromoBanner() {
  const [banner, setBanner] = useState<BannerState>({
    banner: null,
    hasBanners: true,
  });

  useEffect(() => {
    let active = true;

    fetch(`${API_ORIGIN}/shop/api/banner/`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: BannerData[]) => {
        if (!active) return;
        if (Array.isArray(data) && data.length > 0) {
          setBanner({ banner: data[0], hasBanners: true });
        } else {
          // Admin explicitly has no active banners → hide the promo bar.
          setBanner({ banner: null, hasBanners: false });
        }
      })
      .catch(() => {
        // Transient API failure → keep showing the default fallback.
        if (active) setBanner({ banner: null, hasBanners: true });
      });

    return () => {
      active = false;
    };
  }, []);

  if (!banner.hasBanners) return null;

  const text = banner.banner?.text || DEFAULT_TEXT;
  const linkText = banner.banner?.link_text || "Shop Now";
  const linkUrl = (banner.banner?.link_url || "").trim() || "/products";

  return (
    <div className="bg-pink-300  text-center font-serif text-black font-extrabold py-3 px-4 relative z-50 text-xs md:text-lg tracking-wide">
      <p>
        {text}{" "}
        <Link
          href={linkUrl}
          className="underline font-bold decoration-black/60 hover:decoration-black transition-all ml-1"
        >
          {linkText}
        </Link>
      </p>
    </div>
  );
}