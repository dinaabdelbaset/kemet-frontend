import { useRef, useEffect } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

const Magnetic = ({ children, strength = 0.5, className = "" }: MagneticProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use querySelector to find the actual element to move inside the wrapper
    // We assume there's one main child element (like a button or link)
    const element = container.firstElementChild as HTMLElement;
    if (!element) return;

    const xTo = gsap.quickTo(element, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(element, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = container.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      xTo(x * strength);
      yTo(y * strength);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return (
    <div ref={containerRef} className={`inline-block ${className}`}>
      {children}
    </div>
  );
};

export default Magnetic;
