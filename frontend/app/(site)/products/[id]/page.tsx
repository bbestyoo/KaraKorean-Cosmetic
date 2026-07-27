import { Metadata } from 'next';
import ProductPageClient from './ProductPageClient';
import type { Product } from './ProductPageClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.karakoreanbeauty.com/shop';
const API_ORIGIN = API_BASE_URL.replace(/\/shop\/?$/, '');

function resolveImageUrl(image?: string | null): string {
  if (!image) return '/images/placeholder.png';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  const normalizedPath = image.startsWith('/') ? image : `/${image}`;
  return new URL(normalizedPath, API_ORIGIN).toString();
}

interface ApiProduct extends Omit<Product, 'category' | 'images'> {
  category?: string | null;
  images?: Array<{ image: string }>;
  description?: string | null;
}

function normalizeProduct(product: ApiProduct): Product {
  return {
    ...product,
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
      next: { revalidate: 3600 },
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
        next: { revalidate: 3600 },
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
    : `https://karakoreanbeauty.com${imageUrl}`;

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
      url: `https://karakoreanbeauty.com/products/${product.product_id}`,
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
      canonical: `https://karakoreanbeauty.com/products/${product.product_id}`,
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
    offers: {
      '@type': 'Offer',
      priceCurrency: 'NPR',
      price: product.price,
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `https://karakoreanbeauty.com/products/${product.product_id}`,
    },
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
