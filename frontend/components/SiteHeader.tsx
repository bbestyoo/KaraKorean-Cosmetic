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
    <>
      <header
        className={cn(
          "sticky top-[0] w-full z-40 transition-transform duration-300 border-b bg-[#f7f6f2]",
          isVisible ? "translate-y-0" : "-translate-y-full"
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
          <nav className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 gap-20 text-lg font-bold tracking-[0.15em] text-[#5c6e69] uppercase">
            <Link
              href="/"
              className={cn(
                "relative pb-1 transition-colors hover:text-black group",
                currentCategory === "products" || currentCategory === ""
                  ? "text-[#4a5a56]"
                  : ""
              )}
            >
              Home
              <span
                className={cn(
                  "absolute left-0 bottom-0 h-[2px] bg-[#5c6e69] transition-transform duration-300 ease-out origin-left",
                  currentCategory === "products" || currentCategory === ""
                    ? "w-full scale-x-100"
                    : "w-full scale-x-0 group-hover:scale-x-100"
                )}
              />
            </Link>
            <Link
              href="/products?category=Sets"
              className={cn(
                "relative pb-1 transition-colors hover:text-black group",
                currentCategory === "sets"
                  ? "text-[#4a5a56]"
                  : ""
              )}
            >
              Products
              <span
                className={cn(
                  "absolute left-0 bottom-0 h-[2px] bg-[#5c6e69] transition-transform duration-300 ease-out origin-left",
                  currentCategory === "sets"
                    ? "w-full scale-x-100"
                    : "w-full scale-x-0 group-hover:scale-x-100"
                )}
              />
            </Link>
            <Link
              href="/products?category=Editorial"
              className={cn(
                "relative pb-1 transition-colors hover:text-black group",
                currentCategory === "editorial"
                  ? "text-[#4a5a56]"
                  : ""
              )}
            >
              Skincare
              <span
                className={cn(
                  "absolute left-0 bottom-0 h-[2px] bg-[#5c6e69] transition-transform duration-300 ease-out origin-left",
                  currentCategory === "editorial"
                    ? "w-full scale-x-100"
                    : "w-full scale-x-0 group-hover:scale-x-100"
                )}
              />
            </Link>
            <Link
              href="/blog"
              className={cn(
                "relative pb-1 transition-colors hover:text-black group",
                pathname === "/blog"
                  ? "text-[#4a5a56]"
                  : ""
              )}
            >
              Blog
              <span
                className={cn(
                  "absolute left-0 bottom-0 h-[2px] bg-[#5c6e69] transition-transform duration-300 ease-out origin-left",
                  pathname === "/blog"
                    ? "w-full scale-x-100"
                    : "w-full scale-x-0 group-hover:scale-x-100"
                )}
              />
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

    </>
  );
}
