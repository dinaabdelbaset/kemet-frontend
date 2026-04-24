import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTravelPackages } from "../api/tripService";
import TravelBlogCard from "../components/card/TravelBlogCard";
import { FaArrowLeft } from "react-icons/fa6";

const TravelPackagesPage = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState("All Locations");
  const uniqueCities = ["All Locations", ...new Set(packages.map((item: any) => item.location || item.city).filter(Boolean))];
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        const data = await getTravelPackages();
        setPackages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching travel packages:", error);
        setPackages([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackages();
  }, []);

  
  const filteredPackages = packages.filter((item: any) => selectedCity === "All Locations" || (item.location || item.city) === selectedCity);
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
            <h1 className="text-lg font-bold text-[#05073C]">All Travel Packages</h1>
            <p className="text-xs text-gray-500">{packages.length} packages available</p>
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

      <div className="max-w-6xl mx-auto px-4 py-10">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EB662B]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg) => (
              <TravelBlogCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelPackagesPage;
