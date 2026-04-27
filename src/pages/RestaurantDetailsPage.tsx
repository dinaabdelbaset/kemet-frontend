import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { FaStar, FaMapMarkerAlt, FaClock, FaMoneyBillWave } from "react-icons/fa";
import { getRestaurants } from "@/api/restaurantService";

const RestaurantDetailsPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleTableBooking = () => {
    navigate('/checkout', {
      state: {
        id: restaurant?.id || Math.floor(Math.random() * 1000),
        type: 'food_cart',
        title: `حجز طاولة - ${restaurant?.name || 'المطعم'}`,
        image: restaurant?.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
        price: 0, // Table reservation is usually free to book
      }
    });
  };

  useEffect(() => {
    // Ideally we fetch a single restaurant, but we'll fetch all and find it
    getRestaurants().then((res) => {
      const restaurantsArray = Array.isArray(res) ? res : (res?.data || []);
      const found = restaurantsArray.find((r: any) => r.id.toString() === id);
      setRestaurant(found);
      setIsLoading(false);
    }).catch((err) => {
      console.error(err);
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#cd4f3c]"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] flex-col">
        <h1 className="text-4xl font-bold text-[#222] mb-4">المطعم غير موجود</h1>
        <Link to="/restaurants" className="px-6 py-3 bg-[#cd4f3c] text-white rounded-full">استكشف المطاعم</Link>
      </div>
    );
  }

  const cuisineLc = (restaurant.cuisine || "").toLowerCase();
  const nameLc = (restaurant.name || "").toLowerCase();

  const isSeafood = cuisineLc.includes("seafood") || nameLc.includes("kadoura") || nameLc.includes("fares");
  const isGrills = cuisineLc.includes("grills") || nameLc.includes("masrien") || nameLc.includes("prince");
  const isKoshary = cuisineLc.includes("koshary") || nameLc.includes("tariq");
  const isItalian = cuisineLc.includes("italian") || cuisineLc.includes("pizza");
  const isChinese = cuisineLc.includes("chinese");
  const isIndian = cuisineLc.includes("indian");
  const isMexican = cuisineLc.includes("mexican");
  const isStreetFood = nameLc.includes("felfela") || nameLc.includes("gad") || cuisineLc.includes("street");

  // Determine meal times and categories accurately per restaurant
  const hasBreakfast = nameLc.includes("gad") || nameLc.includes("جاد") || 
                       nameLc.includes("ibis") || nameLc.includes("إيبيس") ||
                       nameLc.includes("terrace") || nameLc.includes("تيراس") ||
                       nameLc.includes("delices") || nameLc.includes("ديليس");

  const isCafeOnly = nameLc.includes("delices") || nameLc.includes("ديليس") || 
                     nameLc.includes("farsha") || nameLc.includes("فرشة");

  let categories = [];

  if (hasBreakfast) {
    categories.push({ title: "منيو الإفطار", id: "breakfast", icon: "☕", enTitle: "Breakfast Menu" });
  }

  if (!isCafeOnly) {
    let mainId = "main-dishes";
    let mainTitle = "أطباق الغداء والعشاء";
    let mainIcon = "🍽️";

    if (isSeafood) { mainId = "seafood"; mainTitle = "أسماك وسي فود"; mainIcon = "🐟"; }
    else if (isGrills) { mainId = "grills-category"; mainTitle = "مشويات وطواجن"; mainIcon = "🥩"; }
    else if (isKoshary) { mainId = "koshary-meals"; mainTitle = "كشري وإضافات"; mainIcon = "🍲"; }
    else if (isItalian) { mainId = "italian"; mainTitle = "أطباق إيطالية"; mainIcon = "🍕"; }
    else if (isChinese) { mainId = "chinese"; mainTitle = "أطباق صينية"; mainIcon = "🍜"; }
    else if (isIndian) { mainId = "indian"; mainTitle = "أطباق هندية"; mainIcon = "🍛"; }
    else if (isMexican) { mainId = "mexican"; mainTitle = "أطباق مكسيكية"; mainIcon = "🌮"; }
    else if (isStreetFood) { mainId = "street-food"; mainTitle = "أطباق شعبية"; mainIcon = "🧆"; }
    
    categories.push({ title: mainTitle, id: mainId, icon: mainIcon, enTitle: "Main Course" });
  }

  categories.push({ title: "الحلويات", id: "desserts", icon: "🍰", enTitle: "Desserts" });
  categories.push({ title: "المشروبات", id: "drinks", icon: "🍹", enTitle: "Drinks" });

  let servingText = "غداء، عشاء";
  if (hasBreakfast && !isCafeOnly) servingText = "فطار، غداء، عشاء";
  else if (hasBreakfast) servingText = "فطار، وحلويات";
  else if (isCafeOnly) servingText = "مشروبات وحلويات";

  return (
    <div className="bg-[#FAFAFA] pb-20">
      {/* Hero Header */}
      <section className="relative h-[50vh] min-h-[400px] w-full bg-black">
        <img 
          src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'} 
          alt={restaurant.name} 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end pb-12 px-4">
          <div className="container mx-auto max-w-6xl text-right text-white">
            <div className="flex gap-2 justify-end mb-4">
              <span className="inline-block bg-[#D4AF37] text-white text-sm font-bold px-3 py-1 rounded-full">
                يُقدم: {servingText}
              </span>
              <span className="inline-block bg-[#cd4f3c] text-white text-sm font-bold px-3 py-1 rounded-full">
                {restaurant.cuisine}
              </span>
            </div>
            <h1 className="text-5xl font-extrabold mb-4">{restaurant.name}</h1>
            <div className="flex flex-wrap items-center justify-end gap-6 text-sm font-medium opacity-90">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt />
                <span>{restaurant.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock />
                <span>{restaurant.opening_hours}</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-400">
                <FaStar />
                <span>{restaurant.rating} / 5 ({restaurant.reviews_count} تقييم)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto max-w-6xl px-4 -mt-8 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 text-right" dir="rtl">
        {/* About Restaurant */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-[#14213d] mb-4">عن المطعم</h2>
            <p className="text-gray-600 leading-relaxed max-w-2xl text-lg">
              {restaurant.description}
            </p>
          </div>

          {/* Menus Section (Moved from general page) */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-[#14213d] mb-8 text-center">أقسام المنيو الخاصة بالمطعم</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
              {categories.map((item) => (
                <Link 
                  to={`/restaurants/menu/${item.id}`}
                  state={{ restaurantId: restaurant.id, restaurantName: restaurant.name, categories: categories }}
                  key={item.id} 
                  className="border border-gray-100 hover:border-[#D4AF37] rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center bg-[#fdfaf7] block group"
                >
                  <div className="w-14 h-14 mx-auto bg-white rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm md:text-base">{item.title}</h3>
                  <span className="text-xs text-gray-500 mt-1 block">{item.enTitle}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reservation Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-24">
            <h3 className="text-xl font-bold text-[#14213d] mb-4">معلومات الحجز</h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-3">
                <div className="mt-1 text-[#cd4f3c]"><FaMoneyBillWave /></div>
                <div>
                  <span className="block font-medium text-gray-800 text-sm">متوسط الأسعار</span>
                  <span className="text-gray-500 text-sm">{restaurant.price_range_min} - {restaurant.price_range_max} ج.م للوجبة</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 text-[#cd4f3c]"><FaMapMarkerAlt /></div>
                <div>
                  <span className="block font-medium text-gray-800 text-sm">التوصيل (Delivery)</span>
                  <span className="text-gray-500 text-sm">متاح لجميع مناطق المحافظة عبر التطبيقات</span>
                </div>
              </li>
            </ul>
            <button onClick={handleTableBooking} className="w-full bg-[#14213d] hover:bg-[#D4AF37] text-white py-3.5 rounded-xl font-bold transition-colors shadow-md">
              احجز طاولة الآن
            </button>
            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <p className="text-sm font-medium text-gray-500 mb-3">أو اطلب ديليفري فوراً</p>
              <div className="flex flex-wrap gap-2 justify-center" dir="ltr">
                {["Talabat", "Elmenus"].map((app, index) => (
                  <span key={index} className="px-3 py-1.5 bg-gray-100 rounded-md text-xs font-bold text-gray-700">{app}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailsPage;
