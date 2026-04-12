import { useSearchParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import SectionWrapper from "../components/sections/SectionWrapper";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { globalSearch } from "../api/searchService";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  useDocumentTitle(query ? `Search: ${query}` : "Search Results");

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const doSearch = async () => {
      if (!query) {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const data = await globalSearch(query);
        
        // Normalize results from multiple categories
        const results: any[] = [];
        
        // Static internal pages logic
        const pagesKeywords = [
          { title: "المخطط الذكي (AI Planner)", path: "/ai-planner", keywords: ["ذكاء اصطناعي", "مخطط", "ai", "planner", "chat", "شات"], icon: "✨" },
          { title: "متجر الهدايا والبازارات", path: "/bazaars", keywords: ["متجر", "هدايا", "منتجات", "shop", "store", "bazaar", "بازار", "بازارات", "souvenirs", "تسوق"], icon: "🛍️" },
          { title: "حجوزاتي", path: "/bookings", keywords: ["حجوزاتي", "bookings", "حجوزات"], icon: "📅" },
          { title: "المفضلة", path: "/wishlist", keywords: ["المفضلة", "wishlist", "قلب"], icon: "❤️" },
          { title: "الملف الشخصي", path: "/profile", keywords: ["الحساب", "profile", "الملف الشخصي", "حسابي"], icon: "👤" },
          { title: "سلة المشتريات", path: "/shop-checkout", keywords: ["السلة", "مشتريات", "cart", "عربة", "دفع"], icon: "🛒" },
          { title: "تسجيل الدخول / خروج", path: "/login", keywords: ["دخول", "تسجيل", "login", "sign in", "حساب"], icon: "🔑" },
          { title: "لوحة التحكم", path: "/dashboard", keywords: ["لوحة", "تحكم", "dashboard", "ادارة"], icon: "📊" },
          { title: "المواصلات", path: "/transportation", keywords: ["مواصلات", "تنقل", "سيارات", "نقل", "transport", "transportation", "bus"], icon: "🚌" },
          { title: "باقات السفر", path: "/packages", keywords: ["باقات", "عروض", "سفر", "packages", "travel"], icon: "📦" },
          { title: "تذاكر الطيران", path: "/flights", keywords: ["طيران", "تذاكر", "مطار", "flights", "flight"], icon: "✈️" },
          { title: "تواصل معنا (الدعم)", path: "/support", keywords: ["دعم", "تواصل", "support", "contact", "اتصل", "مساعدة"], icon: "📞" },
        ];

        const lowerQuery = query.toLowerCase();
        pagesKeywords.forEach(p => {
          if (p.title.toLowerCase().includes(lowerQuery) || p.keywords.some(k => lowerQuery.includes(k) || k.includes(lowerQuery))) {
            results.push({
              id: `page-${p.path}`,
              title: p.title,
              image: "https://images.unsplash.com/photo-1551244072-5d12891562da?auto=format&fit=crop&w=400&q=80",
              category: "Quick Link",
              categoryAr: "رابط سريع",
              rating: "5.0",
              reviews: 0,
              location: "صفحات وميزات الموقع",
              price: p.icon,
              linkTo: p.path
            });
          }
        });

        if (data.hotels && Array.isArray(data.hotels)) {
          data.hotels.forEach((h: any) => results.push({
            id: `hotel-${h.id}`, title: h.title || h.name, image: h.image,
            category: "Hotel", categoryAr: "فندق", rating: h.rating, reviews: h.reviews_count,
            location: h.location, price: `$${h.price_starts_from || h.price}`, linkTo: `/hotels/${h.id}`
          }));
        }
        if (data.tours && Array.isArray(data.tours)) {
          data.tours.forEach((t: any) => results.push({
            id: `tour-${t.id}`, title: t.title, image: t.image,
            category: "Tour", categoryAr: "جولة", rating: t.rating, reviews: t.reviewCount,
            location: t.location, price: `$${t.price}`, linkTo: `/tours/${t.id}`
          }));
        }
        if (data.restaurants && Array.isArray(data.restaurants)) {
          data.restaurants.forEach((r: any) => results.push({
            id: `rest-${r.id}`, title: r.title || r.name, image: r.image,
            category: "Restaurant", categoryAr: "مطعم", rating: r.rating, reviews: r.reviews_count,
            location: r.location, price: r.price_range || "$$", linkTo: `/restaurants/${r.id}`
          }));
        }
        if (data.events && Array.isArray(data.events)) {
          data.events.forEach((e: any) => results.push({
            id: `event-${e.id}`, title: e.title, image: e.image,
            category: "Event", categoryAr: "فعالية", rating: e.rating || 4.7, reviews: 0,
            location: e.location, price: e.price || "Free", linkTo: `/events/${e.id}`
          }));
        }
        if (data.museums && Array.isArray(data.museums)) {
          data.museums.forEach((m: any) => results.push({
            id: `museum-${m.id}`, title: m.title, image: m.image,
            category: "Museum", categoryAr: "متحف", rating: m.rating || 4.8, reviews: 0,
            location: m.location, price: m.ticket_price ? `${m.ticket_price} EGP` : "Free", linkTo: `/museums/${m.id}`
          }));
        }
        if (data.safaris && Array.isArray(data.safaris)) {
          data.safaris.forEach((s: any) => results.push({
            id: `safari-${s.id}`, title: s.title, image: s.image,
            category: "Safari", categoryAr: "سفاري", rating: s.rating || 4.9, reviews: 0,
            location: s.location, price: `$${s.price}`, linkTo: `/safari/${s.id}`
          }));
        }
        if (data.destinations && Array.isArray(data.destinations)) {
          data.destinations.forEach((d: any) => results.push({
            id: `dest-${d.id}`, title: d.title, image: d.image,
            category: "Destination", categoryAr: "وجهة", rating: 4.7, reviews: d.tours || 0,
            location: "Egypt", price: `${d.tours || 0} tours`, linkTo: `/explore/${d.title}`
          }));
        }
        
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    doSearch();
  }, [query]);

  return (
    <div className="min-h-screen bg-[#fcfbf9] pt-24 pb-16">
      <SectionWrapper className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-[#05073C] mb-3">
            نتائج البحث
          </h1>
          <p className="text-gray-500 text-lg">
            {isLoading 
              ? "جاري البحث..."
              : searchResults.length > 0 
                ? `تم العثور على ${searchResults.length} نتيجة لـ "${searchParams.get("q")}"`
                : `لم يتم العثور على نتائج لـ "${searchParams.get("q")}"`}
          </p>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EB662B]"></div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {searchResults.map((item) => (
              <Link
                key={item.id}
                to={item.linkTo}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group flex flex-col border border-gray-100"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-lg text-sm font-bold shadow-sm text-[#05073C]">
                    ★ {item.rating}{" "}
                    {item.reviews > 0 && (
                      <span className="text-gray-500 font-normal">
                        ({item.reviews})
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="text-xs text-[#EB662B] font-bold mb-1 uppercase tracking-wider">
                    {item.categoryAr} • {item.category}
                  </div>
                  <h3 className="text-lg font-bold text-[#05073C] mb-2 leading-tight group-hover:text-[#EB662B] transition line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="text-sm text-gray-500 flex items-center gap-1 mb-4 line-clamp-1">
                    <FaMapMarkerAlt className="text-[#EB662B] shrink-0" />
                    {item.location}
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-lg font-black text-[#05073C]">
                      {item.price}
                    </span>
                    <span className="text-sm bg-[#05073C] text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition">
                      عرض التفاصيل
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <FaSearch className="text-3xl text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-[#05073C] mb-2">
              لم يتم العثور على نتائج
            </h2>
            <p className="text-gray-500 max-w-md">
              لم نجد أي شيء يطابق بحثك "{searchParams.get("q")}". حاول التحقق من تهجئتك أو البحث عن مصطلح أوسع مثل "القاهرة" أو "فندق" أو "سفاري".
            </p>
            <Link to="/" className="mt-8 bg-[#EB662B] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#d55822] transition shadow-md">
              استكشف الوجهات الشهيرة
            </Link>
          </div>
        )}
      </SectionWrapper>
    </div>
  );
};

export default SearchPage;
