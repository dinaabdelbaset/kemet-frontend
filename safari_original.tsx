import SectionWrapper from "@/components/sections/SectionWrapper";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { useState, useMemo, useEffect } from "react";
import { FilterSidebar } from "../components/filters/FilterSidebar";
import PriceDisplay from "../components/Ui/PriceDisplay";
import axiosClient from "../api/axiosClient";

const SafariPage = () => {
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 3000,
    categories: [] as string[],
    duration: ""
  });

  const [apiSafaris, setApiSafaris] = useState<any[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axiosClient.get('/safaris')
      .then(res => {
        const data = res.data;
        setApiSafaris(data);
        const locations = Array.from(new Set(data.map((s: any) => s.location))) as string[];
        setAvailableLocations(locations);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch safaris:', err);
        setIsLoading(false);
      });
  }, []);

  const filteredSafaris = useMemo(() => {
    return apiSafaris.filter(safari => {
      const matchPrice = safari.price >= filters.minPrice && safari.price <= filters.maxPrice;
      const matchCategory = filters.categories.length === 0 || filters.categories.includes(safari.location);
      
      let matchDuration = true;
      if (filters.duration) {
        const d = safari.duration.toLowerCase();
        if (filters.duration === "Up to 1 hour") matchDuration = d.includes("min") || d.includes("1 hour");
        else if (filters.duration === "1 to 4 hours") matchDuration = d.includes("hour") && parseInt(d) <= 4;
        else if (filters.duration === "4 hours to 1 day") matchDuration = (d.includes("hour") && parseInt(d) > 4) || d === "1 day";
        else if (filters.duration === "Multi-day") matchDuration = d.includes("day") && parseInt(d) > 1;
      }

      return matchPrice && matchCategory && matchDuration;
    });
  }, [filters]);

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600" 
            alt="Safari Hero" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            Wild Safari Adventures
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 text-shadow-md">
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

      {/* Safari Packages with Sidebar */}
      <div id="explore">
        <SectionWrapper className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#05073C] mb-4">Top Safari Expeditions</h2>
            <div className="w-24 h-1 bg-[#EB662B] mx-auto rounded-full"></div>
          </div>
  
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
               <FilterSidebar 
                 onFilterChange={setFilters} 
                 availableCategories={availableLocations} 
               />
            </div>
  
            {/* Results Area */}
            <div className="lg:col-span-3">
              {filteredSafaris.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 text-lg">No safaris found matching your filters.</p>
                  <button 
                    onClick={() => setFilters({ minPrice: 0, maxPrice: 3000, categories: [], duration: "" })}
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
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-[#05073C] shadow-sm">
                          ★ {item.rating} <span className="text-gray-500 font-normal">({item.reviews_count || item.reviews || 0})</span>
                        </div>
                      </div>
                      
                      <div className="p-5 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 text-sm text-[#EB662B] font-medium mb-2">
                          <FaMapMarkerAlt /> {item.location}
                        </div>
                        
                        <h3 className="text-lg font-bold text-[#05073C] mb-3 leading-tight group-hover:text-[#EB662B] transition line-clamp-2">
                          {item.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-5 pb-5 border-b border-gray-100 flex-grow">
                          <FaClock /> {item.duration}
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div>
                            <span className="text-xs text-gray-500 block mb-0.5">From</span>
                            <span className="text-xl font-bold text-[#EB662B]">
                              <PriceDisplay amount={item.price} />
                            </span>
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
