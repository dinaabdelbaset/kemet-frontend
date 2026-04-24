import PriceDisplay from "../components/common/PriceDisplay";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaStar, FaChevronRight } from "react-icons/fa";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

interface Adventure {
  id: number;
  title: string;
  items: string[];
  image: string;
  icon: string;
  locations: string;
  rating: number;
  price: string;
  color: string;
}

const ADVENTURES: Adventure[] = [
  {
    id: 1,
    title: "Desert Adventures",
    icon: "🏜️",
    items: [
      "4x4 Dune Bashing on the Sand Dunes",
      "Camping Under the Stars",
      "Sandboarding on Golden Dunes",
      "Visit Siwa Oasis & Natural Springs",
      "Experience Complete Desert Silence",
      "Salt Lakes & Hot Springs",
      "Desert Cycling Adventures",
      "Bedouin Dinner & Culture",
    ],
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&fit=crop",
    locations: "Siwa • Western Desert • Sharm El Sheikh",
    rating: 4.8,
    price: <span className="flex items-center gap-1">From <PriceDisplay price={75} baseCurrency="USD" /></span>,
    color: "#E67E22",
  },
  {
    id: 2,
    title: "Sea Adventures",
    icon: "🌊",
    items: [
      "Scuba Diving & Snorkeling in the Red Sea",
      "Explore Coral Reefs & Rare Fish",
      "Kitesurfing in El Gouna & Ras Sedr",
      "Island Boat Trips (Giftun Island)",
      "Glass Bottom Boat Rides",
      "Parasailing over Turquoise Waters",
      "Deep Sea Fishing Trips",
      "Dolphin Watching Excursions",
    ],
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&fit=crop",
    locations: "Sharm El Sheikh • Dahab • Hurghada",
    rating: 4.9,
    price: <span className="flex items-center gap-1">From <PriceDisplay price={45} baseCurrency="USD" /></span>,
    color: "#3498DB",
  },
  {
    id: 3,
    title: "Mountain Adventures",
    icon: "🧗",
    items: [
      "Climb St. Catherine (Highest Peak in Egypt)",
      "Pre-Dawn Hike & Sunrise Watching",
      "Hiking in Dahab (Blue Hole & Canyon)",
      "Rock Climbing in Sinai Mountains",
      "Colored Canyon Exploration",
      "Mountain Biking Trails",
      "Monastery & Sacred Sites Visit",
      "Mountain Photography Tours",
    ],
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&fit=crop",
    locations: "St. Catherine • Dahab • Sinai",
    rating: 4.7,
    price: <span className="flex items-center gap-1">From <PriceDisplay price={60} baseCurrency="USD" /></span>,
    color: "#2ECC71",
  },
  {
    id: 4,
    title: "Historical Adventures",
    icon: "🏛️",
    items: [
      "Hot Air Balloon Ride in Luxor",
      "Temple Views from Above",
      "Valley of the Kings Exploration",
      "Abu Simbel Temple Visit",
      "Night Tours at the Pyramids",
      "Islamic Cairo Walking Tour",
      "Sound & Light Shows",
      "Pharaonic Dinner Cruises",
    ],
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&fit=crop",
    locations: "Luxor • Aswan • Cairo • Abu Simbel",
    rating: 4.9,
    price: <span className="flex items-center gap-1">From <PriceDisplay price={90} baseCurrency="USD" /></span>,
    color: "#D4AF37",
  },
  {
    id: 5,
    title: "Unique Experiences",
    icon: "🚴",
    items: [
      "Camel or Horse Ride at the Pyramids",
      "Cycling Tours in Zamalek & Downtown",
      "Khan El Khalili Bazaar Experience",
      "Egyptian Street Food Adventure 🍴",
      "Felucca Sailing on the Nile",
      "Traditional Pottery Workshop",
      "Nubian Village Cultural Visit",
      "Cooking Class: Egyptian Cuisine",
    ],
    image: "https://images.unsplash.com/photo-1568322503145-e986d345e1a0?w=800&fit=crop",
    locations: "Cairo • Aswan • Luxor",
    rating: 4.6,
    price: <span className="flex items-center gap-1">From <PriceDisplay price={25} baseCurrency="USD" /></span>,
    color: "#E74C3C",
  },
  {
    id: 6,
    title: "Calm & Wellness",
    icon: "🧘",
    items: [
      "Yoga & Meditation in Dahab",
      "Siwa Oasis Wellness Retreat",
      "Nile Cruise (Aswan → Luxor)",
      "Photography Tours in Historic Sites",
      "Spa & Hammam Experience",
      "Stargazing in the Desert",
      "Sunrise Yoga by the Red Sea",
      "Floating in Siwa Salt Lakes",
    ],
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&fit=crop",
    locations: "Dahab • Siwa • Aswan • Hurghada",
    rating: 4.8,
    price: <span className="flex items-center gap-1">From <PriceDisplay price={40} baseCurrency="USD" /></span>,
    color: "#9B59B6",
  },
];

