'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');
}

const API_ORIGIN = API_BASE_URL.replace(/\/shop\/?$/, '');

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_ORIGIN}/userauth/api/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data?.errors?.non_field_errors?.[0] || data?.message || data?.msg || 'Invalid credentials';
        setError(msg);
        return;
      }
      const token = data.auth_token || data.token || data.token?.access;
      const user = data.user || null;
      login(token, user);
      router.push('/');
    } catch (err) {
      console.error(err);
      setError('Failed to connect to authentication service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ── Left panel ── */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          {/* Logo */}
          <Link href="/" className="auth-logo">
            <span className="auth-logo-dot" />
            <span className="auth-logo-text">Kara Korean</span>
          </Link>

          <div className="auth-heading-group">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Please enter your details to sign in.</p>
          </div>

          {/* Google Sign-In */}
          <a
            id="login-google"
            href={`${API_ORIGIN}/userauth/api/auth/google/`}
            className="auth-btn-google"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            <span>Continue with Google</span>
          </a>

          <div className="auth-divider"><span>or continue with email</span></div>

          {error && (
            <div className="auth-alert auth-alert-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="auth-form" noValidate>
            <div className="auth-field">
              <label htmlFor="login-email" className="auth-label">Email address</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="auth-input"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="login-password" className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="auth-input"
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="auth-row">
              <label className="auth-remember">
                <input
                  id="login-remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="auth-checkbox"
                />
                <span>Remember for 30 days</span>
              </label>
              <Link href="/forgot-password" className="auth-link-accent">Forgot password?</Link>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="auth-btn-primary"
            >
              {loading ? (
                <span className="auth-spinner" />
              ) : 'Sign in'}
            </button>
          </form>

          <p className="auth-footer-text">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="auth-link-accent auth-link-bold">Sign up</Link>
          </p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="auth-image-panel">
        <Image
          src="/korean-auth-hero.png"
          alt="Korean beauty model with cherry blossoms"
          fill
          className="auth-hero-img"
          priority
          sizes="50vw"
        />
        {/* Gradient overlay */}
        <div className="auth-img-overlay" />
        {/* Caption at bottom */}
        <div className="auth-img-caption">
          <h2 className="auth-img-headline">Reveal your natural radiance.</h2>
          <p className="auth-img-desc">
            K-beauty secrets crafted from nature — yours to discover every day.
          </p>
          <div className="auth-img-dots">
            <span className="auth-img-dot active" />
            <span className="auth-img-dot" />
            <span className="auth-img-dot" />
          </div>
        </div>
        {/* Floating badge */}
        <div className="auth-img-badge">
          <span className="auth-img-badge-icon">✦</span>
          <span>100% Natural Ingredients</span>
        </div>
      </div>

      <style>{`
        /* ── Auth Layout ── */
        .auth-page {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
          background: #fff;
          font-family: var(--font-geist-sans), system-ui, sans-serif;
        }

        /* ── Form Panel ── */
        .auth-form-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          background: #fff;
          position: relative;
          overflow: hidden;
        }

        .auth-form-panel::before {
          content: '';
          position: absolute;
          top: -120px;
          left: -120px;
          width: 380px;
          height: 380px;
          background: radial-gradient(circle, hsl(150 35% 55% / 0.08), transparent 70%);
          pointer-events: none;
        }

        .auth-form-inner {
          width: 100%;
          max-width: 420px;
          position: relative;
          z-index: 1;
          animation: authFadeUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        @keyframes authFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Logo ── */
        .auth-logo {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          margin-bottom: 2.5rem;
        }

        .auth-logo-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(201 164 107), hsl(150 35% 55%));
          box-shadow: 0 0 0 5px hsl(150 35% 55% / 0.18);
          flex-shrink: 0;
        }

        .auth-logo-text {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: 0.3px;
        }

        /* ── Heading ── */
        .auth-heading-group {
          margin-bottom: 1.75rem;
        }

        .auth-title {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: clamp(1.75rem, 3vw, 2.25rem);
          font-weight: 700;
          color: #111;
          line-height: 1.15;
          margin: 0 0 0.35rem;
        }

        .auth-subtitle {
          font-size: 0.9rem;
          color: #6b7280;
          margin: 0;
        }

        /* ── Alert ── */
        .auth-alert {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          font-size: 0.85rem;
          margin-bottom: 1.25rem;
          animation: authFadeUp 0.3s ease both;
        }

        .auth-alert-error {
          background: #fff1f2;
          border: 1px solid #fecdd3;
          color: #be123c;
        }

        .auth-alert-success {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #15803d;
        }

        /* ── Form ── */
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }

        .auth-field {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .auth-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: #374151;
          letter-spacing: 0.2px;
        }

        .auth-input-wrap {
          position: relative;
        }

        .auth-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 0.92rem;
          color: #111;
          background: #fafafa;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
          box-sizing: border-box;
          font-family: inherit;
        }

        .auth-input-wrap .auth-input {
          padding-right: 2.8rem;
        }

        .auth-input::placeholder {
          color: #9ca3af;
        }

        .auth-input:focus {
          border-color: hsl(150 35% 55%);
          background: #fff;
          box-shadow: 0 0 0 3px hsl(150 35% 55% / 0.15);
        }

        .auth-eye-btn {
          position: absolute;
          right: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          display: flex;
          align-items: center;
          transition: color 0.2s;
          padding: 0;
        }

        .auth-eye-btn:hover { color: #374151; }

        /* ── Remember row ── */
        .auth-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .auth-remember {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.82rem;
          color: #374151;
          cursor: pointer;
          user-select: none;
        }

        .auth-checkbox {
          width: 15px;
          height: 15px;
          accent-color: hsl(150 35% 45%);
          cursor: pointer;
        }

        .auth-link-accent {
          font-size: 0.82rem;
          color: hsl(150 35% 40%);
          text-decoration: none;
          transition: color 0.2s;
        }

        .auth-link-accent:hover {
          color: rgb(201 164 107);
        }

        .auth-link-bold {
          font-weight: 700;
          font-size: 0.9rem;
        }

        /* ── Google Button ── */
        .auth-btn-google {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          width: 100%;
          padding: 0.8rem 1rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          background: #fff;
          color: #374151;
          font-size: 0.92rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s, transform 0.2s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.07);
          letter-spacing: 0.1px;
          font-family: inherit;
          min-height: 48px;
          box-sizing: border-box;
          margin-bottom: 0.1rem;
        }

        .auth-btn-google:hover {
          border-color: #d1d5db;
          background: #fafafa;
          box-shadow: 0 3px 10px rgba(0,0,0,0.1);
          transform: translateY(-1px);
        }

        .auth-btn-google:active {
          transform: translateY(0);
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }

        /* ── Primary Button ── */
        .auth-btn-primary {
          width: 100%;
          padding: 0.85rem 1rem;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          color: #fff;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.3px;
          transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
          box-shadow: 0 4px 14px -4px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          margin-top: 0.25rem;
          font-family: inherit;
        }

        .auth-btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px -4px rgba(0,0,0,0.4);
          background: linear-gradient(135deg, #111 0%, #222 100%);
        }

        .auth-btn-primary:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 8px -2px rgba(0,0,0,0.3);
        }

        .auth-btn-primary:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* ── Secondary Button ── */
        .auth-btn-secondary {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          background: #fff;
          color: #374151;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          font-family: inherit;
        }

        .auth-btn-secondary:hover:not(:disabled) {
          border-color: hsl(150 35% 55%);
          background: hsl(150 35% 55% / 0.04);
        }

        .auth-btn-secondary:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* ── Spinner ── */
        .auth-spinner {
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: authSpin 0.7s linear infinite;
          display: inline-block;
        }

        .auth-spinner-dark {
          border-color: rgba(30,30,30,0.2);
          border-top-color: #1a1a1a;
        }

        @keyframes authSpin {
          to { transform: rotate(360deg); }
        }

        /* ── Divider ── */
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }

        /* ── Footer ── */
        .auth-footer-text {
          text-align: center;
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 1.5rem;
        }

        /* ── Step indicator ── */
        .auth-steps {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.75rem;
        }

        .auth-step {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          color: #9ca3af;
          font-weight: 500;
        }

        .auth-step.active {
          color: hsl(150 35% 40%);
        }

        .auth-step-circle {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          flex-shrink: 0;
          background: #fff;
          transition: all 0.3s;
        }

        .auth-step.active .auth-step-circle {
          background: hsl(150 35% 45%);
          border-color: hsl(150 35% 45%);
          color: #fff;
        }

        .auth-step.done .auth-step-circle {
          background: hsl(150 35% 45%);
          border-color: hsl(150 35% 45%);
          color: #fff;
        }

        .auth-step-line {
          flex: 1;
          height: 2px;
          background: #e5e7eb;
          border-radius: 2px;
          transition: background 0.3s;
        }

        .auth-step-line.active {
          background: hsl(150 35% 55%);
        }

        /* ── Image Panel ── */
        .auth-image-panel {
          position: relative;
          overflow: hidden;
          display: flex;
        }

        .auth-hero-img {
          object-fit: cover;
          object-position: center top;
        }

        .auth-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 30%,
            rgba(10, 10, 10, 0.35) 65%,
            rgba(5, 5, 5, 0.82) 100%
          );
          z-index: 1;
        }

        .auth-img-caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 2rem 2.5rem 2.5rem;
          z-index: 2;
          color: #fff;
        }

        .auth-img-headline {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: clamp(1.5rem, 2.8vw, 2.1rem);
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 0.5rem;
          letter-spacing: -0.01em;
        }

        .auth-img-desc {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.75);
          margin: 0 0 1.25rem;
          line-height: 1.55;
          max-width: 340px;
        }

        .auth-img-dots {
          display: flex;
          gap: 0.45rem;
        }

        .auth-img-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255,255,255,0.35);
          transition: all 0.3s;
        }

        .auth-img-dot.active {
          background: #fff;
          width: 22px;
          border-radius: 4px;
        }

        /* ── Floating badge ── */
        .auth-img-badge {
          position: absolute;
          top: 1.75rem;
          right: 1.75rem;
          z-index: 2;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(12px) saturate(160%);
          -webkit-backdrop-filter: blur(12px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 100px;
          padding: 0.5rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #fff;
          letter-spacing: 0.3px;
        }

        .auth-img-badge-icon {
          color: rgb(201 164 107);
          font-size: 0.85rem;
        }

        /* ── OTP Inputs ── */
        .auth-otp-group {
          display: flex;
          gap: 0.6rem;
        }

        .auth-otp-input {
          flex: 1;
          text-align: center;
          padding: 0.85rem 0.5rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: 700;
          color: #111;
          background: #fafafa;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s;
          font-family: var(--font-geist-mono), monospace;
        }

        .auth-otp-input:focus {
          border-color: hsl(150 35% 55%);
          box-shadow: 0 0 0 3px hsl(150 35% 55% / 0.15);
          background: #fff;
        }

        /* ── Responsive ── */
        @media (max-width: 820px) {
          .auth-page {
            grid-template-columns: 1fr;
          }
          .auth-image-panel {
            display: none;
          }
          .auth-form-panel {
            padding: 2rem 1.25rem;
          }
          .auth-form-inner {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
