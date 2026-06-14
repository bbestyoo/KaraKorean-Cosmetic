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

              <FaWhatsapp size={24} />
              <p>
                Whatsapp: +977 9849900249,
              </p>
            </div>
            <div className="flex gap-4">
              <MdEmail size={24} />
              <p>
                Email: karakoreanstore@gmail.com
              </p>
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
