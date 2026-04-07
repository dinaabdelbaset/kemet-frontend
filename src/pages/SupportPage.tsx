import SectionWrapper from "@/components/sections/SectionWrapper";
import { Link } from "react-router-dom";
import { FaHeadset, FaQuestionCircle, FaEnvelopeOpenText } from "react-icons/fa";

const SupportPage = () => {
  return (
    <div className="bg-[#fcfbf9] min-h-screen">
      <SectionWrapper className="pt-24 pb-20">
        <div className="text-center max-w-3xl mx-auto px-4 mb-20">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#14213d] mb-6 font-serif">Support & Help</h1>
          <p className="text-lg text-gray-500">
            We're here for you 24/7. Choose how you want to get in touch or find answers instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          
          <Link to="/help-center" className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center group hover:shadow-xl transition">
            <div className="w-20 h-20 mx-auto bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition duration-300">
              <FaQuestionCircle />
            </div>
            <h2 className="text-2xl font-bold text-[#14213d] mb-4">FAQ & Help Center</h2>
            <p className="text-gray-600 mb-8">
              Find quick answers to common questions about bookings, payments, and cancellations.
            </p>
            <span className="text-blue-500 font-bold">Visit Help Center →</span>
          </Link>

          <Link to="/contact" className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center group hover:shadow-xl transition relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#cd4f3c]/5 rounded-bl-full -z-10"></div>
            <div className="w-20 h-20 mx-auto bg-[#cd4f3c]/10 text-[#cd4f3c] rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition duration-300">
              <FaEnvelopeOpenText />
            </div>
            <h2 className="text-2xl font-bold text-[#14213d] mb-4">Send us an Email</h2>
            <p className="text-gray-600 mb-8">
              Got a specific inquiry? Send us an email and our team will get back to you within 24 hours.
            </p>
            <span className="text-[#cd4f3c] font-bold">Contact Us →</span>
          </Link>

          <div 
            onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
            className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center group hover:shadow-xl transition cursor-pointer"
          >
            <div className="w-20 h-20 mx-auto bg-green-50 text-green-500 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition duration-300">
              <FaHeadset />
            </div>
            <h2 className="text-2xl font-bold text-[#14213d] mb-4">Live Chat</h2>
            <p className="text-gray-600 mb-8">
              Need immediate assistance? Click here to start a live conversation with our AI.
            </p>
            <span className="text-green-500 font-bold">Try Chatbot ↘</span>
          </div>

        </div>
      </SectionWrapper>
    </div>
  );
};

export default SupportPage;
