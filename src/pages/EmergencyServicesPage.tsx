import { useState, useEffect } from "react";
import { getEmergencyServices, type EmergencyService } from "../api/emergencyService";
import { 
  FaPhoneAlt, 
  FaHospital, 
  FaPills, 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaShieldAlt, 
  FaUserShield,
  FaSearch,
  FaCalendarAlt,
  FaMapMarkedAlt
} from "react-icons/fa";
import SectionWrapper from "../components/sections/SectionWrapper";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import Button from "../components/Ui/Button";

const EmergencyServicesPage = () => {
  useDocumentTitle("Emergency & Tourist Services | Kemet");
  
  const [services, setServices] = useState<EmergencyService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const cities = ["All", "Cairo", "Giza", "Alexandria", "Luxor", "Aswan", "Sharm El-Sheikh", "Hurghada", "Marsa Alam", "Port Said", "Fayoum"];
  const types = [
    { value: "All", label: "All Services" },
    { value: "hospital", label: "Hospitals", icon: <FaHospital /> },
    { value: "pharmacy", label: "Pharmacies", icon: <FaPills /> },
    { value: "embassy", label: "Embassies", icon: <FaBuilding /> },
  ];

  const nationwideHotlines = [
    { name: "Tourist Police", number: "126", description: "Security & harassment reporting", icon: <FaUserShield className="text-amber-500 text-3xl" /> },
    { name: "Ambulance", number: "123", description: "Medical emergency transport", icon: <FaHospital className="text-red-500 text-3xl" /> },
    { name: "Fire Brigade", number: "180", description: "Fire & civil emergency rescue", icon: <FaShieldAlt className="text-orange-500 text-3xl" /> },
    { name: "Traffic Police", number: "128", description: "Road & traffic assistance", icon: <FaPhoneAlt className="text-blue-500 text-3xl" /> }
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const data = await getEmergencyServices(selectedCity, selectedType);
        setServices(data);
      } catch (error) {
        console.error("Error fetching emergency services:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, [selectedCity, selectedType]);

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (service.address && service.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=1920"
            alt="Emergency Services Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <span className="text-[#D4AF37] font-black uppercase tracking-widest text-xs sm:text-sm bg-black/30 px-3 py-1.5 rounded-full mb-4 inline-block">
            Safety First in Egypt
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-lg font-serif">
            Emergency & Tourist Services
          </h1>
          <p className="text-sm md:text-base text-gray-200/90 max-w-2xl mx-auto leading-relaxed">
            Your safety and convenience are our priority. Find nationwide hotlines, certified hospitals, 24/7 pharmacies, and foreign embassies across major cities in Egypt.
          </p>
        </div>
      </section>

      {/* Nationwide Emergency Speed Dial Panel */}
      <SectionWrapper className="relative z-20 -mt-12 max-w-6xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl p-6 md:p-8">
          <h2 className="text-lg font-black text-[#05073C] dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
            Nationwide Emergency Speed Dial
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {nationwideHotlines.map((hotline, idx) => (
              <a 
                href={`tel:${hotline.number}`} 
                key={idx}
                className="flex items-center gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-gray-850 hover:bg-[#D4AF37]/10 dark:hover:bg-[#D4AF37]/5 border border-transparent hover:border-[#D4AF37]/30 shadow-sm transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                  {hotline.icon}
                </div>
                <div>
                  <h4 className="font-extrabold text-[#05073C] dark:text-white group-hover:text-[#EB662B] transition-colors">{hotline.name}</h4>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-1">{hotline.description}</p>
                  <span className="text-lg font-black text-[#EB662B] tracking-wider font-mono">{hotline.number}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Core Directory Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        
        {/* Filtering & Search Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          {/* City & Search */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto grow max-w-3xl">
            {/* Search Input */}
            <div className="relative grow">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                placeholder="Search hospital, pharmacy, embassy..."
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#D4AF37] focus:ring-0 focus:outline-none dark:text-white transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* City Dropdown */}
            <div className="min-w-[180px]">
              <select 
                className="w-full px-4 py-3 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#D4AF37] focus:outline-none dark:text-white cursor-pointer font-bold"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="All">All Cities</option>
                {cities.slice(1).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Service Category Tabs */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-start lg:justify-end">
            {types.map(t => (
              <button
                key={t.value}
                onClick={() => setSelectedType(t.value)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 border transition ${
                  selectedType === t.value 
                    ? "bg-[#05073C] text-white border-[#05073C] dark:bg-[#D4AF37] dark:text-[#05073C] dark:border-[#D4AF37]" 
                    : "bg-white text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 hover:border-[#D4AF37]"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EB662B]"></div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 p-8 shadow-sm">
            <FaHospital className="text-gray-300 dark:text-gray-700 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#05073C] dark:text-white mb-2">No matching services found</h3>
            <p className="text-gray-400">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map(service => (
              <div 
                key={service.id}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300 flex flex-col justify-between h-full group"
              >
                <div>
                  {/* Category Badge & City */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                      service.type === 'hospital' 
                        ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30' 
                        : service.type === 'pharmacy'
                        ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30'
                        : 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30'
                    }`}>
                      {service.type}
                    </span>
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1">
                      <FaMapMarkerAlt /> {service.city}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-black text-[#05073C] dark:text-white group-hover:text-[#EB662B] transition-colors mb-3">
                    {service.name}
                  </h3>

                  {/* Details / Address / Phone */}
                  <div className="space-y-3.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {service.address && (
                      <div className="flex items-start gap-2.5">
                        <FaMapMarkerAlt className="text-gray-400 mt-0.5 shrink-0" />
                        <span>{service.address}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2.5">
                      <FaPhoneAlt className="text-gray-400 mt-0.5 shrink-0" />
                      <span className="font-mono font-bold">{service.phone}</span>
                    </div>
                    {service.details && (
                      <div className="bg-gray-50 dark:bg-gray-850 p-3 rounded-xl border border-gray-100 dark:border-gray-800 text-[11px] leading-relaxed text-gray-600 dark:text-gray-400">
                        {service.details}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="border-t border-gray-50 dark:border-gray-800/80 mt-5 pt-4 flex gap-3">
                  <a 
                    href={`tel:${service.phone}`}
                    className="flex-1 bg-[#05073C] hover:bg-[#D4AF37] dark:bg-gray-800 dark:hover:bg-[#D4AF37] text-white dark:hover:text-[#05073C] py-2.5 rounded-xl text-center text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <FaPhoneAlt size={10} /> Call Now
                  </a>
                  {service.latitude && service.longitude && (
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${service.latitude},${service.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 text-[#05073C] dark:text-white border border-gray-100 dark:border-gray-700 py-2.5 rounded-xl text-center text-xs font-bold transition flex items-center justify-center"
                      title="Google Maps Navigation"
                    >
                      <FaMapMarkedAlt size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default EmergencyServicesPage;
