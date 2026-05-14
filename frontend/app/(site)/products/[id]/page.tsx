'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { ProductRecommendations } from '@/components/ProductRecommendations';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { CarouselApi } from "@/components/ui/carousel"

interface ProductImage {
  image: string;
  color: number | null;
  color_name: string | null;
  hex: string | null;
}

interface Rating {
  stats: {
    total_ratings: number;
    rating_dict: Record<number, number>;
    avg_rating: number;
  };
  data: Array<Record<string, unknown>>;
}

interface Variant {
  id: number;
  name: string;
  additional_price: number;
}

interface Size {
  id: number;
  name: string;
  price_adjustment: number;
  color_stocks: ColorStock[];
}

interface ColorStock {
  id: number;
  color_id: number | null;
  color_name: string;
  stock: number;
}

interface Color {
  id: number;
  name: string;
  hex: string | null;
}

interface Product {
  product_id: string;
  name: string;
  category_name: string;
  price: number;
  old_price: number | null;
  before_deal_price: number | null;
  stock: number;
  images: ProductImage[];
  ratings: Rating;
  variants: Variant[];
  sizes: Size[];
  colors: Color[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/shop';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const { addItem } = useCart();


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const resolvedParams = await params;
        const response = await fetch(`${API_BASE_URL}/api/${resolvedParams.id}/`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          if (data.images && data.images.length > 0) {
            setMainImage(data.images[0].image);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params]);

  useEffect(() => {
    if (!carouselApi) return;
    
    const handleSelect = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap());
    };

    carouselApi.on('select', handleSelect);
    
    return () => {
      carouselApi.off('select', handleSelect);
    };
  }, [carouselApi]);

  const handleThumbnailClick = (index: number) => {
    carouselApi?.scrollTo(index);
    if (product?.images[index]) {
      setMainImage(product.images[index].image);
    }
  };

  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName);
    
    // Find the first image with this color and scroll to it
    if (product?.images) {
      const colorImageIndex = product.images.findIndex(
        img => img.color_name === colorName
      );
      if (colorImageIndex !== -1) {
        handleThumbnailClick(colorImageIndex);
      }
    }
  };

  const getSizeAdjustment = () => {
    if (!selectedSize || !product?.sizes) return 0;
    const selectedSizeObj = product.sizes.find(s => s.name === selectedSize);
    return selectedSizeObj?.price_adjustment || 0;
  };

  const getStockForSizeColor = () => {
    if (!selectedSize || !selectedColor || !product?.sizes) return 0;
    
    const selectedSizeObj = product.sizes.find(s => s.name === selectedSize);
    if (!selectedSizeObj) return 0;
    
    const colorStock = selectedSizeObj.color_stocks.find(
      cs => cs.color_name === selectedColor
    );
    return colorStock?.stock || 0;
  };

  const getFinalPrice = () => {
    return product ? product.price + getSizeAdjustment() : 0;
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      setShowValidationErrors(true);
      return;
    }

    if (product && mainImage) {
      addItem({
        product_id: product.product_id,
        name: product.name,
        price: getFinalPrice(),
        size: selectedSize,
        color: selectedColor,
        quantity: quantity,
        image: mainImage,
      });
      
      // Track add to cart event in Google Analytics
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as Window & { gtag?: (event: string, action: string, data: Record<string, unknown>) => void }).gtag?.('event', 'add_to_cart', {
          currency: 'USD',
          value: getFinalPrice() * quantity,
          items: [
            {
              item_id: product.product_id,
              item_name: product.name,
              price: getFinalPrice(),
              quantity: quantity,
              item_category: product.category_name,
            }
          ]
        });
      }
      
      setSelectedColor(null);
      setSelectedSize(null);
      setQuantity(1);
      setShowValidationErrors(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse">
          <div className="h-96 w-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500 text-lg">Product not found</p>
      </div>
    );
  }

  const discount = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group cursor-pointer" onClick={(e) => {
              // Only open modal if clicking on image, not on buttons
              if ((e.target as HTMLElement).closest('button')) {
                return;
              }
              setIsModalOpen(true);
            }}>
              {mainImage && (
                <Carousel className='' setApi={setCarouselApi}>
                  <CarouselContent>
                    {product.images.map((img, idx) => (
                      <CarouselItem key={idx}>
                        <div className="relative w-full h-auto aspect-square flex items-center justify-center bg-gray-50">
                          <Image
                            src={img.image}
                            alt={`Product view ${idx + 1}`}
                            fill
                            className="object-contain group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
             
              )}
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  -{discount}%
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleThumbnailClick(idx)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    currentIndex === idx ? 'border-black' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={img.image}
                    alt={`Product view ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{product.category_name}</p>
              <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex gap-1">
                  {renderStars(product.ratings?.stats?.avg_rating || 0)}
                </div>
                <span className="text-sm text-gray-600">
                  {product.ratings?.stats?.total_ratings || 0} reviews
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-8">
                <div>
                  <span className="text-3xl font-bold text-gray-900">Rs. {getFinalPrice()}</span>
                  {/* {getSizeAdjustment() !== 0 && (
                    <span className="text-sm text-gray-600 ml-2">
                      {getSizeAdjustment() > 0 ? '+' : ''}Rs. {getSizeAdjustment()}
                    </span>
                  )} */}
                </div>
                {product.old_price && (
                  <span className="text-lg text-gray-500 line-through">Rs. {product.old_price}</span>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <label className="block text-sm font-semibold text-gray-900">
                      Select Color
                    </label>
                    {showValidationErrors && !selectedColor && (
                      <span className="text-xs text-red-500 font-medium">Please select a color</span>
                    )}
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {product.colors && product.colors.length > 0 ? (
                      product.colors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => handleColorSelect(color.name)}
                          className={`px-4 py-2 text-sm rounded-lg border-2 transition-all ${
                            selectedColor === color.name
                              ? 'border-black bg-black text-white'
                              : 'border-gray-300 text-gray-900 hover:border-gray-400'
                          }`}
                          title={color.hex || ''}
                        >
                          {color.name}
                        </button>
                      ))
                    ) : (
                      ['Black', 'White', 'Navy', 'Gray'].map((color) => (
                        <button
                          key={color}
                          onClick={() => handleColorSelect(color)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            selectedColor === color
                              ? 'border-black bg-black text-white'
                              : 'border-gray-300 text-gray-900 hover:border-gray-400'
                          }`}
                        >
                          {color}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <label className="block text-sm font-semibold text-gray-900">
                      Select Size
                    </label>
                    {showValidationErrors && !selectedSize && (
                      <span className="text-xs text-red-500 font-medium">Please select a size</span>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes && product.sizes.length > 0 ? (
                      product.sizes.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => setSelectedSize(size.name)}
                          className={`w-auto py-2 rounded-lg border-2 font-medium transition-all ${
                            selectedSize === size.name
                              ? 'border-black bg-black text-white'
                              : size.color_stocks?.some(cs => cs.stock > 0) === false
                              ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'border-gray-300 text-gray-900 hover:border-gray-400'
                          }`}
                          disabled={size.color_stocks?.some(cs => cs.stock > 0) === false}
                          title={size.price_adjustment !== 0 ? `${size.price_adjustment > 0 ? '+' : ''}Rs. ${size.price_adjustment}` : ''}
                        >
                          {size.name}
                        </button>
                      ))
                    ) : (
                      ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`py-3 rounded-lg border-2 font-medium transition-all ${
                            selectedSize === size
                              ? 'border-black bg-black text-white'
                              : 'border-gray-300 text-gray-900 hover:border-gray-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))
                    )}
                  </div>
                  {selectedSize && selectedColor && product.sizes && product.sizes.length > 0 && (
                    <div className="mt-3 p-2 text-sm text-gray-600">
                      {(() => {
                        const stock = getStockForSizeColor();
                        return stock !== undefined ? (
                          <>
                            In Stock: <span className="font-semibold text-gray-900">{stock}</span>
                          </>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center text-black hover:bg-gray-100 transition-colors"
                    >
                      −
                    </button>
                    <span className="text-lg font-semibold text-black w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 text-black rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 mt-4 pt-8 border-t-2 border-gray-200">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 rounded-lg font-semibold text-lg bg-black text-white hover:bg-gray-900 transition-all"
              >
                Add to Cart
              </button>
              <button className="w-full py-4 rounded-lg font-semibold text-lg border-2 border-gray-300 text-gray-900 hover:bg-gray-50 transition-colors">
                Wishlist
              </button>
            </div>

            <div className="pt-6 border-t border-gray-200 mt-8 space-y-3 text-sm text-gray-600">
              <p>✓ Free shipping on orders over Rs. 5000</p>
              <p>✓ 7-day return policy</p>
              <p>✓ 100% authentic products</p>
            </div>
          </div>
        </div>

        {product.ratings?.stats?.total_ratings > 0 && (
          <div className="mt-16 border-t-2 border-gray-200 pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-bold text-gray-900">
                    {product.ratings.stats.avg_rating.toFixed(1)}
                  </span>
                  <span className="text-gray-500">/5</span>
                </div>
                <div className="flex gap-1">
                  {renderStars(product.ratings.stats.avg_rating)}
                </div>
                <p className="text-gray-600">
                  Based on {product.ratings.stats.total_ratings} reviews
                </p>
              </div>

              <div className="md:col-span-2 space-y-3">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-8">{star}★</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 transition-all"
                        style={{
                          width: `${
                            product.ratings.stats.total_ratings > 0
                              ? (product.ratings.stats.rating_dict[star] /
                                  product.ratings.stats.total_ratings) *
                                100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">
                      {product.ratings.stats.rating_dict[star]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Product Recommendations Section */}
        <div className="mt-6 border-t-2 border-gray-200 pt-6">
          <ProductRecommendations productId={product.product_id} />
        </div>
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-2xl mt-8 aspect-square bg-white rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-white transition-colors z-50 p-2 rounded-lg hover:bg-gray"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
            
            <Carousel className='w-full h-full'>
              <CarouselContent>
                {product.images.map((img, idx) => (
                  <CarouselItem key={idx}>
                    <div className="relative w-full h-full aspect-square flex items-center justify-center bg-gray-50">
                      <Image
                        src={img.image}
                        alt={`Product view ${idx + 1}`}
                        fill
                        className="object-contain"
                        sizes="600px"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 bg-white" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
        </div>
      )}
    </main>
  );
}
