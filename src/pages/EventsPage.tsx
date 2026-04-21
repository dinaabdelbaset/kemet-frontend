import { useState, useEffect } from "react";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { Link, useLocation } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTicketAlt, FaArrowRight } from "react-icons/fa";
import { useQuery } from '@tanstack/react-query';
import { getEvents } from '@/api/eventService';
import PriceDisplay from "../components/common/PriceDisplay";

const EventsPage = () => {
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents
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

  const filteredEvents = !events ? [] : (activeCity === "All" 
    ? events 
    : events.filter((r: any) => r.location?.toLowerCase().includes(activeCity.toLowerCase())));

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div></div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] text-red-500">Failed to load events. Please try again later.</div>;
  }

  return (
    <div className="bg-[#fdfaf7] min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] w-full">
        <div className="absolute inset-0">
          <img 
            src="/images/events_hero.png" 
            alt="Events Hero" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-sm mb-4 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm border border-[#D4AF37]/30">
            Kemet Calendar
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-6 drop-shadow-lg font-bold">
            Live The Moment
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 max-w-2xl font-light drop-shadow-md">
            Discover legendary festivals and timeless performances across Egypt's majestic governorates.
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <SectionWrapper className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-[#14213d] mb-2">Upcoming Experiences</h2>
              <p className="text-gray-500">Secure your spot at the most anticipated events.</p>
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
            {filteredEvents?.map((evt: any) => (
              <div 
                key={evt.id} 
                className="group bg-[#fcfbf9] rounded-3xl border border-gray-100 shadow-sm hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col"
              >
                {/* Card Image */}
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <img 
                    src={evt.image || '/placeholder.png'} 
                    alt={evt.title} 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/20">
                    <span className="font-bold text-[#cf4a36] text-sm flex items-center gap-2">
                       <FaTicketAlt /> <PriceDisplay price={evt.price} baseCurrency="EGP" />
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-[#14213d] group-hover:text-[#D4AF37] transition-colors leading-tight mb-2">
                      {evt.title}
                    </h3>
                  </div>
                  
                  <div className="space-y-3 mb-6 flex-grow">
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-6 h-6 rounded-full bg-[#fcfbf9] border border-gray-100 flex items-center justify-center mr-3 shrink-0">
                        <FaMapMarkerAlt className="text-[#E76F51] text-xs" />
                      </div>
                      <span className="truncate">{evt.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-6 h-6 rounded-full bg-[#fcfbf9] border border-gray-100 flex items-center justify-center mr-3 shrink-0">
                         <FaCalendarAlt className="text-[#E76F51] text-xs" />
                      </div>
                      <span className="truncate">{evt.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-6 h-6 rounded-full bg-[#fcfbf9] border border-gray-100 flex items-center justify-center mr-3 shrink-0">
                         <FaClock className="text-[#E76F51] text-xs" />
                      </div>
                      <span className="truncate">{evt.duration || evt.time || 'N/A'}</span>
                    </div>
                  </div>

                  <hr className="border-gray-100 mb-5" />

                  <Link 
                    to={`/events/${evt.id}`}
                    className="w-full text-center bg-[#D4AF37] text-white py-3 rounded-xl font-semibold hover:bg-[#b5952f] transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    View Details <FaArrowRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default EventsPage;
