import SectionWrapper from "@/components/sections/SectionWrapper";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaClock, FaLandmark, FaTicketAlt } from "react-icons/fa";

const MuseumsPage = () => {
  const MUSEUMS_DB = [
    {
      id: 1,
      title: "Grand Egyptian Museum",
      image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/lm_gem",
      details: ["Giza", "Daily: 9AM - 6PM", "Guided Available"],
      price: "150 EGP",
      icon: <FaLandmark className="text-[#E76F51]" />
    },
    {
      id: 2,
      title: "National Museum of Egyptian Civilization",
      image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/lm_nmec",
      details: ["Cairo", "Daily: 9AM - 5PM", "Mummies Hall"],
      price: "80 EGP",
      icon: <FaLandmark className="text-[#E76F51]" />
    },
    {
      id: 3,
      title: "Karnak Temple Complex",
      image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/lm_karnak",
      details: ["Luxor", "Daily: 6AM - 5PM", "Ancient Columns"],
      price: "40 EGP",
      icon: <FaMapMarkerAlt className="text-[#E76F51]" />
    },
    {
      id: 4,
      title: "Luxor Museum",
      image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/lm_luxor_museum",
      details: ["Luxor", "Daily: 9AM - 9PM", "Priceless Artifacts"],
      price: "40 EGP",
      icon: <FaLandmark className="text-[#E76F51]" />
    },
    {
      id: 5,
      title: "Abu Simbel Temple",
      image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/lm_abu_simbel",
      details: ["Aswan", "Daily: 5AM - 5PM", "Ramses II statues"],
      price: "60 EGP",
      icon: <FaMapMarkerAlt className="text-[#E76F51]" />
    },
    {
      id: 6,
      title: "Philae Temple",
      image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/lm_philae",
      details: ["Aswan", "Daily: 7AM - 4PM", "Island Sanctuary"],
      price: "40 EGP",
      icon: <FaMapMarkerAlt className="text-[#E76F51]" />
    },
    {
      id: 7,
      title: "Graeco-Roman Museum",
      image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/lm_graeco_roman",
      details: ["Alexandria", "Daily: 9AM - 5PM", "Restored Halls"],
      price: "40 EGP",
      icon: <FaLandmark className="text-[#E76F51]" />
    },
    {
      id: 8,
      title: "Citadel of Qaitbay",
      image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/lm_qaitbay",
      details: ["Alexandria", "Daily: 8AM - 5PM", "Medieval Fortress"],
      price: "60 EGP",
      icon: <FaMapMarkerAlt className="text-[#E76F51]" />
    },
    {
      id: 9,
      title: "Hurghada National Museum",
      image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/lm_hurghada_museum",
      details: ["Red Sea", "Daily: 10AM - 1PM & 5PM", "Coastal Heritage"],
      price: "80 EGP",
      icon: <FaLandmark className="text-[#E76F51]" />
    },
    {
      id: 10,
      title: "Sharm El-Sheikh Museum",
      image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/lm_sharm",
      details: ["South Sinai", "Daily: 10AM - 1PM & 5PM", "Modern Displays"],
      price: "40 EGP",
      icon: <FaLandmark className="text-[#E76F51]" />
    },
  ];

  return (
    <div className="bg-[#fdfaf7] min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] w-full">
        <div className="absolute inset-0">
          <img 
            src="https://dinaabdelbaset-kemet.hf.space/api/kamet-images/lm_hero" 
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
            {MUSEUMS_DB.map((museum) => (
              <div 
                key={museum.id} 
                className="group bg-[#fcfbf9] rounded-3xl border border-gray-100 shadow-sm hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col"
              >
                {/* Card Image */}
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <img 
                    src={museum.image} 
                    alt={museum.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/20">
                    <span className="font-bold text-[#cf4a36] text-sm flex items-center gap-2">
                       <FaTicketAlt className="text-[#D4AF37]" /> {museum.price}
                    </span>
                  </div>

                  {/* Gradient Overlay for icons */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent pt-12 pb-4 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex justify-between items-center">
                    <span className="text-white font-medium text-sm flex items-center gap-2">
                       {museum.icon} {museum.details[0]}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-[#14213d] mb-4 group-hover:text-[#E76F51] transition-colors line-clamp-2">
                    {museum.title}
                  </h3>
                  
                  <div className="flex flex-col gap-3 mb-6 flex-grow justify-end">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-8 h-8 rounded-full bg-[#E76F51]/10 flex items-center justify-center">
                        {museum.icon}
                      </div>
                      <span className="font-medium text-[#14213d]">{museum.details[0]}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-8 h-8 rounded-full bg-[#E76F51]/10 flex items-center justify-center">
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
