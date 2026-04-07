import { useEffect, useRef, useState } from "react";

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Don't render on touch devices
  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  useEffect(() => {
    if (isTouch) return;

    // Hide native cursor globally
    document.documentElement.style.cursor = "none";

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0,
      mouseY = 0;
    let ringX = 0,
      ringY = 0;
    let animFrame: number;
    let hovering = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);
      // Dot snaps instantly
      dot.style.transform = `translate(${mouseX - 5}px, ${mouseY - 5}px)`;
    };

    // Smooth trailing ring loop
    const animate = () => {
      const ease = 0.1;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;
      const size = hovering ? 56 : 38;
      ring.style.transform = `translate(${ringX - size / 2}px, ${ringY - size / 2}px)`;
      animFrame = requestAnimationFrame(animate);
    };
    animFrame = requestAnimationFrame(animate);

    // Hover detection
    const addHover = () => {
      hovering = true;
      setIsHovering(true);
    };
    const removeHover = () => {
      hovering = false;
      setIsHovering(false);
    };

    const attachHover = () => {
      document
        .querySelectorAll(
          "a, button, [role='button'], input, textarea, select, label, .cursor-pointer"
        )
        .forEach((el) => {
          el.addEventListener("mouseenter", addHover);
          el.addEventListener("mouseleave", removeHover);
        });
    };
    attachHover();

    // Re-attach on route changes (MutationObserver)
    const observer = new MutationObserver(attachHover);
    observer.observe(document.body, { childList: true, subtree: true });

    // Click effect
    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    // Hide when out of window
    const onLeave = () => setIsVisible(false);
    const onEnter = () => setIsVisible(true);

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      document.documentElement.style.cursor = "";
      cancelAnimationFrame(animFrame);
      observer.disconnect();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [isTouch]);

  if (isTouch) return null;

  const ringSize = isHovering ? 56 : 38;

  return (
    <>
      {/* ── Inner Dot (snappy) ── */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none select-none z-[99999]"
        style={{
          width: 10,
          height: 10,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.25s",
          willChange: "transform",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: isClicking
              ? "#ffffff"
              : "radial-gradient(circle, #ff9a5c, #EB662B)",
            transform: isClicking ? "scale(0.5)" : isHovering ? "scale(1.4)" : "scale(1)",
            transition: "transform 0.18s cubic-bezier(0.34,1.56,0.64,1), background 0.15s",
            boxShadow: `0 0 10px 3px rgba(235,102,43,0.65)`,
          }}
        />
      </div>

      {/* ── Outer Ring (trailing) ── */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none select-none z-[99998]"
        style={{
          width: ringSize,
          height: ringSize,
          opacity: isVisible ? 1 : 0,
          transition:
            "width 0.35s cubic-bezier(0.25,0.46,0.45,0.94), height 0.35s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.25s",
          willChange: "transform",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: `1.5px solid ${isHovering ? "rgba(235,102,43,0.85)" : "rgba(235,102,43,0.45)"}`,
            backgroundColor: isHovering
              ? "rgba(235,102,43,0.07)"
              : "transparent",
            transform: isClicking ? "scale(0.8)" : "scale(1)",
            transition:
              "border-color 0.3s, background-color 0.3s, transform 0.18s",
            boxShadow: isHovering
              ? "0 0 18px 4px rgba(235,102,43,0.18), inset 0 0 10px rgba(235,102,43,0.08)"
              : "none",
          }}
        />
      </div>
    </>
  );
};

export default CustomCursor;
