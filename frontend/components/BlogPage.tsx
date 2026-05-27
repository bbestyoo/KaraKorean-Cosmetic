"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import "@/styles/blog.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/shop';
const API_ORIGIN = API_BASE_URL.replace(/\/shop\/?$/, '');

function resolveImageUrl(image?: string | null) {
  if (!image) return '/images/blog/skincare-routine.png';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;

  const normalizedPath = image.startsWith('/') ? image : `/${image}`;
  return new URL(normalizedPath, API_ORIGIN).toString();
}

function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;|\n/g, ' ').trim();
}

export default function BlogPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_ORIGIN}/blog/api/`);
        if (!res.ok) throw new Error('Failed to fetch blog posts');
        const data = await res.json();

        const normalized = (Array.isArray(data) ? data : []).map((p: any) => {
          const contentText = stripHtml(p.content || '');
          const wordCount = contentText.split(/\s+/).filter(Boolean).length || 0;
          return {
            id: p.id,
            title: p.title,
            excerpt: contentText.slice(0, 180) + (contentText.length > 180 ? '...' : ''),
            category: p.category || 'Other',
            date: p.date ? new Date(p.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '',
            image: resolveImageUrl(p.image),
            readTime: `${Math.max(1, Math.ceil(wordCount / 200))} min read`,
          };
        });

        if (mounted) setPosts(normalized);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPosts();
    return () => { mounted = false; };
  }, []);

  const categories = useMemo(() => [
    'All',
    ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))
  ], [posts]);

  const filteredPosts =
    activeFilter === "All"
      ? posts
      : posts.filter((post) => post.category === activeFilter);

  return (
    <section id="blog-page" className=" max-w-[1700px] mx-auto">
      {/* ── Hero ── */}
      <div className="blog-hero">
        <p className="blog-hero-eyebrow">✦ The Kara Journal</p>
        <h1 className="blog-hero-title">Blog</h1>
        <p className="blog-hero-subtitle">
          Stories, rituals, and secrets from the world of Korean beauty — curated
          for the conscious skin enthusiast.
        </p>
        {/* ── Filter Tags ── */}
        <div className="blog-filters mt-8">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`blog-filter-tag ${activeFilter === cat ? "active" : ""}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>


      {/* ── Dynamic Grid ── */}
      <div className="blog-grid-section">
        <div className="blog-grid" key={activeFilter}>
          {filteredPosts.map((post) => (
            <Link
              href={`/blog/${post.id}`}
              key={post.id}
              className="blog-card"
            >
              <div className="blog-card-image-wrapper">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  style={{ objectFit: "cover" }}
                />
              </div>

              {/* Always-visible bottom info */}
              <div className="blog-card-bottom">
                <span className="blog-card-bottom-title">{post.title}</span>
                <span className="blog-card-bottom-date">{post.readTime}</span>
              </div>

              {/* Hover overlay */}
              <div className="blog-card-overlay">
                <span className="blog-card-category">{post.category}</span>
                <h3 className="blog-card-title">{post.title}</h3>
                <p className="blog-card-excerpt">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Newsletter CTA ── */}
      <div className="blog-newsletter md:mb-20">
        <h2 className="blog-newsletter-title">Stay in the Glow</h2>
        <p className="blog-newsletter-desc">
          Get weekly K-beauty tips, exclusive deals, and new blog posts delivered
          straight to your inbox.
        </p>
        <form
          className="blog-newsletter-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            className="blog-newsletter-input"
            placeholder="Your email address"
            aria-label="Email address for newsletter"
          />
          <button type="submit" className="blog-newsletter-btn">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
