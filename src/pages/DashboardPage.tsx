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
    <div className="bg-[#fcfbf9] min-h-screen pt-24 pb-16">
      <SectionWrapper>
        <div className="max-w-6xl mx-auto px-4">
          
          {/* Header */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
             <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#14213d] mb-3 font-serif">Client Profile</h1>
                <p className="text-gray-500 text-lg">Welcome to your personal Kemet dashboard, {user?.name.split(" ")[0]}!</p>
             </div>
             <Link to="/profile" className="inline-flex items-center gap-2 bg-[#EB662B] hover:bg-[#d55822] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all">
                <FaUserEdit /> Edit Settings
             </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - User ID Card */}
            <div className="lg:col-span-1">
               <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-[#14213d] to-[#2a3b66] -z-0"></div>
                  
                  <div className="relative z-10 flex flex-col items-center mt-8">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-white flex items-center justify-center mb-6">
                       {user?.avatar ? (
                          <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
                       ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#EB662B] to-[#b03c2b] text-white flex items-center justify-center text-5xl font-black">
                            {user?.name?.charAt(0).toUpperCase()}
                          </div>
                       )}
                    </div>
                    
                    <h2 className="text-2xl font-black text-[#14213d] mb-1">{user?.name}</h2>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-black uppercase tracking-widest rounded-full mb-6 relative">
                       <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse absolute left-2 top-1/2 -translate-y-1/2"></span>
                       <span className="pl-3">Active Member</span>
                    </span>

                    <div className="w-full space-y-4 text-sm font-medium text-gray-600 bg-gray-50 p-5 rounded-2xl">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm"><FaEnvelope /></div>
                          <span className="truncate">{user?.email}</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm"><FaPhoneAlt /></div>
                          <span className="truncate">{user?.phone || "Not provided"}</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm"><FaCalendarAlt /></div>
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
                   <Link to="/bookings" className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col justify-between h-full">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#EB662B] flex items-center justify-center text-xl mb-4 group-hover:bg-[#EB662B] group-hover:text-white transition-colors"><FaCalendarAlt /></div>
                      <div>
                         <p className="text-3xl font-black text-[#14213d]">{bookingsCount}</p>
                         <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Bookings</p>
                      </div>
                   </Link>
                   <Link to="/wishlist" className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col justify-between h-full">
                      <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center text-xl mb-4 group-hover:bg-pink-500 group-hover:text-white transition-colors"><FaHeart /></div>
                      <div>
                         <p className="text-3xl font-black text-[#14213d]">{wishlist.length}</p>
                         <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Wishlist</p>
                      </div>
                   </Link>
                   <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col justify-between h-full cursor-not-allowed">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl mb-4"><FaHistory /></div>
                      <div>
                         <p className="text-3xl font-black text-[#14213d]">{recentlyViewed.length}</p>
                         <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Viewed</p>
                      </div>
                   </div>
                   <Link to="/shop-checkout" className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col justify-between h-full">
                      <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center text-xl mb-4 group-hover:bg-green-500 group-hover:text-white transition-colors"><FaShoppingBag /></div>
                      <div>
                         <p className="text-3xl font-black text-[#14213d]">{totalItems}</p>
                         <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">In Cart</p>
                      </div>
                   </Link>
                </div>

                {/* Admin Tools (Only visible to Admins) */}
                {user?.email && ['dinaabdelbaset08@gmail.com', 'eslam.15963278@gmail.com'].includes(user.email.toLowerCase()) && (
                  <div className="mb-8">
                     <Link to="/admin/approvals" className="bg-gradient-to-r from-[#EB662B] to-[#d55822] p-6 rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group flex items-center justify-between">
                        <div>
                           <p className="text-2xl font-black text-white">طلبات الشركات (Pending Approvals)</p>
                           <p className="text-sm text-white/80 font-bold mt-1">Review and approve company requests</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center text-xl group-hover:scale-110 transition-transform"><FaExclamationTriangle /></div>
                     </Link>
                  </div>
                )}

                {/* Recently Viewed Widget */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-[#14213d]">Recently Viewed</h3>
                    </div>
                    
                    {recentlyViewed.length === 0 ? (
                        <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-500 font-medium">You haven't viewed any destinations yet.</p>
                            <Link to="/explore/egypt" className="text-[#EB662B] font-bold mt-2 inline-block hover:underline">Start Exploring</Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentlyViewed.slice(0, 3).map((item) => (
                                <Link to={item.link} key={`${item.type}-${item.id}`} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-[#14213d] text-lg">{item.title}</h4>
                                        <p className="text-xs text-gray-400 font-black uppercase tracking-wider mt-1">{item.type}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm shrink-0">
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
