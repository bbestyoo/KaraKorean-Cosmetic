import Link from "next/link";

export interface BannerData {
  id: number;
  name: string;
  text: string;
  link_text?: string | null;
  link_url?: string | null;
}

const DEFAULT_TEXT = "Teej Special Sale is Live! MASSIVE!! Up to 80% off on selected items.";

export function PromoBanner({ banner }: { banner?: BannerData | null }) {
  const text = banner?.text || DEFAULT_TEXT;
  const linkText = banner?.link_text || "Shop Now";
  const linkUrl = (banner?.link_url || "").trim() || "/products";

  return (
    <div className="bg-pink-300  text-center font-serif text-black font-extrabold py-2 sm:py-3 px-3 sm:px-4 relative z-50 text-[10px] sm:text-xs md:text-lg tracking-wide">
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