import SectionWrapper from "@/components/sections/SectionWrapper";
import { useApp } from "@/context/AppContext";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { 
  FaUserEdit, 
  FaEnvelope, 
  FaPhoneAlt, 
  FaCalendarAlt, 
  FaHeart, 
  FaShoppingBag, 
  FaHistory, 
  FaExclamationTriangle,
  FaDollarSign,
  FaPercentage,
  FaHandshake,
  FaChartLine,
  FaUsers,
  FaCoins,
  FaBriefcase,
  FaStore
} from "react-icons/fa";

import { useState, useEffect } from "react";
import { getUserBookings, getAdminStats, getAdminBookings } from "@/api/bookingService";
import PriceDisplay from "@/components/common/PriceDisplay";

const DashboardPage = () => {
  const { user, wishlist, recentlyViewed } = useApp();
  const { totalItems } = useCart();
  const [bookingsCount, setBookingsCount] = useState<number | string>("--");
  
  // Admin stats state
  const [adminStats, setAdminStats] = useState<any>(null);
  const [adminBookings, setAdminBookings] = useState<any[]>([]);
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  const isAdmin = user?.email && (
    ['dinaabdelbaset08@gmail.com', 'eslam.15963278@gmail.com', 'admin@kemat.com', 'admin@kemet.com', 'kemet@kemet.com'].includes(user.email.toLowerCase()) ||
    user.email.toLowerCase().includes('kemet') ||
    user.email.toLowerCase().includes('kemat') ||
    user.email.toLowerCase().startsWith('admin')
  );

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getUserBookings();
        if (Array.isArray(data)) {
          setBookingsCount(data.length);
        }
      } catch (error) {
        setBookingsCount(0);
      }
    };

    const fetchAdminData = async () => {
      if (!isAdmin) return;
      setLoadingAdmin(true);
      try {
        const [statsData, bookingsData] = await Promise.all([
          getAdminStats(),
          getAdminBookings()
        ]);
        setAdminStats(statsData);
        setAdminBookings(bookingsData);
      } catch (error) {
        console.error("Failed to fetch admin dashboard stats:", error);
      } finally {
        setLoadingAdmin(false);
      }
    };

    fetchBookings();
    if (user?.email) {
      fetchAdminData();
    }
  }, [user, isAdmin]);

  return (
    <div className="bg-[#fcfbf9] dark:bg-gray-900 min-h-screen overflow-hidden">
      
      {/* Animated Slim Header Banner */}
      <div className="relative pt-[100px] pb-8 overflow-hidden bg-gradient-to-b from-white to-[#fcfbf9] dark:from-gray-900 dark:to-gray-800 border-b border-gray-100 dark:border-gray-800">
        <div className="absolute top-0 left-[-10%] w-[400px] h-[400px] bg-[#D4AF37]/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-0 right-[-10%] w-[400px] h-[400px] bg-[#EB662B]/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '8s', animationDirection: 'alternate' }}></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <div className="inline-flex items-center gap-3 mb-2 animate-fade-in-up">
                 <div className="p-2.5 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20 shadow-sm">
                   <FaUserEdit className="text-[#D4AF37] text-xl" />
                 </div>
                 <h1 className="text-3xl md:text-4xl font-black text-[#14213d] dark:text-white drop-shadow-sm">
                   My Dashboard
                 </h1>
              </div>
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                Welcome to your personal Kemet dashboard, {user?.name.split(" ")[0]}!
              </p>
           </div>
           <Link to="/profile" className="inline-flex items-center justify-center gap-2 bg-[#EB662B] hover:bg-[#d55822] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <FaUserEdit /> Edit Settings
           </Link>
        </div>
      </div>

      <SectionWrapper className="pb-16 pt-8 relative z-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - User ID Card */}
            <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
               <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:border-[#D4AF37] transition-all duration-500 hover:-translate-y-2">
                  <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-[#14213d] to-[#2a3b66] dark:from-gray-900 dark:to-[#05073C] -z-0 group-hover:scale-110 transition-transform duration-700"></div>
                  
                  <div className="relative z-10 flex flex-col items-center mt-8">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl bg-white flex items-center justify-center mb-6 relative group-hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-shadow duration-500">
                       {user?.avatar ? (
                          <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
                       ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#EB662B] to-[#b03c2b] text-white flex items-center justify-center text-5xl font-black">
                            {user?.name?.charAt(0).toUpperCase()}
                          </div>
                       )}
                    </div>
                    
                    <h2 className="text-2xl font-black text-[#14213d] dark:text-white mb-1 group-hover:text-[#D4AF37] transition-colors">{user?.name}</h2>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-black uppercase tracking-widest rounded-full mb-6 relative border border-green-200 dark:border-green-800">
                       <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse absolute left-2 top-1/2 -translate-y-1/2 shadow-[0_0_10px_#22c55e]"></span>
                       <span className="pl-3">Active Member</span>
                    </span>

                    <div className="w-full space-y-4 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl border border-transparent group-hover:border-gray-100 dark:group-hover:border-gray-700 transition-colors">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 shadow-sm"><FaEnvelope /></div>
                          <span className="truncate">{user?.email}</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 shadow-sm"><FaPhoneAlt /></div>
                          <span className="truncate">{user?.phone || "Not provided"}</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 shadow-sm"><FaCalendarAlt /></div>
                          <span className="truncate">Joined April 2026</span>
                       </div>
                    </div>
                  </div>
               </div>
            </div>

            {/* Right Column - Stats & Activity */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <Link to="/bookings" className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group flex flex-col justify-between h-full animate-fade-in-up hover:border-[#EB662B]" style={{ animationDelay: '0.4s' }}>
                      <div className="w-12 h-12 rounded-2xl bg-[#EB662B]/10 text-[#EB662B] flex items-center justify-center text-xl mb-4 group-hover:bg-[#EB662B] group-hover:text-white transition-colors"><FaCalendarAlt className="group-hover:scale-110 transition-transform" /></div>
                      <div>
                         <p className="text-3xl font-black text-[#14213d] dark:text-white">{bookingsCount}</p>
                         <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-1">Bookings</p>
                      </div>
                   </Link>
                   <Link to="/wishlist" className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group flex flex-col justify-between h-full animate-fade-in-up hover:border-pink-500" style={{ animationDelay: '0.5s' }}>
                      <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center text-xl mb-4 group-hover:bg-pink-500 group-hover:text-white transition-colors"><FaHeart className="group-hover:scale-110 transition-transform" /></div>
                      <div>
                         <p className="text-3xl font-black text-[#14213d] dark:text-white">{wishlist.length}</p>
                         <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-1">Wishlist</p>
                      </div>
                   </Link>
                   <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group flex flex-col justify-between h-full cursor-not-allowed animate-fade-in-up hover:border-blue-500" style={{ animationDelay: '0.6s' }}>
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors"><FaHistory className="group-hover:-rotate-45 transition-transform" /></div>
                      <div>
                         <p className="text-3xl font-black text-[#14213d] dark:text-white">{recentlyViewed.length}</p>
                         <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-1">Viewed</p>
                      </div>
                   </div>
                   <Link to="/shop-checkout" className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group flex flex-col justify-between h-full animate-fade-in-up hover:border-green-500" style={{ animationDelay: '0.7s' }}>
                      <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center text-xl mb-4 group-hover:bg-green-500 group-hover:text-white transition-colors"><FaShoppingBag className="group-hover:-translate-y-1 transition-transform" /></div>
                      <div>
                         <p className="text-3xl font-black text-[#14213d] dark:text-white">{totalItems}</p>
                         <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-1">In Cart</p>
                      </div>
                   </Link>
                </div>

                {/* Admin Tools (Only visible to Admins) */}
                {isAdmin && (
                  <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                     {/* Pending Approvals Quick Link Banner */}
                     <Link to="/admin/approvals" className="bg-gradient-to-r from-[#EB662B] to-[#d55822] p-6 rounded-3xl shadow-xl shadow-orange-500/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex items-center justify-between border border-orange-400/30 relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/10 w-full h-full -skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                        <div className="relative z-10">
                           <p className="text-2xl font-black text-white">طلبات الشركات (Pending Approvals)</p>
                           <p className="text-sm text-white/90 font-bold mt-1">Review and approve company requests</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center text-xl group-hover:scale-110 group-hover:rotate-12 transition-transform relative z-10"><FaExclamationTriangle className="animate-pulse" /></div>
                     </Link>

                     {/* Premium Admin Commission & Revenue Stats Dashboard */}
                     <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-[#D4AF37]/30 dark:border-gray-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-3xl rounded-full"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#EB662B]/5 blur-3xl rounded-full"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700 pb-6 mb-8">
                           <div>
                              <div className="inline-flex items-center gap-2 mb-1">
                                 <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
                                 <h3 className="text-2xl font-black text-[#14213d] dark:text-white font-serif">
                                    لوحة تحكم الأرباح والعمولات
                                 </h3>
                              </div>
                              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-bold">
                                 Platform Commission & Financial Analytics Ledger (15% Commission Split)
                              </p>
                           </div>
                           <div className="px-4 py-2 bg-gradient-to-r from-[#D4AF37]/10 to-[#EB662B]/10 rounded-xl border border-[#D4AF37]/30 text-xs font-black text-[#EB662B] tracking-wider uppercase">
                              Admin Ledger Active
                           </div>
                        </div>

                        {loadingAdmin ? (
                           <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                              <div className="w-10 h-10 rounded-full border-4 border-[#EB662B] border-t-transparent animate-spin mb-4"></div>
                              <p className="font-bold text-sm">جاري تحميل بيانات الأرباح والعمولات...</p>
                           </div>
                        ) : adminStats ? (
                           <div className="space-y-8">
                              
                              {/* 4 Metrics Grid */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                 {/* Metric 1: Total Revenue */}
                                 <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900/60 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:border-[#D4AF37] transition-all">
                                    <div className="absolute top-0 right-0 w-12 h-12 bg-[#D4AF37]/10 rounded-bl-3xl flex items-center justify-center text-[#D4AF37] font-black"><FaCoins /></div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">إجمالي الإيرادات (Total Sales)</p>
                                    <p className="text-2xl font-black text-[#14213d] dark:text-white mb-1"><PriceDisplay price={adminStats.revenue || 0} /></p>
                                    <p className="text-[10px] text-gray-500 font-medium">مجموع الحجوزات النشطة</p>
                                 </div>

                                 {/* Metric 2: Kemet Share */}
                                 <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900/60 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:border-[#EB662B] transition-all">
                                    <div className="absolute top-0 right-0 w-12 h-12 bg-[#EB662B]/10 rounded-bl-3xl flex items-center justify-center text-[#EB662B] font-black"><FaChartLine /></div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">نصيب المنصة (Kemet Profit - 15%)</p>
                                    <p className="text-2xl font-black text-[#EB662B] mb-1"><PriceDisplay price={adminStats.profit || 0} /></p>
                                    <p className="text-[10px] text-[#EB662B] font-semibold">صافي أرباح المنصة (15%)</p>
                                 </div>

                                 {/* Metric 3: Partner Share */}
                                 <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900/60 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:border-blue-500 transition-all">
                                    <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/10 rounded-bl-3xl flex items-center justify-center text-blue-500 font-black"><FaHandshake /></div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">نصيب الشركاء (Partners Share - 85%)</p>
                                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mb-1"><PriceDisplay price={(adminStats.revenue - adminStats.profit) || 0} /></p>
                                    <p className="text-[10px] text-gray-500 font-medium">مستحقات الفنادق والشركات (85%)</p>
                                 </div>

                                 {/* Metric 4: Commission Rate */}
                                 <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900/60 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:border-green-500 transition-all">
                                    <div className="absolute top-0 right-0 w-12 h-12 bg-green-500/10 rounded-bl-3xl flex items-center justify-center text-green-500 font-black"><FaPercentage /></div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">نسبة العمولة (Commission Rate)</p>
                                    <p className="text-2xl font-black text-green-600 dark:text-green-400 mb-1">{adminStats.commission_rate || "15%"}</p>
                                    <p className="text-[10px] text-green-600 font-semibold">محددة ديناميكياً بالنظام</p>
                                 </div>
                              </div>

                              {/* Profit Split Visualizer Bar */}
                              <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
                                 <div className="flex justify-between items-center text-xs font-bold text-gray-500 dark:text-gray-400 mb-3">
                                    <span>نصيب الشركات الشريكة (85%)</span>
                                    <span>نسبة توزيع الأرباح (Profit Split Ratio)</span>
                                    <span>نصيب منصتنا (15%)</span>
                                 </div>
                                 <div className="w-full h-5 rounded-full overflow-hidden flex bg-gray-200 dark:bg-gray-800 shadow-inner p-0.5">
                                    <div className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-l-full relative transition-all duration-1000 shadow-lg" style={{ width: '85%' }}>
                                       <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-black">85%</span>
                                    </div>
                                    <div className="h-full bg-gradient-to-r from-[#EB662B] to-[#D4AF37] rounded-r-full relative transition-all duration-1000 shadow-lg" style={{ width: '15%' }}>
                                       <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-black">15%</span>
                                    </div>
                                 </div>
                                 <p className="text-[10px] text-gray-400 font-bold text-center mt-2.5">
                                    مبني على نظام العمولات المعتمد لتخرج مشروع كيميت: المنصة تأخذ 15% عمولة تشغيل والشركة المنفذة تأخذ 85% من قيمة الرحلة أو حجز الفندق.
                                 </p>
                              </div>

                              {/* Two Columns Side-by-Side: Top Places vs Top Users */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 {/* Top Places */}
                                 <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
                                    <h4 className="font-extrabold text-sm text-[#14213d] dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                       <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                                       أكثر الوجهات والخدمات حجزاً (Top Destinations Booked)
                                    </h4>
                                    <div className="space-y-3">
                                       {adminStats.top_places && adminStats.top_places.length > 0 ? (
                                          adminStats.top_places.map((place: any, i: number) => (
                                             <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/40 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-900/75 transition-colors border border-transparent hover:border-gray-200/50">
                                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 truncate max-w-[200px]">{place.name}</span>
                                                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-950/40 text-[#EB662B] text-xs font-black rounded-full flex items-center gap-1.5 border border-orange-200 dark:border-orange-900/30">
                                                   {place.visits} حجوزات
                                                </span>
                                             </div>
                                          ))
                                       ) : (
                                          <p className="text-xs text-gray-400 text-center py-4">لا توجد بيانات حالية</p>
                                       )}
                                    </div>
                                 </div>

                                 {/* Top Users */}
                                 <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
                                    <h4 className="font-extrabold text-sm text-[#14213d] dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                       <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                                       أكثر المستخدمين نشاطاً وحجزاً (Most Active Customers)
                                    </h4>
                                    <div className="space-y-3">
                                       {adminStats.top_users && adminStats.top_users.length > 0 ? (
                                          adminStats.top_users.map((item: any, i: number) => (
                                             <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/40 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-900/75 transition-colors border border-transparent hover:border-gray-200/50">
                                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 truncate max-w-[200px]">{item.name}</span>
                                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-black rounded-full flex items-center gap-1.5 border border-blue-200 dark:border-blue-900/30">
                                                   {item.bookings} حجوزات
                                                </span>
                                             </div>
                                          ))
                                       ) : (
                                          <p className="text-xs text-gray-400 text-center py-4">لا توجد بيانات حالية</p>
                                       )}
                                    </div>
                                 </div>
                              </div>

                              {/* Detailed Bookings & Profit Splits Ledger */}
                              <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                                 <h4 className="font-extrabold text-sm text-[#14213d] dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
                                    سجل الحجوزات وتفصيل توزيع الأرباح (Detailed Profits Ledger)
                                 </h4>
                                 
                                 {adminBookings && adminBookings.length > 0 ? (
                                    <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-700 shadow-inner">
                                       <table className="w-full text-right text-xs font-medium text-gray-500 dark:text-gray-400 table-auto border-collapse">
                                          <thead className="text-[10px] text-gray-400 font-black uppercase tracking-wider bg-gray-50 dark:bg-gray-900/70 border-b border-gray-100 dark:border-gray-700">
                                             <tr>
                                                <th className="px-4 py-3 text-center">الرقم</th>
                                                <th className="px-4 py-3">العميل</th>
                                                <th className="px-4 py-3">الخدمة المحجوزة</th>
                                                <th className="px-4 py-3 text-center">الإجمالي المدفوع</th>
                                                <th className="px-4 py-3 text-center text-[#EB662B]">نصيبنا (15%)</th>
                                                <th className="px-4 py-3 text-center text-blue-600 dark:text-blue-400">نصيب الشركة (85%)</th>
                                                <th className="px-4 py-3 text-center">الحالة</th>
                                             </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                             {adminBookings.slice(0, 10).map((booking: any) => {
                                                const total = parseFloat(booking.total_price || booking.price || 0);
                                                const profit = parseFloat(booking.platform_profit || (total * 0.15).toFixed(2));
                                                const partner = parseFloat(booking.partner_share || (total - profit).toFixed(2));
                                                
                                                return (
                                                   <tr key={booking.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                                                      <td className="px-4 py-3.5 text-center font-bold text-[#14213d] dark:text-white font-mono bg-gray-50/30 dark:bg-gray-900/10">
                                                         BKG-{booking.id}
                                                      </td>
                                                      <td className="px-4 py-3.5 text-right font-semibold">
                                                         <div>{booking.user?.name || "عميل خارجي"}</div>
                                                         <div className="text-[10px] text-gray-400">{booking.user?.email || ""}</div>
                                                      </td>
                                                      <td className="px-4 py-3.5 text-right font-semibold text-gray-700 dark:text-gray-300">
                                                         <div className="truncate max-w-[150px]">{booking.item_title || "خدمة سياحية"}</div>
                                                         <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-900 text-gray-500 font-bold tracking-widest uppercase">{booking.item_type}</span>
                                                      </td>
                                                      <td className="px-4 py-3.5 text-center font-extrabold text-gray-900 dark:text-white">
                                                         <PriceDisplay price={total} />
                                                      </td>
                                                      <td className="px-4 py-3.5 text-center font-black text-[#EB662B] bg-orange-50/10 dark:bg-orange-950/5">
                                                         <PriceDisplay price={profit} />
                                                      </td>
                                                      <td className="px-4 py-3.5 text-center font-black text-blue-600 dark:text-blue-400 bg-blue-50/10 dark:bg-blue-950/5">
                                                         <PriceDisplay price={partner} />
                                                      </td>
                                                      <td className="px-4 py-3.5 text-center">
                                                         <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                                            booking.status === 'cancelled' 
                                                               ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30' 
                                                               : 'bg-green-50 text-green-600 border-green-100 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30'
                                                         }`}>
                                                            {booking.status || "confirmed"}
                                                         </span>
                                                      </td>
                                                   </tr>
                                                );
                                             })}
                                          </tbody>
                                       </table>
                                    </div>
                                 ) : (
                                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                                       <p className="text-xs text-gray-400 font-medium">لا توجد حجوزات مسجلة بالنظام حتى الآن</p>
                                    </div>
                                 )}
                              </div>
                           </div>
                        ) : (
                           <div className="text-center py-10 bg-red-50 dark:bg-red-950/25 border border-red-200/50 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-2xl">
                              <p className="font-bold text-sm">خطأ أثناء جلب تفاصيل توزيع الأرباح</p>
                              <p className="text-xs mt-1">تأكد من تشغيل خادم قاعدة البيانات والاتصال بالخلفية</p>
                           </div>
                        )}
                     </div>
                  </div>
                )}

                {/* Recently Viewed Widget */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in-up hover:shadow-md transition-shadow duration-300" style={{ animationDelay: '0.9s' }}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-extrabold text-[#14213d] dark:text-white">Recently Viewed</h3>
                    </div>
                    
                    {recentlyViewed.length === 0 ? (
                        <div className="text-center py-10 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                            <p className="text-gray-500 dark:text-gray-400 font-medium">You haven't viewed any destinations yet.</p>
                            <Link to="/explore/egypt" className="text-[#EB662B] font-bold mt-2 inline-block hover:underline transition-colors">Start Exploring →</Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentlyViewed.slice(0, 3).map((item, index) => (
                                <Link to={item.link} key={`${item.type}-${item.id}`} className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-gray-600 hover:shadow-sm" style={{ animationDelay: `${1 + (index * 0.1)}s` }}>
                                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-[#14213d] dark:text-white text-lg group-hover:text-[#EB662B] transition-colors">{item.title}</h4>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 font-black uppercase tracking-wider mt-1">{item.type}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-500 shadow-sm shrink-0 group-hover:bg-[#EB662B] group-hover:text-white group-hover:border-[#EB662B] transition-colors">
                                        →
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

            </div>

          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default DashboardPage;
