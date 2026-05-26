"use client";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { RevealOnScroll } from "./RevealOnScroll";
import useEmblaCarousel from "embla-carousel-react";
import { useWishlist } from "@/context/WishlistContext";

const products = [
  {
    badge: "CLINICALLY PROVEN",
    name: "Radiance™ Renewal Serum",
    category: "SERUM",
    price: "$89",
    oldPrice: "$100",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop",
  },
  {
    badge: "NEW LAUNCH",
    name: "Gentle Cleansing Balm",
    category: "CLEANSERS",
    price: "$45",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=600&auto=format&fit=crop",
  },
  {
    badge: "AWARD WINNER",
    name: "Peptide™ Recovery Cream",
    category: "MOISTURIZERS",
    price: "$125",
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=600&auto=format&fit=crop",
  },
  {
    badge: "RECOMMENDED",
    name: "Brightening™ Eye Complex",
    category: "TREATMENTS",
    price: "$78",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop",
  },
  {
    badge: "BEST SELLER",
    name: "Hydrating Rose Mist",
    category: "TONER",
    price: "$35",
    image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=600&auto=format&fit=crop",
  },
  {
    badge: "LIMITED EDITION",
    name: "Luminous Night Oil",
    category: "FACE OIL",
    price: "$110",
    oldPrice: "$130",
    image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=600&auto=format&fit=crop",
  }
];

export default function FeaturedProducts() {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [emblaRef] = useEmblaCarousel({ align: "start", loop: true });

  return (
    <section className="w-full bg-white pt-10 sm:py-20 px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-5 sm:mb-12">
        <div>
          <RevealOnScroll direction="up">
            <p className="text-xs tracking-widest text-neutral-400 font-semibold mb-2">
              OUR BEST
            </p>
          </RevealOnScroll>
          <RevealOnScroll direction="up" delay={100}>
            <h2 className="text-3xl md:text-6xl font-serif text-[#0f3b2b] tracking-tight">
              Featured Products
            </h2>
          </RevealOnScroll>
        </div>
        <RevealOnScroll direction="left" delay={200}>
          <button className="mt-2 md:mt-0 px-6 py-3 border border-neutral-300 text-xs font-bold tracking-widest text-neutral-800 hover:bg-neutral-900 hover:text-white transition-colors">
            VIEW ALL PRODUCTS
          </button>
        </RevealOnScroll>
      </div>

      <div className="overflow-hidden cursor-grab active:cursor-grabbing -mx-4 px-4 pb-8" ref={emblaRef}>
        <div className="flex -ml-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="flex-[0_0_80%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] min-w-0 pl-6"
            >
              <RevealOnScroll
                direction="up"
                delay={index * 150}
                className="h-full"
              >
                <div
                  className="relative bg-[#EBE7DD] rounded-t-lg pt-4 px-3 pb-5 sm:pt-6 sm:px-5 sm:pb-8 h-full flex flex-col group"
                  style={{
                    maskImage: "linear-gradient(to bottom, black calc(100% - 10px), transparent calc(100% - 10px)), radial-gradient(circle at 10px 100%, transparent 10px, black 10.5px)",
                    maskSize: "100% 100%, 20px 10px",
                    maskPosition: "top, bottom",
                    maskRepeat: "no-repeat, repeat-x",
                    WebkitMaskImage: "linear-gradient(to bottom, black calc(100% - 10px), transparent calc(100% - 10px)), radial-gradient(circle at 10px 100%, transparent 10px, black 10.5px)",
                    WebkitMaskSize: "100% 100%, 20px 10px",
                    WebkitMaskPosition: "top, bottom",
                    WebkitMaskRepeat: "no-repeat, repeat-x"
                  }}
                >
                  {/* Top Row: Badge & Heart */}
                  <div className="flex justify-between items-start z-10 relative">
                    <span className="bg-[#E9F3A4] text-neutral-900 text-[0.65rem] font-bold tracking-widest px-2 py-1 rounded">
                      {product.badge}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        const pId = `featured-${index}`;
                        const numericPrice = Number(product.price.replace('$', '')) || 0;
                        const numericOldPrice = product.oldPrice ? Number(product.oldPrice.replace('$', '')) : undefined;
                        toggleWishlist({
                          product_id: pId,
                          name: product.name,
                          price: numericPrice,
                          old_price: numericOldPrice,
                          image: product.image,
                          category_name: product.category,
                        });
                      }}
                      className="text-white hover:text-red-500 transition-colors"
                    >
                      <Heart
                        className={`w-6 cursor-pointer h-6 transition-colors ${isInWishlist(`featured-${index}`) ? 'fill-red-500 text-red-500' : 'fill-none text-white'
                          }`}
                      />
                    </button>
                  </div>

                  {/* Product Image */}
                  <div className="relative w-full aspect-square mt-2 mb-3 sm:mt-4 sm:mb-6">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      unoptimized
                      className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="mt-auto relative z-10">
                    <h3 className="font-semibold text-sm sm:text-lg text-neutral-900 mb-1 leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-[0.6rem] font-bold tracking-widest text-neutral-500 uppercase mb-2 sm:mb-4 border-b border-neutral-300 border-dashed pb-2 sm:pb-4">
                      {product.category}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base sm:text-xl font-medium text-neutral-900">
                          {product.price}
                        </span>
                        {product.oldPrice && (
                          <span className="text-xs text-neutral-400 line-through">
                            {product.oldPrice}
                          </span>
                        )}
                      </div>
                      <button className="bg-[#2D2B2A] text-white p-3 rounded-full hover:bg-black hover:scale-105 transition-all">
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
