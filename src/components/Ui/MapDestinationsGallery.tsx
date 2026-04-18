import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";
import GoogleMapsViewer from "./GoogleMapsViewer";
import Magnetic from "../common/Magnetic";

const governorates = [
  {
    id: "cairo",
    title: "Cairo",
    arabic: "القاهرة",
    subtitle: "Pyramids & Ancient Sites",
    mapCenter: { lat: 30.0444, lng: 31.2357 },
    mapBounds: { north: 30.2, south: 29.8, west: 31.0, east: 31.4 },
    image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2b00?auto=format&fit=crop&ar=2:1&q=80&w=4000",
    color: "#D4AF37",
    link: "/tours?location=cairo"
  },
  {
    id: "alex",
    title: "Alexandria",
    arabic: "الإسكندرية",
    subtitle: "Mediterranean Coastal Vibes",
    mapCenter: { lat: 31.2001, lng: 29.9187 },
    mapBounds: { north: 31.35, south: 31.10, west: 29.70, east: 30.10 },
    image: "https://images.unsplash.com/photo-1627727714658-9d62db4155a4?auto=format&fit=crop&ar=2:1&q=80&w=4000",
    color: "#00B4D8",
    link: "/tours?location=alexandria"
  },
  {
    id: "sharm",
    title: "Sharm El-Sheikh",
    arabic: "شرم الشيخ",
    subtitle: "Red Sea Resorts",
    mapCenter: { lat: 27.9158, lng: 34.3299 },
    mapBounds: { north: 28.05, south: 27.80, west: 34.20, east: 34.45 },
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&ar=2:1&q=80&w=4000",
    color: "#E2E8F0",
    link: "/tours?location=sharm"
  },
  {
    id: "luxor",
    title: "Luxor",
    arabic: "الأقصر",
    subtitle: "Karnak & Valleys",
    mapCenter: { lat: 25.6872, lng: 32.6396 },
    mapBounds: { north: 25.75, south: 25.65, west: 32.55, east: 32.75 },
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&ar=2:1&q=80&w=4000",
    color: "#F59E0B",
    link: "/tours?location=luxor"
  },
  {
    id: "aswan",
    title: "Aswan",
    arabic: "أسوان",
    subtitle: "Nile & Nubia",
    mapCenter: { lat: 24.0889, lng: 32.8998 },
    mapBounds: { north: 24.15, south: 23.90, west: 32.80, east: 32.95 },
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&ar=2:1&q=80&w=4000",
    color: "#F97316",
    link: "/tours?location=aswan"
  },
  {
    id: "hurghada",
    title: "Hurghada",
    arabic: "الغردقة",
    subtitle: "Coral Reefs & Beaches",
    mapCenter: { lat: 27.2579, lng: 33.8116 },
    mapBounds: { north: 27.35, south: 27.10, west: 33.70, east: 33.90 },
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&ar=2:1&q=80&w=4000",
    color: "#38BDF8",
    link: "/tours?location=hurghada"
  },
  {
    id: "marsa_alam",
    title: "Marsa Alam",
    arabic: "مرسى علم",
    subtitle: "Red Sea Oasis & Marine Life",
    mapCenter: { lat: 25.0676, lng: 34.8790 },
    mapBounds: { north: 25.15, south: 24.90, west: 34.80, east: 34.95 },
    image: "https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&ar=2:1&q=80&w=4000",
    color: "#2DD4BF",
    link: "/tours?location=marsa_alam"
  }
];

interface MapData {
  center: { lat: number, lng: number };
  bounds: { north: number, south: number, west: number, east: number };
  title: string;
}

