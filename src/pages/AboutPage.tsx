import SectionWrapper from "@/components/sections/SectionWrapper";
import { FaCheckCircle, FaLinkedin, FaGithub } from "react-icons/fa";

const teamMembers = [
  // --- البنات ---
  {
    name: "Dina Abdelbaset Abdalluh",
    role: "Full Stack Developer & Visionary",
    image: "/images/team/Dina.jpeg",
    bio: "The mastermind behind the Kemet platform architecture, beautifully blending seamless frontend user experiences with robust backend systems to bring this vision to life.",
  },
  {
    name: "Shahd Ahmed Osama",
    role: "UI/UX Designer & Developer",
    image: "/images/team/shahd.jpeg",
    bio: "Designing the soul of Kemet. Shahd ensures every click, swipe, and scroll feels natural, creating a mesmerizing journey for every user.",
  },
  {
    name: "Eman",
    role: "Frontend Developer",
    image: "/images/team/eman.jpeg",
    position: "object-center", // التوسيط هو الحل الأفضل لصورة إيمان
    bio: "Translating code into captivating visual stories. Eman builds fast, interactive, and user-centric interfaces that bring the Kemet platform to life.",
  },
  {
    name: "Haneen",
    role: "Backend Developer",
    image: "/images/team/hanen.jpeg",
    position: "object-[center_70%]", // التمركز في الثلث السفلي لإظهار الوجه بدون تكبير يفسد التصميم
    bio: "Engineering the unseen architecture. Haneen optimizes server performance and ensures seamless data flow across the entire platform.",
  },
  {
    name: "Mennah", // تم تعديل الاسم إلى Mennah لكي يترجمه المتصفح بشكل صحيح إلى "منه"
    role: "Backend Developer",
    image: "/images/team/mena.jpeg",
    bio: "Powering the core logic behind the scenes. Mennah develops efficient APIs and database architectures ensuring reliable performance every time.",
  },
  {
    name: "Nour",
    role: "Backend Developer",
    image: "/images/team/nour.jpeg",
    bio: "Securing and structuring Kemet's data. Nour writes clean, maintainable backend services that guarantee the platform's stability and speed.",
  },
  {
    name: "Hoda",
    role: "Backend Developer",
    image: "/images/team/hoda.jpeg", // تأكدي من حفظ صورتها بهذا الاسم
    bio: "Architecting the backbone of Kemet. Hoda engineers secure, scalable, and high-performance server-side solutions that power the entire platform seamlessly.",
  },
  
  // --- الأولاد ---
  {
    name: "Eslam Naser",
    role: "Frontend Developer",
    image: "/images/team/ESLAM.jpeg",
    bio: "Crafting beautiful, responsive, and intuitive user interfaces. Eslam turns complex design concepts into pixel-perfect interactive web experiences.",
  },
  {
    name: "Abdalluh",
    role: "Backend Developer",
    image: "/images/team/abdalluh.jpeg",
    bio: "The engine driving data seamlessly. Abdalluh manages complex server operations, ensuring the Kemet platform remains robust and lightning-fast.",
  },
];

const AboutPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <SectionWrapper className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center mb-16 px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#1A365D] mb-6">About Kemet</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            We are passionate about travel and creating unforgettable memories. Our mission is to seamlessly connect you to the best destinations, hotels, flights, and activities around the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto px-4 mb-20">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1A365D] to-[#EB662B] rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            <img 
              src="/images/team/kemet.jpeg" 
              alt="Kemet Team" 
              className="relative w-full h-auto max-h-[500px] object-cover rounded-3xl shadow-2xl border-4 border-white group-hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
          <div className="space-y-6">
             <h2 className="text-3xl font-bold text-[#1A365D]">The Story Behind The Magic</h2>
             <p className="text-gray-600 leading-relaxed text-lg">
               Founded in 2026, our platform grew out of a love for seamless travel experiences. We noticed the struggle of bouncing between 10 different apps to book a single vacation. We set out to change that by building one all-encompassing hub for all your travel needs.
             </p>
             <ul className="space-y-4">
               {["Trusted by Over 1 Million Travelers", "Partnered with 5,000+ Premium Hotels", "Award-Winning Customer Support 24/7"].map((item, idx) => (
                 <li key={idx} className="flex items-center gap-3 text-gray-700 font-medium font-serif">
                   <FaCheckCircle className="text-[#D4AF37] text-xl" /> {item}
                 </li>
               ))}
             </ul>
          </div>
        </div>

        {/* Meet The Developer / Team Section */}
        <div className="mt-32 max-w-7xl mx-auto px-4 border-t border-gray-100 pt-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-[#1A365D] mb-4">Meet The Innovators</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              The brilliant minds and passionate engineers who worked tirelessly to build the Kemet platform from the ground up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 group flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#1A365D] to-[#EB662B] rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <img 
                    src={member.image} 
                    alt={member.name}
                    onError={(e) => {
                      e.currentTarget.src = "https://ui-avatars.com/api/?name=" + member.name.replace(/ /g, "+") + "&background=D4AF37&color=fff&size=256";
                    }}
                    className={`relative w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover ring-4 ring-gray-50 group-hover:ring-amber-100 transition-all duration-500 ${member.position || 'object-top'}`}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-[#1A365D] transition-colors">{member.name}</h3>
                <p className="text-[#EB662B] font-bold text-xs uppercase tracking-widest mb-4 px-3 py-1 bg-orange-50 rounded-full">{member.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                  {member.bio}
                </p>
                <div className="flex gap-3 mt-auto">
                  <button className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-[#1A365D] hover:text-white transition-all duration-300">
                    <FaLinkedin size={18} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-[#1A365D] hover:text-white transition-all duration-300">
                    <FaGithub size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </SectionWrapper>
    </div>
  );
};

export default AboutPage;
