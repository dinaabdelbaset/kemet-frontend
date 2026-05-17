import SectionWrapper from "@/components/sections/SectionWrapper";
import { Link, useLocation } from "react-router-dom";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { useState, useEffect } from "react";
import PriceDisplay from "../components/common/PriceDisplay";
import { getSafaris } from "../api/safariService";
import AdvancedFilters from "../components/common/AdvancedFilters";

const SafariPage = () => {
  const [allSafaris, setAllSafaris] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState("All Locations");
  const uniqueCities = ["All Locations", ...new Set(allSafaris.map((item: any) => item.location || item.city).filter(Boolean))];
  const [filteredSafaris, setFilteredSafaris] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarFilters, setSidebarFilters] = useState<{ priceRange: [number, number]; stars: number[] }>({
    priceRange: [0, 30000],
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
    getSafaris()
      .then(data => {
        setAllSafaris(data);
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
                    onClick={() => setSidebarFilters({ priceRange: [0, 30000], stars: [] })}
                    className="mt-4 text-[#EB662B] font-medium hover:underline"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredSafaris.map((item) => (
                    <Link
                      key={item.id}
                      to={`/safari/${item.id}`}
                      className="block relative bg-white border border-[#E7E6E6] dark:border-gray-700 rounded-3xl overflow-hidden transition-all duration-[600ms] hover:border-[#D4AF37] hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] group h-[420px] w-full"
                    >
                      {/* Background Cover Image (Slides up on hover) */}
                      <div className="absolute inset-x-0 top-0 w-full h-full transition-all duration-[800ms] ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:h-[40%] z-10 overflow-hidden rounded-t-3xl group-hover:rounded-b-none rounded-b-3xl">
                        <img
                          src={item.image || '/placeholder.png'}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-700 group-hover:opacity-0" />
                        
                        {/* Price Badge */}
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-gray-100 z-20">
                          <span className="font-bold text-[#cf4a36] text-xs flex items-center gap-1.5">
                             <PriceDisplay price={item.price} baseCurrency="EGP" />
                          </span>
                        </div>

                        {/* Pre-Hover Title Overlay */}
                        <div className="absolute bottom-6 left-5 right-5 z-20 transition-all duration-700 transform group-hover:translate-y-10 group-hover:opacity-0 flex flex-col text-left">
                          <div className="flex items-center gap-1.5 mb-2 bg-black/30 w-max px-2.5 py-1 rounded-full backdrop-blur-sm">
                            <FaMapMarkerAlt className="text-[#D4AF37] text-xs" />
                            <span className="text-white/90 text-xs font-semibold tracking-wide">{item.location}</span>
                          </div>
                          <h3 className="text-white font-extrabold text-2xl leading-tight text-shadow-md">{item.title}</h3>
                        </div>
                      </div>

                      {/* Content (Revealed on hover) */}
                      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-white px-6 pt-5 pb-4 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100 z-0 flex flex-col justify-between text-left">
                        <div>
                          <h3 className="text-xl font-bold text-[#14213d] leading-snug hover:text-[#D4AF37] transition-colors line-clamp-2 mb-3">
                            {item.title}
                          </h3>
                          
                          <div className="space-y-1.5">
                            <div className="flex items-center text-xs text-gray-600 font-medium bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                              <FaMapMarkerAlt className="text-[#E76F51] text-sm mr-2.5 shrink-0" />
                              <span className="truncate">{item.location}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-600 font-medium bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                              <FaClock className="text-[#E76F51] text-sm mr-2.5 shrink-0" />
                              <span className="truncate">{item.duration}</span>
                            </div>
                          </div>
                          
                          {/* Free Cancellation Badge */}
                          <div className="mt-3">
                             <p className="text-green-700 font-bold text-xs">✓ Free cancellation</p>
                          </div>
                        </div>

                        <div className="border-t border-gray-100 mt-2 pt-2 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-sm font-bold text-gray-800">
                             <span className="bg-[#05073C] text-white px-1.5 py-0.5 rounded text-xs">{(parseFloat(item.rating) || 9.5).toFixed(1)}</span>
                             <span className="text-[10px] text-gray-500 uppercase">{parseFloat(item.rating) >= 4.5 ? 'Exceptional' : 'Fabulous'}</span>
                          </div>
                          <span className="text-[#D4AF37] font-bold text-sm flex items-center gap-1.5">
                              View Details &rarr;
                          </span>
                        </div>
                      </div>
                    </Link>
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
