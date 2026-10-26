'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackMetaEvent } from '@/lib/meta';

export function MetaPixelPageView() {
  const pathname = usePathname();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    if (pathname.startsWith('/admin')) return;

    trackMetaEvent('PageView', {}, { server: false });
  }, [pathname]);

  return null;
}
