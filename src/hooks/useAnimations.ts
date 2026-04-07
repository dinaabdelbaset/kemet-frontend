import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ============ WORD-BY-WORD TEXT REVEAL ============
export const useWordReveal = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const text = el.textContent || "";
    
    // Split into words
    el.innerHTML = text.split(" ").map(word => 
      `<span class="inline-block overflow-hidden"><span class="inline-block gsap-word" style="transform: translateY(120%); opacity: 0">${word}</span></span>`
    ).join(" ");

    const words = el.querySelectorAll(".gsap-word");

    gsap.to(words, {
      y: "0%",
      opacity: 1,
      duration: 0.8,
      stagger: 0.06,
      ease: "power4.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  }, []);

  return ref;
};

// ============ CHARACTER-BY-CHARACTER REVEAL ============
export const useCharReveal = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const text = el.textContent || "";

    el.innerHTML = text.split("").map(char =>
      char === " "
        ? " "
        : `<span class="inline-block gsap-char" style="transform: translateY(100%) rotate(5deg); opacity: 0">${char}</span>`
    ).join("");

    const chars = el.querySelectorAll(".gsap-char");

    gsap.to(chars, {
      y: "0%",
      rotation: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.02,
      ease: "back.out(2)",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  }, []);

  return ref;
};

// ============ SCROLL REVEAL WITH STAGGER ============
export const useScrollReveal = (options?: {
  y?: number;
  x?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  scale?: number;
  once?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const children = el.querySelectorAll("[data-gsap]");
    const targets = children.length > 0 ? children : el;

    gsap.set(targets, {
      opacity: 0,
      y: options?.y ?? 60,
      x: options?.x ?? 0,
      scale: options?.scale ?? 1,
    });

    gsap.to(targets, {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      duration: options?.duration ?? 0.8,
      delay: options?.delay ?? 0,
      stagger: options?.stagger ?? 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: options?.once !== false ? "play none none none" : "play reverse play reverse",
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === el) st.kill();
      });
    };
  }, []);

  return ref;
};

// ============ SCRUB TEXT (SCROLL-LINKED OPACITY) ============
export const useScrubText = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const text = el.textContent || "";

    // Split into words with individual opacity control
    el.innerHTML = text.split(" ").map(word =>
      `<span class="inline-block gsap-scrub-word" style="opacity: 0.15">${word}</span>`
    ).join(" ");

    const words = el.querySelectorAll(".gsap-scrub-word");

    gsap.to(words, {
      opacity: 1,
      stagger: 0.1,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        end: "top 30%",
        scrub: 1,
      },
    });
  }, []);

  return ref;
};

// ============ PARALLAX ELEMENT ============
export const useParallax = (speed: number = 0.3) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      yPercent: speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === ref.current) st.kill();
      });
    };
  }, []);

  return ref;
};

// ============ SCALE ON SCROLL ============
export const useScaleOnScroll = (from: number = 0.8, to: number = 1) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.fromTo(ref.current,
      { scale: from, opacity: 0.5, borderRadius: "40px" },
      {
        scale: to,
        opacity: 1,
        borderRadius: "0px",
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "top 20%",
          scrub: 1,
        },
      }
    );
  }, []);

  return ref;
};

// ============ HORIZONTAL TEXT SLIDE ============
export const useHorizontalSlide = (direction: "left" | "right" = "left") => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      xPercent: direction === "left" ? -30 : 30,
      ease: "none",
      scrollTrigger: {
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.5,
      },
    });
  }, []);

  return ref;
};

// ============ COUNTER ANIMATION ============
export const useCounter = (target: number, duration: number = 2) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obj = { val: 0 };

    gsap.to(obj, {
      val: target,
      duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none none",
      },
      onUpdate: () => {
        el.textContent = Math.round(obj.val).toLocaleString();
      },
    });
  }, [target]);

  return ref;
};

// ============ MAGNETIC BUTTON ============
export const useMagnetic = (strength: number = 0.3) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.3, ease: "power2.out" });
    };

    const handleLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return ref;
};

// ============ IMAGE REVEAL (CLIP-PATH) ============
export const useImageReveal = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const img = el.querySelector("img, video");

    gsap.set(el, { clipPath: "inset(0 100% 0 0)" });
    if (img) gsap.set(img, { scale: 1.3 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    tl.to(el, { clipPath: "inset(0 0% 0 0)", duration: 1.2, ease: "power4.inOut" });
    if (img) tl.to(img, { scale: 1, duration: 1.4, ease: "power2.out" }, "-=0.6");
  }, []);

  return ref;
};

// ============ FLOATING ANIMATION ============
export const useFloat = (range: number = 15, duration: number = 3) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      y: range,
      duration,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  }, []);

  return ref;
};

// ============ STAGGER CARDS ============
export const useStaggerCards = (selector: string = "[data-card]") => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const cards = ref.current.querySelectorAll(selector);
    if (cards.length === 0) return;

    gsap.set(cards, { opacity: 0, y: 80, scale: 0.95, rotateX: 10 });

    gsap.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: "back.out(1.2)",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  }, []);

  return ref;
};
