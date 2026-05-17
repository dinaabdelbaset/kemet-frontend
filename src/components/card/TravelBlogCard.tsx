import { Link } from "react-router-dom";
import type { ITravelPackage } from "../../interface";

interface IProps {
  pkg: ITravelPackage;
}

const TravelBlogCard = ({ pkg }: IProps) => {
  return (
    <Link
      to={`/packages/${pkg.id}`}
      className="block relative bg-white dark:bg-gray-800 border border-[#E7E6E6] dark:border-gray-700 rounded-2xl overflow-hidden transition-all duration-[600ms] hover:border-[#D4AF37] hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] group h-[400px] w-full"
    >
      {/* Background Cover Image (Slides up on hover) */}
      <div className="absolute inset-x-0 top-0 w-full h-full transition-all duration-[800ms] ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:h-[45%] z-10 overflow-hidden rounded-t-2xl group-hover:rounded-b-none rounded-b-2xl">
        <img
          src={pkg.image || '/placeholder.png'}
          alt={pkg.alt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-700 group-hover:opacity-0" />

        {/* Tag Badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg text-xs font-bold text-[#05073C] shadow-md border border-gray-100">
            {pkg.tag}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-4 right-4 z-20">
          <span className="px-3 py-1.5 bg-[#EB662B] text-white rounded-full text-xs font-bold shadow-md">
            From ${pkg.price}
          </span>
        </div>

        {/* Pre-Hover Title Overlay */}
        <div className="absolute bottom-6 left-5 right-5 z-20 transition-all duration-700 transform group-hover:translate-y-10 group-hover:opacity-0">
          <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-2">{pkg.duration}</p>
          <h3 className="text-white text-xl font-black leading-tight line-clamp-2 text-shadow-md">{pkg.title}</h3>
        </div>
      </div>

      {/* Content (Revealed on hover) */}
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-white dark:bg-gray-800 px-5 pt-5 pb-4 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100 z-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            <span>{pkg.date}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="text-[#D4AF37]">{pkg.duration}</span>
          </div>
          
          <h3 className="text-base font-bold text-[#05073C] dark:text-white leading-snug hover:text-[#D4AF37] transition-colors line-clamp-2">
            {pkg.title}
          </h3>
          
          <p className="text-xs text-gray-500 mt-2 font-medium">
            By <span className="text-gray-800 dark:text-gray-300">{pkg.author}</span>
          </p>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 mt-3 pt-3 flex items-center justify-between">
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
            {(pkg.activities?.length || 0)} activities included
          </span>
          <span className="text-[#05073C] dark:text-[#D4AF37] font-black text-lg">
            ${pkg.price}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TravelBlogCard;

