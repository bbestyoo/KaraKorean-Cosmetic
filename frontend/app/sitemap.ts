import type { MetadataRoute } from "next";

const BASE_URL = "https://www.karakoreanbeauty.com";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.karakoreanbeauty.com/shop";

interface SitemapProduct {
  product_id: string;
}

interface SitemapBlogPost {
  id: string | number;
}

async function fetchProductIds(): Promise<string[]> {
  try {
    const allIds: string[] = [];
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
      const res = await fetch(`${API_BASE_URL}/api/?page=${page}`, {
        next: { revalidate: 3600, tags: ['product'] },
      });
      if (!res.ok) break;
      const data = await res.json();
      const results: SitemapProduct[] = Array.isArray(data?.results) ? data.results : [];
      allIds.push(...results.map((p) => String(p.product_id)));
      totalPages = Number(data?.total_pages) || 1;
      page++;
    }

    return allIds;
  } catch {
    return [];
  }
}

async function fetchBlogPostIds(): Promise<string[]> {
  try {
    const API_ORIGIN = API_BASE_URL.replace(/\/shop\/?$/, "");
    const res = await fetch(`${API_ORIGIN}/blog/api/`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const posts: SitemapBlogPost[] = Array.isArray(data) ? data : [];
    return posts.map((p) => String(p.id));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productIds, blogPostIds] = await Promise.all([
    fetchProductIds(),
    fetchBlogPostIds(),
  ]);

  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/quiz`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const productPages: MetadataRoute.Sitemap = productIds.map((id) => ({
    url: `${BASE_URL}/products/${id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPostIds.map((id) => ({
    url: `${BASE_URL}/blog/${id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...blogPages];
}
