import { useEffect, useRef, useState } from "react";

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Hide the default cursor globally
    document.documentElement.style.cursor = "none";
    document.body.style.cursor = "none";

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let animFrame: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);

      // Dot snaps instantly
      dot.style.transform = `translate(${mouseX - 5}px, ${mouseY - 5}px)`;
    };

    // Smooth ring animation loop
    const animate = () => {
      const ease = 0.12;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;
      const size = isHovering ? 52 : 36;
      ring.style.transform = `translate(${ringX - size / 2}px, ${ringY - size / 2}px)`;
      animFrame = requestAnimationFrame(animate);
    };
    animFrame = requestAnimationFrame(animate);

    // Hover detection on interactive elements
    const addHover = () => setIsHovering(true);
    const removeHover = () => setIsHovering(false);

    const interactables = document.querySelectorAll(
      "a, button, [role='button'], input, textarea, select, label, [data-cursor='hover']"
    );
    interactables.forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    // Click effect
    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    // Hide when leaves window
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);

    return () => {
      document.documentElement.style.cursor = "";
      document.body.style.cursor = "";
      cancelAnimationFrame(animFrame);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
      interactables.forEach((el) => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", removeHover);
      });
    };
  }, [isHovering]);

  // Don't render on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  const ringSize = isHovering ? 52 : 36;

  return (
    <>
      {/* Dot — instant */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[99999] pointer-events-none select-none"
        style={{
          width: 10,
          height: 10,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.2s",
          willChange: "transform",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            backgroundColor: isClicking ? "#fff" : "#EB662B",
            transform: isClicking ? "scale(0.6)" : "scale(1)",
            transition: "background-color 0.15s, transform 0.15s",
            boxShadow: `0 0 ${isClicking ? "8px" : "6px"} 2px rgba(235, 102, 43, 0.7)`,
          }}
        />
      </div>

      {/* Ring — trailing */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[99998] pointer-events-none select-none"
        style={{
          width: ringSize,
          height: ringSize,
          opacity: isVisible ? 1 : 0,
          transition: "width 0.3s cubic-bezier(0.25,0.46,0.45,0.94), height 0.3s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.2s",
          willChange: "transform",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: `1.5px solid ${isHovering ? "#EB662B" : "rgba(235, 102, 43, 0.55)"}`,
            backgroundColor: isHovering ? "rgba(235, 102, 43, 0.08)" : "transparent",
            transform: isClicking ? "scale(0.85)" : "scale(1)",
            transition: "border-color 0.3s, background-color 0.3s, transform 0.15s",
            boxShadow: isHovering ? "0 0 16px 2px rgba(235,102,43,0.15)" : "none",
          }}
        />
      </div>
    </>
  );
};

export default CustomCursor;
