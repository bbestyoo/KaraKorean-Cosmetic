'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AdminProtectedProps {
  children: ReactNode;
}

const API_BASE_URL = 'http://localhost:8000';

interface User {
  id: number;
  is_staff: boolean;
  is_superuser: boolean;
  email: string;
  name: string;
}

export function AdminProtected({ children }: AdminProtectedProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/userauth/api/me/`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) {
        router.push('/admin/login');
        return;
      }

      const userData: User = await response.json();

      if (!userData.is_staff && !userData.is_superuser) {
        router.push('/admin/unauthorized');
        return;
      }

      setAuthorized(true);
      setLoading(false);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/admin/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return children;
}
