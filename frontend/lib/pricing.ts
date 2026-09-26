export const CURRENCY_PREFIX = "Rs."

export function formatPrice(value: number | string | null | undefined) {
  const amount = typeof value === "string" ? Number(value) : value
  if (amount == null || Number.isNaN(amount)) return "0"
  return `${CURRENCY_PREFIX} ${Math.round(amount).toLocaleString()}`
}

export function getDiscountPercentage(
  price: number | string | null | undefined,
  oldPrice: number | string | null | undefined
) {
  const current = typeof price === "string" ? Number(price) : price
  const original = typeof oldPrice === "string" ? Number(oldPrice) : oldPrice

  if (current == null || original == null) return 0
  if (Number.isNaN(current) || Number.isNaN(original)) return 0
  if (original <= 0 || current <= 0) return 0
  if (current >= original) return 0

  return Math.ceil(((original - current) / original) * 100)
}

export function hasDiscount(
  price: number | string | null | undefined,
  oldPrice: number | string | null | undefined
) {
  return getDiscountPercentage(price, oldPrice) > 0
}
