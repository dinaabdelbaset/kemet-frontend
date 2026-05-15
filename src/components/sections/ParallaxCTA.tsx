import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { FaGift, FaArrowRight, FaStar, FaClock, FaTag } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  { id: 1, image: "/images/home/cta-pyramids.jpg", name: "Pyramids", icon: "🏛️" },
  { id: 2, image: "/images/home/cta-redsea.jpg", name: "Red Sea", icon: "🤿" },
  { id: 3, image: "/images/home/cta-luxor.jpg", name: "Luxor", icon: "𓂀" },
  { id: 4, image: "/images/home/cta-desert.jpg", name: "Desert", icon: "⭐" },
  { id: 5, image: "/images/home/cta-alex.jpg", name: "Alexandria", icon: "🏺" },
  { id: 6, image: "/images/home/cta-sinai.jpg", name: "Sinai", icon: "⛰️" },
  { id: 7, image: "/images/home/cta-khan.jpg", name: "Khan el-Khalili", icon: "🧆" },
  { id: 8, image: "/images/home/cta-cairo.jpg", name: "Cairo", icon: "🌆" },
];

// 4 packages per destination
const destinationPackages: Record<number, { title: string; image: string; days: number; rating: number; originalPrice: number; tag: string }[]> = {
  1: [
    { title: "Full Pyramids Tour", image: "/images/home/cta-pyramids.jpg", days: 3, rating: 4.9, originalPrice: 350, tag: "Most Booked" },
    { title: "Desert Safari & Pyramids", image: "/images/home/cta-desert.jpg", days: 4, rating: 4.8, originalPrice: 480, tag: "Adventure" },
    { title: "Cairo & Giza VIP", image: "/images/home/cta-cairo.jpg", days: 5, rating: 4.7, originalPrice: 620, tag: "VIP" },
    { title: "Pharaonic Civilization Trip", image: "/images/home/cta-luxor.jpg", days: 7, rating: 4.9, originalPrice: 890, tag: "All Inclusive" },
  ],
  2: [
    { title: "Red Sea Diving", image: "/images/home/cta-redsea.jpg", days: 4, rating: 4.9, originalPrice: 420, tag: "Most Booked" },
    { title: "Hurghada Beach Snorkeling", image: "/images/home/cta-sinai.jpg", days: 5, rating: 4.7, originalPrice: 550, tag: "Family" },
    { title: "Private Yacht in Red Sea", image: "/images/home/cta-redsea.jpg", days: 3, rating: 4.8, originalPrice: 780, tag: "VIP" },
    { title: "Sharm El-Sheikh All Inclusive", image: "/images/home/cta-sinai.jpg", days: 7, rating: 4.9, originalPrice: 950, tag: "All Inclusive" },
  ],
  3: [
    { title: "Luxor & Karnak Temples", image: "/images/home/cta-luxor.jpg", days: 3, rating: 4.9, originalPrice: 380, tag: "Most Booked" },
    { title: "Full Nile Cruise", image: "/images/home/cta-bg.jpg", days: 5, rating: 4.8, originalPrice: 590, tag: "Romantic" },
    { title: "Valley of the Kings VIP", image: "/images/home/cta-pyramids.jpg", days: 4, rating: 4.7, originalPrice: 670, tag: "VIP" },
    { title: "Aswan & Luxor All Inclusive", image: "/images/home/cta-luxor.jpg", days: 7, rating: 4.9, originalPrice: 1050, tag: "All Inclusive" },
  ],
  4: [
    { title: "Western Desert Safari", image: "/images/home/cta-desert.jpg", days: 3, rating: 4.8, originalPrice: 310, tag: "Adventure" },
    { title: "Siwa Oasis by Night", image: "/images/home/cta-sinai.jpg", days: 4, rating: 4.9, originalPrice: 450, tag: "Most Booked" },
    { title: "Night in the Heart of Desert", image: "/images/home/cta-desert.jpg", days: 2, rating: 4.7, originalPrice: 280, tag: "Romantic" },
    { title: "Oasis Jeep Safari", image: "/images/home/cta-khan.jpg", days: 5, rating: 4.8, originalPrice: 580, tag: "All Inclusive" },
  ],
  5: [
    { title: "Historical Alexandria", image: "/images/home/cta-alex.jpg", days: 2, rating: 4.7, originalPrice: 220, tag: "Historical" },
    { title: "Corniche & Qaitbay Citadel", image: "/images/home/cta-alex.jpg", days: 3, rating: 4.8, originalPrice: 340, tag: "Most Booked" },
    { title: "Alexandria Coast VIP", image: "/images/home/cta-sinai.jpg", days: 4, rating: 4.6, originalPrice: 490, tag: "VIP" },
    { title: "Mediterranean Sea Trip", image: "/images/home/cta-alex.jpg", days: 5, rating: 4.9, originalPrice: 670, tag: "All Inclusive" },
  ],
  6: [
    { title: "Mount Moses & St. Catherine", image: "/images/home/cta-sinai.jpg", days: 2, rating: 4.9, originalPrice: 290, tag: "Most Booked" },
    { title: "South Sinai Beach", image: "/images/home/cta-redsea.jpg", days: 4, rating: 4.8, originalPrice: 460, tag: "Family" },
    { title: "Ras Mohammed Diving", image: "/images/home/cta-redsea.jpg", days: 3, rating: 4.7, originalPrice: 540, tag: "Adventure" },
    { title: "Sinai All Inclusive - Land & Sea", image: "/images/home/cta-sinai.jpg", days: 7, rating: 4.9, originalPrice: 980, tag: "All Inclusive" },
  ],
  7: [
    { title: "Khan el-Khalili Tour", image: "/images/home/cta-khan.jpg", days: 1, rating: 4.7, originalPrice: 85, tag: "Most Booked" },
    { title: "Islamic Cairo", image: "/images/home/cta-cairo.jpg", days: 2, rating: 4.8, originalPrice: 195, tag: "Historical" },
    { title: "Saladin Citadel & Al-Azhar", image: "/images/home/cta-cairo.jpg", days: 3, rating: 4.6, originalPrice: 310, tag: "Guided" },
    { title: "Full Cairo All Inclusive", image: "/images/home/cta-khan.jpg", days: 5, rating: 4.9, originalPrice: 550, tag: "All Inclusive" },
  ],
  8: [
    { title: "Cairo in a Day", image: "/images/home/cta-cairo.jpg", days: 1, rating: 4.7, originalPrice: 120, tag: "Most Booked" },
    { title: "Cairo & Giza 3 Days", image: "/images/home/cta-pyramids.jpg", days: 3, rating: 4.8, originalPrice: 360, tag: "Family" },
    { title: "Modern & Old Cairo", image: "/images/home/cta-cairo.jpg", days: 4, rating: 4.6, originalPrice: 480, tag: "Historical" },
    { title: "All Egypt from Cairo", image: "/images/home/cta-bg.jpg", days: 10, rating: 4.9, originalPrice: 1450, tag: "All Inclusive" },
  ],
};

