import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import type { ITour } from "../../interface";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useApp } from "../../context/AppContext";
import PriceDisplay from "../Ui/PriceDisplay";

interface IProps {
  tour: ITour;
}

const TourCard = ({ tour }: IProps) => {
  const { user, toggleWishlist, wishlist } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const wishlistId = `tour-${tour.id}`;
  const isSaved = wishlist.includes(wishlistId);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      window.dispatchEvent(new Event('open-auth-modal'));
      return;
    }
    toggleWishlist(wishlistId);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Video play failed:", e));
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Link
      to={`/tours/${tour.id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="block bg-white dark:bg-gray-800 border-2 border-[#E7E6E6] dark:border-gray-700 rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-[#D4AF37] hover:shadow-[0_12px_30px_rgba(212,175,55,0.25)] relative group"
    >
      <div className="relative p-2">
        <div className="rounded-xl overflow-hidden w-full h-44 bg-gray-100 relative">
          <img
            src={
              tour.image ? tour.image : "/images/tour-pyramids.png"
            }
            alt={tour.title}
            onError={(e) => {
              if (!e.currentTarget.dataset.fb) {
                e.currentTarget.dataset.fb = "1";
                e.currentTarget.src = "https://images.unsplash.com/photo-1600868205423-1c3906a4b162?q=80&w=800";
              }
            }}
            className={`w-full h-full object-cover object-center transition-all duration-700 ${isHovered && tour.video ? 'opacity-0 scale-110' : 'opacity-100 group-hover:scale-110'}`}
          />
          {tour.video && (
            <video
              ref={videoRef}
              src={tour.video}
              muted
              loop
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            />
          )}
        </div>
        {/* Floating white circle */}
        <span className="absolute bottom-0 right-4 translate-y-1/2 w-9 h-9 bg-white rounded-full" />
        
        {/* Wishlist Button */}
        <button 
          onClick={handleWishlist}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-[#EB662B] shadow-sm transition-transform hover:scale-110 z-10"
        >
          {isSaved ? <FaHeart /> : <FaRegHeart />}
        </button>

        {tour.label && (
          <div className="absolute top-4 left-4 z-10 shadow-lg">
            <span className="bg-[#EB662B] text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-md shadow-md capitalize tracking-wide flex items-center gap-1">
              🔥 {tour.label}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-5 pt-4 pb-4">
        {/* Location & Start Time */}
        <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-medium capitalize text-gray-500">{tour.location}</p>
            {tour.start_time && <p className="text-[10px] font-bold tracking-wide text-blue-600 bg-blue-50 px-2 py-0.5 border border-blue-100 rounded-md">🕒 {tour.start_time}</p>}
        </div>

        {/* Title */}
        <h3 className="text-[15px] leading-6 font-bold text-[#05073C] hover:text-[#D4AF37] transition-colors line-clamp-2">
          {tour.title}
        </h3>

        {/* Rating */}
        <div className="mt-1.5 flex items-center gap-1 text-xs text-[#05073C]">
          <span className="text-yellow-400">⭐</span> <span className="font-bold">{tour.rating}</span> <span className="text-gray-400 font-medium">({tour.reviewCount} reviews)</span>
        </div>

        {/* Includes */}
        {tour.includes && (
          <p className="mt-2.5 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-1.5 flex items-center gap-1.5 rounded-md border border-emerald-100 line-clamp-1 shadow-sm">
            ✓ {tour.includes}
          </p>
        )}

        {/* Motivation */}
        <p className="mt-2.5 text-[11px] font-bold text-red-500 bg-red-50 inline-block px-1.5 py-0.5 rounded flex items-center gap-1 w-max">
          ⚡ Fast Selling! Secure your spot.
        </p>
        
        {/* Cancellation */}
        <p className="mt-1 text-[10px] pt-0.5 text-gray-400 flex items-center gap-1 line-clamp-1 font-medium">
          ✅ Free cancellation up to 24 hours before
        </p>

        <div className="border-t border-gray-100 mt-3 pt-3 flex items-center justify-between text-sm text-[#05073C]">
          <span className="flex items-center gap-1.5 font-semibold text-gray-600 text-[13px]"><span className="text-gray-400">⏱️</span> {tour.duration}</span>
          <div className="flex items-baseline gap-1 font-black text-lg text-[#05073C]">
            <span className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">From</span>
            <PriceDisplay amount={tour.price} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;

