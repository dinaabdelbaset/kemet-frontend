import { useEffect, useCallback, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Premium Lenis Smooth Scrolling - Based on Lenis official recommended settings
 * Ultra-smooth, butter-like scrolling with perfect GSAP integration
 */
export const useSmoothScroll = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.2,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Watch for DOM changes (lazy loaded images etc) so GSAP doesn't miscalculate height
    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
      lenis.resize(); // Crucial: Tell Lenis the height changed too
    });
    
    // Default root observer
    if (document.body) {
      resizeObserver.observe(document.body);
    }
    
    // Short delay then refresh all triggers as a fail-safe
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
      lenis.resize();
    }, 500);

    // Expose lenis to window for external access
    (window as any).__lenis = lenis;

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      lenis.destroy();
      lenisRef.current = null;
      (window as any).__lenis = null;
    };
  }, []);

  return lenisRef;
};

/**
 * Page transition animation with smooth fade
 */
export const usePageTransition = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    const main = document.querySelector("main");
    if (main) {
      gsap.fromTo(main,
        { opacity: 0, y: 30, filter: "blur(5px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "power3.out" }
      );
    }
  }, []);
};

/**
 * Scroll progress hook - returns scroll progress 0-1
 */
export const useScrollProgress = (callback?: (progress: number) => void) => {
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      callback?.(progress);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [callback]);
};
