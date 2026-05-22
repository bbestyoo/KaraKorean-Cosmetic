"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import "@/styles/blog.css";

const blogPosts = [
  {
    id: 1,
    title: "The 10-Step Korean Skincare Routine",
    excerpt:
      "Discover the legendary K-beauty routine that transformed millions of complexions worldwide.",
    category: "Routines",
    date: "May 18, 2025",
    image: "/images/blog/skincare-routine.png",
    readTime: "8 min read",
  },
  {
    id: 2,
    title: "Glass Skin: The Ultimate Guide",
    excerpt:
      "Achieve that coveted translucent, dewy complexion with our step-by-step glass skin guide.",
    category: "Trends",
    date: "May 12, 2025",
    image: "/images/blog/glass-skin.png",
    readTime: "6 min read",
  },
  {
    id: 3,
    title: "Korean Beauty Ingredients You Need to Know",
    excerpt:
      "From snail mucin to centella asiatica — the powerhouse ingredients behind K-beauty's global revolution.",
    category: "Ingredients",
    date: "May 8, 2025",
    image: "/images/blog/ingredients.png",
    readTime: "10 min read",
  },
  {
    id: 4,
    title: "Best Korean Sunscreens for Every Skin Type",
    excerpt:
      "Lightweight, invisible, and powerful — find your perfect SPF match from Korea's best.",
    category: "Reviews",
    date: "Apr 30, 2025",
    image: "/images/blog/sunscreen.png",
    readTime: "7 min read",
  },
  {
    id: 5,
    title: "The Art of Double Cleansing",
    excerpt:
      "Why two cleansers are better than one, and how to master this essential first step.",
    category: "Routines",
    date: "Apr 22, 2025",
    image: "/images/blog/double-cleanse.png",
    readTime: "5 min read",
  },
  {
    id: 6,
    title: "Sheet Mask Sunday: A Self-Care Ritual",
    excerpt:
      "Transform your weekends with the ultimate Korean sheet masking ritual for radiant skin.",
    category: "Self-Care",
    date: "Apr 15, 2025",
    image: "/images/blog/sheet-mask.png",
    readTime: "4 min read",
  },
  {
    id: 7,
    title: "Hydration Layering: The Korean Way",
    excerpt:
      "Learn the art of layering hydrating products for plump, bouncy skin all day long.",
    category: "Routines",
    date: "Apr 8, 2025",
    image: "/images/blog/glass-skin.png",
    readTime: "6 min read",
  },
  {
    id: 8,
    title: "K-Beauty Trends to Watch This Year",
    excerpt:
      "From skin flooding to skip-care — the trends shaping Korean beauty right now.",
    category: "Trends",
    date: "Mar 28, 2025",
    image: "/images/blog/skincare-routine.png",
    readTime: "9 min read",
  },
  {
    id: 9,
    title: "Building Your PM Skincare Routine",
    excerpt:
      "Night is when your skin works hardest. Build the perfect evening ritual with K-beauty essentials.",
    category: "Routines",
    date: "Mar 20, 2025",
    image: "/images/blog/double-cleanse.png",
    readTime: "7 min read",
  },
];

const categories = [
  "All",
  "Routines",
  "Trends",
  "Ingredients",
  "Reviews",
  "Self-Care",
];

export default function BlogPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredPosts =
    activeFilter === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeFilter);

  return (
    <section id="blog-page">
      {/* ── Hero ── */}
      <div className="blog-hero">
        <p className="blog-hero-eyebrow">✦ The Kara Journal</p>
        <h1 className="blog-hero-title">Blog</h1>
        <p className="blog-hero-subtitle">
          Stories, rituals, and secrets from the world of Korean beauty — curated
          for the conscious skin enthusiast.
        </p>
      </div>

      {/* ── Filter Tags ── */}
      <div className="blog-filters">
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
      <div className="blog-newsletter">
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
