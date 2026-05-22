'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

// ─── Quiz Data ────────────────────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  { id: 1, question: 'What is your main skin type?', options: ['Oily', 'Dry', 'Combination', 'Normal / Balanced'] },
  { id: 2, question: 'How does your skin feel by midday?', options: ['Shiny & greasy', 'Tight & flaky', 'Oily T-zone only', 'Comfortable'] },
  { id: 3, question: 'What is your #1 skin concern?', options: ['Acne & breakouts', 'Dullness & uneven tone', 'Fine lines & aging', 'Dryness & sensitivity'] },
  { id: 4, question: 'How sensitive is your skin?', options: ['Very sensitive — reacts easily', 'Somewhat sensitive', 'Rarely reacts', 'Not sensitive at all'] },
  { id: 5, question: 'How many steps is your current routine?', options: ['1–2 steps', '3–4 steps', '5–7 steps', '8+ steps (full K-beauty!)'] },
  { id: 6, question: 'Which texture do you prefer for moisturisers?', options: ['Lightweight gel', 'Rich cream', 'Water-based lotion', 'Oil-based balm'] },
  { id: 7, question: 'How often do you apply SPF?', options: ['Every single day', 'Only on sunny days', 'Rarely', 'Never — oops!'] },
  { id: 8, question: 'Which ingredient excites you most?', options: ['Snail mucin', 'Centella asiatica', 'Niacinamide', 'Hyaluronic acid'] },
  { id: 9, question: 'How much time do you spend on skincare each morning?', options: ['Under 5 minutes', '5–10 minutes', '10–20 minutes', '20+ minutes'] },
  { id: 10, question: 'What best describes your glow goal?', options: ['Glass skin — dewy & luminous', 'Matte & pore-minimised', 'Healthy & natural', 'Radiant & even-toned'] },
  { id: 11, question: 'How would you rate your current skin happiness?', options: ['Love it — minor tweaks', 'Pretty good overall', 'Needs some work', 'Starting from scratch'] },
];

const RESULTS = [
  { type: 'The Hydration Seeker', description: 'Your skin craves deep moisture and barrier support. We recommend ceramide-rich creams, hyaluronic acid serums, and gentle hydrating toners to restore your glow.', products: ['Hydrating Toner', 'Ceramide Cream', 'HA Serum'], accent: '#0891b2', bg: '#d4f1f4' },
  { type: 'The Glow Chaser', description: "You're all about luminosity! Brightening essences, Vitamin C serums, and light-reflecting SPFs will be your best friends on your glass-skin journey.", products: ['Brightening Essence', 'Vitamin C Serum', 'Glow SPF 50+'], accent: '#b45309', bg: '#fef3c7' },
  { type: 'The Calm Seeker', description: 'Sensitive and reactive skin needs soothing heroes — centella, green tea, and minimal-ingredient formulas to calm, protect, and rebuild your barrier.', products: ['Centella Ampoule', 'Green Tea Toner', 'Barrier Cream'], accent: '#16a34a', bg: '#dcfce7' },
  { type: 'The Pore Perfecter', description: "Oily skin and visible pores are no match for the right BHA exfoliant, niacinamide serum, and oil-control moisturiser. Let's refine that texture!", products: ['BHA Exfoliant', 'Niacinamide 10%', 'Oil-Control Gel'], accent: '#9d174d', bg: '#fce7f3' },
];

const LABELS = ['A', 'B', 'C', 'D'];

// Site palette
const SAGE = '#4a5a56';
const SAGE_DARK = '#3d4e4a';
const SAGE_MID = '#5c6e69';
const CARD_BG = '#f2ebe4';        // warm beige-rose card
const PAGE_BG = '#e8e1d8';        // warm beige page bg
const CARD_BG2 = '#ead9d0';       // slightly darker for stacked cards
const CARD_BG3 = '#e0cdc3';       // deepest stacked card

