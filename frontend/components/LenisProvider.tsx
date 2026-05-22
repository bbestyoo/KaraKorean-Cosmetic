'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

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
    };
  }, [isAdminRoute, pathname]);

  return <>{children}</>;
}
