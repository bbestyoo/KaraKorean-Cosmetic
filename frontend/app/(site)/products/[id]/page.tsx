import { Metadata } from 'next';
import ProductPageClient from './ProductPageClient';
import type { Product } from './ProductPageClient';

type Size = Product['sizes'][number];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.karakoreanbeauty.com/shop';
const API_ORIGIN = API_BASE_URL.replace(/\/shop\/?$/, '');

function resolveImageUrl(image?: string | null): string {
  if (!image) return '/images/placeholder.png';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  const normalizedPath = image.startsWith('/') ? image : `/${image}`;
  return new URL(normalizedPath, API_ORIGIN).toString();
}

interface ApiProduct extends Omit<Product, 'category' | 'images' | 'in_stock' | 'stock_count'> {
  category?: string | null;
  images?: Array<{ image: string }>;
  description?: string | null;
  stock_count?: number;
}

function normalizeProduct(product: ApiProduct): Product {
  const sizes: Size[] = Array.isArray(product.sizes)
    ? product.sizes.map((s) => ({
        id: Number(s?.id ?? 0),
        name: String(s?.name ?? ''),
        price: Number(s?.price ?? 0),
        stock: Number(s?.stock ?? 0),
      }))
    : [];

  // Size stock is the source of truth whenever the product has sizes.
  const sizeStock = sizes.reduce((sum, s) => sum + s.stock, 0);

  return {
    ...product,
    sizes,
    stock_count: sizes.length > 0 ? sizeStock : (product.stock_count ?? 0),
    in_stock: sizes.length > 0 ? sizes.some((s) => s.stock > 0) : Number(product.stock_count ?? 0) > 0,
    category: product.category || 'Uncategorized',
    images: Array.isArray(product.images)
      ? product.images.map((img) => ({
          ...img,
          image: resolveImageUrl(img.image),
        }))
      : [],
  };
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/${id}/`, {
      next: { revalidate: 3600, tags: ['product'] },
    });
    if (!res.ok) return null;
    const data: ApiProduct = await res.json();
    return normalizeProduct(data);
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const allProducts: Array<{ product_id: string }> = [];
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
      const res = await fetch(`${API_BASE_URL}/api/?page=${page}`, {
        next: { revalidate: 3600, tags: ['product'] },
      });
      if (!res.ok) break;
      const data = await res.json();
      const results: Array<{ product_id: string }> = Array.isArray(data?.results) ? data.results : [];
      allProducts.push(...results);
      totalPages = Number(data?.total_pages) || 1;
      page++;
    }

    return allProducts.map((p) => ({ id: String(p.product_id) }));
  } catch {
    return [];
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;|\n/g, ' ').trim();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found',
      robots: { index: false },
    };
  }

  const description = product.description
    ? stripHtml(product.description).slice(0, 160)
    : `Shop ${product.name} at Kara Korean Beauty. Authentic Korean skincare delivered to Kathmandu, Nepal.`;

  const imageUrl = product.images?.[0]?.image || '/images/logos/karalogo.jpg';
  const absoluteImageUrl = imageUrl.startsWith('http')
    ? imageUrl
    : `https://www.karakoreanbeauty.com${imageUrl}`;

  return {
    title: product.name,
    description,
    keywords: [
      product.name,
      product.category,
      'Korean beauty',
      'K-beauty',
      'Kara',
      'Nepal',
      'skincare',
    ],
    openGraph: {
      title: product.name,
      description,
      url: `https://www.karakoreanbeauty.com/products/${product.product_id}`,
      siteName: 'Kara Korean Beauty',
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 1600,
          alt: product.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: [absoluteImageUrl],
    },
    alternates: {
      canonical: `https://www.karakoreanbeauty.com/products/${product.product_id}`,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-neutral-500 text-lg">Product not found</p>
      </div>
    );
  }

  // With sizes, every size is its own SKU priced on its own, so publish an
  // AggregateOffer over the real per-size prices rather than the base price.
  const sellableSizes = product.sizes.filter((s) => s.stock > 0);
  const sizePrices = sellableSizes.map((s) => s.price).filter((p) => p > 0);

  const offers =
    sizePrices.length > 0
      ? {
          '@type': 'AggregateOffer',
          priceCurrency: 'NPR',
          lowPrice: Math.min(...sizePrices),
          highPrice: Math.max(...sizePrices),
          offerCount: sizePrices.length,
          availability: product.in_stock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          url: `https://www.karakoreanbeauty.com/products/${product.product_id}`,
        }
      : {
          '@type': 'Offer',
          priceCurrency: 'NPR',
          price: product.price,
          availability: product.in_stock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          url: `https://www.karakoreanbeauty.com/products/${product.product_id}`,
        };

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description
      ? stripHtml(product.description)
      : `Shop ${product.name} at Kara Korean Beauty.`,
    image: product.images?.map((img) => img.image) || [],
    brand: {
      '@type': 'Brand',
      name: 'Kara Korean Beauty',
    },
    offers,
    url: `https://karakoreanbeauty.com/products/${product.product_id}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductPageClient initialProduct={product} />
    </>
  );
}
