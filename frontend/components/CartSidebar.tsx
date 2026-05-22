'use client';

import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

const DEMO_PRODUCT = {
  product_id: 'demo-1',
  name: 'DROP 6 THE ARGYLE KNIT SET',
  price: 1000.00,
  size: 'M',
  quantity: 2,
  image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
};

export function CartSidebar() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotalPrice, isOpen, closeCart } = useCart();

  // Use demo product if cart is empty, as requested
  const displayItems = items.length > 0 ? items : [DEMO_PRODUCT];
  const displayTotal = items.length > 0 ? getTotalPrice() : (DEMO_PRODUCT.price * DEMO_PRODUCT.quantity);

  return (
    <>
      <button
        onClick={() => closeCart()}
        className="hidden"
      />

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={closeCart}
          ></div>

          <div className="fixed right-0 top-0 h-full w-full max-w-[500px] bg-[#f7f7f7] shadow-2xl z-50 flex flex-col font-mono">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6">
              <h2 className="text-[1.35rem] font-normal tracking-wide text-gray-900 font-sans">
                Shopping Cart
              </h2>
              <button
                onClick={closeCart}
                className="text-gray-900 hover:text-gray-600 transition-colors"
                aria-label="Close cart"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-8 space-y-8 mt-2">
              {displayItems.map((item) => (
                <div
                  key={`${item.product_id}-${item.size}`}
                  className="flex gap-6 relative"
                >
                  <div className="w-32 h-40 bg-gray-200 flex-shrink-0 relative">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-lg leading-relaxed font-medium uppercase tracking-widest text-gray-900 pr-4">
                        {item.name}
                      </h3>
                      <button
                        onClick={() =>
                          items.length > 0 && removeItem(item.product_id, item.size)
                        }
                        className="text-gray-900 hover:text-gray-500 absolute right-0 top-0"
                        aria-label="Remove item"
                      >
                        <X size={16} strokeWidth={1.5} />
                      </button>
                    </div>

                    <div className="flex justify-between items-end">
                      <p className="text-md font-medium text-gray-900 font-sans">
                        ${item.price.toFixed(2)}
                      </p>

                      <div className="flex flex-col items-center">
                        <span className="text-md mb-2 font-mono">Quantity</span>
                        <div className="flex items-center border border-gray-900">
                          <button
                            onClick={() =>
                              items.length > 0 && updateQuantity(
                                item.product_id,
                                item.size,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="px-2 py-1.5 hover:bg-gray-100 transition-colors flex items-center justify-center border-r border-gray-900"
                          >
                            <Minus size={12} strokeWidth={1.5} />
                          </button>
                          <span className="w-8 text-center text-sm font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              items.length > 0 && updateQuantity(
                                item.product_id,
                                item.size,
                                item.quantity + 1
                              )
                            }
                            className="px-2 py-1.5 hover:bg-gray-100 transition-colors flex items-center justify-center border-l border-gray-900"
                          >
                            <Plus size={12} strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer / Summary */}
            <div className="bg-white px-8 py-8 mt-auto border-t border-gray-200">
              <div className="space-y-4">
                <h3 className="text-lg font-mono tracking-wide text-gray-900">
                  Order Summary
                </h3>
                <div className="border-b border-gray-900 w-full" />
                <div className="flex justify-between items-center py-2 font-mono">
                  <span className="text-lg text-gray-900">Total</span>
                  <span className="text-xl font-medium text-gray-900">
                    ${displayTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 font-mono">
                  <button
                    onClick={() => {
                      router.push('/checkout');
                      closeCart();
                    }}
                    className="w-full bg-[#1a1a1a] text-white py-3.5 text-xs tracking-widest hover:bg-black transition-colors"
                  >
                    Checkout
                  </button>
                  <button
                    onClick={() => {
                      router.push('/cart');
                      closeCart();
                    }}
                    className="w-full border border-gray-900 bg-white text-gray-900 py-3.5 text-xs tracking-widest hover:bg-gray-50 transition-colors"
                  >
                    View cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <button
        onClick={() => { }}
        className="hidden"
      />
    </>
  );
}
