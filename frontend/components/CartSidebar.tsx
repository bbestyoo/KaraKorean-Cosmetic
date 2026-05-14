'use client';

import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export function CartSidebar() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotalPrice, isOpen, closeCart } = useCart();

  return (
    <>
      <button
        onClick={() => closeCart()}
        className="hidden"
      />

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeCart}
          ></div>

          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg z-50 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center p-6">
                <div>
                  <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Your cart is empty</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.product_id}-${item.size}-${item.color}`}
                      className="flex gap-4 border-b pb-4"
                    >
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.color} / {item.size}
                        </p>
                        <p className="font-bold text-gray-900 mt-1">Rs. {item.price}</p>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product_id,
                                item.size,
                                item.color,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product_id,
                                item.size,
                                item.color,
                                item.quantity + 1
                              )
                            }
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            onClick={() =>
                              removeItem(item.product_id, item.size, item.color)
                            }
                            className="ml-auto text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t p-6 space-y-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span>Rs. {getTotalPrice()}</span>
                  </div>
                  <button 
                    onClick={() => {
                      router.push('/cart');
                      closeCart();
                    }}
                    className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={closeCart}
                    className="w-full border border-gray-300 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      <button
        onClick={() => {}}
        className="hidden"
      />
    </>
  );
}
