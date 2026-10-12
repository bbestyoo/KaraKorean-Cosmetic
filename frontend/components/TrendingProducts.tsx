"use client";
import ProductShowcase from "./ProductShowcase";

export default function TrendingProducts() {
  return (
    <ProductShowcase
      eyebrow="TRENDING NOW"
      title="Trending This Week"
      filter={{ trending: true }}
      viewAllHref="/products?trending=true"
      viewAllLabel="VIEW ALL TRENDING"
    />
  );
}
