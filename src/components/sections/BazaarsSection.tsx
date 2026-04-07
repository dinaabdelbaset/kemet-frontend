import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Heading from "../Ui/Heading";
import SectionWrapper from "./SectionWrapper";
import { FaMapMarkerAlt, FaShoppingBag } from "react-icons/fa";
import axiosClient from "../../api/axiosClient";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BazaarsSection = () => {
  const [bazaars, setBazaars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBazaars = async () => {
      try {
        const response = await axiosClient.get("/search?q=bazaar");
        // Bazaars don't have a dedicated endpoint yet, use local approach
        const resp = await axiosClient.get("/restaurants");
        setBazaars(Array.isArray(resp.data) ? resp.data.slice(0, 3) : []);
      } catch (error) {
        console.error("Error fetching bazaars:", error);
        setBazaars([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBazaars();
  }, []);

  // GSAP stagger cards
  useEffect(() => {
    if (loading || !gridRef.current) return;
    const cards = gridRef.current.children;

    gsap.fromTo(cards,
      { y: 80, opacity: 0, scale: 0.9, rotateY: 12 },
      {
        y: 0, opacity: 1, scale: 1, rotateY: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [loading]);

  return (
    <SectionWrapper className="bg-orange-50/30">
      <div className="flex justify-between items-end mb-8">
        <Heading title="Markets & Shopping" />
        <Link 
          to="/bazaars" 
          className="hidden sm:inline-block text-[#D4AF37] font-bold hover:underline mb-2"
        >
          View All Markets &rarr;
        </Link>
      </div>

      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ perspective: "1200px" }}>
        {loading ? (
          <div className="col-span-full py-10 text-center text-gray-500">جاري تحميل الأسواق...</div>
        ) : bazaars.length > 0 ? (
          bazaars.map((bazaar) => (
            <div 
              key={bazaar.id} 
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-[#D4AF37]/30 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={bazaar.image} 
                  alt={bazaar.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white text-sm font-medium bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full">
                  <FaMapMarkerAlt className="text-[#D4AF37]" /> {bazaar.location}
                </div>
              </div>

              {/* Content Container */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-[#05073C] mb-2 group-hover:text-[#EB662B] transition-colors line-clamp-1">
                  {bazaar.title}
                </h3>
                
                <p className="text-gray-500 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {bazaar.description}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(bazaar.specialty) ? bazaar.specialty.slice(0, 2).map((item: any, i: number) => (
                      <span key={i} className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1">
                        <FaShoppingBag className="text-gray-400 text-[10px]" /> {item}
                      </span>
                    )) : null}
                  </div>
                  
                  <Link 
                    to={`/bazaars/${bazaar.id}`} 
                    className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[#EB662B] group-hover:bg-[#EB662B] group-hover:text-white transition-colors"
                  >
                    &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-10 text-center text-gray-500">لا توجد أسواق سياحية.</div>
        )}
      </div>
      
      <div className="mt-8 text-center sm:hidden">
        <Link 
          to="/bazaars" 
          className="inline-block border border-[#D4AF37] text-[#D4AF37] font-bold px-6 py-2 rounded-full hover:bg-[#D4AF37] hover:text-white transition-colors"
        >
          View All Markets
        </Link>
      </div>
    </SectionWrapper>
  );
};

export default BazaarsSection;
