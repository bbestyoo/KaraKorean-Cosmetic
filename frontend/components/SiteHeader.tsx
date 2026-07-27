"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, Heart, User, ChevronDown } from "lucide-react";
import { CartButton } from "@/components/CartButton";
import { NavSearch } from "@/components/NavSearch";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PromoBanner } from "./PromoBanner";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const API_ORIGIN = API_BASE_URL.replace(/\/shop\/?$/, "");

const NAV_LINKS = [
  { label: "Products", href: "/products" },
  { label: "Blog", href: "/blog" },
  { label: "Quiz", href: "/quiz" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function formatDropdownLabel(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => {
      if (!word) return word;

      if (/^[A-Z0-9&.-]+$/.test(word) && !/[a-z]/.test(word)) {
        return word;
      }

      return word
        .split("-")
        .map((segment) => {
          if (!segment) return segment;

          if (/^[A-Z0-9&.]+$/.test(segment) && !/[a-z]/.test(segment)) {
            return segment;
          }

          return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
        })
        .join("-");
    })
    .join(" ");
}

// ── Hover Mega-Dropdown ──────────────────────────────────────────────────────
function NavDropdown({
  label,
  items,
  buildHref,
}: {
  label: string;
  items: string[];
  buildHref: (item: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setOpen(false), 120);
  };

  const sortedItems = [...items].sort((a, b) => a.localeCompare(b));
  const accentLabel = label === "Brands" ? "Top K-Beauty Brands" : `Browse by ${label}`;
  const featuredTitle = label === "Brands" ? "Curated Brand Edit" : "Shop With Intention";
  const featuredCopy =
    label === "Brands"
      ? "Discover the names our customers return to for glow, repair, and daily ritual essentials."
      : "Find the right category faster with a cleaner, more considered browsing experience.";

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={cn(
          "relative pb-1 text-sm 2xl:text-sm text-xs font-bold tracking-[0.16em] uppercase transition-colors hover:text-black group flex items-center gap-1",
          open ? "text-black" : "text-[#5c6e69]"
        )}
      >
        {label}
        <ChevronDown
          size={12}
          className={cn("transition-transform duration-200", open ? "rotate-180" : "")}
        />
        <span
          className={cn(
            "absolute left-0 bottom-0 h-[2px] bg-[#5c6e69] transition-transform duration-300 ease-out origin-left w-full",
            open ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          )}
        />
      </button>

      {/* Dropdown panel */}
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 top-full pt-4 z-50 transition-all duration-[250ms] origin-top",
          open
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-2 scale-[0.98] pointer-events-none"
        )}
        style={{ width: "min(920px, calc(100vw - 3rem))" }}
      >
        <div
          className="overflow-hidden rounded-[28px] p-5 lg:p-6 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.28)]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(251,248,243,0.98) 100%)",
            backdropFilter: "blur(22px) saturate(145%)",
            WebkitBackdropFilter: "blur(22px) saturate(145%)",
            border: "1px solid rgba(201,164,107,0.14)",
          }}
        >
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-6">
            <div className="min-w-0">
              <div className="mb-4 flex items-center gap-3 px-1">
                <span className="h-2 w-2 rounded-full bg-[#d47aa7] shadow-[0_0_0_6px_rgba(212,122,167,0.12)]" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d47aa7]">
                    {accentLabel}
                  </p>
                  <p className="mt-1 text-xs text-[#7b7a74]">
                    Premium browsing with a cleaner, calmer presentation.
                  </p>
                </div>
              </div>

              <div className="grid max-h-[56vh] grid-cols-2 gap-x-4 gap-y-1.5 overflow-y-auto pr-1 sm:grid-cols-3 xl:grid-cols-4">
                {sortedItems.map((item) => (
                  <Link
                    key={item}
                    href={buildHref(item)}
                    className="group flex items-center rounded-2xl px-3 py-2.5 text-[12px] font-medium text-[#4d5854] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#0f3b2b] hover:text-white"
                  >
                    <span className="truncate">{formatDropdownLabel(item)}</span>
                  </Link>
                ))}
              </div>
            </div>

            <aside
              className="hidden lg:flex flex-col justify-between rounded-[24px] p-5"
              style={{
                background: "linear-gradient(160deg, rgba(15,59,43,0.95) 0%, rgba(92,110,105,0.92) 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
              }}
            >
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/70">
                  Featured
                </p>
                <h3 className="mt-3 font-playfair text-[1.7rem] leading-[1.02] text-white">
                  {featuredTitle}
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/80">
                  {featuredCopy}
                </p>
              </div>

              <div className="mt-6 rounded-[20px] border border-white/12 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/65">
                  Explore everything
                </p>
                <Link
                  href="/products"
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0f3b2b] transition-transform duration-200 hover:-translate-y-[1px]"
                >
                  View all products
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

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

  // Categories & Brands for nav dropdowns
  const [navCategories, setNavCategories] = useState<string[]>([]);
  const [navBrands, setNavBrands] = useState<string[]>([]);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [mobileBrandOpen, setMobileBrandOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch(`${API_ORIGIN}/shop/category/`),
          fetch(`${API_ORIGIN}/shop/brand/`),
        ]);
        const catData = await (catRes.ok ? catRes.json() : Promise.resolve([]));
        const brandData = await (brandRes.ok ? brandRes.json() : Promise.resolve([]));

        const parseList = (arr: unknown[]): string[] => {
          if (!Array.isArray(arr)) return [];
          return arr
            .map((it) => {
              if (typeof it === "string") return it;
              const obj = it as Record<string, unknown>;
              return (obj?.name ?? obj?.category_name ?? obj?.title ?? obj?.label ?? "") as string;
            })
            .filter(Boolean);
        };

        if (mounted) {
          setNavCategories(Array.from(new Set(parseList(catData))).sort((a, b) => a.localeCompare(b)));
          setNavBrands(Array.from(new Set(parseList(brandData))).sort((a, b) => a.localeCompare(b)));
        }
      } catch (err) {
        console.error("Failed to fetch nav categories/brands", err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

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
      setIsVisible((prev) => (prev === shouldShow ? prev : shouldShow));
      lastScrollYRef.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    closeMenu();
    setIsUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

        <div className="h-16 sm:h-20 md:h-24 xl:h-16 2xl:h-24 px-6 lg:px-8 2xl:px-8 xl:px-0 flex items-center justify-between relative">
          {/* Hamburger */}
          <button
            className="xl:hidden p-2 -ml-2 text-neutral-800 transition-transform duration-200 active:scale-90"
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
                src="/images/logos/karalogo.webp"
                alt="Kara KOREAN BEAUTY STORE"
                width={250}
                height={90}
                className="object-contain mt-4 md:p-8 p-2 w-[35vw] sm:w-[25vw] lg:w-[19vw] 2xl:w-[14vw] xl:w-[15vw] mb-2"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex md:gap-5 lg:gap-8 xl:gap-5 items-center absolute left-1/6 xl:left-1/7 2xl:left-1/5 2xl:gap-[1.9vw] text-[#5c6e69]">
            {NAV_LINKS.map(({ label, href }) => {
              // Insert dropdowns after "Products"
              if (label === "Products") {
                return (
                  <div key={href} className="flex items-center gap-5 lg:gap-8 xl:gap-5 2xl:gap-[1.6vw]">
                    <Link
                      href={href}
                      className={cn(
                        "relative pb-1 2xl:text-sm xl:text-xs text-sm font-bold tracking-[0.15em] uppercase transition-colors hover:text-black group",
                        isActive(href) ? "text-[#4a5a56]" : ""
                      )}
                    >
                      {label}
                      <span
                        className={cn(
                          "absolute left-0 bottom-0 h-[2px] bg-[#5c6e69] transition-transform duration-300 ease-out origin-left w-full",
                          isActive(href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        )}
                      />
                    </Link>

                    {navCategories.length > 0 && (
                      <NavDropdown
                        label="Categories"
                        items={navCategories}
                        buildHref={(item) => `/products?category=${encodeURIComponent(item)}`}
                      />
                    )}

                    {navBrands.length > 0 && (
                      <NavDropdown
                        label="Brands"
                        items={navBrands}
                        buildHref={(item) => `/products?brand=${encodeURIComponent(item)}`}
                      />
                    )}
                  </div>
                );
              }

              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative pb-1 text-sm xl:text-xs 2xl:text-sm font-bold tracking-[0.15em] uppercase transition-colors hover:text-black group",
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

          {/* Right icons */}
          <div className="flex items-center gap-1">
            <NavSearch />
            <Link
              href="/wishlist"
              className="relative p-2 hidden md:block hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Wishlist"
            >
              <Heart
                size={22}
                className={cn(
                  "transition-colors hover:text-[#c9a46b]",
                  pathname === "/wishlist" ? "fill-[#c9a46b] text-[#c9a46b]" : "text-gray-900"
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
                {/* {isLoggedIn && (
                  <span className="hidden lg:inline-block text-sm font-semibold">
                    {user?.username || user?.name || "Account"}
                  </span>
                )} */}
              </button>
              {isUserMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-3 w-64 z-50 rounded-2xl overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(20px) saturate(160%)",
                    WebkitBackdropFilter: "blur(20px) saturate(160%)",
                    border: "1px solid rgba(201,164,107,0.2)",
                    boxShadow: "0 8px 32px -8px rgba(0,0,0,0.18), 0 2px 8px -2px rgba(201,164,107,0.15)",
                    animation: "dropdownFadeIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both",
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
                      <div className="px-4 pt-4 pb-3 border-b border-[#c9a46b]/15">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #c9a46b, #5c8a72)" }}
                          >
                            {(user?.username || user?.name || "U")[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {user?.username || user?.name || "Account"}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{user?.email || "Signed in"}</p>
                          </div>
                        </div>
                      </div>
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
                          onClick={() => { logout(); setIsUserMenuOpen(false); router.push("/"); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group mt-0.5"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-5 pt-5 pb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full" style={{ background: "linear-gradient(135deg, #c9a46b, #5c8a72)" }} />
                          <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">Kara Korean</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>Welcome back ✨</p>
                        <p className="text-xs text-gray-400 mt-0.5">Sign in to access your account</p>
                      </div>
                      <div className="px-4 pb-5 flex flex-col gap-2.5">
                        <Link
                          href="/login"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold border-2 text-gray-800 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                          style={{ borderColor: "rgba(92,110,105,0.35)", background: "rgba(92,110,105,0.05)" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#5c6e69"; (e.currentTarget as HTMLElement).style.background = "rgba(92,110,105,0.1)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(92,110,105,0.35)"; (e.currentTarget as HTMLElement).style.background = "rgba(92,110,105,0.05)"; }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
                          Sign In
                        </Link>
                        <Link
                          href="/signup"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:opacity-90"
                          style={{ background: "linear-gradient(135deg, #c9a46b 0%, #a07840 100%)", boxShadow: "0 4px 14px -4px rgba(201,164,107,0.5)" }}
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

        {/* Mobile Menu */}
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
            <div className="h-0.5 w-full bg-gradient-to-r from-[#0f3b2b]/20 via-[#c9a46b]/40 to-[#0f3b2b]/20" />

            <div className="px-6 pt-5 pb-6 flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href }, i) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "group flex items-center justify-between py-3.5 border-b border-neutral-100 last:border-0",
                    "text-base font-semibold uppercase tracking-[0.15em] transition-colors duration-200",
                    isActive(href) ? "text-[#0f3b2b]" : "text-neutral-700 hover:text-[#0f3b2b]"
                  )}
                  style={{ transitionDelay: isMobileMenuOpen ? `${i * 40}ms` : "0ms" }}
                  onClick={closeMenu}
                >
                  {label}
                  {isActive(href) && <span className="w-1.5 h-1.5 rounded-full bg-[#c9a46b]" />}
                </Link>
              ))}

              {/* Mobile Categories — click accordion */}
              {navCategories.length > 0 && (
                <div className="border-b border-neutral-100">
                  <button
                    onClick={() => setMobileCatOpen((v) => !v)}
                    className="group w-full flex items-center justify-between py-3.5 text-base font-semibold uppercase tracking-[0.15em] text-neutral-700 hover:text-[#0f3b2b] transition-colors duration-200"
                  >
                    Categories
                    <ChevronDown
                      size={15}
                      className={cn("transition-transform duration-200 text-[#c9a46b]", mobileCatOpen ? "rotate-180" : "")}
                    />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      mobileCatOpen ? "max-h-[400px] pb-3" : "max-h-0"
                    )}
                  >
                    <div className="flex flex-wrap gap-2">
                      {[...navCategories].sort((a, b) => a.localeCompare(b)).map((cat) => (
                        <Link
                          key={cat}
                          href={`/products?category=${encodeURIComponent(cat)}`}
                          onClick={closeMenu}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:bg-[#0f3b2b] hover:text-white hover:border-[#0f3b2b] transition-all"
                        >
                          {cat}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Brands — click accordion */}
              {navBrands.length > 0 && (
                <div className="border-b border-neutral-100">
                  <button
                    onClick={() => setMobileBrandOpen((v) => !v)}
                    className="group w-full flex items-center justify-between py-3.5 text-base font-semibold uppercase tracking-[0.15em] text-neutral-700 hover:text-[#0f3b2b] transition-colors duration-200"
                  >
                    Brands
                    <ChevronDown
                      size={15}
                      className={cn("transition-transform duration-200 text-[#c9a46b]", mobileBrandOpen ? "rotate-180" : "")}
                    />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      mobileBrandOpen ? "max-h-[400px] pb-3" : "max-h-0"
                    )}
                  >
                    <div className="flex flex-wrap gap-2">
                      {[...navBrands].sort((a, b) => a.localeCompare(b)).map((brand) => (
                        <Link
                          key={brand}
                          href={`/products?brand=${encodeURIComponent(brand)}`}
                          onClick={closeMenu}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:bg-[#0f3b2b] hover:text-white hover:border-[#0f3b2b] transition-all"
                        >
                          {brand}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Wishlist row */}
              <Link
                href="/wishlist"
                className="group flex items-center gap-3 py-3.5 text-base font-semibold uppercase tracking-[0.15em] text-neutral-700 hover:text-[#0f3b2b] transition-colors duration-200 border-t border-neutral-100 mt-1"
                onClick={closeMenu}
              >
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
                      onClick={() => { logout(); closeMenu(); router.push("/"); }}
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
                      style={{ background: "linear-gradient(135deg, #c9a46b, #a07840)", boxShadow: "0 4px 12px -3px rgba(201,164,107,0.45)" }}
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
