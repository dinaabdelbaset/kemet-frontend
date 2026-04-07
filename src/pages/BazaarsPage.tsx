import SectionWrapper from "@/components/sections/SectionWrapper";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaShoppingBag } from "react-icons/fa";

export const BAZAARS_DB = [
    {
      id: 1,
      title: "Khan el-Khalili",
      location: "Cairo",
      image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/baz_cairo",
      description: "A famous historic bazaar and souq in the center of Cairo. Master artisans craft beautiful jewelry, copper, and lanterns right before your eyes.",
      specialty: ["Spices", "Handicrafts", "Jewelry", "Antiques"],
      open: "10:00 AM - 12:00 AM",
      ticketPrices: { egAdult: "150 EGP", foreigner: "600 EGP" }
    },
    {
      id: 2,
      title: "Aswan Spice Market",
      location: "Aswan",
      image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/baz_aswan",
      description: "A sensory explosion of colors and aromas. Best place to buy authentic Nubian spices, hibiscus tea, and natural perfumes.",
      specialty: ["Spices", "Herbs", "Perfumes", "Tea"],
      open: "9:00 AM - 11:00 PM",
      ticketPrices: { egAdult: "100 EGP", foreigner: "450 EGP" }
    },
    {
      id: 3,
      title: "Luxor Tourist Souq",
      location: "Luxor",
      image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/baz_luxor",
      description: "Wander through lanes dedicated to alabaster statues, papyrus art, and traditional clothing near the glorious Luxor Temple.",
      specialty: ["Alabaster", "Papyrus", "Cotton", "Statues"],
      open: "8:30 AM - 10:00 PM",
      ticketPrices: { egAdult: "120 EGP", foreigner: "500 EGP" }
    },
    {
      id: 4,
      title: "Sharm Old Market",
      location: "Sharm El-Sheikh",
      image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/baz_sharm",
      description: "Also known as Sharm El Maya. Famous for its beautiful Sahaba Mosque, traditional herbs, essential oils, and local cafes.",
      specialty: ["Oils", "Herbs", "Souvenirs", "Leather"],
      open: "12:00 PM - 2:00 AM",
      ticketPrices: { egAdult: "100 EGP", foreigner: "600 EGP" }
    },
    {
      id: 5,
      title: "Mansheya Market",
      location: "Alexandria",
      image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/baz_alexandria",
      description: "A bustling coastal European-style square mixed with Egyptian charm. Discover local textiles, gold, and the famous Zan'et El Setat alley.",
      specialty: ["Textiles", "Gold", "Antiques", "Silver"],
      open: "9:00 AM - 9:00 PM",
      ticketPrices: { egAdult: "100 EGP", foreigner: "400 EGP" }
    },
    {
      id: 6,
      title: "Shali Traditional Market",
      location: "Siwa Oasis",
      image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/baz_siwa",
      description: "Shop for unique Siwan crafts, including deeply embroidered dresses, silver jewelry, and the world's best organic dates and olive oil.",
      specialty: ["Dates", "Olive Oil", "Silver", "Embroidery"],
      open: "8:00 AM - 8:00 PM",
      ticketPrices: { egAdult: "150 EGP", foreigner: "700 EGP" }
    },
    {
      id: 7,
      title: "El Dahar Souq",
      location: "Hurghada",
      image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/baz_hurghada",
      description: "Experience the authentic, non-touristy heart of Hurghada. A vibrant maze of fresh local produce, fish markets, and authentic shops.",
      specialty: ["Fresh Produce", "Seafood", "Local Goods", "Spices"],
      open: "7:00 AM - 10:00 PM",
      ticketPrices: { egAdult: "80 EGP", foreigner: "500 EGP" }
    },
    {
      id: 8,
      title: "Assalah Square & Walkway",
      location: "Dahab",
      image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/baz_dahab",
      description: "A laid-back Bedouin market along the beach. Find handmade crafts, local Sinai herbs, and beautiful bohemian clothing.",
      specialty: ["Bedouin Crafts", "Herbs", "Bohemian Clothes", "Art"],
      open: "10:00 AM - 1:00 AM",
      ticketPrices: { egAdult: "100 EGP", foreigner: "400 EGP" }
    }
  ];

const BazaarsPage = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[450px] w-full flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="https://dinaabdelbaset-kemet.hf.space/api/kamet-images/baz_cairo" 
            alt="Bazaars Market" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#cd4f3c]/90 to-black/60"></div>
        
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 uppercase tracking-wider">
            Local Bazaars
          </h1>
          <p className="text-lg text-white/90 mb-8 font-light">
            Immerse yourself in the colors, scents, and sounds of historical markets. Find unique souvenirs, taste local delicacies, and experience true culture.
          </p>
        </div>
      </section>

      {/* Featured Bazaars */}
      <SectionWrapper className="py-20 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#222] mb-4">Explore Iconic Markets</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              From the spice alleys of Cairo to the carpet shops of Istanbul, our curated list of classic bazaars offers an unforgettable shopping journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {BAZAARS_DB.map((bazaar) => (
              <div key={bazaar.id} className="bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-[0_15px_30px_rgba(212,175,55,0.25)] transition-all duration-500 hover:-translate-y-2 flex flex-col sm:flex-row group border-2 border-transparent hover:border-[#D4AF37]">
                <div className="w-full sm:w-2/5 h-64 sm:h-auto overflow-hidden relative">
                  <img 
                    src={bazaar.image} 
                    alt={bazaar.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
                </div>
                
                <div className="w-full sm:w-3/5 p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-sm text-[#cd4f3c] font-bold mb-2">
                    <FaMapMarkerAlt /> {bazaar.location}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-[#222] mb-3 group-hover:text-[#cd4f3c] transition">
                    {bazaar.title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed flex-grow">
                    {bazaar.description}
                  </p>
                  
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-[#222] font-semibold text-sm mb-2">
                      <FaShoppingBag className="text-[#cd4f3c]" /> Best For:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {bazaar.specialty.map((item, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-medium">Open: <br /><span className="text-gray-600">{bazaar.open}</span></span>
                    <Link to={`/bazaars/${bazaar.id}`} className="text-[#cd4f3c] text-sm font-bold hover:underline">
                      Discover Details &rarr;
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

export default BazaarsPage;
