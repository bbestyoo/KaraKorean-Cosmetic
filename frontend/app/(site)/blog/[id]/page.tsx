"use client";

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '@/styles/blog.css';
import {
  Heart,
  Send,
  Upload,
  MoreHorizontal,
  X,
  Star,
  Home,
  Flag,
  User,
  Eye,
  Clock,
  Calendar,
  Search,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Footer from "@/components/footer";

interface BlogPost {
  id: string | number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  readTime: string;
  author: string;
  authorAvatar: string;
  rating: number;
  reviewsCount: number;
  location: string;
  intro: string;
  body: string[];
}

// Fallback generator for when backend is unavailable
const generatePost = (id: string): BlogPost => {
  const categories = ["Routines", "Trends", "Ingredients", "Reviews", "Self-Care"];
  const category = categories[parseInt(id || '0') % categories.length];
  return {
    id,
    title: `The Premium Guide to K-Beauty Curation #${id}`,
    excerpt: "Discover the legendary K-beauty routine that transformed complexions worldwide.",
    category: category,
    date: new Date().toISOString().split('T')[0],
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1200&auto=format&fit=crop",
    readTime: "5 min read",
    author: "Kara Editor",
    authorAvatar: "/images/model1.png",
    rating: 4.7,
    reviewsCount: 140,
    location: "Unknown",
    intro: "Skincare is not just a daily chore, it is an investment in your self-care and long-term health.",
    body: [
      "Consistency is the golden rule of K-beauty. Layering lightweight, nutrient-rich formulas allows active ingredients to penetrate deeply without overloading the pores.",
      "Ensure you cleanse thoroughly, tone gently, target concerns with targeted serums, and seal everything with a premium, skin-fitting moisturizer and broad-spectrum sunscreen."
    ]
  };
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');1
}

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

function htmlToParagraphs(html = '') {
  const parts = html.split(/<\/?p>|<br\s*\/?\s*>/i).map(s => stripHtml(s)).filter(Boolean);
  if (parts.length) return parts;
  const flat = stripHtml(html);
  return flat ? [flat] : [];
}


export default function SingleBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const blogId = String(resolvedParams.id || '');

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(3);

  useEffect(() => {
    let mounted = true;
    const fetchPost = async () => {
      if (!blogId) return;
      try {
        setLoading(true);
        const res = await fetch(`${API_ORIGIN}/blog/api/${blogId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await res.json();
        const raw = Array.isArray(data) ? data[0] : data;

        if (!raw) {
          if (mounted) setPost(generatePost(blogId));
          return;
        }

        const contentText = stripHtml(raw.content || '');
        const wordCount = contentText.split(/\s+/).filter(Boolean).length || 0;
        const mapped: BlogPost = {
          id: raw.id || blogId,
          title: raw.title || '',
          excerpt: contentText.slice(0, 200) + (contentText.length > 200 ? '...' : ''),
          category: raw.category || 'Other',
          date: raw.date || '',
          image: resolveImageUrl(raw.image),
          readTime: `${Math.max(1, Math.ceil(wordCount / 200))} min read`,
          author: raw.author || 'Admin',
          authorAvatar: '/images/model1.png',
          rating: 4.8,
          reviewsCount: 0,
          location: '',
          intro: contentText.slice(0, 250),
          body: htmlToParagraphs(raw.content || '')
        };

        if (mounted) setPost(mapped);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        if (mounted) setPost(generatePost(blogId));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPost();
    return () => { mounted = false; };
  }, [blogId]);

  useEffect(() => {
    if (post) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [post]);


  if (loading || !post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0f3b2b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-white text-neutral-900">
        <section 
          className="single-blog-banner"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop')` }}
        >
          <div className="single-blog-banner-breadcrumbs">
            <Link href="/">Home</Link> / <Link href="/blog">blog</Link> / <span className="opacity-70">single_blog</span>
          </div>
        </section>

        <div className="single-blog-container">
          <div className="single-blog-meta-bar">
            <div className="single-blog-meta-left">
              <div className="single-blog-author-avatar relative">
                <Image 
                  src={post.authorAvatar} 
                  alt={post.author} 
                  fill 
                  className="object-cover" 
                />
              </div>

              <div className="single-blog-meta-item">
                <Star size={16} className="star-icon" />
                <span className="font-bold text-neutral-900">{post.rating}</span>
                <span className="text-neutral-500">({post.reviewsCount} reviews)</span>
              </div>

              <div className="single-blog-meta-item">
                <Home size={16} />
                <span>Superhost</span>
              </div>

              <div className="single-blog-meta-item">
                <Flag size={16} />
                <span className="text-neutral-600 underline font-light cursor-pointer hover:text-black">
                  {post.location}
                </span>
              </div>
            </div>

            <div className="single-blog-meta-right">
              <button 
                onClick={() => alert("Shared successfully!")}
                className="single-blog-action-btn"
                aria-label="Send post"
              >
                <Send size={15} className="rotate-45" />
              </button>
              <button 
                onClick={() => alert("Link copied to clipboard!")}
                className="single-blog-action-btn"
                aria-label="Export post"
              >
                <Upload size={15} />
              </button>
              <button 
                onClick={() => setWishlisted(!wishlisted)}
                className="single-blog-action-btn"
                aria-label="Wishlist post"
              >
                <Heart 
                  size={15} 
                  className={wishlisted ? "fill-[#c9a46b] text-[#c9a46b]" : ""} 
                />
              </button>
              <button 
                className="single-blog-action-btn"
                aria-label="More options"
              >
                <MoreHorizontal size={15} />
              </button>
              <button 
                onClick={() => router.push("/blog")}
                className="single-blog-action-btn"
                aria-label="Close page"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          <section className="single-blog-grid">
            <div>
              <h1 className="single-blog-title">{post.title}</h1>
              <div className="single-blog-category-wrap">
                <div className="single-blog-category-underline" />
                <span className="single-blog-category-name">{post.category}</span>
              </div>
            </div>
            <div>
              <p className="single-blog-intro">{post.intro}</p>
            </div>
          </section>

          <div className="single-blog-featured-image-wrapper relative rounded-sm">
            <Image 
              src={post.image} 
              alt={post.title} 
              fill 
              priority 
              className="object-cover" 
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>

          <section className="single-blog-details-section">
            <h2>Post Details</h2>
            <div className="single-blog-detail-host">
              <span>Hosted by {post.date} .</span>
              <div className="single-blog-detail-host-avatar relative">
                <Image 
                  src={post.authorAvatar} 
                  alt={post.author} 
                  fill 
                  className="object-cover" 
                />
              </div>
              <span className="single-blog-detail-host-name">{post.author}</span>
            </div>

            <div className="single-blog-content">
              {post.body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="single-blog-add-review-section">
            <h3>Add a Review</h3>
            <div className="single-blog-add-review-subtitle">
              <div className="single-blog-add-review-subtitle-text">
                Be the first to review <span>Spectacular views of Queenstown</span>
              </div>

              <div className="single-blog-review-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`single-blog-review-star-btn ${
                      star <= (hoverRating || rating) ? "active" : ""
                    }`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    aria-label={`Rate ${star} star`}
                  >
                    <Star 
                      size={20} 
                      className={star <= (hoverRating || rating) ? "fill-[#fbbf24] text-[#fbbf24]" : "text-gray-300"} 
                    />
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="related-posts-section">
            <div className="related-posts-header">
              <div className="related-posts-title-wrapper">
                <div className="related-posts-title-bg-block" />
                <h2 className="related-posts-title">Related Post</h2>
              </div>

              <div className="related-posts-controls">
                <div className="related-posts-filters">
                  {["All", "Technology", "Entertainment", "Social Media", "Other"].map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      className={`related-posts-filter-btn ${activeFilter === filter ? "active" : ""}`}
                      onClick={() => setActiveFilter(filter)}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="related-posts-search-wrapper">
                  <input 
                    type="text" 
                    placeholder="Search" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="related-posts-search-input"
                  />
                  <Search size={14} className="related-posts-search-icon" />
                </div>
              </div>
            </div>

            <div className="related-posts-grid">
              {filteredRelated.slice(0, 3).map((item) => (
                <article key={item.id} className="related-post-card">
                  <div className="related-post-image-wrapper relative">
                    <Image 
                      src={item.image} 
                      alt={item.title} 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className={`related-post-arrow-overlay ${item.arrowColor === 'black' ? 'black-arrow' : ''}`}>
                      <ArrowDownRight size={18} className="transform rotate-180" />
                    </div>
                  </div>

                  <span className="related-post-category-tag">{item.category}</span>
                  <h3 className="related-post-title">{item.title}</h3>
                  <p className="related-post-excerpt">{item.excerpt}</p>

                  <div className="related-post-footer">
                    <div className="related-post-meta-item">
                      <Eye size={14} />
                      <span>{item.views}</span>
                    </div>
                    <div className="related-post-meta-item">
                      <Clock size={14} />
                      <span>{item.readTime}</span>
                    </div>
                    <div className="related-post-meta-item">
                      <Calendar size={14} />
                      <span>{item.date}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="related-posts-pagination">
              <button 
                type="button" 
                className="pagination-arrow-btn gray-btn"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              <button type="button" className={`pagination-number-btn ${currentPage === 1 ? 'active' : ''}`} onClick={() => setCurrentPage(1)}>1</button>
              <button type="button" className={`pagination-number-btn ${currentPage === 2 ? 'active' : ''}`} onClick={() => setCurrentPage(2)}>2</button>
              <button type="button" className={`pagination-number-btn ${currentPage === 3 ? 'active' : ''}`} onClick={() => setCurrentPage(3)}>3</button>
              <span className="pagination-ellipsis">.....</span>
              <button type="button" className={`pagination-number-btn ${currentPage === 22 ? 'active' : ''}`} onClick={() => setCurrentPage(22)}>22</button>
              <button type="button" className={`pagination-number-btn ${currentPage === 23 ? 'active' : ''}`} onClick={() => setCurrentPage(23)}>23</button>
              <button type="button" className={`pagination-number-btn ${currentPage === 24 ? 'active' : ''}`} onClick={() => setCurrentPage(24)}>24</button>
              <button 
                type="button" 
                className="pagination-arrow-btn black-btn"
                onClick={() => setCurrentPage(p => Math.min(24, p + 1))}
                disabled={currentPage === 24}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
