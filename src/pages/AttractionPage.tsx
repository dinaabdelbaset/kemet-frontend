import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaStar, FaClock, FaTicketAlt, FaChevronRight, FaCalendarAlt, FaUsers, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import { getAttraction } from "../api/contentService";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const AttractionPage = () => {
  const { destination = "" } = useParams();
  const navigate = useNavigate();
  const [attraction, setAttraction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttraction = async () => {
      try {
        setIsLoading(true);
        const data = await getAttraction(destination);
        setAttraction(data);
      } catch (error) {
        console.error('Error fetching attraction:', error);
        setAttraction(null);
      } finally {
        setIsLoading(false);
      }
    };
    if (destination) fetchAttraction();
  }, [destination]);

  const [selectedTickets, setSelectedTickets] = useState<Record<number, number>>({});
  const [visitDate, setVisitDate] = useState("");
  const [booked, setBooked] = useState(false);

  useDocumentTitle(attraction ? attraction.nameAr : "Attraction Not Found");

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#D4AF37]"></div>
      </div>
    );
  }

  if (!attraction) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#05073C] text-white gap-4">
        <h1 className="text-3xl font-black">المكان غير موجود</h1>
        <Link to="/" className="px-6 py-3 bg-[#EB662B] rounded-xl font-bold">العودة للرئيسية</Link>
      </div>
    );
  }

  const totalTickets = Object.entries(selectedTickets).reduce((sum, [idx, qty]) => {
    const price = attraction.ticketPrices[Number(idx)];
    return sum + (price ? price.price * qty : 0);
  }, 0);

  const totalCount = Object.values(selectedTickets).reduce((a, b) => a + b, 0);
  const currency = attraction.ticketPrices[0]?.currency || "USD";

  const handleBook = () => {
    if (!visitDate || totalCount === 0) return;
    
    // Redirect to the unified checkout system with attraction details
    navigate('/checkout', { 
      state: { 
        id: (attraction as any).id || Math.floor(Math.random() * 1000), 
        type: "attraction", 
        title: attraction.nameAr, 
        price: attraction.ticketPrices[0]?.price || 0, 
        image: attraction.image 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d0d1a]">

      {/* ── Hero ── */}
      <div className="relative h-[65vh] md:h-[70vh] overflow-hidden">
        <img
          src={attraction.image}
          alt={attraction.nameAr}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

        {/* Breadcrumb */}
        <nav className="absolute top-24 left-6 flex items-center gap-2 text-white/70 text-sm z-10">
          <Link to="/" className="hover:text-white transition">الرئيسية</Link>
          <FaChevronRight className="text-xs" />
          <span className="text-white font-semibold">{attraction.nameAr}</span>
        </nav>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 p-8 md:p-14 max-w-3xl z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] font-black uppercase tracking-widest">
              {attraction.eraAr}
            </span>
            <span className="text-white/50 text-sm flex items-center gap-1">
              <FaMapMarkerAlt className="text-[#EB662B]" /> {attraction.location}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-3">
            {attraction.nameAr}
          </h1>
          <p className="text-white/60 text-sm md:text-base">{attraction.name}</p>

          {/* Rating */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <FaStar className="text-[#D4AF37] text-sm" />
              <span className="text-white font-black">{attraction.rating}</span>
              <span className="text-white/50 text-sm">({attraction.reviews.toLocaleString()} تقييم)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <FaClock className="text-white/70 text-sm" />
              <span className="text-white/80 text-sm">{attraction.duration}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Left column: Details */}
        <div className="lg:col-span-2 space-y-10">

          {/* Description */}
          <section className="bg-white dark:bg-white/5 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-white/10">
            <h2 className="text-xl font-black text-[#05073C] dark:text-white mb-4">عن المكان</h2>
            <p className="text-gray-500 dark:text-white/60 leading-relaxed text-sm md:text-base">
              {attraction.longDescription}
            </p>
          </section>

          {/* Highlights */}
          <section className="bg-white dark:bg-white/5 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-white/10">
            <h2 className="text-xl font-black text-[#05073C] dark:text-white mb-5">أبرز المعالم</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {attraction.highlights.map((h: any, i: any) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-3 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/15"
                >
                  <FaCheckCircle className="text-[#D4AF37] shrink-0 text-sm" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-white/80">{h}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Info grid */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: FaClock, label: "مواعيد العمل", value: attraction.openingHours, color: "#EB662B" },
              { icon: FaCalendarAlt, label: "أفضل وقت للزيارة", value: attraction.bestTime, color: "#D4AF37" },
              { icon: FaUsers, label: "مدة الزيارة", value: attraction.duration, color: "#4caf82" },
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <item.icon style={{ color: item.color }} className="text-sm" />
                  <span className="text-[11px] uppercase tracking-widest font-black text-gray-400 dark:text-white/40">{item.label}</span>
                </div>
                <p className="text-sm font-semibold text-gray-700 dark:text-white/80 leading-relaxed">{item.value}</p>
              </div>
            ))}
          </section>

          {/* Tips */}
          <section className="bg-gradient-to-br from-[#D4AF37]/10 to-[#EB662B]/5 rounded-2xl p-6 md:p-8 border border-[#D4AF37]/20">
            <h2 className="text-xl font-black text-[#05073C] dark:text-white mb-4">💡 نصائح للزيارة</h2>
            <ul className="space-y-3">
              {attraction.tips.map((tip: any, i: any) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-white/70">
                  <span className="text-[#D4AF37] font-black shrink-0">{i + 1}.</span>
                  {tip}
                </li>
              ))}
            </ul>
          </section>

          {/* Gallery */}
          {attraction.gallery.length > 0 && (
            <section>
              <h2 className="text-xl font-black text-[#05073C] dark:text-white mb-4">الصور</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {attraction.gallery.map((img: any, i: any) => (
                  <div key={i} className="rounded-xl overflow-hidden aspect-video">
                    <img src={img} alt="" className="w-full h-full object-cover hover:scale-110 transition duration-500" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ── Right column: Ticket Booking ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">

            {/* Booking card */}
            {!booked ? (
              <div className="bg-white dark:bg-[#0f1020] rounded-2xl border border-gray-100 dark:border-white/10 shadow-xl overflow-hidden">
                {/* Card header */}
                <div className="bg-gradient-to-r from-[#05073C] to-[#0d1545] p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <FaTicketAlt className="text-[#D4AF37]" />
                    <span className="text-[#D4AF37] text-[11px] font-black uppercase tracking-widest">احجز تذكرتك</span>
                  </div>
                  <h3 className="text-white font-black text-lg">{attraction.nameAr}</h3>
                  <p className="text-white/40 text-xs mt-1">اختر نوع التذكرة وتاريخ الزيارة</p>
                </div>

                <div className="p-6 space-y-5">
                  {/* Date picker */}
                  <div>
                    <label className="block text-xs font-black text-gray-500 dark:text-white/50 uppercase tracking-widest mb-2">
                      📅 تاريخ الزيارة
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-white text-sm font-semibold focus:outline-none focus:border-[#D4AF37] transition"
                    />
                  </div>

                  {/* Ticket types */}
                  <div>
                    <label className="block text-xs font-black text-gray-500 dark:text-white/50 uppercase tracking-widest mb-3">
                      🎫 أنواع التذاكر
                    </label>
                    <div className="space-y-3">
                      {attraction.ticketPrices.map((ticket: any, idx: any) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 dark:border-white/8 hover:border-[#D4AF37]/40 transition bg-gray-50/50 dark:bg-white/3"
                        >
                          <div className="flex-1 min-w-0 mr-3">
                            <p className="text-sm font-bold text-gray-700 dark:text-white truncate">{ticket.type}</p>
                            <p className="text-[11px] text-gray-400 dark:text-white/40 mt-0.5">{ticket.desc}</p>
                            <p className="text-[#EB662B] font-black text-sm mt-1">
                              {ticket.price === 0 ? "مجاني" : `${ticket.price} ${ticket.currency}`}
                            </p>
                          </div>
                          {/* Counter */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => setSelectedTickets(prev => ({ ...prev, [idx]: Math.max(0, (prev[idx] || 0) - 1) }))}
                              className="w-7 h-7 rounded-full border border-gray-200 dark:border-white/20 text-gray-500 dark:text-white hover:bg-[#EB662B] hover:text-white hover:border-[#EB662B] transition font-bold text-sm"
                            >-</button>
                            <span className="w-5 text-center text-sm font-black text-gray-700 dark:text-white">
                              {selectedTickets[idx] || 0}
                            </span>
                            <button
                              onClick={() => setSelectedTickets(prev => ({ ...prev, [idx]: (prev[idx] || 0) + 1 }))}
                              className="w-7 h-7 rounded-full border border-gray-200 dark:border-white/20 text-gray-500 dark:text-white hover:bg-[#D4AF37] hover:text-white hover:border-[#D4AF37] transition font-bold text-sm"
                            >+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  {totalCount > 0 && (
                    <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-white/10">
                      <span className="text-sm text-gray-500 dark:text-white/50 font-medium">
                        المجموع ({totalCount} تذكرة)
                      </span>
                      <span className="text-xl font-black text-[#05073C] dark:text-white">
                        {totalTickets} {currency}
                      </span>
                    </div>
                  )}

                  {/* Book button */}
                  <button
                    onClick={handleBook}
                    disabled={!visitDate || totalCount === 0}
                    className="w-full py-4 rounded-xl font-extrabold text-sm transition-all duration-300
                      bg-gradient-to-r from-[#D4AF37] to-[#EB662B] text-white
                      hover:shadow-[0_10px_30px_rgba(235,102,43,0.4)] hover:-translate-y-0.5
                      disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    {!visitDate ? "اختر تاريخ الزيارة" : totalCount === 0 ? "اختر عدد التذاكر" : `احجز الآن — ${totalTickets} ${currency}`}
                  </button>

                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-4 pt-1">
                    <div className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-white/30">
                      <FaShieldAlt className="text-[#4caf82]" /> حجز آمن
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-white/30">
                      <FaCheckCircle className="text-[#4caf82]" /> تأكيد فوري
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Success state */
              <div className="bg-white dark:bg-[#0f1020] rounded-2xl border border-[#4caf82]/30 shadow-xl overflow-hidden text-center p-8">
                <div className="w-16 h-16 rounded-full bg-[#4caf82]/10 flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-[#4caf82] text-3xl" />
                </div>
                <h3 className="text-xl font-black text-[#05073C] dark:text-white mb-2">تم الحجز بنجاح! 🎉</h3>
                <p className="text-gray-500 dark:text-white/50 text-sm mb-2">
                  {totalCount} تذكرة لـ <strong className="text-[#D4AF37]">{attraction.nameAr}</strong>
                </p>
                <p className="text-gray-500 dark:text-white/50 text-sm mb-6">
                  تاريخ الزيارة: <strong className="text-[#EB662B]">{visitDate}</strong>
                </p>
                <p className="text-xl font-black text-[#05073C] dark:text-white mb-6">
                  المجموع: {totalTickets} {currency}
                </p>
                <div className="space-y-3">
                  <Link
                    to="/bookings"
                    className="block w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#EB662B] text-white font-bold text-sm"
                  >
                    عرض حجوزاتي
                  </Link>
                  <button
                    onClick={() => { setBooked(false); setSelectedTickets({}); setVisitDate(""); }}
                    className="block w-full py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/60 font-medium text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition"
                  >
                    حجز آخر
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttractionPage;
