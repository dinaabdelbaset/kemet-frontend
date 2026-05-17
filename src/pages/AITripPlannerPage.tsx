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
    adults: "3",
    children: "0",
    startDate: "",
    endDate: "",
    budget: "",
    currency: "USD",
    vibe: "Surprise Me 🎁",
    destination: "Cairo",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<any>(null);

  const loadingMessages = [
    "Analyzing your preferences...",
    "Searching database for best options...",
    "Organizing the perfect itinerary...",
    "Preparing your comprehensive trip plan...",
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
         currency: formData.currency,
         days: days,
         adults: Number(formData.adults) || 1,
         children: Number(formData.children) || 0,
         vibe: formData.vibe
      });
      
      setResult(res.data);
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.error || "An error occurred while generating the AI trip. Please try again.", true);
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
      <div className="bg-[#05073C] py-14 px-4 relative overflow-hidden mb-8 shadow-xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-3xl mb-5 backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
             <FaMagic className="text-[#D4AF37] text-4xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-md">
            Smart AI Trip Planner ✨
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Let our advanced artificial intelligence engine craft your perfect Egyptian itinerary in seconds based on real-time data and availability.
          </p>
        </div>
        <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-[#D4AF37]/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#EB662B]/20 blur-[100px] rounded-full pointer-events-none" />
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form Column */}
        <div className="lg:col-span-5">
          <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 sticky top-24">
            <h3 className="text-xl font-bold text-[#05073C] mb-4 flex items-center gap-2">
              <FaMagic className="text-[#D4AF37]" /> Your Preferences
            </h3>
            
            <form onSubmit={handleGenerate} className="space-y-3">
              
              {/* Destination */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                   <FaMapMarkedAlt className="text-gray-400" /> Destination
                </label>
                <select 
                  name="destination"
                  value={formData.destination} 
                  onChange={handleChange}
                  className="w-full h-10 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all font-medium text-gray-700"
                >
                  {![ "Cairo", "Luxor", "Aswan", "Sharm", "Hurghada", "Alexandria", "Dahab", "MarsaAlam", "Siwa" ].includes(formData.destination) && (
                    <option value={formData.destination}>{formData.destination} ✨ (AI Detected)</option>
                  )}
                  <option value="Cairo">Cairo (Culture & History) 🏛️</option>
                  <option value="Luxor">Luxor (Pharaonic Ruins) ⛏️</option>
                  <option value="Aswan">Aswan (Nubia & Temples) 🌊</option>
                  <option value="Sharm">Sharm El Sheikh (Sea & Diving) 🏖️</option>
                  <option value="Hurghada">Hurghada (Beach & Fun) 🐠</option>
                  <option value="Alexandria">Alexandria (Sea & Culture) 🌅</option>
                  <option value="Dahab">Dahab (Adventure & Freedom) 🏄‍♂️</option>
                  <option value="MarsaAlam">Marsa Alam (Diving & Dolphins) 🐬</option>
                  <option value="Siwa">Siwa Oasis (Desert & Adventure) 🏜️</option>
                </select>
              </div>

              {/* Guests */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                      <FaUsers className="text-gray-400" /> Adults
                    </label>
                    <Input type="number" name="adults" min="1" value={formData.adults} onChange={handleChange} required />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Children</label>
                    <Input type="number" name="children" min="0" value={formData.children} onChange={handleChange} required />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <DateTimePicker 
                  compact 
                  showTime={false} 
                  dateLabel="Arrival Date" 
                  onDateChange={(val) => setFormData({...formData, startDate: val})} 
                />
                <DateTimePicker 
                  compact 
                  showTime={false} 
                  dateLabel="Departure Date" 
                  onDateChange={(val) => setFormData({...formData, endDate: val})} 
                />
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                   <FaMoneyBillWave className="text-gray-400" /> Total Budget
                </label>
                <div className="flex gap-2">
                  <select 
                    name="currency" 
                    value={formData.currency} 
                    onChange={handleChange} 
                    className="w-24 border border-gray-300 rounded-xl px-2 font-bold bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#EB662B]"
                  >
                    <option value="USD">USD $</option>
                    <option value="EGP">EGP ج.م</option>
                    <option value="EUR">EUR €</option>
                    <option value="GBP">GBP £</option>
                  </select>
                  <Input type="number" name="budget" placeholder="e.g.: 2500" className="flex-1" value={formData.budget} onChange={handleChange} required />
                </div>
              </div>

               {/* Vibe */}
               <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                   <FaStar className="text-gray-400" /> Trip Vibe
                </label>
                <select 
                  name="vibe"
                  value={formData.vibe} 
                  onChange={handleChange}
                  className="w-full h-10 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all font-bold text-gray-700 text-sm"
                >
                  <option>Surprise Me 🎁</option>
                  <option>Relaxation & Spa 💆‍♂️</option>
                  <option>History & Culture 🏛️</option>
                  <option>Adventure & Safari 🏜️</option>
                  <option>Entertainment & Nightlife 🪩</option>
                </select>
              </div>

              <Button 
                type="submit" 
                className="w-full py-4 mt-2 bg-[#05073C] hover:bg-[#1A365D] text-white font-black text-lg rounded-xl shadow-[0_10px_20px_rgba(5,7,60,0.2)] hover:shadow-[0_15px_30px_rgba(212,175,55,0.3)] border-2 border-transparent hover:border-[#D4AF37] hover:-translate-y-1 transition-all duration-300"
                disabled={isGenerating}
              >
                {isGenerating ? "Planning..." : "Start Trip Planning ✨"}
              </Button>
            </form>
          </div>
        </div>

        {/* Result Column */}
        <div className="lg:col-span-7">
          
          {/* Default Empty State - WOW Animated AI Design */}
          {!isGenerating && !result && (
            <div className="relative h-full flex flex-col items-center justify-center text-center p-8 rounded-[2.5rem] min-h-[600px] overflow-hidden group shadow-[0_20px_60px_rgba(0,0,0,0.15)] bg-[#07091A]">
               
               {/* 1. Animated Gradient Mesh Background */}
               <div className="absolute inset-0 overflow-hidden pointer-events-none">
                 <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-[#D4AF37]/20 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '6s' }}></div>
                 <div className="absolute bottom-[0%] -right-[10%] w-[60%] h-[60%] bg-[#EB662B]/20 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '8s', animationDirection: 'alternate' }}></div>
                 <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-blue-600/20 blur-[100px] rounded-full animate-pulse" style={{ animationDuration: '10s' }}></div>
               </div>

               {/* 2. Abstract Geometric Grid */}
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] pointer-events-none"></div>
               
               {/* 3. The Central AI Core (WOW Animation) */}
               <div className="relative z-10 w-72 h-72 flex items-center justify-center mb-6">
                 {/* Outer Radar Rings */}
                 <div className="absolute inset-0 border border-white/10 rounded-full animate-spin" style={{ animationDuration: '15s', animationTimingFunction: 'linear' }}></div>
                 <div className="absolute inset-6 border-2 border-t-[#D4AF37]/50 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" style={{ animationDuration: '4s', animationTimingFunction: 'linear' }}></div>
                 <div className="absolute inset-12 border-2 border-b-[#EB662B]/60 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin" style={{ animationDuration: '6s', animationTimingFunction: 'linear', animationDirection: 'reverse' }}></div>
                 <div className="absolute inset-[4.5rem] border border-white/5 rounded-full border-dashed animate-spin" style={{ animationDuration: '20s', animationTimingFunction: 'linear' }}></div>
                 
                 {/* Orbiting Particles */}
                 <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s', animationTimingFunction: 'linear' }}>
                    <div className="w-3 h-3 bg-[#D4AF37] rounded-full absolute -top-1.5 left-1/2 shadow-[0_0_15px_#D4AF37]"></div>
                 </div>
                 <div className="absolute inset-6 animate-spin" style={{ animationDuration: '5s', animationTimingFunction: 'linear', animationDirection: 'reverse' }}>
                    <div className="w-2 h-2 bg-[#EB662B] rounded-full absolute bottom-1 left-1/4 shadow-[0_0_10px_#EB662B]"></div>
                 </div>

                 {/* Central Orb */}
                 <div className="relative w-28 h-28 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#D4AF37] to-[#EB662B] shadow-[0_0_50px_rgba(212,175,55,0.6)] animate-bounce cursor-pointer group-hover:scale-110 transition-transform duration-500" style={{ animationDuration: '4s' }}>
                    <div className="absolute inset-0 bg-white/30 rounded-full animate-ping opacity-50" style={{ animationDuration: '3s' }}></div>
                    <FaRobot className="text-white text-5xl drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                 </div>
               </div>

               {/* 4. Animated Text */}
               <div className="relative z-10 flex flex-col items-center">
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-5 backdrop-blur-md shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">AI Core Online</span>
                 </div>
                 <h3 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-[#D4AF37] mb-4 tracking-tight drop-shadow-2xl">
                   Ready to Calculate
                 </h3>
                 <p className="text-gray-400 max-w-md text-[15px] leading-relaxed font-medium">
                   Initialize your parameters on the left. Our intelligent engine will evaluate millions of routing possibilities to synthesize your ultimate Egyptian experience.
                 </p>
               </div>

               {/* 5. Floating Feature Cards (Bottom) */}
               <div className="relative z-10 grid grid-cols-3 gap-4 mt-10 w-full max-w-md">
                 {[
                   { icon: <FaCheckCircle/>, title: "Precision", color: "text-green-400", delay: "0s" },
                   { icon: <FaMagic/>, title: "Curated", color: "text-[#D4AF37]", delay: "0.2s" },
                   { icon: <FaStar/>, title: "Premium", color: "text-[#EB662B]", delay: "0.4s" }
                 ].map((feat, idx) => (
                   <div key={idx} className="flex flex-col items-center justify-center p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl transform hover:-translate-y-2 hover:bg-white/10 transition-all duration-300 shadow-xl" style={{ animation: `fade-in-up 1s ease-out ${feat.delay} both` }}>
                     <div className={`text-2xl mb-2 animate-pulse ${feat.color}`} style={{ animationDuration: '3s', animationDelay: feat.delay }}>{feat.icon}</div>
                     <span className="text-white/80 text-[10px] font-bold tracking-widest uppercase">{feat.title}</span>
                   </div>
                 ))}
               </div>

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
               <h3 className="text-2xl font-extrabold text-[#05073C] mb-1">System is working...</h3>
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
                   <span className="inline-block px-3 py-1 bg-[#D4AF37] text-[#05073C] text-xs font-black tracking-widest uppercase rounded mb-4">Smart Trip Plan</span>
                   <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">{result.title}</h2>
                   
                   <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><FaMoneyBillWave className="text-[#D4AF37]" /></div>
                        <div>
                          <p className="text-white/60 text-xs">Estimated Cost</p>
                          <p className="font-bold text-lg"><PriceDisplay price={Number(result.totalCost)} /></p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><FaCalendarAlt className="text-[#D4AF37]" /></div>
                        <div>
                          <p className="text-white/60 text-xs">Duration</p>
                          <p className="font-bold text-lg">{result.days} Days</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><FaUsers className="text-[#D4AF37]" /></div>
                        <div>
                          <p className="text-white/60 text-xs">Passengers</p>
                          <p className="font-bold text-lg">{formData.adults} Adults + {formData.children} Children</p>
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
                        Suggested Hotel
                      </h3>
                      
                      <Link to={`/hotels/${result.hotel.id || 1}`} className="flex flex-col sm:flex-row gap-6 bg-gray-50 rounded-2xl p-4 border border-transparent hover:border-[#D4AF37] transition-all hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)] group">
                        <img src={result.hotel.image} alt={result.hotel.name} className="w-full sm:w-48 h-32 object-cover rounded-xl" />
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex items-center gap-1 text-yellow-500 text-xs mb-1">
                             <FaStar/><FaStar/><FaStar/><FaStar/><FaStar/> <span className="text-gray-500 ml-1">({result.hotel.rating})</span>
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#EB662B] transition-colors">{result.hotel.name}</h4>
                          <p className="text-sm text-gray-500 mt-1 mb-4">{result.hotel.city || result.destination} • Matches your preferences</p>
                          <div className="font-black text-[#05073C]"><PriceDisplay price={Number(result.hotel.price)} /> <span className="text-xs text-gray-400 font-medium">/night</span></div>
                        </div>
                      </Link>
                   </div>

                   {/* Daily Itinerary */}
                   {result.itinerary.map((day: any) => (
                     <div key={day.day} className="mb-10">
                       <h3 className="text-xl font-bold text-[#05073C] border-b border-gray-100 pb-4 mb-6 flex items-center gap-2">
                         <span className="w-8 h-8 rounded-full bg-[#EB662B]/10 text-[#EB662B] flex items-center justify-center text-sm font-bold">{day.day}</span>
                         Day {day.day}
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
                               <div className="font-bold text-[#05073C]">{act.price > 0 ? `$${act.price}` : "Free"}</div>
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
                         Suggested Transport
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
                      <Link 
                        to="/checkout" 
                        state={{ 
                          id: result.hotel?.id || Math.floor(Math.random() * 1000), 
                          type: "ai_trip", 
                          title: result.title, 
                          price: result.totalCost, 
                          image: result.hotel?.image || "https://images.unsplash.com/photo-1539650116574-8efeb43e2b00?w=400",
                          breakdown: `AI Planned Trip: ${result.days} Days in ${result.destination}`,
                          tickets: { adult: 1, child: 0, infant: 0 },
                          items: [
                            { id: 'hotel', name: `Hotel: ${result.hotel?.name || 'Accommodation'}`, price: 0, quantity: 1 },
                            ...result.itinerary.flatMap((day: any) => day.activities.map((act: any, i: number) => ({
                              id: `day-${day.day}-act-${i}`,
                              name: `Day ${day.day}: ${act.name}`,
                              price: act.price || 0,
                              quantity: 1
                            }))),
                            ...(result.transport ? [{ id: 'transport', name: `Transport: ${result.transport.name}`, price: result.transport.price, quantity: 1 }] : [])
                          ]
                        }}
                        className="flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg bg-[#EB662B] text-white hover:bg-[#d55822] transition text-center"
                      >
                       <FaCheckCircle /> Book the full trip
                     </Link>
                     <button onClick={() => setResult(null)} className="flex-1 py-4 rounded-xl font-bold text-[#05073C] border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition">
                       Edit preferences
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
