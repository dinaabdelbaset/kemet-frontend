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
  price: number;
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
    image: "/images/tour-desert-safari.png",
    locations: "Siwa • Western Desert • Sharm El Sheikh",
    rating: 4.8,
    price: 3638,
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
    image: "/images/tour-red-sea.png",
    locations: "Sharm El Sheikh • Dahab • Hurghada",
    rating: 4.9,
    price: 2183,
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
    image: "/images/saint-catherine.png",
    locations: "St. Catherine • Dahab • Sinai",
    rating: 4.7,
    price: 2910,
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
    image: "/images/tour-pyramids.png",
    locations: "Luxor • Aswan • Cairo • Abu Simbel",
    rating: 4.9,
    price: 4365,
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
    image: "/images/tour-cairo-food.png",
    locations: "Cairo • Aswan • Luxor",
    rating: 4.6,
    price: 1213,
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
    image: "/images/tour-nile-cruise.png",
    locations: "Dahab • Siwa • Aswan • Hurghada",
    rating: 4.8,
    price: 1940,
    color: "#9B59B6",
  },
];

const AdventureCard = ({ adventure }: { adventure: Adventure }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/checkout", {
      state: {
        title: adventure.title,
        price: adventure.price,
        image: adventure.image,
      }
    });
  };

  return (
    <div className="block relative bg-white border border-[#E7E6E6] dark:border-gray-700 rounded-3xl overflow-hidden transition-all duration-[600ms] hover:border-[#D4AF37] hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] group h-[460px] w-full">
      {/* Background Cover Image (Slides up on hover) */}
      <div className="absolute inset-x-0 top-0 w-full h-full transition-all duration-[800ms] ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:h-[35%] z-10 overflow-hidden rounded-t-3xl group-hover:rounded-b-none rounded-b-3xl">
        <img
          src={adventure.image}
          alt={adventure.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-700 group-hover:opacity-0" />
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-gray-100 z-20">
          <span className="font-bold text-[#cf4a36] text-xs flex items-center gap-1.5">
             From <PriceDisplay price={adventure.price} baseCurrency="EGP" />
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white/10 z-20 flex items-center gap-1.5">
           <FaStar className="text-yellow-400 text-xs" />
           <span className="font-bold text-white text-xs">{adventure.rating}</span>
        </div>

        {/* Pre-Hover Title Overlay */}
        <div className="absolute bottom-6 left-5 right-5 z-20 transition-all duration-700 transform group-hover:translate-y-10 group-hover:opacity-0 flex flex-col text-left">
          <div className="flex items-center gap-1.5 mb-3 bg-black/40 w-max px-3 py-1.5 rounded-full backdrop-blur-sm">
            <FaMapMarkerAlt className="text-[#D4AF37] text-[10px]" />
            <span className="text-white/90 text-xs font-semibold tracking-wide truncate max-w-[200px]">{adventure.locations}</span>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-4xl drop-shadow-lg">{adventure.icon}</span>
             <h3 className="text-white font-extrabold text-3xl leading-tight text-shadow-md">{adventure.title}</h3>
          </div>
        </div>
      </div>

      {/* Content (Revealed on hover) */}
      <div className="absolute inset-x-0 bottom-0 h-[65%] bg-white dark:bg-gray-800 px-6 pt-5 pb-5 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100 z-0 flex flex-col justify-between text-left">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{adventure.icon}</span>
            <h3 className="text-xl font-bold text-[#14213d] dark:text-white leading-snug hover:text-[#D4AF37] transition-colors line-clamp-1">
              {adventure.title}
            </h3>
          </div>
          
          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 font-medium bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-xl border border-gray-100 dark:border-gray-600 w-max mb-4">
             <FaMapMarkerAlt className="text-[#E76F51] text-sm mr-2 shrink-0" />
             <span className="truncate max-w-[200px]">{adventure.locations}</span>
          </div>

          <ul className="space-y-2.5 mb-3">
            {adventure.items.slice(0, 4).map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-[13px] font-medium">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5 shadow-sm"
                  style={{ backgroundColor: adventure.color }}
                >
                  {idx + 1}
                </span>
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
          </ul>
          {adventure.items.length > 4 && (
             <div className="text-xs font-bold mt-1" style={{ color: adventure.color }}>
                +{adventure.items.length - 4} More Activities Included
             </div>
          )}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-4">
           <button
             onClick={handleBookNow}
             className="w-full text-center py-3.5 rounded-xl font-bold text-white text-[15px] transition-all duration-300 hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
             style={{ backgroundColor: adventure.color }}
           >
             Book Now — <PriceDisplay price={adventure.price} />
           </button>
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
