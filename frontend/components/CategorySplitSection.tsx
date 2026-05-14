"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CategorySplitSection() {
  return (
    <section className="relative flex flex-col md:flex-row h-screen min-h-[600px] overflow-hidden">
      {/* Mothers Side */}
      <div className="group relative flex-1 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out will-change-transform group-hover:scale-105"
          style={{ backgroundImage: "url('/images/mom5.png')" }}
        />
        <div className="absolute inset-0 bg-black/30 transition-colors duration-500 group-hover:bg-black/20" />
        
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center">
          <div className="transform transition-all duration-500 translate-y-4 opacity-90 group-hover:translate-y-0 group-hover:opacity-100">
            <h2 className="font-playfair text-4xl sm:text-5xl md:text-6xl text-white mb-6 drop-shadow-lg">
              Mothers
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-sm mx-auto font-light leading-relaxed">
              Timeless elegance and comfort for your journey.
            </p>
            <Link 
              href="/shop?category=Mothers"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/40 text-white uppercase tracking-widest text-sm font-semibold transition-all duration-300 hover:bg-white hover:text-black hover:border-white group-active:scale-95"
            >
              Shop Collection
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Babies Side */}
      <div className="group relative flex-1 overflow-hidden border-t md:border-t-0 md:border-l border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out will-change-transform group-hover:scale-105"
          style={{ backgroundImage: "url('/images/baby.png')" }}
        />
        <div className="absolute inset-0 bg-black/30 transition-colors duration-500 group-hover:bg-black/20" />
        
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center">
          <div className="transform transition-all duration-500 translate-y-4 opacity-90 group-hover:translate-y-0 group-hover:opacity-100">
            <h2 className="font-playfair text-4xl sm:text-5xl md:text-6xl text-white mb-6 drop-shadow-lg">
              Newborns
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-sm mx-auto font-light leading-relaxed">
              Purest essentials for their first moments.
            </p>
            <Link 
              href="/shop?category=Newborns"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/40 text-white uppercase tracking-widest text-sm font-semibold transition-all duration-300 hover:bg-white hover:text-black hover:border-white group-active:scale-95"
            >
             Shop Essentials
             <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
