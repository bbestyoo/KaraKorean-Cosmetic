import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f7f6f2] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <p className="text-8xl sm:text-9xl font-serif font-bold text-[#0f3b2b]">
          404
        </p>
        <h1 className="mt-4 text-2xl sm:text-3xl font-serif text-[#0f3b2b]">
          Page Not Found
        </h1>
        <p className="mt-3 text-neutral-600 font-sans tracking-wide">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block bg-[#0f3b2b] text-white font-sans font-medium px-8 py-3 rounded-full hover:bg-[#1a5a42] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
