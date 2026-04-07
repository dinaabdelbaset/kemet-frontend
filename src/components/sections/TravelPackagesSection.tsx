import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getTravelPackages } from "../../api/tripService";
import Heading from "../Ui/Heading";
import TravelBlogCard from "../card/TravelBlogCard";
import SectionWrapper from "./SectionWrapper";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TravelPackagesSection = () => {
    const gridRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const [packages, setPackages] = useState<any[]>([]);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const data = await getTravelPackages();
                setPackages(Array.isArray(data) ? data.slice(0, 3) : []);
            } catch (error) {
                console.error("Error fetching packages:", error);
                setPackages([]);
            }
        };
        fetchPackages();
    }, []);

    useEffect(() => {
        if (!gridRef.current || packages.length === 0) return;
        const cards = gridRef.current.children;

        gsap.fromTo(cards,
            { y: 100, opacity: 0, scale: 0.85, rotateX: 12 },
            {
                y: 0, opacity: 1, scale: 1, rotateX: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "back.out(1.5)",
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
            }
        );

  }, [packages]);

    return (
        <SectionWrapper id="travel-packages">
            <div className="flex items-center justify-between mb-6" ref={headingRef}>
                <Heading title="Travel Packages Tours" />
            </div>
            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ perspective: "1200px" }}>
                {packages.map((pkg) => (
                    <TravelBlogCard key={pkg.id} pkg={pkg} />
                ))}
            </div>
        </SectionWrapper>
    );
};

export default TravelPackagesSection;
