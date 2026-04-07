import SectionWrapper from "@/components/sections/SectionWrapper";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

const ContactPage = () => {
  return (
    <div className="bg-[#fcfbf9] min-h-screen">
      <SectionWrapper className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto text-center mb-16 px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-[#14213d] mb-6 font-serif">Get in Touch</h1>
          <p className="text-lg text-gray-600">
            We'd love to hear from you. Whether you have a question about bookings, features, trials, pricing, or anything else, our team is ready to answer all your questions.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#cd4f3c]/10 text-[#cd4f3c] rounded-full flex items-center justify-center text-2xl mb-4">
                <FaMapMarkerAlt />
              </div>
              <h3 className="text-xl font-bold text-[#14213d] mb-2">Our Office</h3>
              <p className="text-gray-500">328 Queensberry Street, North Melbourne VIC3051, Australia.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#cd4f3c]/10 text-[#cd4f3c] rounded-full flex items-center justify-center text-2xl mb-4">
                <FaEnvelope />
              </div>
              <h3 className="text-xl font-bold text-[#14213d] mb-2">Email Us</h3>
              <p className="text-gray-500">nasere489@gmail.com</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#cd4f3c]/10 text-[#cd4f3c] rounded-full flex items-center justify-center text-2xl mb-4">
                <FaPhoneAlt />
              </div>
              <h3 className="text-xl font-bold text-[#14213d] mb-2">Call Us</h3>
              <p className="text-gray-500">+1 234 567 8900</p>
              <p className="text-sm text-gray-400 mt-2">Mon-Fri 8am to 8pm</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
             <h2 className="text-2xl font-bold text-[#14213d] mb-8">Send us a Message</h2>
             <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                    <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#cd4f3c] transition" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input type="email" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#cd4f3c] transition" placeholder="john@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#cd4f3c] transition" placeholder="How can we help?" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea rows={6} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#cd4f3c] transition" placeholder="Tell us more about your inquiry..."></textarea>
                </div>
                <button type="button" className="px-8 py-4 bg-[#cd4f3c] text-white font-bold rounded-xl hover:bg-[#b03c2b] transition shadow-md w-full md:w-auto">
                  Send Message
                </button>
             </form>
          </div>

        </div>
      </SectionWrapper>
    </div>
  );
};

export default ContactPage;
