import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const destinations = [
  {
    image: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1600&q=85",
    city: "القاهرة",
    cityEn: "Cairo",
    tagline: "حيث يبدأ السحر",
    desc: "أهرامات الجيزة · أبو الهول · المتحف المصري",
    link: "/destinations",
  },
  {
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85",
    city: "الأقصر",
    cityEn: "Luxor",
    tagline: "مدينة الفراعنة",
    desc: "معبد الكرنك · وادي الملوك · معبد حتشبسوت",
    link: "/destinations",
  },
  {
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&q=85",
    city: "الغردقة",
    cityEn: "Hurghada",
    tagline: "لؤلؤة البحر الأحمر",
    desc: "غوص · سنوركل · شواطئ بكر",
    link: "/destinations",
  },
  {
    image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1600&q=85",
    city: "الصحراء",
    cityEn: "Sahara",
    tagline: "حيث تلتقي بالنجوم",
    desc: "صحراء سيوة · تخييم بدوي · ليالي رومانسية",
    link: "/destinations",
  },
];

const TravelerParallaxSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const travelerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !trackRef.current || !travelerRef.current) return;

    const totalSlides = destinations.length;

    const ctx = gsap.context(() => {
      // Pin the section while we scroll through all slides
      // pinType: "transform" is required for Lenis compatibility
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * (totalSlides - 1)}`,
          scrub: 1,
          pin: true,
        },
      });

      // Slide the horizontal track
      tl.to(trackRef.current, {
        x: () => `-${(totalSlides - 1) * 100}vw`,
        ease: "none",
      });

      // Traveler walks (translateY bob + walk feeling)
      tl.to(
        travelerRef.current,
        { x: "3vw", ease: "none" },
        0
      );

      // Each slide: parallax the background image deeper
      document.querySelectorAll(".slide-bg").forEach((bg, i) => {
        gsap.to(bg, {
          yPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: `${(i / totalSlides) * 100}% top`,
            end: `${((i + 1) / totalSlides) * 100}% top`,
            scrub: true,
          },
        });
      });

    }, containerRef);

    // Traveler walking bob
    gsap.to(travelerRef.current, {
      y: -6,
      repeat: -1,
      yoyo: true,
      duration: 0.5,
      ease: "sine.inOut",
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden will-change-transform"
    >
      {/* ── Horizontal slide track ── */}
      <div
        ref={trackRef}
        className="flex h-full"
        style={{ width: `${destinations.length * 100}vw` }}
      >
        {destinations.map((dest, i) => (
          <div
            key={i}
            className="relative h-full overflow-hidden"
            style={{ width: "100vw", flexShrink: 0 }}
          >
            {/* Parallax Background */}
            <div
              className="slide-bg absolute inset-0 scale-110"
              style={{
                backgroundImage: `url(${dest.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                willChange: "transform",
              }}
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

            {/* Slide number */}
            <div className="absolute top-8 right-8 text-white/25 text-7xl font-black select-none">
              0{i + 1}
            </div>

            {/* Destination info - bottom left */}
            <div className="absolute bottom-0 left-0 p-10 md:p-16 space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#EB662B] text-sm" />
                <span className="text-[#D4AF37] text-[11px] font-black uppercase tracking-[0.3em]">
                  {dest.cityEn}
                </span>
              </div>

              <h2 className="text-5xl md:text-7xl font-black text-white leading-none">
                {dest.city}
              </h2>

              <p className="text-white/70 text-xl font-medium italic">
                "{dest.tagline}"
              </p>

              <p className="text-white/50 text-sm mt-1">{dest.desc}</p>

              <Link
                to={dest.link}
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold hover:bg-[#EB662B] hover:border-[#EB662B] transition-all duration-300 group"
              >
                استكشف المزيد
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Progress dots */}
            <div className="absolute bottom-10 right-10 flex gap-2">
              {destinations.map((_, di) => (
                <div
                  key={di}
                  className={`rounded-full transition-all duration-300 ${
                    di === i
                      ? "w-6 h-2 bg-[#EB662B]"
                      : "w-2 h-2 bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Traveler silhouette walking across ── */}
      <div
        ref={travelerRef}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none z-20 select-none"
        style={{ filter: "drop-shadow(0 -10px 30px rgba(235,102,43,0.3))" }}
      >
        <img
          src="https://images.unsplash.com/photo-1489659639091-8b687bc4386e?w=200&h=500&fit=crop&crop=center"
          alt="Traveler"
          className="h-[300px] md:h-[380px] w-auto object-cover object-top"
          style={{
            maskImage: "linear-gradient(to top, black 60%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to top, black 60%, transparent 100%)",
          }}
        />
        {/* Glow under feet */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#EB662B]/30 blur-xl rounded-full" />
      </div>

      {/* ── Scroll hint ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 pointer-events-none">
        <span className="text-white/40 text-[10px] uppercase tracking-[0.25em] font-semibold">
          Scroll to explore
        </span>
        <div className="w-5 h-8 border border-white/25 rounded-full flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default TravelerParallaxSection;
