'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  // Disable Lenis for admin routes
  const isAdminRoute = pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdminRoute) return;

    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let frameId = 0;
    let resizeFrameId = 0;

    const scheduleResize = () => {
      if (resizeFrameId) return;

      resizeFrameId = window.requestAnimationFrame(() => {
        resizeFrameId = 0;
        lenis.resize();
      });
    };

    // Handle frame updates
    function raf(time: number) {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(raf);
    }
    frameId = window.requestAnimationFrame(raf);

    const resizeObserver = new ResizeObserver(scheduleResize);
    resizeObserver.observe(document.documentElement);

    window.addEventListener("resize", scheduleResize);
    window.addEventListener("load", scheduleResize);
    scheduleResize();

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      if (resizeFrameId) {
        window.cancelAnimationFrame(resizeFrameId);
      }

      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleResize);
      window.removeEventListener("load", scheduleResize);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isAdminRoute]);

  // Handle route transitions
  useEffect(() => {
    if (!lenisRef.current) return;

    // Immediately scroll to top on route change
    lenisRef.current.scrollTo(0, { immediate: true });

    // Resize Lenis after DOM updates
    const timer = setTimeout(() => {
      lenisRef.current?.resize();
    }, 80);

    return () => clearTimeout(timer);
  }, [pathname]);

  return <>{children}</>;
}
