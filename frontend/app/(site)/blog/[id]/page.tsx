'use client';

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
  id: number;
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

const detailedPosts: Record<string, BlogPost> = {
  '1': {
    id: 1,
    title: "Life is a beautiful journey not a destination",
    excerpt: "Sundarbans National Park, a must-visit place in Bangladesh. Part of the Sundarbans on the Ganges Delta.",
    category: "Entertainment",
    date: "12-03-2023",
    image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=1200&auto=format&fit=crop",
    readTime: "8 min read",
    author: "Madhu",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    rating: 4.9,
    reviewsCount: 275,
    location: "Bangladesh, Khulna division, West Bengal, India",
    intro: "Sundarbans National Park, a must-visit place in Bangladesh. Part of the Sundarbans on the Ganges Delta and home to one of the largest Bengal tiger reserves, Sundarbans National Park is one of the most naturally productive biological ecosystems on earth.",
    body: [
      "Bangladesh offers many tourist attractions, including archaeological sites, historical mosques and monuments, longest natural beach in the world, picturesque landscape, hill forests and wildlife, rolling tea gardens and tribes. Tourists find the rich flora and fauna and colorful tribal life very enchanting.",
      "Bangladesh offers many tourist attractions, including archaeological sites, historical mosques and monuments, longest natural beach in the world, picturesque landscape,",
      "hill forests and wildlife, rolling tea gardens and tribes. Tourists find the rich flora and fauna and colorful tribal life very enchanting."
    ]
  },
  '2': {
    id: 2,
    title: "Glass Skin: The Ultimate K-Beauty Guide",
    excerpt: "Achieve that coveted translucent, dewy complexion with our step-by-step glass skin guide.",
    category: "Trends",
    date: "10-05-2025",
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1200&auto=format&fit=crop",
    readTime: "6 min read",
    author: "Sujana",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    rating: 4.8,
    reviewsCount: 192,
    location: "Seoul, South Korea",
    intro: "Glass skin is a term for exceptionally smooth, even-toned, and lustrous skin that looks so flawless it has the appearance of glass. Originating in South Korea, this trend emphasizes intense hydration and lightweight layering.",
    body: [
      "Achieving glass skin requires a dedicated routine focused on moisture and gentle exfoliation. By layering hydrating toners, essences, and ampoules, we create a deep reservoir of hydration within the skin cells.",
      "Key products include hydrating toners, snail mucin essence, and rich barrier support creams. Consistent SPF application is also crucial to avoid hyperpigmentation and preserve that glass-like translucent finish."
    ]
  },
  '3': {
    id: 3,
    title: "Korean Ingredients You Need to Know",
    excerpt: "From snail mucin to centella asiatica — the powerhouse ingredients behind K-beauty's global revolution.",
    category: "Ingredients",
    date: "08-05-2025",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1200&auto=format&fit=crop",
    readTime: "10 min read",
    author: "Kim Ji-Woo",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    rating: 4.95,
    reviewsCount: 310,
    location: "Jeju Island, South Korea",
    intro: "Korean skincare relies heavily on natural, traditional herbal remedies (Hanbang) coupled with modern scientific innovation. Ingredients like Centella Asiatica, Mugwort, and Snail Mucin have taken the global beauty industry by storm.",
    body: [
      "Centella Asiatica (or Cica) is renowned for its skin-healing and soothing properties, making it a savior for acne-prone or compromised barriers. Mugwort offers powerful antibacterial and calming effects.",
      "Snail Mucin, rich in glycoproteins and hyaluronic acid, provides unparalleled repair and plumping benefits. Incorporating these unique ingredients into your daily routine helps target specific concerns while maintaining skin vitality."
    ]
  }
};

