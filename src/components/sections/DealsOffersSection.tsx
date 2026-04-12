import { useState, useEffect, useRef } from "react";
import { getDeals } from "../../api/tripService";
import { Link } from "react-router-dom";
import SectionWrapper from "./SectionWrapper";
import { FaStar, FaArrowRight, FaMapMarkerAlt, FaChevronRight } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitTextReveal from "../Ui/SplitTextReveal";

gsap.registerPlugin(ScrollTrigger);

interface DealCategory {
  id: number;
  category: string;
  icon: string;
  title: string;
  locations: string;
  image: string;
  price: string;
  rating: number;
  color: string;
  link: string;
  items: string[];
}

const DealCard = ({ deal }: { deal: DealCategory }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 flex flex-col hover:-translate-y-3 hover:border-[#D4AF37]/50">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={deal.image || '/placeholder.png'}
          alt={deal.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Hover shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="text-3xl">{deal.icon}</span>
            <h3 className="text-white font-extrabold text-xl">{deal.title}</h3>
          </div>
          <div className="flex items-center gap-1.5 text-white/80 text-xs">
            <FaMapMarkerAlt className="text-[#D4AF37] text-[10px]" />
            <span>{deal.locations}</span>
          </div>
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <div className="bg-white/95 backdrop-blur-sm text-gray-900 font-bold text-xs px-3 py-1.5 rounded-full shadow-lg group-hover:bg-[#D4AF37] group-hover:text-white transition-colors duration-300">
            {deal.price}
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 left-3">
          <div className="bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
            <FaStar className="text-yellow-400 text-[10px]" />
            <span className="font-bold">{deal.rating}</span>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="p-5 flex flex-col flex-1">
        <ul className="space-y-2">
          {deal.items.slice(0, isExpanded ? deal.items.length : 3).map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-gray-700 dark:text-gray-300 text-sm">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5"
                style={{ backgroundColor: deal.color }}
              >
                {idx + 1}
              </span>
              <span>{typeof item === 'string' ? item : (item as any).name || JSON.stringify(item)}</span>
            </li>
          ))}
        </ul>

        {deal.items.length > 3 && (
          <button
            onClick={(e) => { e.preventDefault(); setIsExpanded(!isExpanded); }}
            className="mt-3 text-xs font-semibold flex items-center gap-1 transition-colors"
            style={{ color: deal.color }}
          >
            {isExpanded ? "Show Less" : `+${deal.items.length - 3} More`}
            <FaChevronRight className={`text-[10px] transition-transform ${isExpanded ? "rotate-90" : ""}`} />
          </button>
        )}

        {/* Book Now CTA */}
        <div className="mt-auto pt-4 flex items-center gap-3">
          <Link
            to={`/deals/${deal.id}`}
            className="flex-1 block text-center py-2.5 rounded-xl font-bold text-white text-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            style={{ backgroundColor: deal.color }}
          >
            Book Now — {deal.price}
          </Link>
          <div className="flex items-center gap-1 text-sm">
            <FaStar className="text-yellow-400 text-xs" />
            <span className="font-bold text-gray-800 dark:text-gray-200">{deal.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const DealsOffersSection = () => {
  const [deals, setDeals] = useState<DealCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const data = await getDeals();
        const normalized = (Array.isArray(data) ? data : []).map((deal: any) => ({
          ...deal,
          items: Array.isArray(deal.items) 
            ? deal.items.map((item: any) => typeof item === 'string' ? item : item.name || '')
            : [],
          price: typeof deal.price === 'string' ? deal.price : `$${deal.price}`,
        }));
        setDeals(normalized);
      } catch (error) {
        console.error("Error fetching deals:", error);
        setDeals([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  // GSAP stagger cards + header animation
  useEffect(() => {
    if (loading || !gridRef.current) return;
    const cards = gridRef.current.children;

    gsap.fromTo(cards,
      { y: 100, opacity: 0, scale: 0.85, rotateY: -10 },
      {
        y: 0, opacity: 1, scale: 1, rotateY: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

    // Header slide in
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, [loading]);

  return (
    <SectionWrapper>
      {/* Header */}
      <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 dark:from-[#D4AF37]/20 dark:to-transparent px-4 py-1.5 rounded-full mb-3">
            <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider">Exclusive Offers</span>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl text-display text-gray-900 dark:text-white leading-none tracking-tight">
            <SplitTextReveal text="Today's Best Deals" type="words" duration={1} />
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-lg text-sm">
            Book directly! Restaurants, hotels, safaris, Nile cruises and more — all with exclusive deals.
          </p>
        </div>
        <Link
          to="/activities"
          className="text-[#D4AF37] hover:text-[#c9a030] font-semibold text-sm flex items-center gap-1.5 group shrink-0 bg-[#D4AF37]/10 px-4 py-2 rounded-full hover:bg-[#D4AF37]/20 transition-all"
        >
          View All
          <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Cards Grid */}
      <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" style={{ perspective: "1200px" }}>
        {loading ? (
          <div className="col-span-full py-10 text-center text-gray-500">جاري تحميل العروض...</div>
        ) : deals.length > 0 ? (
          deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))
        ) : (
          <div className="col-span-full py-10 text-center text-gray-500">لا توجد عروض اليوم.</div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default DealsOffersSection;
