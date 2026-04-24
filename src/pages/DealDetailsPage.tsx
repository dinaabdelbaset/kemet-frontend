import PriceDisplay from "../components/common/PriceDisplay";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaStar, FaMapMarkerAlt, FaCheck, FaClock, FaUsers, FaShieldAlt, FaCalendarAlt } from "react-icons/fa";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useState } from "react";

interface DealData {
  id: number;
  category: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  locations: string;
  image: string;
  gallery: string[];
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  duration: string;
  color: string;
  items: string[];
  includes: string[];
  highlights: string[];
}

const ALL_DEALS: Record<string, DealData> = {
  "1": {
    id: 1, category: "Dinner Cruise", icon: "🛳️",
    title: "Nile Cruise Dinner & Show — عشاء نايت كروز بالنيال",
    subtitle: "5-Star Open Buffet, Belly Dance & Tanoura Show",
    description: "Enjoy a magical evening sailing along the majestic Nile River in Cairo. This luxurious 2-hour cruise includes a premium 5-star open buffet dinner, live entertainment featuring authentic belly dancing, a dazzling traditional Tanoura show, and live music. Step up to the open-air deck to feel the breeze and witness the beautiful illuminated skyline of Cairo at night. Perfect for couples, families, and special celebrations.",
    locations: "Corniche El Nil, Cairo",
    image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/deal_nile_deck",
    gallery: [
      "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/deal_nile_deck",
      "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/deal_nile_buffet",
      "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/deal_nile_show",
    ],
    price: 35, originalPrice: 65, rating: 4.8, reviewCount: 2040, duration: "2-3 hours", color: "#E74C3C",
    items: ["5-Star Open Buffet Dinner — بوفيه مفتوح فاخر", "Traditional Tanoura Show — عرض التنورة", "Live Belly Dance Performance — رقص شرقي", "Open Air Deck Sightseeing — جولة بالسطح العلوي"],
    includes: ["Open Buffet Dinner", "All Live Shows", "Free Soft Drink", "Nile Sailing"],
    highlights: ["Couples & Families", "Live Entertainment", "Cairo City Views", "Air-Conditioned"],
  },
  "2": {
    id: 2, category: "Safari", icon: "🐪",
    title: "Sahara Desert Safari — سفاري الصحراء الكبرى",
    subtitle: "4x4 Dune Bashing, Salt Lakes & Bedouin Camp",
    description: "Embark on an unforgettable 2-day safari adventure into the heart of the Egyptian Sahara. Drive rugged 4x4 vehicles over massive golden sand dunes, float peacefully in the crystal clear turquoise salt lakes of Siwa, and spend the evening enjoying authentic Bedouin BBQ around a campfire under a stunning canopy of stars. A life-changing experience in one of the most breathtaking deserts in the world.",
    locations: "Siwa Oasis, Western Desert",
    image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/deal_safari_bashing",
    gallery: [
      "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/deal_safari_bashing",
      "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/deal_safari_camp",
      "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/deal_safari_lake",
    ],
    price: 149, originalPrice: 220, rating: 4.8, reviewCount: 876, duration: "2 Days / 1 Night", color: "#C05621",
    items: ["4x4 Dune Bashing — سفاري سيارات الدفع الرباعي", "Siwa Salt Lakes Floating — السباحة في بحيرات الملح", "Bedouin Campfire Dinner — عشاء بدوي على الحطب", "Desert Stargazing — تأمل النجوم والمجرة"],
    includes: ["4x4 Vehicle & Guide", "Tents & Sleeping Bags", "All Meals & BBQ", "Desert Permissions"],
    highlights: ["Thrill & Adventure", "Astrophotography", "No Light Pollution", "Traditional Life"],
  },
  "3": {
    id: 3, category: "Diving", icon: "🤿",
    title: "Red Sea Diving Package — باقة غوص البحر الأحمر",
    subtitle: "Scuba Diving & Snorkeling at Ras Mohamed & Tiran Island",
    description: "Dive into the crystal-clear waters of the Red Sea at Sharm El Sheikh — one of the top 5 diving destinations in the world. Explore the famous Ras Mohamed National Park, Tiran Island coral reefs, and the SS Thistlegorm shipwreck. Whether you're a beginner or experienced diver, our PADI-certified instructors will guide you through an underwater paradise of colorful coral, tropical fish, dolphins, and sea turtles.",
    locations: "Sharm El Sheikh, Red Sea",
    image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/deal_dive_scuba",
    gallery: [
      "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/deal_dive_scuba",
      "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/deal_dive_coral",
      "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/deal_dive_boat",
    ],
    price: 189, originalPrice: 250, rating: 4.9, reviewCount: 1890, duration: "3 Days / 2 Nights", color: "#1ABC9C",
    items: ["Ras Mohamed Reef Diving — غوص رأس محمد", "Tiran Island Snorkeling — سنوركل جزيرة تيران", "SS Thistlegorm Wreck Dive — غوص حطام السفينة", "PADI Certification Course — دورة تعليم غوص"],
    includes: ["Full Diving Equipment", "PADI Instructor", "Boat Trip & Lunch", "Underwater Photos"],
    highlights: ["PADI Certified", "Beginner Friendly", "Coral Reefs", "Dolphins & Turtles"],
  },
  "4": {
    id: 4, category: "Pyramids & History", icon: "🏛️",
    title: "Pyramids VIP Tour — الجولة الملكية للأهرامات",
    subtitle: "Private Guide, Great Pyramid Interior & Sphinx Sunset",
    description: "Experience the Pyramids of Giza like royalty. This exclusive VIP tour offers private skip-the-line access to the Giza Plateau, the rare opportunity to enter the Great Pyramid of Khufu, and a VIP guided tour of the Grand Egyptian Museum. Conclude your day with a mesmerizing sunset photoshoot by the Great Sphinx, avoiding the crowds and the heat.",
    locations: "Giza, Cairo",
    image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/deal_pyramids_sunset",
    gallery: [
      "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/deal_pyramids_sunset",
      "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/deal_pyramids_sphinx",
      "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/deal_pyramids_gold",
    ],
    price: 99, originalPrice: 150, rating: 4.8, reviewCount: 2150, duration: "Full Day", color: "#D4AF37",
    items: ["Great Pyramid Interior Access — دخول هرم خوفو", "VIP Sphinx Photoshoot — جلسة تصوير", "Grand Egyptian Museum — المتحف المصري الكبير", "Traditional Felucca Nile Ride — جولة بالنيل"],
    includes: ["Private Guide", "VIP Skip-The-Line", "Lunch at 9 Pyramids Lounge", "Return Hotel Transfer"],
    highlights: ["Exclusive Access", "No Crowds", "Gourmet Lunch", "Wheelchair Accessible"],
  },
  "5": {
    id: 5, category: "Safari", icon: "🏜️",
    title: "Siwa Oasis Safari — سفاري واحة سيوة",
    subtitle: "4x4 Desert Adventure, Salt Lakes & Stargazing",
    description: "Embark on an unforgettable 2-day safari to Siwa Oasis in Egypt's Western Desert. Drive 4x4 vehicles across golden sand dunes, swim in natural hot springs, float in Siwa's salt lakes (Egypt's Dead Sea), explore the ancient Oracle Temple of Amun, and camp under millions of stars in complete silence. A life-changing experience in one of the world's most remote oases.",
    locations: "Siwa Oasis, Western Desert",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&fit=crop",
      "https://images.unsplash.com/photo-1504598318550-17eba1008a68?w=600&fit=crop",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&fit=crop",
    ],
    price: 85, originalPrice: 150, rating: 4.8, reviewCount: 643, duration: "2 Days / 1 Night", color: "#E67E22",
    items: ["4x4 Dune Bashing — سباق الكثبان", "Camping Under the Stars — تخييم", "Sandboarding — تزلج الرمال", "Siwa Salt Lakes — بحيرات الملح"],
    includes: ["4x4 Vehicle & Driver", "Camping Equipment & Tent", "All Meals & Water", "English/Arabic Guide"],
    highlights: ["Stargazing", "Hot Springs", "Oracle Temple", "Bedouin BBQ Dinner"],
  },
  "6": {
    id: 6, category: "Diving", icon: "🤿",
    title: "Red Sea Diving — غوص البحر الأحمر",
    subtitle: "Scuba Diving at Ras Mohamed & Tiran Island",
    description: "Dive into the crystal-clear waters of the Red Sea at Sharm El Sheikh — one of the top 5 diving destinations in the world. Explore the famous Ras Mohamed National Park, Tiran Island coral reefs, and the SS Thistlegorm shipwreck. Whether you're a beginner or experienced diver, our PADI-certified instructors will guide you through an underwater paradise of colorful coral, tropical fish, dolphins, and sea turtles.",
    locations: "Sharm El Sheikh, Red Sea",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&fit=crop",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&fit=crop",
      "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=600&fit=crop",
    ],
    price: 55, originalPrice: 90, rating: 4.9, reviewCount: 1890, duration: "Full Day", color: "#1ABC9C",
    items: ["Ras Mohamed Reef Diving — غوص رأس محمد", "Tiran Island Snorkeling — سنوركل جزيرة تيران", "SS Thistlegorm Wreck Dive — غوص حطام السفينة", "Night Diving Experience — غوص ليلي"],
    includes: ["Full Diving Equipment", "PADI Instructor", "Boat Trip & Lunch", "Underwater Photos"],
    highlights: ["PADI Certified", "Beginner Friendly", "Coral Reefs", "Dolphins & Turtles"],
  },
  "7": {
    id: 7, category: "Nile Cruise", icon: "⛵",
    title: "MS Esplanade Nile Cruise — كروز إسبلاناد",
    subtitle: "5-Star Luxury Cruise from Luxor to Aswan",
    description: "Sail along the Nile aboard the 5-star MS Esplanade cruise from Luxor to Aswan. Over 5 magical days, visit the Temples of Karnak, Luxor, Edfu, Kom Ombo, and Philae. Enjoy gourmet buffet dining, a sundeck pool, live Nubian entertainment, and breathtaking sunset views over the Nile Valley. Each cabin features private balcony, en-suite bathroom, and panoramic windows. The ultimate Egyptian experience.",
    locations: "Luxor → Edfu → Kom Ombo → Aswan",
    image: "https://images.unsplash.com/photo-1568322503145-e986d345e1a0?w=1200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1568322503145-e986d345e1a0?w=600&fit=crop",
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=600&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&fit=crop",
    ],
    price: 350, originalPrice: 550, rating: 4.9, reviewCount: 1245, duration: "5 Days / 4 Nights", color: "#05073C",
    items: ["Karnak & Luxor Temples — معابد الكرنك والأقصر", "Valley of the Kings — وادي الملوك", "Edfu & Kom Ombo Temples — معبد إدفو وكوم أمبو", "Philae Temple & High Dam — معبد فيلة والسد العالي"],
    includes: ["5-Star Cabin with Balcony", "All Meals & Drinks", "Temple Entry Tickets", "Professional Egyptologist Guide"],
    highlights: ["Sundeck Pool", "Nubian Night Show", "Spa & Massage", "Sunset Views"],
  },
};

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = [
  { value: 1, label: "January" }, { value: 2, label: "February" }, { value: 3, label: "March" },
  { value: 4, label: "April" }, { value: 5, label: "May" }, { value: 6, label: "June" },
  { value: 7, label: "July" }, { value: 8, label: "August" }, { value: 9, label: "September" },
  { value: 10, label: "October" }, { value: 11, label: "November" }, { value: 12, label: "December" },
];
const YEARS = Array.from({ length: 3 }, (_, i) => 2026 + i);
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = ["00", "15", "30", "45"];

const DealDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [guests, setGuests] = useState(1);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedHour, setSelectedHour] = useState(10);
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">("AM");
  const deal = ALL_DEALS[id || "1"];
  
  useDocumentTitle(deal ? `${deal.title} — Book Now` : "Deal Not Found");

  if (!deal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Deal Not Found</h1>
          <Link to="/" className="text-[#D4AF37] font-semibold">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const discount = Math.round((1 - deal.price / deal.originalPrice) * 100);

  return (
    <div className="bg-[#fcfbf9] dark:bg-gray-900 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 py-3">
        <div className="max-w-7xl mx-auto px-4 text-sm text-gray-500 flex items-center gap-2">
          <Link to="/" className="hover:text-[#D4AF37]">Home</Link>
          <span>/</span>
          <span className="text-gray-800 dark:text-white font-medium">{deal.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column — Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden h-[400px]">
              <img src={deal.gallery[selectedImage]} alt={deal.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-red-500 text-white font-bold text-sm px-3 py-1.5 rounded-full">
                {discount}% OFF
              </div>
              <div className="absolute top-4 right-4 text-4xl">{deal.icon}</div>
            </div>
            {/* Gallery Thumbnails */}
            <div className="flex gap-3">
              {deal.gallery.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`w-24 h-16 rounded-lg overflow-hidden border-2 transition ${selectedImage === i ? "border-[#D4AF37]" : "border-transparent opacity-70 hover:opacity-100"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Title & Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white" style={{ backgroundColor: deal.color }}>{deal.category}</span>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <FaMapMarkerAlt className="text-[#D4AF37] text-xs" />
                  {deal.locations}
                </div>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">{deal.title}</h1>
              <p className="text-gray-500 dark:text-gray-400 mb-4">{deal.subtitle}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><FaStar className="text-yellow-400" /> <b className="text-gray-800 dark:text-white">{deal.rating}</b> ({deal.reviewCount} reviews)</span>
                <span className="flex items-center gap-1"><FaClock /> {deal.duration}</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">About This Experience</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{deal.description}</p>
            </div>

            {/* What's Included */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">What's Included</h2>
              <div className="grid grid-cols-2 gap-3">
                {deal.includes.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <FaCheck className="text-green-500 text-xs shrink-0" /> {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">Highlights</h2>
              <div className="flex flex-wrap gap-2">
                {deal.highlights.map((h, i) => (
                  <span key={i} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">{h}</span>
                ))}
              </div>
            </div>

            {/* Activities */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">Activities & Options</h2>
              <ul className="space-y-3">
                {deal.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: deal.color }}>{i+1}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column — Booking Widget */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg sticky top-24 border border-gray-100 dark:border-gray-700">
              {/* Price */}
              <div className="mb-5">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold" style={{ color: deal.color }}><PriceDisplay price={Number(deal.price)} /></span>
                  <span className="text-lg text-gray-400 line-through"><PriceDisplay price={Number(deal.originalPrice)} /></span>
                  <span className="text-sm font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded">{discount}% OFF</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">per person • {deal.duration}</p>
              </div>

              {/* Date: Day / Month / Year */}
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block flex items-center gap-1.5">
                  <FaCalendarAlt className="text-xs" style={{ color: deal.color }} /> Select Date
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <select value={selectedDay} onChange={e => setSelectedDay(Number(e.target.value))} className="border border-gray-200 dark:border-gray-600 rounded-xl px-2 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-[#D4AF37] appearance-none text-center">
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} className="border border-gray-200 dark:border-gray-600 rounded-xl px-2 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-[#D4AF37] appearance-none text-center">
                    {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                  <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="border border-gray-200 dark:border-gray-600 rounded-xl px-2 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-[#D4AF37] appearance-none text-center">
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              {/* Time: Hour / Minute / AM-PM */}
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block flex items-center gap-1.5">
                  <FaClock className="text-xs" style={{ color: deal.color }} /> Select Time
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <select value={selectedHour} onChange={e => setSelectedHour(Number(e.target.value))} className="border border-gray-200 dark:border-gray-600 rounded-xl px-2 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-[#D4AF37] appearance-none text-center">
                    {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <select value={selectedMinute} onChange={e => setSelectedMinute(e.target.value)} className="border border-gray-200 dark:border-gray-600 rounded-xl px-2 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-[#D4AF37] appearance-none text-center">
                    {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value as "AM" | "PM")} className="border border-gray-200 dark:border-gray-600 rounded-xl px-2 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-[#D4AF37] appearance-none text-center font-bold">
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              {/* Guests */}
              <div className="mb-5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block flex items-center gap-1.5">
                  <FaUsers className="text-xs" style={{ color: deal.color }} /> Guests
                </label>
                <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700">
                  <button onClick={() => setGuests(Math.max(1, guests - 1))} className="px-4 py-2.5 text-lg font-bold hover:bg-gray-100 dark:hover:bg-gray-600 transition">−</button>
                  <span className="flex-1 text-center font-bold text-lg dark:text-white">{guests}</span>
                  <button onClick={() => setGuests(guests + 1)} className="px-4 py-2.5 text-lg font-bold hover:bg-gray-100 dark:hover:bg-gray-600 transition">+</button>
                </div>
              </div>

              {/* Selected Summary */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-5 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>📅 Date</span>
                  <span className="font-medium text-gray-800 dark:text-white">{selectedDay}/{selectedMonth}/{selectedYear}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>🕐 Time</span>
                  <span className="font-medium text-gray-800 dark:text-white">{selectedHour}:{selectedMinute} {selectedPeriod}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>👥 Guests</span>
                  <span className="font-medium text-gray-800 dark:text-white">{guests}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between text-gray-500">
                    <span><PriceDisplay price={Number(deal.price)} /> × {guests} guest{guests > 1 ? "s" : ""}</span>
                    <span><PriceDisplay price={Number(deal.price * guests)} /></span>
                  </div>
                </div>
                <div className="flex justify-between font-extrabold text-lg text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-600 pt-2">
                  <span>Total</span>
                  <span style={{ color: deal.color }}><PriceDisplay price={Number(deal.price * guests)} /></span>
                </div>
              </div>

              {/* Book Button → Goes to Checkout */}
              <button
                onClick={() => navigate("/checkout", {
                  state: {
                    title: deal.title,
                    price: deal.price,
                    image: deal.gallery[0],
                    guests,
                    date: `${selectedDay}/${selectedMonth}/${selectedYear}`,
                    time: `${selectedHour}:${selectedMinute} ${selectedPeriod}`,
                    total: deal.price * guests,
                  }
                })}
                className="w-full py-3.5 rounded-xl font-bold text-white text-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                style={{ backgroundColor: deal.color }}
              >
                Book Now — ${deal.price * guests}
              </button>

              {/* Trust Badges */}
              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><FaShieldAlt /> Secure Payment</span>
                <span className="flex items-center gap-1"><FaCheck /> Free Cancellation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetailsPage;
