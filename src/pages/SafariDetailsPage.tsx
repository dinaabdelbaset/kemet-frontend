import PriceDisplay from "../components/common/PriceDisplay";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import DateTimePicker from "@/components/Ui/DateTimePicker";
import { FaCheckCircle, FaStar, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import InteractiveMap from "@/components/common/InteractiveMap";
import SocialShare from "@/components/common/SocialShare";
import ReviewSection from "@/components/common/ReviewSection";

import { useEffect, useState } from "react";
import { getSafariById } from "../api/safariService";

const SafariDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [safari, setSafari] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSafari = async () => {
      const syntheticData = location.state?.syntheticData;
      if (syntheticData && Number(id) >= 9000) {
          setSafari({
              ...syntheticData,
              price: syntheticData.rawPrice || syntheticData.price,
              description: syntheticData.description || "Enjoy an incredible adventure across the magnificent landscapes of Egypt.",
              duration: "2-3 hours",
              rating: syntheticData.rating || 4.8,
              reviews_count: syntheticData.reviews || 320
          });
          setLoading(false);
          return;
      }

      try {
        const data = await getSafariById(id!);
        setSafari(data);
      } catch (err) {
        console.error("Failed to load safari details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSafari();
  }, [id, location.state]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center p-20 text-xl font-bold">Loading Safari Details...</div>;
  }

  if (!safari) {
    return <div className="min-h-screen flex items-center justify-center p-20 text-xl font-bold text-red-500">Safari not found!</div>;
  }

  const defaultHighlights = [
    "Experience stunning natural landscapes",
    "Expert local guides and transportation",
    "Authentic local experiences",
    "Memorable photography spots"
  ];

  const defaultItinerary = [
    { day: "Phase 1", desc: "Arrive at the destination and prepare for the adventure." },
    { day: "Phase 2", desc: "Main activity and exploring the stunning surroundings." }
  ];

  const safariPrice = safari.price ?? 150;
  const safariImage = safari.image?.startsWith('/') || safari.image?.startsWith('http') ? safari.image : '/images/safari_hero.png';
  const safariTitle = safari.title || safari.name || 'Amazing Safari';
  const safariLocation = safari.location || 'Egypt';
  const safariDuration = safari.duration || 'Flexible Duration';
  const safariRating = safari.rating || 4.8;
  const safariReviews = safari.reviews_count || 320;
  const safariDesc = safari.description || 'Embark on an unforgettable adventure.';

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      {/* Hero */}
      <div className="w-full h-[60vh] relative">
        <img src={safariImage} alt={safariTitle} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8">
          <div className="max-w-6xl mx-auto text-white">
            <button onClick={() => navigate(-1)} className="text-gray-300 hover:text-white text-sm mb-4 inline-block font-bold tracking-wide">
              ← GO BACK
            </button>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">{safariTitle}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm md:text-base font-medium mb-6">
              <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-[#cd4f3c]" /> {safariLocation}</span>
              <span className="flex items-center gap-2"><FaClock className="text-[#cd4f3c]" /> {safariDuration}</span>
              <span className="flex items-center gap-2 text-yellow-400"><FaStar /> {safariRating} ({safariReviews} reviews)</span>
            </div>
            <div className="inline-block bg-black/20 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/10">
              <SocialShare url={window.location.href} title={safariTitle} />
            </div>
          </div>
        </div>
      </div>

      <SectionWrapper className="pt-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-[#222] mb-4 border-l-4 border-[#cd4f3c] pl-4">Overview</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{safariDesc}</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-[#222] mb-6">Key Highlights</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {defaultHighlights.map((item, idx) => (
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
                {defaultItinerary.map((step, idx) => (
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

            <ReviewSection rating={safariRating} reviewCount={safariReviews} itemId={id || "1"} itemType="safari" />

            <InteractiveMap locationName={safariLocation} />
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-24">
              <div className="text-center pb-6 border-b border-gray-100 mb-6">
                <p className="text-gray-500 mb-2">Price per person from</p>
                <p className="text-4xl font-extrabold text-[#cd4f3c]"><PriceDisplay price={Number(safariPrice)} /></p>
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
                        id: id,
                        type: "safari",
                        title: safariTitle,
                        price: safariPrice,
                        image: safariImage,
                        date: "2026-04-20", // default placeholder
                        time: "07:00 AM",
                        tickets: { adult: 1, child: 0, infant: 0 }
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
