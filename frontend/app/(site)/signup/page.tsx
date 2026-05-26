'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/shop';
const API_ORIGIN = API_BASE_URL.replace(/\/shop\/?$/, '');

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch(`${API_ORIGIN}/userauth/api/signup/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.msg || 'Failed to send OTP');
      } else {
        setMessage('OTP sent to ' + email);
        setStep(2);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_ORIGIN}/userauth/api/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password, password2, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        // try to surface meaningful errors
        const errMsg = data?.msg || data?.detail || JSON.stringify(data) || 'Registration failed';
        setError(errMsg);
        return;
      }

      // registration returns JWT token pair under `token`
      const access = data?.token?.access || data?.token;
      if (access) {
        // fetch user info using JWT access
        try {
          const meRes = await fetch(`${API_ORIGIN}/userauth/api/me/`, {
            headers: { Authorization: `Bearer ${access}` },
          });
          if (meRes.ok) {
            const me = await meRes.json();
            login(access, me);
            router.push('/');
            return;
          }
        } catch (err) {
          console.warn('Failed to fetch user after registration', err);
        }

        // fallback: store token and redirect
        login(access, { email });
        router.push('/');
        return;
      }

      setMessage('Registration successful. Please sign in.');
      router.push('/login');
    } catch (err) {
      console.error(err);
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Create Account</h1>
          <p className="text-center text-black text-sm mb-6">Register a new account</p>

          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-green-700 text-sm">{message}</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={sendOtp} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none"
                />
              </div>

              <button type="submit" disabled={loading} className="w-full mt-4 py-2 px-4 bg-black text-white rounded-lg">
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  required
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="password2" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  id="password2"
                  type="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  placeholder="Confirm password"
                  required
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none"
                />
              </div>

              <button type="submit" disabled={loading} className="w-full mt-4 py-2 px-4 bg-black text-white rounded-lg">
                {loading ? 'Registering...' : 'Create Account'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-black font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
