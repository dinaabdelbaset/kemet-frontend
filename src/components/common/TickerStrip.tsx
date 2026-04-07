import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TickerStripProps {
  items: string[];
  variant?: "light" | "dark" | "gradient";
  speed?: "fast" | "normal" | "slow";
  reverse?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  separator?: "dot" | "star" | "diamond" | "slash" | "arrow";
  className?: string;
  scrollSpeed?: boolean; // speed up/slow down based on scroll velocity
}

const separators = {
  dot: "·",
  star: "✦",
  diamond: "◆",
  slash: "/",
  arrow: "→",
};

const sizeClasses = {
  sm: "text-xs md:text-sm py-2",
  md: "text-sm md:text-base py-3",
  lg: "text-base md:text-xl py-4",
  xl: "text-xl md:text-3xl py-5",
};

const TickerStrip = ({
  items,
  variant = "light",
  speed = "normal",
  reverse = false,
  size = "md",
  separator = "dot",
  className = "",
  scrollSpeed = false,
}: TickerStripProps) => {
  const stripRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll-speed effect: changes animation speed based on scroll velocity
  useEffect(() => {
    if (!scrollSpeed || !contentRef.current || !stripRef.current) return;

    gsap.to(contentRef.current, {
      x: reverse ? "50%" : "-50%",
      ease: "none",
      scrollTrigger: {
        trigger: stripRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  }, [scrollSpeed, reverse]);

  const variantClasses = {
    light: "bg-white border-y border-gray-100",
    dark: "bg-[#05073C] border-y border-white/5",
    gradient: "bg-gradient-to-r from-[#05073C] via-[#1A365D] to-[#05073C] border-y border-[#D4AF37]/10",
  };

  const textClasses = {
    light: "text-gray-800",
    dark: "text-white/80",
    gradient: "text-white/90",
  };

  const sepClasses = {
    light: "text-[#D4AF37]/40",
    dark: "text-[#D4AF37]/50",
    gradient: "text-[#D4AF37]/60",
  };

  const darkClass = variant !== "light" ? "ticker-strip--dark" : "";
  const speedClass = speed === "fast" ? "ticker-content--fast" : speed === "slow" ? "ticker-content--slow" : "";
  const reverseClass = reverse ? "ticker-content--reverse" : "";

  // Duplicate items for seamless loop
  const renderItems = [...items, ...items];

  const content = renderItems.map((item, i) => (
    <span key={i} className="flex items-center gap-4 md:gap-8 shrink-0 px-4 md:px-6">
      <span className={`font-semibold tracking-wide uppercase ${textClasses[variant]}`}>
        {item}
      </span>
      <span className={`text-lg ${sepClasses[variant]}`}>
        {separators[separator]}
      </span>
    </span>
  ));

  return (
    <div
      ref={stripRef}
      className={`ticker-strip ${darkClass} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      style={{ "--ticker-bg": variant === "light" ? "#fff" : "#05073C" } as any}
    >
      <div
        ref={contentRef}
        className={`ticker-content ${speedClass} ${reverseClass} ${scrollSpeed ? '!animation-none' : ''}`}
        style={scrollSpeed ? { animation: "none" } : undefined}
      >
        {content}
      </div>
      {/* Duplicate for seamless CSS animation */}
      {!scrollSpeed && (
        <div className={`ticker-content ${speedClass} ${reverseClass}`} aria-hidden>
          {content}
        </div>
      )}
    </div>
  );
};

export default TickerStrip;