const MapDestinationsGallery = () => {
  const [activeMap, setActiveMap] = useState<MapData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial entry animation
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { y: 60, opacity: 0 },
        { 
          y: 0, opacity: 1, 
          duration: 1, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
          }
        }
      );
    }
  }, []);

  const handleDrag = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 300 : 800;
      scrollRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full mt-16 sm:mt-24 relative" ref={containerRef}>
      
      {/* Scroll Controls Overlay */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 z-20 pointer-events-none fade-in hidden md:block">
        <Magnetic strength={0.2} className="pointer-events-auto">
          <button 
            onClick={() => handleDrag('left')}
            className="w-12 h-12 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full flex justify-center items-center text-white border border-white/20 transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
        </Magnetic>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8 z-20 pointer-events-none fade-in hidden md:block">
        <Magnetic strength={0.2} className="pointer-events-auto">
          <button 
            onClick={() => handleDrag('right')}
            className="w-12 h-12 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full flex justify-center items-center text-white border border-white/20 transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </Magnetic>
      </div>

      {/* Horizontally scrolling gallery */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 md:gap-8 px-6 md:px-24 pb-10 pt-4 snap-x snap-mandatory hide-scrollbars no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {governorates.map((city, idx) => (
          <div 
            key={city.id}
            className="relative flex-none w-[85vw] md:w-[600px] h-[500px] md:h-[600px] rounded-[2rem] overflow-hidden snap-center group border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform transition-transform duration-700 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(16,185,129,0.3)]"
          >
            {/* Background Image */}
            <img 
              src={city.image} 
              alt={city.title}
              className="absolute inset-0 w-full h-full object-cover origin-center transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
            />
            
            {/* Elegant Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#05073C]/95 via-[#05073C]/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />

            {/* City Number Indicator */}
            <div className="absolute top-8 left-8">
              <span className="text-white/40 font-black text-6xl tracking-tighter opacity-70 drop-shadow-md">
                0{idx + 1}
              </span>
            </div>

            {/* Floating Arabic Name Background */}
            <div className="absolute top-1/3 left-0 w-full text-center overflow-hidden pointer-events-none">
              <span className="text-[12rem] font-black text-white/[0.03] drop-shadow-lg transform -translate-y-1/2 transition-transform duration-[2s] group-hover:scale-110 whitespace-nowrap">
                {city.arabic}
              </span>
            </div>

            {/* Content Container */}
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
              
              <div className="transform transition-all duration-700 translate-y-8 group-hover:translate-y-0">
                <span 
                  className="inline-block text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-3 drop-shadow-md bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20" 
                  style={{ color: city.color }}
                >
                  {city.subtitle}
                </span>
                
                <h2 className="text-5xl md:text-6xl font-black text-white text-display leading-none drop-shadow-xl mb-2 flex items-baseline gap-4">
                  {city.title}
                  <span className="text-2xl md:text-3xl text-white/50 font-normal tracking-normal">{city.arabic}</span>
                </h2>
                
                <div className="mt-8 flex flex-wrap gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                  
                  {/* EXPLORE MAP Action Button */}
                  <Magnetic strength={0.4}>
                    <button 
                      onClick={() => setActiveMap({
                        center: city.mapCenter, 
                        bounds: city.mapBounds, 
                        title: `${city.title} - ${city.arabic}`
                      })}
                      className="group/btn relative overflow-hidden inline-flex items-center gap-2 bg-gradient-to-l from-[#10B981] to-[#059669] text-white px-8 py-4 rounded-full font-black text-sm transition-all duration-300 shadow-[0_5px_20px_rgba(16,185,129,0.4)] hover:shadow-[0_10px_30px_rgba(16,185,129,0.7)] hover:scale-105 active:scale-95 border border-white/20"
                    >
                      <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500 ease-out" />
                      
                      <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span className="tracking-wider">EXPLORE IN 3D</span>
                    </button>
                  </Magnetic>

                  <Link 
                    to={city.link}
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white text-white hover:text-black backdrop-blur-md px-8 py-4 rounded-full font-bold text-sm transition-all duration-300 border border-white/20 shadow-lg"
                  >
                    View Tours
                  </Link>

                </div>
              </div>
            </div>
            
          </div>
        ))}
      </div>

      {/* CSS for hiding scrollbars perfectly */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />

      {/* Advanced Restricted Google Maps Modal */}
      {activeMap && (
        <GoogleMapsViewer 
          center={activeMap.center}
          bounds={activeMap.bounds}
          title={activeMap.title}
          onClose={() => setActiveMap(null)}
        />
      )}
    </div>
  );
};

export default MapDestinationsGallery;
