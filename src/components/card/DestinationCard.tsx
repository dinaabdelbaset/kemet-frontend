import type { IDestinationCard } from "../../interface";
import Image from "../Ui/Image";

const DestinationCard = ({ src, alt, title, tours }: IDestinationCard) => {
  return (
    <div className="flex flex-col items-center text-center gap-2 group cursor-pointer">
      <div className="relative">
        <div className="rounded-full p-1 border-2 border-transparent group-hover:border-gray-200 dark:group-hover:border-gray-700 transition-all duration-500 overflow-hidden relative z-20">
          <Image
            src={src}
            alt={alt}
            width="w-20"
            className="h-20 sm:w-24 sm:h-24 rounded-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
          />
        </div>
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#14213d] text-white text-[10px] font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-md z-30 scale-95 group-hover:scale-100">
          {tours}+ Tours
        </span>
      </div>

      <h4 className="mt-3 text-sm sm:text-base font-bold text-[#14213d] dark:text-white group-hover:text-[#EB662B] transition-colors duration-300">
        {title}
      </h4>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">{tours}+ Tours</p>
    </div>
  );
};

export default DestinationCard;
