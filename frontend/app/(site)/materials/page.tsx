'use client';

import Image from "next/image";
import { initRevealObserver } from "@/lib/animations";
import { useEffect } from "react";

const MATERIALS = [
  {
    name: "A-grade Malmal",
    description: "The epitome of breathability and grace. Our A-grade Malmal is a soft, airy woven fabric that feels like a gentle whisper against the skin. Historically cherished by royalty, it offers unmatched comfort for both mothers and newborns.",
    image: "/images/materials/malmal.png", // Placeholder - I will copy the generated image here
    benefits: ["Extremely breathable", "Gets softer with every wash", "Lightweight & airy"],
    theme: "bg-neutral-50"
  },
  {
    name: "Camric Cotton",
    description: "Structure meets softness. Camric cotton provides a smooth, crisp finish that retains its shape while being incredibly gentle. It's the perfect balance of durability and elegance for everyday essentials.",
    image: "/images/materials/camric.png",
    benefits: ["Smooth finish", "Durable weave", "Natural comfort"],
    theme: "bg-stone-50"
  },
  {
    name: "Mama Cotton",
    description: "Specifically curated for the tender needs of motherhood. This fabric mimics the warmth and safety of a mother's embrace. It is hypoallergenic, organic, and designed to soothe sensitive skin.",
    image: "/images/materials/mama_cotton.png",
    benefits: ["Hypoallergenic", "Ultra-soft touch", "Organic & safe"],
    theme: "bg-blue-50/30"
  },
  {
    name: "Cotton Flannel",
    description: "For those cozy, cooler days. Our cotton flannel is brushed to perfection to create a fuzzy, warm texture that locks in heat without overheating. It's the cozy layer your baby dreams of.",
    image: "/images/materials/flannel.png",
    benefits: ["Thermal retention", "Fuzzy texture", "Cozy comfort"],
    theme: "bg-orange-50/30"
  },
  {
    name: "Dhaka",
    description: "A vibrant tapestry of Nepali heritage. Handwoven with intricate geometric patterns, Dhaka is not just a fabric; it's a story of tradition. We use it to add a touch of culture and color to our modern designs.",
    image: "/images/materials/dhaka.png",
    benefits: ["Handwoven artistry", "Cultural heritage", "Unique patterns"],
    theme: "bg-red-50/20"
  },
  {
    name: "Courtois Cotton",
    description: "Refined elegance with a textured touch. Courtois cotton offers a subtle ribbing or texture that adds depth to the garment. It's robust yet sophisticated, perfect for outerwear and special occasions.",
    image: "/images/materials/courtois.png",
    benefits: ["Textured depth", "Premium feel", "Long-lasting"],
    theme: "bg-gray-50"
  }
];

export default function MaterialsPage() {
  useEffect(() => {
    initRevealObserver();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-purple-50 to-white opacity-50" />
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <span className="text-sm md:text-base font-bold uppercase tracking-[0.2em] text-neutral-500 page-load-fade-in block">
            Hand-Selected Perfection
          </span>
          <h1 className="text-5xl md:text-7xl font-playfair font-bold text-neutral-900 page-load-fade-in" style={{ animationDelay: '0.1s' }}>
            Our Premium Materials
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 font-light leading-relaxed max-w-2xl mx-auto page-load-fade-in" style={{ animationDelay: '0.2s' }}>
            We believe that true luxury lies in the touch. Every thread is chosen with intention, ensuring the purest embrace for you and your little one.
          </p>
        </div>
      </section>

      {/* Materials Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {MATERIALS.map((material) => (
            <div 
              key={material.name} 
              className={`group relative rounded-3xl overflow-hidden ${material.theme} shadow-sm hover:shadow-xl transition-all duration-500`}
              data-reveal="true"
            >
              <div className="aspect-[4/3] w-full relative overflow-hidden">
                <Image 
                  src={material.image}
                  alt={`${material.name} texture`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              </div>
              
              <div className="p-8 md:p-10 relative">
                <h3 className="text-3xl font-playfair font-bold text-neutral-900 mb-4">{material.name}</h3>
                <p className="text-neutral-600 leading-relaxed mb-8 font-light">
                  {material.description}
                </p>
                
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Benefits</h4>
                  <ul className="flex flex-wrap gap-3">
                    {material.benefits.map(benefit => (
                      <li key={benefit} className="px-3 py-1 bg-white/60 backdrop-blur-sm border border-neutral-200 rounded-full text-sm text-neutral-700">
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
