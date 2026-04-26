import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const eras = [
  {
    id: "pharaonic",
    year: "٣١٠٠ ق.م",
    yearEn: "3100 BC",
    era: "حضارة الفراعنة",
    eraEn: "Pharaonic Egypt",
    title: "أرض الآلهة والأسرار",
    titleEn: "Land of Gods and Secrets",
    desc: "حين بنى الفراعنة الأهرامات بدقة تعجز عنها التكنولوجيا الحديثة، ونقشوا الهيروغليفية لتحمل رسائلهم عبر الأزمان.",
    descEn: "When the pharaohs built pyramids with precision that defies modern technology, and carved hieroglyphs to carry their messages through time.",
    image: "/images/era-pharaonic.png",
    places: [
      { name: "أهرامات الجيزة", nameEn: "Giza Pyramids", link: "/attraction/giza" },
      { name: "أبو سمبل", nameEn: "Abu Simbel", link: "/attraction/abu-simbel" },
      { name: "وادي الملوك", nameEn: "Valley of the Kings", link: "/attraction/valley-of-kings" },
    ],
    palette: {
      bg: "#ffffff",
      accent: "#EB662B",
      text: "#05073C",
      card: "rgba(235,102,43,0.08)",
      border: "rgba(235,102,43,0.15)",
      glow: "rgba(235,102,43,0.08)",
    },
    symbol: "𓂀",
    decoration: "hieroglyphs",
  },
  {
    id: "greco-roman",
    year: "٣٣٢ ق.م",
    yearEn: "332 BC",
    era: "الحقبة اليونانية الرومانية",
    eraEn: "Greco-Roman Era",
    title: "إسكندرية العظيمة",
    titleEn: "Alexandria the Great",
    desc: "جاء الإسكندر الأكبر وأسّس إسكندرية التي أصبحت عاصمة العالم القديم، حيث قامت أعظم مكتبة في التاريخ.",
    descEn: "Alexander the Great arrived and founded Alexandria, which became the capital of the ancient world and home to the greatest library in history.",
    image: "/images/era-greco-roman.png",
    places: [
      { name: "الإسكندرية", nameEn: "Alexandria", link: "/attraction/alexandria" },
      { name: "مسرح كوم الدكة", nameEn: "Roman Amphitheatre", link: "/attraction/kom-el-dikka" },
      { name: "متحف الغوص", nameEn: "Sunken Museum", link: "/museums" },
    ],
    palette: {
      bg: "#f9fafb",
      accent: "#D4AF37",
      text: "#05073C",
      card: "rgba(212,175,55,0.08)",
      border: "rgba(212,175,55,0.15)",
      glow: "rgba(212,175,55,0.08)",
    },
    symbol: "Ω",
    decoration: "columns",
  },
  {
    id: "coptic",
    year: "٦٤ م",
    yearEn: "64 AD",
    era: "مصر المسيحية القبطية",
    eraEn: "Coptic Egypt",
    title: "أرض المسيح الأولى",
    titleEn: "The First Land of Christ",
    desc: "هربت العائلة المقدسة إلى مصر، ولجأ القديس مرقس ليؤسس الكنيسة المصرية — واحدة من أقدم الكنائس في العالم.",
    descEn: "The Holy Family fled to Egypt, and Saint Mark took refuge to found the Egyptian Church — one of the oldest in the world.",
    image: "/images/era-coptic.png",
    places: [
      { name: "الحي القبطي", nameEn: "Coptic Cairo", link: "/attraction/coptic-cairo" },
      { name: "دير سانت كاترين", nameEn: "St. Catherine Monastery", link: "/attraction/saint-catherine" },
      { name: "كنيسة المعلقة", nameEn: "The Hanging Church", link: "/attraction/hanging-church" },
    ],
    palette: {
      bg: "#ffffff",
      accent: "#EB662B",
      text: "#05073C",
      card: "rgba(235,102,43,0.08)",
      border: "rgba(235,102,43,0.15)",
      glow: "rgba(235,102,43,0.08)",
    },
    symbol: "☩",
    decoration: "cross",
  },
  {
    id: "islamic",
    year: "٦٤١ م",
    yearEn: "641 AD",
    era: "مصر الإسلامية",
    eraEn: "Islamic Egypt",
    title: "القاهرة المعزية",
    titleEn: "Al-Mu'izz Cairo",
    desc: "بنى الفاطميون القاهرة لتكون عاصمة الخلافة، وتعالت مآذنها في السماء لتشهد على أعظم حضارة إسلامية في التاريخ.",
    descEn: "The Fatimids built Cairo as the capital of the Caliphate, its minarets reaching the sky to witness the greatest Islamic civilization.",
    image: "/images/era-islamic.png",
    places: [
      { name: "الجامع الأزهر", nameEn: "Al-Azhar Mosque", link: "/attraction/al-azhar" },
      { name: "قلعة صلاح الدين", nameEn: "Saladin Citadel", link: "/attraction/cairo-citadel" },
      { name: "خان الخليلي", nameEn: "Khan el-Khalili", link: "/bazaars" },
    ],
    palette: {
      bg: "#f9fafb",
      accent: "#D4AF37",
      text: "#05073C",
      card: "rgba(212,175,55,0.08)",
      border: "rgba(212,175,55,0.15)",
      glow: "rgba(212,175,55,0.08)",
    },
    symbol: "☽",
    decoration: "arabesque",
  },
  {
    id: "modern",
    year: "٢٠٢٥",
    yearEn: "2025",
    era: "مصر الحديثة",
    eraEn: "Modern Egypt",
    title: "البلد الذي لا ينام",
    titleEn: "The City That Never Sleeps",
    desc: "من ناطحات سحاب العاصمة الإدارية الجديدة إلى الغوص في البحر الأحمر — مصر اليوم تجمع بين الأصالة والحداثة.",
    descEn: "From the skyscrapers of the New Capital to diving in the Red Sea — modern Egypt brings together heritage and the future.",
    image: "/images/era-modern.png",
    places: [
      { name: "العاصمة الإدارية", nameEn: "New Capital", link: "/attraction/new-capital" },
      { name: "البحر الأحمر", nameEn: "Red Sea", link: "/attraction/red-sea" },
      { name: "الساحل الشمالي", nameEn: "North Coast", link: "/attraction/north-coast" },
    ],
    palette: {
      bg: "#ffffff",
      accent: "#EB662B",
      text: "#05073C",
      card: "rgba(235,102,43,0.08)",
      border: "rgba(235,102,43,0.15)",
      glow: "rgba(235,102,43,0.08)",
    },
    symbol: "◈",
    decoration: "modern",
  },
];




const TextRevealSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineBarRef = useRef<HTMLDivElement>(null);
  const [isArabic, setIsArabic] = useState(true);

  // Read current language from DOM on mount and observe changes
  useEffect(() => {
    const checkLang = () => setIsArabic(document.documentElement.lang !== 'en' && document.documentElement.lang !== 'fr' && document.documentElement.lang !== 'de' && document.documentElement.lang !== 'es' && document.documentElement.lang !== 'it');
    checkLang();
    
    // Optional: Mutation observer if lang changes without reload
    const observer = new MutationObserver(checkLang);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animate each era panel on scroll
      eras.forEach((_, i) => {
        const panel = sectionRef.current!.querySelector(`#era-${i}`);
        if (!panel) return;

        const content = panel.querySelector(".era-content");
        const img = panel.querySelector(".era-img");
        const badge = panel.querySelector(".era-badge");

        // Content slides in
        gsap.fromTo(content,
          { x: i % 2 === 0 ? -60 : 60, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: panel, start: "top 70%", toggleActions: "play none none none" },
          }
        );

        // Image parallax
        gsap.fromTo(img,
          { scale: 1.15, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 1.2, ease: "power2.out",
            scrollTrigger: { trigger: panel, start: "top 80%", toggleActions: "play none none none" },
          }
        );

        // Year badge pop
        gsap.fromTo(badge,
          { scale: 0, opacity: 0, rotate: -10 },
          {
            scale: 1, opacity: 1, rotate: 0, duration: 0.6, ease: "back.out(1.8)",
            scrollTrigger: { trigger: panel, start: "top 65%", toggleActions: "play none none none" },
          }
        );
      });

      // Timeline progress bar
      if (timelineBarRef.current) {
        gsap.fromTo(timelineBarRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top center",
              end: "bottom center",
              scrub: 1,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-white">

      {/* ── Section Header ── */}
      <div className="relative z-10 text-center py-20 md:py-28 px-4">
        <div className="inline-flex items-center gap-3 mb-5">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
          <span className="text-[11px] font-black text-[#D4AF37] uppercase tracking-[0.35em]">
            Egypt Through Time
          </span>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
        </div>
        <h2 className="text-4xl md:text-7xl font-black text-[#05073C] leading-tight">
          {isArabic ? "مصر عبر" : "Egypt Through"}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#EB662B] to-[#D4AF37]">
            {isArabic ? "الزمن" : "Time"}
          </span>
        </h2>
        <p className="text-gray-500 mt-4 text-sm md:text-base max-w-lg mx-auto font-medium">
          {isArabic ? "رحلة ٥٠٠٠ سنة — من الفراعنة إلى اليوم" : "A 5000-Year Journey — From Pharaohs to Today"}
        </p>

        {/* Scroll hint */}
        <div className="mt-10 flex flex-col items-center gap-2 text-gray-400 font-bold">
          <span className="text-[10px] uppercase tracking-[0.3em]">scroll to travel through time</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#D4AF37] to-transparent" />
        </div>
      </div>

      {/* ── Vertical Timeline Line (left side) ── */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-gray-100 z-10 hidden md:block">
        <div
          ref={timelineBarRef}
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#D4AF37] to-[#EB662B] origin-top"
          style={{ height: "100%" }}
        />
      </div>

      {/* ── Era Panels ── */}
      <div className="relative">
        {eras.map((era, i) => (
          <div
            key={era.id}
            id={`era-${i}`}
            className="relative w-full overflow-hidden"
            style={{ backgroundColor: era.palette.bg }}
          >
            {/* Top divider */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${era.palette.accent}40, transparent)` }}
            />

            {/* Background image (full bleed, very dark) */}
            <div className="era-img absolute inset-0">
              <img
                src={era.image}
                alt={era.era}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  const t = e.currentTarget;
                  if (t.dataset.fallback) return;
                  t.dataset.fallback = "1";
                  const fallbacks: Record<string, string> = {
                    "pharaonic":  "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1400",
                    "greco-roman":"https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=1400",
                    "coptic":     "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=1400",
                    "islamic":    "https://images.unsplash.com/photo-1532054897163-9993e3dffde1?q=80&w=1400",
                    "modern":     "https://images.unsplash.com/photo-1553653924-d2eab8f1c3dc?q=80&w=1400",
                  };
                  t.src = fallbacks[era.id] ?? "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1400";
                }}
                className="w-full h-full object-cover opacity-10"
                style={{ filter: `sepia(${era.id === "pharaonic" ? "80%" : "0"}) brightness(0.4)` }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse at ${i % 2 === 0 ? "70%" : "30%"} 50%, ${era.palette.glow} 0%, transparent 65%)`,
                }}
              />
            </div>

            {/* Timeline dot */}
            <div
              className="absolute left-[calc(1.5rem-4px)] md:left-[calc(3rem-4px)] top-1/2 -translate-y-1/2 z-20 hidden md:block"
            >
              <div
                className="w-2.5 h-2.5 rounded-full ring-2 ring-offset-2 ring-offset-transparent"
                style={{
                  backgroundColor: era.palette.accent,
                  boxShadow: `0 0 12px 4px ${era.palette.glow}, 0 0 0 2px ${era.palette.accent}40`,
                }}
              />
            </div>

            {/* Content */}
            <div
              className={`era-content relative z-10 max-w-6xl mx-auto px-6 md:pl-24 md:pr-10 py-20 md:py-28 grid grid-cols-1 md:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}
            >
              {/* Text side */}
              <div className={i % 2 === 1 ? "md:[direction:ltr]" : ""}>
                {/* Year badge */}
                <div
                  className="era-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest mb-5"
                  style={{
                    backgroundColor: era.palette.card,
                    border: `1px solid ${era.palette.border}`,
                    color: era.palette.accent,
                  }}
                >
                  <span className="text-base">{era.symbol}</span>
                  {isArabic ? `${era.yearEn} · ${era.year}` : era.yearEn}
                </div>

                {/* Era label */}
                <p
                  className="text-[11px] font-black uppercase tracking-[0.3em] mb-3 opacity-60"
                  style={{ color: era.palette.accent }}
                >
                  {isArabic ? era.era : era.eraEn}
                </p>

                {/* Title */}
                <h3 className="text-3xl md:text-5xl font-black leading-tight mb-4" style={{ color: era.palette.text }}>
                  {isArabic ? era.title : era.titleEn}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base leading-relaxed mb-8 opacity-60" style={{ color: era.palette.text }}>
                  {isArabic ? era.desc : era.descEn}
                </p>

                {/* Places to visit now */}
                <div className="mb-8">
                  <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 mb-3" style={{ color: era.palette.text }}>
                    {isArabic ? "اكتشفها اليوم" : "Discover it Today"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {era.places.map((place, pi) => (
                      <Link
                        key={pi}
                        to={place.link}
                        className="px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:scale-105"
                        style={{
                          backgroundColor: era.palette.card,
                          border: `1px solid ${era.palette.border}`,
                          color: era.palette.accent,
                          boxShadow: `0 4px 12px ${era.palette.glow}`,
                        }}
                      >
                        {isArabic ? place.name : place.nameEn}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Image card side */}
              <div className={`relative ${i % 2 === 1 ? "md:[direction:ltr]" : ""}`}>
                <div
                  className="relative rounded-2xl overflow-hidden aspect-[4/3]"
                  style={{
                    border: `1px solid ${era.palette.border}`,
                    boxShadow: `0 30px 80px ${era.palette.glow}`,
                  }}
                >
                  <img
                    src={era.image}
                    alt={era.era}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    style={{
                      filter: era.id === "pharaonic" ? "sepia(40%) brightness(0.85)" : "brightness(0.8)",
                    }}
                  />
                  {/* Image overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, rgba(5, 7, 60, 0.9) 0%, transparent 60%)`,
                    }}
                  />
                  {/* Era name on image */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black opacity-90" style={{ color: era.palette.accent }}>
                      {isArabic ? era.era : era.eraEn}
                    </p>
                    <p className="text-white font-bold text-sm">{isArabic ? era.year : era.yearEn}</p>
                  </div>
                </div>

                {/* Floating year number */}
                <div
                  className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl flex items-center justify-center text-5xl font-black opacity-10 select-none pointer-events-none"
                  style={{ color: era.palette.accent }}
                >
                  {era.symbol}
                </div>
              </div>
            </div>

            {/* Era number in background */}
            <div
              className="absolute right-4 bottom-4 text-[100px] md:text-[160px] font-black opacity-[0.03] leading-none select-none pointer-events-none"
              style={{ color: era.palette.accent }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default TextRevealSection;
