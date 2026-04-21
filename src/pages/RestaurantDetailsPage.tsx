import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { FaStar, FaMapMarkerAlt, FaClock, FaMoneyBillWave } from "react-icons/fa";
import { getRestaurants } from "@/api/restaurantService";

const RestaurantDetailsPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  let categories = [
    { title: "الإفطار", id: "breakfast", icon: "☕", enTitle: "Breakfast" },
    { title: "الأطباق الرئيسية", id: "main-dishes", icon: "🍜", enTitle: "Main Dishes" },
    { title: "المشروبات", id: "drinks", icon: "🍹", enTitle: "Drinks" },
    { title: "الحلويات", id: "desserts", icon: "🍰", enTitle: "Desserts" },
  ];

  const cuisineLc = (restaurant.cuisine || "").toLowerCase();
  const nameLc = (restaurant.name || "").toLowerCase();

  const isSeafood = cuisineLc.includes("seafood") && !cuisineLc.includes("grills");
  const isGrills = (cuisineLc.includes("grills") && !cuisineLc.includes("seafood")) || nameLc.includes("مشويات") || nameLc.includes("prince") || nameLc.includes("kababgy") || nameLc.includes("shakra");
  const isGrillsAndSeafood = cuisineLc.includes("grills") && cuisineLc.includes("seafood");
  const isKoshary = cuisineLc.includes("koshary") || cuisineLc.includes("fast food") || nameLc.includes("كشري") || nameLc.includes("tariq");
  const isSofra = nameLc.includes("sofra") || nameLc.includes("سفرة") || nameLc.includes("صوفرا");
  const isStreetFood = nameLc.includes("felfela") || nameLc.includes("gad") || cuisineLc.includes("street") || nameLc.includes("فلفلة");
  const isTraditional = cuisineLc.includes("egyptian") || cuisineLc.includes("traditional") || cuisineLc.includes("authentic") || nameLc.includes("abou el sid") || nameLc.includes("dar darak");
  const isBedouin = cuisineLc.includes("bedouin") || cuisineLc.includes("fayoumi") || nameLc.includes("tunis") || nameLc.includes("rayan");

  const isChinese = cuisineLc.includes("chinese") || cuisineLc.includes("asian");
  const isIndian = cuisineLc.includes("indian");
  const isKorean = cuisineLc.includes("korean");
  const isTurkish = cuisineLc.includes("turkish");
  const isItalian = cuisineLc.includes("italian") || cuisineLc.includes("pizza") || cuisineLc.includes("pasta");
  const isMexican = cuisineLc.includes("mexican") || cuisineLc.includes("latin");

  if (isSeafood || nameLc.includes("kadoura") || nameLc.includes("قدورة") || nameLc.includes("fares")) {
    categories = [
      { title: "أسماك طازجة", id: "seafood", icon: "🐟", enTitle: "Fresh Fish" },
      { title: "جمبري وسي فود", id: "shrimp", icon: "🦐", enTitle: "Shrimp & Seafood" },
      { title: "أرز ومقبلات", id: "seafood-rice", icon: "🍚", enTitle: "Rice & Apps" },
      { title: "المشروبات", id: "drinks", icon: "🍹", enTitle: "Drinks" },
    ];
  } else if (isGrills || nameLc.includes("masrien") || nameLc.includes("المصريين")) {
    categories = [
      { title: "مشويات على الفحم", id: "grills-category", icon: "🥩", enTitle: "Charcoal Grills" },
      { title: "طواجن شرقية", id: "tagines", icon: "🥘", enTitle: "Oriental Tagines" },
      { title: "مقبلات وسلطات", id: "salads", icon: "🥗", enTitle: "Salads & Apps" },
      { title: "المشروبات", id: "drinks", icon: "🍹", enTitle: "Drinks" },
    ];
  } else if (isGrillsAndSeafood || nameLc.includes("balbaa") || nameLc.includes("بلبع")) {
    categories = [
      { title: "سلطات ومقبلات", id: "salads", icon: "🥗", enTitle: "Salads & Apps" },
      { title: "مشويات على الفحم", id: "grills-category", icon: "🥩", enTitle: "Charcoal Grills" },
      { title: "أسماك طازجة", id: "seafood", icon: "🐟", enTitle: "Fresh Fish" },
      { title: "المشروبات", id: "drinks", icon: "🍹", enTitle: "Drinks" },
    ];
  } else if (isKoshary) {
    categories = [
      { title: "كشري وطواجن", id: "koshary-meals", icon: "🍲", enTitle: "Main Koshary" },
      { title: "إضافات مكملة", id: "extras", icon: "🌶️", enTitle: "Extras & Sides" },
      { title: "الحلويات", id: "desserts", icon: "🍰", enTitle: "Desserts" },
      { title: "المشروبات", id: "drinks", icon: "🍹", enTitle: "Drinks" },
    ];
  } else if (isSofra || isTraditional) {
    categories = [
      { title: "محاشي وممبار", id: "stuffed", icon: "🫔", enTitle: "Stuffed Veggies" },
      { title: "طواجن شرقية", id: "tagines", icon: "🥘", enTitle: "Oriental Tagines" },
      { title: "حمام وبط", id: "birds", icon: "🦆", enTitle: "Local Birds" },
      { title: "مشروبات تراثية", id: "traditional-drinks", icon: "☕", enTitle: "Local Drinks" },
    ];
  } else if (isStreetFood) {
    categories = [
      { title: "فطار مصري", id: "breakfast", icon: "🧆", enTitle: "Local Breakfast" },
      { title: "ساندوتشات", id: "sandwiches", icon: "🥙", enTitle: "Sandwiches" },
      { title: "أطباق شرقية", id: "main-dishes", icon: "🍲", enTitle: "Oriental Plates" },
      { title: "عصائر فريش", id: "drinks", icon: "🍹", enTitle: "Fresh Juices" },
    ];
  } else if (isBedouin) {
    categories = [
      { title: "مندي ولحم ضأن", id: "mandi", icon: "🍖", enTitle: "Mandi & Lamb" },
      { title: "دجاج زرب", id: "zarb", icon: "🍗", enTitle: "Buried Chicken" },
      { title: "مقبلات بدوي", id: "bedouin-bread", icon: "🫓", enTitle: "Bedouin Apps" },
      { title: "شاي وقهوة", id: "bedouin-tea", icon: "🫖", enTitle: "Bedouin Tea" },
    ];
  } else if (isItalian) {
    categories = [
      { title: "أطباق إيطالية", id: "italian", icon: "🍕", enTitle: "Italian Dishes" },
      { title: "أطباق رئيسية", id: "main-dishes", icon: "🍲", enTitle: "Main Dishes" },
      { title: "مقبلات وسلطات", id: "salads", icon: "🥗", enTitle: "Salads & Apps" },
      { title: "مشروبات", id: "drinks", icon: "🍹", enTitle: "Drinks" },
    ];
  } else if (isChinese) {
    categories = [
      { title: "أطباق صينية", id: "chinese", icon: "🍜", enTitle: "Chinese Dishes" },
      { title: "أطباق رئيسية", id: "main-dishes", icon: "🍲", enTitle: "Main Dishes" },
      { title: "الحلويات", id: "desserts", icon: "🍰", enTitle: "Desserts" },
      { title: "مشروبات", id: "drinks", icon: "🍹", enTitle: "Drinks" },
    ];
  } else if (isIndian) {
    categories = [
      { title: "أطباق هندية", id: "indian", icon: "🍛", enTitle: "Indian Dishes" },
      { title: "أطباق رئيسية", id: "main-dishes", icon: "🍲", enTitle: "Main Dishes" },
      { title: "الحلويات", id: "desserts", icon: "🍰", enTitle: "Desserts" },
      { title: "مشروبات", id: "drinks", icon: "🍹", enTitle: "Drinks" },
    ];
  } else if (isKorean) {
    categories = [
      { title: "أطباق كورية", id: "korean", icon: "🥢", enTitle: "Korean Dishes" },
      { title: "مقبلات وسلطات", id: "salads", icon: "🥗", enTitle: "Salads & Apps" },
      { title: "الحلويات", id: "desserts", icon: "🍰", enTitle: "Desserts" },
      { title: "مشروبات", id: "drinks", icon: "🍹", enTitle: "Drinks" },
    ];
  } else if (isTurkish) {
    categories = [
      { title: "أطباق تركية", id: "turkish", icon: "🥙", enTitle: "Turkish Dishes" },
      { title: "مشويات", id: "grills-category", icon: "🥩", enTitle: "Grills" },
      { title: "الحلويات", id: "desserts", icon: "🍰", enTitle: "Desserts" },
      { title: "مشروبات", id: "drinks", icon: "🍹", enTitle: "Drinks" },
    ];
  } else if (isMexican) {
    categories = [
      { title: "أطباق مكسيكية", id: "mexican", icon: "🌮", enTitle: "Mexican Dishes" },
      { title: "مقبلات وسلطات", id: "salads", icon: "🥗", enTitle: "Salads & Apps" },
      { title: "الحلويات", id: "desserts", icon: "🍰", enTitle: "Desserts" },
      { title: "مشروبات", id: "drinks", icon: "🍹", enTitle: "Drinks" },
    ];
  }

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
            <span className="inline-block bg-[#cd4f3c] text-white text-sm font-bold px-3 py-1 rounded-full mb-4">
              {restaurant.cuisine}
            </span>
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
                  state={{ restaurantId: restaurant.id, restaurantName: restaurant.name }}
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
            <button className="w-full bg-[#14213d] hover:bg-[#D4AF37] text-white py-3.5 rounded-xl font-bold transition-colors shadow-md">
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
