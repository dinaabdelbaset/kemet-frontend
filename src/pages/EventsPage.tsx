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
              <Link
                key={evt.id}
                to={`/events/${evt.id}`}
                className="block relative bg-white border border-[#E7E6E6] dark:border-gray-700 rounded-3xl overflow-hidden transition-all duration-[600ms] hover:border-[#D4AF37] hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] group h-[420px] w-full"
              >
                {/* Background Cover Image (Slides up on hover) */}
                <div className="absolute inset-x-0 top-0 w-full h-full transition-all duration-[800ms] ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:h-[40%] z-10 overflow-hidden rounded-t-3xl group-hover:rounded-b-none rounded-b-3xl">
                  <img
                    src={evt.image || '/placeholder.png'}
                    alt={evt.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-700 group-hover:opacity-0" />
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-gray-100 z-20">
                    <span className="font-bold text-[#cf4a36] text-xs flex items-center gap-1.5">
                       <FaTicketAlt /> <PriceDisplay price={evt.price} baseCurrency="EGP" />
                    </span>
                  </div>

                  {/* Pre-Hover Title Overlay */}
                  <div className="absolute bottom-6 left-5 right-5 z-20 transition-all duration-700 transform group-hover:translate-y-10 group-hover:opacity-0 flex flex-col text-left">
                    <div className="flex items-center gap-1.5 mb-2 bg-black/30 w-max px-2.5 py-1 rounded-full backdrop-blur-sm">
                      <FaCalendarAlt className="text-[#D4AF37] text-xs" />
                      <span className="text-white/90 text-xs font-semibold tracking-wide">{evt.date?.substring(0, 10)}</span>
                    </div>
                    <h3 className="text-white font-extrabold text-2xl leading-tight text-shadow-md">{evt.title}</h3>
                  </div>
                </div>

                {/* Content (Revealed on hover) */}
                <div className="absolute inset-x-0 bottom-0 h-[60%] bg-white px-6 pt-5 pb-4 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100 z-0 flex flex-col justify-between text-left">
                  <div>
                    <h3 className="text-xl font-bold text-[#14213d] leading-snug hover:text-[#D4AF37] transition-colors line-clamp-1 mb-3">
                      {evt.title}
                    </h3>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center text-xs text-gray-600 font-medium bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                        <FaMapMarkerAlt className="text-[#E76F51] text-sm mr-2.5 shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600 font-medium bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                        <FaCalendarAlt className="text-[#E76F51] text-sm mr-2.5 shrink-0" />
                        <span className="truncate">{evt.date?.substring(0, 10)}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600 font-medium bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                        <FaClock className="text-[#E76F51] text-sm mr-2.5 shrink-0" />
                        <span className="truncate">{evt.duration || evt.time || 'Time TBD'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 mt-2 pt-2 flex items-center justify-between">
                    <span className="text-[#D4AF37] font-bold text-sm flex items-center gap-1.5">
                        View Details <FaArrowRight className="text-xs" />
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

export default EventsPage;
