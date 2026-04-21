import { useState, useEffect } from "react";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { Link, useLocation } from "react-router-dom";
import { FaMapMarkerAlt, FaClock, FaTicketAlt } from "react-icons/fa";
import PriceDisplay from "@/components/common/PriceDisplay";

import { useQuery } from '@tanstack/react-query';
import { getMuseums } from '@/api/museumService';

const MuseumsPage = () => {
  const { data: museums, isLoading, error } = useQuery({
    queryKey: ['museums'],
    queryFn: getMuseums
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

  const filteredMuseums = !museums ? [] : (activeCity === "All" 
    ? museums 
    : museums.filter((r: any) => r.location?.toLowerCase().includes(activeCity.toLowerCase())));

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div></div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] text-red-500">Failed to load museums. Please try again later.</div>;
  }

  // MUSEUMS_DB is completely replaced by real data from api.

  return (
    <div className="bg-[#fdfaf7] min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] w-full">
        <div className="absolute inset-0">
          <img 
            src="/images/museums/museums-hero.jpg" 
            alt="Museums Hero" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-sm mb-4 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm border border-[#D4AF37]/30">
            Heritage & History
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-6 drop-shadow-lg font-bold">
            Museums & Temples
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 max-w-2xl font-light drop-shadow-md">
            Journey through millennia across Egypt's majestic governorates.
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <SectionWrapper className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-[#14213d] mb-2">Featured Landmarks</h2>
              <p className="text-gray-500">Discover Egypt's finest treasures and ancient secrets.</p>
            </div>
            {/* Filter Dropdown */}
            <div className="flex bg-white p-2 rounded-xl border border-gray-200 shadow-sm w-full md:w-64" dir="ltr">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMuseums?.map((museum: any) => (
              <div 
                key={museum.id} 
                className="group bg-[#fcfbf9] rounded-3xl border border-gray-100 shadow-sm hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col"
              >
                {/* Card Image */}
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <img 
                    src={museum.image || '/placeholder.png'} 
                    alt={museum.name} 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/20">
                    <span className="font-bold text-[#cf4a36] text-sm flex items-center gap-2">
                       <FaTicketAlt /> <PriceDisplay price={museum.ticket_price} baseCurrency="EGP" />
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-[#14213d] group-hover:text-[#cf4a36] transition-colors mb-2">
                       {museum.name}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2">
                       {museum.description || "Explore this amazing museum and its history."}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 py-4 border-y border-dashed border-gray-200 mb-6 flex-grow">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="p-2 bg-[#f4e8e1] rounded-lg">
                        <FaMapMarkerAlt className="text-[#cf4a36]" />
                      </div>
                      <span className="font-medium truncate" title={museum.location}>{museum.location}</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="p-2 bg-[#f4e8e1] rounded-lg">
                        <FaClock className="text-[#cf4a36]" />
                      </div>
                      <span className="font-medium">{museum.opening_hours || "9:00 AM - 5:00 PM"}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto">
                    <Link 
                      to={`/museums/${museum.id}`} 
                      className="flex items-center justify-center w-full px-6 py-3.5 bg-[#cf4a36] hover:bg-[#b03a28] text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg gap-2 text-md"
                    >
                      Details & Booking &rarr;
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

export default MuseumsPage;
