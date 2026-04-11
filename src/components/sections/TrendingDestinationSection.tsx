import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import DestinationCard from "../card/DestinationCard";
import Heading from "../Ui/Heading";
import SectionWrapper from "./SectionWrapper";

import { getDestinations } from "../../api/destinationService";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TrendingDestinationSection = () => {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  // GSAP stagger animation for cards
  useEffect(() => {
    if (loading || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll("[data-dest-card]");
    if (cards.length === 0) return;

    gsap.fromTo(cards,
      { y: 60, opacity: 0, scale: 0.8, rotateY: 15 },
      {
        y: 0, opacity: 1, scale: 1, rotateY: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

  }, [loading]);

  const content = destinations.slice(0, 8).map((item) => (
    <Link to={`/explore/${item.title}`} key={item.id} data-dest-card>
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
        <div className="flex items-center justify-between mb-6" ref={headingRef}>
          <Heading title="trending destination" />
        </div>
      <div ref={gridRef} className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8" style={{ perspective: "1000px" }}>
        {loading ? (
          <div className="col-span-full py-10 text-center text-gray-500">جاري تحميل الوجهات...</div>
        ) : (
          content
        )}
      </div>
      </SectionWrapper>
    </div>
  );
};

export default TrendingDestinationSection;
