import SectionWrapper from "@/components/sections/SectionWrapper";
import { FaSearchLocation, FaCalendarCheck, FaSuitcaseRolling } from "react-icons/fa";

const HowItWorksPage = () => {
  const steps = [
    {
      icon: <FaSearchLocation />,
      title: "1. Find Your Destination",
      description: "Browse through thousands of destinations, hotels, and exotic tours using our advanced search to find your perfect getaway."
    },
    {
      icon: <FaCalendarCheck />,
      title: "2. Book & Pay Securely",
      description: "Select your dates, add your details, and checkout securely using our encrypted payment gateway. Instant confirmation guaranteed."
    },
    {
      icon: <FaSuitcaseRolling />,
      title: "3. Pack & Go",
      description: "Receive your e-tickets and detailed itineraries via email. All you have to do is pack your bags and enjoy the experience."
    }
  ];

  return (
    <div className="bg-[#fcfbf9] min-h-screen">
      <SectionWrapper className="pt-24 pb-16">
        <div className="text-center max-w-3xl mx-auto px-4 mb-16">
          <h1 className="text-5xl font-extrabold text-[#14213d] mb-6 font-serif">How It Works</h1>
          <p className="text-lg text-gray-500">
            Booking your dream vacation has never been easier. Follow these three simple steps to start your journey.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-white p-10 rounded-[2rem] shadow-sm text-center border border-gray-100 hover:shadow-lg transition">
              <div className="w-20 h-20 mx-auto bg-[#FFF7F3] rounded-full flex items-center justify-center text-3xl text-[#cd4f3c] mb-6">
                {step.icon}
              </div>
              <h2 className="text-2xl font-bold text-[#14213d] mb-4">{step.title}</h2>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </SectionWrapper>
    </div>
  );
};

export default HowItWorksPage;
