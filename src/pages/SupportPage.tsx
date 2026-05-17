import SectionWrapper from "@/components/sections/SectionWrapper";
import { Link } from "react-router-dom";
import { FaHeadset, FaQuestionCircle, FaEnvelopeOpenText } from "react-icons/fa";

const SupportPage = () => {
  return (
    <div className="bg-[#fcfbf9] dark:bg-gray-900 min-h-screen overflow-hidden">
      
      {/* Ultra Slim Animated Hero Section - Bright Design */}
      <div className="relative pt-[100px] pb-8 overflow-hidden bg-gradient-to-b from-white to-[#fcfbf9] dark:from-gray-900 dark:to-gray-800 border-b border-gray-100 dark:border-gray-800">
        <div className="absolute top-0 left-[-10%] w-[400px] h-[400px] bg-[#D4AF37]/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-0 right-[-10%] w-[400px] h-[400px] bg-[#EB662B]/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '8s', animationDirection: 'alternate' }}></div>
        
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4 flex flex-col items-center justify-center">
          <div className="inline-flex items-center gap-3 mb-3">
             <div className="p-2.5 bg-[#EB662B]/10 rounded-xl shadow-sm border border-[#EB662B]/20 animate-bounce" style={{ animationDuration: '3s' }}>
               <FaHeadset className="text-[#EB662B] text-2xl" />
             </div>
             <h1 className="text-3xl md:text-4xl font-black text-[#14213d] dark:text-white drop-shadow-sm animate-fade-in-up">
               Support & Help
             </h1>
          </div>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 animate-fade-in-up max-w-xl mx-auto font-medium" style={{ animationDelay: '0.2s' }}>
            We're here for you 24/7. Choose how you want to get in touch.
          </p>
        </div>
      </div>

      <SectionWrapper className="pb-16 pt-0 relative -mt-4 z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          
          {/* Card 1: Help Center */}
          <Link to="/help-center" className="group bg-white dark:bg-gray-800 p-10 rounded-[2rem] shadow-lg hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] border border-gray-100 dark:border-gray-700 hover:border-[#D4AF37] text-center transform transition-all duration-500 hover:-translate-y-2 animate-fade-in-up block" style={{ animationDelay: '0.3s' }}>
            <div className="w-20 h-20 mx-auto bg-[#D4AF37]/10 group-hover:bg-[#D4AF37] group-hover:text-white transition-colors duration-500 text-[#D4AF37] rounded-full flex items-center justify-center text-3xl mb-6 shadow-sm transform group-hover:rotate-12">
              <FaQuestionCircle />
            </div>
            <h2 className="text-2xl font-extrabold text-[#14213d] dark:text-white mb-4 transition-colors group-hover:text-[#D4AF37]">FAQ & Help Center</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              Find quick answers to common questions about bookings, payments, and cancellations.
            </p>
            <span className="inline-flex items-center gap-2 text-[#D4AF37] font-bold group-hover:translate-x-2 transition-transform">
              Visit Help Center <span className="text-xl">→</span>
            </span>
          </Link>

          {/* Card 2: Contact Us */}
          <Link to="/contact" className="group bg-white dark:bg-gray-800 p-10 rounded-[2rem] shadow-lg hover:shadow-[0_20px_40px_rgba(235,102,43,0.15)] border border-gray-100 dark:border-gray-700 hover:border-[#EB662B] text-center transform transition-all duration-500 hover:-translate-y-2 animate-fade-in-up block relative overflow-hidden" style={{ animationDelay: '0.4s' }}>
            <div className="w-20 h-20 mx-auto bg-[#EB662B]/10 group-hover:bg-[#EB662B] group-hover:text-white transition-colors duration-500 text-[#EB662B] rounded-full flex items-center justify-center text-3xl mb-6 shadow-sm transform group-hover:rotate-12">
              <FaEnvelopeOpenText />
            </div>
            <h2 className="text-2xl font-extrabold text-[#14213d] dark:text-white mb-4 transition-colors group-hover:text-[#EB662B]">Send us an Email</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              Got a specific inquiry? Send us an email and our team will get back to you within 24 hours.
            </p>
            <span className="inline-flex items-center gap-2 text-[#EB662B] font-bold group-hover:translate-x-2 transition-transform">
              Contact Us <span className="text-xl">→</span>
            </span>
          </Link>

          {/* Card 3: Live Chat */}
          <div 
            onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
            className="group bg-white dark:bg-gray-800 p-10 rounded-[2rem] shadow-lg hover:shadow-[0_20px_40px_rgba(5,7,60,0.15)] border border-gray-100 dark:border-gray-700 hover:border-[#05073C] dark:hover:border-blue-400 text-center transform transition-all duration-500 hover:-translate-y-2 animate-fade-in-up cursor-pointer" style={{ animationDelay: '0.5s' }}
          >
            <div className="w-20 h-20 mx-auto bg-[#05073C]/10 group-hover:bg-[#05073C] group-hover:text-white transition-colors duration-500 text-[#05073C] rounded-full flex items-center justify-center text-3xl mb-6 shadow-sm transform group-hover:scale-110">
              <FaHeadset className="animate-pulse" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#14213d] dark:text-white mb-4 transition-colors group-hover:text-[#05073C] dark:group-hover:text-blue-400">Live AI Chat</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              Need immediate assistance? Click here to start a live conversation with our smart AI assistant.
            </p>
            <span className="inline-flex items-center gap-2 text-[#05073C] dark:text-blue-400 font-bold group-hover:translate-y-1 transition-transform">
              Try Chatbot <span className="text-xl">↘</span>
            </span>
          </div>

        </div>
      </SectionWrapper>
    </div>
  );
};

export default SupportPage;
