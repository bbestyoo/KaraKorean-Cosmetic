"use client";

import { useEffect, useState, type ReactNode } from "react";

export default function DeferredMount({
  children,
  delay = 1500,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const trigger = () => setMounted(true);

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(trigger, { timeout: 3000 });
    } else {
      timeoutId = window.setTimeout(trigger, delay);
    }

    return () => {
      if (idleId !== undefined) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [delay]);

  return mounted ? children : null;
}
