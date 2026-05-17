import SectionWrapper from "@/components/sections/SectionWrapper";
import { FaApple, FaGooglePlay, FaSearch, FaGlobe } from "react-icons/fa";

const MobileAppPage = () => {
  return (
    <div className="bg-[#fcfbf9] dark:bg-gray-900 min-h-screen overflow-hidden">
      <SectionWrapper className="pt-32 pb-24 relative">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text */}
          <div className="max-w-xl z-10">
            <div className="inline-block px-5 py-2 bg-[#EB662B]/10 text-[#EB662B] font-bold rounded-full text-sm mb-6 animate-fade-in-up shadow-sm border border-[#EB662B]/20">
              Available Now
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-[#14213d] dark:text-white mb-6 leading-[1.15] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Your Entire Journey, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#EB662B]">In Your Pocket.</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Discover Kemet directly from your mobile browser or download our app. Find the best flights, hotels, and authentic Egyptian tours on the go. Plan your itinerary seamlessly with AI and get exclusive deals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <button className="group flex items-center justify-center gap-3 bg-[#14213d] dark:bg-gray-800 border border-transparent dark:border-gray-700 text-white px-8 py-4 rounded-2xl hover:bg-black dark:hover:bg-gray-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1">
                <FaApple className="text-3xl group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider opacity-80">Download on the</div>
                  <div className="font-bold text-lg leading-none mt-1">App Store</div>
                </div>
              </button>
              <button className="group flex items-center justify-center gap-3 bg-gradient-to-r from-[#EB662B] to-[#d55822] text-white px-8 py-4 rounded-2xl hover:shadow-[0_10px_20px_rgba(235,102,43,0.3)] transition-all duration-300 shadow-xl hover:-translate-y-1">
                <FaGooglePlay className="text-3xl group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider opacity-80">GET IT ON</div>
                  <div className="font-bold text-lg leading-none mt-1">Google Play</div>
                </div>
              </button>
            </div>
          </div>

          {/* Right Mockup - Mobile Google Search */}
          <div className="relative h-[650px] flex justify-center items-center z-10 animate-fade-in-up group perspective-1000" style={{ animationDelay: '0.4s' }}>
            {/* Glow Behind Phone */}
            <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-full scale-125 blur-[100px] opacity-60 z-0 animate-pulse" style={{ animationDuration: '4s' }}></div>
            
            {/* Phone Frame */}
            <div className="relative z-10 w-[300px] h-[620px] bg-white rounded-[3rem] border-[14px] border-[#1a1a1a] shadow-[0_30px_60px_rgba(0,0,0,0.3)] skew-y-6 transform rotate-6 overflow-hidden flex flex-col transition-all duration-700 ease-out group-hover:rotate-0 group-hover:skew-y-0 group-hover:scale-105 group-hover:shadow-[0_40px_80px_rgba(212,175,55,0.2)]">
              
              {/* Phone Notch */}
              <div className="absolute top-0 inset-x-0 h-6 bg-[#1a1a1a] rounded-b-3xl w-40 mx-auto z-50"></div>
              
              {/* Mobile Browser Header */}
              <div className="pt-10 pb-3 px-4 bg-white border-b border-gray-100 shadow-sm z-40 relative">
                 <div className="flex items-center justify-center mb-4">
                    <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" className="h-6" />
                 </div>
                 {/* Search Bar */}
                 <div className="w-full bg-white border border-gray-200 rounded-full py-2.5 px-4 flex items-center shadow-sm">
                    <FaSearch className="text-gray-400 mr-3 text-sm" />
                    <span className="text-gray-800 text-[13px] font-medium flex-1 truncate">Kemet Tourism Egypt</span>
                 </div>
                 {/* Tabs */}
                 <div className="flex gap-5 mt-4 text-[12px] font-medium text-gray-500 overflow-hidden px-2">
                    <span className="text-blue-600 border-b-[3px] border-blue-600 pb-1.5 font-bold">All</span>
                    <span className="pb-1.5">Images</span>
                    <span className="pb-1.5">News</span>
                    <span className="pb-1.5">Maps</span>
                 </div>
              </div>

              {/* Mobile Search Results */}
              <div className="flex-1 bg-[#f8f9fa] overflow-hidden p-3 relative">
                 <p className="text-[11px] text-gray-500 mb-4 px-1">About 2,450,000 results</p>
                 
                 {/* Kemet Result */}
                 <div className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-100 relative overflow-hidden group/card cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 to-[#EB662B]/5 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                    <div className="flex items-center gap-2.5 mb-2">
                       <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm">
                          <img src="https://cdn-icons-png.flaticon.com/512/11516/11516147.png" alt="Kemet" className="w-4 h-4" />
                       </div>
                       <div>
                          <p className="text-[12px] text-[#202124] leading-none font-medium mb-1">Kemet Tourism Platform</p>
                          <p className="text-[10px] text-[#4d5156]">https://kemet-tourism.com</p>
                       </div>
                    </div>
                    <h3 className="text-[16px] text-[#1a0dab] font-medium leading-snug mb-2 group-hover/card:underline">
                      Kemet | Explore the Wonders of Egypt - Book Now
                    </h3>
                    <p className="text-[12px] text-[#4d5156] leading-relaxed">
                      Book the best tours, hotels, and museum tickets in Egypt. Plan your trip with our <span className="font-bold text-gray-800">AI Trip Planner</span>!
                    </p>
                 </div>

                 {/* Wikipedia Result */}
                 <div className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-100">
                    <div className="flex items-center gap-2.5 mb-2">
                       <div className="w-7 h-7 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200">
                          <span className="text-[12px] font-bold text-gray-600">W</span>
                       </div>
                       <div>
                          <p className="text-[12px] text-[#202124] leading-none font-medium mb-1">Wikipedia</p>
                          <p className="text-[10px] text-[#4d5156]">https://en.wikipedia.org</p>
                       </div>
                    </div>
                    <h3 className="text-[15px] text-[#1a0dab] font-medium leading-snug mb-2">
                      Kemet - Wikipedia
                    </h3>
                    <p className="text-[12px] text-[#4d5156] leading-relaxed">
                      Kemet was the name used by ancient Egyptians to refer to their land, translating to "Black Land"...
                    </p>
                 </div>
              </div>

              {/* Bottom Browser Bar */}
              <div className="h-14 bg-white border-t border-gray-200 flex justify-around items-center text-gray-400 text-xl px-2 z-40">
                 <FaGlobe className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer" />
                 <FaSearch className="hover:text-gray-600 transition-colors cursor-pointer" />
                 <div className="w-6 h-6 rounded border-[2.5px] border-gray-400 flex items-center justify-center text-[11px] font-bold hover:border-gray-600 hover:text-gray-600 transition-colors cursor-pointer">1</div>
              </div>

            </div>
          </div>

        </div>
      </SectionWrapper>
    </div>
  );
};

export default MobileAppPage;
