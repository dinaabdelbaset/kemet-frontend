import SectionWrapper from "@/components/sections/SectionWrapper";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaPaperPlane, FaHeadset } from "react-icons/fa";

const ContactPage = () => {
  return (
    <div className="bg-[#fcfbf9] dark:bg-gray-900 min-h-screen overflow-hidden">
      
      {/* Animated Hero Section */}
      <div className="relative pt-40 pb-24 overflow-hidden bg-[#05073C]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute -top-[50%] -left-[10%] w-[500px] h-[500px] bg-[#D4AF37]/20 blur-[150px] rounded-full animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute -bottom-[50%] -right-[10%] w-[500px] h-[500px] bg-[#EB662B]/20 blur-[150px] rounded-full animate-pulse" style={{ animationDuration: '8s', animationDirection: 'alternate' }}></div>
        
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-3xl mb-6 backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(212,175,55,0.15)] animate-bounce" style={{ animationDuration: '3s' }}>
             <FaHeadset className="text-[#D4AF37] text-4xl" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-[#D4AF37] mb-6 drop-shadow-xl animate-fade-in-up">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            We'd love to hear from you. Whether you have a question about bookings, features, trials, pricing, or anything else, our team is ready to answer all your questions.
          </p>
        </div>
      </div>

      <SectionWrapper className="py-20 relative -mt-10 z-20">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Card 1 */}
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-lg hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] border border-gray-100 dark:border-gray-700 hover:border-[#D4AF37] flex flex-col items-center text-center transform transition-all duration-500 hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-16 h-16 bg-[#EB662B]/10 group-hover:bg-[#EB662B] group-hover:text-white transition-colors duration-500 text-[#EB662B] rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm transform group-hover:rotate-12">
                <FaMapMarkerAlt />
              </div>
              <h3 className="text-xl font-extrabold text-[#14213d] dark:text-white mb-2">Our Office</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">328 Queensberry Street, cairo,Egypt.</p>
            </div>

            {/* Card 2 */}
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-lg hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] border border-gray-100 dark:border-gray-700 hover:border-[#D4AF37] flex flex-col items-center text-center transform transition-all duration-500 hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="w-16 h-16 bg-[#D4AF37]/10 group-hover:bg-[#D4AF37] group-hover:text-white transition-colors duration-500 text-[#D4AF37] rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm transform group-hover:rotate-12">
                <FaEnvelope />
              </div>
              <h3 className="text-xl font-extrabold text-[#14213d] dark:text-white mb-2">Email Us</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">dinaabdelbaset@gmail.com</p>
            </div>

            {/* Card 3 */}
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-lg hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] border border-gray-100 dark:border-gray-700 hover:border-[#D4AF37] flex flex-col items-center text-center transform transition-all duration-500 hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="w-16 h-16 bg-[#1A365D]/10 group-hover:bg-[#05073C] group-hover:text-white transition-colors duration-500 text-[#05073C] rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm transform group-hover:rotate-12">
                <FaPhoneAlt />
              </div>
              <h3 className="text-xl font-extrabold text-[#14213d] dark:text-white mb-2">Call Us</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">+1 234 567 8900</p>
              <p className="text-xs text-gray-400 mt-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">Mon-Fri 8am to 8pm</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-10 md:p-12 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
             <h2 className="text-3xl font-extrabold text-[#14213d] dark:text-white mb-8 border-b border-gray-100 dark:border-gray-700 pb-4">Send us a Message</h2>
             <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-[#EB662B] transition-colors">Your Name</label>
                    <input type="text" className="w-full border-2 border-gray-100 dark:border-gray-700 dark:bg-gray-900 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#EB662B] focus:ring-4 focus:ring-[#EB662B]/10 transition-all font-medium" placeholder="John Doe" />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-[#EB662B] transition-colors">Email Address</label>
                    <input type="email" className="w-full border-2 border-gray-100 dark:border-gray-700 dark:bg-gray-900 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#EB662B] focus:ring-4 focus:ring-[#EB662B]/10 transition-all font-medium" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-[#D4AF37] transition-colors">Subject</label>
                  <input type="text" className="w-full border-2 border-gray-100 dark:border-gray-700 dark:bg-gray-900 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 transition-all font-medium" placeholder="How can we help?" />
                </div>
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-[#05073C] transition-colors">Message</label>
                  <textarea rows={6} className="w-full border-2 border-gray-100 dark:border-gray-700 dark:bg-gray-900 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#05073C] focus:ring-4 focus:ring-[#05073C]/10 transition-all font-medium resize-none" placeholder="Tell us more about your inquiry..."></textarea>
                </div>
                <button type="button" className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-[#05073C] to-[#1A365D] hover:from-[#EB662B] hover:to-[#d55822] text-white font-extrabold text-lg rounded-2xl transition-all duration-500 shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3 group">
                  Send Message <FaPaperPlane className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
             </form>
          </div>

        </div>
      </SectionWrapper>
    </div>
  );
};

export default ContactPage;
