import { FaStar, FaClock, FaUsers, FaRoute } from "react-icons/fa";
import { Link } from "react-router-dom";
import Button from "../Ui/Button";
import PriceDisplay from "../common/PriceDisplay";
import type { ITransportation } from "../../interface";

interface IProps {
  transport: ITransportation;
}

const TransportationCard = ({ transport }: IProps) => {
  return (
    <Link
      to={`/transportation/${transport.id}`}
      className="block relative bg-white dark:bg-gray-800 border border-[#E7E6E6] dark:border-gray-700 rounded-2xl overflow-hidden transition-all duration-[600ms] hover:border-[#D4AF37] hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] group h-[400px] w-full"
    >
      {/* Background Cover Image (Slides up on hover) */}
      <div className="absolute inset-x-0 top-0 w-full h-full transition-all duration-[800ms] ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:h-[45%] z-10 overflow-hidden rounded-t-2xl group-hover:rounded-b-none rounded-b-2xl">
        <img
          src={transport.image}
          alt={transport.type}
          className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-700 group-hover:opacity-0" />
        
        {/* Badges (Always visible) */}
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-[#EB662B] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-md uppercase tracking-wide">
             {transport.type}
          </span>
        </div>

        {/* Rating Badge (Always visible) */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-2.5 py-1.5 rounded-lg text-[#05073C] font-bold shadow-md flex flex-col items-center gap-0.5 z-20 border border-gray-100">
           <div className="flex items-center gap-1">
             <FaStar className="text-yellow-400 text-[10px]" />
             <span className="text-sm leading-none">{transport.rating}</span>
           </div>
        </div>

        {/* Pre-Hover Title Overlay */}
        <div className="absolute bottom-6 left-5 right-5 z-20 transition-all duration-700 transform group-hover:translate-y-10 group-hover:opacity-0 flex flex-col">
          <div className="flex items-center gap-1.5 mb-2 bg-black/30 w-max px-2.5 py-1 rounded-full backdrop-blur-sm">
            <FaRoute className="text-[#D4AF37] text-xs" />
            <span className="text-white/90 text-xs font-semibold tracking-wide">{transport.route}</span>
          </div>
          <div className="flex items-baseline gap-1.5 drop-shadow-md">
             <span className="text-white/70 text-[10px] uppercase font-bold">From</span>
             <span className="text-[#D4AF37] text-xl font-bold"><PriceDisplay price={transport.price} baseCurrency="EGP" /></span>
             <span className="text-white/60 text-[10px]">/ trip</span>
          </div>
        </div>
      </div>

      {/* Content (Revealed on hover) */}
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-white dark:bg-gray-800 px-5 pt-5 pb-4 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100 z-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            <FaRoute className="text-[#EB662B]" />
            <span>{transport.route}</span>
          </div>
          
          <h3 className="text-lg font-bold text-[#05073C] dark:text-white leading-snug hover:text-[#EB662B] transition-colors line-clamp-1 mb-4">
            {transport.type} Transport
          </h3>

          <div className="flex flex-col gap-3">
             <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium">
               <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                 <FaUsers className="text-sm" />
               </div>
               {transport.type === 'Car' ? 'Up to 4 people' : `${transport.seats} seats available`}
             </div>
             
             <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium">
               <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                 <FaClock className="text-sm" />
               </div>
               {transport.type === 'Car' ? transport.duration || '48h Rental included' : `Departure at ${transport.departureTime}`}
             </div>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 mt-3 pt-3 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Total price</span>
            <span className="text-[#05073C] dark:text-[#D4AF37] font-black text-lg">
              <PriceDisplay price={transport.price} baseCurrency="EGP" />
            </span>
          </div>
          <span className="text-white bg-[#05073C] hover:bg-[#D4AF37] text-xs px-4 py-2 rounded-lg font-bold transition-colors">
            Book Ride
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TransportationCard;
