'use client';

import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotalPrice } = useCart();

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <button
              onClick={() => router.push('/products')}
              className="inline-block px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </main>
    );
  }

  const subtotal = getTotalPrice();
  const shippingCost = subtotal > 5000 ? 0 : 120;
  const total = subtotal + shippingCost;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Shopping Cart ({items.length} items)</h1>
          <button
            onClick={() => router.push('/products')}
            className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {items.map((item) => (
                <div
                  key={`${item.product_id}-${item.size}-${item.color}`}
                  className="flex gap-4 p-6 border-b last:border-b-0"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <select
                        value={item.size}
                        onChange={() => {}}
                        className="bg-white border border-gray-300 rounded px-2 py-1"
                      >
                        <option>{item.size}</option>
                      </select>
                      <select
                        value={item.color}
                        onChange={() => {}}
                        className="bg-white border border-gray-300 rounded px-2 py-1"
                      >
                        <option>{item.color}</option>
                      </select>
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex flex-col items-end gap-4">
                    <p className="font-bold text-gray-900">NPR {item.price}</p>
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-1">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product_id,
                            item.size,
                            item.color,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="p-1 hover:text-gray-600"
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
                        className="p-1 hover:text-gray-600"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product_id, item.size, item.color)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="h-fit">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>

              <div className="space-y-3 border-b pb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>NPR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `NPR ${shippingCost}`}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                <span>Total</span>
                <span className="text-green-600">NPR {total.toLocaleString()}</span>
              </div>

              <button 
                onClick={() => router.push('/checkout')}
                className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
              >
                Proceed to Checkout →
              </button>

              <button
                onClick={() => router.push('/products')}
                className="w-full border border-gray-300 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>

              <div className="pt-4">
                <p className="text-sm text-gray-600 mb-2">We Accept</p>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-gray-100 px-2 py-1 rounded text-xs font-medium text-center">eSewa</div>
                  <div className="bg-gray-100 px-2 py-1 rounded text-xs font-medium text-center">Khalti</div>
                  <div className="bg-gray-100 px-2 py-1 rounded text-xs font-medium text-center">IME Pay</div>
                  <div className="bg-gray-100 px-2 py-1 rounded text-xs font-medium text-center">COD</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
