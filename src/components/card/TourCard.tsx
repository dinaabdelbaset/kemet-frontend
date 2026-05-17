import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import type { ITour } from "../../interface";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useApp } from "../../context/AppContext";
import PriceDisplay from "../common/PriceDisplay";

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
      className="block relative bg-white dark:bg-gray-800 border border-[#E7E6E6] dark:border-gray-700 rounded-2xl overflow-hidden transition-all duration-[600ms] hover:border-[#D4AF37] hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] group h-[400px] w-full"
    >
      {/* Background Cover Image (Slides up to 45% height on hover) */}
      <div className="absolute inset-x-0 top-0 w-full h-full transition-all duration-[800ms] ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:h-[45%] z-10 overflow-hidden rounded-t-2xl group-hover:rounded-b-none rounded-b-2xl">
        <img
          src={tour.image ? tour.image : "/images/tour-pyramids.png"}
          alt={tour.title}
          onError={(e) => {
            if (!e.currentTarget.dataset.fb) {
              e.currentTarget.dataset.fb = "1";
              e.currentTarget.src = "/images/tour-pyramids.png";
            }
          }}
          className={`w-full h-full object-cover object-center transition-all duration-1000 ${isHovered && tour.video ? 'opacity-0 scale-110' : 'opacity-100 group-hover:scale-110'}`}
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
        
        {/* Gradient Overlay for text readability when full screen */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 transition-opacity duration-700 group-hover:opacity-0" />
        
        {/* Wishlist Button (Always visible) */}
        <button 
          onClick={handleWishlist}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-[#EB662B] shadow-sm transition-transform hover:scale-110 z-20"
        >
          {isSaved ? <FaHeart /> : <FaRegHeart />}
        </button>

        {/* Badges (Always visible) */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
          {tour.label && (
            <span className="bg-[#EB662B] text-white text-[10px] font-bold px-2 py-1 rounded shadow-md capitalize tracking-wide flex items-center gap-1 w-max">
              🔥 {tour.label}
            </span>
          )}
          {tour.id % 4 === 0 && (
            <span className="bg-red-600 text-white text-[9px] font-black uppercase px-2 py-1 rounded shadow-md w-max">
               High Demand
            </span>
          )}
          {tour.id % 3 === 0 && (
            <span className="bg-[#003580] text-white text-[9px] font-black uppercase px-2 py-1 rounded shadow-md flex items-center gap-1 w-max">
               Kemet VIP Genius
            </span>
          )}
        </div>

        {/* Pre-Hover Title (Hidden on hover) */}
        <div className="absolute bottom-6 left-5 right-5 z-20 transition-all duration-700 transform group-hover:translate-y-10 group-hover:opacity-0">
           <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">{tour.location}</p>
           <h3 className="text-white text-xl font-black leading-tight line-clamp-2 text-shadow-md mb-2">{tour.title}</h3>
           <div className="flex items-center gap-2">
             <span className="text-[#D4AF37] font-bold text-lg drop-shadow-md"><PriceDisplay price={Number(tour.price) || 0} baseCurrency="EGP" /></span>
             <span className="text-white/60 text-xs">/ person</span>
           </div>
        </div>
      </div>

      {/* Content (Revealed on hover) */}
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-white dark:bg-gray-800 px-5 pt-5 pb-4 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100 z-0 flex flex-col justify-between">
        
        <div>
          {/* Location & Start Time */}
          <div className="flex justify-between items-center mb-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{tour.location}</p>
              {tour.start_time && <p className="text-[10px] font-bold tracking-wide text-blue-600 bg-blue-50 px-2 py-0.5 border border-blue-100 rounded-md">🕒 {tour.start_time}</p>}
          </div>

          {/* Title */}
          <h3 className="text-[15px] leading-snug font-bold text-[#05073C] dark:text-white hover:text-[#D4AF37] transition-colors line-clamp-2">
            {tour.title}
          </h3>

          {/* Rating */}
          <div className="mt-2 flex items-center gap-2">
            <div className="bg-[#05073C] text-white px-2 py-1 rounded text-xs font-bold shadow-sm">
              {tour.rating}
            </div>
            <span className="text-[11px] font-bold text-[#05073C] dark:text-gray-300">{tour.rating >= 4.5 ? 'Exceptional' : 'Fabulous'}</span>
            <span className="text-[10px] text-gray-400 font-medium">({tour.reviewCount} reviews)</span>
          </div>

          {/* Motivation */}
          <div className="flex flex-col gap-1.5 mt-2">
            {tour.includes && (
              <p className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-1 rounded border border-emerald-100 line-clamp-1 w-max">
                ✓ {tour.includes}
              </p>
            )}
            <p className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-1 rounded w-max">
              ⚡ Fast Selling! Secure your spot.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2 flex items-center justify-between text-sm text-[#05073C] dark:text-white">
          <span className="flex items-center gap-1.5 font-semibold text-gray-600 dark:text-gray-400 text-[12px]"><span className="text-gray-400">⏱️</span> {tour.duration}</span>
          <div className="flex items-baseline gap-1 font-black text-lg text-[#05073C] dark:text-[#D4AF37]">
            <span className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">From</span>
            <PriceDisplay price={Number(tour.price) || 0} baseCurrency="EGP" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;

