import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Button from "../Ui/Button";
import { useEffect, useState, useRef } from "react";
import { getHeroSlides } from "../../api/contentService";
import Image from "../Ui/Image";
import gsap from "gsap";

import Magnetic from "../common/Magnetic";

const HeroSection = () => {
  const [heroSlidesData, setHeroSlidesData] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  const NextImage = () => {
    if (currentIndex === heroSlidesData.length - 1) return setCurrentIndex(0);
    setCurrentIndex((prev) => prev + 1);
  };

  const PrevImage = () => {
    if (currentIndex === 0) return setCurrentIndex(heroSlidesData.length - 1);
    setCurrentIndex((prev) => prev - 1);
  };

  // ✨ GSAP Text Animation on mount
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    // Split title into words to safely animate Arabic text without breaking cursive characters
    if (titleRef.current) {
      const text = titleRef.current.textContent?.trim() || "";
      titleRef.current.innerHTML = text.split(" ").map(word =>
        `<span class="inline-block gsap-hero-word" style="transform: translateY(120%) rotate(10deg); opacity: 0">${word}</span>`
      ).join(" ");

      const words = titleRef.current.querySelectorAll(".gsap-hero-word");
      tl.to(words, {
        y: "0%",
        rotation: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "back.out(2)",
      });
    }

    // Description fades up
    if (descRef.current) {
      gsap.set(descRef.current, { opacity: 0, y: 30, filter: "blur(10px)" });
      tl.to(descRef.current, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power3.out",
      }, "-=0.3");
    }

    // CTA bounces in
    if (ctaRef.current) {
      gsap.set(ctaRef.current, { opacity: 0, y: 40, scale: 0.8 });
      tl.to(ctaRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "back.out(2)",
      }, "-=0.3");
    }

    // Scroll indicator
    if (heroRef.current) {
      const indicator = heroRef.current.querySelector("[data-scroll-indicator]");
      if (indicator) {
        gsap.fromTo(indicator,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.5, delay: 2 }
        );
        gsap.to(indicator, {
          y: 10,
          duration: 1.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 2.5,
        });
      }
    }
  }, []);

  // Fetch hero slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await getHeroSlides();
        if (Array.isArray(data) && data.length > 0) setHeroSlidesData(data);
      } catch (error) {
        console.error('Error fetching hero slides:', error);
      }
    };
    fetchSlides();
  }, []);

  // Slide change smooth transition
  useEffect(() => {
    if (!heroSlidesData.length) return;
    const currentSlide = heroSlidesData[currentIndex];
    if (currentSlide.type !== "video") {
      const timer = setTimeout(() => { NextImage(); }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  const slides = heroSlidesData.map((item, index) => {
    const isActive = index === currentIndex;
    return (
      <div key={index} className="w-full h-full shrink-0 relative">
        {item.type === "video" ? (
          <video
            src={item.src}
            className="w-full h-full object-cover"
            autoPlay={isActive}
            muted
            playsInline
            onEnded={NextImage}
            preload={isActive ? "auto" : "none"}
          />
        ) : (
          <Image src={item.src} alt={item.alt || ""} className="w-full h-full object-cover" eager={index === 0} />
        )}
      </div>
    );
  });

  return (
    <section ref={heroRef} className="relative w-full h-[90vh] md:rounded-2xl overflow-hidden">
      {/* Slider */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="flex h-full transition-transform duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)]" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {slides}
        </div>
      </div>

      {/* Cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent z-5" />

      {/* Left vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/15 to-transparent z-5" />

      {/* Film grain */}
      <div className="absolute inset-0 z-6 opacity-[0.04] pointer-events-none mix-blend-overlay" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {heroSlidesData.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`rounded-full transition-all duration-700 ${idx === currentIndex
              ? "w-10 h-1.5 bg-[#D4AF37]"
              : "w-4 h-1.5 bg-white/30 hover:bg-white/50"
              }`}
          />
        ))}
      </div>

      {/* Arrows */}
      <div className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30">
        <Magnetic strength={0.4}>
          <Button onClick={PrevImage} backgroundColor="" className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#D4AF37]/30 active:scale-90 transition-all duration-300 border border-white/15">
            <FaArrowLeft className="text-sm pointer-events-none" />
          </Button>
        </Magnetic>
      </div>

      <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30">
        <Magnetic strength={0.4}>
          <Button backgroundColor="" onClick={NextImage} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#D4AF37]/30 active:scale-90 transition-all duration-300 border border-white/15">
            <FaArrowRight className="text-sm pointer-events-none" />
          </Button>
        </Magnetic>
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6" dir="rtl">
        <h1 ref={titleRef} className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
          اكتشف عالماً من السعادة
        </h1>

        <p ref={descRef} className="text-white/80 mt-5 max-w-lg sm:max-w-xl text-base sm:text-lg leading-relaxed font-light">
          من الرحلات المحلية إلى المغامرات البعيدة، اكتشف رحلات مصممة خصيصاً لك.
        </p>

        <Magnetic strength={0.2} className="mt-10">
          <button
            ref={ctaRef}
            onClick={() => document.getElementById('travel-packages')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-4 bg-white/95 backdrop-blur px-6 py-3.5 rounded-full shadow-lg border-2 border-transparent transition-all duration-500 hover:-translate-y-2 hover:border-[#D4AF37] hover:shadow-[0_20px_40px_rgba(212,175,55,0.4)] cursor-pointer group"
          >
            <span className="text-sm font-bold text-[#D4AF37] tracking-wider pointer-events-none">✦ استكشف الآن</span>
            <span className="h-5 w-px bg-gray-300 pointer-events-none" />
            <span className="text-sm text-gray-700 font-medium group-hover:text-[#1A365D] transition-colors pointer-events-none">
              الوجهات والتجارب المتاحة
            </span>
          </button>
        </Magnetic>
      </div>

      {/* Scroll indicator */}
      <div data-scroll-indicator className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 opacity-0">
        <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-medium">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-[#D4AF37]" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
