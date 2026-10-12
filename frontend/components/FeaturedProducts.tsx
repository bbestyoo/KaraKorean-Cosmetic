"use client";
import ProductShowcase from "./ProductShowcase";

export default function FeaturedProducts() {
  return (
    <ProductShowcase
      eyebrow="OUR BEST"
      title="Featured Products"
      filter={{ featured: true }}
      viewAllHref="/products?featured=true"
    />
  );
}
