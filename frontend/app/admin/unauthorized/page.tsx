'use client';

import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertCircle size={32} className="text-red-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-6">
            You do not have permission to access the admin panel. Only staff members and administrators can access this area.
          </p>

          <button
            onClick={() => {
              localStorage.removeItem('auth_token');
              router.push('/admin/login');
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors mb-4"
          >
            <ArrowLeft size={18} />
            Back to Login
          </button>

          <button
            onClick={() => router.push('/')}
            className="w-full px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
