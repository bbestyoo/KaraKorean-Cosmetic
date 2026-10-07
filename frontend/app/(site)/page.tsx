import BestSellers from "@/components/best-sellers";
import Brands from "../../components/brands";
import Collections from "@/components/collections";
import FeaturedProductsDeferred from "@/components/FeaturedProductsDeferred";
import Image from "next/image";
import Link from "next/link";
import NewnessSection from "@/components/NewnessSection";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import NewArrivalsCarousel from "@/components/NewArrivalsCarousel";
import SpringCollection from "@/components/SpringCollection";
import WhyChooseKara from "@/components/WhyChooseKara";
import { Heart } from "lucide-react";
export default function Home() {
  return (
    <>
      <section className="relative w-full mt-12 md:mt-0 h-[25vh] md:h-[85vh] overflow-hidden bg-primary-container">
        <Image
          src="/images/banner/kara-banner.avif"
          alt="Kara Korean Beauty - Premium Korean Cosmetics"
          width={2560}
          height={1016}
          sizes="100vw"
          priority
          fetchPriority="high"
          placeholder="blur"
          blurDataURL="data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACwAwCdASoUAAgAPu1iqk2ppaQiMAgBMB2JYwC7ABog287xQLld4AD+yWh+jXeSSHlNWDTdG3a1Q1+Cgb64EvAM33X48Rr5J69QAA=="
          className="block w-full h-[25vh] md:h-[75vh] object-cover"
        />
        <Brands />
      </section>

      <main>
        {/* ── DESKTOP HERO SECTION (md and up) ── */}
                <FeaturedProductsDeferred />
        {/* Collections Section */}
        <div className=" py-10 mt-0 md:py-20 mdLmt-10">
                    <BestSellers />
        </div>
        <Collections />
        <NewnessSection />
        <SpringCollection />
      </main>
    </>
  );
}
