import SectionWrapper from "@/components/sections/SectionWrapper";
import { FaCheckCircle } from "react-icons/fa";

const AboutPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <SectionWrapper className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center mb-16 px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#14213d] mb-6">About Us</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            We are passionate about travel and creating unforgettable memories. Our mission is to seamlessly connect you to the best destinations, hotels, flights, and activities around the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto px-4 mb-20">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800" 
              alt="Our Team" 
              className="w-full h-auto rounded-3xl shadow-xl"
            />
          </div>
          <div className="space-y-6">
             <h2 className="text-3xl font-bold text-[#14213d]">The Team Behind The Magic</h2>
             <p className="text-gray-600 leading-relaxed text-lg">
               Founded in 2026, our platform grew out of a love for seamless travel experiences. We noticed the struggle of bouncing between 10 different apps to book a single vacation. We set out to change that by building one all-encompassing hub for all your travel needs.
             </p>
             <ul className="space-y-4">
               {["Trusted by Over 1 Million Travelers", "Partnered with 5,000+ Premium Hotels", "Award-Winning Customer Support 24/7"].map((item, idx) => (
                 <li key={idx} className="flex items-center gap-3 text-gray-700 font-medium font-serif">
                   <FaCheckCircle className="text-[#f4a261] text-xl" /> {item}
                 </li>
               ))}
             </ul>
          </div>
        </div>

      </SectionWrapper>
    </div>
  );
};

export default AboutPage;
