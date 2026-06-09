import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  getArabCountries, 
  getArabLandmarks, 
  getArabCountryHotels,
  getArabCountryRestaurants,
  type ArabCountry, 
  type ArabLandmark 
} from "../api/arabWorldService";
import { 
  FaMapMarkerAlt, 
  FaStar, 
  FaGlobe, 
  FaHistory, 
  FaBuilding, 
  FaTree, 
  FaTimes, 
  FaMapMarkedAlt,
  FaClock,
  FaCoins,
  FaHotel,
  FaUtensils
} from "react-icons/fa";
import SectionWrapper from "../components/sections/SectionWrapper";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const ArabWorldTourismPage = () => {
  useDocumentTitle("Arab World Wonders | Kemet");
  const navigate = useNavigate();

  const handleBookLandmark = (landmark: ArabLandmark) => {
    navigate("/checkout", {
      state: {
        id: landmark.id,
        type: "attraction",
        title: isArabic ? `تذكرة دخول: ${landmark.name_ar}` : `Admission Ticket: ${landmark.name_en}`,
        price: landmark.ticket_price,
        image: landmark.image,
        date: new Date().toISOString().split('T')[0],
        guests: 1,
        breakdown: isArabic ? "تذكرة دخول معلم سياحي" : "Admission Ticket"
      }
    });
  };

  const [countries, setCountries] = useState<ArabCountry[]>([]);
  const [landmarks, setLandmarks] = useState<ArabLandmark[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  
  const [selectedCountryId, setSelectedCountryId] = useState<string | number>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedLandmark, setSelectedLandmark] = useState<ArabLandmark | null>(null);
  
  const [activeSubTab, setActiveSubTab] = useState<"landmarks" | "hotels" | "restaurants">("landmarks");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingHotels, setIsLoadingHotels] = useState(false);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false);

  // Translation detection (Arab vs English)
  const [isArabic, setIsArabic] = useState(() => {
    return document.documentElement.dir === "rtl" || localStorage.getItem("kemet_lang") === "ar";
  });

  useEffect(() => {
    const handleLangChange = () => {
      setIsArabic(document.documentElement.dir === "rtl" || localStorage.getItem("kemet_lang") === "ar");
    };
    window.addEventListener("languagechange", handleLangChange);
    return () => window.removeEventListener("languagechange", handleLangChange);
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await getArabCountries();
        setCountries(data);
      } catch (err) {
        console.error("Error fetching Arab countries:", err);
      }
    };
    fetchCountries();
  }, []);

  // Fetch Landmarks
  useEffect(() => {
    const fetchLandmarks = async () => {
      try {
        setIsLoading(true);
        const data = await getArabLandmarks(selectedCountryId, selectedCategory);
        setLandmarks(data);
      } catch (err) {
        console.error("Error fetching Arab landmarks:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLandmarks();
  }, [selectedCountryId, selectedCategory]);

  // Reset sub-tab when selected country changes
  useEffect(() => {
    setActiveSubTab("landmarks");
  }, [selectedCountryId]);

  // Fetch Hotels and Restaurants
  useEffect(() => {
    if (selectedCountryId === "All") return;
    
    const fetchHotelsAndRestaurants = async () => {
      try {
        setIsLoadingHotels(true);
        setIsLoadingRestaurants(true);
        const [hotelsData, restaurantsData] = await Promise.all([
          getArabCountryHotels(selectedCountryId),
          getArabCountryRestaurants(selectedCountryId)
        ]);
        setHotels(hotelsData);
        setRestaurants(restaurantsData);
      } catch (err) {
        console.error("Error fetching country hotels/restaurants:", err);
      } finally {
        setIsLoadingHotels(false);
        setIsLoadingRestaurants(false);
      }
    };
    
    fetchHotelsAndRestaurants();
  }, [selectedCountryId]);

  const categories = [
    { value: "All", label_en: "All Wonders", label_ar: "كل العجائب", icon: <FaGlobe /> },
    { value: "historical", label_en: "Historical", label_ar: "تاريخية", icon: <FaHistory /> },
    { value: "modern", label_en: "Modern Marvels", label_ar: "عجائب حديثة", icon: <FaBuilding /> },
    { value: "nature", label_en: "Natural Wonders", label_ar: "عجائب طبيعية", icon: <FaTree /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      
      {/* Hero Banner */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&q=80&w=1920"
            alt="Arabian Tourism Portal"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-[#05073C]/80" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <span className="text-[#D4AF37] font-black uppercase tracking-widest text-xs sm:text-sm bg-black/40 px-4 py-2 rounded-full mb-4 inline-block border border-[#D4AF37]/30">
            {isArabic ? "بوابة السياحة العربية المشتركة" : "Arabian Unified Tourism Portal"}
          </span>
          <h1 className="text-3xl md:text-6xl font-black text-white mb-4 drop-shadow-xl font-serif">
            {isArabic ? "روائع العالم العربي" : "Wonders of the Arab World"}
          </h1>
          <p className="text-sm md:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
            {isArabic 
              ? "اكتشف الكنوز التاريخية الأسطورية، المعالم الحديثة الفاخرة، والعجائب الطبيعية الساحرة عبر أقطار الوطن العربي الواحد." 
              : "Explore legendary historical treasures, luxury modern landmarks, and stunning natural escapes across the unified Arab world."}
          </p>
        </div>
      </section>

      {/* Country Slider / Grid */}
      <SectionWrapper className="relative z-20 -mt-16 max-w-6xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl p-6 md:p-8">
          <h2 className="text-lg font-black text-[#05073C] dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
            {isArabic ? "اختر الدولة العربية" : "Select Arab Country"}
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {/* "All" button */}
            <button
              onClick={() => setSelectedCountryId("All")}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
                selectedCountryId === "All"
                  ? "bg-[#05073C] text-white border-[#05073C] dark:bg-[#D4AF37] dark:text-[#05073C] dark:border-[#D4AF37] scale-105 shadow-md"
                  : "bg-gray-50 border-gray-100 hover:border-[#D4AF37] text-gray-600 dark:bg-gray-850 dark:border-gray-800 dark:text-gray-300"
              }`}
            >
              <span className="text-2xl mb-1">🗺️</span>
              <span className="text-xs font-black">{isArabic ? "الكل" : "All Nations"}</span>
            </button>

            {countries.map((country) => (
              <button
                key={country.id}
                onClick={() => setSelectedCountryId(country.id)}
                className={`group flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 overflow-hidden relative ${
                  selectedCountryId === country.id
                    ? "bg-[#05073C] text-white border-[#05073C] dark:bg-[#D4AF37] dark:text-[#05073C] dark:border-[#D4AF37] scale-105 shadow-md"
                    : "bg-gray-50 border-gray-100 hover:border-[#D4AF37] text-gray-600 dark:bg-gray-850 dark:border-gray-800 dark:text-gray-300"
                }`}
              >
                {/* Background image on hover / select */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-300">
                  <img src={country.image} alt={country.name_en} className="w-full h-full object-cover" />
                </div>
                
                <span className="text-3xl mb-1.5 z-10">{country.flag}</span>
                <span className="text-xs font-black z-10 text-center truncate w-full">
                  {isArabic ? country.name_ar : country.name_en}
                </span>
              </button>
            ))}
          </div>

          {/* Selected Country Info */}
          {selectedCountryId !== "All" && (
            <div className="mt-8 p-6 rounded-2xl bg-gray-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center gap-6 animate-in fade-in duration-300">
              {countries.filter(c => c.id === selectedCountryId).map((c) => (
                <div key={c.id} className="flex flex-col md:flex-row items-center gap-6 w-full">
                  <img 
                    src={c.image} 
                    alt={c.name_en} 
                    className="w-full md:w-48 h-32 rounded-xl object-cover shadow-md shrink-0" 
                  />
                  <div>
                    <h3 className="text-xl font-black text-[#05073C] dark:text-white flex items-center gap-2 mb-2">
                      <span>{c.flag}</span>
                      {isArabic ? c.name_ar : c.name_en}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                      {isArabic ? c.description_ar : c.description_en}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SectionWrapper>

      {/* Main Filter & Grid Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {selectedCountryId === "All" ? (
          <>
            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 border transition ${
                    selectedCategory === cat.value
                      ? "bg-[#05073C] text-white border-[#05073C] dark:bg-[#D4AF37] dark:text-[#05073C] dark:border-[#D4AF37] shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-850 hover:border-[#D4AF37]"
                  }`}
                >
                  {cat.icon}
                  {isArabic ? cat.label_ar : cat.label_en}
                </button>
              ))}
            </div>

            {/* Loading */}
            {isLoading ? (
              <div className="flex justify-center items-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
              </div>
            ) : landmarks.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 p-8 shadow-sm">
                <span className="text-6xl mb-4 block">🏝️</span>
                <h3 className="text-xl font-bold text-[#05073C] dark:text-white mb-2">
                  {isArabic ? "لا توجد معالم مطابقة" : "No matching landmarks found"}
                </h3>
                <p className="text-gray-400">
                  {isArabic ? "جرّب تغيير فئة البحث أو اختيار دولة أخرى." : "Try adjusting your filters or country selection."}
                </p>
              </div>
            ) : (
              /* Landmarks Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {landmarks.map((landmark) => (
                  <div
                    key={landmark.id}
                    onClick={() => setSelectedLandmark(landmark)}
                    className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition duration-300 flex flex-col justify-between h-full group cursor-pointer"
                  >
                    {/* Image & Badges */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={landmark.image}
                        alt={landmark.name_en}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-black/55 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-white/20">
                          {landmark.category}
                        </span>
                      </div>

                      <div className="absolute top-4 right-4 bg-white/95 dark:bg-gray-900/95 shadow-sm px-2.5 py-1 rounded-xl text-lg flex items-center justify-center">
                        {landmark.country?.flag}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            <FaMapMarkerAlt /> {isArabic ? landmark.location_ar : landmark.location_en}
                          </span>
                          <span className="text-xs font-black text-amber-500 flex items-center gap-0.5">
                            <FaStar className="fill-current" /> {landmark.rating}
                          </span>
                        </div>

                        <h3 className="text-lg font-black text-[#05073C] dark:text-white group-hover:text-[#D4AF37] transition-colors mb-3 leading-tight">
                          {isArabic ? landmark.name_ar : landmark.name_en}
                        </h3>

                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed line-clamp-3 mb-4">
                          {isArabic ? landmark.description_ar : landmark.description_en}
                        </p>
                      </div>

                      <div className="border-t border-gray-50 dark:border-gray-800/80 pt-4 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold block uppercase tracking-wider">
                            {isArabic ? "تذكرة الدخول" : "ADMISSION TICKET"}
                          </span>
                          <span className="text-sm font-black text-[#EB662B]">
                            {(landmark as any).ticket_price === 0 ? (
                              <span className="text-green-600 dark:text-green-455 font-bold">
                                {isArabic ? "دخول مجاني 🆓" : "Free Entry 🆓"}
                              </span>
                            ) : (
                              <>
                                {(landmark as any).ticket_price} {isArabic ? landmark.country?.currency_name_ar : landmark.country?.currency_name_en}
                              </>
                            )}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider bg-[#D4AF37]/5 px-3 py-1.5 rounded-xl border border-[#D4AF37]/10 group-hover:bg-[#D4AF37] group-hover:text-[#05073C] transition duration-300">
                          {isArabic ? "تفاصيل وحجز 🔍" : "Details & Book 🔍"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Detailed Single Country Layout showing 1 Landmark, 1 Hotel, and 1 Restaurant together */
          <div className="space-y-12">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-[#05073C] dark:text-white mb-2 font-serif">
                {isArabic ? "دليل الدولة المتكامل" : "Integrated Country Directory"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                {isArabic 
                  ? "إليك المعلم السياحي الموصى بزيارته، والفندق المختار للإقامة، والمطعم الشهير لتجربته." 
                  : "Here is the recommended landmark to visit, the chosen hotel to stay at, and the famous restaurant to try."}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              
              {/* Column 1: Landmark */}
              <div className="flex flex-col h-full bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
                <h3 className="text-base font-black text-[#D4AF37] uppercase tracking-wider flex items-center gap-2 mb-4 border-b border-gray-50 dark:border-gray-800/80 pb-3">
                  📍 {isArabic ? "معلم للزيارة" : "Place to Visit"}
                </h3>
                
                <div className="flex-1 flex flex-col justify-between">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-20 flex-1">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]"></div>
                    </div>
                  ) : landmarks.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 flex-1 flex flex-col justify-center">
                      <span className="text-4xl mb-2">🏝️</span>
                      {isArabic ? "لا توجد معالم مسجلة" : "No landmarks registered"}
                    </div>
                  ) : (
                    landmarks.map((landmark) => (
                      <div 
                        key={landmark.id}
                        onClick={() => setSelectedLandmark(landmark)}
                        className="flex-1 flex flex-col justify-between cursor-pointer group"
                      >
                        <div className="relative h-48 rounded-2xl overflow-hidden mb-4 shadow-sm">
                          <img 
                            src={landmark.image} 
                            alt={landmark.name_en} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                          <div className="absolute top-3 left-3 bg-[#05073C]/80 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-xl border border-white/20">
                            {landmark.category}
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                <FaMapMarkerAlt /> {isArabic ? landmark.location_ar : landmark.location_en}
                              </span>
                              <span className="text-[11px] font-black text-amber-500 flex items-center gap-0.5">
                                <FaStar className="fill-current" /> {landmark.rating}
                              </span>
                            </div>
                            <h4 className="text-base font-black text-[#05073C] dark:text-white group-hover:text-[#D4AF37] transition mb-2">
                              {isArabic ? landmark.name_ar : landmark.name_en}
                            </h4>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed line-clamp-4 mb-4">
                              {isArabic ? landmark.description_ar : landmark.description_en}
                            </p>
                          </div>

                          <div className="border-t border-gray-50 dark:border-gray-800/80 pt-4 flex items-center justify-between mt-auto">
                            <div>
                              <span className="text-[8px] text-gray-400 dark:text-gray-500 font-bold block">
                                {isArabic ? "تذكرة الدخول" : "ADMISSION"}
                              </span>
                              <span className="text-xs font-black text-[#EB662B]">
                                {(landmark as any).ticket_price === 0 ? (
                                  <span className="text-green-600 dark:text-green-455 font-bold">
                                    {isArabic ? "مجاني 🆓" : "Free 🆓"}
                                  </span>
                                ) : (
                                  <>
                                    {(landmark as any).ticket_price} {isArabic ? landmark.country?.currency_name_ar : landmark.country?.currency_name_en}
                                  </>
                                )}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider bg-[#D4AF37]/5 px-2.5 py-1.5 rounded-xl border border-[#D4AF37]/10 group-hover:bg-[#D4AF37] group-hover:text-[#05073C] transition">
                              {isArabic ? "تفاصيل وحجز 🎟️" : "Book Ticket 🎟️"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Column 2: Hotel */}
              <div className="flex flex-col h-full bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
                <h3 className="text-base font-black text-[#D4AF37] uppercase tracking-wider flex items-center gap-2 mb-4 border-b border-gray-50 dark:border-gray-800/80 pb-3">
                  🏨 {isArabic ? "فندق للإقامة" : "Hotel to Stay"}
                </h3>
                
                <div className="flex-1 flex flex-col justify-between">
                  {isLoadingHotels ? (
                    <div className="flex justify-center items-center py-20 flex-1">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]"></div>
                    </div>
                  ) : hotels.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 flex-1 flex flex-col justify-center">
                      <span className="text-4xl mb-2">🏨</span>
                      {isArabic ? "لا توجد فنادق مسجلة" : "No hotels registered"}
                    </div>
                  ) : (
                    hotels.map((hotel) => (
                      <div key={hotel.id} className="flex-1 flex flex-col justify-between group">
                        <div className="relative h-48 rounded-2xl overflow-hidden mb-4 shadow-sm">
                          <img 
                            src={hotel.image || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800"} 
                            alt={hotel.title || hotel.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                          <div className="absolute top-3 left-3 bg-[#05073C]/80 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-xl border border-white/20">
                            {isArabic ? "فندق فاخر" : "Luxury"}
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                <FaMapMarkerAlt /> {hotel.location}
                              </span>
                              <span className="text-[11px] font-black text-amber-500 flex items-center gap-0.5">
                                <FaStar className="fill-current" /> {hotel.rating || "4.8"}
                              </span>
                            </div>
                            <h4 className="text-base font-black text-[#05073C] dark:text-white group-hover:text-[#D4AF37] transition mb-2">
                              {hotel.title || hotel.name}
                            </h4>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed line-clamp-4 mb-4">
                              {hotel.description}
                            </p>
                          </div>

                          <div className="border-t border-gray-50 dark:border-gray-800/80 pt-4 flex items-center justify-between mt-auto">
                            <div>
                              <span className="text-[8px] text-gray-400 dark:text-gray-500 font-bold block">
                                {isArabic ? "يبدأ من" : "STARTS FROM"}
                              </span>
                              <span className="text-xs font-black text-[#EB662B]">
                                ${hotel.price_starts_from || hotel.price || "—"}
                                <span className="text-[9px] text-gray-400 font-medium">/{isArabic ? "ليلة" : "night"}</span>
                              </span>
                            </div>
                            
                            <Link
                              to={`/hotels/${hotel.id}`}
                              className="px-3.5 py-2 bg-[#05073C] hover:bg-[#D4AF37] dark:bg-gray-800 dark:hover:bg-[#D4AF37] text-white dark:hover:text-[#05073C] rounded-xl font-black text-[10px] transition shadow-xs"
                            >
                              {isArabic ? "احجز الغرفة 🔑" : "Book Room 🔑"}
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Column 3: Restaurant */}
              <div className="flex flex-col h-full bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
                <h3 className="text-base font-black text-[#D4AF37] uppercase tracking-wider flex items-center gap-2 mb-4 border-b border-gray-50 dark:border-gray-800/80 pb-3">
                  🍽️ {isArabic ? "مطعم للطعام" : "Restaurant to Eat"}
                </h3>
                
                <div className="flex-1 flex flex-col justify-between">
                  {isLoadingRestaurants ? (
                    <div className="flex justify-center items-center py-20 flex-1">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]"></div>
                    </div>
                  ) : restaurants.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 flex-1 flex flex-col justify-center">
                      <span className="text-4xl mb-2">🍽️</span>
                      {isArabic ? "لا توجد مطاعم مسجلة" : "No restaurants registered"}
                    </div>
                  ) : (
                    restaurants.map((restaurant) => (
                      <div key={restaurant.id} className="flex-1 flex flex-col justify-between group">
                        <div className="relative h-48 rounded-2xl overflow-hidden mb-4 shadow-sm">
                          <img 
                            src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800"} 
                            alt={restaurant.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                          <div className="absolute top-3 left-3 bg-orange-600/85 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-xl border border-orange-500/20">
                            {restaurant.cuisine}
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                <FaMapMarkerAlt /> {restaurant.location}
                              </span>
                              <span className="text-[11px] font-black text-amber-500 flex items-center gap-0.5">
                                <FaStar className="fill-current" /> {restaurant.rating || "4.7"}
                              </span>
                            </div>
                            <h4 className="text-base font-black text-[#05073C] dark:text-white group-hover:text-[#D4AF37] transition mb-2">
                              {restaurant.name}
                            </h4>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed line-clamp-3 mb-2">
                              {restaurant.description}
                            </p>
                            
                            <div className="space-y-1 text-[10px] text-gray-400 dark:text-gray-500 font-semibold mb-4">
                              {restaurant.opening_hours && (
                                <div className="flex items-center gap-1">
                                  <FaClock className="text-[#D4AF37]" /> {isArabic ? "ساعات العمل:" : "Hours:"} {restaurant.opening_hours}
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <FaCoins className="text-[#D4AF37]" /> {isArabic ? "متوسط التكلفة:" : "Price Range:"} ${restaurant.price_range_min || "50"} - ${restaurant.price_range_max || "150"}
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-gray-50 dark:border-gray-800/80 pt-4 flex items-center justify-between mt-auto">
                            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                              {isArabic ? "تجربة فاخرة ✨" : "Fine Dining ✨"}
                            </span>
                            
                            <Link
                              to={`/restaurants/${restaurant.id}`}
                              className="px-3.5 py-2 bg-[#05073C] hover:bg-[#D4AF37] dark:bg-gray-800 dark:hover:bg-[#D4AF37] text-white dark:hover:text-[#05073C] rounded-xl font-black text-[10px] transition shadow-xs"
                            >
                              {isArabic ? "حجز طاولة 🍽️" : "Book Table 🍽️"}
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Landmark Detail Modal */}
      {selectedLandmark && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            
            {/* Header / Banner */}
            <div className="relative h-64 shrink-0">
              <img
                src={selectedLandmark.image}
                alt={selectedLandmark.name_en}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              
              <button
                onClick={() => setSelectedLandmark(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/75 transition"
              >
                <FaTimes />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="text-[#D4AF37] text-xs font-black uppercase tracking-widest block mb-1">
                  {selectedLandmark.category} • {selectedLandmark.country?.flag} {isArabic ? selectedLandmark.country?.name_ar : selectedLandmark.country?.name_en}
                </span>
                <h2 className="text-xl md:text-2xl font-black font-serif">
                  {isArabic ? selectedLandmark.name_ar : selectedLandmark.name_en}
                </h2>
              </div>
            </div>

            {/* Scrollable details */}
            <div className="p-6 overflow-y-auto space-y-4">
                          <div className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 font-medium">
                {isArabic ? selectedLandmark.description_ar : selectedLandmark.description_en}
              </div>

              {/* Ticket Price Summary Block */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 flex justify-between items-center my-4">
                <div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-bold block">
                    {isArabic ? "سعر تذكرة الدخول" : "Admission Ticket Price"}
                  </span>
                  <span className="text-lg font-black text-[#EB662B]">
                    {selectedLandmark.ticket_price === 0 ? (
                      <span className="text-green-600 dark:text-green-400 font-bold">
                        {isArabic ? "مجاني بالكامل 🆓" : "100% Free Entry 🆓"}
                      </span>
                    ) : (
                      <>
                        {selectedLandmark.ticket_price} {isArabic ? selectedLandmark.country?.currency_name_ar : selectedLandmark.country?.currency_name_en}
                      </>
                    )}
                  </span>
                </div>
                <div className="text-[10px] text-gray-400 dark:text-gray-500 font-bold">
                  {selectedLandmark.ticket_price === 0 
                    ? (isArabic ? "* لا يتطلب أي رسوم" : "* No fees required")
                    : (isArabic ? "* شاملة الرسوم والضرائب" : "* Admission & taxes included")}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleBookLandmark(selectedLandmark)}
                  className="flex-1 bg-[#EB662B] hover:bg-[#d55822] text-white py-3 rounded-2xl font-black text-xs transition flex items-center justify-center gap-2 shadow-md shadow-orange-500/20"
                >
                  🎟️ {selectedLandmark.ticket_price === 0 
                        ? (isArabic ? "حجز تصريح دخول مجاني" : "Get Free Visitor Pass")
                        : (isArabic ? "احجز تذكرة دخول" : "Book Admission Ticket")}
                </button>
                {selectedLandmark.latitude && selectedLandmark.longitude && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedLandmark.latitude},${selectedLandmark.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-[#05073C] hover:bg-[#D4AF37] dark:bg-gray-850 dark:hover:bg-[#D4AF37] text-white dark:hover:text-[#05073C] py-3 rounded-2xl font-black text-xs transition flex items-center justify-center gap-2 border border-transparent shadow-md"
                  >
                    <FaMapMarkedAlt /> {isArabic ? "افتح في خرائط جوجل" : "Open in Google Maps"}
                  </a>
                )}
                <button
                  onClick={() => setSelectedLandmark(null)}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 text-[#05073C] dark:text-white border border-gray-200 dark:border-gray-700 py-3 rounded-2xl font-black text-xs transition"
                >
                  {isArabic ? "إغلاق" : "Close"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ArabWorldTourismPage;