const AdventureCard = ({ adventure }: { adventure: Adventure }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/checkout", {
      state: {
        title: adventure.title,
        price: parseInt(adventure.price.replace(/[^0-9]/g, "")),
        image: adventure.image,
      }
    });
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={adventure.image}
          alt={adventure.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{adventure.icon}</span>
            <h3 className="text-white font-extrabold text-2xl">{adventure.title}</h3>
          </div>
          <div className="flex items-center gap-1.5 text-white/80 text-sm">
            <FaMapMarkerAlt className="text-[#D4AF37] text-xs" />
            <span>{adventure.locations}</span>
          </div>
        </div>

        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/95 backdrop-blur-sm text-gray-900 font-bold text-sm px-4 py-2 rounded-full shadow-lg">
            {adventure.price}
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 left-4">
          <div className="bg-black/50 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <FaStar className="text-yellow-400 text-xs" />
            <span className="font-bold">{adventure.rating}</span>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="p-6">
        <ul className="space-y-2.5">
          {adventure.items.slice(0, isExpanded ? adventure.items.length : 4).map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-sm">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                style={{ backgroundColor: adventure.color }}
              >
                {idx + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {adventure.items.length > 4 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 text-sm font-semibold flex items-center gap-1 transition-colors"
            style={{ color: adventure.color }}
          >
            {isExpanded ? "Show Less" : `+${adventure.items.length - 4} More Activities`}
            <FaChevronRight className={`text-xs transition-transform ${isExpanded ? "rotate-90" : ""}`} />
          </button>
        )}

        {/* CTA */}
        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={handleBookNow}
            className="flex-1 block text-center py-3 rounded-xl font-bold text-white text-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
            style={{ backgroundColor: adventure.color }}
          >
            Book Now — {adventure.price}
          </button>
          <div className="flex items-center gap-1 text-sm">
            <FaStar className="text-yellow-400" />
            <span className="font-bold text-gray-800 dark:text-gray-200">{adventure.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivitiesPage = () => {
  useDocumentTitle("Activities & Adventures");

  return (
    <div className="bg-[#fcfbf9] dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1600&fit=crop"
            alt="Egypt Adventures"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider">Adventures in Egypt</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Discover <span className="text-[#D4AF37]">Extraordinary</span> Adventures
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            From desert safaris to Red Sea diving, mountain climbing to Nile cruises — Egypt has it all. Find your next adventure!
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {["🏜️ Desert", "🌊 Sea", "🧗 Mountains", "🏛️ History", "🚴 Unique", "🧘 Wellness"].map((tag, i) => (
              <a
                key={i}
                href={`#adventure-${i + 1}`}
                className="px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-semibold hover:bg-[#D4AF37] hover:text-white transition-all duration-300 border border-white/20 hover:border-[#D4AF37]"
              >
                {tag}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "50+", label: "Activities" },
            { value: "20+", label: "Destinations" },
            { value: "4.8★", label: "Avg Rating" },
            { value: "10K+", label: "Happy Travelers" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-2xl font-extrabold text-[#D4AF37]">{stat.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Adventures Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
            Choose Your <span className="text-[#D4AF37]">Adventure</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
            6 categories of unforgettable Egyptian adventures. Pick your style and start exploring!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ADVENTURES.map((adventure) => (
            <div key={adventure.id} id={`adventure-${adventure.id}`}>
              <AdventureCard adventure={adventure} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-[#05073C] to-[#1a1d5e] py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Can't Decide? Let Us Help! 🎯
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Tell us your interests and budget, and we'll create a custom adventure package just for you.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/tours"
              className="px-8 py-3.5 bg-[#D4AF37] text-white font-bold rounded-full hover:bg-[#c9a030] transition-all shadow-lg hover:shadow-xl"
            >
              Browse All Tours
            </Link>
            <Link
              to="/support"
              className="px-8 py-3.5 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/20"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ActivitiesPage;
