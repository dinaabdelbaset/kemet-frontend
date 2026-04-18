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
              <div 
                key={bazaar.id} 
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] border border-gray-100 hover:-translate-y-2 transition-all duration-500 flex flex-col"
              >
                {/* Card Image Wrapper */}
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <div className="absolute inset-0 bg-[#e76f51]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 mix-blend-overlay"></div>
                  <img 
                    src={bazaar.image || '/placeholder.png'} 
                    alt={bazaar.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Tags */}
                  <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
                    <span className="bg-white/90 backdrop-blur-md text-[#14213d] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                      <FaMapMarkerAlt className="text-[#e76f51]" /> {bazaar.location}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-[#14213d] mb-3 group-hover:text-[#D4AF37] transition-colors">
                    {bazaar.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-5 leading-relaxed flex-grow line-clamp-3">
                    {bazaar.description}
                  </p>
                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-medium">Open: <br /><span className="text-gray-600">{bazaar.open}</span></span>
                    <Link to={`/bazaars/${bazaar.id}`} className="text-[#cd4f3c] text-sm font-bold hover:underline">
                      Discover Details &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default BazaarsPage;
