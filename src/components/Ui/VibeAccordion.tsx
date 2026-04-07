import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";
import VRViewer from "./VRViewer";

const vibes = [
  {
    id: "g1",
    title: "White Desert",
    subtitle: "Alien Landscapes",
    image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&q=80&w=800",
    color: "#E2E8F0",
    link: "/tours?hidden=white-desert"
  },
  {
    id: "g2",
    title: "Siwa Salt Lakes",
    subtitle: "Crystal Healing",
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=800",
    color: "#7DD3FC",
    link: "/tours?hidden=siwa"
  },
  {
    id: "g3",
    title: "Wadi El Hitan",
    subtitle: "Valley of Whales",
    image: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?auto=format&fit=crop&q=80&w=800",
    color: "#D4AF37",
    link: "/tours?hidden=hitan"
  },
  {
    id: "g4",
    title: "Colored Canyon",
    subtitle: "Sinai's Majesty",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&q=80&w=800",
    color: "#FB923C",
    link: "/tours?hidden=nuweiba"
  }
];

const VibeAccordion = () => {
  const [active, setActive] = useState<string>("g1");
  const [activeVR, setActiveVR] = useState<{url: string, title: string} | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial entry animation for the accordion
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.children, 
        { y: 100, opacity: 0, rotateX: -20 },
        { 
          y: 0, opacity: 1, rotateX: 0, 
          stagger: 0.1, 
          duration: 1.2, 
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        }
      );
    }
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto h-[400px] md:h-[500px] mt-16 sm:mt-24 rounded-3xl overflow-hidden flex flex-col md:flex-row gap-2 md:gap-4 p-2 md:p-4 bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl" style={{ perspective: "1000px" }} ref={containerRef}>
      {vibes.map((vibe) => {
        const isActive = active === vibe.id;
        
        return (
          <div
            key={vibe.id}
            onMouseEnter={() => setActive(vibe.id)}
            onClick={() => setActive(vibe.id)}
            className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] flex-1 border border-white/5 ${
              isActive 
                ? "flex-[3] md:flex-[4] shadow-[0_0_40px_rgba(0,0,0,0.4)]" 
                : "flex-1 hover:flex-[1.2] opacity-70 hover:opacity-100"
            }`}
          >
            {/* Background Image */}
            <img 
              src={vibe.image} 
              alt={vibe.title}
              className={`absolute inset-0 w-full h-full object-cover origin-center transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${isActive ? "scale-100" : "scale-125 grayscale-[50%]"}`}
            />
            
            {/* Dark Overlay Gradient */}
            <div className={`absolute inset-0 transition-opacity duration-700 ${isActive ? "bg-gradient-to-t from-black/90 via-black/20 to-transparent" : "bg-black/60"}`} />

            {/* Vertical Title (when inactive on Desktop) */}
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 delay-100 ${isActive ? "opacity-0" : "opacity-100 md:opacity-100"}`}>
               <h3 className="hidden md:block text-white font-black text-xl tracking-widest whitespace-nowrap -rotate-90 origin-center drop-shadow-md">
                 {vibe.title}
               </h3>
               <h3 className="md:hidden text-white font-bold text-sm text-center px-2">
                 {vibe.title}
               </h3>
            </div>

            {/* Content (when active) */}
            <div className={`absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col justify-end transition-all duration-700 ease-out h-full ${isActive ? "opacity-100 translate-y-0 delay-200" : "opacity-0 translate-y-10 pointer-events-none"}`}>
              
              <div className="overflow-hidden mb-2">
                <span 
                  className="block text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-1 drop-shadow-md transition-all duration-700 delay-300 transform" 
                  style={{ color: vibe.color, transform: isActive ? "translateY(0)" : "translateY(100%)" }}
                >
                  {vibe.subtitle}
                </span>
              </div>
              
              <div className="overflow-hidden mb-6">
                <h2 
                  className="text-3xl md:text-5xl font-extrabold text-white text-display leading-none drop-shadow-lg transition-all duration-700 delay-400 transform"
                  style={{ transform: isActive ? "translateY(0)" : "translateY(100%)" }}
                >
                  {vibe.title}
                </h2>
              </div>

              <div 
                className="transition-all duration-700 delay-500 transform flex flex-wrap gap-3"
                style={{ transform: isActive ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)", opacity: isActive ? 1 : 0 }}
              >
                <Link 
                  to={vibe.link}
                  className="inline-flex items-center gap-2 bg-black/40 hover:bg-black/80 text-white backdrop-blur-md px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 border border-white/20"
                >
                  View Tours
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveVR({url: vibe.image, title: vibe.title});
                  }}
                  className="inline-flex items-center gap-2 bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]"
                >
                  <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                  </svg>
                  Enter VR 360°
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* VR 360 Viewer Overlay */}
      {activeVR && (
        <VRViewer 
          imageUrl={activeVR.url}
          title={activeVR.title}
          onClose={() => setActiveVR(null)}
        />
      )}
    </div>
  );
};

export default VibeAccordion;
