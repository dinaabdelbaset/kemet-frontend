import { useState, useEffect } from "react";
import { getHotels } from "../api/hotelService";
import PriceDisplay from "../components/common/PriceDisplay";
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
import { Link, useLocation } from "react-router-dom";
import Button from "../components/Ui/Button";
import SectionWrapper from "../components/sections/SectionWrapper";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import AdvancedFilters from "../components/common/AdvancedFilters";

const getHotelImage = (hotel: any) => {
  if (hotel.image) {
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
  const routerLocation = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [hotels, setHotels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarFilters, setSidebarFilters] = useState<{ priceRange: [number, number]; stars: number[] }>({
    priceRange: [0, 30000],
    stars: []
  });
  const [apiError, setApiError] = useState<string | null>(null);

  const cities = ["All", "Cairo", "Giza", "Alexandria", "Luxor", "Aswan", "Sharm El-Sheikh", "Hurghada", "Marsa Alam", "Marsa Matrouh", "Port Said", "Fayoum"];

  // Apply filters from URL when page loads
  useEffect(() => {
    const params = new URLSearchParams(routerLocation.search);
    const locParam = params.get("location") || params.get("city") || params.get("q");
    if (locParam) {
      const match = cities.find(c => c.toLowerCase().includes(locParam.toLowerCase()));
      if (match) {
        setSelectedCity(match);
      } else {
        setSearchTerm(locParam);
      }
    }
  }, [routerLocation.search]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setIsLoading(true);
        setApiError(null);
        const data = await getHotels();
        setHotels(data);
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
            <Link
              key={hotel.id}
              to={`/hotels/${hotel.id}`}
              className="block relative bg-white dark:bg-gray-800 border border-[#E7E6E6] dark:border-gray-700 rounded-2xl overflow-hidden transition-all duration-[600ms] hover:border-[#D4AF37] hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] group h-[400px] w-full"
            >
              {/* Background Cover Image (Slides up on hover) */}
              <div className="absolute inset-x-0 top-0 w-full h-full transition-all duration-[800ms] ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:h-[45%] z-10 overflow-hidden rounded-t-2xl group-hover:rounded-b-none rounded-b-2xl">
                <img
                  src={getHotelImage(hotel)}
                  alt={hotel.title || hotel.name || "Hotel"}
                  className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-700 group-hover:opacity-0" />
                
                {/* Badges (Always visible) */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                   {hotel.id % 3 === 0 && (
                     <span className="bg-red-600 text-white text-[9px] font-black uppercase px-2 py-1 rounded shadow-md w-max">
                        Only 2 rooms left!
                     </span>
                   )}
                   {hotel.id % 2 === 0 && (
                     <span className="bg-[#003580] text-white text-[9px] font-black uppercase px-2 py-1 rounded shadow-md flex items-center gap-1 w-max">
                        Genius Level 2
                     </span>
                   )}
                </div>

                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg text-[#05073C] font-bold shadow-md flex flex-col items-center gap-0.5 z-20 border border-gray-100">
                   <span className="text-sm">{(Number(hotel.rating) || 9.8).toFixed(1)}</span>
                   <span className="text-[8px] text-gray-500 uppercase">{Number(hotel.rating) >= 4.5 ? 'Exceptional' : 'Fabulous'}</span>
                </div>

                {/* Pre-Hover Title Overlay */}
                <div className="absolute bottom-6 left-5 right-5 z-20 transition-all duration-700 transform group-hover:translate-y-10 group-hover:opacity-0 flex flex-col">
                  <div className="flex items-center gap-1.5 mb-2 bg-black/30 w-max px-2.5 py-1 rounded-full backdrop-blur-sm">
                    <FaMapMarkerAlt className="text-[#D4AF37] text-xs" />
                    <span className="text-white/90 text-xs font-semibold tracking-wide">{hotel.location || hotel.city}</span>
                  </div>
                  <h3 className="text-white font-extrabold text-xl leading-tight text-shadow-md mb-2">{hotel.title || hotel.name}</h3>
                  <div className="flex items-baseline gap-1.5 drop-shadow-md">
                     <span className="text-white/70 text-[10px] uppercase font-bold">From</span>
                     <span className="text-[#D4AF37] text-lg font-bold"><PriceDisplay price={Number(hotel.price_starts_from || hotel.price)} baseCurrency="EGP" /></span>
                     <span className="text-white/60 text-[10px]">/ night</span>
                  </div>
                </div>
              </div>

              {/* Content (Revealed on hover) */}
              <div className="absolute inset-x-0 bottom-0 h-[55%] bg-white dark:bg-gray-800 px-5 pt-5 pb-4 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100 z-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    <FaMapMarkerAlt className="text-[#EB662B]" />
                    <span>{hotel.location || hotel.city}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-[#05073C] dark:text-white leading-snug hover:text-[#EB662B] transition-colors line-clamp-2">
                    {hotel.title || hotel.name}
                  </h3>
                  
                  <div className="mt-2 mb-3 bg-green-50 border border-green-100 rounded p-1.5 w-max">
                     <p className="text-green-700 font-bold text-[10px] flex items-center gap-1">✓ Free cancellation</p>
                     <p className="text-green-600 text-[9px] mt-0.5">No prepayment needed</p>
                  </div>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {hotel.description || "Experience luxury with top-tier amenities and stunning views. The perfect stay awaits you."}
                  </p>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 mt-3 pt-3 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Total price from</span>
                    <span className="text-[#05073C] dark:text-[#D4AF37] font-black text-lg">
                      <PriceDisplay price={Number(hotel.price_starts_from || hotel.price)} baseCurrency="EGP" />
                    </span>
                  </div>
                  <span className="text-white bg-[#05073C] hover:bg-[#D4AF37] text-xs px-4 py-2 rounded-lg font-bold transition-colors">
                    View Stay
                  </span>
                </div>
              </div>
            </Link>
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
