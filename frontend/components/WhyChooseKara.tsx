"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";

interface WhyChooseKaraProps {
  hideHeading?: boolean;
  isMobile?: boolean;
}

export default function WhyChooseKara({ hideHeading = false, isMobile = false }: WhyChooseKaraProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className={isMobile ? "w-full" : "flex flex-col w-full max-w-3xl xl:max-w-[65vw] mt-12 md:mt-0"}>
      {!hideHeading && (
        <div className="mb-4 pl-4 md:pl-0">
          <h2 className="text-[#0f3b2b] text-4xl sm:text-5xl lg:text-[4.5rem] font-bold leading-none tracking-tight uppercase font-sans-serif">
            Why Choose
            <br />
            <span className="text-[#a4659f] flex items-center gap-2">
              KARA?
              <Heart className="w-8 h-8 lg:w-10 lg:h-10 text-[#a4659f] fill-current" />
            </span>
          </h2>
        </div>
      )}

      <div className={`relative shadow-lg overflow-hidden w-full ${isMobile ? "rounded-none" : "sm:rounded-r-3xl"}`}>
        <div className="overflow-hidden z-10 relative" ref={emblaRef}>
          <div className="flex">
            {/* Slide 1 */}
            <div className={`flex-[0_0_100%] min-w-0 relative w-full ${isMobile ? "h-52 sm:h-64" : "h-56 sm:h-72 md:h-[350px] lg:h-[400px]"}`}>
              <Image
                src="/images/banner/1.jpeg"
                alt="Banner 1"
                fill
                priority
                className={`object-cover ${isMobile ? "rounded-none" : "rounded-xl sm:rounded-r-3xl"}`}
              />
            </div>

            {/* Slide 2 */}
            <div className={`flex-[0_0_100%] min-w-0 relative w-full ${isMobile ? "h-52 sm:h-64" : "h-56 sm:h-72 md:h-[350px] lg:h-[400px]"}`}>
              <Image
                src="/images/banner/2.jpeg"
                alt="Banner 2"
                fill
                className={`object-cover ${isMobile ? "rounded-none" : "rounded-xl sm:rounded-r-3xl"}`}
              />
            </div>

            {/* Slide 3 */}
            <div className={`flex-[0_0_100%] min-w-0 relative w-full ${isMobile ? "h-52 sm:h-64" : "h-56 sm:h-72 md:h-[350px] lg:h-[400px]"}`}>
              <Image
                src="/images/banner/3.jpeg"
                alt="Banner 3"
                fill
                className={`object-cover ${isMobile ? "rounded-none" : "rounded-xl sm:rounded-r-3xl"}`}
              />
            </div>

            {/* Slide 4 */}
            <div className={`flex-[0_0_100%] min-w-0 relative w-full ${isMobile ? "h-52 sm:h-64" : "h-56 sm:h-72 md:h-[350px] lg:h-[400px]"}`}>
              <Image
                src="/images/banner/4.jpeg"
                alt="Banner 4"
                fill
                className={`object-cover ${isMobile ? "rounded-none" : "rounded-xl sm:rounded-r-3xl"}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Controls (grouped on the left) */}
      <div className={`flex items-center justify-between mt-3 ${isMobile ? "px-4 hidden" : " flex px-4 md:px-0"}`}>
        <div className="flex gap-2">
          <button
            onClick={scrollPrev}
            className="p-1.5 border border-[#0f3b2b]/20 rounded-full text-[#0f3b2b] hover:bg-[#0f3b2b] hover:text-[#f7f6f2] hover:border-[#0f3b2b] transition-all duration-300 cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollNext}
            className="p-1.5 border border-[#0f3b2b]/20 rounded-full text-[#0f3b2b] hover:bg-[#0f3b2b] hover:text-[#f7f6f2] hover:border-[#0f3b2b] transition-all duration-300 cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
