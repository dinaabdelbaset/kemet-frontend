import { useState, useEffect } from "react";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { Link, useLocation } from "react-router-dom";
import { FaMapMarkerAlt, FaShoppingBag } from "react-icons/fa";
import { useQuery } from '@tanstack/react-query';
import { getBazaars } from '@/api/bazaarService';

const BazaarsPage = () => {
  const { data: bazaars, isLoading, error } = useQuery({
    queryKey: ['bazaars'],
    queryFn: getBazaars
  });

  const [activeCity, setActiveCity] = useState("All");
  const urlLocation = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(urlLocation.search);
    const cityParam = params.get("city");
    if (cityParam) {
      setActiveCity(cityParam);
    }
  }, [urlLocation]);

  const citiesList = ["All", "Cairo", "Giza", "Alexandria", "Luxor", "Aswan", "Sharm El-Sheikh", "Hurghada", "Marsa Alam", "Marsa Matrouh", "Port Said", "Fayoum"];

  const filteredBazaars = !bazaars ? [] : (activeCity === "All" 
    ? bazaars 
    : bazaars.filter((r: any) => r.location?.toLowerCase().includes(activeCity.toLowerCase())));

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#fcfaf8]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div></div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-[#fcfaf8] text-red-500">Failed to load bazaars. Please try again later.</div>;
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[450px] w-full flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="/images/bazaars_hero.png" 
            alt="Bazaars Market Hero" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#cd4f3c]/90 to-black/60"></div>
        
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 uppercase tracking-wider">
            Local Bazaars
          </h1>
          <p className="text-lg text-white/90 mb-8 font-light">
            Immerse yourself in the colors, scents, and sounds of historical markets. Find unique souvenirs, taste local delicacies, and experience true culture.
          </p>
        </div>
      </section>

      {/* Featured Bazaars */}
      <SectionWrapper className="py-20 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-[#222] mb-4">Explore Iconic Markets</h2>
            <p className="text-gray-500 max-w-2xl mx-auto mb-8">
              From the spice alleys of Cairo to the carpet shops of Istanbul, our curated list of classic bazaars offers an unforgettable shopping journey.
            </p>
            {/* Filter Dropdown */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto bg-white p-2 rounded-xl border border-gray-200 shadow-sm" dir="ltr">
               <div className="flex items-center px-4"><span className="text-gray-400"><FaMapMarkerAlt /></span></div>
               <div className="h-10 w-px bg-gray-200 hidden sm:block" />
               <select
                 className="w-full px-4 py-3 text-sm focus:outline-none bg-transparent cursor-pointer font-bold text-gray-700"
                 value={activeCity}
                 onChange={(e) => setActiveCity(e.target.value)}
               >
                 {citiesList.map((city) => (
                   <option key={city} value={city}>
                     {city === "All" ? "All Locations" : city}
                   </option>
                 ))}
               </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBazaars?.map((bazaar: any) => (
              <Link
                key={bazaar.id}
                to={`/bazaars/${bazaar.id}`}
                className="block relative bg-white border border-[#E7E6E6] dark:border-gray-700 rounded-3xl overflow-hidden transition-all duration-[600ms] hover:border-[#cd4f3c] hover:shadow-[0_20px_40px_rgba(205,79,60,0.15)] group h-[420px] w-full"
              >
                {/* Background Cover Image (Slides up on hover) */}
                <div className="absolute inset-x-0 top-0 w-full h-full transition-all duration-[800ms] ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:h-[40%] z-10 overflow-hidden rounded-t-3xl group-hover:rounded-b-none rounded-b-3xl">
                  <img
                    src={bazaar.image || '/placeholder.png'}
                    alt={bazaar.title}
                    className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-700 group-hover:opacity-0" />
                  
                  {/* Location Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-white/95 backdrop-blur-md text-[#cd4f3c] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                      <FaMapMarkerAlt /> {bazaar.location}
                    </span>
                  </div>

                  {/* Pre-Hover Title Overlay */}
                  <div className="absolute bottom-6 left-5 right-5 z-20 transition-all duration-700 transform group-hover:translate-y-10 group-hover:opacity-0 flex flex-col text-left">
                    <h3 className="text-white font-extrabold text-2xl leading-tight text-shadow-md mb-2">{bazaar.title}</h3>
                    <div className="flex items-center gap-1.5 drop-shadow-md text-white/90 text-sm font-bold">
                       <span className="text-[#D4AF37] text-xs"><FaShoppingBag className="inline mr-1"/> Traditional Market</span>
                    </div>
                  </div>
                </div>

                {/* Content (Revealed on hover) */}
                <div className="absolute inset-x-0 bottom-0 h-[60%] bg-white px-6 pt-5 pb-4 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100 z-0 flex flex-col justify-between text-left">
                  <div>
                    <h3 className="text-xl font-bold text-[#14213d] leading-snug hover:text-[#cd4f3c] transition-colors line-clamp-1 mb-3">
                      {bazaar.title}
                    </h3>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center text-xs text-gray-600 font-medium bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                        <FaMapMarkerAlt className="text-[#cd4f3c] text-sm mr-2.5 shrink-0" />
                        <span className="truncate">{bazaar.location}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-3 line-clamp-3 leading-relaxed">
                      {bazaar.description}
                    </p>
                  </div>

                  <div className="border-t border-gray-100 mt-2 pt-2 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 uppercase font-bold">Opening Hours</span>
                      <span className="text-gray-700 font-bold text-xs">
                        {bazaar.open || '9:00 AM - 10:00 PM'}
                      </span>
                    </div>
                    <span className="text-[#cd4f3c] font-bold text-sm">
                        Discover Details &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default BazaarsPage;
