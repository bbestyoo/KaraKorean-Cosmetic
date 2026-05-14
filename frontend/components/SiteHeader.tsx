"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, User, Menu } from "lucide-react";
import { CartButton } from "@/components/CartButton";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { PromoBanner } from "./PromoBanner";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide if scrolling down and passed the header height, show if scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={cn(
        "sticky top-0 w-full z-40 transition-transform duration-300 border-b bg-[#f7f6f2]",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className=" h-24  px-6 lg:pl-4 lg:pr-8 flex items-center justify-between">

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 -ml-2 text-neutral-800"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center ml-0 gap-2">
          <Image
            src="/images/logos/karalogo.png"
            alt="Logo"
            width={200} // or any number <= h-16
            height={120} // keep it <= navbar height
            className="object-contain"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-neutral-600">
          <Link href="/products" className="hover:text-black hover:font-semibold hover:scale-105 transition-colors">
            Shop
          </Link>
          <Link
            href="/products?category=Moms"
            className="hover:text-black hover:font-semibold hover:scale-105 transition-colors"
          >
            Maternity
          </Link>
          <Link
            href="/products?category=Babies"
            className="hover:text-black hover:font-semibold hover:scale-105 transition-colors"
          >
            Newborns
          </Link>
          <Link
            href="/materials"
            className="hover:text-black hover:font-semibold hover:scale-105 transition-colors"
          >
            Materials
          </Link>
          <Link href="/story" className="hover:text-black hover:font-semibold hover:scale-105 transition-colors">
            Our Story
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="hidden md:flex items-center relative group">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form.elements.namedItem(
                  "search"
                ) as HTMLInputElement;
                if (input.value) {
                  window.location.href = `/products?search=${encodeURIComponent(
                    input.value
                  )}`;
                }
              }}
              className="relative"
            >
              <input
                name="search"
                type="text"
                placeholder="Search..."
                className="pl-3 pr-8 py-1.5 text-sm border border-gray-500 rounded-full w-[160px] focus:w-[400px] transition-all focus:outline-none focus:border-neutral-400 bg-transparent placeholder:text-neutral-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          <button className="hidden md:block p-2 text-neutral-600 hover:text-black transition-colors">
            <User className="w-5 h-5" />
          </button>
          <div className="relative">
            <CartButton />
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-neutral-200 shadow-lg md:hidden p-4 flex flex-col gap-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const input = form.elements.namedItem(
                "search-mobile"
              ) as HTMLInputElement;
              if (input.value) {
                window.location.href = `/products?search=${encodeURIComponent(
                  input.value
                )}`;
              }
            }}
            className="relative w-full"
          >
            <input
              name="search-mobile"
              type="text"
              placeholder="Search products..."
              className="w-full pl-4 pr-10 py-3 text-sm border border-neutral-200 rounded-lg bg-neutral-50"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
          <Link
            href="/products"
            className="text-lg font-medium text-neutral-900"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Shop
          </Link>
          <Link
            href="/products?category=Moms"
            className="text-lg font-medium text-neutral-900"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Maternity
          </Link>
          <Link
            href="/products?category=Babies"
            className="text-lg font-medium text-neutral-900"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Newborns
          </Link>
          <Link
            href="/materials"
            className="text-lg font-medium text-neutral-900"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Materials
          </Link>
          <Link
            href="/story"
            className="text-lg font-medium text-neutral-900"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Our Story
          </Link>
        </div>
      )}
    </header>
  );
}
