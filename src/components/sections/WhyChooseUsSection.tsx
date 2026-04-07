import { useEffect, useRef, useState } from "react";
import { getWhyChooseUs } from "../../api/contentService";
import FeatureCard from "../card/FeatureCard ";
import Heading from "../Ui/Heading";
import SectionWrapper from "./SectionWrapper";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WhyChooseUsSection = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.children;

    // 3D card stagger
    gsap.fromTo(cards,
      { y: 100, opacity: 0, scale: 0.85, rotateX: 15 },
      {
        y: 0, opacity: 1, scale: 1, rotateX: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

  }, []);

  const [whyChooseData, setWhyChooseData] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWhyChooseUs();
        if (Array.isArray(data)) setWhyChooseData(data);
      } catch (e) { console.error('Error fetching why choose us:', e); }
    };
    fetchData();
  }, []);

  const data = whyChooseData.map((item) => (
    <FeatureCard {...item} key={item.id} />
  ));
  return (
    <SectionWrapper>
      <div ref={headingRef}>
        <Heading title="why choose us" />
      </div>
      <div ref={gridRef} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4" style={{ perspective: "1000px" }}>
        {data}
      </div>
    </SectionWrapper>
  );
};

export default WhyChooseUsSection;
