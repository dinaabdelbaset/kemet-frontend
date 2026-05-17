import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import DestinationCard from "../card/DestinationCard";
import Heading from "../Ui/Heading";
import SectionWrapper from "./SectionWrapper";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getDestinations } from "../../api/destinationService";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TrendingDestinationSection = () => {
  const defaultDestinations = [
    { id: 1, title: 'Cairo', src: '/images/tour-desert-safari.png', tours: 142 },
    { id: 2, title: 'Luxor', src: '/images/luxor-souk.png', tours: 89 },
    { id: 3, title: 'Aswan', src: '/images/aswan-nubian-market.png', tours: 74 },
    { id: 4, title: 'Alexandria', src: '/images/era-greco-roman.png', tours: 105 },
    { id: 5, title: 'Hurghada', src: '/images/tour-red-sea.png', tours: 112 },
    { id: 6, title: 'Sharm El.S', src: '/images/home/dest-redsea.jpg', tours: 95 },
    { id: 7, title: 'Marsa Alam', src: '/images/tour-red-sea.png', tours: 63 },
    { id: 8, title: 'Dahab', src: '/images/saint-catherine.png', tours: 48 },
  ];

  const [destinations, setDestinations] = useState<any[]>(defaultDestinations);
  const [loading, setLoading] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await getDestinations();
        if (Array.isArray(data) && data.length > 0) {
          setDestinations(data);
        } else if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
          setDestinations(data.data);
        } else {
          setDestinations([]);
        }
      } catch (error) {
        console.error("Error fetching destinations:", error);
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  // Sleek, modern GSAP stagger animation for cards
  useEffect(() => {
    if (loading || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll("[data-dest-card]");
    if (cards.length === 0) return;

    gsap.fromTo(cards,
      { y: 40, opacity: 0, filter: "blur(5px)" },
      {
        y: 0, opacity: 1, filter: "blur(0px)",
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

  }, [loading]);

  const scrollLeft = () => {
    if (gridRef.current) {
      gridRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (gridRef.current) {
      gridRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const content = destinations.slice(0, 12).map((item) => (
    <Link to={`/explore/${item.title}`} key={item.id} data-dest-card className="flex-shrink-0 w-28 sm:w-36 snap-center">
      <DestinationCard 
        id={item.id}
        src={item.src || '/placeholder.png'} 
        alt={item.title || item.alt} 
        title={item.title} 
        tours={item.tours || Math.floor(Math.random() * 500) + 50} 
      />
    </Link>
  ));
  return (
    <div id="trending-destinations">
      <SectionWrapper>
        <div className="flex items-center justify-between mb-8" ref={headingRef}>
          <Heading title="trending destination" />
          <div className="flex gap-2">
            <button onClick={scrollLeft} className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow hover:bg-[#D4AF37] hover:text-white flex justify-center items-center transition-colors border border-gray-100 dark:border-gray-700">
              <FaChevronLeft className="text-sm" />
            </button>
            <button onClick={scrollRight} className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow hover:bg-[#D4AF37] hover:text-white flex justify-center items-center transition-colors border border-gray-100 dark:border-gray-700">
              <FaChevronRight className="text-sm" />
            </button>
          </div>
        </div>
        
        <div 
          ref={gridRef} 
          className="flex overflow-x-auto gap-4 sm:gap-8 pb-12 pt-4 px-4 sm:px-8 hide-scrollbars snap-x snap-mandatory" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style dangerouslySetInnerHTML={{__html: `
            .hide-scrollbars::-webkit-scrollbar {
              display: none;
            }
          `}} />
          {loading ? (
            <div className="col-span-full py-10 text-center text-gray-500 w-full">جاري تحميل الوجهات...</div>
          ) : (
            content
          )}
        </div>
      </SectionWrapper>
    </div>
  );
};

export default TrendingDestinationSection;
