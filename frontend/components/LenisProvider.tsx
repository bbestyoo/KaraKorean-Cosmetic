'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Disable Lenis for admin routes
  const isAdminRoute = pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdminRoute) return;

    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      smoothWheel: true,
    });

    const onLenisScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on('scroll', onLenisScroll);

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value as number, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
          right: window.innerWidth,
          bottom: window.innerHeight,
          x: 0,
          y: 0,
          toJSON() {
            return {};
          },
        };
      },
      pinType: document.body.style.transform ? 'transform' : 'fixed',
    });

    // Handle frame updates
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Handle Resize (Critical for height changes)
    const resizeObserver = new ResizeObserver(() => {
        lenis.resize();
        ScrollTrigger.refresh();
    });
    resizeObserver.observe(document.body);

    return () => {
      lenis.off('scroll', onLenisScroll);
      lenis.destroy();
      resizeObserver.disconnect();
      ScrollTrigger.scrollerProxy(document.documentElement);
      ScrollTrigger.refresh();
    };
  }, [isAdminRoute]);

  return <>{children}</>;
}
