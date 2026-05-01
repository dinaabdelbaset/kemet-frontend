import { lazy, Suspense, useEffect, useState } from "react";
import { Marquee } from "@/components/Ui/marquee";
import Hero from "../components/sections/HeroSection";
import TickerStrip from "../components/common/TickerStrip";

// Lazy load below-the-fold sections to drastically speed up initial load
const CustomerReviewSection = lazy(() => import("../components/sections/CustomerReviewSection"));
const DealsOffersSection = lazy(() => import("../components/sections/DealsOffersSection"));
const PopularToursSection = lazy(() => import("../components/sections/PopularToursSection"));
const PromoBanner = lazy(() => import("../components/sections/PromoBanner"));
const TrendingDestinationSection = lazy(() => import("../components/sections/TrendingDestinationSection"));
const WhyChooseUsSection = lazy(() => import("../components/sections/WhyChooseUsSection"));

const ParallaxCTA = lazy(() => import("../components/sections/ParallaxCTA"));
const GlobeSection = lazy(() => import("../components/sections/GlobeSection"));
const TextRevealSection = lazy(() => import("../components/sections/TextRevealSection"));
const ScrollStatsSection = lazy(() => import("../components/sections/ScrollStatsSection"));
import { getHomeMarquee } from "../api/contentService";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useScrollReveal } from "../hooks/useAnimations";
import SEO from "../components/common/SEO";

const HomePage = () => {
  useDocumentTitle("Home");

  // GSAP scroll reveal refs
  const whyRef = useScrollReveal({ y: 60, stagger: 0.2 });
  const trendingRef = useScrollReveal({ y: 80, stagger: 0.15 });
  const marqueeRef = useScrollReveal({ y: 40, duration: 1 });
  const toursRef = useScrollReveal({ y: 60, stagger: 0.12 });
  const promoRef = useScrollReveal({ y: 100, scale: 0.95, duration: 1 });
  const dealsRef = useScrollReveal({ y: 60, stagger: 0.15 });

  const reviewRef = useScrollReveal({ y: 40, duration: 1.2 });

  const [marqueeData, setMarqueeData] = useState({ cities1: [], cities2: [] });

  useEffect(() => {
    getHomeMarquee().then(data => {
      setMarqueeData({ cities1: data.cities1 || [], cities2: data.cities2 || [] });
    }).catch(e => console.error(e));
  }, []);

  return (
    <>
      <SEO 
        title="Kemet | Explore the Wonders of Egypt" 
        description="Book the best tours, hotels, and museum tickets in Egypt. Your ultimate guide to the Pyramids, Nile Cruises, and the Red Sea." 
        keywords="Egypt tourism, pyramids tour, Cairo hotels, Nile cruise, Sharm el-Sheikh, Luxor temples" 
      />
      <Hero />

      {/* ═══ TICKER STRIP 1 - After Hero ═══ */}
      <TickerStrip
        items={[
          "PYRAMIDS OF GIZA",
          "LUXOR TEMPLES",
          "RED SEA DIVING",
          "NILE CRUISE",
          "SAHARA SAFARI",
          "ALEXANDRIA",
          "ASWAN",
          "HURGHADA",
          "SHARM EL-SHEIKH",
          "SIWA OASIS",
        ]}
        variant="dark"
        size="lg"
        separator="star"
        speed="normal"
      />

      <Suspense fallback={<div className="h-40 flex justify-center items-center"><div className="animate-pulse w-8 h-8 rounded-full bg-gray-200"></div></div>}>
        <div ref={whyRef}>
          <WhyChooseUsSection />
        </div>

        <div ref={trendingRef}>
          <TrendingDestinationSection />
        </div>

        <div ref={marqueeRef} className="relative my-12 flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-linear-to-r from-white dark:from-[#121212] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-linear-to-l from-white dark:from-[#121212] to-transparent z-10" />
          <div className="w-full">
            <Marquee className="[--duration:20s] gap-6">
              {marqueeData.cities1.map((city, idx) => (
                <span key={idx} className="px-6 py-2.5 rounded-full bg-white dark:bg-gray-800 border-2 border-transparent text-gray-700 dark:text-gray-300 text-sm font-semibold shadow-sm transition-all duration-500 hover:-translate-y-1 hover:bg-[#1A365D] hover:text-[#D4AF37] hover:border-[#D4AF37] hover:shadow-[0_8px_20px_rgba(212,175,55,0.4)] cursor-pointer">{city}</span>
              ))}
            </Marquee>
          </div>
          <div className="w-full mt-4">
            <Marquee reverse className="[--duration:20s] gap-6">
              {marqueeData.cities2.map((city, idx) => (
                <span key={idx} className="px-6 py-2.5 rounded-full bg-white dark:bg-gray-800 border-2 border-transparent text-gray-700 dark:text-gray-300 text-sm font-semibold shadow-sm transition-all duration-500 hover:-translate-y-1 hover:bg-[#1A365D] hover:text-[#D4AF37] hover:border-[#D4AF37] hover:shadow-[0_8px_20px_rgba(212,175,55,0.4)] cursor-pointer">{city}</span>
              ))}
            </Marquee>
          </div>
        </div>

        {/* ✨ TEXT REVEAL - Scroll-linked text animation */}
        <TextRevealSection />

        <div ref={toursRef}>
          <PopularToursSection />
        </div>

        {/* ═══ TICKER STRIP 2 - Before Globe (Gradient) ═══ */}
        <TickerStrip
          items={[
            "5,000+ HAPPY TRAVELERS",
            "50+ DESTINATIONS",
            "4.9 ★ AVERAGE RATING",
            "100+ TOURS & ACTIVITIES",
            "24/7 SUPPORT",
            "BEST PRICE GUARANTEE",
            "FREE CANCELLATION",
            "EXPERT LOCAL GUIDES",
          ]}
          variant="gradient"
          size="md"
          separator="diamond"
          speed="slow"
          reverse
        />

        {/* 🌍 3D GLOBE - Three.js particle sphere */}
        <GlobeSection />

        {/* 📊 STATS - Animated counters on scroll */}
        <ScrollStatsSection />

        <div ref={promoRef}>
          <PromoBanner />
        </div>

        <div ref={dealsRef}>
          <DealsOffersSection />
        </div>

        {/* ═══ TICKER STRIP 3 - Before Parallax CTA ═══ */}
        <TickerStrip
          items={[
            "BOOK NOW",
            "EXCLUSIVE DEALS",
            "LIMITED TIME OFFERS",
            "PREMIUM EXPERIENCES",
            "UNFORGETTABLE JOURNEYS",
            "ADVENTURE AWAITS",
            "DISCOVER EGYPT",
            "YOUR NEXT TRIP",
          ]}
          variant="dark"
          size="xl"
          separator="arrow"
          speed="fast"
        />

        {/* 🏔️ PARALLAX CTA */}
        <ParallaxCTA />


        {/* ═══ TICKER STRIP 4 - Before Reviews (Light) ═══ */}
        <TickerStrip
          items={[
            "★★★★★ RATED EXCELLENT",
            "TRUSTED BY THOUSANDS",
            "TOP-RATED ON TRIPADVISOR",
            "CERTIFIED TOUR OPERATOR",
            "AWARD-WINNING SERVICE",
            "HAND-PICKED EXPERIENCES",
          ]}
          variant="light"
          size="sm"
          separator="slash"
          speed="slow"
          reverse
        />

        <div ref={reviewRef}>
          <CustomerReviewSection />
        </div>
      </Suspense>
    </>
  );
};

export default HomePage;
