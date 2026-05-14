import BestSellers from "@/components/best-sellers";
import Collections from "@/components/collections";
import Footer from "@/components/footer";
import FeaturedProducts from "@/components/FeaturedProducts";
import NewnessSection from "@/components/NewnessSection";
import SpringCollection from "@/components/SpringCollection";
import { HomeHero } from "@/components/HomeHero";

export default function Home() {
  return (
    <HomeHero>
      <BestSellers />

      <FeaturedProducts />
      <Collections />

      <NewnessSection />

      <SpringCollection />

      <Footer />
    </HomeHero>
  );
}
