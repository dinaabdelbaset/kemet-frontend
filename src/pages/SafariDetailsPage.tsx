import SectionWrapper from "@/components/sections/SectionWrapper";
import { Link, useParams, useNavigate } from "react-router-dom";
import DateTimePicker from "@/components/Ui/DateTimePicker";
import { FaCheckCircle, FaStar, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import InteractiveMap from "@/components/common/InteractiveMap";
import SocialShare from "@/components/common/SocialShare";
import ReviewSection from "@/components/common/ReviewSection";

const SafariDetailsPage = () => {
  useParams(); // in real app, fetch specific safari details
  const navigate = useNavigate();
  
  const safari = {
    title: "Kenya vs Tanzania Safari Experience",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200",
    location: "Masai Mara & Serengeti",
    duration: "7 Days",
    price: 1299,
    rating: 4.8,
    reviews: 320,
    description: "Experience the ultimate African safari combining the best of Kenya and Tanzania. Witness the spectacular Great Migration, encounter the Big Five, and immerse yourself in the vibrant Maasai culture. This carefully crafted itinerary ensures maximum wildlife viewing and unforgettable sunsets in the savannah.",
    highlights: [
      "Witness the Great Migration across the Mara River",
      "Stay in luxury tented camps in the wild",
      "All meals and park fees included",
      "Expert local naturalist guides throughout"
    ],
    itinerary: [
      { day: "Day 1", desc: "Arrival in Nairobi & Transfer to Masai Mara. Afternoon game drive." },
      { day: "Day 2", desc: "Full day game drive in Masai Mara tracking the Big Five." },
      { day: "Day 3", desc: "Cross border to Tanzania. Drive to Serengeti National Park." },
      { day: "Day 4", desc: "Morning hot air balloon safari. Afternoon exploration of Serengeti." },
      { day: "Day 5", desc: "Ngorongoro crater descent for high-density wildlife viewing." },
      { day: "Day 6", desc: "Lake Manyara flamingo spotting and cultural village tour." },
      { day: "Day 7", desc: "Return to Arusha for departure flights." }
    ]
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      {/* Hero */}
      <div className="w-full h-[60vh] relative">
        <img src={safari.image} alt={safari.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8">
          <div className="max-w-6xl mx-auto text-white">
            <Link to="/safari" className="text-gray-300 hover:text-white text-sm mb-4 inline-block font-bold tracking-wide">
              ← BACK TO SAFARIS
            </Link>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">{safari.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm md:text-base font-medium mb-6">
              <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-[#cd4f3c]" /> {safari.location}</span>
              <span className="flex items-center gap-2"><FaClock className="text-[#cd4f3c]" /> {safari.duration}</span>
              <span className="flex items-center gap-2 text-yellow-400"><FaStar /> {safari.rating} ({safari.reviews} reviews)</span>
            </div>
            <div className="inline-block bg-black/20 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/10">
              <SocialShare url={window.location.href} title={safari.title} />
            </div>
          </div>
        </div>
      </div>

      <SectionWrapper className="pt-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-[#222] mb-4 border-l-4 border-[#cd4f3c] pl-4">Overview</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{safari.description}</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-[#222] mb-6">Key Highlights</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {safari.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700">
                    <FaCheckCircle className="text-[#cd4f3c] mt-1 flex-shrink-0" /> 
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#222] mb-8 border-l-4 border-[#cd4f3c] pl-4">Itinerary</h2>
              <div className="space-y-6">
                {safari.itinerary.map((step, idx) => (
                  <div key={idx} className="flex gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                    <div className="w-16 h-16 bg-[#cd4f3c]/10 text-[#cd4f3c] rounded-xl flex items-center justify-center font-bold flex-shrink-0">
                      {step.day}
                    </div>
                    <div className="flex items-center text-gray-700 text-lg">
                      {step.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ReviewSection rating={safari.rating} reviewCount={safari.reviews} itemId="1" itemType="safari" />

            <InteractiveMap locationName={safari.location} />
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-24">
              <div className="text-center pb-6 border-b border-gray-100 mb-6">
                <p className="text-gray-500 mb-2">Price per person from</p>
                <p className="text-4xl font-extrabold text-[#cd4f3c]">${safari.price}</p>
              </div>

              <form className="space-y-4">
                <div className="mb-4">
                  <DateTimePicker compact showTime={false} accentColor="#cd4f3c" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                  <select className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#cd4f3c]">
                    <option>1 Adult</option>
                    <option>2 Adults</option>
                    <option>2 Adults + 1 Child</option>
                    <option>Group (4+)</option>
                  </select>
                </div>
                <button 
                  type="button" 
                  onClick={() => navigate("/checkout", {
                    state: {
                      title: safari.title,
                      price: safari.price,
                      image: safari.image
                    }
                  })}
                  className="w-full py-4 mt-4 bg-[#cd4f3c] hover:bg-[#b03c2b] text-white font-bold text-lg rounded-xl transition shadow-md"
                >
                  Book Adventure
                </button>
                <p className="text-center text-xs text-gray-400 mt-4">Free cancellation up to 48 hours before.</p>
              </form>
            </div>
          </div>

        </div>
      </SectionWrapper>
    </div>
  );
};

export default SafariDetailsPage;
