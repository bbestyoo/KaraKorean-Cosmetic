import Image from "next/image";
import Link from "next/link";
import { RevealOnScroll } from "@/components/RevealOnScroll";

const cards = [

  {
    title: "AntiAging",
    subtitle: "Browse Products",
    image: "/images/model1.webp",
    link: "/shop/toner",
  },
  {
    title: "Pigmentation",
    subtitle: "Browse Products",
    image: "/images/model2.webp",
    link: "/shop/ampoule",
  },
  {
    title: "Acne Control",
    subtitle: "Browse Products",
    image: "/images/model3.webp",
    link: "/shop/essence",
  },
];

export default function BestSellers() {
  return (
    <section className="relative z-20 bg-[#f7f6f2] -mt-10 sm:mt-0 pt-0 md:pt-4">
      <div className=" w-full h-[130vh] md:h-screen  flex flex-col md:flex-row gap-3">
        {cards.map((card, index) => (
          <RevealOnScroll
            key={index}
            delay={index * 200}
            direction="up"
            className="flex-1 h-full block"
          >

            <Link
              href={(() => {
                const slug = (card.title || '').toString().replace(/\s+/g, '').toLowerCase();
                return `/products?usecase=${encodeURIComponent(slug)}`;
              })()}
              className="group relative w-full h-full overflow-hidden block"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain md:object-cover transition-all duration-700 ease-in-out grayscale group-hover:grayscale-0 group-hover:scale-110"
                />
              </div>

              {/* Overlay text */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-black/10 group-hover:bg-black/0 transition-colors duration-500">
                <h2 className="font-serif text-lg sm:text-3xl md:text-4xl lg:text-5xl text-white group-hover:text-[#0f3b2b] uppercase tracking-widest mb-4 drop-shadow-md transition-transform duration-500 group-hover:-translate-y-2">
                  {card.title}
                </h2>
                <p className="font-sans text-sm md:text-base text-white group-hover:text-[#0f3b2b] tracking-[0.25em] uppercase font-semibold drop-shadow-md opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  {card.subtitle}
                </p>
              </div>
            </Link>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}