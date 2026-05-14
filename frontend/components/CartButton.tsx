'use client';

import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export function CartButton() {
  const { items, openCart } = useCart();

  return (
    <button
      onClick={openCart}
      className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      aria-label="Shopping cart"
    >
      <ShoppingBag size={24} className="text-gray-900" />
      {items.length > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
          {items.length}
        </span>
      )}
    </button>
  );
}
