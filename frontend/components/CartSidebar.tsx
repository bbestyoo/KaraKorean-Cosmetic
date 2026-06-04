'use client';

import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export function CartSidebar() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotalPrice, isOpen, closeCart } = useCart();

  const displayItems = items;
  const displayTotal = getTotalPrice();

  return (
    <>
      <button
        onClick={() => closeCart()}
        className="hidden"
      />

      {/* Backdrop overlay with smooth transition */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={closeCart}
      />

      {/* Sidebar Panel with smooth slide-in/out transition */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-[500px] bg-[#f7f7f7] shadow-2xl z-50 flex flex-col font-mono transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6">
          <h2 className="text-[1.35rem] font-normal tracking-wide text-gray-900 font-sans">
            Shopping Cart
          </h2>
          <button
            onClick={closeCart}
            className="text-gray-900 cursor-pointer hover:text-gray-600 transition-colors"
            aria-label="Close cart"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Cart Items */}
        {displayItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 px-8">
            <ShoppingBag size={48} className="text-gray-400" />
            <p className="text-gray-500">Your cart is empty</p>
            <button
              onClick={() => { router.push('/products'); closeCart(); }}
              className="mt-2 bg-[#0f3b2b] cursor-pointer text-white py-3 px-6 text-xs tracking-widest hover:bg-white hover:text-black hover:border hover:border-[#0f3b2b] transition-colors"
            >
              Shop now
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-8 space-y-8 mt-2">
            {displayItems.map((item) => (
              <div
                key={`${item.product_id}-${item.size}`}
                className="flex cursor-pointer gap-6 relative"
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
                      onClick={() => removeItem(item.product_id, item.size)}
                      className="text-gray-900 hover:text-gray-500 absolute right-0 top-0 cursor-pointer "
                      aria-label="Remove item "
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
                          onClick={() => updateQuantity(
                            item.product_id,
                            item.size,
                            Math.max(1, item.quantity - 1)
                          )}
                          className="px-2 py-1.5 cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-center border-r border-gray-900"
                        >
                          <Minus size={12} strokeWidth={1.5} />
                        </button>
                        <span className="w-8 text-center text-sm font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(
                            item.product_id,
                            item.size,
                            item.quantity + 1
                          )}
                          className="px-2 py-1.5 cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-center border-l border-gray-900"
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
        )}

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
                className="w-full bg-[#0f3b2b] cursor-pointer text-white py-3.5 text-xs tracking-widest hover:bg-white hover:text-black hover:border hover:border-[#0f3b2b] transition-colors"
              >
                Checkout
              </button>
              <button
                onClick={() => {
                  router.push('/cart');
                  closeCart();
                }}
                className="w-full border border-gray-900 bg-white text-gray-900 py-3.5 text-xs tracking-widest transition-colors hover:bg-[#0f3b2b] hover:text-white cursor-pointer"
              >
                View cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => { }}
        className="hidden"
      />
    </>
  );
}
