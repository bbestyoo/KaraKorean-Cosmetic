'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AdminProtected } from '@/components/AdminProtected';
import {
  ArrowLeft,
  Edit2,
  Save,
  X,
  CheckCircle,
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

interface OrderItem {
  id: string;
  product_name: string;
  product_id: string;
  quantity: number;
  price: number;
  color_name: string;
  size_name: string;
}

interface Delivery {
  id: string;
  order: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  shipping_address: string;
  payment_method: string;
  shipping_cost: number;
  subtotal: number;
  discount: number;
  payment_amount: number;
  payment_status: string;
  created_at: string;
}

interface Order {
  id: string;
  user: string | null;
  status: string;
  order_items: OrderItem[];
  delivery: Delivery;
  created_at: string;
  updated_at: string;
}

function OrderDetailContent() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStatus, setEditedStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/cart/api/${orderId}/`, {
        headers: { 'Authorization': `Token ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data);
        setEditedStatus(data.status);
      } else {
        setError('Failed to load order details');
        console.error('Failed to fetch order:', response.status);
      }
    } catch (error) {
      setError('Error fetching order details');
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const handleSaveStatus = async () => {
    if (!order || editedStatus === order.status) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`${API_BASE_URL}/cart/api/${orderId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: editedStatus,
        }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrder(updatedOrder);
        setIsEditing(false);
        setSuccess('Order status updated successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to update order status');
        console.error('Update failed:', response.status);
      }
    } catch (error) {
      setError('Error updating order status');
      console.error('Error updating order:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'placed':
        return 'bg-blue-100 text-blue-800';
      case 'cleared':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminProtected>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </AdminProtected>
    );
  }

  if (!order) {
    return (
      <AdminProtected>
        <div className="min-h-screen bg-gray-50">
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <Link href="/admin/orders" className="flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-4">
              <ArrowLeft size={20} />
              Back to Orders
            </Link>
            <p className="text-red-600">Order not found</p>
          </div>
        </div>
      </AdminProtected>
    );
  }

  return (
    <AdminProtected>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <Link href="/admin/orders" className="flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-4">
            <ArrowLeft size={20} />
            Back to Orders
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
              <p className="text-gray-600 mt-1">Order ID: {order.id}</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
            <X size={20} />
            {error}
          </div>
        )}
        {success && (
          <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
            <CheckCircle size={20} />
            {success}
          </div>
        )}

        <div className="p-6 max-w-6xl mx-auto space-y-6">
          {/* Order Status Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Order Status</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                >
                  <Edit2 size={16} />
                  Edit Status
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="flex items-center gap-3">
                <select
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                >
                  <option value="Placed">Placed</option>
                  <option value="Cleared">Cleared</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={handleSaveStatus}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
                >
                  <Save size={16} />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedStatus(order.status);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <span className={`inline-flex px-4 py-2 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            )}
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <p className="text-gray-900 mt-1">
                  {order.delivery?.first_name} {order.delivery?.last_name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900 mt-1">{order.delivery?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone Number</label>
                <p className="text-gray-900 mt-1">{order.delivery?.phone_number}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Payment Method</label>
                <p className="text-gray-900 mt-1">{order.delivery?.payment_method}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
            <p className="text-gray-900">{order.delivery?.shipping_address}</p>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Color
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.order_items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{item.product_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.color_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.size_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">Rs. {item.price}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        Rs. {item.price * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-900">
                <span>Subtotal:</span>
                <span>Rs. {order.delivery?.subtotal || 0}</span>
              </div>
              <div className="flex justify-between text-gray-900">
                <span>Shipping Cost:</span>
                <span>Rs. {order.delivery?.shipping_cost || 0}</span>
              </div>
              {order.delivery?.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-Rs. {order.delivery?.discount || 0}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 mt-4 flex justify-between text-lg font-semibold text-gray-900">
                <span>Total:</span>
                <span>Rs. {order.delivery?.payment_amount || 0}</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="text-gray-900">{order.delivery?.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                  order.delivery?.payment_status === 'Completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.delivery?.payment_status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span className="text-gray-900">
                  {new Date(order.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminProtected>
  );
}

export default function OrderDetail() {
  return <OrderDetailContent />;
}