// Fallback dynamic generator for other IDs
const generatePost = (id: string): BlogPost => {
  const categories = ["Routines", "Trends", "Ingredients", "Reviews", "Self-Care"];
  const category = categories[parseInt(id) % categories.length];
  return {
    id: parseInt(id),
    title: `The Premium Guide to K-Beauty Curation #${id}`,
    excerpt: "Discover the legendary K-beauty routine that transformed complexions worldwide.",
    category: category,
    date: "24-05-2026",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1200&auto=format&fit=crop",
    readTime: "5 min read",
    author: "Kara Editor",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    rating: 4.7,
    reviewsCount: 140,
    location: "Busan, South Korea",
    intro: "Skincare is not just a daily chore, it is an investment in your self-care and long-term health. Korean formulation techniques combine botanical wellness with lab-tested performance.",
    body: [
      "Consistency is the golden rule of K-beauty. Layering lightweight, nutrient-rich formulas allows active ingredients to penetrate deeply without overloading the pores.",
      "Ensure you cleanse thoroughly, tone gently, target concerns with targeted serums, and seal everything with a premium, skin-fitting moisturizer and broad-spectrum sunscreen."
    ]
  };
};

const relatedPostsData = [
  {
    id: 101,
    title: "MY REVOLUTIONARY BULLSHTS About \"ATOMIC HABIT\"",
    excerpt: "We identify and approach prospects with your B2B value propositions and help them make buying decisions",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=600&auto=format&fit=crop",
    views: "2983",
    readTime: "4 min",
    date: "Jan 11.2023",
    arrowColor: "black"
  },
  {
    id: 102,
    title: "MY REVOLUTIONARY BULLSHTS About \"ATOMIC HABIT\"",
    excerpt: "We identify and approach prospects with your B2B value propositions and help them make buying decisions",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600&auto=format&fit=crop",
    views: "2983",
    readTime: "4 min",
    date: "Jan 11.2023",
    arrowColor: "orange" // Center card highlights in orange
  },
  {
    id: 103,
    title: "MY REVOLUTIONARY BULLSHTS About \"ATOMIC HABIT\"",
    excerpt: "We identify and approach prospects with your B2B value propositions and help them make buying decisions",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=600&auto=format&fit=crop",
    views: "2983",
    readTime: "4 min",
    date: "Jan 11.2023",
    arrowColor: "black"
  },
  {
    id: 104,
    title: "Understanding Skincare Routine Layering",
    excerpt: "Master the art of layering hydration to achieve smooth and plump skin without clog risk.",
    category: "Entertainment",
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=600&auto=format&fit=crop",
    views: "1892",
    readTime: "5 min",
    date: "Feb 14.2025",
    arrowColor: "black"
  },
  {
    id: 105,
    title: "The Ultimate Sunscreen Science Breakdowns",
    excerpt: "Diving deep into physical versus chemical filters to protect your skin barrier all summer.",
    category: "Social Media",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=600&auto=format&fit=crop",
    views: "3411",
    readTime: "6 min",
    date: "Mar 20.2025",
    arrowColor: "black"
  },
  {
    id: 106,
    title: "Double Cleansing: A Gentle Revolution",
    excerpt: "Why oil attracts oil, and how a double cleanse eliminates sebum and daily pollutants completely.",
    category: "Other",
    image: "https://images.unsplash.com/photo-1601612628452-9e99ced43524?q=80&w=600&auto=format&fit=crop",
    views: "2201",
    readTime: "3 min",
    date: "Apr 05.2025",
    arrowColor: "black"
  }
];

