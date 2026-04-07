import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTourById } from "../api/tourService";
import type { ITour } from "../interface";
import { FaArrowLeft, FaStar, FaClock, FaLocationDot } from "react-icons/fa6";
import { FaCheckCircle, FaFireAlt } from "react-icons/fa";
import SectionWrapper from "../components/sections/SectionWrapper";
import InteractiveMap from "../components/common/InteractiveMap";
import ReviewSection from "../components/common/ReviewSection";
import SocialShare from "../components/common/SocialShare";
import PriceDisplay from "../components/common/PriceDisplay";
import { useApp } from "../context/AppContext";

const TourDetailsPage = () => {
  const { tourId } = useParams<{ tourId: string }>();
  const [tour, setTour] = useState<ITour | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { user, toggleWishlist, wishlist, addRecentlyViewed } = useApp();
  
  useEffect(() => {
    const fetchTour = async () => {
      setLoading(true);
      try {
        const apiTour = await getTourById(tourId!);
        if (apiTour && apiTour.id) {
            const updatedTour = {
              ...apiTour,
              price: Number(apiTour.price) || 0,
              rating: Number(apiTour.rating) || 0,
              reviewCount: Number(apiTour.reviewCount) || Math.floor(Math.random() * 500) + 50,
              gallery: apiTour.gallery?.length > 0 ? apiTour.gallery : [
                apiTour.image,
                apiTour.image,
                apiTour.image
              ],
              itinerary: apiTour.itinerary || [
                "Pickup from your hotel/location",
                "Start the guided tour overview",
                "Lunch break and local dining experience",
                "Continue exploration and activities",
                "Safe return to your drop-off location"
              ]
            };
            setTour(updatedTour);
        } else {
            throw new Error("Tour missing ID");
        }
      } catch (err) {
        console.error("Error fetching tour:", err);
        setTour(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [tourId]);

  const wishlistId = tour ? `tour-${tour.id}` : "";
  const isSaved = wishlistId ? wishlist.includes(wishlistId) : false;

  useEffect(() => {
    if (tour) {
      addRecentlyViewed({
        id: tour.id,
        title: tour.title,
        image: tour.gallery?.[0] || tour.image,
        type: "tour",
        link: `/tours/${tour.id}`
      });
    }
  }, [tour?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#EB662B]"></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-700">Tour not found</h2>
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
    <SectionWrapper className="min-h-screen bg-gray-50">
      {/* Gallery - Bento Grid Style */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-2 h-h-87.5 md:h-125 rounded-2xl overflow-hidden relative">
          {/* Main Image */}
          <div className="md:col-span-2 md:row-span-2 overflow-hidden relative group">
            <img
              src={tour.gallery[0] || tour.image}
              alt={tour.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Smaller Images */}
          {tour.gallery.slice(1, 3).map((img, idx) => (
            <div
              key={idx}
              className="hidden md:block overflow-hidden relative group md:col-span-1 md:row-span-1"
            >
              <img
                src={img}
                alt={`${tour.title}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>

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

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — Info + Itinerary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title + Meta */}
          <div className="bg-white rounded-2xl shadow-sm p-6 relative">
            {tour.label && (
                <div className="absolute top-6 right-6 z-10">
                    <span className="bg-[#EB662B] text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-sm capitalize tracking-wide flex items-center gap-1">
                        <FaFireAlt /> {tour.label}
                    </span>
                </div>
            )}
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2 mt-4 md:mt-0">
              <FaLocationDot className="text-[#EB662B]" />
              <span className="capitalize">{tour.location}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#05073C] leading-tight mb-3 pr-16 md:pr-24">
              {tour.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <FaStar className="text-yellow-400" />
                {tour.rating} ({tour.reviewCount} reviews)
              </span>
              <span className="flex items-center gap-1">
                <FaClock className="text-[#EB662B]" />
                {tour.duration}
              </span>
              {tour.start_time && (
                  <span className="flex items-center gap-1">
                      <span className="text-[#EB662B]">🕒</span>
                      Starts at {tour.start_time}
                  </span>
              )}
            </div>
            
            {tour.includes && (
                <div className="mb-4 inline-flex items-center gap-1.5 p-2 px-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-sm font-medium">
                    <FaCheckCircle /> Includes: {tour.includes}
                </div>
            )}
            
            <SocialShare url={window.location.href} title={tour.title} />

            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
              {tour.description}
            </p>
          </div>

          {/* Map Location */}
          <InteractiveMap locationName={tour.location} />

          {/* Itinerary */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#05073C] mb-5">Itinerary</h2>
            <ol className="relative border-l-2 border-[#EB662B]/30 space-y-6 pl-6">
              {tour.itinerary.map((step, idx) => (
                <li key={idx} className="relative">
                  <span className="absolute -left-[1.35rem] w-5 h-5 rounded-full bg-[#EB662B] text-white flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-gray-700">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Reviews */}
          <ReviewSection rating={tour.rating} reviewCount={tour.reviewCount} itemId={tour.id} itemType="tour" />
        </div>

        {/* Right — Booking */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24 space-y-4">
            <div className="text-3xl font-bold text-[#EB662B] flex items-baseline gap-1">
              <PriceDisplay price={tour.price} />
              <span className="text-base font-normal text-gray-500">
                {" "}
                / person
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaStar className="text-yellow-400" />
              <span>
                {tour.rating} · {tour.reviewCount} reviews
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaClock className="text-[#EB662B]" />
              <span>{tour.duration}</span>
            </div>

            <hr className="border-gray-100" />

            <Link 
              to="/checkout"
              state={{ 
                  id: tour.id,
                  type: 'tour',
                  title: tour.title, 
                  price: tour.price, 
                  image: tour.gallery?.[0] || tour.image 
              }}
              className="block text-center w-full bg-[#EB662B] hover:bg-[#d55822] text-white font-semibold py-3 rounded-xl transition text-sm shadow-md"
            >
              Book Now
            </Link>
            <button 
              onClick={(e) => {
                e.preventDefault();
                if (!user) {
                  window.dispatchEvent(new Event('open-auth-modal'));
                  return;
                }
                toggleWishlist(wishlistId);
              }}
              className={`w-full border ${isSaved ? 'border-[#EB662B] bg-orange-50 text-[#EB662B]' : 'border-gray-200 text-gray-700 hover:bg-gray-50'} font-semibold py-3 rounded-xl transition text-sm flex justify-center items-center gap-2`}
            >
              {isSaved ? "Saved to Wishlist" : "Save Tour"}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Free cancellation up to 24h before
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default TourDetailsPage;
