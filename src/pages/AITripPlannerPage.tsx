import { useState, useEffect } from "react";
import { FaRobot, FaCalendarAlt, FaUsers, FaMoneyBillWave, FaMapMarkedAlt, FaMagic, FaCheckCircle, FaStar, FaHotel, FaUtensils, FaLandmark, FaBus, FaShoppingBag } from "react-icons/fa";
import Button from "../components/Ui/Button";
import Input from "../components/Ui/Input";
import DateTimePicker from "@/components/Ui/DateTimePicker";
import { getHotels } from "../api/tripService";
import { getTours } from "../api/tourService";
import { getTransportationList } from "../api/transportationService";
import { Link } from "react-router-dom";

const buildCityData = (hotelsData: any[], transportationData: any[]) => {
const cityData: Record<string, {
  hotels: typeof hotelsData;
  tours: { name: string; price: number; time: string; type: string; link: string; image: string }[];
  restaurants: { name: string; price: number; time: string; type: string; image: string }[];
  museums: { name: string; price: number; time: string; link: string; image: string }[];
  bazaars: { name: string; time: string; link: string; image: string }[];
  transport: { name: string; price: number; route: string; link: string }[];
}> = {
  Cairo: {
    hotels: hotelsData.filter(h => h.city === "Cairo"),
    tours: [
      { name: "Private Giza Pyramids & Sphinx Tour", price: 120, time: "9:00 AM - 1:00 PM", type: "Culture", link: "/tours/1", image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2b00?w=400" },
      { name: "Islamic Cairo Walking Tour", price: 45, time: "2:00 PM - 5:00 PM", type: "History", link: "/tours/2", image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=400" },
      { name: "Sunset Nile Felucca Ride", price: 25, time: "5:30 PM - 7:00 PM", type: "Relaxation", link: "/tours/3", image: "https://images.unsplash.com/photo-1568322503122-d524cfa340ae?w=400" },
      { name: "Sound & Light Show at the Pyramids", price: 40, time: "7:30 PM - 9:00 PM", type: "Entertainment", link: "/events/1", image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2b00?w=400" },
    ],
    restaurants: [
      { name: "Abou El Sid (Authentic Egyptian)", price: 35, time: "1:00 PM - Lunch", type: "Egyptian Cuisine", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400" },
      { name: "Sequoia on the Nile", price: 55, time: "8:00 PM - Dinner", type: "International", image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400" },
      { name: "Naguib Mahfouz Cafe", price: 20, time: "4:00 PM - Snack", type: "Traditional Cafe", image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400" },
    ],
    museums: [
      { name: "The Egyptian Museum", price: 20, time: "10:00 AM - 12:00 PM", link: "/museums/1", image: "https://images.unsplash.com/photo-1542036136-23133de5057b?w=400" },
      { name: "Grand Egyptian Museum (GEM)", price: 30, time: "9:00 AM - 1:00 PM", link: "/museums/2", image: "https://images.unsplash.com/photo-1541355415714-c8172905cc75?w=400" },
      { name: "Museum of Islamic Art", price: 15, time: "2:00 PM - 4:00 PM", link: "/museums/3", image: "https://images.unsplash.com/photo-1599839619722-39751411ea63?w=400" },
    ],
    bazaars: [
      { name: "Khan El Khalili Bazaar", time: "6:00 PM - 9:00 PM", link: "/bazaars/1", image: "https://images.unsplash.com/photo-1553524789-251f2868bf06?w=400" },
    ],
    transport: transportationData.filter(t => t.route.includes("Cairo")).map(t => ({ name: `${t.company} (${t.type})`, price: t.price, route: t.route, link: `/transportation/${t.id}` })),
  },
  Luxor: {
    hotels: hotelsData.filter(h => h.city === "Luxor"),
    tours: [
      { name: "Valley of the Kings & Queens", price: 85, time: "6:00 AM - 12:00 PM", type: "History", link: "/tours/1", image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2b00?w=400" },
      { name: "Karnak & Luxor Temple Tour", price: 60, time: "3:00 PM - 6:00 PM", type: "Culture", link: "/tours/2", image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=400" },
      { name: "Hot Air Balloon at Sunrise", price: 110, time: "5:00 AM - 7:00 AM", type: "Adventure", link: "/tours/3", image: "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=400" },
      { name: "Nile Cruise Dinner (Luxor → Aswan)", price: 299, time: "7:00 PM - 10:00 PM", type: "Luxury", link: "/tours/4", image: "https://images.unsplash.com/photo-1568322503122-d524cfa340ae?w=400" },
    ],
    restaurants: [
      { name: "Sofra Restaurant", price: 25, time: "1:00 PM - Lunch", type: "Traditional Egyptian", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400" },
      { name: "Al Sahaby Lane Restaurant", price: 40, time: "8:00 PM - Dinner", type: "Nile View Dining", image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400" },
    ],
    museums: [
      { name: "Luxor Museum", price: 15, time: "10:00 AM - 12:00 PM", link: "/museums/1", image: "https://images.unsplash.com/photo-1541355415714-c8172905cc75?w=400" },
      { name: "Mummification Museum", price: 10, time: "2:00 PM - 3:30 PM", link: "/museums/2", image: "https://images.unsplash.com/photo-1599839619722-39751411ea63?w=400" },
    ],
    bazaars: [
      { name: "Luxor Souk", time: "5:00 PM - 8:00 PM", link: "/bazaars/3", image: "/images/luxor-souk.png" },
    ],
    transport: transportationData.filter(t => t.route.includes("Luxor")).map(t => ({ name: `${t.company} (${t.type})`, price: t.price, route: t.route, link: `/transportation/${t.id}` })),
  },
  Aswan: {
    hotels: hotelsData.filter(h => h.city === "Aswan" || h.city === "Luxor"),
    tours: [
      { name: "Philae Temple & High Dam Tour", price: 70, time: "8:00 AM - 1:00 PM", type: "History", link: "/tours/1", image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2b00?w=400" },
      { name: "Abu Simbel Day Trip", price: 150, time: "4:00 AM - 3:00 PM", type: "Must-See", link: "/tours/2", image: "https://images.unsplash.com/photo-1568322503122-d524cfa340ae?w=400" },
      { name: "Nubian Village Boat Trip", price: 40, time: "2:00 PM - 5:00 PM", type: "Culture", link: "/tours/3", image: "/images/aswan-nubian-market.png" },
      { name: "Felucca Sunset around Elephantine Island", price: 20, time: "5:00 PM - 7:00 PM", type: "Relaxation", link: "/tours/4", image: "https://images.unsplash.com/photo-1568322503122-d524cfa340ae?w=400" },
    ],
    restaurants: [
      { name: "1902 Restaurant (Old Cataract)", price: 65, time: "8:00 PM - Dinner", type: "Fine Dining", image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400" },
      { name: "Makka Restaurant (Nubian)", price: 15, time: "1:00 PM - Lunch", type: "Nubian Cuisine", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400" },
    ],
    museums: [
      { name: "Nubia Museum", price: 10, time: "9:00 AM - 11:00 AM", link: "/museums/1", image: "https://images.unsplash.com/photo-1541355415714-c8172905cc75?w=400" },
    ],
    bazaars: [
      { name: "Aswan Nubian Market", time: "5:00 PM - 9:00 PM", link: "/bazaars/2", image: "/images/aswan-nubian-market.png" },
    ],
    transport: transportationData.filter(t => t.route.includes("Aswan") || t.route.includes("Luxor")).map(t => ({ name: `${t.company} (${t.type})`, price: t.price, route: t.route, link: `/transportation/${t.id}` })),
  },
  Sharm: {
    hotels: hotelsData.filter(h => h.city === "Sharm El Sheikh"),
    tours: [
      { name: "Ras Mohammed Snorkeling Trip", price: 65, time: "8:00 AM - 3:00 PM", type: "Water Sports", link: "/tours/1", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400" },
      { name: "Blue Hole Diving Experience", price: 90, time: "7:00 AM - 2:00 PM", type: "Adventure", link: "/tours/2", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400" },
      { name: "Quad Biking Desert Safari", price: 50, time: "4:00 PM - 6:00 PM", type: "Adventure", link: "/tours/3", image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400" },
      { name: "Glass Bottom Boat Tour", price: 35, time: "10:00 AM - 12:00 PM", type: "Family", link: "/tours/4", image: "https://images.unsplash.com/photo-1500514966906-fe245eea9344?w=400" },
    ],
    restaurants: [
      { name: "Farsha Cafe (Cliffside)", price: 30, time: "7:00 PM - Dinner", type: "Mediterranean", image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400" },
      { name: "El Masrien Restaurant", price: 20, time: "1:00 PM - Lunch", type: "Egyptian Seafood", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400" },
    ],
    museums: [],
    bazaars: [
      { name: "Sharm Old Market", time: "6:00 PM - 10:00 PM", link: "/bazaars/1", image: "https://images.unsplash.com/photo-1553524789-251f2868bf06?w=400" },
    ],
    transport: transportationData.filter(t => t.route.includes("Sharm")).map(t => ({ name: `${t.company} (${t.type})`, price: t.price, route: t.route, link: `/transportation/${t.id}` })),
  },
  Hurghada: {
    hotels: hotelsData.filter(h => h.city === "Hurghada"),
    tours: [
      { name: "Giftun Island Snorkeling", price: 45, time: "8:00 AM - 4:00 PM", type: "Beach", link: "/tours/1", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400" },
      { name: "Orange Bay Beach Trip", price: 55, time: "9:00 AM - 5:00 PM", type: "Relaxation", link: "/tours/2", image: "https://images.unsplash.com/photo-1500514966906-fe245eea9344?w=400" },
      { name: "Desert Stargazing Safari", price: 60, time: "5:00 PM - 10:00 PM", type: "Adventure", link: "/tours/3", image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400" },
      { name: "Submarine Trip (Semi-Sub)", price: 40, time: "11:00 AM - 1:00 PM", type: "Family", link: "/tours/4", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400" },
    ],
    restaurants: [
      { name: "The Lodge Restaurant", price: 35, time: "8:00 PM - Dinner", type: "International", image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400" },
      { name: "Moby Dick Seafood", price: 25, time: "1:00 PM - Lunch", type: "Seafood", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400" },
    ],
    museums: [
      { name: "Hurghada Marine Museum", price: 10, time: "10:00 AM - 12:00 PM", link: "/museums/1", image: "https://images.unsplash.com/photo-1541355415714-c8172905cc75?w=400" },
    ],
    bazaars: [
      { name: "El Dahar Bazaar", time: "5:00 PM - 9:00 PM", link: "/bazaars/1", image: "https://images.unsplash.com/photo-1553524789-251f2868bf06?w=400" },
    ],
    transport: transportationData.filter(t => t.route.includes("Hurghada")).map(t => ({ name: `${t.company} (${t.type})`, price: t.price, route: t.route, link: `/transportation/${t.id}` })),
  },
  Alexandria: {
    hotels: hotelsData.filter(h => h.city === "Alexandria"),
    tours: [
      { name: "Bibliotheca Alexandrina & Citadel Tour", price: 50, time: "9:00 AM - 1:00 PM", type: "Culture", link: "/tours/1", image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=400" },
      { name: "Catacombs of Kom El Shoqafa", price: 30, time: "2:00 PM - 4:00 PM", type: "History", link: "/tours/2", image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2b00?w=400" },
      { name: "Corniche Walking & Sunset Tour", price: 15, time: "5:00 PM - 7:30 PM", type: "Relaxation", link: "/tours/3", image: "https://images.unsplash.com/photo-1568322503122-d524cfa340ae?w=400" },
      { name: "Montazah Palace Gardens Visit", price: 10, time: "10:00 AM - 12:00 PM", type: "Nature", link: "/tours/4", image: "https://images.unsplash.com/photo-1500514966906-fe245eea9344?w=400" },
    ],
    restaurants: [
      { name: "Balbaa Village (Seafood)", price: 30, time: "1:00 PM - Lunch", type: "Seafood", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400" },
      { name: "Fish Market Restaurant", price: 40, time: "8:00 PM - Dinner", type: "Fine Seafood", image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400" },
      { name: "Greek Club Cafe", price: 15, time: "4:00 PM - Snack", type: "Cafe", image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400" },
    ],
    museums: [
      { name: "Alexandria National Museum", price: 10, time: "9:00 AM - 11:00 AM", link: "/museums/1", image: "https://images.unsplash.com/photo-1541355415714-c8172905cc75?w=400" },
      { name: "Royal Jewelry Museum", price: 15, time: "1:00 PM - 3:00 PM", link: "/museums/2", image: "https://images.unsplash.com/photo-1599839619722-39751411ea63?w=400" },
    ],
    bazaars: [
      { name: "Attarine Antique Market", time: "5:00 PM - 8:00 PM", link: "/bazaars/1", image: "https://images.unsplash.com/photo-1553524789-251f2868bf06?w=400" },
    ],
    transport: transportationData.filter(t => t.route.includes("Alexandria")).map(t => ({ name: `${t.company} (${t.type})`, price: t.price, route: t.route, link: `/transportation/${t.id}` })),
  },
  Dahab: {
    hotels: [],
    tours: [
      { name: "Blue Hole Freediving & Snorkeling", price: 40, time: "8:00 AM - 1:00 PM", type: "Water Sports", link: "/tours/1", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400" },
      { name: "Colored Canyon Hiking", price: 55, time: "7:00 AM - 2:00 PM", type: "Adventure", link: "/tours/2", image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400" },
      { name: "Bedouin Desert Safari & Stargazing", price: 45, time: "4:00 PM - 11:00 PM", type: "Experience", link: "/tours/3", image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400" },
      { name: "Lagoon Windsurf & Kitesurf Session", price: 70, time: "10:00 AM - 2:00 PM", type: "Sports", link: "/tours/4", image: "https://images.unsplash.com/photo-1500514966906-fe245eea9344?w=400" },
    ],
    restaurants: [
      { name: "Everyday Restaurant", price: 12, time: "1:00 PM - Lunch", type: "Backpacker Favorite", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400" },
      { name: "Ali Baba Restaurant (Seafront)", price: 20, time: "7:00 PM - Dinner", type: "Seafood & Egyptian", image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400" },
    ],
    museums: [],
    bazaars: [
      { name: "Dahab Promenade Market", time: "6:00 PM - 10:00 PM", link: "/bazaars/1", image: "https://images.unsplash.com/photo-1553524789-251f2868bf06?w=400" },
    ],
    transport: [],
  },
  MarsaAlam: {
    hotels: [],
    tours: [
      { name: "Dolphin House Reef Snorkeling", price: 50, time: "8:00 AM - 3:00 PM", type: "Marine Life", link: "/tours/1", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400" },
      { name: "Wadi El Gemal National Park", price: 65, time: "7:00 AM - 4:00 PM", type: "Nature", link: "/tours/2", image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400" },
      { name: "Diving with Dugongs", price: 90, time: "8:00 AM - 1:00 PM", type: "Diving", link: "/tours/3", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400" },
      { name: "Desert Quad Bike & Camel Ride", price: 40, time: "4:00 PM - 7:00 PM", type: "Adventure", link: "/tours/4", image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400" },
    ],
    restaurants: [
      { name: "Red Sea Grill", price: 30, time: "8:00 PM - Dinner", type: "Seafood", image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400" },
      { name: "Beach House Cafe", price: 18, time: "1:00 PM - Lunch", type: "Casual Dining", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400" },
    ],
    museums: [],
    bazaars: [],
    transport: [],
  },
  Siwa: {
    hotels: [],
    tours: [
      { name: "Siwa Oasis Safari & Camping", price: 150, time: "Full Day", type: "Adventure", link: "/tours/1", image: "/images/siwa-safari.png" },
      { name: "Cleopatra's Spring & Salt Lakes", price: 40, time: "10:00 AM - 2:00 PM", type: "Nature", link: "/tours/2", image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400" },
      { name: "Mountain of the Dead Exploration", price: 30, time: "3:00 PM - 5:00 PM", type: "History", link: "/tours/3", image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2b00?w=400" },
      { name: "Bedouin Campfire Night Under Stars", price: 60, time: "8:00 PM - 12:00 AM", type: "Experience", link: "/tours/4", image: "/images/siwa-safari.png" },
    ],
    restaurants: [
      { name: "Abdo's Restaurant (Local Siwan)", price: 15, time: "1:00 PM - Lunch", type: "Siwan Cuisine", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400" },
    ],
    museums: [
      { name: "Siwa House Museum", price: 5, time: "10:00 AM - 11:30 AM", link: "/museums/1", image: "https://images.unsplash.com/photo-1541355415714-c8172905cc75?w=400" },
    ],
    bazaars: [],
    transport: [],
  },
};
return cityData;
};

// ============ SMART TRIP GENERATOR ============
const generateTrip = (cityData: any, destination: string, budget: number, days: number, vibe: string) => {
  const city = cityData[destination] || cityData["Cairo"];
  
  // Pick hotel
  const hotel = city.hotels.length > 0 
    ? city.hotels.sort((a: any, b: any) => b.rating - a.rating)[0]
    : { name: "Boutique Desert Lodge", city: destination, price: 120, rating: 4.5, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400" };

  // Build daily itinerary from actual data
  const itinerary: any[] = [];
  let totalCost = (hotel as any).price * days;
  
  for (let day = 1; day <= days; day++) {
    const dayPlan: any = { day, activities: [] };
    
    // Morning: Tour or Museum
    if (day <= city.tours.length) {
      const tour = city.tours[day - 1];
      dayPlan.activities.push({ ...tour, category: "🗺️ جولة" });
      totalCost += tour.price;
    } else if (city.museums.length > 0) {
      const museum = city.museums[(day - 1) % city.museums.length];
      dayPlan.activities.push({ ...museum, name: museum.name, price: museum.price, category: "🏛️ متحف", type: "Museum Visit" });
      totalCost += museum.price;
    }
    
    // Lunch
    if (city.restaurants.length > 0) {
      const lunchRestaurant = city.restaurants.find((r: any) => r.time.includes("Lunch")) || city.restaurants[0];
      dayPlan.activities.push({ ...lunchRestaurant, category: "🍽️ مطعم" });
      totalCost += lunchRestaurant.price;
    }
    
    // Afternoon: Museum or Bazaar
    if (day <= city.museums.length && city.tours.length >= day) {
      const museum = city.museums[(day - 1) % city.museums.length];
      dayPlan.activities.push({ ...museum, category: "🏛️ متحف", type: "Museum Visit" });
      totalCost += museum.price;
    }
    
    // Evening: Bazaar (on specific days) or Dinner
    if (city.bazaars.length > 0 && day === 1) {
      const bazaar = city.bazaars[0];
      dayPlan.activities.push({ name: bazaar.name, price: 0, time: bazaar.time, type: "Shopping", category: "🛍️ بازار", link: bazaar.link, image: bazaar.image });
    }
    
    // Dinner
    if (city.restaurants.length > 0) {
      const dinnerRestaurant = city.restaurants.find((r: any) => r.time.includes("Dinner")) || city.restaurants[city.restaurants.length - 1];
      dayPlan.activities.push({ ...dinnerRestaurant, category: "🍽️ عشاء" });
      totalCost += dinnerRestaurant.price;
    }
    
    itinerary.push(dayPlan);
  }

  // Transport recommendation
  const transport = city.transport.length > 0 ? city.transport[0] : null;
  if (transport) totalCost += transport.price;

  return {
    title: destination === "Cairo" ? "رحلة القاهرة الساحرة ✨" 
         : destination === "Luxor" ? "مغامرة الأقصر التاريخية 🏛️"
         : destination === "Aswan" ? "رحلة أسوان النوبية الساحرة 🌊"
         : destination === "Sharm" ? "عطلة شرم الشيخ الاستوائية 🏖️"
         : destination === "Hurghada" ? "إجازة الغردقة البحرية 🐠"
         : destination === "Alexandria" ? "رحلة الإسكندرية المتوسطية 🌅"
         : destination === "Dahab" ? "مغامرة دهب الحرة 🏄‍♂️"
         : destination === "MarsaAlam" ? "رحلة مرسى علم البحرية 🐬"
         : destination === "Siwa" ? "مغامرة واحة سيوا الصحراوية 🏜️"
         : "رحلة مصر الشاملة 🇪🇬",
    hotel,
    itinerary,
    transport,
    totalCost: Math.min(totalCost, budget),
    days,
    destination,
  };
};

// ============ COMPONENT ============
const AITripPlannerPage = () => {
  const [hotelsData, setHotelsData] = useState<any[]>([]);
  const [transportationData, setTransportationData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotels, transport] = await Promise.all([
          getHotels(),
          getTransportationList({}),
        ]);
        setHotelsData(Array.isArray(hotels) ? hotels : []);
        setTransportationData(Array.isArray(transport) ? transport : []);
      } catch (e) { console.error('Error loading trip data:', e); }
    };
    fetchData();
  }, []);

  const [formData, setFormData] = useState({
    adults: "2",
    children: "0",
    startDate: "",
    endDate: "",
    budget: "",
    vibe: "Surprise Me 🎁",
    destination: "Cairo",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<any>(null);

  const loadingMessages = [
    "جاري تحليل تفضيلاتك...",
    "البحث في قاعدة البيانات عن أفضل الخيارات...",
    "ترتيب الجدول الزمني المثالي...",
    "إعداد خطة رحلتك الشاملة...",
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setResult(null);
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < loadingMessages.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 400);

    setTimeout(() => {
      setIsGenerating(false);
      
      // Calculate days
      let days = 3;
      if (formData.startDate && formData.endDate) {
        const diff = Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24));
        if (diff > 0) days = Math.min(diff, 7);
      }

      const trip = generateTrip(
        buildCityData(hotelsData, transportationData),
        formData.destination,
        Number(formData.budget) || 2000,
        days,
        formData.vibe
      );
      setResult(trip);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      
      {/* Header Banner */}
      <div className="bg-[#05073C] py-16 px-4 relative overflow-hidden mb-12">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm border border-white/20">
             <FaRobot className="text-[#D4AF37] text-3xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            مخطط الرحلات الذكي <span className="text-[#D4AF37]">✨</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            حدد وجهتك وميزانيتك ومدة الرحلة وسيقوم نظامنا الذكي ببناء رحلة كاملة من فنادق ومطاعم ومتاحف وجولات من بياناتنا الفعلية
          </p>
        </div>
        <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-[#D4AF37]/20 blur-[120px] rounded-full point-events-none" />
        <div className="absolute bottom-[-50%] right-[-10%] w-96 h-96 bg-[#EB662B]/20 blur-[120px] rounded-full point-events-none" />
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Form Column */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 sticky top-24">
            <h3 className="text-xl font-bold text-[#05073C] mb-6 flex items-center gap-2">
              <FaMagic className="text-[#D4AF37]" /> تفضيلاتك
            </h3>
            
            <form onSubmit={handleGenerate} className="space-y-5">
              
              {/* Destination */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                   <FaMapMarkedAlt className="text-gray-400" /> الوجهة
                </label>
                <select 
                  name="destination"
                  value={formData.destination} 
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all font-medium text-gray-700"
                >
                  <option value="Cairo">القاهرة (ثقافة وتاريخ) 🏛️</option>
                  <option value="Luxor">الأقصر (آثار فرعونية) ⛏️</option>
                  <option value="Aswan">أسوان (نوبة ومعابد) 🌊</option>
                  <option value="Sharm">شرم الشيخ (بحر وغوص) 🏖️</option>
                  <option value="Hurghada">الغردقة (شاطئ ومرح) 🐠</option>
                  <option value="Alexandria">الإسكندرية (بحر وثقافة) 🌅</option>
                  <option value="Dahab">دهب (مغامرة وحرية) 🏄‍♂️</option>
                  <option value="MarsaAlam">مرسى علم (غوص ودلافين) 🐬</option>
                  <option value="Siwa">واحة سيوا (صحراء ومغامرة) 🏜️</option>
                </select>
              </div>

              {/* Guests */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <FaUsers className="text-gray-400" /> بالغين
                    </label>
                    <Input type="number" name="adults" min="1" value={formData.adults} onChange={handleChange} required />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">أطفال</label>
                    <Input type="number" name="children" min="0" value={formData.children} onChange={handleChange} required />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <DateTimePicker 
                  compact 
                  showTime={false} 
                  dateLabel="تاريخ الوصول" 
                  onDateChange={(val) => setFormData({...formData, startDate: val})} 
                />
                <DateTimePicker 
                  compact 
                  showTime={false} 
                  dateLabel="تاريخ المغادرة" 
                  onDateChange={(val) => setFormData({...formData, endDate: val})} 
                />
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                   <FaMoneyBillWave className="text-gray-400" /> الميزانية الإجمالية ($)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                  <Input type="number" name="budget" placeholder="مثال: 2500" className="pl-8" value={formData.budget} onChange={handleChange} required />
                </div>
              </div>

               {/* Vibe */}
               <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                   <FaStar className="text-gray-400" /> نوع الرحلة
                </label>
                <select 
                  name="vibe"
                  value={formData.vibe} 
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all font-bold text-gray-700 text-sm"
                >
                  <option>Surprise Me 🎁</option>
                  <option>استرخاء وسبا 💆‍♂️</option>
                  <option>تاريخ وثقافة 🏛️</option>
                  <option>مغامرة وسفاري 🏜️</option>
                  <option>ترفيه وحياة ليلية 🪩</option>
                </select>
              </div>

              <Button 
                type="submit" 
                className="w-full py-4 mt-4 bg-[#05073C] hover:bg-[#1A365D] text-white font-black text-lg rounded-xl shadow-[0_10px_20px_rgba(5,7,60,0.2)] hover:shadow-[0_15px_30px_rgba(212,175,55,0.3)] border-2 border-transparent hover:border-[#D4AF37] hover:-translate-y-1 transition-all duration-300"
                disabled={isGenerating}
              >
                {isGenerating ? "جاري التخطيط..." : "ابدأ تخطيط الرحلة ✨"}
              </Button>
            </form>
          </div>
        </div>

        {/* Result Column */}
        <div className="lg:col-span-8">
          
          {/* Default Empty State */}
          {!isGenerating && !result && (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-white/50 rounded-3xl border border-dashed border-gray-300 min-h-[500px]">
               <div className="w-24 h-24 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-6">
                 <FaRobot className="text-[#D4AF37] text-4xl opacity-50" />
               </div>
               <h3 className="text-2xl font-bold text-gray-400 mb-2">في انتظار بياناتك</h3>
               <p className="text-gray-500 max-w-sm">
                 املأ النموذج على اليسار وسيقوم نظامنا الذكي ببناء رحلة كاملة مخصصة لك من بيانات الموقع الفعلية.
               </p>
            </div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-white rounded-3xl shadow-sm border border-gray-100 min-h-[500px] animate-pulse">
               <div className="relative w-32 h-32 mb-8 flex justify-center items-center">
                  <div className="absolute inset-0 rounded-full border-t-4 border-[#D4AF37] border-opacity-30 animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-r-4 border-[#05073C] border-opacity-30 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                  <FaRobot className="text-5xl text-[#D4AF37] animate-bounce" />
               </div>
               <h3 className="text-2xl font-extrabold text-[#05073C] mb-2">النظام يعمل...</h3>
               <p className="text-[#EB662B] font-bold text-lg animate-fade-in-up transition-all duration-300 mt-4 h-8">
                 {loadingMessages[loadingStep]}
               </p>
            </div>
          )}

          {/* AI Result View */}
          {!isGenerating && result && (
             <div className="animate-fade-in-up bg-white rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.06)] overflow-hidden border border-gray-100">
                {/* Result Header */}
                <div className="bg-gradient-to-r from-[#05073C] to-[#1A365D] p-8 md:p-12 text-white relative">
                   <div className="absolute top-0 right-0 p-6 opacity-10">
                      <FaMagic className="text-9xl" />
                   </div>
                   <span className="inline-block px-3 py-1 bg-[#D4AF37] text-[#05073C] text-xs font-black tracking-widest uppercase rounded mb-4">خطة رحلة ذكية</span>
                   <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">{result.title}</h2>
                   
                   <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><FaMoneyBillWave className="text-[#D4AF37]" /></div>
                        <div>
                          <p className="text-white/60 text-xs">التكلفة التقديرية</p>
                          <p className="font-bold text-lg">${result.totalCost}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><FaCalendarAlt className="text-[#D4AF37]" /></div>
                        <div>
                          <p className="text-white/60 text-xs">المدة</p>
                          <p className="font-bold text-lg">{result.days} أيام</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><FaUsers className="text-[#D4AF37]" /></div>
                        <div>
                          <p className="text-white/60 text-xs">المسافرون</p>
                          <p className="font-bold text-lg">{formData.adults} بالغين + {formData.children} أطفال</p>
                        </div>
                     </div>
                   </div>
                </div>

                {/* Itinerary Body */}
                <div className="p-8 md:p-12">
                   
                   {/* Hotel Section */}
                   <div className="mb-10">
                      <h3 className="text-xl font-bold text-[#05073C] border-b border-gray-100 pb-4 mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-[#EB662B]/10 text-[#EB662B] flex items-center justify-center text-sm"><FaHotel /></span>
                        الفندق المقترح
                      </h3>
                      
                      <Link to={`/hotels/${result.hotel.id || 1}`} className="flex flex-col sm:flex-row gap-6 bg-gray-50 rounded-2xl p-4 border border-transparent hover:border-[#D4AF37] transition-all hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)] group">
                        <img src={result.hotel.image} alt={result.hotel.name} className="w-full sm:w-48 h-32 object-cover rounded-xl" />
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex items-center gap-1 text-yellow-500 text-xs mb-2">
                             <FaStar/><FaStar/><FaStar/><FaStar/><FaStar/> <span className="text-gray-500 ml-1">({result.hotel.rating})</span>
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#EB662B] transition-colors">{result.hotel.name}</h4>
                          <p className="text-sm text-gray-500 mt-1 mb-4">{result.hotel.city || result.destination} • مطابق لتفضيلاتك</p>
                          <div className="font-black text-[#05073C]">${result.hotel.price} <span className="text-xs text-gray-400 font-medium">/ليلة</span></div>
                        </div>
                      </Link>
                   </div>

                   {/* Daily Itinerary */}
                   {result.itinerary.map((day: any) => (
                     <div key={day.day} className="mb-10">
                       <h3 className="text-xl font-bold text-[#05073C] border-b border-gray-100 pb-4 mb-6 flex items-center gap-2">
                         <span className="w-8 h-8 rounded-full bg-[#EB662B]/10 text-[#EB662B] flex items-center justify-center text-sm font-bold">{day.day}</span>
                         اليوم {day.day}
                       </h3>
                       
                       <div className="space-y-3">
                         {day.activities.map((act: any, idx: number) => (
                           <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-white hover:bg-gray-50 hover:border-[#D4AF37]/30 transition-all group">
                             <div className="flex items-center gap-4">
                               {act.image && (
                                 <img src={act.image} alt={act.name} className="w-14 h-14 rounded-xl object-cover hidden sm:block" />
                               )}
                               <div>
                                 <div className="flex items-center gap-2 mb-1">
                                   <span className="text-xs font-bold text-[#EB662B] bg-[#EB662B]/10 px-2 py-0.5 rounded">{act.category}</span>
                                 </div>
                                 <h4 className="font-bold text-gray-900 group-hover:text-[#EB662B] transition-colors">{act.name}</h4>
                                 <p className="text-xs text-gray-500 font-medium">{act.time} {act.type ? `• ${act.type}` : ""}</p>
                               </div>
                             </div>
                             <div className="text-right">
                               <div className="font-bold text-[#05073C]">{act.price > 0 ? `$${act.price}` : "مجاناً"}</div>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   ))}

                   {/* Transport Section */}
                   {result.transport && (
                     <div className="mb-10">
                       <h3 className="text-xl font-bold text-[#05073C] border-b border-gray-100 pb-4 mb-6 flex items-center gap-2">
                         <span className="w-8 h-8 rounded-full bg-[#EB662B]/10 text-[#EB662B] flex items-center justify-center text-sm"><FaBus /></span>
                         المواصلات المقترحة
                       </h3>
                       <Link to={result.transport.link} className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:border-[#D4AF37] transition-all">
                         <div>
                           <h4 className="font-bold text-gray-900">{result.transport.name}</h4>
                           <p className="text-xs text-gray-500">{result.transport.route}</p>
                         </div>
                         <div className="font-bold text-[#EB662B]">${result.transport.price}</div>
                       </Link>
                     </div>
                   )}

                   {/* Action Buttons */}
                   <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-gray-100">
                     <Link to="/checkout" className="flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg bg-[#EB662B] text-white hover:bg-[#d55822] transition text-center">
                       <FaCheckCircle /> احجز الرحلة كاملة
                     </Link>
                     <button onClick={() => setResult(null)} className="flex-1 py-4 rounded-xl font-bold text-[#05073C] border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition">
                       تعديل التفضيلات
                     </button>
                   </div>

                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AITripPlannerPage;
