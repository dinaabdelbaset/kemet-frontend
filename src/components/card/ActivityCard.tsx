import type { IActivity } from "../../interface";
import { FaStar, FaClock, FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Button from "../Ui/Button";
import { useApp } from "../../context/AppContext";
import PriceDisplay from "../common/PriceDisplay";
import HoverMascot from "../common/HoverMascot";

interface IProps {
    activity: IActivity;
}

const ActivityCard = ({ activity }: IProps) => {
    const { wishlist, toggleWishlist, user } = useApp();
    const navigate = useNavigate();
  
    const wishlistId = `activity-${activity.id}`;
    const isSaved = wishlist.includes(wishlistId);

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault(); // In case it's inside a Link
        e.stopPropagation();
        
        if (!user) {
            // Trigger login modal logic here (dispatch an event or state)
            window.dispatchEvent(new Event('open-auth-modal'));
            return;
        }
        toggleWishlist(wishlistId);
    };

    return (
        <HoverMascot>
            <div className="flex flex-col md:flex-row bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-[0_12px_30px_rgba(212,175,55,0.25)] transition-all duration-500 hover:-translate-y-2 hover:border-[#D4AF37] relative group">
                {/* Image Section */}
                <div className="relative w-full md:w-72 h-48 md:h-auto flex-shrink-0 overflow-hidden">
                    <img
                        src={activity.image}
                        alt={activity.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {activity.isBestSeller && (
                        <span className="absolute top-3 left-3 bg-[#EB662B] text-white text-xs font-semibold px-3 py-1 rounded-full">
                            Best Seller
                        </span>
                    )}
                    
                    {/* Wishlist Button */}
                    <button 
                      onClick={handleWishlist}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-[#EB662B] shadow-sm transition-transform hover:scale-110 z-10"
                    >
                      {isSaved ? <FaHeart /> : <FaRegHeart />}
                    </button>
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-grow p-5">
                    {/* Category */}
                    <span className="text-xs text-[#EB662B] font-medium uppercase tracking-wide mb-1">
                        {activity.category}
                    </span>
                    
                    {/* Title */}
                    <h3 className="text-lg font-bold text-[#05073C] hover:text-[#D4AF37] transition-colors line-clamp-2 md:line-clamp-1">
                        {activity.title}
                    </h3>
                    
                    {/* Location */}
                    <p className="text-sm text-gray-500 mt-1 capitalize font-medium">{activity.title}</p>

                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 flex-grow">{activity.description}</p>
                    
                    {/* Rating & Duration */}
                    <div className="flex flex-wrap items-center gap-4 mt-4 shadow-sm py-2 px-3 bg-gray-50 rounded-lg w-max border border-gray-100 dark:bg-gray-700 dark:border-gray-600">
                        <div className="flex items-center gap-1.5 text-sm text-[#05073C]">
                            <FaStar className="text-yellow-400" />
                            <span className="font-bold">{activity.rating}</span>
                            <span className="text-gray-400 font-medium">({activity.reviewCount} reviews)</span>
                        </div>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                            <FaClock className="text-gray-400" />
                            <span className="font-semibold">{activity.duration}</span>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700 mt-5 pt-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="text-right flex flex-col items-end">
                                {activity.originalPrice && (
                                    <PriceDisplay price={Number(activity.originalPrice) || 0} className="text-sm text-gray-400 line-through" />
                                )}
                                <div className="flex items-baseline gap-1 text-[#05073C]">
                                  <span className="text-xs">From</span>
                                  <PriceDisplay price={Number(activity.price) || 0} className="text-lg font-bold" />
                                </div>
                            </div>
                            <Button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/checkout', { state: { title: activity.title, price: activity.price, image: activity.image } });
                                }}
                                className="text-white text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Book Now
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </HoverMascot>
    );
};

export default ActivityCard;
