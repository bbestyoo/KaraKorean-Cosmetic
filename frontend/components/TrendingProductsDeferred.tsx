"use client";

import dynamic from "next/dynamic";
import DeferredMount from "./DeferredMount";

const TrendingProducts = dynamic(() => import("./TrendingProducts"), {
  ssr: false,
});

export default function TrendingProductsDeferred() {
  return (
    <DeferredMount>
      <TrendingProducts />
    </DeferredMount>
  );
}
