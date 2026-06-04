'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  user: any | null;
  token: string | null;
  login: (token: string, user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'amakonana_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
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
        const { token, user } = JSON.parse(savedAuth);
        const cleanedToken = cleanToken(token);
        setToken(cleanedToken);
        setUser(user);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Failed to load auth from localStorage:', error);
      }
    }
    setIsHydrated(true);
  }, []);

  const login = (newToken: any, newUser: any) => {
    const cleanedToken = cleanToken(newToken);
    setToken(cleanedToken);
    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token: cleanedToken, user: newUser }));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, login, logout }}>
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
