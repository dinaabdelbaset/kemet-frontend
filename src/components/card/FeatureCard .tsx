import type { IWhyChooseUs } from "../../interface";
import Image from "../Ui/Image";

const FeatureCard = ({ src, alt, title, description }: IWhyChooseUs) => {
  return (
    <div className="flex flex-col items-center text-center px-4 sm:items-start sm:text-left group transition-all duration-500 hover:-translate-y-3 p-5 rounded-2xl border border-transparent hover:border-[#D4AF37]/40 hover:bg-white dark:hover:bg-gray-800 hover:shadow-[0_15px_40px_rgba(212,175,55,0.12)] relative overflow-hidden">
      
      {/* Hover background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 via-transparent to-[#EB662B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

      {/* Image */}
      <div className="relative z-10">
        <Image
          src={src}
          alt={alt}
          width="w-14"
          className="mb-4 flex h-14 items-center justify-center rounded-full bg-orange-50 group-hover:bg-[#1A365D] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
        />
      </div>

      <h3 className="relative z-10 mt-4 text-base sm:text-lg font-bold text-[#05073C] dark:text-white capitalize group-hover:text-[#D4AF37] transition-colors duration-300">
        {title}
      </h3>

      <p className="relative z-10 mt-2 text-sm text-gray-500 leading-6 sm:leading-7 max-w-xs sm:max-w-none transition-colors duration-300">
        {description}
      </p>

      {/* Bottom accent line */}
      <div className="relative z-10 mt-4 h-[2px] w-0 group-hover:w-12 bg-gradient-to-r from-[#D4AF37] to-[#EB662B] transition-all duration-500 rounded-full" />
    </div>
  );
};

export default FeatureCard;
