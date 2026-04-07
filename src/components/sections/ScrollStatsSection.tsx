import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaUsers, FaMapMarkerAlt, FaStar, FaPlane } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  {
    icon: FaUsers,
    value: 5000,
    suffix: "+",
    label: "Happy Travelers",
    labelAr: "مسافر سعيد",
    color: "#D4AF37",
    gradient: "from-[#D4AF37]/20 to-[#D4AF37]/5",
    border: "border-[#D4AF37]/20",
    glow: "shadow-[0_0_40px_rgba(212,175,55,0.15)]",
    hoverGlow: "hover:shadow-[0_0_60px_rgba(212,175,55,0.3)]",
  },
  {
    icon: FaMapMarkerAlt,
    value: 50,
    suffix: "+",
    label: "Destinations",
    labelAr: "وجهة سياحية",
    color: "#EB662B",
    gradient: "from-[#EB662B]/20 to-[#EB662B]/5",
    border: "border-[#EB662B]/20",
    glow: "shadow-[0_0_40px_rgba(235,102,43,0.15)]",
    hoverGlow: "hover:shadow-[0_0_60px_rgba(235,102,43,0.3)]",
  },
  {
    icon: FaStar,
    value: 4.9,
    suffix: "★",
    label: "Average Rating",
    labelAr: "متوسط التقييم",
    color: "#D4AF37",
    gradient: "from-[#D4AF37]/20 to-[#D4AF37]/5",
    border: "border-[#D4AF37]/20",
    glow: "shadow-[0_0_40px_rgba(212,175,55,0.15)]",
    hoverGlow: "hover:shadow-[0_0_60px_rgba(212,175,55,0.3)]",
    isDecimal: true,
  },
  {
    icon: FaPlane,
    value: 100,
    suffix: "+",
    label: "Tours & Activities",
    labelAr: "جولة ونشاط",
    color: "#EB662B",
    gradient: "from-[#EB662B]/20 to-[#EB662B]/5",
    border: "border-[#EB662B]/20",
    glow: "shadow-[0_0_40px_rgba(235,102,43,0.15)]",
    hoverGlow: "hover:shadow-[0_0_60px_rgba(235,102,43,0.3)]",
  },
];

const ScrollStatsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const cards = sectionRef.current.querySelectorAll("[data-stat]");

    // Cards entrance animation
    gsap.fromTo(
      cards,
      { y: 80, opacity: 0, scale: 0.85 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.9,
        stagger: 0.12,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      }
    );

    // Counter animations
    cards.forEach((card) => {
      const counter = card.querySelector("[data-counter]");
      if (!counter) return;

      const target = parseFloat(counter.getAttribute("data-counter") || "0");
      const isDecimal = counter.getAttribute("data-decimal") === "true";
      const suffix = counter.getAttribute("data-suffix") || "";

      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          if (isDecimal) {
            (counter as HTMLElement).textContent = obj.val.toFixed(1) + suffix;
          } else {
            (counter as HTMLElement).textContent =
              Math.round(obj.val).toLocaleString() + suffix;
          }
        },
      });
    });

    // Progress bar scrub
    if (progressRef.current) {
      gsap.fromTo(
        progressRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }
  }, []);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-[#06082e] dark:bg-[#06082e]">

      {/* Animated progress bar */}
      <div
        ref={progressRef}
        className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#D4AF37] via-[#EB662B] to-[#D4AF37] origin-left"
      />

      {/* Background mesh gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/8 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#EB662B]/8 rounded-full blur-[120px] translate-y-1/2" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,7,60,0.0)_0%,rgba(6,8,46,0.8)_100%)]" />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div ref={sectionRef} className="relative z-10 max-w-6xl mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="text-center mb-16 md:mb-20" dir="rtl">
          <div className="inline-flex items-center justify-center flex-row-reverse gap-2 mb-4">
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#D4AF37]" />
            <span className="text-sm font-black text-[#D4AF37] tracking-widest">
              تأثيرنا
            </span>
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#D4AF37]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            أرقام قياسية{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EB662B] to-[#D4AF37]">
              تتحدث عن نجاحنا
            </span>
          </h2>
          <p className="text-white/60 mt-4 text-base max-w-md mx-auto">
            ثقة آلاف المسافرين حول العالم تعكس مستوى خدماتنا في تجربة Kemet.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              data-stat
              className={`group relative rounded-2xl md:rounded-3xl p-6 md:p-8
                bg-gradient-to-b ${stat.gradient}
                border ${stat.border}
                backdrop-blur-sm
                ${stat.glow} ${stat.hoverGlow}
                hover:-translate-y-2 hover:border-opacity-60
                transition-all duration-500 text-center cursor-default overflow-hidden`}
            >
              {/* Top shine line */}
              <div
                className="absolute top-0 left-4 right-4 h-px opacity-40 rounded-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)`,
                }}
              />

              {/* Icon circle */}
              <div
                className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 md:mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                style={{
                  background: `linear-gradient(135deg, ${stat.color}25, ${stat.color}10)`,
                  border: `1px solid ${stat.color}30`,
                  boxShadow: `0 0 20px ${stat.color}20`,
                }}
              >
                <stat.icon
                  className="text-xl md:text-2xl"
                  style={{ color: stat.color }}
                />
              </div>

              {/* Animated counter */}
              <div
                data-counter={stat.value}
                data-decimal={stat.isDecimal ? "true" : "false"}
                data-suffix={stat.suffix}
                className="text-4xl md:text-5xl lg:text-6xl font-black text-white tabular-nums"
                style={{
                  textShadow: `0 0 30px ${stat.color}50`,
                }}
              >
                0
              </div>

              {/* Label */}
              <p className="text-white/50 text-[13px] md:text-sm mt-2 font-medium">
                {stat.label}
              </p>
              <p
                className="text-[11px] mt-0.5 font-bold"
                style={{ color: `${stat.color}90` }}
              >
                {stat.labelAr}
              </p>

              {/* Bottom inner glow on hover */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-b-3xl"
                style={{
                  background: `radial-gradient(ellipse at bottom, ${stat.color}10 0%, transparent 70%)`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 md:mt-20 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10">
          {["✈️ 15+ سنوات خبرة", "🏆 Award-winning Service", "🔒 Secure Booking", "💬 24/7 Support"].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-white/35 text-[13px] font-medium">
              <span>{item}</span>
              {i < 3 && <span className="hidden md:block w-1 h-1 rounded-full bg-white/20" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScrollStatsSection;
