import PriceDisplay from "../components/common/PriceDisplay";
import { useState, useEffect } from "react";
import { FaRobot, FaCalendarAlt, FaUsers, FaMoneyBillWave, FaMapMarkedAlt, FaMagic, FaCheckCircle, FaStar, FaHotel, FaUtensils, FaLandmark, FaBus, FaShoppingBag } from "react-icons/fa";
import Button from "../components/Ui/Button";
import Input from "../components/Ui/Input";
import DateTimePicker from "@/components/Ui/DateTimePicker";
import { getHotels } from "../api/tripService";
import { getTours } from "../api/tourService";
import { getTransportationList } from "../api/transportationService";
import { Link } from "react-router-dom";

import axiosClient from "../api/axiosClient";
import { useApp } from "../context/AppContext";

// ============ COMPONENT ============
const AITripPlannerPage = () => {
  const [hotelsData, setHotelsData] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState("All Locations");
  const uniqueCities = ["All Locations", ...new Set(hotelsData.map((item: any) => item.location || item.city).filter(Boolean))];
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

  const { showToast } = useApp();

  const handleGenerate = async (e: React.FormEvent) => {
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
    }, 1500);

    try {
      // Calculate days
      let days = 3;
      if (formData.startDate && formData.endDate) {
        const diff = Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24));
        if (diff > 0) days = Math.min(diff, 7);
      }

      const res = await axiosClient.post('/trip-planner/generate', {
         destination: formData.destination,
         budget: Number(formData.budget) || 2000,
         days: days,
         adults: Number(formData.adults) || 1,
         children: Number(formData.children) || 0,
         vibe: formData.vibe
      });
      
      setResult(res.data);
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.error || "حدث خطأ أثناء بناء الرحلة بالذكاء الاصطناعي. الرجاء المحاولة مرة أخرى.", true);
    } finally {
       clearInterval(interval);
       setIsGenerating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const filteredHotelsData = hotelsData.filter((item: any) => selectedCity === "All Locations" || (item.location || item.city) === selectedCity);
  return (
    <div className="min-h-screen bg-gray-50 pt-[70px] pb-6 overflow-x-hidden">
      
      {/* Header Banner */}
      <div className="bg-[#05073C] py-4 px-4 relative overflow-hidden mb-4">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm border border-white/20">
             <FaRobot className="text-[#D4AF37] text-3xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-1">
            مخطط الرحلات الذكي <span className="text-[#D4AF37]">✨</span>
          </h1>
          <p className="text-gray-300 text-sm max-w-2xl mx-auto leading-relaxed">
            حدد وجهتك وميزانيتك ومدة الرحلة وسيقوم نظامنا الذكي ببناء رحلة كاملة من فنادق ومطاعم ومتاحف وجولات من بياناتنا الفعلية
          </p>
        </div>
        <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-[#D4AF37]/20 blur-[120px] rounded-full point-events-none" />
        <div className="absolute bottom-[-50%] right-[-10%] w-96 h-96 bg-[#EB662B]/20 blur-[120px] rounded-full point-events-none" />
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form Column */}
        <div className="lg:col-span-5">
          <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 sticky top-24">
            <h3 className="text-xl font-bold text-[#05073C] mb-4 flex items-center gap-2">
              <FaMagic className="text-[#D4AF37]" /> تفضيلاتك
            </h3>
            
            <form onSubmit={handleGenerate} className="space-y-3">
              
              {/* Destination */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                   <FaMapMarkedAlt className="text-gray-400" /> الوجهة
                </label>
                <select 
                  name="destination"
                  value={formData.destination} 
                  onChange={handleChange}
                  className="w-full h-10 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all font-medium text-gray-700"
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                      <FaUsers className="text-gray-400" /> بالغين
                    </label>
                    <Input type="number" name="adults" min="1" value={formData.adults} onChange={handleChange} required />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">أطفال</label>
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
                <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                   <FaMoneyBillWave className="text-gray-400" /> الميزانية الإجمالية ($)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                  <Input type="number" name="budget" placeholder="مثال: 2500" className="pl-8" value={formData.budget} onChange={handleChange} required />
                </div>
              </div>

               {/* Vibe */}
               <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                   <FaStar className="text-gray-400" /> نوع الرحلة
                </label>
                <select 
                  name="vibe"
                  value={formData.vibe} 
                  onChange={handleChange}
                  className="w-full h-10 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all font-bold text-gray-700 text-sm"
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
                className="w-full py-4 mt-2 bg-[#05073C] hover:bg-[#1A365D] text-white font-black text-lg rounded-xl shadow-[0_10px_20px_rgba(5,7,60,0.2)] hover:shadow-[0_15px_30px_rgba(212,175,55,0.3)] border-2 border-transparent hover:border-[#D4AF37] hover:-translate-y-1 transition-all duration-300"
                disabled={isGenerating}
              >
                {isGenerating ? "جاري التخطيط..." : "ابدأ تخطيط الرحلة ✨"}
              </Button>
            </form>
          </div>
        </div>

        {/* Result Column */}
        <div className="lg:col-span-7">
          
          {/* Default Empty State */}
          {!isGenerating && !result && (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-white/50 rounded-3xl border border-dashed border-gray-300 min-h-[500px]">
               <div className="w-24 h-24 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-6">
                 <FaRobot className="text-[#D4AF37] text-4xl opacity-50" />
               </div>
               <h3 className="text-2xl font-bold text-gray-400 mb-1">في انتظار بياناتك</h3>
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
               <h3 className="text-2xl font-extrabold text-[#05073C] mb-1">النظام يعمل...</h3>
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
                          <p className="font-bold text-lg"><PriceDisplay price={Number(result.totalCost)} /></p>
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
                          <div className="flex items-center gap-1 text-yellow-500 text-xs mb-1">
                             <FaStar/><FaStar/><FaStar/><FaStar/><FaStar/> <span className="text-gray-500 ml-1">({result.hotel.rating})</span>
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#EB662B] transition-colors">{result.hotel.name}</h4>
                          <p className="text-sm text-gray-500 mt-1 mb-4">{result.hotel.city || result.destination} • مطابق لتفضيلاتك</p>
                          <div className="font-black text-[#05073C]"><PriceDisplay price={Number(result.hotel.price)} /> <span className="text-xs text-gray-400 font-medium">/ليلة</span></div>
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
                         <div className="font-bold text-[#EB662B]"><PriceDisplay price={Number(result.transport.price)} /></div>
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
