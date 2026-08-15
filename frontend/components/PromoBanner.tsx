import Link from "next/link";

export function PromoBanner() {
  return (
    <div className="bg-pink-300  text-center font-serif text-black font-extrabold py-3 px-4 relative z-50 text-xs md:text-lg  tracking-wide">
      <p>
        Summer Sale is Live! Up to 30% off on selected items.{' '}
        <Link href="/products" className="underline font-bold decoration-black/60 hover:decoration-black transition-all ml-1">
          Shop Now
        </Link>
      </p>
    </div>
  );
}
