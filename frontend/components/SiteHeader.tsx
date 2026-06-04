"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, Heart, User } from "lucide-react";
import { CartButton } from "@/components/CartButton";
import { NavSearch } from "@/components/NavSearch";
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
  { label: "About Us", href: "/about" },
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
                className="object-contain mt-4 p-8  w-[25vw] md:w-[14vw] mb-2"
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
            <NavSearch />
            <Link
              href="/wishlist"
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Wishlist"
            >
              <Heart
                size={22}
                className={cn(
                  "transition-colors hover:text-[#c9a46b]",
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
                className="p-2 rounded-full hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                aria-label="User menu"
              >
                <User size={22} className="hover:text-[#c9a46b]" />
                {isLoggedIn && (
                  <span className="hidden lg:inline-block text-sm font-semibold">{user?.username || user?.name || 'Account'}</span>
                )}
              </button>
              {isUserMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-3 w-64 z-50 rounded-2xl overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(20px) saturate(160%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                    border: '1px solid rgba(201,164,107,0.2)',
                    boxShadow: '0 8px 32px -8px rgba(0,0,0,0.18), 0 2px 8px -2px rgba(201,164,107,0.15)',
                    animation: 'dropdownFadeIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both',
                  }}
                >
                  <style>{`
                    @keyframes dropdownFadeIn {
                      from { opacity: 0; transform: translateY(-8px) scale(0.97); }
                      to   { opacity: 1; transform: translateY(0) scale(1); }
                    }
                  `}</style>

                  {isLoggedIn ? (
                    <>
                      {/* User info header */}
                      <div className="px-4 pt-4 pb-3 border-b border-[#c9a46b]/15">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #c9a46b, #5c8a72)' }}>
                            {(user?.username || user?.name || 'U')[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{user?.username || user?.name || 'Account'}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email || 'Signed in'}</p>
                          </div>
                        </div>
                      </div>
                      {/* Menu items */}
                      <div className="py-2 px-2">
                        <Link
                          href="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-[#c9a46b]/10 hover:text-[#8a6e3a] transition-all duration-200 group"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 group-hover:text-[#c9a46b] transition-colors"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                          My Profile
                        </Link>
                        <button
                          onClick={() => { logout(); setIsUserMenuOpen(false); router.push('/'); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group mt-0.5"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Brand header */}
                      <div className="px-5 pt-5 pb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full" style={{ background: 'linear-gradient(135deg, #c9a46b, #5c8a72)' }} />
                          <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">Kara Korean</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>Welcome back ✨</p>
                        <p className="text-xs text-gray-400 mt-0.5">Sign in to access your account</p>
                      </div>

                      {/* Buttons */}
                      <div className="px-4 pb-5 flex flex-col gap-2.5">
                        <Link
                          href="/login"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold border-2 text-gray-800 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                          style={{ borderColor: 'rgba(92,110,105,0.35)', background: 'rgba(92,110,105,0.05)' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#5c6e69'; (e.currentTarget as HTMLElement).style.background = 'rgba(92,110,105,0.1)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(92,110,105,0.35)'; (e.currentTarget as HTMLElement).style.background = 'rgba(92,110,105,0.05)'; }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
                          Sign In
                        </Link>
                        <Link
                          href="/signup"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:opacity-90"
                          style={{ background: 'linear-gradient(135deg, #c9a46b 0%, #a07840 100%)', boxShadow: '0 4px 14px -4px rgba(201,164,107,0.5)' }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
                          Create Account
                        </Link>
                      </div>
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
                  <div className="flex gap-3 pt-3 pb-1">
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="flex-1 flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-semibold border-2 border-[#5c6e69]/40 text-[#5c6e69] hover:border-[#5c6e69] hover:bg-[#5c6e69]/10 transition-all duration-200 tracking-wide uppercase"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={closeMenu}
                      className="flex-1 flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white uppercase tracking-wide transition-all duration-200 hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, #c9a46b, #a07840)', boxShadow: '0 4px 12px -3px rgba(201,164,107,0.45)' }}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

