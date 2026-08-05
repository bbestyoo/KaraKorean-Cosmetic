'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface WishlistItem {
  product_id: string;
  name: string;
  price: number;
  old_price?: number;
  image: string;
  category_name?: string;
  in_stock?: boolean;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (item: WishlistItem) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = 'amakonana_wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem(STORAGE_KEY);
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Failed to load wishlist from localStorage:', error);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save wishlist to localStorage when it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist, isHydrated]);

  const addToWishlist = (item: WishlistItem) => {
    setWishlist((prev) => {
      if (prev.some((i) => i.product_id === item.product_id)) {
        return prev; // Already exists
      }
      return [...prev, item];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.product_id === productId);
  };

  const toggleWishlist = (item: WishlistItem) => {
    setWishlist((prev) => {
      const exists = prev.some((i) => i.product_id === item.product_id);
      if (exists) {
        return prev.filter((i) => i.product_id !== item.product_id);
      }
      return [...prev, item];
    });
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
