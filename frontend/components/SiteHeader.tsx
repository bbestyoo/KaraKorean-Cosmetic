"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, User, Menu } from "lucide-react";
import { CartButton } from "@/components/CartButton";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { PromoBanner } from "./PromoBanner";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isHome = pathname === "/";
  const currentCategory = searchParams.get("category")?.toLowerCase() || "";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Only apply scroll hide/show behavior on non-home pages
      if (!isHome) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      } else {
        setIsVisible(true); // Always visible on home page
      }

      setLastScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isHome]);

  return (
    <>
      <div>

        {/* 
        Spacer div: Since the header becomes 'fixed' on non-home pages, it's removed from the document flow. 
        We add a spacer of the exact same height (h-24) to push the content down so it doesn't hide behind the navbar.
      */}
        {!isHome && <div className="h-36 w-full" />}


        <header
          className={cn(
            "w-full z-40 sticky top-0 transition-transform duration-300 border-b bg-[#f7f6f2]",
            // If it's not the home page, make it fixed to the top of the screen
            // If it's the home page, let it sit normally in the document flow
            !isHome ? "fixed top-0 left-0" : "relative ",
            !isVisible && !isHome ? "-translate-y-full" : "translate-y-0"
          )}
        >
          <PromoBanner />

          <div className="h-24 px-6 lg:px-8 flex items-center justify-between relative">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 -ml-2 text-neutral-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo - Left */}
            <div className="flex items-center">
              <Link href="/">
                <Image
                  src="/images/logos/karalogo.png"
                  alt="Kara KOREAN BEAUTY STORE"
                  width={180}
                  height={60}
                  className="object-contain "
                />
              </Link>
            </div>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 gap-10 text-[12px] font-bold tracking-[0.15em] text-[#5c6e69] uppercase">
              <Link
                href="/products"
                className={cn(
                  "pb-1 transition-colors hover:text-black",
                  currentCategory === "products" || currentCategory === "" // Default active for demo matching picture
                    ? "border-b-2 border-[#5c6e69] text-[#4a5a56]"
                    : "border-b-2 border-transparent hover:border-[#5c6e69]"
                )}
              >
                Skincare
              </Link>
              <Link
                href="/products?category=Sets"
                className={cn(
                  "pb-1 transition-colors hover:text-black",
                  currentCategory === "sets"
                    ? "border-b-2 border-[#5c6e69] text-[#4a5a56]"
                    : "border-b-2 border-transparent hover:border-[#5c6e69]"
                )}
              >
                Sets
              </Link>
              <Link
                href="/products?category=Editorial"
                className={cn(
                  "pb-1 transition-colors hover:text-black",
                  currentCategory === "editorial"
                    ? "border-b-2 border-[#5c6e69] text-[#4a5a56]"
                    : "border-b-2 border-transparent hover:border-[#5c6e69]"
                )}
              >
                Editorial
              </Link>
              <Link
                href="/journal"
                className={cn(
                  "pb-1 transition-colors hover:text-black",
                  pathname === "/journal"
                    ? "border-b-2 border-[#5c6e69] text-[#4a5a56]"
                    : "border-b-2 border-transparent hover:border-[#5c6e69]"
                )}
              >
                Journal
              </Link>
            </nav>

            {/* Actions - Right */}
            <div className="flex items-center justify-end">
              <div className="relative">
                <CartButton />
              </div>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-[#f5f5f5] border-b border-neutral-200 shadow-lg md:hidden p-4 flex flex-col gap-4 z-50">
              <Link
                href="/products?category=Skincare"
                className="text-lg font-medium text-neutral-900 uppercase tracking-wider"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Skincare
              </Link>
              <Link
                href="/products?category=Sets"
                className="text-lg font-medium text-neutral-900 uppercase tracking-wider"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sets
              </Link>
              <Link
                href="/products?category=Editorial"
                className="text-lg font-medium text-neutral-900 uppercase tracking-wider"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Editorial
              </Link>
              <Link
                href="/journal"
                className="text-lg font-medium text-neutral-900 uppercase tracking-wider"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Journal
              </Link>
            </div>
          )}
        </header>
      </div>

    </>
  );
}
