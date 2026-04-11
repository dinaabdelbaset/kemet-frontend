import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import Button from "../Ui/Button";
import Image from "../Ui/Image";
import SectionWrapper from "./SectionWrapper";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PromoBanner = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Content slides from left
    if (contentRef.current) {
      const h2 = contentRef.current.querySelector("h2");
      if (h2) {
        gsap.fromTo(h2,
          { x: -80, opacity: 0, skewX: 5 },
          {
            x: 0, opacity: 1, skewX: 0, duration: 1, ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      const p = contentRef.current.querySelector("p");
      if (p) {
        gsap.fromTo(p,
          { x: -50, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      const btn = contentRef.current.querySelector("a");
      if (btn) {
        gsap.fromTo(btn,
          { y: 30, opacity: 0, scale: 0.9 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.6, delay: 0.4, ease: "back.out(2)",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }

    // Image reveal with clip-path
    if (imageRef.current) {
      gsap.fromTo(imageRef.current,
        { clipPath: "inset(0 100% 0 0)", scale: 1.1 },
        {
          clipPath: "inset(0 0% 0 0)", scale: 1,
          duration: 1.2, ease: "power4.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, []);

  return (
    <SectionWrapper>
      <div ref={sectionRef} className="grid grid-cols-1 lg:grid-cols-2 items-center">
        {/* Left content */}
        <div ref={contentRef} className="relative z-10 px-6 py-12 md:px-12 lg:py-16">
          <h2 className="capitalize text-3xl md:text-4xl font-bold text-[#05073C] dark:text-white leading-snug">
            Grab up to <span className="text-[#EB662B]"> 35% off</span> on your
            favorite Destination
          </h2>

          <p className="mt-4 text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-md">
            Limited time offer, don't miss the opportunity
          </p>

          <Link to="/checkout" state={{ title: "Special Destination Offer", price: 199, image: "/images/home/promo-banner.jpg" }}>
            <Button className="transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(212,175,55,0.4)] text-white px-11 py-4 mt-7 rounded-xl hover:bg-[#1A365D]">
              Book Now
            </Button>
          </Link>
        </div>

        {/* Right image with clip-path reveal */}
        <div ref={imageRef} className="relative w-full h-full overflow-hidden rounded-2xl group border-2 border-transparent transition-all duration-500 hover:border-[#D4AF37] hover:shadow-[0_15px_30px_rgba(212,175,55,0.25)]">
          <Image src="/images/home/promo-banner.jpg" alt="Promo image" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default PromoBanner;
