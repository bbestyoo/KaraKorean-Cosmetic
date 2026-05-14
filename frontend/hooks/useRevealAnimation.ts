/**
 * useRevealAnimation Hook
 * 
 * A reusable React hook that adds reveal animation to components.
 * Works with SSR - safely handles ref attachment and observer setup.
 * 
 * Usage:
 * const ref = useRevealAnimation();
 * return <div ref={ref} data-stagger="true">...</div>
 */

import { useEffect, useRef } from 'react';
import { observeElement } from '@/lib/animations';

interface UseRevealOptions {
  stagger?: boolean;
  observe?: boolean; // Set to false to manually control observation
}

export function useRevealAnimation(options: UseRevealOptions = {}) {
  const { stagger = false, observe = true } = options;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !observe) return;

    // Set reveal attributes
    ref.current.setAttribute('data-reveal', 'true');
    if (stagger) {
      ref.current.setAttribute('data-stagger', 'true');
    }

    // Observe element
    observeElement(ref.current);
  }, [observe, stagger]);

  return ref;
}

/**
 * Lazy load an image with fade-in animation
 * 
 * Usage:
 * <img 
 *   src={src} 
 *   alt={alt}
 *   onLoad={(e) => onImageLoad(e)}
 *   data-reveal-image
 * />
 */
export function onImageLoad(event: React.SyntheticEvent<HTMLImageElement>) {
  const img = event.target as HTMLImageElement;
  img.classList.add('image-loaded');
}
