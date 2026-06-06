'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

/**
 * SmoothScroll — Initializes Lenis for buttery smooth scrolling.
 * Exposes the instance on window.__lenis for useHeroAutoScroll.
 */
export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Expose for the auto-scroll hook
    window.__lenis = lenis;
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      window.__lenis = null;
      lenisRef.current = null;
    };
  }, []);

  return <div id="smooth-wrapper">{children}</div>;
}
