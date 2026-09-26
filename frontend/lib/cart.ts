export interface ProductSizeLite {
  id?: number;
  name: string;
  price: number;
  stock: number;
}

/**
 * A product that has sizes must be added to the cart from its detail page,
 * where a size (and therefore that size's own price and stock) can be picked.
 */
export function hasSizes(sizes: ProductSizeLite[] | null | undefined): boolean {
  return Array.isArray(sizes) && sizes.length > 0;
}

/** True when at least one size can actually be bought right now. */
export function hasSizeInStock(sizes: ProductSizeLite[] | null | undefined): boolean {
  if (!Array.isArray(sizes) || sizes.length === 0) return false;
  return sizes.some((s) => Number(s.stock ?? 0) > 0);
}
