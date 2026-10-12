import { CartSidebar } from "@/components/CartSidebar";
import Footer from "@/components/footer";
import { SiteHeader } from "@/components/SiteHeader";
import type { BannerData } from "@/components/PromoBanner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.karakoreanbeauty.com/shop";
const API_ORIGIN = API_BASE_URL.replace(/\/shop\/?$/, "");

const REVALIDATE = 300;

async function fetchList(url: string): Promise<string[]> {
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE } });
    if (!res.ok) return [];
    const arr = await res.json();
    if (!Array.isArray(arr)) return [];
    const names = arr
      .map((it) => {
        if (typeof it === "string") return it;
        const obj = it as Record<string, unknown>;
        return String(
          obj?.name ?? obj?.category_name ?? obj?.title ?? obj?.label ?? ""
        );
      })
      .filter(Boolean);
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}

async function fetchBanner(): Promise<BannerData | null> {
  try {
    const res = await fetch(`${API_ORIGIN}/shop/api/banner/`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data[0];
    return null;
  } catch {
    return null;
  }
}

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [banner, navCategories, navBrands] = await Promise.all([
    fetchBanner(),
    fetchList(`${API_ORIGIN}/shop/category/`),
    fetchList(`${API_ORIGIN}/shop/brand/`),
  ]);

  return (
    <>
      <SiteHeader
        banner={banner}
        navCategories={navCategories}
        navBrands={navBrands}
      />

      <main id="main">{children}</main>
      <CartSidebar />
      <Footer/>
    </>
  );
}