import Image from "next/image";
import Link from "next/link";
import { RevealOnScroll } from "@/components/RevealOnScroll";

const cards = [
  {
    title: "DESTINATION DRESSING",
    subtitle: "THE VACATION SHOP",
    image: "/images/model1.png",
    link: "/shop/toner",
  },
  {
    title: "SUMMER NIGHT LOUNGE & LINGERIE",
    subtitle: "NEW LINGERIE",
    image: "/images/model2.png",
    link: "/shop/ampoule",
  },
  {
    title: "STEP INTO SUMMER",
    subtitle: "NEW SHOES",
    image: "/images/model3.png",
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
                const parts = (card.link || '').split('/').filter(Boolean);
                const category = parts.length ? parts[parts.length - 1] : '';
                return `/products${category ? `?category=${encodeURIComponent(category)}` : ''}`;
              })()}
              className="group relative w-full h-full overflow-hidden block"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-contain md:object-cover transition-all duration-700 ease-in-out grayscale group-hover:grayscale-0 group-hover:scale-110"
                />
              </div>

              {/* Overlay text */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-black/10 group-hover:bg-black/0 transition-colors duration-500">
                <h2 className="font-serif text-lg sm:text-3xl md:text-4xl lg:text-5xl text-[#E85D8A] uppercase tracking-widest mb-4 drop-shadow-md transition-transform duration-500 group-hover:-translate-y-2">
                  {card.title}
                </h2>
                <p className="font-sans text-sm md:text-base text-[#E85D8A] tracking-[0.25em] uppercase font-semibold drop-shadow-md opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
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