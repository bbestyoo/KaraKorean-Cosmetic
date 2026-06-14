import Link from "next/link";

export function PromoBanner() {
  return (
    <div className="bg-[#ec7cfd]  text-center font-serif text-white py-3 px-4 relative z-50 text-xs md:text-lg  tracking-wide">
      <p>
        Winter Sale is Live! Up to 30% off on selected items.{' '}
        <Link href="/products" className="underline font-bold decoration-white/60 hover:decoration-white transition-all ml-1">
          Shop Now
        </Link>
      </p>
    </div>
  );
}
