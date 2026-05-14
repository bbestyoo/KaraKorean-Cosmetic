/**
 * Scroll Reveal Animation System
 * 
 * A performant, reusable IntersectionObserver-based animation system
 * that reveals elements with fade-in and slide-up animations as they
 * scroll into view. Respects prefers-reduced-motion for accessibility.
 * 
 * Usage:
 * 1. Import initRevealObserver() in your layout or root component
 * 2. Add data-reveal="true" and optional data-stagger="true" to elements
 * 3. CSS classes handle all visual transitions
 */

type RevealConfig = {
  threshold: number;
  rootMargin: string;
  reduceMotion: boolean;
};

let observerInstance: IntersectionObserver | null = null;
const config: RevealConfig = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
  reduceMotion: false,
};

/**
 * Initialize the reveal animation observer
 * Call this once in your root layout component
 */
export function initRevealObserver() {
  // Check if animations should be disabled
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  config.reduceMotion = prefersReducedMotion;

  // Destroy existing observer if present
  if (observerInstance) {
    observerInstance.disconnect();
  }

  // Create intersection observer
  observerInstance = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target as HTMLElement;

        // Skip if animations are disabled
        if (config.reduceMotion) {
          element.classList.add('reveal-visible');
          // Also add class to children for consistency
          element.querySelectorAll('[data-reveal-child]').forEach((child) => {
            child.classList.add('reveal-visible');
          });
          observerInstance?.unobserve(element);
          return;
        }

        // Add visible class to trigger animation
        element.classList.add('reveal-visible');

        // Handle staggered children
        if (element.dataset.stagger === 'true') {
          const children = element.querySelectorAll('[data-reveal-child]');
          children.forEach((child, index) => {
            const delay = index * 80; // 80ms stagger between children
            (child as HTMLElement).style.animationDelay = `${delay}ms`;
            // Add reveal-visible to trigger animation
            child.classList.add('reveal-visible');
          });
        }

        // Stop observing this element (animation runs once)
        observerInstance?.unobserve(element);
      }
    });
  }, {
    threshold: config.threshold,
    rootMargin: config.rootMargin,
  });

  // Observe all reveal elements
  document.querySelectorAll('[data-reveal="true"]').forEach((element) => {
    observerInstance?.observe(element);
  });

  // Listen for prefers-reduced-motion changes
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    config.reduceMotion = e.matches;
  });
}

/**
 * Manually observe an element (useful for dynamically added elements)
 */
export function observeElement(element: HTMLElement) {
  if (!observerInstance) {
    console.warn('RevealObserver not initialized. Call initRevealObserver() first.');
    return;
  }
  observerInstance.observe(element);
}

/**
 * Stop observing an element
 */
export function unobserveElement(element: HTMLElement) {
  observerInstance?.unobserve(element);
}

/**
 * Disconnect and cleanup observer
 */
export function destroyRevealObserver() {
  if (observerInstance) {
    observerInstance.disconnect();
    observerInstance = null;
  }
}
