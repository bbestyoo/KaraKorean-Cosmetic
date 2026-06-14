'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  user: any | null;
  token: string | null;
  refreshToken: string | null;
  login: (token: string, user: any, refreshToken?: string) => void;
  logout: () => void;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'amakonana_auth';

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/shop\/?$/, '');

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const cleanToken = (tokenVal: any): string | null => {
    if (!tokenVal) return null;
    if (typeof tokenVal === 'object') {
      return tokenVal.access || tokenVal.token || tokenVal.auth_token || null;
    }
    return tokenVal;
  };

  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedAuth) {
      try {
        const { token, user, refreshToken } = JSON.parse(savedAuth);
        const cleanedToken = cleanToken(token);
        setToken(cleanedToken);
        setRefreshToken(refreshToken || null);
        setUser(user);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Failed to load auth from localStorage:', error);
      }
    }
    setIsHydrated(true);
  }, []);

  const persistAuth = (tok: string | null, refresh: string | null, usr: any) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token: tok, refreshToken: refresh, user: usr }));
  };

  const login = (newToken: any, newUser: any, newRefreshToken?: string) => {
    const cleanedToken = cleanToken(newToken);
    const refresh = newRefreshToken || null;
    setToken(cleanedToken);
    setRefreshToken(refresh);
    setUser(newUser);
    setIsLoggedIn(true);
    persistAuth(cleanedToken, refresh, newUser);
  };

  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const authHeader = (tok: string | null) => {
      if (!tok || typeof tok !== 'string') return null;
      return tok.includes('.') ? `Bearer ${tok}` : `Token ${tok}`;
    };

    const makeRequest = (tok: string | null): Promise<Response> => {
      const h = authHeader(tok);
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          ...(h ? { Authorization: h } : {}),
        },
      });
    };

    let res = await makeRequest(token);

    if (res.status === 401 && refreshToken) {
      try {
        const refreshRes = await fetch(`${API_ORIGIN}/userauth/api/refresh-token/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (refreshRes.ok) {
          const { access } = await refreshRes.json();
          setToken(access);
          persistAuth(access, refreshToken, user);
          res = await makeRequest(access);
        } else {
          logout();
        }
      } catch {
        logout();
      }
    }

    return res;
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, refreshToken, login, logout, fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
