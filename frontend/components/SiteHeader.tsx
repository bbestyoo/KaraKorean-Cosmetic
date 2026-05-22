"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Heart } from "lucide-react";
import { CartButton } from "@/components/CartButton";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { PromoBanner } from "./PromoBanner";
import { useWishlist } from "@/context/WishlistContext";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Blog", href: "/blog" },
  { label: "Quiz", href: "/quiz" },
  { label: "About", href: "/about" },
];

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();
  const { wishlist: wishlistItems } = useWishlist();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 w-full z-40 transition-transform duration-300 border-b bg-[#f7f6f2]",
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

          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/images/logos/karalogo.png"
                alt="Kara KOREAN BEAUTY STORE"
                width={180}
                height={60}
                className="object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 gap-16 text-lg font-bold tracking-[0.15em] text-[#5c6e69] uppercase">
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative pb-1 transition-colors hover:text-black group",
                    active ? "text-[#4a5a56]" : ""
                  )}
                >
                  {label}
                  <span
                    className={cn(
                      "absolute left-0 bottom-0 h-[2px] bg-[#5c6e69] transition-transform duration-300 ease-out origin-left w-full",
                      active
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Actions - Right: Wishlist icon + Cart */}
          <div className="flex items-center gap-1">
            <Link
              href="/wishlist"
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Wishlist"
            >
              <Heart
                size={22}
                className={cn(
                  "transition-colors",
                  pathname === "/wishlist"
                    ? "fill-red-500 text-red-500"
                    : "text-gray-900"
                )}
              />
              {wishlistItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <CartButton />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#f5f5f5] border-b border-neutral-200 shadow-lg md:hidden p-4 flex flex-col gap-4 z-50">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-lg font-medium uppercase tracking-wider transition-colors",
                  isActive(href)
                    ? "text-[#4a5a56] font-bold"
                    : "text-neutral-900"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/wishlist"
              className="text-lg font-medium uppercase tracking-wider text-neutral-900 flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Heart size={18} />
              Wishlist
              {wishlistItems.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
