import Link from "next/link";

export function PromoBanner() {
  return (
    <div className="bg-[#0f3b2b] text-center text-white py-2 px-4 relative z-50 text-xs md:text-sm font-medium tracking-wide">
      <p>
        Winter Sale is Live! Up to 30% off on selected items.{' '}
        <Link href="/products" className="underline decoration-white/60 hover:decoration-white transition-all ml-1">
          Shop Now
        </Link>
      </p>
    </div>
  );
}
