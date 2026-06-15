"use client";

import Link from "next/link";
import { FiFacebook, FiInstagram, FiLinkedin, FiYoutube } from "react-icons/fi";
import { FaTiktok, FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
import { MdEmail } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";

export default function Footer() {
  const { isLoggedIn } = useAuth();

  return (
    <footer className="w-full bg-[#0f3b2b] text-white pt-10 sm:pt-16 px-4 sm:px-6 lg:px-12 flex flex-col justify-between overflow-hidden border-t border-gray-100">
      {/* Top Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 mb-10 lg:mb-5 w-full max-w-screen-2xl mx-auto">

        {/* Left Links - taking 4 columns */}
        <div className="lg:col-span-4 flex flex-col gap-2 sm:gap-3">
          {/* {["Skincare", "Sets", "Editorial", "Journal"].map((item) => (
            <Link
              key={item}
              href="#"
              className="text-3xl sm:text-4xl md:text-5xl text-white hover:opacity-70 transition-opacity font-serif tracking-wide"
            >
              {item}
            </Link>
          ))} */}
          <Image
            src="/images/logos/11.png"
            alt="Kara KOREAN BEAUTY STORE"
            width={250}
            height={90}
            className="object-contain bg-transparent mt-4  w-[35vw] sm:w-[25vw] lg:w-[19vw] 2xl:w-[10vw] xl:w-[17vw] mb-2"
          />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">

              <a
                href="https://wa.me/9849900249"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-sm text-white/90 hover:text-white transition-colors group"
              >
                <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors flex-shrink-0">
                  {/* WhatsApp icon */}
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </span>
                WhatsApp: 9849900249
              </a>
            </div>
            <div className="flex gap-4">
              <a
                href="mailto:karakoreanstore@gmail.com
"
                className="flex items-center gap-3 text-sm text-white/90 hover:text-white transition-colors group"
              >
                <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors flex-shrink-0">
                  {/* Email icon */}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m2 7 10 7 10-7" />
                  </svg>
                </span>
                karakoreanstore@gmail.com
              </a>
            </div>
          </div>

        </div>

        {/* Right Categories - taking 8 columns, nested grid */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            {/* Column 1 */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xl text-white font-sans mb-2">Company</h3>
              <ul className="flex flex-col gap-3">
                {[
                  { label: "Home", href: "/" },
                  { label: "About Us", href: "/about" },
                  { label: "Products", href: "/products" },
                  { label: "Blogs", href: "/blog" },
                  { label: "Quiz", href: "/quiz" },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-xs md:text-sm font-semibold tracking-widest uppercase text-white hover:text-[#555f59] transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xl text-white font-sans mb-2">Support</h3>
              <ul className="flex flex-col gap-3">
                {[
                  { label: "Contact Us", href: "/contact" },
                  { label: "Terms & Conditions", href: "/terms" },
                  { label: "FAQ", href: "/faq" },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-xs md:text-sm font-semibold tracking-widest uppercase text-white hover:text-[#555f59] transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xl text-white font-sans mb-2">Account</h3>
              <ul className="flex flex-col gap-3">
                {[
                  { label: "User Profile", href: isLoggedIn ? "/account" : "/login" },
                  { label: "Order History", href: isLoggedIn ? "/account?tab=orders" : "/login" },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-xs md:text-sm font-semibold tracking-widest uppercase text-white hover:text-[#555f59] transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social & Legal (below categories) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6 mt-8 sm:mt-16 pt-6 sm:pt-8 border-t border-[#E85D8A]/20">
            <div className="flex items-center gap-6">
              <Link href="" className="text-white hover:scale-110 transition-transform">
                <FiFacebook size={22} />
              </Link>

              <Link href="https://www.instagram.com/kara_korean_store?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="text-white hover:scale-110 transition-transform">
                <FiInstagram size={22} />
              </Link>
              <Link href="https://www.tiktok.com/@karakoreanstore" className="text-white hover:scale-110 transition-transform">
                < FaTiktok size={22} />
              </Link>
              <Link href="#" className="text-white hover:scale-110 transition-transform">
                <FiYoutube size={22} />
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              Copyright © 2026. Kara Korean Beauty Store All Rights Reserved.
            </div>
          </div>
        </div>
      </div>

      {/* Huge Bottom Text */}
      {/* <div className="w-full flex items-end justify-center pointer-events-none select-none ">
        <h1 className="text-[25vw] md:text-[23vw] leading-none font-serif font-bold tracking-tighter text-[#555f59] -mb-[4vw] md:-mb-[3vw] lg:-mb-[2vw]">
          KARA.
        </h1>

      </div> */}
    </footer>
  );
}
