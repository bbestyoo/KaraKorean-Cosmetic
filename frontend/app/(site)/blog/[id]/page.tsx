import { Metadata } from 'next';
import BlogPostClient from './BlogPostClient';
import type { BlogPost } from './BlogPostClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.karakoreanbeauty.com/shop';
const API_ORIGIN = API_BASE_URL.replace(/\/shop\/?$/, '');

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_ORIGIN}/blog/api/`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const posts: Array<{ id: string | number }> = Array.isArray(data) ? data : [];
    return posts.map((p) => ({ id: String(p.id) }));
  } catch {
    return [];
  }
}

function stripHtml(html = ''): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;|\n/g, ' ').trim();
}

function htmlToParagraphs(html = ''): string[] {
  const parts = html.split(/<\/?p>|<br\s*\/?\s*>/i).map(s => stripHtml(s)).filter(Boolean);
  if (parts.length) return parts;
  const flat = stripHtml(html);
  return flat ? [flat] : [];
}

function resolveImageUrl(image?: string | null): string {
  if (!image) return '/images/blog/skincare-routine.png';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  const normalizedPath = image.startsWith('/') ? image : `/${image}`;
  return new URL(normalizedPath, API_ORIGIN).toString();
}

interface ApiBlogPost {
  id?: string | number;
  title?: string;
  content?: string;
  category?: string;
  date?: string;
  image?: string;
  author?: string;
  views?: string | number;
}

async function getBlogPost(id: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_ORIGIN}/blog/api/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const raw: ApiBlogPost = Array.isArray(data) ? data[0] : data;
    if (!raw || !raw.title) return null;

    const contentText = stripHtml(raw.content || '');
    const wordCount = contentText.split(/\s+/).filter(Boolean).length || 0;

    return {
      id: raw.id || id,
      title: raw.title || '',
      excerpt: contentText.slice(0, 200) + (contentText.length > 200 ? '...' : ''),
      category: raw.category || 'Other',
      date: raw.date || '',
      image: resolveImageUrl(raw.image),
      readTime: `${Math.max(1, Math.ceil(wordCount / 200))} min read`,
      author: raw.author || 'Admin',
      authorAvatar: '/images/model1.webp',
      rating: 4.8,
      reviewsCount: 0,
      location: '',
      intro: contentText.slice(0, 250),
      body: htmlToParagraphs(raw.content || ''),
    };
  } catch {
    return null;
  }
}

function generateFallbackPost(id: string): BlogPost {
  const categories = ["Routines", "Trends", "Ingredients", "Reviews", "Self-Care"];
  const category = categories[parseInt(id || '0') % categories.length];
  return {
    id,
    title: `The Premium Guide to K-Beauty Curation #${id}`,
    excerpt: "Discover the legendary K-beauty routine that transformed complexions worldwide.",
    category,
    date: new Date().toISOString().split('T')[0],
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1200&auto=format&fit=crop",
    readTime: "5 min read",
    author: "Kara Editor",
    authorAvatar: "/images/model1.webp",
    rating: 4.7,
    reviewsCount: 140,
    location: "Unknown",
    intro: "Skincare is not just a daily chore, it is an investment in your self-care and long-term health.",
    body: [
      "Consistency is the golden rule of K-beauty. Layering lightweight, nutrient-rich formulas allows active ingredients to penetrate deeply without overloading the pores.",
      "Ensure you cleanse thoroughly, tone gently, target concerns with targeted serums, and seal everything with a premium, skin-fitting moisturizer and broad-spectrum sunscreen.",
    ],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) {
    return {
      title: 'Blog Post Not Found',
      robots: { index: false },
    };
  }

  const description = post.intro
    ? post.intro.slice(0, 160)
    : `Read "${post.title}" on the Kara Korean Beauty blog. Korean beauty tips, skincare routines, and K-beauty trends.`;

  const imageUrl = post.image || '/images/logos/karalogo.jpg';
  const absoluteImageUrl = imageUrl.startsWith('http')
    ? imageUrl
    : `https://www.karakoreanbeauty.com${imageUrl}`;

  return {
    title: post.title,
    description,
    keywords: [
      post.title,
      post.category,
      'Korean beauty',
      'K-beauty',
      'Kara',
      'skincare blog',
      'Nepal',
    ],
    openGraph: {
      title: post.title,
      description,
      url: `https://www.karakoreanbeauty.com/blog/${post.id}`,
      siteName: 'Kara Korean Beauty',
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [absoluteImageUrl],
    },
    alternates: {
      canonical: `https://www.karakoreanbeauty.com/blog/${post.id}`,
    },
  };
}

export default async function SingleBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getBlogPost(id);
  const finalPost = post || generateFallbackPost(id);

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: finalPost.title,
    description: finalPost.intro,
    image: finalPost.image,
    author: {
      '@type': 'Person',
      name: finalPost.author,
    },
    datePublished: finalPost.date,
    publisher: {
      '@type': 'Organization',
      name: 'Kara Korean Beauty',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.karakoreanbeauty.com/images/logos/karalogo.jpg',
      },
    },
    url: `https://www.karakoreanbeauty.com/blog/${finalPost.id}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <BlogPostClient initialPost={finalPost} />
    </>
  );
}
