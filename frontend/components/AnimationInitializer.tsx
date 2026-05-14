'use client';

import { useEffect } from 'react';
import { initRevealObserver } from '@/lib/animations';

export function AnimationInitializer() {
  useEffect(() => {
    // Initialize the scroll reveal observer on client side
    initRevealObserver();
  }, []);

  return null;
}
