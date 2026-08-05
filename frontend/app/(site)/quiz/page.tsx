'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');
}

const API_ORIGIN = API_BASE_URL.replace(/\/shop\/?$/, '');

function resolveImageUrl(image?: string | null): string {
  if (!image) return '/images/placeholder.png';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  const normalizedPath = image.startsWith('/') ? image : `/${image}`;
  return new URL(normalizedPath, API_ORIGIN).toString();
}

interface Option {
  id: number;
  name: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  filterKey: string;
  options: Option[];
  allowSkip?: boolean;
}

interface ApiProduct {
  product_id: string;
  name: string;
  price: number | string;
  old_price?: number | string | null;
  category_name?: string | null;
  images?: Array<{ image: string }>;
  brand?: string | { name?: string } | null;
  brandName?: string | null;
  in_stock?: boolean;
}

interface Product {
  product_id: string;
  name: string;
  price: number;
  old_price?: number | null;
  category_name: string;
  in_stock: boolean;
  images: Array<{ image: string }>;
}

function normalizeProduct(product: ApiProduct): Product {
  const categoryValue = product.category_name || 'Uncategorized';
  return {
    product_id: product.product_id,
    name: product.name,
    price: Number(product.price) || 0,
    old_price:
      product.old_price === null || product.old_price === undefined ? null : Number(product.old_price),
    category_name: categoryValue,
    in_stock: product.in_stock !== false,
    images: Array.isArray(product.images)
      ? product.images.map((image) => ({ image: resolveImageUrl(image.image) }))
      : [],
  };
}

const LABELS = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

const CARD_BG = '#f4c2c2';
const CARD_BG2 = '#f4c2c2';
const CARD_BG3 = '#f4c2c2';
const SAGE_DARK = '#000000';
const SAGE_MID = '#000000';

