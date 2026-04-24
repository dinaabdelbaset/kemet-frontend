import SectionWrapper from "@/components/sections/SectionWrapper";
import { Link, useLocation } from "react-router-dom";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { useState, useEffect } from "react";
import PriceDisplay from "../components/common/PriceDisplay";
import axiosClient from "../api/axiosClient";
import AdvancedFilters from "../components/common/AdvancedFilters";

const SafariPage = () => {
  const [allSafaris, setAllSafaris] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState("All Locations");
  const uniqueCities = ["All Locations", ...new Set(allSafaris.map((item: any) => item.location || item.city).filter(Boolean))];
  const [filteredSafaris, setFilteredSafaris] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarFilters, setSidebarFilters] = useState<{ priceRange: [number, number]; stars: number[] }>({
    priceRange: [0, 5000],
    stars: []
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

  useEffect(() => {
    axiosClient.get('/safaris')
      .then(res => {
        setAllSafaris(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch safaris:', err);
        setIsLoading(false);
      });
  }, []);

  // Re-filter whenever data OR filters change
  useEffect(() => {
    const result = allSafaris.filter(s => {
      const price = parseFloat(s.price) || 0;
      const rating = parseFloat(s.rating) || 0;
      const matchPrice = price <= sidebarFilters.priceRange[1];
      const matchStars = sidebarFilters.stars.length === 0 || sidebarFilters.stars.includes(Math.floor(rating));
      const matchCity = activeCity === "All" || s.location?.toLowerCase().includes(activeCity.toLowerCase());
      return matchPrice && matchStars && matchCity;
    });
    setFilteredSafaris(result);
  }, [allSafaris, sidebarFilters, activeCity]);

  
  const filteredAllSafaris = allSafaris.filter((item: any) => selectedCity === "All Locations" || (item.location || item.city) === selectedCity);
  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="/images/safari_hero.png"
            alt="Safari Hero"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            Wild Safari Adventures
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10">
            Journey into the heart of the wild. Experience breathtaking landscapes, magnificent wildlife, and unforgettable moments.
          </p>
          <button
            onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-[#EB662B] text-white font-bold rounded-full hover:bg-[#d55822] transition shadow-lg inline-block"
          >
            Start Your Expedition
          </button>
        </div>
      </section>

      {/* Content with Sidebar */}
      <div id="explore">
        <SectionWrapper className="py-20">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
            <div className="text-left">
              <h2 className="text-4xl font-bold text-[#05073C] mb-4">Top Safari Expeditions</h2>
              <div className="w-24 h-1 bg-[#EB662B] rounded-full"></div>
            </div>
            {/* Filter Dropdown */}
            <div className="flex bg-white p-2 rounded-xl border border-gray-200 shadow-sm min-w-[250px]" dir="ltr">
               <div className="flex items-center px-4"><span className="text-gray-400"><FaMapMarkerAlt /></span></div>
               <div className="h-10 w-px bg-gray-200" />
               <select
                 className="w-full px-3 py-2 text-sm focus:outline-none bg-transparent cursor-pointer font-bold text-gray-700"
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

          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* Sidebar - same AdvancedFilters used in Hotels & Tours */}
            <div className="lg:col-span-1">
              <AdvancedFilters onFilterChange={setSidebarFilters} />
            </div>

            {/* Cards */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EB662B]"></div>
                </div>
              ) : filteredSafaris.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 text-lg">No safaris found matching your filters.</p>
                  <button
                    onClick={() => setSidebarFilters({ priceRange: [0, 1000], stars: [] })}
                    className="mt-4 text-[#EB662B] font-medium hover:underline"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredSafaris.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_15px_30px_rgba(212,175,55,0.25)] transition-all duration-500 hover:-translate-y-2 group flex flex-col border-2 border-transparent hover:border-[#D4AF37]">
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={item.image || '/placeholder.png'}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                        />
                        
                        {/* Booking.com Style Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                           {item.id % 4 === 0 && (
                             <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded shadow-md w-max">
                                High Demand - Only 1 spot left!
                             </span>
                           )}
                           {item.id % 3 === 0 && (
                             <span className="bg-[#003580] text-white text-[10px] font-black uppercase px-2 py-1 rounded shadow-md flex items-center gap-1 w-max">
                                Kemet VIP Genius Level 1
                             </span>
                           )}
                        </div>

                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[#05073C] font-bold shadow-sm flex flex-col items-center gap-1">
                          <div className="flex gap-1 items-center">
                             <span className="text-xl">{(parseFloat(item.rating) || 9.5).toFixed(1)}</span>
                          </div>
                          <span className="text-[10px] text-gray-500 uppercase">{parseFloat(item.rating) >= 4.5 ? 'Exceptional' : 'Fabulous'}</span>
                        </div>
                      </div>

                      <div className="p-5 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 text-sm text-[#EB662B] font-medium mb-2">
                          <FaMapMarkerAlt /> {item.location}
                        </div>
                        <h3 className="text-lg font-bold text-[#05073C] mb-3 leading-tight group-hover:text-[#EB662B] transition line-clamp-2">
                          {item.title}
                        </h3>
                        
                        {/* Free Cancellation Badge */}
                        <div className="mt-1 mb-3">
                           <p className="text-green-700 font-bold text-xs">✓ Free cancellation</p>
                           <p className="text-green-700 text-[10px]">No prepayment needed</p>
                        </div>

                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-5 pb-5 border-b border-gray-100 flex-grow">
                          <FaClock /> {item.duration}
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <div>
                            <span className="text-xs text-gray-500 block mb-0.5">From</span>
                            <PriceDisplay price={item.price} className="text-xl font-bold text-[#EB662B]" />
                          </div>
                          <Link to={`/safari/${item.id}`} className="px-5 py-2.5 bg-white border border-gray-200 text-[#05073C] hover:bg-[#EB662B] hover:text-white hover:border-[#EB662B] font-semibold rounded-xl text-sm transition">
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SectionWrapper>
      </div>
    </div>
  );
};

export default SafariPage;
