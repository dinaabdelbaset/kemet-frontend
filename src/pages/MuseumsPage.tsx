import SectionWrapper from "@/components/sections/SectionWrapper";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaClock, FaLandmark, FaTicketAlt } from "react-icons/fa";

import { useQuery } from '@tanstack/react-query';
import { getMuseums } from '@/api/museumService';

const MuseumsPage = () => {
  const { data: museums, isLoading, error } = useQuery({
    queryKey: ['museums'],
    queryFn: getMuseums
  });

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
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-[#14213d] mb-2">Featured Landmarks</h2>
              <p className="text-gray-500">Discover Egypt's finest treasures and ancient secrets.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {museums?.map((museum: any) => (
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
                       <FaTicketAlt /> {museum.ticket_price} EGP
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-grow">
                        <FaClock className="text-[#E76F51]" />
                      </div>
                      <span>{museum.details[1]}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto">
                    <Link 
                      to={`/museums/${museum.id}`} 
                      className="flex items-center justify-center w-full px-6 py-3.5 bg-[#E76F51] hover:bg-[#cf4a36] text-white rounded-xl font-bold transition-all shadow-md gap-2 text-lg"
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
