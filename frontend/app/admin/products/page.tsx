'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AdminProtected } from '@/components/AdminProtected';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const API_BASE_URL = 'http://localhost:8000';

interface Product {
  product_id: string;
  name: string;
  price: number;
  category_name: string;
  stock?: number;
  images: Array<{ image: string }>;
}

interface PaginatedResponse {
  results: Product[];
  count: number;
  total_pages: number;
  current_page: number;
  links: {
    next: string | null;
    previous: string | null;
  };
}

export default function AdminProducts() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isBackendSearch, setIsBackendSearch] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    productId?: string;
    productName?: string;
  }>({
    open: false,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const fetchProducts = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', page.toString());
      if (search.trim()) {
        params.append('search', search);
      }
      
      const response = await fetch(`${API_BASE_URL}/shop/api/admin/search/?${params}`, {
        headers: { 'Authorization': `Token ${token}` },
      });

      const data: PaginatedResponse = await response.json();
      setAllProducts(data.results || []);
      setDisplayedProducts(data.results || []);
      setCurrentPage(data.current_page || page);
      setTotalPages(data.total_pages || 1);
      setTotalCount(data.count || 0);
      setIsBackendSearch(true);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    
    // Client-side filtering
    if (value.trim()) {
      const filtered = allProducts.filter((p) =>
        p.name.toLowerCase().includes(value.toLowerCase()) ||
        p.category_name.toLowerCase().includes(value.toLowerCase())
      );
      setDisplayedProducts(filtered);
      setIsBackendSearch(false);
    } else {
      setDisplayedProducts(allProducts);
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setCurrentPage(1);
      fetchProducts(1, searchQuery);
    }
  };

  const handleDelete = async (productId: string) => {
    const product = displayedProducts.find((p) => p.product_id === productId);
    setDeleteDialog({
      open: true,
      productId,
      productName: product?.name,
    });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.productId) return;

    try {
      setIsDeleting(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/shop/api/${deleteDialog.productId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` },
      });

      if (response.ok) {
        const updated = displayedProducts.filter((p) => p.product_id !== deleteDialog.productId);
        setDisplayedProducts(updated);
        setAllProducts(allProducts.filter((p) => p.product_id !== deleteDialog.productId));
        setDeleteDialog({ open: false });
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to delete product:', errorData);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      if (isBackendSearch) {
        fetchProducts(newPage, searchQuery);
      }
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      if (isBackendSearch) {
        fetchProducts(newPage, searchQuery);
      }
    }
  };

  return (
    <AdminProtected>
      <>
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          </div>
          <Link href="/admin/products/new">
            <button className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
              <Plus size={18} />
              Add Product
            </button>
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search products... (Press Enter for backend search)"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {loading ? (
              <div className="p-8 text-center text-gray-600">
                <p>Loading products...</p>
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                <p>No products found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                          Product
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                          Category
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                          Price
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                          Stock
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedProducts.map((product) => (
                        <tr
                          key={product.product_id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {product.images && product.images[0] && (
                                <Image
                                  src={product.images[0].image}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  className="w-10 h-10 rounded object-cover"
                                />
                              )}
                              <span className="font-medium text-gray-900 text-sm">
                                {product.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {product.category_name}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">
                            NPR {product.price.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                (product.stock || 0) > 0
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {product.stock || 0} units
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Link href={`/admin/products/${product.product_id}/edit`}>
                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                  <Edit2 size={16} />
                                </button>
                              </Link>
                              <button
                                onClick={() => handleDelete(product.product_id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination - only show if backend search is active */}
                {isBackendSearch && (
                  <div className="border-t border-gray-200 px-4 py-4 flex items-center justify-between">
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
              </>
            )}
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &quot;{deleteDialog.productName}&quot;? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-3">
              <button
                onClick={() => setDeleteDialog({ open: false })}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    </AdminProtected>
  );
}
