import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef, useCallback } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import FloatingChatbot from "../components/layout/FloatingChatbot";
import AuthModal from "../components/auth/AuthModal";
import WhatsAppButton from "../components/layout/WhatsAppButton";
import NavigationButtons from "../components/common/NavigationButtons";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const RootLayout = () => {
  useSmoothScroll();
  const location = useLocation();


  // Refresh ScrollTrigger on route change + page transition
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Smooth page entrance
    const main = document.querySelector("main");
    if (main) {
      gsap.fromTo(main,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", clearProps: "transform" }
      );
    }

    // Refresh after DOM settles
    const timer = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#121212] transition-colors duration-300 w-full">

      <Navbar />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <Footer /> 
      <FloatingChatbot />
      <AuthModal />
      <WhatsAppButton />
      <NavigationButtons />
    </div>
  );
};

export default RootLayout;
