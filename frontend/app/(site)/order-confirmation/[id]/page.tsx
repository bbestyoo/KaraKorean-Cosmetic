'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Package, Truck } from 'lucide-react';

interface OrderItem {
  id: string;
  product_name: string;
  product_id: string;
  quantity: number;
  price: number;
  color_name?: string;
  size_name?: string;
}

interface Delivery {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  shipping_address: string;
  payment_method: string;
  shipping_cost: number;
  subtotal: number;
  discount: number;
  payment_amount: number;
}

interface Order {
  id: string;
  status: string;
  created_at: string;
  order_items: OrderItem[];
  delivery: Delivery;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderConfirmationPage({ params }: PageProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const resolvedParams = await params;
        setOrderId(resolvedParams.id);
        const response = await fetch(`http://localhost:8000/cart/api/${resolvedParams.id}/`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }

        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          <p className="mt-4 text-gray-600">Loading your order...</p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  const delivery = order.delivery || {};
  const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 text-lg">Thank you for your order. A confirmation email has been sent.</p>
        </div>

        {/* Order Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {/* Order Number */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 font-medium mb-2">Order Number</p>
            <p className="text-2xl font-bold text-gray-900 truncate">{order.id.substring(0, 8)}</p>
            <p className="text-xs text-gray-500 mt-2">{order.id}</p>
          </div>

          {/* Order Date */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 font-medium mb-2">Order Date</p>
            <p className="text-2xl font-bold text-gray-900">{orderDate}</p>
          </div>

          {/* Total Amount */}
          <div className="bg-white rounded-lg p-6 border border-red-200 bg-red-50 shadow-sm">
            <p className="text-sm text-red-600 font-medium mb-2">Total Amount</p>
            <p className="text-3xl font-bold text-red-600">NPR {delivery.payment_amount?.toLocaleString()}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Items ({order.order_items.length})</h2>
              <div className="space-y-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{item.product_name}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                        <span>Qty: {item.quantity}</span>
                        {item.color_name && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span>Color: {item.color_name}</span>
                          </>
                        )}
                        {item.size_name && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span>Size: {item.size_name}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-lg">NPR {item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-2">Full Name</p>
                  <p className="font-semibold text-gray-900 text-lg">
                    {delivery.first_name} {delivery.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-2">Phone Number</p>
                  <p className="font-semibold text-gray-900 text-lg">{delivery.phone_number}</p>
                </div>
                {delivery.email && (
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-2">Email</p>
                    <p className="font-semibold text-gray-900 text-lg">{delivery.email}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-2">Payment Method</p>
                  <p className="font-semibold text-gray-900 text-lg">{delivery.payment_method}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 font-medium mb-2">Shipping Address</p>
                  <p className="font-semibold text-gray-900 text-lg">{delivery.shipping_address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary & Timeline */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">NPR {delivery.subtotal?.toLocaleString()}</span>
                </div>
                {delivery.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-semibold text-green-600">-NPR {delivery.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {delivery.shipping_cost === 0 ? 'FREE' : `NPR ${delivery.shipping_cost}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 pb-6 border-b">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-red-500">NPR {delivery.payment_amount?.toLocaleString()}</span>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Status</h2>
              <div className="space-y-5">
                {/* Order Placed */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="w-1 flex-1 bg-gray-300"></div>
                  </div>
                  <div className="pb-8">
                    <p className="font-semibold text-gray-900">Order Placed</p>
                    <p className="text-sm text-gray-500">{orderDate}</p>
                  </div>
                </div>

                {/* Processing */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                      <Package className="w-6 h-6 text-gray-500" />
                    </div>
                    <div className="w-1 flex-1 bg-gray-300"></div>
                  </div>
                  <div className="pb-8">
                    <p className="font-semibold text-gray-900">Processing</p>
                    <p className="text-sm text-gray-500">Preparing your order</p>
                  </div>
                </div>

                {/* Shipping */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <Truck className="w-6 h-6 text-gray-500" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">On the Way</p>
                    <p className="text-sm text-gray-500">You will receive tracking info soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
          <button
            onClick={() => router.push('/products')}
            className="bg-red-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-600 transition-colors"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => router.push('/')}
            className="border-2 border-gray-300 text-gray-900 py-4 rounded-lg font-bold text-lg hover:border-gray-400 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </main>
  );
}
