import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SplitTextRevealProps {
  text: string;
  type?: "chars" | "words" | "lines";
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  yOffset?: number;
}

const SplitTextReveal = ({
  text,
  type = "words",
  className = "",
  delay = 0,
  duration = 0.8,
  stagger = 0.03,
  yOffset = 100,
}: SplitTextRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let elements: NodeListOf<Element> | Element[] = [];

    if (type === "chars") {
      elements = containerRef.current.querySelectorAll(".gsap-split-char");
    } else if (type === "words") {
      elements = containerRef.current.querySelectorAll(".gsap-split-word");
    }

    if (elements.length === 0) return;

    // Reset initial state for ScrollTrigger
    gsap.set(elements, { y: `${yOffset}%`, rotationZ: 5, opacity: 0 });

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          gsap.to(elements, {
            y: "0%",
            rotationZ: 0,
            opacity: 1,
            duration: duration,
            stagger: stagger,
            ease: "power4.out",
            delay: delay,
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [type, delay, duration, stagger, yOffset]);

  const renderContent = () => {
    if (type === "chars") {
      return text.split("").map((char, index) => (
        <span key={index} className="inline-block overflow-hidden pb-1">
          <span className="inline-block gsap-split-char origin-bottom-left" style={{ transform: `translateY(${yOffset}%) rotate(5deg)`, opacity: 0 }}>
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ));
    } else if (type === "words") {
      return text.split(" ").map((word, index) => (
        <span key={index} className="inline-block overflow-hidden mr-2 pb-1">
          <span className="inline-block gsap-split-word origin-bottom-left" style={{ transform: `translateY(${yOffset}%) rotate(5deg)`, opacity: 0 }}>
            {word}
          </span>
        </span>
      ));
    }
    return text;
  };

  return (
    <div ref={containerRef} className={className}>
      {renderContent()}
    </div>
  );
};

export default SplitTextReveal;