function getResult(answers: (number | null)[]) {
  const tally = [0, 0, 0, 0];
  answers.forEach((a) => { if (a !== null) tally[a]++; });
  return RESULTS[tally.indexOf(Math.max(...tally)) % RESULTS.length];
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function QuizPage() {
  const total = QUIZ_QUESTIONS.length;

  const [current, setCurrent] = useState(0);
  // "shown" tracks what question is rendered on the card — updated slightly before animation ends
  const [shown, setShown] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(total).fill(null));
  const [selected, setSelected] = useState<number | null>(null);
  const [sliding, setSliding] = useState(false);
  const [done, setDone] = useState(false);
  const lockRef = useRef(false);

  const q = QUIZ_QUESTIONS[shown];

  // ── Navigate Next ──────────────────────────────────────────────────────────
  const handleNext = () => {
    if (selected === null || lockRef.current) return;
    lockRef.current = true;

    const newAnswers = [...answers];
    newAnswers[current] = selected;
    setAnswers(newAnswers);

    const next = current + 1;

    // Start slide-out
    setSliding(true);

    // Update content mid-animation (card is still off-screen at this point)
    // so when transform resets at 380ms the content is already populated
    setTimeout(() => {
      if (next >= total) {
        setDone(true);
        lockRef.current = false;
        return;
      }
      setCurrent(next);
      setShown(next);
      setSelected(answers[next] ?? null); // restore previous answer if going back
    }, 200); // content updates at 200ms — card is still sliding at this point

    // Reset transform so card snaps back in-place with new content already there
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

    // Slide card out to the right
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

  const result = getResult(answers);
  const progress = ((current + 1) / total) * 100;

  // ── Result screen ──────────────────────────────────────────────────────────
  if (done) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-24" style={{ background: result.bg }}>
        <div className="w-full max-w-2xl text-center">
          <p className="text-[11px] font-black tracking-[0.25em] uppercase mb-4" style={{ color: result.accent }}>
            Your skin profile
          </p>
          <h1 className="text-5xl sm:text-6xl font-black uppercase tracking-tight mb-6 leading-tight" style={{ color: SAGE_DARK, fontFamily: 'Georgia, serif' }}>
            {result.type}
          </h1>
          <p className="text-base sm:text-lg leading-relaxed mb-12 max-w-lg mx-auto" style={{ color: SAGE }}>
            {result.description}
          </p>
          <div className="grid grid-cols-3 gap-4 mb-14">
            {result.products.map((p) => (
              <div key={p} className="py-5 px-3 rounded-2xl text-sm font-bold text-center border-2" style={{ background: '#fff', color: result.accent, borderColor: result.accent }}>
                {p}
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products" className="px-10 py-4 rounded-full font-black tracking-widest uppercase text-sm text-white transition-opacity hover:opacity-80" style={{ background: result.accent }}>
              Shop My Products
            </Link>
            <button
              onClick={() => { setCurrent(0); setShown(0); setAnswers(new Array(total).fill(null)); setSelected(null); setDone(false); }}
              className="px-10 py-4 rounded-full font-black tracking-widest uppercase text-sm border-2 transition-colors"
              style={{ borderColor: SAGE_DARK, color: SAGE_DARK }}
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── Quiz screen ────────────────────────────────────────────────────────────
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden"
      style={{ background: PAGE_BG }}
    >
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
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: SAGE_MID }}
          />
        </div>
      </div>

      {/* Card stack */}
      <div className="w-full max-w-4xl relative" style={{ minHeight: 580 }}>

        {/* 3rd stacked card (bottom) */}
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
        {/* 2nd stacked card */}
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

        {/* Main card */}
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
                color: current === 0 ? '#b0a89e' : SAGE,
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
              const active = selected === idx;
              return (
                <button
                  key={`${shown}-${idx}`}
                  onClick={() => !sliding && setSelected(idx)}
                  className="flex items-center gap-4 px-6 py-5 rounded-2xl font-semibold text-sm sm:text-base text-left transition-all duration-200 border-2"
                  style={{
                    background: active ? '#c8f535' : '#fff',
                    borderColor: active ? SAGE_DARK : '#c9bfb7',
                    color: SAGE_DARK,
                    transform: active ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: active ? `3px 3px 0 ${SAGE}` : `1px 1px 0 #c9bfb7`,
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
                    {LABELS[idx]}
                  </span>
                  <span className="leading-snug flex-1">{opt}</span>
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
                color: selected !== null ? '#c8f535' : '#b0a89e',
                borderColor: selected !== null ? SAGE_DARK : '#c9bfb7',
                cursor: selected !== null ? 'pointer' : 'not-allowed',
                boxShadow: selected !== null ? `3px 3px 0 ${SAGE}` : 'none',
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
