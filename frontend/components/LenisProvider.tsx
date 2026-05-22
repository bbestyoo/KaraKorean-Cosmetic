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

    const handleResize = () => {
      lenis.resize();
    };

    // Handle frame updates
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    window.addEventListener("resize", handleResize);

    return () => {
      lenis.destroy();
      window.removeEventListener("resize", handleResize);
    };
  }, [isAdminRoute]);

  return <>{children}</>;
}
