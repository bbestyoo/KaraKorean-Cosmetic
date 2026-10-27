'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { captureMetaBrowserIds, trackMetaEvent } from '@/lib/meta';

export function MetaPixelPageView() {
  const pathname = usePathname();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // Capture fbclid/_fbc as soon as an ad visitor lands, before they navigate
    // away from the URL that contains it.
    captureMetaBrowserIds();

    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    if (pathname.startsWith('/admin')) return;

    trackMetaEvent('PageView', {}, { server: false });
  }, [pathname]);

  return null;
}
