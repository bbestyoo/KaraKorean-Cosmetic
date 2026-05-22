import BlogPage from "@/components/BlogPage";
import Footer from "@/components/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Kara Korean Beauty",
  description:
    "Explore Korean beauty tips, skincare routines, ingredient guides, and the latest K-beauty trends on the Kara Korean Beauty blog.",
};

export default function Blog() {
  return (
    <>
      <BlogPage />
      <Footer />
    </>
  );
}
