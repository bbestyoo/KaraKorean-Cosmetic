import Link from "next/link";
import { FiInstagram, FiLinkedin, FiTwitter, FiYoutube } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="w-full bg-white pt-16 px-4 sm:px-6 lg:px-12 flex flex-col justify-between overflow-hidden border-t border-gray-100">
      {/* Top Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-4 mb-16 lg:mb-5 w-full max-w-screen-2xl mx-auto">

        {/* Left Links - taking 4 columns */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {["Skincare", "Sets", "Editorial", "Journal"].map((item) => (
            <Link
              key={item}
              href="#"
              className="text-4xl md:text-5xl text-[#555f59] hover:opacity-70 transition-opacity font-serif tracking-wide"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Right Categories - taking 8 columns, nested grid */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Column 1 */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xl text-[#555f59] font-sans mb-2">Company</h3>
              <ul className="flex flex-col gap-3">
                {["About Us", "Careers", "Partnerships"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-xs md:text-sm font-semibold tracking-widest uppercase text-[#555f59] hover:text-[#555f59] transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xl text-[#555f59] font-sans mb-2">Support</h3>
              <ul className="flex flex-col gap-3">
                {["Contact Us", "Shipping", "Returns", "FAQ"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-xs md:text-sm font-semibold tracking-widest uppercase text-[#555f59] hover:text-[#555f59] transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xl text-[#555f59] font-sans mb-2">Account</h3>
              <ul className="flex flex-col gap-3">
                {["Log In", "Order History"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-xs md:text-sm font-semibold tracking-widest uppercase text-[#555f59] hover:text-[#555f59] transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social & Legal (below categories) */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mt-16 pt-8 border-t border-[#E85D8A]/20">
            <div className="flex items-center gap-6">
              <Link href="#" className="text-[#555f59] hover:scale-110 transition-transform">
                <FiLinkedin size={22} />
              </Link>

              <Link href="#" className="text-[#555f59] hover:scale-110 transition-transform">
                <FiInstagram size={22} />
              </Link>
              <Link href="#" className="text-[#555f59] hover:scale-110 transition-transform">
                <FiTwitter size={22} />
              </Link>
              <Link href="#" className="text-[#555f59] hover:scale-110 transition-transform">
                <FiYoutube size={22} />
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              {["Terms", "Privacy", "Cookies"].map((item) => (
                <Link key={item} href="#" className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#555f59] hover:text-[#555f59] transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Huge Bottom Text */}
      <div className="w-full flex items-end justify-center pointer-events-none select-none ">
        <h1 className="text-[25vw] md:text-[23vw] leading-none font-serif font-bold tracking-tighter text-[#555f59] -mb-[4vw] md:-mb-[3vw] lg:-mb-[2vw]">
          KARA.
        </h1>

      </div>
    </footer>
  );
}
