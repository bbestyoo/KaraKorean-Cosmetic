import { CartSidebar } from "@/components/CartSidebar";
import Footer from "@/components/footer";
import { SiteHeader } from "@/components/SiteHeader";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteHeader />

      <main id="main">{children}</main>
      <Footer />
      <CartSidebar />
    </>
  );
}
