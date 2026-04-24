import React, { useState, useRef, useEffect } from "react";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { Link, useLocation } from "react-router-dom";
import { FaCheckCircle, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { useQuery } from '@tanstack/react-query';
import { getRestaurants } from '@/api/restaurantService';

const DealItem = ({ deal }: { deal: any }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Video play failed:", e));
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  
  const filteredRestaurants = restaurants.filter((item: any) => selectedCity === "All Locations" || (item.location || item.city) === selectedCity);
  return (
    <Link 
      to={`/restaurants/meal/${deal.id}`}
      state={{ title: deal.title, img: deal.img, discount: deal.discount }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="bg-[#f8f9fb] rounded-2xl overflow-hidden hover:shadow-[0_15px_30px_rgba(212,175,55,0.2)] transition-all duration-500 flex flex-col items-center p-6 text-center border-2 border-transparent hover:border-[#D4AF37] hover:-translate-y-2 block group"
    >
      <div className="relative w-full aspect-square bg-gray-200 rounded-full mb-6 overflow-hidden">
        <img src={deal.img} className={`w-full h-full object-cover transition-all duration-700 ${isHovered && deal.video ? 'opacity-0 scale-110' : 'opacity-100 group-hover:scale-110'}`} alt={deal.title} />
        {deal.video && (
           <video
             ref={videoRef}
             src={deal.video}
             muted
             loop
             playsInline
             className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
           />
        )}
        <span className="absolute top-4 left-4 bg-[#f8d02c] text-[#222] text-xs font-bold px-2 py-1 rounded z-10">
          {deal.discount}
        </span>
      </div>
      <h3 className="font-bold text-lg text-[#222] mb-2">{deal.title}</h3>
      <p className="text-xs text-gray-500 mb-4 line-clamp-2">
        يسري العرض على الطلبات بحد أقصى وجبة واحدة للفرد
      </p>
      <div className="flex items-center gap-2 border-t border-gray-200 w-full pt-4 justify-center">
        <FaStar className="text-yellow-400 text-sm" />
        <span className="text-sm font-medium">4.2/5 (2k+ Reviews)</span>
      </div>
    </Link>
  );
};

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState("All Locations");
  const uniqueCities = ["All Locations", ...new Set(restaurants.map((item: any) => item.location || item.city).filter(Boolean))];
  const [isLoading, setIsLoading] = useState(true);
  const [activeCity, setActiveCity] = useState("All");
  const urlLocation = useLocation();

  // @ts-ignore
  useEffect(() => {
    getRestaurants().then(res => {
      const restaurantsArray = Array.isArray(res) ? res : (res?.data || []);
      setRestaurants(restaurantsArray);
      setIsLoading(false);
    }).catch(err => {
      console.error("Error fetching restaurants:", err);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(urlLocation.search);
    const cityParam = params.get("city");
    if (cityParam) {
      setActiveCity(cityParam);
    }
  }, [urlLocation]);

  const citiesList = ["All", "Cairo", "Giza", "Alexandria", "Luxor", "Aswan", "Sharm El-Sheikh", "Hurghada", "Marsa Alam", "Marsa Matrouh", "Port Said", "Fayoum"];
  
  const filteredRestaurants = activeCity === "All" 
    ? restaurants 
    : restaurants.filter(r => r.location?.toLowerCase().includes(activeCity.toLowerCase()));

  return (
    <div className="bg-[#FAFAFA]">
      {/* 1. Hero Section */}
      <section className="relative h-[650px] w-full overflow-hidden flex items-center bg-[#fdfaf7]">
        {/* Background Decorative */}
        <div className="absolute inset-0 z-0 opacity-10" />
        <div className="container mx-auto px-4 z-10 relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
          <div className="max-w-xl">
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#222] leading-[1.1] mb-6">
              Best food for <br /> your taste
            </h1>
            <p className="text-lg text-gray-500 mb-8 leading-relaxed">
              Discover delectable cuisine and unforgettable moments in our welcoming, culinary haven.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/contact" className="px-8 py-3.5 bg-[#cd4f3c] text-white font-medium rounded-full hover:bg-[#b03c2b] transition">
                Book a Table
              </Link>
              <a href="#menu" className="px-8 py-3.5 border border-gray-300 text-gray-700 font-medium rounded-full hover:border-[#cd4f3c] hover:text-[#cd4f3c] transition bg-white shadow-sm">
                Explore Menu
              </a>
            </div>
          </div>

          <div className="hidden md:block relative h-full">
            {/* The right side imagery (plates, food) */}
            <div className="absolute inset-y-0 right-0 w-[120%] h-[120%] -top-[10%] -right-[10%]">
              <img 
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1400" 
                alt="Delicious Food" 
                className="w-full h-full object-cover rounded-tl-full rounded-bl-[40%]"
              />
            </div>
          </div>
        </div>
      </section>



      {/* Featured Restaurants from DB */}
      <SectionWrapper className="py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4" dir="rtl">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-[#222] mb-4">أشهر المطاعم المصرية</h2>
            <p className="text-gray-500 max-w-2xl mx-auto mb-8">
              اكتشف أشهر والذ المطاعم اللي بتقدم تجربة أكل مصري وعربي مفيش زيها!
            </p>
            {/* Filter Dropdown */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto bg-white p-2 rounded-xl border border-gray-200 shadow-sm" dir="ltr">
               <div className="flex items-center px-4"><span className="text-gray-400"><FaMapMarkerAlt /></span></div>
               <div className="h-10 w-px bg-gray-200 hidden sm:block" />
               <select
                 className="w-full px-4 py-3 text-sm focus:outline-none bg-transparent cursor-pointer font-bold text-gray-700"
                 value={activeCity}
                 onChange={(e) => setActiveCity(e.target.value)}
               >
                 {citiesList.map((city) => (
                   <option key={city} value={city}>
                     {city === "All" ? "All Locations" : city}
                   </option>
                 ))}
               </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cd4f3c]"></div></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRestaurants?.map((restaurant: any) => (
                <Link to={`/restaurants/${restaurant.id}`} key={restaurant.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(212,175,55,0.06)] border border-gray-100 hover:-translate-y-2 transition-all duration-500 flex flex-col group block">
                  <div className="relative w-full aspect-video overflow-hidden">
                    <img 
                      src={restaurant.image || '/placeholder.png'} 
                      alt={restaurant.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm text-[#cd4f3c] text-xs font-bold flex items-center gap-1.5">
                      <FaMapMarkerAlt /> {restaurant.location}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow text-right">
                    <h3 className="text-2xl font-bold text-[#14213d] mb-2 group-hover:text-[#cd4f3c] transition-colors duration-300">{restaurant.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{restaurant.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[#cd4f3c] font-bold text-sm bg-[#cd4f3c]/10 px-3 py-1 rounded-md">{restaurant.cuisine}</span>
                      <div className="flex items-center gap-1.5">
                        <FaStar className="text-yellow-400" />
                        <span className="text-sm font-bold">{restaurant.rating}</span>
                        <span className="text-xs text-gray-500">({restaurant.reviews_count})</span>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 pt-4 flex justify-between items-center mt-auto cursor-pointer">
                      <span className="text-gray-700 font-bold group-hover:text-[#cd4f3c]">
                          {document.cookie.includes('/ar') || document.documentElement.dir === 'rtl' ? 'تصفح المنيو والحجز \u2190' : 'View Menu & Booking \u2192'}
                      </span>
                      <span className="text-gray-500 text-xs">{restaurant.opening_hours}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </SectionWrapper>

      {/* 4. Fastest Food Delivery */}
      <SectionWrapper className="py-20 bg-[#FAFAFA]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-4 max-w-6xl mx-auto">
          {/* Images Masonry */}
          <div className="relative h-[500px] w-full gap-4 grid grid-cols-2 grid-rows-2">
            <img src="https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400" className="row-span-2 w-full h-full object-cover rounded-2xl" alt="Chef" />
            <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400" className="w-full h-full object-cover rounded-2xl" alt="Dish 1" />
            <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400" className="w-full h-full object-cover rounded-2xl" alt="Dish 2" />
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-[#222] leading-tight max-w-md">
              Fastest Food Delivery in City
            </h2>
            <p className="text-gray-500 leading-relaxed max-w-md">
              Our visual designer lets you put a grand of shapes how you want to out images texts blur on the fly.
            </p>
            <ul className="space-y-4 pt-4">
              <li className="flex items-center gap-3">
                <FaCheckCircle className="text-[#cd4f3c]" />
                <span className="font-medium text-gray-800">Delivery within 30 minutes</span>
              </li>
              <li className="flex items-center gap-3">
                <FaCheckCircle className="text-[#cd4f3c]" />
                <span className="font-medium text-gray-800">Best Offer & Prices</span>
              </li>
              <li className="flex items-center gap-3">
                <FaCheckCircle className="text-[#cd4f3c]" />
                <span className="font-medium text-gray-800">Online Services Available</span>
              </li>
            </ul>
          </div>
        </div>
      </SectionWrapper>

      {/* 4. Deals of the Day */}
      <SectionWrapper className="py-20 bg-white">
        <div dir="rtl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#222] mb-4">عروض اليوم المميزة</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              وفر وفرفش مع أقوى العروض والخصومات على أشهى الأطباق المصرية الأصلية لفترة محدودة.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto">
            {[
              { id: 1, title: "كشري أبو طارق", img: "/food/koshary.png", video: null, discount: "خصم 50%" },
              { id: 2, title: "ملوخية طاجن أصيلة", img: "/food/molokhia.png", video: null, discount: "خصم 20%" },
              { id: 3, title: "كبدة إسكندراني", img: "/food/kibda.png", video: null, discount: "خصم 30%" },
              { id: 4, title: "فطير مشلتت فلاحي", img: "/food/feteer.png", video: null, discount: "خصم 15%" },
            ].map(deal => (
              <DealItem key={deal.id} deal={deal} />
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* 5. Top Cuisine Experience */}
      <SectionWrapper className="py-20 bg-[#fdfaf7]">
        <div className="max-w-6xl mx-auto px-4" dir="rtl">
          <h2 className="text-3xl font-bold text-[#222] mb-10 text-center">أفضل تجارب المطبخ العالمي (حلال)</h2>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {[
              { id: 1, title: "المطبخ الصيني", slug: "chinese", img: "/food/cat_chinese.png" },
              { id: 2, title: "المطبخ الهندي", slug: "indian", img: "/food/cat_indian.png" },
              { id: 3, title: "المطبخ الكوري", slug: "korean", img: "/food/cat_korean.png" },
              { id: 4, title: "المطبخ التركي", slug: "turkish", img: "/food/cat_turkish.png" },
              { id: 5, title: "المطبخ الإيطالي", slug: "italian", img: "/food/cat_italian.png" },
              { id: 6, title: "المطبخ المكسيكي", slug: "mexican", img: "/food/cat_mexican.png" },
            ].map(cuisine => (
              <Link to={`/restaurants/menu/${cuisine.slug}`} key={cuisine.id} className="flex flex-col items-center gap-3 cursor-pointer group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md group-hover:scale-110 transition duration-300">
                  <img src={cuisine.img} className="w-full h-full object-cover" alt={cuisine.title} />
                </div>
                <span className="font-semibold text-gray-800">{cuisine.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* 6. Download Mobile App */}
      <SectionWrapper className="py-20 bg-white relative overflow-hidden border-t border-gray-100">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[100px] z-0 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#cd4f3c]/5 rounded-full blur-[100px] z-0 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10" dir="rtl">
          <div className="md:w-1/2 space-y-6">
            <span className="bg-[#f0f4f8] text-[#cd4f3c] border border-[#cd4f3c]/20 font-bold px-4 py-1.5 rounded-full text-sm inline-block tracking-wide">
              تطبيق كيميت
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-[1.3] text-[#222]">
              مطاعم مصر كلها بقت في جيبك!
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed max-w-lg mb-8">
              حمّل تطبيق كيميت دلوقتي واستمتع بتجربة أسهل وأسرع. اكتشف المطاعم القريبة منك، احجز طاولتك في النيل أو الأهرامات، واستفيد بخصومات حصرية لمستخدمي التطبيق.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-800 transition-colors shadow-lg">
                <svg className="w-8 h-8 fill-current" viewBox="0 0 384 512"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                <div className="text-left font-sans">
                  <p className="text-[10px] leading-tight text-gray-300">Download on the</p>
                  <p className="text-lg font-bold leading-tight">App Store</p>
                </div>
              </button>
              <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-800 transition-colors shadow-lg">
                <svg className="w-8 h-8 fill-current" viewBox="0 0 512 512"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
                <div className="text-left font-sans">
                  <p className="text-[10px] leading-tight text-gray-300">GET IT ON</p>
                  <p className="text-lg font-bold leading-tight">Google Play</p>
                </div>
              </button>
            </div>
          </div>
          
          <div className="md:w-1/2 relative flex justify-center mt-10 md:mt-0">
             {/* Abstract background blobs behind iPhone */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#cd4f3c]/5 rounded-full blur-3xl z-0"></div>
             
             {/* Simulated iPhone UI */}
             <div className="relative z-10 w-[280px] h-[550px] bg-[#f8f9fb] rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.4)] border-[8px] border-black overflow-hidden flex flex-col rotate-[-2deg] transition-transform duration-500 hover:rotate-0">
               {/* iPhone Notch */}
               <div className="absolute top-0 inset-x-0 h-6 bg-black w-36 mx-auto rounded-b-3xl z-20"></div>
               
               {/* App Header */}
               <div className="h-48 bg-[#14213d] relative p-6 flex flex-col justify-end">
                 <img src="https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=600" className="absolute inset-0 w-full h-full object-cover opacity-30" alt="App Bg" />
                 <h3 className="text-white font-bold text-2xl mb-1 relative z-10">Kemet Food</h3>
                 <p className="text-[#D4AF37] text-xs font-bold relative z-10">Discover & Book in Egypt</p>
               </div>
               
               {/* App Content */}
               <div className="flex-1 p-4 space-y-4" dir="ltr">
                 <div className="h-10 bg-white rounded-full shadow-sm border border-gray-100 flex items-center px-4">
                   <span className="text-gray-400 text-xs font-bold">🔍 Search restaurants...</span>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-3">
                   <div className="h-28 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
                      <img src="/food/koshary.png" className="w-full h-[70px] object-cover" />
                      <p className="text-black text-xs font-bold text-center mt-1.5">Egyptian</p>
                   </div>
                   <div className="h-28 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
                      <img src="/food/meat-tajine.png" className="w-full h-[70px] object-cover" />
                      <p className="text-black text-xs font-bold text-center mt-1.5">Tagines</p>
                   </div>
                 </div>
                 
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center p-2.5 gap-3">
                    <div className="w-14 h-14 bg-gray-200 rounded-xl overflow-hidden shrink-0">
                      <img src="/images/restaurants/balbaa.png" className="w-full h-full object-cover"/>
                    </div>
                    <div>
                      <p className="text-[#14213d] text-sm font-bold leading-tight">Andrea Grills</p>
                      <p className="text-yellow-400 text-[10px] tracking-widest mt-0.5">★★★★★</p>
                      <p className="text-gray-400 text-[9px] mt-0.5">Cairo, Egypt</p>
                    </div>
                 </div>
               </div>
               
               {/* App Bottom Bar */}
               <div className="h-16 bg-white border-t border-gray-200 flex items-center justify-around text-gray-300 pb-2">
                 <div className="flex flex-col items-center text-[#cd4f3c]"><span className="text-lg">🏠</span><span className="text-[8px] font-bold mt-1">Home</span></div>
                 <div className="flex flex-col items-center"><span className="text-lg">❤️</span><span className="text-[8px] font-bold mt-1">Saved</span></div>
                 <div className="flex flex-col items-center"><span className="text-lg">📅</span><span className="text-[8px] font-bold mt-1">Book</span></div>
                 <div className="flex flex-col items-center"><span className="text-lg">👤</span><span className="text-[8px] font-bold mt-1">Profile</span></div>
               </div>
             </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default RestaurantsPage;