export default function SingleBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const blogId = resolvedParams.id;
  const post = detailedPosts[blogId] || generatePost(blogId);

  // States
  const [wishlisted, setWishlisted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(3); // matching picture 2 default pagination state "3" active

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [blogId]);

  // Related Posts filter logic
  const filteredRelated = relatedPostsData.filter(p => {
    const matchesCategory = activeFilter === "All" || p.category === activeFilter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <main className="min-h-screen bg-white text-neutral-900">
        
        {/* ── BREADCRUMBS BANNER ── */}
        <section 
          className="single-blog-banner"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop')` }}
        >
          <div className="single-blog-banner-breadcrumbs">
            <Link href="/">Home</Link> / <Link href="/blog">blog</Link> / <span className="opacity-70">single_blog</span>
          </div>
        </section>

        {/* ── MAIN CONTENT CONTAINER ── */}
        <div className="single-blog-container">

          {/* ── META BAR ── */}
          <div className="single-blog-meta-bar">
            <div className="single-blog-meta-left">
              {/* Author Avatar */}
              <div className="single-blog-author-avatar relative">
                <Image 
                  src={post.authorAvatar} 
                  alt={post.author} 
                  fill 
                  className="object-cover" 
                />
              </div>

              {/* Rating */}
              <div className="single-blog-meta-item">
                <Star size={16} className="star-icon" />
                <span className="font-bold text-neutral-900">{post.rating}</span>
                <span className="text-neutral-500">({post.reviewsCount} reviews)</span>
              </div>

              {/* Superhost */}
              <div className="single-blog-meta-item">
                <Home size={16} />
                <span>Superhost</span>
              </div>

              {/* Location */}
              <div className="single-blog-meta-item">
                <Flag size={16} />
                <span className="text-neutral-600 underline font-light cursor-pointer hover:text-black">
                  {post.location}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
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

          {/* ── TITLE & INTRO BLOCK ── */}
          <section className="single-blog-grid">
            <div>
              <h1 className="single-blog-title">
                {post.title}
              </h1>
              <div className="single-blog-category-wrap">
                <div className="single-blog-category-underline" />
                <span className="single-blog-category-name">{post.category}</span>
              </div>
            </div>
            <div>
              <p className="single-blog-intro">
                {post.intro}
              </p>
            </div>
          </section>

          {/* ── MAIN FEATURED IMAGE ── */}
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

          {/* ── POST DETAILS & CONTENT ── */}
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

          {/* ── ADD A REVIEW ── */}
          <section className="single-blog-add-review-section">
            <h3>Add a Review</h3>
            <div className="single-blog-add-review-subtitle">
              <div className="single-blog-add-review-subtitle-text">
                Be the first to review <span>Spectacular views of Queenstown</span>
              </div>

              {/* Star Rating Picker */}
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

          {/* ── RELATED POSTS SECTION (PICTURE 2) ── */}
          <section className="related-posts-section">
            <div className="related-posts-header">
              <div className="related-posts-title-wrapper">
                <div className="related-posts-title-bg-block" />
                <h2 className="related-posts-title">Related Post</h2>
              </div>

              <div className="related-posts-controls">
                {/* Filters */}
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

                {/* Search Bar */}
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

            {/* Related Posts Grid */}
            <div className="related-posts-grid">
              {filteredRelated.slice(0, 3).map((item) => (
                <article key={item.id} className="related-post-card">
                  {/* Image Container with Arrow Overlay */}
                  <div className="related-post-image-wrapper relative">
                    <Image 
                      src={item.image} 
                      alt={item.title} 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    
                    {/* Orange or Black slant-arrow overlay */}
                    <div className={`related-post-arrow-overlay ${item.arrowColor === 'black' ? 'black-arrow' : ''}`}>
                      <ArrowDownRight size={18} className="transform rotate-180" />
                    </div>
                  </div>

                  {/* Category Tag */}
                  <span className="related-post-category-tag">
                    {item.category}
                  </span>

                  {/* Title */}
                  <h3 className="related-post-title">
                    {item.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="related-post-excerpt">
                    {item.excerpt}
                  </p>

                  {/* Footer Stats */}
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

            {/* Pagination */}
            <div className="related-posts-pagination">
              <button 
                type="button" 
                className="pagination-arrow-btn gray-btn"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              
              <button 
                type="button" 
                className={`pagination-number-btn ${currentPage === 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(1)}
              >
                1
              </button>
              <button 
                type="button" 
                className={`pagination-number-btn ${currentPage === 2 ? 'active' : ''}`}
                onClick={() => setCurrentPage(2)}
              >
                2
              </button>
              <button 
                type="button" 
                className={`pagination-number-btn ${currentPage === 3 ? 'active' : ''}`}
                onClick={() => setCurrentPage(3)}
              >
                3
              </button>
              
              <span className="pagination-ellipsis">.....</span>
              
              <button 
                type="button" 
                className={`pagination-number-btn ${currentPage === 22 ? 'active' : ''}`}
                onClick={() => setCurrentPage(22)}
              >
                22
              </button>
              <button 
                type="button" 
                className={`pagination-number-btn ${currentPage === 23 ? 'active' : ''}`}
                onClick={() => setCurrentPage(23)}
              >
                23
              </button>
              <button 
                type="button" 
                className={`pagination-number-btn ${currentPage === 24 ? 'active' : ''}`}
                onClick={() => setCurrentPage(24)}
              >
                24
              </button>
              
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
      <Footer />
    </>
  );
}
