"use client";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RevealOnScroll } from "./RevealOnScroll";
import useEmblaCarousel from "embla-carousel-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { useProductAPI } from "@/hooks/useProductAPI";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');
}

const API_ORIGIN = API_BASE_URL.replace(/\/shop\/?$/, '');

function resolveImageUrl(image?: string | null) {
  if (!image) return '/images/placeholder.png';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  const normalizedPath = image.startsWith('/') ? image : `/${image}`;
  return new URL(normalizedPath, API_ORIGIN).toString();
}

function normalizeProduct(product: any) {
  const images = Array.isArray(product.images)
    ? product.images.map((img: any) => ({ image: resolveImageUrl(img.image ?? img) }))
    : product.images
      ? [{ image: resolveImageUrl(product.images) }]
      : product.image
        ? [{ image: resolveImageUrl(product.image) }]
        : [];

  return {
    product_id: product.product_id ?? String(product.id ?? product.pk ?? ''),
    badge: product.badge || (product.featured ? 'FEATURED' : ''),
    name: product.name ?? product.title ?? 'Product',
    category: product.category_name ?? product.category ?? 'Uncategorized',
    price: typeof product.price === 'number' ? product.price : Number(String(product.price ?? 0)),
    old_price: product.old_price !== undefined ? (typeof product.old_price === 'number' ? product.old_price : Number(String(product.old_price))) : undefined,
    images,
  };
}

export default function FeaturedProducts() {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addItem } = useCart();
  const [emblaRef] = useEmblaCarousel({ align: "start", loop: true });
  const { getProducts } = useProductAPI();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getProducts(1, { featured: true, page_size: 6 });
        const items = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
        const normalized = items.map(normalizeProduct);
        if (mounted) setProducts(normalized);
      } catch (err) {
        console.error('Failed to load featured products', err);
      }
    })();
    return () => { mounted = false; };
  }, [getProducts]);

  return (
    <section className="w-full bg-white  px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-5 sm:mb-12">
        <div>
          <RevealOnScroll direction="up">
            <p className="text-xs tracking-widest text-neutral-400 font-semibold mb-2">OUR BEST</p>
          </RevealOnScroll>
          <RevealOnScroll direction="up" delay={100}>
            <h2 className="text-3xl md:text-6xl font-serif text-[#0f3b2b] tracking-tight">Featured Products</h2>
          </RevealOnScroll>
        </div>
        <RevealOnScroll direction="left" delay={200}>
          <Link href="/products?featured=true" className="mt-2 md:mt-0 px-6 py-3 border border-neutral-300 text-xs font-bold tracking-widest text-neutral-800 hover:bg-[#0f3b2b] cursor-pointer hover:text-white transition-colors inline-block text-center">VIEW ALL PRODUCTS</Link>
        </RevealOnScroll>
      </div>

      <div className="overflow-hidden cursor-grab active:cursor-grabbing -mx-4 px-4 pb-8" ref={emblaRef}>
        <div className="flex -ml-6">
          {products.map((product, index) => (
            <div key={product.product_id || index} className="flex-[0_0_80%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] min-w-0 pl-6">
              <RevealOnScroll direction="up" delay={index * 150} className="h-full">
                <Link href={`/products/${product.product_id}`} className="block">
                  <div
                    className="relative bg-white rounded-t-lg pt-4 px-3 pb-5 sm:pt-6 sm:px-5 sm:pb-8 h-full flex flex-col group"
                  // style={{
                  //   maskImage: "linear-gradient(to bottom, black calc(100% - 10px), transparent calc(100% - 10px)), radial-gradient(circle at 10px 100%, transparent 10px, black 10.5px)",
                  //   maskSize: "100% 100%, 20px 10px",
                  //   maskPosition: "top, bottom",
                  //   maskRepeat: "no-repeat, repeat-x",
                  //   WebkitMaskImage: "linear-gradient(to bottom, black calc(100% - 10px), transparent calc(100% - 10px)), radial-gradient(circle at 10px 100%, transparent 10px, black 10.5px)",
                  //   WebkitMaskSize: "100% 100%, 20px 10px",
                  //   WebkitMaskPosition: "top, bottom",
                  //   WebkitMaskRepeat: "no-repeat, repeat-x"
                  // }}
                  >
                    <div className="flex justify-between items-start z-10 relative">
                      <span className="bg-[#E9F3A4] text-neutral-900 text-[0.65rem] font-bold tracking-widest px-2 py-1 rounded">{product.badge}</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const pId = product.product_id || `featured-${index}`;
                          const numericPrice = typeof product.price === 'number' ? product.price : Number(String(product.price).replace(/[^\d.]/g, '')) || 0;
                          const numericOldPrice = product.old_price ? (typeof product.old_price === 'number' ? product.old_price : Number(String(product.old_price).replace(/[^\d.]/g, ''))) : undefined;
                          toggleWishlist({
                            product_id: pId,
                            name: product.name,
                            price: numericPrice,
                            old_price: numericOldPrice,
                            image: product.images?.[0]?.image,
                            category_name: product.category,
                          });
                        }}
                        className="text-white hover:text-red-500 transition-colors"
                        aria-label={`Toggle wishlist for ${product.name}`}
                      >
                        <Heart className={`w-6 cursor-pointer h-6 transition-colors ${isInWishlist(product.product_id || `featured-${index}`) ? 'fill-[#c9a46b] text-[#c9a46b]' : 'fill-none text-white hover:text-[#c9a46b]'} }`} />
                      </button>
                    </div>

                    <div className="relative w-full aspect-square mt-2 mb-3 sm:mt-4 sm:mb-6">
                      <Image
                        src={product.images?.[0]?.image || '/images/placeholder.png'}
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-contain bg-white mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="mt-auto relative z-10">
                      <h3 className="font-semibold text-sm sm:text-lg truncate text-neutral-900 mb-1 leading-tight">{product.name}</h3>
                      <p className="text-[0.8rem] font-bold tracking-widest text-[#ec7cfd] uppercase mb-2 sm:mb-4 border-b border-neutral-300 border-dashed pb-2 sm:pb-4">{product.category}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-base sm:text-xl font-medium text-neutral-900">Rs. {Number(product.price || 0).toLocaleString()}</span>
                          {product.old_price !== undefined && !Number.isNaN(product.old_price) && (
                            <span className="text-xl text-[#ec7cfd] line-through">Rs. {Number(product.old_price).toLocaleString()}</span>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addItem({
                              product_id: product.product_id || `featured-${index}`,
                              name: product.name,
                              price: Number(product.price) || 0,
                              size: 'Standard',
                              quantity: 1,
                              image: product.images?.[0]?.image || '/images/placeholder.png',
                            });
                          }}
                          className="bg-[#0f3b2b] text-white p-3 rounded-full hover:bg-black hover:scale-105 transition-all"
                          aria-label={`Add ${product.name} to cart`}
                        >
                          <ShoppingCart className="w-4 h-4 cursor-pointer" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </RevealOnScroll>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
