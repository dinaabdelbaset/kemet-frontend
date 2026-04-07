import SectionWrapper from "@/components/sections/SectionWrapper";
import { useState } from "react";
import { FaChevronDown, FaSearch } from "react-icons/fa";

const HelpCenterPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    { question: "How do I cancel my booking?", answer: "You can cancel your booking up to 24 hours before your scheduled activity or check-in date for a full refund. Go to your My Bookings page and click 'Cancel'." },
    { question: "Are my payment details secure?", answer: "Yes, we use industry-standard encryption to protect your payment information. We never store full credit card numbers on our servers." },
    { question: "How can I contact my tour guide?", answer: "Once your booking is confirmed, you will receive an email with your tour guide's direct contact information and meeting instructions." },
    { question: "Do you offer group discounts?", answer: "Yes! For groups of 10 or more, please contact our support team directly at support@viatours.com to request a special group rate." },
    { question: "What happens if it rains during an outdoor tour?", answer: "If an activity is canceled by the operator due to severe weather, you will be offered a different date or a full refund." }
  ];

  return (
    <div className="bg-[#fcfbf9] min-h-screen">
      <SectionWrapper className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#14213d] mb-6 font-serif">Help Center</h1>
            <p className="text-lg text-gray-500 mb-8">How can we help you today?</p>
            
            <div className="relative max-w-xl mx-auto">
              <input 
                type="text" 
                placeholder="Search for answers..." 
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:border-[#cd4f3c] text-lg transition"
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            </div>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-[#14213d] mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden">
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition text-left"
                  >
                    <span className="font-bold text-[#14213d]">{faq.question}</span>
                    <FaChevronDown className={`text-gray-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="p-6 pt-0 bg-white text-gray-600 leading-relaxed border-t border-gray-50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-8 bg-[#FFF7F3] rounded-2xl text-center">
              <h3 className="text-xl font-bold text-[#14213d] mb-3">Still have questions?</h3>
              <p className="text-gray-600 mb-6">If you cannot find the answer to your question in our FAQ, you can always contact us. We will answer to you shortly!</p>
              <button className="px-6 py-3 bg-[#cd4f3c] text-white font-bold rounded-xl hover:bg-[#b03c2b] transition">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default HelpCenterPage;