export default function QuizPage() {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addItem } = useCart();

  // ── Dynamic options state ──────────────────────────────────────────────────
  const [skinTypes, setSkinTypes] = useState<Option[]>([]);
  const [concerns, setConcerns] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [brands, setBrands] = useState<Option[]>([]);
  const [useCases, setUseCases] = useState<Option[]>([]);
  const [combos, setCombos] = useState<Option[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const endpoints = [
          `${API_ORIGIN}/shop/skintype/`,
          `${API_ORIGIN}/shop/concern/`,
          `${API_ORIGIN}/shop/category/`,
          `${API_ORIGIN}/shop/brand/`,
          `${API_ORIGIN}/shop/usecase/`,
          `${API_ORIGIN}/shop/combo/`,
        ];
        const responses = await Promise.all(endpoints.map((url) => fetch(url)));
        const data = await Promise.all(responses.map((r) => (r.ok ? r.json() : [])));

        const parse = (arr: any): Option[] =>
          Array.isArray(arr) ? arr.map((item: any) => ({ id: item.id, name: item.name })) : [];

        const [st, cn, cat, br, uc, co] = data.map(parse);

        setSkinTypes(st);
        setConcerns(cn);
        setCategories(cat);
        setBrands(br);
        setUseCases(uc);
        setCombos(co);

        setQuestions(buildQuestions({ skinTypes: st, concerns: cn, categories: cat, brands: br, useCases: uc, combos: co }));
        setLoadingOptions(false);
      } catch (err) {
        console.error('Failed to load quiz options:', err);
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  // ── Quiz navigation state ──────────────────────────────────────────────────
  const [current, setCurrent] = useState(0);
  const [shown, setShown] = useState(0);
  const [answers, setAnswers] = useState<(Option | null)[]>([]);
  const [selected, setSelected] = useState<Option | null>(null);
  const [sliding, setSliding] = useState(false);
  const [done, setDone] = useState(false);
  const lockRef = useRef(false);

  // ── Result products state ──────────────────────────────────────────────────
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [fetchError, setFetchError] = useState('');

  // Initialize answers array when questions load
  useEffect(() => {
    if (questions.length > 0 && answers.length === 0) {
      setAnswers(new Array(questions.length).fill(null));
    }
  }, [questions]);

  const q = questions[shown];
  const total = questions.length;

  // ── Navigate Next ──────────────────────────────────────────────────────────
  const handleNext = () => {
    if (selected === null || lockRef.current) return;
    lockRef.current = true;

    const newAnswers = [...answers];
    newAnswers[current] = selected;
    setAnswers(newAnswers);

    const next = current + 1;

    setSliding(true);

    setTimeout(() => {
      if (next >= total) {
        setDone(true);
        lockRef.current = false;
        return;
      }
      setCurrent(next);
      setShown(next);
      setSelected(answers[next] ?? null);
    }, 200);

    setTimeout(() => {
      setSliding(false);
      lockRef.current = false;
    }, 380);
  };

  // ── Navigate Back ──────────────────────────────────────────────────────────
  const handleBack = () => {
    if (current === 0 || lockRef.current) return;
    lockRef.current = true;

    const prev = current - 1;

    setSliding(true);

    setTimeout(() => {
      setCurrent(prev);
      setShown(prev);
      setSelected(answers[prev] ?? null);
    }, 200);

    setTimeout(() => {
      setSliding(false);
      lockRef.current = false;
    }, 380);
  };

  // ── Fetch products on completion ───────────────────────────────────────────
  useEffect(() => {
    if (!done || answers.length === 0) return;

    const fetchResults = async () => {
      setLoadingProducts(true);
      setFetchError('');

      try {
        const params = new URLSearchParams();
        params.set('page_size', '50');

        answers.forEach((answer, idx) => {
          if (!answer || (questions[idx]?.allowSkip && answer.id === 0)) return;
          const question = questions[idx];
          if (question) {
            params.set(question.filterKey, answer.name);
          }
        });

        const response = await fetch(`${API_BASE_URL}/api/?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch products');

        const data = await response.json();
        const results = Array.isArray(data?.results) ? data.results : [];
        setProducts(results.map(normalizeProduct));
      } catch (err) {
        console.error('Error fetching quiz results:', err);
        setFetchError('Unable to load products right now.');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchResults();
  }, [done, answers, questions]);

  // ── Reset ──────────────────────────────────────────────────────────────────
  const resetQuiz = () => {
    setCurrent(0);
    setShown(0);
    setAnswers([]);
    setSelected(null);
    setDone(false);
    setProducts([]);
    setFetchError('');
  };

  // Build filter string for "View all results" link
  const filterParams = new URLSearchParams();
  answers.forEach((answer, idx) => {
    if (!answer || (questions[idx]?.allowSkip && answer.id === 0)) return;
    const question = questions[idx];
    if (question) {
      filterParams.set(question.filterKey, answer.name);
    }
  });
  const resultsUrl = `/products?${filterParams.toString()}`;

  const progress = total > 0 ? ((current + 1) / total) * 100 : 0;

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loadingOptions) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#fff8e7' }}>
        <p className="text-sm tracking-[0.25em] uppercase">Loading quiz...</p>
      </main>
    );
  }

  // ── Result screen ──────────────────────────────────────────────────────────
  if (done) {
    return (
      <main className="min-h-screen flex flex-col items-center px-4 py-24" style={{ background: '#fff8e7' }}>
        <div className="w-full max-w-6xl text-center">
          <p className="text-[11px] font-black tracking-[0.25em] uppercase mb-4" style={{ color: '#000' }}>
            Your personalized results
          </p>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-6 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            {loadingProducts
              ? 'Finding your perfect match...'
              : `We found ${products.length} product${products.length !== 1 ? 's' : ''} for you`}
          </h1>

          {loadingProducts && <div className="py-24" />}

          {fetchError && !loadingProducts && (
            <div className="py-24">
              <p className="text-sm mb-4 text-gray-500">{fetchError}</p>
              <button onClick={resetQuiz} className="px-10 py-4 rounded-full font-black tracking-widest uppercase text-sm border-2 border-black">
                Retake Quiz
              </button>
            </div>
          )}

          {!loadingProducts && !fetchError && products.length === 0 && (
            <div className="py-24">
              <p className="text-sm mb-4 text-gray-500">No products match your exact preferences. Try a different combination!</p>
              <button onClick={resetQuiz} className="px-10 py-4 rounded-full font-black tracking-widest uppercase text-sm border-2 border-black">
                Retake Quiz
              </button>
            </div>
          )}

          {!loadingProducts && !fetchError && products.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 mb-14">
                {products.map((product) => (
                  <div key={product.product_id} className="group relative">
                    <Link href={`/products/${product.product_id}`} className="block">
                      <div className="aspect-square bg-[#f2f2f2] overflow-hidden relative mb-3">
                        <Image
                          src={product.images[0]?.image || '/images/placeholder.png'}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.old_price && (
                          <div className="absolute top-3 left-3 bg-black text-white text-[9px] uppercase tracking-widest px-2 py-1">
                            Sale
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist({
                            product_id: product.product_id,
                            name: product.name,
                            price: product.price,
                            old_price: product.old_price || undefined,
                            image: product.images[0]?.image || '/images/placeholder.png',
                            category_name: product.category_name,
                            in_stock: product.in_stock !== false,
                          });
                        }}
                        className="p-2 rounded-full bg-white shadow-sm hover:scale-105 transition-all text-neutral-900"
                      >
                        <Heart
                          size={20}
                          className={`${isInWishlist(product.product_id) ? 'fill-[#c9a46b] text-[#c9a46b]' : 'text-neutral-900'} hover:text-[#c9a46b]`}
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (product.in_stock === false) return;
                          addItem({
                            product_id: product.product_id,
                            name: product.name,
                            price: product.price,
                            size: 'Standard',
                            quantity: 1,
                            image: product.images[0]?.image || '/images/placeholder.png',
                          });
                        }}
                        disabled={product.in_stock === false}
                        aria-disabled={product.in_stock === false}
                        aria-label={product.in_stock === false ? 'Out of stock' : 'Add to cart'}
                        title={product.in_stock === false ? 'Out of stock' : 'Add to cart'}
                        className={`p-2 rounded-full bg-white shadow-sm transition-all text-neutral-900 ${product.in_stock === false ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:scale-105'}`}
                      >
                        <ShoppingBag size={20} className={`${product.in_stock === false ? 'text-neutral-400' : 'text-neutral-900 hover:text-[#c9a46b]'} transition-colors`} />
                      </button>
                    </div>

                    <Link href={`/products/${product.product_id}`} className="block">
                      <p className="text-[12px] md:text-lg text-gray-700 leading-snug mb-1.5 font-light line-clamp-2 group-hover:text-black group-hover:font-medium transition-colors">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] md:text-lg font-medium text-gray-800">
                          Rs.&nbsp;{product.price.toLocaleString()}
                        </span>
                        {product.old_price && (
                          <span className="text-[12px] text-[#ec7cfd] md:text-md font-medium line-through">
                            Rs.&nbsp;{product.old_price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={resultsUrl}
                  className="px-10 py-4 rounded-full font-black tracking-widest uppercase text-sm text-white transition-opacity hover:opacity-80"
                  style={{ background: '#000' }}
                >
                  View All Results
                </Link>
                <button
                  onClick={resetQuiz}
                  className="px-10 py-4 rounded-full font-black tracking-widest uppercase text-sm border-2 border-black transition-colors"
                >
                  Retake Quiz
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    );
  }

  // ── Quiz screen ────────────────────────────────────────────────────────────
  if (!q) return null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden" style={{ background: '#fff8e7' }}>
      {/* Progress bar */}
      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-black tracking-[0.22em] uppercase" style={{ color: SAGE_MID }}>
            Skin Quiz
          </span>
          <span className="text-[11px] font-bold tracking-wider" style={{ color: SAGE_MID }}>
            {current + 1} / {total}
          </span>
        </div>
        <div className="w-full h-[3px] rounded-full overflow-hidden" style={{ background: '#c9bfb7' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: SAGE_MID }} />
        </div>
      </div>

      {/* Card stack */}
      <div className="w-full max-w-4xl relative" style={{ minHeight: 580 }}>
        <div
          className="absolute inset-0 rounded-3xl border-2"
          style={{
            background: CARD_BG3,
            borderColor: SAGE_MID,
            transform: 'rotate(-3.5deg) translateY(20px) translateX(8px)',
            zIndex: 0,
            boxShadow: `4px 4px 0 ${SAGE_MID}`,
          }}
        />
        <div
          className="absolute inset-0 rounded-3xl border-2"
          style={{
            background: CARD_BG2,
            borderColor: SAGE_MID,
            transform: 'rotate(-1.8deg) translateY(10px) translateX(4px)',
            zIndex: 1,
            boxShadow: `4px 4px 0 ${SAGE_MID}`,
          }}
        />

        <div
          className="relative rounded-3xl px-10 py-14 sm:px-16 sm:py-18"
          style={{
            zIndex: 2,
            background: CARD_BG,
            border: `2px solid ${SAGE_MID}`,
            boxShadow: `6px 6px 0 ${SAGE_MID}`,
            transition: sliding
              ? 'transform 0.38s cubic-bezier(0.55,0,0.8,0.45), opacity 0.3s ease'
              : 'none',
            transform: sliding ? 'translateX(-115%) rotate(-6deg)' : 'translateX(0) rotate(0)',
            opacity: sliding ? 0 : 1,
            willChange: 'transform, opacity',
          }}
        >
          {/* Back button */}
          <div className="flex items-center justify-between mb-10">
            <button
              onClick={handleBack}
              disabled={current === 0 || sliding}
              className="flex items-center gap-1.5 text-xs font-bold tracking-[0.15em] uppercase transition-opacity"
              style={{
                color: current === 0 ? '#b0a89e' : '#000',
                cursor: current === 0 ? 'not-allowed' : 'pointer',
                opacity: current === 0 ? 0.4 : 1,
              }}
            >
              <ChevronLeft size={16} />
              Back
            </button>
            <span className="text-[11px] font-black tracking-[0.22em] uppercase" style={{ color: SAGE_MID }}>
              {current + 1} / {total}
            </span>
          </div>

          {/* Question */}
          <h2
            className="text-2xl sm:text-3xl md:text-[2.25rem] font-black uppercase tracking-tight text-center leading-tight mb-12"
            style={{ color: SAGE_DARK, fontFamily: 'Georgia, serif' }}
          >
            {q.question}
          </h2>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {q.options.map((opt, idx) => {
              const active = selected?.id === opt.id;
              const label = LABELS[idx] || String(idx + 1);
              return (
                <button
                  key={`${shown}-${idx}`}
                  onClick={() => !sliding && setSelected(opt)}
                  className="flex items-center gap-4 px-6 py-5 rounded-2xl font-semibold text-sm sm:text-base text-left transition-all duration-200 border-2"
                  style={{
                    background: active ? '#c8f535' : '#fff',
                    borderColor: active ? SAGE_DARK : '#c9bfb7',
                    color: SAGE_DARK,
                    transform: active ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: active ? `3px 3px 0 #000` : `1px 1px 0 #c9bfb7`,
                  }}
                >
                  <span
                    className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2"
                    style={{
                      background: active ? SAGE_DARK : 'transparent',
                      borderColor: SAGE_DARK,
                      color: active ? '#c8f535' : SAGE_DARK,
                    }}
                  >
                    {label}
                  </span>
                  <span className="leading-snug flex-1">{opt.name}</span>
                  {active && <span className="text-base">✓</span>}
                </button>
              );
            })}
          </div>

          {/* Next / Finish */}
          <div className="flex justify-center">
            <button
              onClick={handleNext}
              disabled={selected === null || sliding}
              className="px-16 py-4 rounded-full border-2 font-black uppercase tracking-[0.18em] text-sm transition-all duration-200"
              style={{
                background: selected !== null ? SAGE_DARK : 'transparent',
                color: selected !== null ? '#c8f535' : '#000000',
                borderColor: selected !== null ? SAGE_DARK : '#000000',
                cursor: selected !== null ? 'pointer' : 'not-allowed',
                boxShadow: selected !== null ? `3px 3px 0 #000` : 'none',
              }}
            >
              {current + 1 === total ? 'See My Results' : 'Next'}
            </button>
          </div>
        </div>
      </div>

      <p className="mt-12 text-[11px] tracking-[0.2em] uppercase" style={{ color: SAGE_MID }}>
        Korean beauty · personalised for you
      </p>
    </main>
  );
}

// ─── Build questions from fetched options ──────────────────────────────────────
function buildQuestions(opts: {
  skinTypes: Option[];
  concerns: Option[];
  categories: Option[];
  brands: Option[];
  useCases: Option[];
  combos: Option[];
}): QuizQuestion[] {
  return [
    {
      id: 1,
      question: "What's your skin type?",
      filterKey: 'skin_type',
      options: opts.skinTypes,
    },
    {
      id: 2,
      question: "What's your main concern?",
      filterKey: 'concern',
      options: opts.concerns,
    },
    {
      id: 3,
      question: 'What product are you looking for?',
      filterKey: 'category',
      options: opts.categories,
    },
    {
      id: 4,
      question: 'Any preferred brand?',
      filterKey: 'brand',
      options: [{ id: 0, name: 'No preference' }, ...opts.brands],
      allowSkip: true,
    },
    {
      id: 5,
      question: 'Any specific use case?',
      filterKey: 'usecase',
      options: [{ id: 0, name: 'No preference' }, ...opts.useCases],
      allowSkip: true,
    },
    {
      id: 6,
      question: 'Interested in combo deals?',
      filterKey: 'combo',
      options: [{ id: 0, name: 'No preference' }, ...opts.combos],
      allowSkip: true,
    },
  ];
}
