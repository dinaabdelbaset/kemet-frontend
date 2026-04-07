import type { IDestinationCard } from "../../interface";
import Image from "../Ui/Image";
import HoverMascot from "../common/HoverMascot";

const DestinationCard = ({ src, alt, title, tours }: IDestinationCard) => {
  return (
    <HoverMascot>
      <div className="flex flex-col items-center text-center gap-2 group cursor-pointer transition-all duration-500 hover:-translate-y-3">
        <div className="relative">
          <div className="rounded-full p-1 border-2 border-transparent group-hover:border-[#D4AF37] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transition-all duration-500 overflow-hidden bg-white/5 backdrop-blur-sm relative z-20">
            <Image
              src={src}
              alt={alt}
              width="w-20"
              className="h-20 sm:w-24 sm:h-24 rounded-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3"
            />
          </div>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-white text-[9px] font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 group-hover:-bottom-3 transition-all duration-300 whitespace-nowrap shadow-lg z-30">
            {tours}+ Tours
          </span>
        </div>

        <h4 className="mt-2 text-sm sm:text-base font-semibold text-[#05073C] dark:text-white group-hover:text-[#D4AF37] transition-colors duration-300">
          {title}
        </h4>
        <p className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">{tours}+ Tours</p>
      </div>
    </HoverMascot>
  );
};

export default DestinationCard;
