"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, Heart, User } from "lucide-react";
import { CartButton } from "@/components/CartButton";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PromoBanner } from "./PromoBanner";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Blog", href: "/blog" },
  { label: "Quiz", href: "/quiz" },
  { label: "About", href: "/about" },
];

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const pathname = usePathname();
  const { wishlist: wishlistItems } = useWishlist();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { isLoggedIn, user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Handle animated open/close: mount first, then animate in; animate out, then unmount
  const openMenu = () => {
    setMenuMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsMobileMenuOpen(true));
    });
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    setTimeout(() => setMenuMounted(false), 350);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const shouldShow = !(currentScrollY > lastScrollYRef.current && currentScrollY > 100);
      setIsVisible((previousVisible) =>
        previousVisible === shouldShow ? previousVisible : shouldShow
      );
      lastScrollYRef.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change (also close user menu)
  useEffect(() => {
    closeMenu();
    setIsUserMenuOpen(false);
  }, [pathname]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 w-full z-40 transition-transform duration-300 border-b bg-[#f7f6f2]",
          isVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <PromoBanner />

        <div className="h-16 sm:h-20 md:h-24 px-6 lg:px-8 flex items-center justify-between relative">
          <button
            className="md:hidden p-2 -ml-2 text-neutral-800 transition-transform duration-200 active:scale-90"
            onClick={isMobileMenuOpen ? closeMenu : openMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <span
              className={cn(
                "block transition-all duration-300",
                isMobileMenuOpen ? "rotate-90 opacity-0 absolute" : "rotate-0 opacity-100"
              )}
            >
              <Menu className="w-6 h-6" />
            </span>
            <span
              className={cn(
                "block transition-all duration-300",
                isMobileMenuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0 absolute"
              )}
            >
              <X className="w-6 h-6" />
            </span>
          </button>

          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/images/logos/karalogo.png"
                alt="Kara KOREAN BEAUTY STORE"
                width={250}
                height={90}
                className="object-contain mt-4 w-[25vw] md:w-[14vw] mb-2"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:gap-5 lg:gap-10 xl:gap-12 2xl:gap-16 items-center absolute left-1/2 -translate-x-1/2 text-lg font-bold tracking-[0.15em] text-[#5c6e69] uppercase">
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
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* User icon dropdown (desktop) */}
         

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
                    ? "fill-[#c9a46b] text-[#c9a46b]"
                    : "text-gray-900"
                )}
              />
              {wishlistItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-[#c9a46b] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <CartButton />
            <div className="hidden md:flex items-center mr-3 relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen((v) => !v)}
                className="p-2 rounded-full hover:bg-gray-100 flex items-center gap-2"
                aria-label="User menu"
              >
                <User size={22} />
                {isLoggedIn && (
                  <span className="hidden lg:inline-block text-sm font-semibold">{user?.username || user?.name || 'Account'}</span>
                )}
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white z-50 py-1 shadow-md border">
                  {isLoggedIn ? (
                    <>
                      <Link href="/account" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                          router.push('/');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Sign In
                      </Link>
                      <Link href="/signup" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu — animated slide-down */}
        {menuMounted && (
          <div
            className={cn(
              "absolute top-full left-0 w-full bg-[#f7f6f2] border-b border-neutral-200 shadow-xl md:hidden z-50 overflow-hidden",
              "transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)]",
              isMobileMenuOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-3 pointer-events-none"
            )}
          >
            {/* Decorative top accent */}
            <div className="h-0.5 w-full bg-gradient-to-r from-[#0f3b2b]/20 via-[#c9a46b]/40 to-[#0f3b2b]/20" />

            <div className="px-6 pt-5 pb-6 flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href }, i) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "group flex items-center justify-between py-3.5 border-b border-neutral-100 last:border-0",
                    "text-base font-semibold uppercase tracking-[0.15em] transition-colors duration-200",
                    isActive(href)
                      ? "text-[#0f3b2b]"
                      : "text-neutral-700 hover:text-[#0f3b2b]"
                  )}
                  style={{ transitionDelay: isMobileMenuOpen ? `${i * 40}ms` : "0ms" }}
                  onClick={closeMenu}
                >
                  {label}
                  {isActive(href) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9a46b]" />
                  )}
                </Link>
              ))}

              {/* Wishlist row */}
              <Link
                href="/wishlist"
                className="group flex items-center gap-3 py-3.5 text-base font-semibold uppercase tracking-[0.15em] text-neutral-700 hover:text-[#0f3b2b] transition-colors duration-200 border-t border-neutral-100 mt-1"
                onClick={closeMenu}
              >
                {/* <Heart size={17} className="text-current" /> */}
                Wishlist
                {wishlistItems.length > 0 && (
                  <span className="ml-auto bg-[#c9a46b] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              {/* Auth links (mobile) */}
              <div className="border-t border-neutral-100">
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/account"
                      className="group block py-3.5 text-base font-semibold uppercase tracking-[0.15em] text-neutral-700 hover:text-[#0f3b2b]"
                      onClick={() => { closeMenu(); }}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        closeMenu();
                        router.push('/');
                      }}
                      className="group block w-full text-left py-3.5 text-base font-semibold uppercase tracking-[0.15em] text-neutral-700 hover:text-[#0f3b2b]"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="group block py-3.5 text-base font-semibold uppercase tracking-[0.15em] text-neutral-700 hover:text-[#0f3b2b]"
                      onClick={closeMenu}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="group block py-3.5 text-base font-semibold uppercase tracking-[0.15em] text-neutral-700 hover:text-[#0f3b2b]"
                      onClick={closeMenu}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

