import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getTours } from "../api/tripService";
import TourCard from "../components/card/TourCard";
import { FaArrowLeft } from "react-icons/fa6";
import AdvancedFilters from "../components/common/AdvancedFilters";

const ToursPage = () => {
  const [tours, setTours] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState("All Locations");
  const uniqueCities = ["All Locations", ...new Set(tours.map((item: any) => item.location || item.city).filter(Boolean))];
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<{ priceRange: [number, number]; stars: number[] }>({
    priceRange: [0, 1000],
    stars: []
  });

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setIsLoading(true);
        const data = await getTours();
        setTours(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching tours:", error);
        setTours([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTours();
  }, []);

  const filteredTours = tours.filter(tour => {
     const matchesPrice = tour.price <= filters.priceRange[1];
     const matchesStars = filters.stars.length === 0 || filters.stars.includes(Math.floor(tour.rating));
     const matchesCity = selectedCity === "All Locations" || (tour.location || tour.city) === selectedCity;
     return matchesPrice && matchesStars && matchesCity;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 text-sm font-medium transition"
          >
            <FaArrowLeft />
            Back
          </Link>
          <div className="h-5 w-px bg-gray-200" />
          <div>
            <h1 className="text-lg font-bold text-[#05073C]">Popular Tours</h1>
            <p className="text-xs text-gray-500">{tours.length} tours available</p>
          </div>
          <div className="ml-auto">
             <select 
               className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-[#05073C] focus:outline-none focus:border-[#EB662B] bg-white shadow-sm cursor-pointer"
               value={selectedCity}
               onChange={(e) => setSelectedCity(e.target.value)}
             >
               {uniqueCities.map(city => (
                  <option key={city as string} value={city as string}>{city}</option>
               ))}
             </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0">
          <AdvancedFilters onFilterChange={setFilters} />
        </div>
        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EB662B]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          )}
          {!isLoading && filteredTours.length === 0 && (
             <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 mt-6">
               <p className="text-gray-500 font-medium">No tours match your current filters.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToursPage;
