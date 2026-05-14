'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AdminProtected } from '@/components/AdminProtected';
import { X, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/shop', '') || 'http://localhost:8000';

interface ProductFormData {
  name: string;
  seo_friendly_name: string;
  category: string;
  sub_category: string;
  brand: string;
  price: number;
  old_price: number;
  before_deal_price: number;
  description: string;
  meta_description: string;
  meta_keywords: string;
  deal: boolean;
  trending: boolean;
  best_seller: boolean;
  featured: boolean;
}

interface ColorData {
  id: string;
  name: string;
  hex: string;
  images: Array<{ id: string; file: File; preview: string }>;
}

interface SizeData {
  id: string;
  name: string;
}

interface StockData {
  id: string;
  colorId: string;
  sizeId: string;
  quantity: number;
}

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

export default function AddProduct() {
  const router = useRouter();
  const [step, setStep] = useState<'product' | 'colors' | 'sizes' | 'stock' | 'images'>('product');
  const [productId, setProductId] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false);
  const [showNewBrandDialog, setShowNewBrandDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newBrandName, setNewBrandName] = useState('');

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    seo_friendly_name: '',
    category: '',
    sub_category: '',
    brand: '',
    price: 0,
    old_price: 0,
    before_deal_price: 0,
    description: '',
    meta_description: '',
    meta_keywords: '',
    deal: false,
    trending: false,
    best_seller: false,
    featured: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [colors, setColors] = useState<ColorData[]>([]);
  const [newColor, setNewColor] = useState({ name: '', hex: '#000000' });
  const [createdColorIds, setCreatedColorIds] = useState<Record<string, string>>({});

  const [sizes, setSizes] = useState<SizeData[]>([]);
  const [newSize, setNewSize] = useState('');
  const [createdSizeIds, setCreatedSizeIds] = useState<Record<string, string>>({});

  const [stocks, setStocks] = useState<StockData[]>([]);

  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: 'color' | 'size' | 'image' | null;
    itemId?: string;
    colorId?: string;
    itemName?: string;
  }>({
    open: false,
    type: null,
  });

  // Fetch categories and brands on mount
  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/shop/category/`, {
        headers: { 'Authorization': `Token ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data.results || data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/shop/brand/`, {
        headers: { 'Authorization': `Token ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setBrands(data.results || data);
      }
    } catch (err) {
      console.error('Error fetching brands:', err);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/shop/category/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (response.ok) {
        const newCategory = await response.json();
        setCategories(prev => [...prev, newCategory]);
        setFormData(prev => ({ ...prev, category: newCategory.id.toString() }));
        setShowNewCategoryDialog(false);
        setNewCategoryName('');
      }
    } catch {
      alert('Error creating category');
    }
  };

  const handleCreateBrand = async () => {
    if (!newBrandName.trim()) {
      alert('Please enter a brand name');
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/shop/brand/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ name: newBrandName }),
      });

      if (response.ok) {
        const newBrand = await response.json();
        setBrands(prev => [...prev, newBrand]);
        setFormData(prev => ({ ...prev, brand: newBrand.id.toString() }));
        setShowNewBrandDialog(false);
        setNewBrandName('');
      }
    } catch {
      alert('Error creating brand');
    }
  };

  // Step 1: Create Product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/shop/api/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          seo_friendly_name: formData.seo_friendly_name,
          category: parseInt(formData.category),
          sub_category: formData.sub_category ? parseInt(formData.sub_category) : null,
          brand: formData.brand ? parseInt(formData.brand) : null,
          price: formData.price,
          old_price: formData.old_price || null,
          before_deal_price: formData.before_deal_price || null,
          description: formData.description,
          meta_description: formData.meta_description,
          meta_keywords: formData.meta_keywords,
          deal: formData.deal,
          trending: formData.trending,
          best_seller: formData.best_seller,
          featured: formData.featured,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create product');
      }

      const data = await response.json();
      setProductId(data.product_id);
      setSuccess('Product created! Now add colors.');
      setStep('colors');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Add Colors
  const handleAddColor = () => {
    if (!newColor.name.trim()) {
      alert('Please enter a color name');
      return;
    }

    const color: ColorData = {
      id: Math.random().toString(36).substr(2, 9),
      name: newColor.name,
      hex: newColor.hex,
      images: [],
    };

    setColors(prev => [...prev, color]);
    setNewColor({ name: '', hex: '#000000' });
  };

  const handleColorImageUpload = (colorId: string, files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setColors(prev =>
          prev.map(color =>
            color.id === colorId
              ? {
                  ...color,
                  images: [
                    ...color.images,
                    {
                      id: Math.random().toString(36).substr(2, 9),
                      file,
                      preview: event.target?.result as string,
                    },
                  ],
                }
              : color
          )
        );
      };
      reader.readAsDataURL(file);
    });
  };

  const removeColorImage = (colorId: string, imageId: string) => {
    setDeleteDialog({
      open: true,
      type: 'image',
      itemId: imageId,
      colorId: colorId,
      itemName: 'Image',
    });
  };

  const confirmDeleteImage = async (colorId: string, imageId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      // Only delete from API if it has a numeric ID (was created)
      if (!isNaN(Number(imageId))) {
        await fetch(`${API_BASE_URL}/shop/product-image/${imageId}/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Token ${token}` },
        });
      }
      
      setColors(prev =>
        prev.map(color =>
          color.id === colorId
            ? { ...color, images: color.images.filter(img => img.id !== imageId) }
            : color
        )
      );
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image');
    } finally {
      setDeleteDialog({ open: false, type: null });
    }
  };

  const removeColor = (colorId: string) => {
    const color = colors.find(c => c.id === colorId);
    setDeleteDialog({
      open: true,
      type: 'color',
      itemId: colorId,
      itemName: color?.name,
    });
  };

  const confirmDeleteColor = async (colorId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const apiColorId = createdColorIds[colorId] || colorId;
      
      // Only delete from API if it was created (has numeric ID from API)
      if (!isNaN(Number(apiColorId))) {
        await fetch(`${API_BASE_URL}/shop/color/${apiColorId}/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Token ${token}` },
        });
      }
      
      setColors(prev => prev.filter(c => c.id !== colorId));
      setCreatedColorIds(prev => {
        const updated = { ...prev };
        delete updated[colorId];
        return updated;
      });
    } catch (err) {
      console.error('Error deleting color:', err);
      setError('Failed to delete color');
    } finally {
      setDeleteDialog({ open: false, type: null });
    }
  };

  const handlePostColors = async () => {
    if (colors.length === 0) {
      alert('Please add at least one color');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('auth_token');
      const colorIds: Record<string, string> = {};

      for (const color of colors) {
        const response = await fetch(`${API_BASE_URL}/shop/color/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
          body: JSON.stringify({
            name: color.name,
            product: productId,
            hex: color.hex,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to create color ${color.name}: ${errorData.detail || 'Unknown error'}`);
        }

        const colorData = await response.json();
        colorIds[color.id] = colorData.id;
      }

      setCreatedColorIds(colorIds);
      setSuccess('Colors created! Now add sizes.');
      setStep('sizes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Add Sizes
  const handleAddSize = () => {
    if (!newSize.trim()) {
      alert('Please enter a size name');
      return;
    }

    const size: SizeData = {
      id: Math.random().toString(36).substr(2, 9),
      name: newSize,
    };

    setSizes(prev => [...prev, size]);
    setNewSize('');
  };

  const removeSize = (sizeId: string) => {
    const size = sizes.find(s => s.id === sizeId);
    setDeleteDialog({
      open: true,
      type: 'size',
      itemId: sizeId,
      itemName: size?.name,
    });
  };

  const confirmDeleteSize = async (sizeId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const apiSizeId = createdSizeIds[sizeId] || sizeId;
      
      // Only delete from API if it was created (has numeric ID from API)
      if (!isNaN(Number(apiSizeId))) {
        await fetch(`${API_BASE_URL}/shop/size/${apiSizeId}/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Token ${token}` },
        });
      }
      
      setSizes(prev => prev.filter(s => s.id !== sizeId));
      setCreatedSizeIds(prev => {
        const updated = { ...prev };
        delete updated[sizeId];
        return updated;
      });
    } catch (err) {
      console.error('Error deleting size:', err);
      setError('Failed to delete size');
    } finally {
      setDeleteDialog({ open: false, type: null });
    }
  };

  const handlePostSizes = async () => {
    if (sizes.length === 0) {
      alert('Please add at least one size');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('auth_token');
      const sizeIds: Record<string, string> = {};

      for (const size of sizes) {
        const response = await fetch(`${API_BASE_URL}/shop/size/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
          body: JSON.stringify({
            name: size.name,
            product: productId,
            price_adjustment: 0,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to create size ${size.name}: ${errorData.detail || 'Unknown error'}`);
        }

        const sizeData = await response.json();
        sizeIds[size.id] = sizeData.id;
      }

      setCreatedSizeIds(sizeIds);
      setSuccess('Sizes created! Now configure stock.');
      setStep('stock');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Configure Stock (Size + Color combinations)
  const handleAddStock = (colorId: string, sizeId: string, quantity: number) => {
    const stock: StockData = {
      id: Math.random().toString(36).substr(2, 9),
      colorId,
      sizeId,
      quantity,
    };

    setStocks(prev => [...prev, stock]);
  };

  const handlePostStock = async () => {
    console.log(stocks);
    if (stocks.length === 0) {
      alert('Please add at least one stock configuration');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('auth_token');

      for (const stock of stocks) {
        const response = await fetch(`${API_BASE_URL}/shop/size-color-stock/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
          body: JSON.stringify({
            product: productId,
            size: createdSizeIds[stock.sizeId],
            color: createdColorIds[stock.colorId] || null,
            stock: stock.quantity,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to create stock: ${errorData.detail || 'Unknown error'}`);
        }
      }

      setSuccess('Stock configured! Now upload images.');
      setStep('images');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Step 5: Upload Images
  const handleUploadImages = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('auth_token');

      for (const color of colors) {
        const colorId = createdColorIds[color.id];
        
        for (const image of color.images) {
          const formDataObj = new FormData();
          formDataObj.append('image', image.file);
          formDataObj.append('product', productId || '');
          formDataObj.append('color', colorId);

          const response = await fetch(`${API_BASE_URL}/shop/product-image/`, {
            method: 'POST',
            headers: {
              'Authorization': `Token ${token}`,
            },
            body: formDataObj,
          });

          if (!response.ok) {
            throw new Error('Failed to upload image');
          }
        }
      }

      setSuccess('Product created successfully! Redirecting...');
      setTimeout(() => {
        router.push('/admin/products');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <AdminProtected>
      <>
        {/* Category Dialog */}
        {showNewCategoryDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Category</h3>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 mb-4"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateCategory()}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleCreateCategory}
                  className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowNewCategoryDialog(false);
                    setNewCategoryName('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Brand Dialog */}
        {showNewBrandDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Brand</h3>
              <input
                type="text"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="Brand name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 mb-4"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateBrand()}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleCreateBrand}
                  className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowNewBrandDialog(false);
                    setNewBrandName('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Link href="/admin/products" className="text-gray-600 hover:text-gray-900">
                Products
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-semibold">Add New Product</span>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Progress Indicator */}
            <div className="mb-8 flex gap-2">
              {(['product', 'colors', 'sizes', 'stock', 'images'] as const).map((s, idx) => (
                <div
                  key={s}
                  className={`flex-1 h-2 rounded-full transition-colors ${
                    step === s
                      ? 'bg-pink-500'
                      : ['product', 'colors', 'sizes', 'stock', 'images'].indexOf(step) > idx
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                {success}
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                {error}
              </div>
            )}

            {/* Step 1: Product Details */}
            {step === 'product' && (
              <form onSubmit={handleCreateProduct} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">SEO Friendly Name</label>
                  <input
                    type="text"
                    name="seo_friendly_name"
                    value={formData.seo_friendly_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Enter SEO friendly name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Category *</label>
                    <div className="flex gap-2">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowNewCategoryDialog(true)}
                        className="px-3 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 flex items-center gap-1"
                        title="Create new category"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Brand</label>
                    <div className="flex gap-2">
                      <select
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="">Select brand</option>
                        {brands.map(brand => (
                          <option key={brand.id} value={brand.id}>{brand.name}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowNewBrandDialog(true)}
                        className="px-3 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 flex items-center gap-1"
                        title="Create new brand"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Price *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Old Price</label>
                    <input
                      type="number"
                      name="old_price"
                      value={formData.old_price}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Product description"
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Flags</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="deal"
                        checked={formData.deal}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm font-medium text-gray-900">Deal</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="trending"
                        checked={formData.trending}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm font-medium text-gray-900">Trending</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="best_seller"
                        checked={formData.best_seller}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm font-medium text-gray-900">Best Seller</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm font-medium text-gray-900">Featured</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Creating...' : 'Next: Add Colors'}
                  </button>
                  <Link href="/admin/products" className="flex-1">
                    <button
                      type="button"
                      className="w-full px-6 py-3 bg-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </Link>
                </div>
              </form>
            )}

            {/* Step 2: Colors */}
            {step === 'colors' && productId && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Add Colors</h2>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
                  <p className="text-sm">Add all colors for this product. You can upload images for each color right here.</p>
                </div>

                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Color name (e.g., Red, Blue)"
                    value={newColor.name}
                    onChange={(e) => setNewColor(prev => ({ ...prev, name: e.target.value }))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newColor.hex}
                      onChange={(e) => setNewColor(prev => ({ ...prev, hex: e.target.value }))}
                      className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 flex items-center gap-2"
                  >
                    <Plus size={18} /> Add
                  </button>
                </div>

                {colors.length > 0 && (
                  <div className="space-y-3">
                    {colors.map(color => (
                      <div key={color.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded border border-gray-300" style={{ backgroundColor: color.hex }} />
                            <span className="font-medium text-gray-900">{color.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeColor(color.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={18} />
                          </button>
                        </div>
                        
                        <div className="mt-2 pt-3 border-t border-gray-200">
                          <label className="block text-sm font-medium text-gray-900 mb-2">Images for {color.name}:</label>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleColorImageUpload(color.id, e.target.files)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                          
                          {color.images.length > 0 && (
                            <div className="grid grid-cols-4 gap-2 mt-3">
                              {color.images.map(img => (
                                <div key={img.id} className="relative group">
                                  <Image src={img.preview} alt="Preview" width={96} height={96} className="w-full h-24 object-cover rounded" />
                                  <button
                                    type="button"
                                    onClick={() => removeColorImage(color.id, img.id)}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={handlePostColors}
                    disabled={loading || colors.length === 0}
                    className="flex-1 px-6 py-3 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Saving...' : 'Next: Add Sizes'}
                  </button>
                  <button
                    onClick={() => {
                      setStep('product');
                      setColors([]);
                    }}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-300"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Sizes */}
            {step === 'sizes' && productId && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Add Sizes</h2>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
                  <p className="text-sm">Add all sizes for this product. You&apos;ll configure stock quantities by size and color next.</p>
                </div>

                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Size (e.g., S, M, L, XL)"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 flex items-center gap-2"
                  >
                    <Plus size={18} /> Add
                  </button>
                </div>

                {sizes.length > 0 && (
                  <div className="space-y-2">
                    {sizes.map(size => (
                      <div key={size.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-900">{size.name}</span>
                        <button
                          type="button"
                          onClick={() => removeSize(size.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={handlePostSizes}
                    disabled={loading || sizes.length === 0}
                    className="flex-1 px-6 py-3 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Saving...' : 'Next: Configure Stock'}
                  </button>
                  <button
                    onClick={() => setStep('colors')}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-300"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Stock Configuration */}
            {step === 'stock' && productId && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Configure Stock</h2>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
                  <p className="text-sm">Set the quantity available for each size-color combination.</p>
                </div>

                <div className="space-y-4">
                  {colors.map(color => (
                    <div key={color.id} className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: color.hex }} />
                        {color.name}
                      </h3>
                      <div className="space-y-2">
                        {sizes.map(size => (
                          <StockInputRow
                            key={`${color.id}-${size.id}`}
                            colorId={color.id}
                            sizeName={size.name}
                            sizeId={size.id}
                            onAdd={handleAddStock}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {stocks.length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Stock Summary</h3>
                    <div className="space-y-2">
                      {stocks.map(stock => {
                        const color = colors.find(c => c.id === stock.colorId);
                        const size = sizes.find(s => s.id === stock.sizeId);
                        return (
                          <div key={stock.id} className="flex justify-between text-sm text-gray-700">
                            <span>{color?.name} - {size?.name}</span>
                            <span>{stock.quantity} units</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={handlePostStock}
                    className="flex-1 px-6 py-3 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Saving...' : 'Next: Complete'}
                  </button>
                  <button
                    onClick={() => setStep('sizes')}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-300"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Complete */}
            {step === 'images' && productId && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Product Complete!</h2>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                  <p className="text-sm">Your product has been created with all colors, sizes, and stock configured. Click finish to complete and go to your product list.</p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleUploadImages}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Finishing...' : 'Finish'}
                  </button>
                  <button
                    onClick={() => setStep('stock')}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-300"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                {deleteDialog.type === 'color' && `Are you sure you want to delete the color &quot;${deleteDialog.itemName}&quot;? This will also remove all images associated with this color.`}
                {deleteDialog.type === 'size' && `Are you sure you want to delete the size &quot;${deleteDialog.itemName}&quot;?`}
                {deleteDialog.type === 'image' && `Are you sure you want to delete this image?`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button
                onClick={() => setDeleteDialog({ open: false, type: null })}
                className="px-4 py-2 bg-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteDialog.type === 'color' && deleteDialog.itemId) {
                    confirmDeleteColor(deleteDialog.itemId);
                  } else if (deleteDialog.type === 'size' && deleteDialog.itemId) {
                    confirmDeleteSize(deleteDialog.itemId);
                  } else if (deleteDialog.type === 'image' && deleteDialog.itemId && deleteDialog.colorId) {
                    confirmDeleteImage(deleteDialog.colorId, deleteDialog.itemId);
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    </AdminProtected>
  );
}

function StockInputRow({
  colorId,
  sizeName,
  sizeId,
  onAdd,
}: {
  colorId: string;
  sizeName: string;
  sizeId: string;
  onAdd: (colorId: string, sizeId: string, quantity: number) => void;
}) {
  const [quantity, setQuantity] = useState<number | ''>('');

  const handleChange = (value: number | '') => {
    setQuantity(value);
    if (value !== '' && value > 0) {
      onAdd(colorId, sizeId, value);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 flex-1">{sizeName}</span>
      <input
        type="number"
        min="0"
        value={quantity}
        onChange={(e) => {
          handleChange(e.target.value === '' ? '' : parseInt(e.target.value));
        }}
        placeholder="0"
        className="w-20 px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-pink-500"
      />
    </div>
  );
}
