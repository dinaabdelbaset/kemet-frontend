import SectionWrapper from "@/components/sections/SectionWrapper";
import { FaApple, FaGooglePlay } from "react-icons/fa";

const MobileAppPage = () => {
  return (
    <div className="bg-white min-h-screen overflow-hidden">
      <SectionWrapper className="pt-24 pb-16 relative">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text */}
          <div className="max-w-xl z-10">
            <div className="inline-block px-4 py-1.5 bg-[#FFF7F3] text-[#cd4f3c] font-bold rounded-full text-sm mb-6">
              Available Now
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#14213d] mb-6 leading-[1.1]">
              Your Entire Journey, <br/>In Your Pocket.
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-10">
              Download the Viatours app to book flights, hotels, and tours on the go. Get exclusive mobile-only deals and manage your itinerary offline.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition shadow-lg">
                <FaApple className="text-3xl" />
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider opacity-80">Download on the</div>
                  <div className="font-bold text-lg leading-none">App Store</div>
                </div>
              </button>
              <button className="flex items-center justify-center gap-3 bg-[#cd4f3c] text-white px-8 py-4 rounded-xl hover:bg-[#b03c2b] transition shadow-lg">
                <FaGooglePlay className="text-3xl" />
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider opacity-80">GET IT ON</div>
                  <div className="font-bold text-lg leading-none">Google Play</div>
                </div>
              </button>
            </div>
          </div>

          {/* Right Mockup */}
          <div className="relative h-[600px] flex justify-center items-center z-10">
            <div className="absolute inset-0 bg-[#FFF7F3] rounded-full scale-110 blur-3xl opacity-50 z-0"></div>
            <img 
              src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=800" 
              alt="Mobile App" 
              className="relative z-10 w-[300px] h-[600px] object-cover rounded-[3rem] border-[12px] border-black shadow-2xl skew-y-6 transform rotate-6"
            />
          </div>

        </div>
      </SectionWrapper>
    </div>
  );
};

export default MobileAppPage;
