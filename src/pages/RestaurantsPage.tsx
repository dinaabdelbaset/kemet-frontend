import { useState, useRef } from "react";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { Link } from "react-router-dom";
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
  const { data: restaurants, isLoading } = useQuery({
    queryKey: ['restaurants'],
    queryFn: getRestaurants
  });

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

      {/* 2. Browse Our Menu */}
      <SectionWrapper id="menu" className="py-20 bg-white items-center text-center">
        <h2 className="text-3xl font-bold text-[#222] mb-12 relative inline-flex flex-col items-center">
          Browse Our Menu
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4 max-w-5xl mx-auto">
          {[
            { title: "Breakfast", id: "breakfast", icon: "☕" },
            { title: "Main Dishes", id: "main-dishes", icon: "🍜" },
            { title: "Drinks", id: "drinks", icon: "🍹" },
            { title: "Desserts", id: "desserts", icon: "🍰" },
          ].map((item) => (
            <Link 
              to={`/restaurants/menu/${item.id}`}
              key={item.id} 
              className="border-2 border-transparent hover:border-[#D4AF37] rounded-xl p-8 hover:shadow-[0_10px_25px_rgba(212,175,55,0.2)] transition-all duration-500 hover:-translate-y-2 group cursor-pointer text-center bg-white block"
            >
              <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#cd4f3c]/10 transition">
                <span className="text-2xl text-gray-400 group-hover:text-[#cd4f3c]">{item.icon}</span>
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">Authentic Egyptian recipes bringing you the true taste of local culture and heritage.</p>
              <span className="text-sm text-[#cd4f3c] font-medium mt-4 inline-block opacity-0 group-hover:opacity-100 transition">
                Explore Menu
              </span>
            </Link>
          ))}
        </div>
      </SectionWrapper>

      {/* Featured Restaurants from DB */}
      <SectionWrapper className="py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4" dir="rtl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#222] mb-4">أشهر المطاعم المصرية</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              اكتشف أشهر والذ المطاعم اللي بتقدم تجربة أكل مصري وعربي مفيش زيها!
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cd4f3c]"></div></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {restaurants?.map((restaurant: any) => (
                <div key={restaurant.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(212,175,55,0.06)] border border-gray-100 hover:-translate-y-2 transition-all duration-500 flex flex-col group">
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
                    <h3 className="text-2xl font-bold text-[#14213d] mb-2">{restaurant.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{restaurant.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[#cd4f3c] font-bold text-sm bg-[#cd4f3c]/10 px-3 py-1 rounded-md">{restaurant.cuisine}</span>
                      <div className="flex items-center gap-1.5">
                        <FaStar className="text-yellow-400" />
                        <span className="text-sm font-bold">{restaurant.rating}</span>
                        <span className="text-xs text-gray-500">({restaurant.reviews_count})</span>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 pt-4 flex justify-between items-center mt-auto">
                      <span className="text-[#cd4f3c] font-bold">{restaurant.price_range_min} - {restaurant.price_range_max} EGP</span>
                      <span className="text-gray-500 text-xs">{restaurant.opening_hours}</span>
                    </div>
                  </div>
                </div>
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

      {/* 6. Order Through Apps */}
      <SectionWrapper className="py-24 bg-white text-center">
        <div dir="rtl">
          <h2 className="text-3xl font-bold text-[#222] mb-4">اطلب براحتك من تطبيقات التوصيل</h2>
          <p className="text-gray-500 mb-12 max-w-xl mx-auto">
            تقدر تطلب كل الأكل اللي عجبك عن طريق أشهر تطبيقات التوصيل في مصر ويوصلك سخن ونار في أقل من ٣٠ دقيقة.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-5xl mx-auto px-4" dir="ltr">
            {[
              "Talabat", "Elmenus", "Botit", "Rabbit", "Breadfast",
              "InstaShop", "Gourmet", "Morni"
            ].map((app, index) => (
              <div key={index} className="h-16 border border-gray-100 rounded-lg flex items-center justify-center p-4 hover:border-gray-300 transition cursor-pointer shadow-sm bg-white">
                <span className="font-bold text-gray-700">{app}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default RestaurantsPage;
