import { Metadata } from 'next';
import ProductsClient from './ProductsClient';
import type { ProductSizeLite } from '@/lib/cart';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.karakoreanbeauty.com/shop';
const API_ORIGIN = API_BASE_URL.replace(/\/shop\/?$/, '');
const ITEMS_PER_PAGE = 16;

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'Shop authentic Korean skincare and beauty products at Kara Korean Beauty. Browse curated K-beauty brands like COSRX, Isntree, Anua, and more with delivery across Nepal.',
  alternates: {
    canonical: 'https://www.karakoreanbeauty.com/products',
  },
  openGraph: {
    title: 'Shop | Kara Korean Beauty',
    description:
      'Browse authentic Korean skincare and beauty products with delivery across Nepal.',
    url: 'https://www.karakoreanbeauty.com/products',
    type: 'website',
  },
};

interface ServerProduct {
  product_id: string;
  name: string;
  price: number | string;
  old_price?: number | string | null;
  category_name?: string | null;
  category?: string | { name?: string } | null;
  brand?: string | { name?: string } | null;
  brandName?: string | null;
  sizes?: ProductSizeLite[];
  stock_count?: number;
  images?: Array<{ image: string }>;
}

function resolveImageUrl(image?: string | null): string {
  if (!image) return '/images/placeholder.png';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  const normalizedPath = image.startsWith('/') ? image : `/${image}`;
  return new URL(normalizedPath, API_ORIGIN).toString();
}

function normalizeProduct(product: ServerProduct) {
  const sizes: ProductSizeLite[] = Array.isArray(product.sizes)
    ? product.sizes.map((s) => ({
        id: s?.id,
        name: String(s?.name ?? ''),
        price: Number(s?.price ?? 0),
        stock: Number(s?.stock ?? 0),
      }))
    : [];

  return {
    product_id: product.product_id,
    name: product.name,
    price: Number(product.price) || 0,
    old_price:
      product.old_price === null || product.old_price === undefined
        ? null
        : Number(product.old_price),
    category_name:
      product.category_name ||
      (typeof product.category === 'string' ? product.category : product.category?.name) ||
      'Uncategorized',
    brand:
      product.brandName ||
      (typeof product.brand === 'string' ? product.brand : product.brand?.name) ||
      'Unknown',
    // Size stock is the source of truth whenever the product has sizes.
    in_stock: sizes.length > 0 ? sizes.some((s) => (s.stock ?? 0) > 0) : Number(product.stock_count ?? 0) > 0,
    images: Array.isArray(product.images)
      ? product.images.map((image) => ({ image: resolveImageUrl(image.image) }))
      : [],
    sizes,
  };
}

async function fetchInitialProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/?page=1&page_size=${ITEMS_PER_PAGE}`, {
      next: { revalidate: 3600, tags: ['product'] },
    });
    if (!res.ok) return { products: [], totalPages: 1 };
    const data = await res.json();
    const results: ServerProduct[] = Array.isArray(data?.results) ? data.results : [];
    return {
      products: results.map(normalizeProduct),
      totalPages: Number(data?.total_pages) || 1,
    };
  } catch {
    return { products: [], totalPages: 1 };
  }
}

export default async function ProductsPage() {
  const { products, totalPages } = await fetchInitialProducts();
  return (
    <>
      <nav aria-label="All products" className="sr-only">
        <ul>
          {products.map((product) => (
            <li key={product.product_id}>
              <a href={`/products/${product.product_id}`}>{product.name}</a>
            </li>
          ))}
        </ul>
      </nav>
      <ProductsClient initialProducts={products} initialTotalPages={totalPages} />
    </>
  );
}
