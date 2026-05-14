'use client';

import { useState, useEffect } from 'react';
import { AdminProtected } from '@/components/AdminProtected';
import {
  Users,
  ShoppingCart,
  Package,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  Eye,
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  pendingOrders: number;
  dispatchedOrders: number;
  clearedOrders: number;
  cancelledOrders: number;
}

interface RecentOrder {
  id: string;
  order_id: string;
  customer: string;
  email: string;
  total: number;
  status: string;
  date: string;
}

function AdminDashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');

      const [usersRes, ordersRes, productsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/userauth/api/users/`, {
          headers: { 'Authorization': `Token ${token}` },
        }),
        fetch(`${API_BASE_URL}/cart/api/order/`, {
          headers: { 'Authorization': `Token ${token}` },
        }),
        fetch(`${API_BASE_URL}/shop/api/`, {
          headers: { 'Authorization': `Token ${token}` },
        }),
      ]);

      const usersData = await usersRes.json();
      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();

      // Handle paginated response from orders endpoint
      const ordersList = ordersData.results || ordersData || [];

      const stats: DashboardStats = {
        totalUsers: usersData.count || 0,
        totalOrders: ordersData.count || 0,
        totalProducts: productsData.count || 0,
        totalRevenue: ordersList.reduce((sum: number, order: Record<string, unknown>) => sum + ((order.delivery as Record<string, unknown>)?.payment_amount as number || 0), 0) || 0,
        pendingOrders: ordersList.filter((o: Record<string, unknown>) => o.status === 'Pending').length || 0,
        dispatchedOrders: ordersList.filter((o: Record<string, unknown>) => o.status === 'Dispatched').length || 0,
        clearedOrders: ordersList.filter((o: Record<string, unknown>) => o.status === 'Cleared').length || 0,
        cancelledOrders: ordersList.filter((o: Record<string, unknown>) => o.status === 'Cancelled').length || 0,
      };

      setStats(stats);

      const recent = ordersList.slice(0, 8).map((order: Record<string, unknown>) => ({
        id: order.id,
        order_id: `#${(order.id as string).substring(0, 8).toUpperCase()}`,
        customer: (order.delivery as Record<string, unknown>)?.first_name || 'Unknown',
        email: (order.delivery as Record<string, unknown>)?.email || 'N/A',
        total: (order.delivery as Record<string, unknown>)?.payment_amount as number || 0,
        status: (order.status as string) || 'Pending',
        date: new Date(order.created_at as string).toLocaleDateString(),
      })) || [];

      setRecentOrders(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set empty stats on error
      setStats({
        totalUsers: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        dispatchedOrders: 0,
        clearedOrders: 0,
        cancelledOrders: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'dispatched':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cleared':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'dispatched':
        return <TrendingUp className="w-4 h-4" />;
      case 'cleared':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  return (
    <AdminProtected>
      <>
        <div className="bg-white border-b shadow-lg text-black px-6 py-8 ">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className=" mt-1">Welcome to your admin panel</p>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-gray-50 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading dashboard...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Main Stats Grid */}
              {stats && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Users */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-medium">Total Users</p>
                          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                          <p className="text-gray-500 text-xs mt-2">Active users</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </div>

                    {/* Total Orders */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
                          <p className="text-gray-500 text-xs mt-2">All time</p>
                        </div>
                        <div className="bg-pink-100 p-3 rounded-lg">
                          <ShoppingCart className="w-6 h-6 text-pink-600" />
                        </div>
                      </div>
                    </div>

                    {/* Total Products */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-medium">Total Products</p>
                          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
                          <p className="text-gray-500 text-xs mt-2">In catalog</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                          <Package className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </div>

                    {/* Total Revenue */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                          <p className="text-3xl font-bold text-gray-900 mt-2">NPR {(stats.totalRevenue / 100000).toFixed(1)}L</p>
                          <p className="text-gray-500 text-xs mt-2">Total earnings</p>
                        </div>
                        <div className="bg-pink-100 p-3 rounded-lg">
                          <TrendingUp className="w-6 h-6 text-pink-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Status Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Pending Orders */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <p className="text-gray-600 text-sm font-medium">Pending</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                      <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500" style={{ width: `${(stats.pendingOrders / stats.totalOrders) * 100}%` }}></div>
                      </div>
                    </div>

                    {/* Dispatched Orders */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <p className="text-gray-600 text-sm font-medium">Dispatched</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{stats.dispatchedOrders}</p>
                      <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${(stats.dispatchedOrders / stats.totalOrders) * 100}%` }}></div>
                      </div>
                    </div>

                    {/* Cleared Orders */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="text-gray-600 text-sm font-medium">Cleared</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{stats.clearedOrders}</p>
                      <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: `${(stats.clearedOrders / stats.totalOrders) * 100}%` }}></div>
                      </div>
                    </div>

                    {/* Cancelled Orders */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <p className="text-gray-600 text-sm font-medium">Cancelled</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{stats.cancelledOrders}</p>
                      <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: `${(stats.cancelledOrders / stats.totalOrders) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Recent Orders Table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-pink-600" />
                    Recent Orders
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Order</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Customer</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Email</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Amount</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Status</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6 text-sm font-medium text-gray-900">{order.order_id}</td>
                          <td className="py-4 px-6 text-sm text-gray-900 font-medium">{order.customer}</td>
                          <td className="py-4 px-6 text-sm text-gray-600">{order.email}</td>
                          <td className="py-4 px-6 text-sm font-medium text-gray-900">NPR {order.total.toLocaleString()}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600">{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    </AdminProtected>
  );
}

export default function AdminDashboard() {
  return (
    <AdminProtected>
      <AdminDashboardContent />
    </AdminProtected>
  );
}
