import { useEffect, useRef, useState } from "react";
import TourCard from "../card/TourCard";
import Heading from "../Ui/Heading";
import SectionWrapper from "./SectionWrapper";
import { getTours } from "../../api/tripService";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PopularToursSection = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [tours, setTours] = useState<any[]>([]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await getTours();
        setTours(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch (error) {
        console.error("Error fetching tours:", error);
        setTours([]);
      }
    };
    fetchTours();
  }, []);

  // GSAP stagger cards animation on scroll
  useEffect(() => {
    if (!gridRef.current || tours.length === 0) return;
    const cards = Array.from(gridRef.current.children);
    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      { y: 80, opacity: 0, scale: 0.9, rotateX: 8 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateX: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [tours]);

  return (
    <SectionWrapper>
      <div className="flex items-center justify-between mb-6">
        <Heading title="find popular tours" />
      </div>
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
        style={{ perspective: "1200px" }}
      >
        {tours.map((tour) => (
          <TourCard
            key={tour.id}
            tour={{
              ...tour,
              gallery: tour.gallery ?? [],
              reviewCount: tour.reviewCount ?? 250,
            }}
          />
        ))}
      </div>
    </SectionWrapper>
  );
};

export default PopularToursSection;
