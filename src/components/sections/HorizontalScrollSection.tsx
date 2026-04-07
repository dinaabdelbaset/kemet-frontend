import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const featuredPlaces = [
  {
    title: "Pyramids of Giza",
    titleAr: "أهرامات الجيزة",
    image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2b00?w=800&h=600&fit=crop",
    rating: 4.9,
    location: "Cairo",
    link: "/destinations",
  },
  {
    title: "Red Sea Diving",
    titleAr: "غوص البحر الأحمر",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
    rating: 4.8,
    location: "Sharm El Sheikh",
    link: "/activities",
  },
  {
    title: "Valley of Kings",
    titleAr: "وادي الملوك",
    image: "https://images.unsplash.com/photo-1568322503122-d524cfa340ae?w=800&h=600&fit=crop",
    rating: 4.9,
    location: "Luxor",
    link: "/destinations",
  },
  {
    title: "Siwa Oasis",
    titleAr: "واحة سيوا",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&h=600&fit=crop",
    rating: 4.7,
    location: "Siwa",
    link: "/destinations",
  },
  {
    title: "Alexandria Corniche",
    titleAr: "كورنيش الإسكندرية",
    image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800&h=600&fit=crop",
    rating: 4.6,
    location: "Alexandria",
    link: "/destinations",
  },
];

const HorizontalScrollSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !triggerRef.current) return;

    const cards = sectionRef.current.querySelectorAll("[data-hcard]");
    const totalWidth = sectionRef.current.scrollWidth - window.innerWidth;

    // Horizontal scroll animation — pinType: "transform" for Lenis compatibility
    const scrollTween = gsap.to(sectionRef.current, {
      x: -totalWidth,
      ease: "none",
      scrollTrigger: {
        trigger: triggerRef.current,
        start: "top top",
        end: `+=${totalWidth}`,
        scrub: 1,
        pin: true,
      },
    });

    // Parallax on each card image
    cards.forEach((card) => {
      const img = card.querySelector("img");
      if (img) {
        gsap.to(img, {
          scale: 1.15,
          ease: "none",
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top top",
            end: `+=${totalWidth}`,
            scrub: 1,
          },
        });
      }
    });

    // Heading animation
    if (headingRef.current) {
      gsap.fromTo(headingRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1,
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    return () => {
      scrollTween.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div ref={triggerRef} className="relative overflow-hidden bg-[#fcfbf9]">
      {/* Section Header */}
      <div ref={headingRef} className="absolute top-8 left-0 w-full z-20 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[3px] w-8 bg-gradient-to-r from-[#D4AF37] to-[#EB662B] rounded-full" />
              <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.2em]">Featured</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-[#05073C]">
              أماكن لا تُنسى
            </h2>
          </div>
          <Link to="/destinations" className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#05073C] text-white text-sm font-bold hover:bg-[#D4AF37] hover:text-[#05073C] transition-all duration-300">
            عرض الكل →
          </Link>
        </div>
      </div>

      {/* Horizontal Track */}
      <div
        ref={sectionRef}
        className="flex gap-8 px-8 pt-28 pb-12 h-screen items-center will-change-transform"
        style={{ width: `${featuredPlaces.length * 420 + 200}px` }}
      >
        {featuredPlaces.map((place, idx) => (
          <Link
            key={idx}
            to={place.link}
            data-hcard
            className="flex-shrink-0 w-[380px] h-[500px] rounded-3xl overflow-hidden relative group cursor-pointer"
          >
            {/* Image */}
            <img
              src={place.image}
              alt={place.title}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Rating badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold border border-white/20">
              <FaStar className="text-[#D4AF37]" />
              {place.rating}
            </div>

            {/* Card number */}
            <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-[#D4AF37]/20 backdrop-blur-md flex items-center justify-center text-[#D4AF37] font-black text-sm border border-[#D4AF37]/30">
              {String(idx + 1).padStart(2, '0')}
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <p className="text-white/50 text-xs font-medium flex items-center gap-1 mb-2">
                <FaMapMarkerAlt className="text-[8px]" />
                {place.location}
              </p>
              <h3 className="text-white text-xl font-bold mb-1">{place.titleAr}</h3>
              <p className="text-white/60 text-sm">{place.title}</p>

              {/* Hover reveal line */}
              <div className="mt-4 h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-[#D4AF37] to-[#EB662B] transition-all duration-700 rounded-full" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HorizontalScrollSection;
