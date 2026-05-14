'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminProtected } from '@/components/AdminProtected';
import {
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
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
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  shipping_address: string;
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

interface PaginatedResponse {
  results: Order[];
  count: number;
  total_pages: number;
  current_page: number;
  links: {
    next: string | null;
    previous: string | null;
  };
}

function AdminOrdersContent() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [displayedOrders, setDisplayedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Pending');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isBackendSearch, setIsBackendSearch] = useState(false);

  useEffect(() => {
    fetchOrders(1);
  }, []);

  const fetchOrders = async (page: number = 1, search: string = '', status: string = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', page.toString());
      if (search.trim()) {
        params.append('search', search);
      }
      if (status) {
        params.append('status', status);
      }
      
      const response = await fetch(`${API_BASE_URL}/cart/api/order/?${params}`, {
        headers: { 'Authorization': `Token ${token}` },
      });

      if (response.ok) {
        const data: PaginatedResponse = await response.json();
        setAllOrders(data.results || []);
        setDisplayedOrders(data.results || []);
        setCurrentPage(data.current_page || page);
        setTotalPages(data.total_pages || 1);
        setTotalCount(data.count || 0);
        setIsBackendSearch(true);
      } else {
        console.error('Failed to fetch orders:', response.status);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    
    // Client-side filtering
    if (value.trim()) {
      const filtered = allOrders.filter((order) =>
        order.delivery?.first_name?.toLowerCase().includes(value.toLowerCase()) ||
        order.delivery?.last_name?.toLowerCase().includes(value.toLowerCase()) ||
        order.delivery?.email?.toLowerCase().includes(value.toLowerCase()) ||
        order.id.toLowerCase().includes(value.toLowerCase())
      );
      setDisplayedOrders(filtered);
      setIsBackendSearch(false);
    } else {
      setDisplayedOrders(allOrders);
    }
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    
    // Fetch from backend with status filter
    fetchOrders(1, searchQuery, status);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setCurrentPage(1);
      fetchOrders(1, searchQuery, statusFilter);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      if (isBackendSearch) {
        fetchOrders(newPage, searchQuery, statusFilter);
      }
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      if (isBackendSearch) {
        fetchOrders(newPage, searchQuery, statusFilter);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'dispatched':
        return 'bg-blue-100 text-blue-800';
      case 'cleared':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminProtected>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Manage and view all customer orders</p>
        </div>

        <div className="p-6">
          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or order ID... (Press Enter)"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Cleared">Cleared</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Orders Table */}
          {loading ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">Loading orders...</p>
            </div>
          ) : displayedOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {displayedOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600">
                              {new Date(order.created_at).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {order.delivery?.first_name} {order.delivery?.last_name}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600">{order.delivery?.email}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">
                              Rs. {order.delivery?.payment_amount || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-4 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono text-sm text-gray-900">
                              {order.id.substring(0, 8)}...
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="inline-flex items-center gap-2 px-3 py-2 text-sm text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded-lg transition-colors"
                            >
                              <Eye size={16} />
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination - only show if backend search is active */}
                {isBackendSearch && (
                  <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages} ({totalCount} total items)
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1 || loading}
                        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft size={18} />
                        Previous
                      </button>
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages || loading}
                        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminProtected>
  );
}

export default function AdminOrders() {
  return <AdminOrdersContent />;
}
