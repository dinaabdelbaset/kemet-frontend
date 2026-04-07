import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaStar, FaTags, FaCalendar } from "react-icons/fa6";
import SectionWrapper from "../components/sections/SectionWrapper";
import InteractiveMap from "../components/common/InteractiveMap";
import SocialShare from "../components/common/SocialShare";
import ReviewSection from "../components/common/ReviewSection";
import DateTimePicker from "@/components/Ui/DateTimePicker";
import { getActivityById } from "../api/activityService";
import type { Activity } from "../api/activityService";

const ThingToDoDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      try {
        const data = await getActivityById(id!);
        setItem(data);
      } catch (error) {
        console.error("Failed to load activity", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchActivity();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-700">Activity details not found</h2>
        <Link
          to="/"
          className="text-blue-600 hover:underline flex items-center gap-2"
        >
          <FaArrowLeft /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <SectionWrapper className="min-h-screen bg-gray-50 pb-12">
      {/* Back Button */}
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 text-sm font-medium transition"
        >
          <FaArrowLeft />
          Back to Home
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column — Info, Offers, Reviews */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Info */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-80 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-[#05073C] leading-tight">
                  {item.title}
                </h1>
                <div className="flex items-center gap-1 bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-full text-sm font-bold">
                  <FaStar />
                  {Number(item.rating).toFixed(1)} 
                </div>
              </div>
              <p className="mt-4 text-gray-600 leading-relaxed whitespace-pre-wrap">
                {item.description || "Discover the best experience in town. Enjoy breathtaking views, rich cultural experiences, and unforgettable moments."}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-gray-500 text-sm">Location: <span className="font-semibold text-gray-800">{item.location}</span></div>
                <SocialShare url={window.location.href} title={item.title} />
              </div>
            </div>
          </div>

          {/* Offers Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#05073C] mb-4 flex items-center gap-2">
              <FaTags className="text-blue-600" />
              Special Offers
            </h2>
            <div className="space-y-4">
              <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-xl">
                <h3 className="font-semibold text-blue-900 leading-tight">Early Booking</h3>
                <p className="text-sm text-gray-600 mt-1">Book 7 days in advance for this activity and secure your spot.</p>
              </div>
            </div>
          </div>

          {/* New Dynamic Review Section */}
          <ReviewSection 
            rating={item.rating || 5} 
            reviewCount={item.review_count || 0} 
            itemId={item.id} 
            itemType="activity" 
          />

          {/* Location Map */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
             <InteractiveMap locationName={item.location + ", Egypt"} />
          </div>

        </div>

        {/* Right Column — Booking Now */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24 space-y-5">
            <h2 className="text-xl font-bold text-[#05073C]">Booking Now</h2>
            
            <div className="text-3xl font-bold text-blue-600">
              ${item.price}
              <span className="text-base font-normal text-gray-500">
                {" "}
                / person
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <div className="mb-2">
                <DateTimePicker compact showTime={false} accentColor="#2563EB" />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Number of tickets</label>
                <select className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-blue-500">
                  <option>1 ticket</option>
                  <option>2 tickets</option>
                  <option>3 tickets</option>
                  <option>4+ tickets</option>
                </select>
              </div>
            </div>

            <hr className="border-gray-100" />

            <Link 
              to="/checkout"
              state={{ 
                  id: item.id,
                  type: 'activity',
                  title: item.title, 
                  price: item.price, 
                  image: item.image 
              }}
              className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition text-sm shadow-md"
            >
              Book Now
            </Link>
            <p className="text-xs text-gray-400 text-center">
              Requires no payment until confirmation
            </p>
          </div>
        </div>

      </div>
    </SectionWrapper>
  );
};

export default ThingToDoDetailsPage;
