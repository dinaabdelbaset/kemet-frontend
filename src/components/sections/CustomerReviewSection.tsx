import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import Bullets from "../Ui/Bullets";
import Heading from "../Ui/Heading";
import Image from "../Ui/Image";
import SectionWrapper from "./SectionWrapper";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CustomerReviewSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLAnchorElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const authorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        toggleActions: "play none none none",
      },
    });

    // Avatar bounces in with scale
    if (avatarRef.current) {
      tl.fromTo(avatarRef.current,
        { scale: 0, rotateZ: -15, opacity: 0 },
        { scale: 1, rotateZ: 0, opacity: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" }
      );
    }

    // Quote fades in word-by-word
    if (quoteRef.current) {
      const text = quoteRef.current.textContent || "";
      quoteRef.current.innerHTML = text.split(" ").map(w =>
        `<span class="inline-block gsap-q-word" style="opacity: 0; transform: translateY(15px)">${w}</span>`
      ).join(" ");

      const words = quoteRef.current.querySelectorAll(".gsap-q-word");
      tl.to(words, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.04,
        ease: "power2.out",
      }, "-=0.3");
    }

    // Author slides up
    if (authorRef.current) {
      tl.fromTo(authorRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.2"
      );
    }
  }, []);

  return (
    <SectionWrapper className="relative py-24 overflow-hidden bg-orange-50/50 dark:bg-gray-900">
      <div ref={sectionRef} className="relative z-10 max-w-2xl mx-auto text-center px-4">
        <Heading title="Customer Reviews" />

        {/* Main avatar */}
        <Link ref={avatarRef} to="/reviews" className="relative w-24 h-24 mx-auto mb-6 block hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] transition-all duration-500 cursor-pointer rounded-full border-4 border-white hover:border-[#D4AF37] group">
          <span className="absolute -top-1 -left-1 w-8 h-8 bg-[#1A365D] text-[#D4AF37] border-2 border-white rounded-full flex items-center justify-center text-lg z-10 shadow-md group-hover:scale-110 transition-transform duration-500">
            "
          </span>
          <Image
            src="/images/home/customer-avatar.jpg"
            alt="user"
            className="w-full h-full rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Review */}
        <p className="text-[#EB662B] font-medium mb-4">Excellent Service!</p>

        <p ref={quoteRef} className="text-base leading-relaxed text-body mb-6">
          I had an amazing experience with this company. The service was
          top-notch, and the staff was incredibly friendly. I highly recommend
          them!
        </p>

        {/* Author */}
        <div ref={authorRef} className="mb-6">
          <p className="font-medium text-heading">Eslam Naser</p>
          <p className="text-sm text-gray-500">Traveler</p>
        </div>

        {/* Dots */}
        <div className="flex justify-center items-center gap-2">
          <Bullets />
          <Bullets />
          <Bullets />
          <Bullets />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default CustomerReviewSection;
