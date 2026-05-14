'use client';

import { useEffect, useRef } from 'react';

export function AnimationDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Log when elements are revealed
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const element = mutation.target as HTMLElement;
          if (element.classList.contains('reveal-visible')) {
            console.log('🎬 Animation triggered on:', element.textContent?.substring(0, 50));
          }
        }
      });
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, {
        subtree: true,
        attributes: true,
        attributeFilter: ['class'],
      });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-blue-100 border-2 border-blue-500 p-8 rounded-lg my-8 text-center"
    >
      <h3 className="text-xl font-bold mb-4">🎬 Animation Monitor Active</h3>
      <p className="text-sm text-gray-700">
        Scroll up and down to trigger animations. Check browser console for logs.
      </p>
    </div>
  );
}
