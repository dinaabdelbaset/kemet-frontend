import { useState, useEffect } from "react";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { Link } from "react-router-dom";
import { getTravelGuides } from "../api/blogService";

const TravelGuidesPage = () => {
  const [guides, setGuides] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState("All Locations");
  const uniqueCities = ["All Locations", ...new Set(guides.map((item: any) => item.location || item.city).filter(Boolean))];
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setIsLoading(true);
        const data = await getTravelGuides();
        setGuides(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching travel guides:", error);
        setGuides([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGuides();
  }, []);

  
  const filteredGuides = guides.filter((item: any) => selectedCity === "All Locations" || (item.location || item.city) === selectedCity);
  return (
    <div className="bg-[#fdfaf7] min-h-screen">
      <SectionWrapper className="pt-24 pb-16">
        <div className="text-center max-w-3xl mx-auto px-4 mb-16">
          <h1 className="text-5xl font-extrabold text-[#222] mb-6 font-serif">Ultimate Travel Guides</h1>
          <p className="text-gray-500 text-lg">
            Free, comprehensive destination guides curated by local experts to help you plan the perfect trip.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EB662B]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
            {filteredGuides.map(guide => (
              <div key={guide.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 group">
                 <div className="relative h-64 overflow-hidden">
                   <img src={guide.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt={guide.title} />
                   <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full font-bold text-[#cd4f3c] text-sm shadow-sm">
                     {guide.category || "Guide"}
                   </div>
                 </div>
                 <div className="p-8">
                   <h2 className="text-2xl font-bold text-[#222] mb-3">{guide.title}</h2>
                   <p className="text-gray-600 leading-relaxed text-sm mb-4">{guide.excerpt}</p>
                   <div className="flex items-center justify-between text-xs text-gray-400 mb-6">
                     <span>By {guide.author}</span>
                     <span>{guide.read_time} min read</span>
                   </div>
                   <Link to={`/travel-guides/${guide.id}`} className="text-[#cd4f3c] font-bold uppercase text-sm tracking-wider group-hover:underline">
                     Read Guide →
                   </Link>
                 </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && guides.length === 0 && (
          <div className="text-center py-24">
            <h3 className="text-2xl font-bold text-gray-400">No guides available yet.</h3>
            <p className="text-gray-400 mt-2">Check back soon for new content!</p>
          </div>
        )}
      </SectionWrapper>
    </div>
  );
};

export default TravelGuidesPage;
