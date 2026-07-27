import BlogPage from "@/components/BlogPage";
import Footer from "@/components/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Explore Korean beauty tips, skincare routines, ingredient guides, and the latest K-beauty trends on the Kara Korean Beauty blog.",
  alternates: {
    canonical: "https://karakoreanbeauty.com/blog",
  },
  openGraph: {
    title: "Blog | Kara Korean Beauty",
    description: "Korean beauty tips, skincare routines, ingredient guides, and the latest K-beauty trends.",
    url: "https://karakoreanbeauty.com/blog",
    type: "website",
  },
};

export default function Blog() {
  return (
    <>
      <BlogPage />
    </>
  );
}