const tagColors: Record<string, string> = {
  "Most Booked": "#EB662B",
  "VIP": "#D4AF37",
  "All Inclusive": "#4caf82",
  "Adventure": "#7ec8e3",
  "Romantic": "#c9956a",
  "Family": "#a78bfa",
  "Historical": "#D4AF37",
  "Guided": "#4caf82",
};

const getCashback = (count: number) => {
  if (count === 0) return { pct: 0, label: "Select Destinations", color: "#ffffff30" };
  if (count <= 2) return { pct: 5, label: "5% Cashback", color: "#c9956a" };
  if (count <= 4) return { pct: 10, label: "10% Cashback", color: "#D4AF37" };
  if (count <= 6) return { pct: 15, label: "15% Cashback", color: "#EB662B" };
  return { pct: 20, label: "20% Cashback 🎉", color: "#4caf82" };
};

const ParallaxCTA = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const packagesRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [focused, setFocused] = useState<number | null>(null);
  const cashback = getCashback(selected.size);

  const toggle = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    setFocused(id);
  };

  // Save cashback % to localStorage
  useEffect(() => {
    const pct = getCashback(selected.size).pct;
    if (pct > 0) localStorage.setItem("kemet_cashback_pct", String(pct));
    else localStorage.removeItem("kemet_cashback_pct");
  }, [selected]);

  // Animate packages on focus change
  useEffect(() => {
    if (!packagesRef.current || focused === null) return;
    gsap.fromTo(packagesRef.current.querySelectorAll(".pkg-card"),
      { y: 30, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.45, ease: "back.out(1.3)" }
    );
  }, [focused]);

  useEffect(() => {
    if (!sectionRef.current || !bgRef.current) return;
    gsap.to(bgRef.current, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
    });
    const items = sectionRef.current.querySelectorAll(".exp-card");
    gsap.fromTo(items,
      { y: 50, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, stagger: 0.07, duration: 0.6, ease: "back.out(1.4)",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none" } }
    );
  }, []);

  const focusedExp = experiences.find(e => e.id === focused);
  const focusedPkgs = focused ? destinationPackages[focused] || [] : [];

  return (
    <div ref={sectionRef} className="relative w-full overflow-hidden my-16 md:my-24">
      <img ref={bgRef}
        src="/images/home/cta-bg.jpg"
        alt="Egypt"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-[130%] object-cover -top-[15%] pointer-events-none"
      />
      <div className="absolute inset-0 bg-[#05073C]/88 backdrop-blur-[1px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-10 py-16 md:py-20">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-black tracking-[0.25em] uppercase mb-5">
            <FaGift /> Choose destinations & earn cashback
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-3">
            Every destination you choose is{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#EB662B]">a gift for you</span>
          </h2>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            Choose the experiences you love — and we will give you cashback on your next booking as a gift from Kemet
          </p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-2.5 mb-10">
          {experiences.map((exp) => {
            const isSelected = selected.has(exp.id);
            const isFocused = focused === exp.id;
            return (
              <button key={exp.id} onClick={() => toggle(exp.id)}
                className="exp-card relative aspect-square rounded-xl overflow-hidden group cursor-pointer focus:outline-none transition-all duration-300"
                style={{
                  outline: isFocused ? `3px solid ${cashback.color === "#ffffff30" ? "#D4AF37" : cashback.color}` : isSelected ? `2px solid ${cashback.color}60` : "2px solid transparent",
                  transform: isFocused ? "scale(1.1)" : isSelected ? "scale(1.04)" : "scale(1)",
                  boxShadow: isFocused ? `0 12px 32px ${cashback.color}60` : isSelected ? `0 6px 18px ${cashback.color}30` : "none",
                }}
              >
                <div className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${exp.image})` }} />
                <div className="absolute inset-0 transition-all duration-300"
                  style={{ backgroundColor: isFocused ? "rgba(0,0,0,0.25)" : isSelected ? "rgba(0,0,0,0.30)" : "rgba(0,0,0,0.52)" }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-1">
                  <span className="text-lg md:text-xl drop-shadow-lg">{exp.icon}</span>
                  <p className="text-white text-[8px] md:text-[10px] font-black text-center leading-tight drop-shadow-lg">{exp.name}</p>
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: cashback.color === "#ffffff30" ? "#D4AF37" : cashback.color }}>
                      <svg className="w-2.5 h-2.5 text-[#05073C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Packages for focused destination */}
        {focused !== null && focusedPkgs.length > 0 && (
          <div ref={packagesRef} className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">{focusedExp?.icon}</span>
              <h3 className="text-white font-black text-lg">
                <span style={{ color: cashback.color === "#ffffff30" ? "#D4AF37" : cashback.color }}>{focusedExp?.name}</span> Packages
              </h3>
              {cashback.pct > 0 && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black text-[#05073C]"
                  style={{ background: `linear-gradient(135deg, ${cashback.color}, #EB662B)` }}>
                  {cashback.pct}% OFF
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {focusedPkgs.map((pkg, i) => {
                const discountedPrice = cashback.pct > 0
                  ? Math.round(pkg.originalPrice * (1 - cashback.pct / 100))
                  : pkg.originalPrice;
                const tagColor = tagColors[pkg.tag] || "#D4AF37";
                return (
                  <div key={i} className="pkg-card relative rounded-2xl overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-300"
                    style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}>

                    {/* Image */}
                    <div className="relative h-32 overflow-hidden">
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url(${pkg.image})` }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                      {/* Tag */}
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black text-[#05073C]"
                        style={{ backgroundColor: tagColor }}>
                        {pkg.tag}
                      </div>

                      {/* Discount badge */}
                      {cashback.pct > 0 && (
                        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-red-500 text-white">
                          <FaTag className="text-[8px]" /> -{cashback.pct}%
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="bg-white/8 backdrop-blur-sm p-3">
                      <p className="text-white text-[11px] font-black leading-tight mb-2 line-clamp-2">{pkg.title}</p>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1 text-[9px] text-white/50">
                          <FaClock className="text-[8px]" /> {pkg.days} Days
                        </div>
                        <div className="flex items-center gap-1 text-[9px] text-[#D4AF37]">
                          <FaStar className="text-[8px]" /> {pkg.rating}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          {cashback.pct > 0 && (
                            <p className="text-white/40 text-[9px] line-through">${pkg.originalPrice}</p>
                          )}
                          <p className="font-black text-sm" style={{ color: cashback.color === "#ffffff30" ? "#D4AF37" : cashback.color }}>
                            ${discountedPrice}
                          </p>
                        </div>
                        <Link
                          to="/checkout"
                          state={{ title: pkg.title, price: discountedPrice, image: pkg.image }}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[#05073C] font-black text-[9px] transition-all hover:scale-105"
                          style={{ background: `linear-gradient(135deg, ${cashback.color === "#ffffff30" ? "#D4AF37" : cashback.color}, #EB662B)` }}
                          onClick={e => e.stopPropagation()}
                        >
                          Book <FaArrowRight className="text-[8px]" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cashback Progress */}
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-white/40 text-[11px] uppercase tracking-widest font-black">
              {selected.size} / {experiences.length} Destinations
            </span>
            <span className="text-lg font-black transition-all duration-500" style={{ color: cashback.color === "#ffffff30" ? "rgba(255,255,255,0.3)" : cashback.color }}>
              {cashback.label}
            </span>
          </div>
          <div className="h-3 bg-white/8 rounded-full overflow-hidden mb-3">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(selected.size / experiences.length) * 100}%`, background: `linear-gradient(90deg, ${cashback.color}80, ${cashback.color})` }} />
          </div>
          <div className="flex justify-between px-1 mb-8">
            {[{ count: 2, pct: "5%", color: "#c9956a" }, { count: 4, pct: "10%", color: "#D4AF37" }, { count: 6, pct: "15%", color: "#EB662B" }, { count: 8, pct: "20%", color: "#4caf82" }].map(tier => (
              <div key={tier.pct} className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-black transition-all duration-300"
                  style={{ color: selected.size >= tier.count ? tier.color : "rgba(255,255,255,0.2)" }}>{tier.pct}</span>
                <div className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{ backgroundColor: selected.size >= tier.count ? tier.color : "rgba(255,255,255,0.1)" }} />
                <span className="text-[9px] text-white/20">{tier.count}+</span>
              </div>
            ))}
          </div>
          <div className="text-center">
            {selected.size === 0 ? (
              <p className="text-white/30 text-sm font-medium py-4">👆 Click on the photos you'd love to visit</p>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="px-5 py-3 rounded-xl border text-sm font-black"
                  style={{ borderColor: `${cashback.color}40`, backgroundColor: `${cashback.color}12`, color: cashback.color }}>
                  🎁 You will get {cashback.pct}% cashback on your booking
                </div>
                <Link to="/packages"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-extrabold text-sm text-[#05073C] hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(212,175,55,0.4)] transition-all duration-300"
                  style={{ background: `linear-gradient(135deg, ${cashback.color === "#ffffff30" ? "#D4AF37" : cashback.color}, #EB662B)` }}>
                  Book & Get Cashback <FaArrowRight />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParallaxCTA;
