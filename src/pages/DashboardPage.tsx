import SectionWrapper from "@/components/sections/SectionWrapper";
import { useApp } from "@/context/AppContext";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { FaUserEdit, FaEnvelope, FaPhoneAlt, FaCalendarAlt, FaHeart, FaShoppingBag, FaHistory, FaExclamationTriangle } from "react-icons/fa";

import { useState, useEffect } from "react";
import { getUserBookings } from "@/api/bookingService";

const DashboardPage = () => {
  const { user, wishlist, recentlyViewed } = useApp();
  const { totalItems } = useCart();
  const [bookingsCount, setBookingsCount] = useState<number | string>("--");

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
    fetchBookings();
  }, []);

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
                {user?.email && ['dinaabdelbaset08@gmail.com', 'eslam.15963278@gmail.com'].includes(user.email.toLowerCase()) && (
                  <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                     <Link to="/admin/approvals" className="bg-gradient-to-r from-[#EB662B] to-[#d55822] p-6 rounded-3xl shadow-xl shadow-orange-500/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex items-center justify-between border border-orange-400/30 relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/10 w-full h-full -skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                        <div className="relative z-10">
                           <p className="text-2xl font-black text-white">طلبات الشركات (Pending Approvals)</p>
                           <p className="text-sm text-white/90 font-bold mt-1">Review and approve company requests</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center text-xl group-hover:scale-110 group-hover:rotate-12 transition-transform relative z-10"><FaExclamationTriangle className="animate-pulse" /></div>
                     </Link>
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
