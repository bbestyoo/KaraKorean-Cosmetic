'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/userauth/api/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        setError(data.message || 'Invalid credentials');
        return;
      }

      // Save token
      localStorage.setItem('auth_token', data.auth_token);

      // Check if user is staff/superuser from login response
      console.log('User data:', data.user);
      console.log('Is staff:', data.user?.is_staff);
      console.log('Is superuser:', data.user?.is_superuser);
      
      if (!data.user?.is_staff && !data.user?.is_superuser) {
        setError('Only staff members can access the admin panel');
        localStorage.removeItem('auth_token');
        return;
      }

      // Redirect to admin
      router.push('/admin');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
          {/* Header */}
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              <LogIn size={28} className="text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-center text-black text-sm mb-8">Sign in to your admin account</p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                required
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
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-2 px-4 bg-black hover:scale-105 disabled:bg-gray-400 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-600 text-xs mt-6">
            Staff and superuser accounts only
          </p>
        </div>
      </div>
    </div>
  );
}
