'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AdminProtected } from '@/components/AdminProtected';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const API_BASE_URL = 'http://localhost:8000';

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
  images: Array<{ id: string; file?: File; preview: string }>;
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

interface APIColor {
  id: number;
  name: string;
  hex?: string;
}

interface APISize {
  id: number;
  name: string;
}

interface APIStock {
  id: number;
  color_id: number;
  size: number;
  stock: number;
}

interface ColorStock {
  id: number;
  color_id: number;
  stock: number;
}

interface SizeWithColorStocks extends APISize {
  color_stocks?: ColorStock[];
}

interface APIProduct {
  name: string;
  seo_friendly_name?: string;
  category?: string;
  sub_category?: string;
  brand?: string;
  price?: number;
  old_price?: number;
  before_deal_price?: number;
  description?: string;
  meta_description?: string;
  meta_keywords?: string;
  deal?: boolean;
  trending?: boolean;
  best_seller?: boolean;
  featured?: boolean;
  colors?: APIColor[];
  sizes?: APISize[];
  size_color_stocks?: APIStock[];
}

interface APIImage {
  id: number;
  image: string;
}

interface Brand {
  id: number;
  name: string;
}

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [step, setStep] = useState<'product' | 'colors' | 'sizes' | 'stock'>('product');
  const [isLoading, setIsLoading] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

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

  // Track original data to detect changes
  const [originalFormData, setOriginalFormData] = useState<ProductFormData | null>(null);

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

  // Load product data on mount
  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchProductData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/shop/api/${productId}/`, {
        headers: { 'Authorization': `Token ${token}` },
      });
      
      if (response.ok) {
        const product: APIProduct = await response.json();
        
        if (product) {
          setFormData({
            name: product.name || '',
            seo_friendly_name: product.seo_friendly_name || '',
            category: product.category || '',
            sub_category: product.sub_category || '',
            brand: product.brand || '',
            price: product.price || 0,
            old_price: product.old_price || 0,
            before_deal_price: product.before_deal_price || 0,
            description: product.description || '',
            meta_description: product.meta_description || '',
            meta_keywords: product.meta_keywords || '',
            deal: product.deal || false,
            trending: product.trending || false,
            best_seller: product.best_seller || false,
            featured: product.featured || false,
          });

          // Load colors
          if (product.colors && product.colors.length > 0) {
            const loadedColors = await Promise.all(
              product.colors.map(async (color: APIColor) => {
                const imageResponse = await fetch(`${API_BASE_URL}/shop/product-image/?color=${color.id}`, {
                  headers: { 'Authorization': `Token ${token}` },
                });
                const imageData = await imageResponse.json();
                const images = (imageData.results || imageData).map((img: APIImage) => ({
                  id: img.id.toString(),
                  preview: img.image,
                }));
                
                return {
                  id: color.id.toString(),
                  name: color.name,
                  hex: color.hex || '#000000',
                  images,
                };
              })
            );
            setColors(loadedColors);
          }

          // Load sizes
          if (product.sizes && product.sizes.length > 0) {
            setSizes(
              product.sizes.map((size: APISize) => ({
                id: size.id.toString(),
                name: size.name,
              }))
            );
          }

          // Load stocks from sizes color_stocks
          const loadedStocks: StockData[] = [];
          if (product.sizes && product.sizes.length > 0) {
            product.sizes.forEach((size: SizeWithColorStocks) => {
              if (size.color_stocks && size.color_stocks.length > 0) {
                size.color_stocks.forEach((stock: ColorStock) => {
                  loadedStocks.push({
                    id: stock.id.toString(),
                    colorId: stock.color_id.toString(),
                    sizeId: size.id.toString(),
                    quantity: stock.stock,
                  });
                });
              }
            });
          }
          if (loadedStocks.length > 0) {
            setStocks(loadedStocks);
          }
          
          // Store original data for change detection
          const originalData = {
            name: product.name || '',
            seo_friendly_name: product.seo_friendly_name || '',
            category: product.category || '',
            sub_category: product.sub_category || '',
            brand: product.brand || '',
            price: product.price || 0,
            old_price: product.old_price || 0,
            before_deal_price: product.before_deal_price || 0,
            description: product.description || '',
            meta_description: product.meta_description || '',
            meta_keywords: product.meta_keywords || '',
            deal: product.deal || false,
            trending: product.trending || false,
            best_seller: product.best_seller || false,
            featured: product.featured || false,
          };
          setOriginalFormData(originalData);
          // Colors and sizes data loaded separately above
        }
      }
    } catch (err) {
      console.error('Error loading product:', err);
      setError('Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleInputChange = (field: keyof ProductFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

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
      reader.onload = () => {
        setColors(prev =>
          prev.map(color =>
            color.id === colorId
              ? {
                ...color,
                images: [
                  ...color.images,
                  { id: Math.random().toString(36).substr(2, 9), file, preview: reader.result as string },
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

  const handleUpdateProduct = async () => {
    // Check if anything has changed
    if (!originalFormData || JSON.stringify(formData) === JSON.stringify(originalFormData)) {
      setSuccess('No changes to save.');
      setStep('colors');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('auth_token');
      
      // Build payload with only changed fields
      const changedFields: Partial<ProductFormData> = {};
      (Object.keys(formData) as Array<keyof ProductFormData>).forEach(key => {
        if (originalFormData && formData[key] !== originalFormData[key]) {
          changedFields[key] = formData[key] as never;
        }
      });

      const response = await fetch(`${API_BASE_URL}/shop/api/${productId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(changedFields),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update product');
      }

      setSuccess('Product updated! Now update colors.');
      setStep('colors');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateColors = async () => {
    if (colors.length === 0) {
      alert('Please add at least one color');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('auth_token');

      for (const color of colors) {
        // Only create new colors (those without numeric IDs from API)
        if (isNaN(Number(color.id))) {
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
          setCreatedColorIds(prev => ({ ...prev, [color.id]: colorData.id }));
        }

        // Upload images for this color
        for (const img of color.images) {
          if (img.file) {
            const formDataImg = new FormData();
            formDataImg.append('image', img.file);
            formDataImg.append('product', productId);
            formDataImg.append('color', isNaN(Number(color.id)) ? createdColorIds[color.id] || color.id : color.id);

            await fetch(`${API_BASE_URL}/shop/product-image/`, {
              method: 'POST',
              headers: { 'Authorization': `Token ${token}` },
              body: formDataImg,
            });
          }
        }
      }

      setSuccess('Colors updated! Now update sizes.');
      setStep('sizes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

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

  const handleUpdateSizes = async () => {
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
        if (isNaN(Number(size.id))) {
          const response = await fetch(`${API_BASE_URL}/shop/size/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`,
            },
            body: JSON.stringify({
              name: size.name,
              product: productId,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to create size ${size.name}: ${errorData.detail || 'Unknown error'}`);
          }

          const sizeData = await response.json();
          sizeIds[size.id] = sizeData.id;
        }
      }

      setCreatedSizeIds(sizeIds);
      setSuccess('Sizes updated! Now configure stock.');
      setStep('stock');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = (colorId: string, sizeId: string, quantity: number) => {
    const existingStock = stocks.find(s => s.colorId === colorId && s.sizeId === sizeId);
    
    if (existingStock) {
      setStocks(prev =>
        prev.map(s =>
          s.id === existingStock.id ? { ...s, quantity } : s
        )
      );
    } else {
      setStocks(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        colorId,
        sizeId,
        quantity,
      }]);
    }
  };

  const handleUpdateStock = async () => {
    if (stocks.length === 0) {
      alert('Please configure at least one stock entry');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('auth_token');

      for (const stock of stocks) {
        const payload = {
          product: productId,
          size: isNaN(Number(stock.sizeId)) ? createdSizeIds[stock.sizeId] || stock.sizeId : stock.sizeId,
          color: isNaN(Number(stock.colorId)) ? createdColorIds[stock.colorId] || stock.colorId : stock.colorId,
          stock: stock.quantity,
        };

        if (isNaN(Number(stock.id))) {
          await fetch(`${API_BASE_URL}/shop/size-color-stock/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`,
            },
            body: JSON.stringify(payload),
          });
        } else {
          await fetch(`${API_BASE_URL}/shop/size-color-stock/${stock.id}/`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`,
            },
            body: JSON.stringify(payload),
          });
        }
      }

      setSuccess('Product updated successfully!');
      router.push('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AdminProtected>
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg text-gray-600">Loading product...</div>
        </div>
      </AdminProtected>
    );
  }

  return (
    <AdminProtected>
      <>
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

        <div className="w-full px-4 py-8 flex flex-col">
          <Link href="/admin/products" className="my-6 inline-block">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium">
              ← Back to Products
            </button>
          </Link>

          <div className="max-w-2xl mx-auto w-full pb-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
                {success}
              </div>
            )}

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {(['product', 'colors', 'sizes', 'stock'] as const).map((s, idx) => (
                  <div key={s} className="flex items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        step === s || (idx === 0 && step === 'product')
                          ? 'bg-pink-500 text-white'
                          : idx < (['product', 'colors', 'sizes', 'stock'] as const).indexOf(step)
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-700'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div className={`flex-1 h-1 ${
                      idx === (['product', 'colors', 'sizes', 'stock'] as const).length - 1
                        ? 'hidden'
                        : ''
                    }`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="max-w-2xl mx-auto">
            {step === 'product' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Product Details</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SEO Friendly Name</label>
                    <input
                      type="text"
                      value={formData.seo_friendly_name}
                      onChange={(e) => handleInputChange('seo_friendly_name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                      <select
                        value={formData.brand}
                        onChange={(e) => handleInputChange('brand', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="">Select Brand</option>
                        {brands.map(brand => (
                          <option key={brand.id} value={brand.id}>{brand.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Old Price</label>
                      <input
                        type="number"
                        value={formData.old_price}
                        onChange={(e) => handleInputChange('old_price', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Before Deal Price</label>
                      <input
                        type="number"
                        value={formData.before_deal_price}
                        onChange={(e) => handleInputChange('before_deal_price', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.deal}
                        onChange={(e) => handleInputChange('deal', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">Deal</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.trending}
                        onChange={(e) => handleInputChange('trending', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">Trending</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.best_seller}
                        onChange={(e) => handleInputChange('best_seller', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">Best Seller</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => handleInputChange('featured', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">Featured</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleUpdateProduct}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Saving...' : 'Next: Colors'}
                  </button>
                  <button
                    onClick={() => router.push('/admin/products')}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {step === 'colors' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Update Colors</h2>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newColor.name}
                      onChange={(e) => setNewColor(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Color name"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                    <input
                      type="color"
                      value={newColor.hex}
                      onChange={(e) => setNewColor(prev => ({ ...prev, hex: e.target.value }))}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={handleAddColor}
                      className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                    >
                      Add Color
                    </button>
                  </div>

                  {colors.map(color => (
                    <div key={color.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
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

                <div className="flex gap-4">
                  <button
                    onClick={handleUpdateColors}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Saving...' : 'Next: Sizes'}
                  </button>
                  <button
                    onClick={() => setStep('product')}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-300"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {step === 'sizes' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Update Sizes</h2>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
                  <p className="text-sm">Add all sizes for this product. You&apos;ll configure stock quantities by size and color next.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      placeholder="Size name (e.g., M, L, XL)"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddSize}
                      className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                    >
                      Add Size
                    </button>
                  </div>

                  {sizes.map(size => (
                    <div key={size.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
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

                <div className="flex gap-4">
                  <button
                    onClick={handleUpdateSizes}
                    disabled={loading}
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

            {step === 'stock' && (
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
                        {sizes.map(size => {
                          const existingStock = stocks.find(s => s.colorId === color.id && s.sizeId === size.id);
                          return (
                            <StockInputRow
                              key={`${color.id}-${size.id}`}
                              colorId={color.id}
                              sizeName={size.name}
                              sizeId={size.id}
                              onAdd={handleAddStock}
                              initialQuantity={existingStock?.quantity || ''}
                            />
                          );
                        })}
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
                    onClick={handleUpdateStock}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Saving...' : 'Complete Update'}
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
          </div>
        </div>
      </>
    </AdminProtected>
  );
}

function StockInputRow({
  colorId,
  sizeName,
  sizeId,
  onAdd,
  initialQuantity = '',
}: {
  colorId: string;
  sizeName: string;
  sizeId: string;
  onAdd: (colorId: string, sizeId: string, quantity: number) => void;
  initialQuantity?: number | '';
}) {
  const [quantity, setQuantity] = useState<number | ''>(initialQuantity);

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
