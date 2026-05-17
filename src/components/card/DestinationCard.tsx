import type { IDestinationCard } from "../../interface";
import Image from "../Ui/Image";

const DestinationCard = ({ src, alt, title, tours }: IDestinationCard) => {
  return (
    <div className="flex flex-col items-center text-center gap-3 group cursor-pointer w-full">
      <div className="relative">
        <div className="rounded-full p-1.5 border-[3px] border-transparent group-hover:border-[#EB662B] transition-colors duration-500 overflow-hidden relative z-20 shadow-sm group-hover:shadow-lg group-hover:shadow-orange-500/20 bg-white dark:bg-gray-800">
          <Image
            src={src}
            alt={alt}
            width="w-full"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          />
        </div>
        <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#14213d] dark:bg-gray-700 text-white text-[11px] font-bold px-4 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-xl z-30 scale-90 group-hover:scale-100">
          {tours}+ Tours
        </span>
      </div>

      <div>
        <h4 className="mt-2 text-base sm:text-lg font-black text-[#14213d] dark:text-white group-hover:text-[#EB662B] transition-colors duration-300">
          {title}
        </h4>
        <p className="text-xs sm:text-sm font-bold text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300 mt-0.5">{tours}+ Tours</p>
      </div>
    </div>
  );
};

export default DestinationCard;
