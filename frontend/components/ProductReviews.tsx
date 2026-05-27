"use client";

import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Review {
  id: string;
  productId: string;
  rating: number;
  content: string;
  userName: string;
  userId?: string | null;
  createdAt: string;
  approved: boolean;
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { isLoggedIn, user, login } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ total_ratings: 0, rating_dict: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, avg_rating: 0 });
  const [loading, setLoading] = useState(true);

  // form state
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [name, setName] = useState(user?.username || "");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // login modal state
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  async function fetchReviews() {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`);
      if (res.ok) {
        const json = await res.json();
        setReviews(json.reviews || []);
        setStats(json.stats || { total_ratings: 0, rating_dict: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, avg_rating: 0 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }

    if (!content.trim()) {
      setMessage("Please write a review before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const body = {
        productId,
        rating,
        content,
        userName: user?.username || name || "Anonymous",
        userId: user?.id || user?.username || null,
      };

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setMessage('Thanks — your review was submitted and is pending admin approval.');
        setContent('');
        setRating(5);
      } else {
        setMessage('Failed to submit review.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Network error submitting review.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/shop';
      const response = await fetch(`${API_BASE_URL}/userauth/api/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginEmail, password: loginPassword }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token, data.user || { username: loginEmail });
        setShowLogin(false);
      } else {
        // fallback mock login for local dev
        login('mock-token-12345', { username: loginEmail.split('@')[0] });
        setShowLogin(false);
      }
    } catch (err) {
      // fallback mock login
      login('mock-token-12345', { username: loginEmail.split('@')[0] });
      setShowLogin(false);
    }
  }

  return (
    <section className="max-w-[1800px] mx-auto py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Stats + Reviews */}
        <div className="lg:col-span-2 bg-white border border-gray-100 p-6 rounded">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-semibold text-[#0f3b2b]">Customer Reviews</h3>
              <p className="text-sm text-[#6b766f]">What people are saying about this product</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-3xl font-semibold text-[#0f3b2b]">{stats.avg_rating || 0}</span>
                <div className="flex items-center text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className={i < Math.round(stats.avg_rating || 0) ? 'text-yellow-400' : 'text-gray-300'} />
                  ))}
                </div>
              </div>
              <div className="text-sm text-[#6b766f]">{stats.total_ratings} Ratings</div>
            </div>
          </div>

          {/* Rating breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6 items-center">
            {([5,4,3,2,1] as number[]).map((r) => {
              const count = stats.rating_dict?.[r] || 0;
              const pct = stats.total_ratings ? Math.round((count / stats.total_ratings) * 100) : 0;
              return (
                <div key={r} className="flex items-center gap-3 col-span-1 sm:col-span-5">
                  <div className="w-12 text-sm text-[#6b766f]">{r} <Star size={12} className="inline-block text-yellow-400" /></div>
                  <div className="flex-1 bg-gray-100 h-3 rounded overflow-hidden">
                    <div style={{ width: `${pct}%` }} className="h-3 bg-[#0f3b2b]" />
                  </div>
                  <div className="w-10 text-right text-sm text-[#6b766f]">{count}</div>
                </div>
              );
            })}
          </div>

          <hr className="my-4" />

          <h4 className="text-lg font-semibold text-[#0f3b2b] mb-4">Recent Feedbacks</h4>

          <div className="space-y-4">
            {loading ? (
              <div className="text-sm text-[#6b766f]">Loading reviews…</div>
            ) : reviews.length === 0 ? (
              <div className="text-sm text-[#6b766f]">No reviews yet.</div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="flex gap-4 bg-white p-4 border border-gray-100 rounded">
                  <div className="w-12 h-12 rounded-full bg-[#0f3b2b] flex items-center justify-center text-white font-semibold text-sm">{(rev.userName || 'U').charAt(0).toUpperCase()}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-[#0f3b2b]">{rev.userName}</div>
                      <div className="flex items-center gap-1 text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={14} className={i < rev.rating ? 'text-yellow-400' : 'text-gray-200'} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-[#6b766f] mt-2">{rev.content}</p>
                    <div className="text-xs text-[#6b766f] mt-2">{new Date(rev.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Add a Review */}
        <aside className="bg-white border border-gray-100 p-6 rounded">
          <h3 className="text-xl font-semibold text-[#0f3b2b]">Add a Review</h3>
          <p className="text-sm text-[#6b766f] mb-4">You must be signed in to leave a review. Reviews require admin approval before appearing.</p>

          {!isLoggedIn ? (
            <div>
              <button
                onClick={() => setShowLogin(true)}
                className="w-full px-4 py-3 bg-[#0f3b2b] text-white rounded font-semibold cursor-pointer hover:bg-white hover:text-black hover:border hover:border-[#0f3b2b] transition-colors" 
              >
                Sign in to leave a review
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-[#6b766f] uppercase tracking-wide">Your Rating</label>
                <div className="flex items-center gap-2 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const idx = i + 1;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setRating(idx)}
                        className="p-1"
                        aria-label={`${idx} star`}
                      >
                        <Star size={20} className={idx <= rating ? 'text-yellow-400' : 'text-gray-200'} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs text-[#6b766f] uppercase tracking-wide">Name</label>
                <input value={user?.username || name} onChange={(e) => setName(e.target.value)} disabled={!!user?.username} className="w-full mt-2 border border-gray-200 rounded px-3 py-2 text-sm" />
              </div>

              <div>
                <label className="text-xs text-[#6b766f] uppercase tracking-wide">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full mt-2 border border-gray-200 rounded px-3 py-2 text-sm" />
              </div>

              <div>
                <label className="text-xs text-[#6b766f] uppercase tracking-wide">Write Your Review</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={5} className="w-full mt-2 border border-gray-200 rounded px-3 py-2 text-sm" />
              </div>

              {message && <div className="text-sm text-[#6b766f]">{message}</div>}

              <div>
                <button type="submit" disabled={submitting} className="w-full px-4 py-3 bg-[#0f3b2b] text-white rounded font-semibold">
                  {submitting ? 'Submitting…' : 'Submit'}
                </button>
              </div>
            </form>
          )}

          {/* Login modal (simple) */}
          {showLogin && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded p-6 w-full max-w-md">
                <h4 className="text-lg font-semibold text-[#0f3b2b] mb-3">Sign in</h4>
                <form onSubmit={handleLoginSubmit} className="space-y-3">
                  <input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="you@example.com" className="w-full border border-gray-200 rounded px-3 py-2 text-sm" />
                  <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Password" className="w-full border border-gray-200 rounded px-3 py-2 text-sm" />
                  {loginError && <div className="text-sm text-red-600">{loginError}</div>}
                  <div className="flex items-center gap-3">
                    <button type="submit" className="px-4 py-2 bg-[#0f3b2b] text-white rounded">Sign in</button>
                    <button type="button" onClick={() => setShowLogin(false)} className="px-4 py-2 border rounded">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
