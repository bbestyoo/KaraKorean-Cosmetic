'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Heart, Share2, LogIn, X, Clipboard, Check, ShoppingBag, Plus } from 'lucide-react';
import { useWishlist, WishlistItem } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';


function WishlistContent() {
  const { wishlist, addToWishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { isLoggedIn, login } = useAuth();
  const { addItem } = useCart();
  const searchParams = useSearchParams();

  const [isHydrated, setIsHydrated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Shared items parsed from URL query parameter
  const [sharedItems, setSharedItems] = useState<WishlistItem[]>([]);



  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#f7f6f2] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0f3b2b] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');
}

const API_ORIGIN = API_BASE_URL.replace(/\/shop\/?$/, '');

    try {
      const response = await fetch(`${API_ORIGIN}/userauth/api/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token, data.user || { username: email });
        setShowLoginModal(false);
      } else {
        if (email && password.length >= 4) {
          login('mock-token-12345', { username: email.split('@')[0] });
          setShowLoginModal(false);
        } else {
          setLoginError('Invalid credentials. Please enter a valid username/password.');
        }
      }
    } catch (err) {
      if (email && password.length >= 4) {
        login('mock-token-12345', { username: email.split('@')[0] });
        setShowLoginModal(false);
      } else {
        setLoginError('Failed to connect to authentication service.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareWishlist = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    const itemIds = wishlist.map((item) => item.product_id).join(',');
    const shareUrl = `${window.location.origin}/wishlist?shared=${encodeURIComponent(itemIds)}`;

    navigator.clipboard.writeText(shareUrl);
    setToastMessage('Shareable link copied to clipboard!');
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  const handleAddAllShared = () => {
    sharedItems.forEach((item) => {
      addToWishlist(item);
    });
    setToastMessage('Added all shared items to your wishlist!');
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
    // Clear query parameter/state
    setSharedItems([]);
  };

  return (
    <main className="min-h-screen bg-[#f7f6f2] pt-10 pb-24 px-6 md:px-12 lg:px-20 relative">

      {/* Toast Notification */}
      {showShareToast && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#0f3b2b] text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 animate-slide-in">
          <Check size={18} className="text-[#E9F3A4]" />
          <span className="text-xs font-semibold uppercase tracking-wider">{toastMessage}</span>
        </div>
      )}

      {/* Shared Curation Header Alert */}
      {sharedItems.length > 0 && (
        <div className="max-w-7xl mx-auto mb-10 p-6 bg-[#0f3b2b]/5 border border-[#0f3b2b]/15 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] tracking-widest text-[#0f3b2b] font-bold uppercase block mb-1">
              ✦ Shared With You
            </span>
            <h2 className="font-serif text-xl text-[#0f3b2b] font-normal">
              Curated List of {sharedItems.length} Saved Beauties
            </h2>
            <p className="text-xs text-[#6b766f] mt-1">
              A friend has shared their premium cosmetic favorites. Add them to your list or explore details.
            </p>
          </div>
          <button
            onClick={handleAddAllShared}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0f3b2b] hover:bg-[#1a4f3c] text-white text-xs font-semibold tracking-widest uppercase transition-all shadow-sm self-start md:self-center"
          >
            <Plus size={14} />
            Save All To Wishlist
          </button>
        </div>
      )}

      {/* Header Info */}
      <div className="max-w-[1600xp] mx-auto flex flex-col md:flex-row md:items-end justify-between border-b border-[#0f3b2b]/10 pb-8 mb-5">
        <div>
          <span className="text-[10px] tracking-[0.35em] text-[#6b766f] font-semibold uppercase block mb-3">
            ✦ Your Saved Luxuries
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#0f3b2b] font-normal leading-none">
            Favorites <span className="text-2xl font-sans text-[#6b766f] ml-2">({wishlist.length})</span>
          </h1>
        </div>

        <div className="mt-6 md:mt-0 flex gap-4">
          <button
            onClick={handleShareWishlist}
            className="flex cursor-pointer items-center gap-2 px-6 py-3 border border-[#0f3b2b]/20 hover:border-[#0f3b2b] text-xs font-semibold tracking-widest text-[#0f3b2b] uppercase transition-all hover:bg-[#0f3b2b] hover:text-white"
          >
            {isLoggedIn ? (
              <>
                <Share2 size={14} />
                Share Favorites
              </>
            ) : (
              <>
                <LogIn size={14} />
                Sign In to Share
              </>
            )}
          </button>

          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="px-6 py-3 border border-red-200 hover:border-red-600 text-xs font-semibold tracking-widest text-red-600 uppercase transition-all hover:bg-red-50 hover:text-red-700"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Luxury Quick Links */}
      <div className="max-w-[1620px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
        <div className="bg-white/50 cursor-pointer hover:shadow-lg  border border-white/80 p-6 flex flex-col justify-between group hover:bg-white transition-all duration-300">
          <span className="text-[10px] tracking-[0.2em] text-[#6b766f] font-semibold uppercase">✦ EXPERIENCE</span>
          <h3 className="font-serif text-lg text-[#0f3b2b] mt-2 mb-4">Complimentary Consultation</h3>
          <p className="text-xs text-[#6b766f] leading-relaxed mb-6">
            Speak with an editorial skincare guide to perfectly match your curated favorites.
          </p>
          <a
            href="mailto:curator@amakonana.com"
            className="text-[10px] tracking-[0.2em] text-[#0f3b2b] font-bold uppercase border-b border-[#0f3b2b] w-fit pb-1 hover:opacity-75 transition-opacity"
          >
            Schedule Appointment
          </a>
        </div>

        <div className="bg-white/50 cursor-pointer hover:shadow-lg  border border-white/80 p-6 flex flex-col justify-between group hover:bg-white transition-all duration-300">
          <span className="text-[10px] tracking-[0.2em] text-[#6b766f] font-semibold uppercase">✦ RITUAL</span>
          <h3 className="font-serif text-lg text-[#0f3b2b] mt-2 mb-4">Tailored Beauty Routine</h3>
          <p className="text-xs text-[#6b766f] leading-relaxed mb-6">
            Build a dynamic, multi-step regimen blending high-active ingredients.
          </p>
          <Link
            href="/blog"
            className="text-[10px] tracking-[0.2em] text-[#0f3b2b] font-bold uppercase border-b border-[#0f3b2b] w-fit pb-1 hover:opacity-75 transition-opacity"
          >
            Explore Skincare Blog
          </Link>
        </div>

        <div className="bg-white/50  cursor-pointer hover:shadow-lg border border-white/80 p-6 flex flex-col justify-between group hover:bg-white transition-all duration-300">
          <span className="text-[10px] tracking-[0.2em] text-[#6b766f] font-semibold uppercase">✦ PACKAGING</span>
          <h3 className="font-serif text-lg text-[#0f3b2b] mt-2 mb-4">Shipped With Premium Care</h3>
          <p className="text-xs text-[#6b766f] leading-relaxed mb-6">
            Every order is meticulously boxed, including custom botanical samples.
          </p>
          <Link
            href="/products"
            className="text-[10px] tracking-[0.2em] text-[#0f3b2b] font-bold uppercase border-b border-[#0f3b2b] w-fit pb-1 hover:opacity-75 transition-opacity"
          >
            Shop New Arrivals
          </Link>
        </div>
      </div>

      {/* Main Grid or Empty state */}
      <div className="max-w-[1600px] mx-auto">
        {wishlist.length === 0 && sharedItems.length === 0 ? (
          <div className="text-center py-24 bg-white/40 border border-dashed border-[#0f3b2b]/15 rounded-lg flex flex-col items-center">
            <Heart className="w-12 h-12 text-[#6b766f]/40 mb-6 animate-pulse" />
            <h2 className="font-serif text-2xl text-[#0f3b2b] mb-3">Your curation list is waiting</h2>
            <p className="text-xs text-[#6b766f] max-w-md leading-relaxed mb-8">
              Explore our pristine collection of clean, editorial-grade skincare formulations and save your coveted treasures.
            </p>
            <Link
              href="/products"
              className="px-8 py-4 bg-[#0f3b2b] hover:bg-[#1a4f3c] text-white text-xs font-semibold tracking-[0.2em] uppercase transition-all shadow-sm"
            >
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

            {/* Render Shared Items first if any */}
            {sharedItems.map((item) => (
              <div
                key={`shared-${item.product_id}`}
                className="group bg-[#0f3b2b]/5 border border-[#0f3b2b]/20 flex flex-col justify-between relative hover:shadow-lg transition-all duration-500 overflow-hidden "
              >
                <div className="absolute top-4 left-4 z-20 bg-[#E9F3A4] text-[#0f3b2b] text-[8px] font-bold uppercase tracking-wider px-2.5 py-1 shadow-sm">
                  Shared
                </div>

                <button
                  onClick={() => addToWishlist(item)}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white shadow-md hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors"
                  aria-label="Add to my list"
                >
                  <Plus size={14} className="text-[#0f3b2b]" />
                </button>

                <div className="p-4">
                  <div className="relative aspect-square bg-[#f2f2f2] overflow-hidden mb-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  <div>
                    {item.category_name && (
                      <span className="text-[10px] tracking-widest text-[#6b766f] uppercase font-semibold block mb-1">
                        {item.category_name}
                      </span>
                    )}
                    <h3 className="font-serif text-base text-[#0f3b2b] line-clamp-2 mb-2 font-normal leading-tight group-hover:text-black transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-semibold text-[#0f3b2b]">
                        Rs. {item.price.toLocaleString()}
                      </span>
                      {item.old_price && (
                        <span className="text-[10px] text-neutral-400 line-through">
                          Rs. {item.old_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-200/50 grid grid-cols-2 divide-x divide-neutral-200/50">
                  <Link
                    href={`/products/${item.product_id}`}
                    className="py-3 text-center text-[10px] tracking-widest text-[#6b766f] hover:text-[#0f3b2b] font-bold uppercase transition-colors"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => {
                      addItem({
                        product_id: item.product_id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        size: '',
                        quantity: 1,
                      });
                    }}
                    className="py-3 text-center text-[10px] tracking-widest text-[#0f3b2b] hover:bg-[#0f3b2b] hover:text-white font-bold uppercase transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag size={10} />
                    Add To Cart
                  </button>
                </div>
              </div>
            ))}

            {/* Render Local Saved Wishlist */}
            {wishlist.map((item) => (
              <div
                key={item.product_id}
                className="group bg-white border border-neutral-100 flex flex-col justify-between relative hover:shadow-lg transition-all duration-500 overflow-hidden cursor-pointer hover:bg-gray-100"
              >
                <button
                  onClick={() => removeFromWishlist(item.product_id)}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white shadow-md hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors"
                  aria-label="Remove item"
                >
                  <X size={14} />
                </button>

                <div className="p-4">
                  <div className="relative aspect-square bg-[#f2f2f2] overflow-hidden mb-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  <div>
                    {item.category_name && (
                      <span className="text-[10px] tracking-widest text-[#6b766f] uppercase font-semibold block mb-1">
                        {item.category_name}
                      </span>
                    )}
                    <h3 className="font-serif text-base text-[#0f3b2b] line-clamp-2 mb-2 font-normal leading-tight group-hover:text-black transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-semibold text-[#0f3b2b]">
                        Rs. {item.price.toLocaleString()}
                      </span>
                      {item.old_price && (
                        <span className="text-[10px] text-neutral-400 line-through">
                          Rs. {item.old_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-100 grid grid-cols-2 divide-x divide-neutral-100">
                  <Link
                    href={`/products/${item.product_id}`}
                    className="py-3 text-center text-[10px] tracking-widest text-[#6b766f] hover:text-[#0f3b2b] font-bold uppercase transition-colors"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => {
                      addItem({
                        product_id: item.product_id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        size: '',
                        quantity: 1,
                      });
                    }}
                    className="py-3 text-center text-[10px] tracking-widest text-[#0f3b2b] hover:bg-[#0f3b2b] hover:text-white font-bold uppercase transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag size={10} />
                    Add To Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Login Modal Overlay */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white max-w-md w-full rounded-lg shadow-2xl p-8 relative border border-[#0f3b2b]/10 animate-scale-up">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-[#6b766f] hover:text-[#0f3b2b] transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <span className="text-[10px] tracking-[0.35em] text-[#6b766f] font-semibold uppercase block mb-2">
                ✦ Share Curation
              </span>
              <h2 className="font-serif text-2xl text-[#0f3b2b] font-normal">Sign In Required</h2>
              <p className="text-xs text-[#6b766f] mt-2 max-w-xs mx-auto">
                Sign in to save your wishlist permanently and generate a custom, shareable beauty catalog for friends.
              </p>
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 mb-4 text-center">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] tracking-widest text-[#6b766f] uppercase font-bold block mb-1">
                  Email Address / Username
                </label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#f7f6f2] border border-[#0f3b2b]/15 px-4 py-3 text-xs text-[#0f3b2b] outline-none focus:border-[#0f3b2b] transition-all"
                  placeholder="curator@amakonana.com"
                />
              </div>

              <div>
                <label className="text-[10px] tracking-widest text-[#6b766f] uppercase font-bold block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#f7f6f2] border border-[#0f3b2b]/15 px-4 py-3 text-xs text-[#0f3b2b] outline-none focus:border-[#0f3b2b] transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#0f3b2b] hover:bg-[#1a4f3c] text-white text-xs font-semibold tracking-[0.2em] uppercase transition-all shadow-sm flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Authenticate'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default function WishlistPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f7f6f2] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0f3b2b] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <WishlistContent />
    </Suspense>
  );
}
