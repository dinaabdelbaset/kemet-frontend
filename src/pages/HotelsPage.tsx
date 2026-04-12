import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import {
  FaCalendarCheck,
  FaConciergeBell,
  FaDumbbell,
  FaHeadset,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaSpa,
  FaStar,
  FaSwimmingPool,
  FaUtensils,
  FaWifi,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Button from "../components/Ui/Button";
import SectionWrapper from "../components/sections/SectionWrapper";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import AdvancedFilters from "../components/common/AdvancedFilters";

const getHotelImage = (hotel: any) => {
  if (hotel.image) {
      if (hotel.image.startsWith('/')) {
         return 'http://localhost:5173' + hotel.image;
      }
      return hotel.image;
  }
  return "https://via.placeholder.com/400";
};

const amenities = [
  { icon: <FaWifi />, name: "Free High-Speed WiFi" },
  { icon: <FaSwimmingPool />, name: "Infinity Pools" },
  { icon: <FaUtensils />, name: "Fine Dining" },
  { icon: <FaSpa />, name: "Luxury Spa" },
  { icon: <FaDumbbell />, name: "Fitness Center" },
  { icon: <FaConciergeBell />, name: "24/7 Concierge" },
];

const HotelsPage = () => {
  useDocumentTitle("Hotels | Kemet");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [hotels, setHotels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarFilters, setSidebarFilters] = useState<{ priceRange: [number, number]; stars: number[] }>({
    priceRange: [0, 5000],
    stars: []
  });
  const [apiError, setApiError] = useState<string | null>(null);

  const cities = ["All", "Cairo", "Giza", "Hurghada", "Sharm El-Sheikh", "Alexandria", "Luxor", "Aswan", "Marsa Matrouh", "Port Said", "Fayoum"];

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setIsLoading(true);
        setApiError(null);
        // Use axiosClient so it points to the correct deployed URL
        const response = await axiosClient.get("/hotels");
        if (Array.isArray(response.data) && response.data.length > 0) {
            setHotels(response.data);
        } else if (response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
            setHotels(response.data.data);
        } else {
            setHotels([]);
        }
      } catch (error: any) {
        console.error("Error fetching hotels:", error.message);
        setHotels([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const filteredHotels = hotels.filter((hotel) => {
    const title = hotel.title || hotel.name || "";
    const matchesSearch = title.toLowerCase().includes((searchTerm || "").toLowerCase());
    
    const location = hotel.location || hotel.city || "";
    const matchesCity = selectedCity === "All" || location === selectedCity;
    
    const price = Number(hotel.price_starts_from) || Number(hotel.price) || 0;
    const matchesPrice = price <= sidebarFilters.priceRange[1];
    
    const rating = Number(hotel.rating) || 0;
    const matchesStars = sidebarFilters.stars.length === 0 || sidebarFilters.stars.includes(Math.floor(rating));
    
    return matchesSearch && matchesCity && matchesPrice && matchesStars;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920"
            alt="Hotels Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
            Find Your Perfect Stay
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 drop-shadow-md">
            Discover luxury hotels, boutique stays, and cozy resorts tailored
            for your unforgettable journey.
          </p>
          <a href="#hotels-list" className="flex justify-center items-center">
            <Button className="px-10 py-4 rounded-full text-white text-lg font-bold shadow-xl transform transition hover:scale-105">
              Explore Now
            </Button>
          </a>
        </div>
      </section>

      {/* Stats / Benefits Bar */}
      <div className="bg-white border-b border-gray-100 py-8 relative z-20 -mt-10 mx-auto max-w-6xl rounded-xl shadow-xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex items-center gap-4">
          <div className="bg-[#EB662B]/10 p-4 rounded-full">
            <FaShieldAlt className="text-[#EB662B] text-2xl" />
          </div>
          <div>
            <h4 className="font-bold text-[#05073C]">Best Price Guarantee</h4>
            <p className="text-sm text-gray-500">
              We match any price you find.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-[#EB662B]/10 p-4 rounded-full">
            <FaCalendarCheck className="text-[#EB662B] text-2xl" />
          </div>
          <div>
            <h4 className="font-bold text-[#05073C]">Free Cancellation</h4>
            <p className="text-sm text-gray-500">
              Flexible bookings for your peace of mind.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-[#EB662B]/10 p-4 rounded-full">
            <FaHeadset className="text-[#EB662B] text-2xl" />
          </div>
          <div>
            <h4 className="font-bold text-[#05073C]">24/7 Support</h4>
            <p className="text-sm text-gray-500">
              We're here whenever you need us.
            </p>
          </div>
        </div>
      </div>

      {/* Hotel Gallery Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#05073C]">
            Explore Our Destinations
          </h2>
          <p className="text-gray-500 mt-2">
            Take a glimpse at some of our most stunning properties.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {hotels.slice(0, 4).map((hotel, index) => (
            <div
              key={index}
              className="relative h-64 overflow-hidden rounded-2xl group border-2 border-transparent transition-all duration-500 hover:border-[#D4AF37] hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:-translate-y-2"
            >
              <img
                src={getHotelImage(hotel)}
                alt={hotel.title || hotel.name || "Hotel"}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            </div>
          ))}
        </div>
      </div>

      <div
        id="hotels-list"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        {/* Search & Filter Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-[#05073C]">
              Available Hotels
            </h2>
            <p className="text-gray-500 mt-1">
              Showing the best results in your selected location.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 grow max-w-2xl bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
            <div className="grow">
              <input
                type="text"
                placeholder="Search hotel name..."
                className="w-full px-4 py-3 text-sm focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="h-10 w-px bg-gray-200 hidden sm:block" />
            <div className="min-w-37.5">
              <select
                className="w-full px-4 py-3 text-sm focus:outline-none bg-transparent cursor-pointer font-medium"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Filters and Hotels Grid Layout */}
        <div className="flex flex-col md:flex-row gap-8 mb-16">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <AdvancedFilters onFilterChange={setSidebarFilters} />
          </div>
          
          {/* Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EB662B]"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                  {filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white rounded-2xl overflow-hidden border-2 border-transparent hover:border-[#D4AF37] hover:shadow-[0_12px_30px_rgba(212,175,55,0.25)] transition-all duration-500 group flex flex-col h-full hover:-translate-y-2"
            >
              {/* Hotel Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={getHotelImage(hotel)}
                  alt={hotel.title || "Hotel"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Booking.com Style Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                   {hotel.id % 3 === 0 && (
                     <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded shadow-md w-max">
                        High Demand - Only 2 rooms left!
                     </span>
                   )}
                   {hotel.id % 2 === 0 && (
                     <span className="bg-[#003580] text-white text-[10px] font-black uppercase px-2 py-1 rounded shadow-md flex items-center gap-1 w-max">
                        Kemet VIP Genius Level 2
                     </span>
                   )}
                </div>

                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[#05073C] font-bold shadow-sm flex flex-col items-center gap-1">
                  <div className="flex gap-1 items-center">
                     <span className="text-xl">{(Number(hotel.rating) || 9.8).toFixed(1)}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 uppercase">{Number(hotel.rating) >= 4.5 ? 'Exceptional' : 'Fabulous'}</span>
                </div>
              </div>

              {/* Hotel Details */}
              <div className="p-6 flex flex-col grow">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#EB662B] uppercase tracking-wider mb-2">
                  <FaMapMarkerAlt />
                  {hotel.location || hotel.city}
                </div>
                <h3 className="text-xl font-bold text-[#05073C] group-hover:text-[#EB662B] transition-colors leading-tight">
                  {hotel.title || hotel.name}
                </h3>
                
                {/* Free Cancellation Badge */}
                <div className="mt-2 mb-3">
                   <p className="text-green-700 font-bold text-xs">✓ Free cancellation</p>
                   <p className="text-green-700 text-[10px]">No prepayment needed – pay at the property</p>
                </div>
                
                <p className="text-sm text-gray-500 line-clamp-2 mt-auto mb-4">
                  {hotel.description || "Experience luxury with top-tier amenities and stunning views."}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">
                      Starts from
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-[#05073C]">
                        ${hotel.price_starts_from || hotel.price}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">
                        /night
                      </span>
                    </div>
                  </div>
                  <Link to={`/hotels/${hotel.id}`}>
                    <Button className="text-white text-sm px-7 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                      View Stay
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
              </>
            )}

            {apiError && !isLoading && (
              <div className="text-center py-24 bg-red-50 rounded-3xl border border-red-300">
                <h3 className="text-2xl font-bold text-red-500">
                  Backend API Error ⚠️
                </h3>
                <p className="text-red-400 mt-2">
                  {apiError} (Make sure your Laravel backend is running and allows CORS).
                </p>
              </div>
            )}

            {filteredHotels.length === 0 && !isLoading && !apiError && (
              <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300">
                <h3 className="text-2xl font-bold text-gray-400">
                  No matching hotels found.
                </h3>
                <p className="text-gray-400 mt-2">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Amenities Section */}
      <SectionWrapper className="bg-white py-24 px-6 md:px-12 rounded-3xl mb-20 shadow-sm border border-gray-100">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#05073C]">
            World-Class Amenities
          </h2>
          <p className="text-gray-500 mt-2">
            Everything you need for a comfortable and luxury stay.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {amenities.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-4 group">
              <div className="w-16 h-16 bg-[#EB662B]/5 rounded-2xl flex items-center justify-center text-[#EB662B] text-2xl group-hover:bg-[#EB662B] group-hover:text-white transition-all duration-300 transform group-hover:-translate-y-2">
                {item.icon}
              </div>
              <span className="text-sm font-bold text-[#05073C] text-center">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/*  Rewards Section */}
      <SectionWrapper className="mb-20">
        <div className="relative overflow-hidden rounded-3xl bg-[#05073C] p-8 md:p-16">
          <div className="relative z-10 max-w-2xl">
            <span className="text-[#EB662B] font-bold tracking-widest uppercase text-sm">
              Join the Club
            </span>
            <h2 className="text-white text-3xl md:text-5xl font-extrabold mt-4 leading-tight">
              Save up to <span className="text-[#EB662B]">20% extra</span> with
              our membership
            </h2>
            <p className="text-white/70 mt-6 text-lg">
              Sign up for free and get instant access to member-only prices on
              thousands of hotels worldwide.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button className="px-10 py-4 rounded-xl text-white font-bold">
                Join Now for Free
              </Button>
              <Button
                backgroundColor="transparent"
                className="px-10 py-4 rounded-xl text-white font-bold border border-white/20 hover:bg-white/5"
              >
                Learn More
              </Button>
            </div>
          </div>
          {/* Abstract background elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#EB662B]/10 blur-3xl rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[#EB662B]/5 blur-3xl rounded-full -ml-20 -mb-20" />
        </div>
      </SectionWrapper>
    </div>
  );
};

export default HotelsPage;
