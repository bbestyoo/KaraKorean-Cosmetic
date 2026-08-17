"use client";

import dynamic from "next/dynamic";
import DeferredMount from "./DeferredMount";

const FeaturedProducts = dynamic(() => import("./FeaturedProducts"), {
  ssr: false,
});

export default function FeaturedProductsDeferred() {
  return (
    <DeferredMount>
      <FeaturedProducts />
    </DeferredMount>
  );
}
