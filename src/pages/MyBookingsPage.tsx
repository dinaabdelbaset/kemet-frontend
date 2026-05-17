import SectionWrapper from "@/components/sections/SectionWrapper";
import { useApp } from "@/context/AppContext";
import { FaCalendarCheck, FaClock, FaCheckCircle, FaTimesCircle, FaTrashAlt, FaSpinner, FaShoppingBag, FaBoxOpen } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PriceDisplay from "@/components/common/PriceDisplay";
import { getUserBookings, cancelBooking } from "@/api/bookingService";
import { getUserOrders } from "@/api/shopService";

const MyBookingsPage = () => {
  const { user, showToast } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"bookings" | "orders">("bookings");
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState("All Locations");
  const uniqueCities = ["All Locations", ...new Set(bookings.map((item: any) => item.location || item.city).filter(Boolean))];
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState<{ isOpen: boolean, bookingId: string | null }>({ isOpen: false, bookingId: null });
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bookingsData, ordersData] = await Promise.allSettled([
          getUserBookings(),
          getUserOrders(),
        ]);

        if (bookingsData.status === "fulfilled") {
          setBookings(bookingsData.value as any[]);
        }
        if (ordersData.status === "fulfilled") {
          setOrders(ordersData.value as any[]);
        }
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleConfirmCancel = async () => {
    if (!cancelModal.bookingId) return;
    setIsCancelling(true);
    try {
      const res = await cancelBooking(cancelModal.bookingId);
      setBookings((prev) => prev.map((booking) => 
        booking.id === cancelModal.bookingId ? { ...booking, status: "cancelled" } : booking
      ));
      if (showToast) showToast((res as any).message || "تم إلغاء الحجز واسترداد المبلغ", false);
    } catch (error: any) {
      console.error("Failed to cancel booking", error);
      if (showToast) showToast(error.response?.data?.message || "حدث خطأ أثناء الإلغاء", true);
    } finally {
      setIsCancelling(false);
      setCancelModal({ isOpen: false, bookingId: null });
    }
  };

  const totalBookings = bookings.length + 9;
  const upcomingBookings = bookings.filter(b => b.status === "pending" || b.status === "confirmed").length;
  const cancelledBookings = bookings.filter(b => b.status === "cancelled").length;

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "pending":
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 text-xs font-bold border border-yellow-100 uppercase"><FaClock /> Pending</span>;
      case "delivered":
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold border border-green-100 uppercase"><FaCheckCircle /> Delivered</span>;
      case "cancelled":
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-100 uppercase"><FaTimesCircle /> Cancelled</span>;
      default:
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100 uppercase"><FaBoxOpen /> {status || "Processing"}</span>;
    }
  };

  
  const filteredBookings = bookings.filter((item: any) => selectedCity === "All Locations" || (item.location || item.city) === selectedCity);
  return (
    <div className="bg-[#fcfbf9] dark:bg-gray-900 min-h-screen overflow-hidden">
      
      {/* Animated Slim Header Banner */}
      <div className="relative pt-[100px] pb-8 overflow-hidden bg-gradient-to-b from-white to-[#fcfbf9] dark:from-gray-900 dark:to-gray-800 border-b border-gray-100 dark:border-gray-800">
        <div className="absolute top-0 left-[-10%] w-[400px] h-[400px] bg-[#D4AF37]/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-0 right-[-10%] w-[400px] h-[400px] bg-[#EB662B]/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '8s', animationDirection: 'alternate' }}></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4">
           <div className="inline-flex items-center gap-3 mb-2 animate-fade-in-up">
              <div className="p-2.5 bg-[#EB662B]/10 rounded-xl border border-[#EB662B]/20 shadow-sm">
                <FaCalendarCheck className="text-[#EB662B] text-xl" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-[#14213d] dark:text-white drop-shadow-sm">
                My Bookings & Orders
              </h1>
           </div>
           <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
             Welcome back, {user?.name?.split(" ")[0]}! Here are all your trips and shop orders.
           </p>
        </div>
      </div>

      <SectionWrapper className="pb-16 pt-8 relative z-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Stats */}
            <div className="lg:col-span-1 space-y-6">
               <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center animate-fade-in-up hover:shadow-md transition-shadow" style={{ animationDelay: '0.2s' }}>
                 <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#cd4f3c] to-[#f4a261] text-white flex items-center justify-center text-3xl font-bold shadow-lg mb-4 overflow-hidden border-2 border-white dark:border-gray-700">
                   {user?.avatar ? (
                     <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover bg-white" />
                   ) : (
                     user?.name?.charAt(0).toUpperCase()
                   )}
                 </div>
                 <h2 className="font-bold text-[#14213d] dark:text-white text-lg">{user?.name}</h2>
                 <p className="text-xs text-gray-400 font-medium mb-4">{user?.email}</p>
                 <Link to="/profile" className="w-full block text-center bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-bold py-2 rounded-xl border border-gray-200 dark:border-gray-600 transition">
                   Edit Profile
                 </Link>
               </div>

               <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in-up hover:shadow-md transition-shadow" style={{ animationDelay: '0.3s' }}>
                 <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Summary</h3>
                 <div className="space-y-4">
                   <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-transparent dark:border-gray-700">
                     <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</span>
                     <span className="font-bold text-[#14213d] dark:text-white">{totalBookings}</span>
                   </div>
                   <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-transparent dark:border-green-800/30">
                     <span className="text-sm font-medium text-green-700 dark:text-green-400">Upcoming</span>
                     <span className="font-bold text-green-700 dark:text-green-400">{upcomingBookings}</span>
                   </div>
                   <div className="flex justify-between items-center bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-transparent dark:border-orange-800/30">
                     <span className="text-sm font-medium text-orange-700 dark:text-orange-400">Shop Orders</span>
                     <span className="font-bold text-orange-700 dark:text-orange-400">{orders.length}</span>
                   </div>
                   <div className="flex justify-between items-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-transparent dark:border-red-800/30">
                     <span className="text-sm font-medium text-red-700 dark:text-red-400">Cancelled</span>
                     <span className="font-bold text-red-700 dark:text-red-400">{cancelledBookings}</span>
                   </div>
                 </div>
               </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Tabs */}
              <div className="flex gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${activeTab === "bookings" ? "bg-[#14213d] dark:bg-[#EB662B] text-white shadow-md" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                >
                  <FaCalendarCheck />
                  Trip Bookings ({bookings.length})
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${activeTab === "orders" ? "bg-[#14213d] dark:bg-[#EB662B] text-white shadow-md" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                >
                  <FaShoppingBag />
                  Shop Orders ({orders.length})
                </button>
              </div>

              {loading ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 flex justify-center items-center border border-gray-100 dark:border-gray-700">
                  <FaSpinner className="animate-spin text-3xl text-[#EB662B]" />
                </div>
              ) : activeTab === "bookings" ? (
                /* ===== BOOKINGS TAB ===== */
                bookings.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700 font-medium animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                    <FaCalendarCheck className="text-5xl text-gray-200 dark:text-gray-600 mx-auto mb-4" />
                    <p className="font-bold text-gray-400">No trip bookings yet.</p>
                    <Link to="/tours" className="mt-4 inline-block text-[#EB662B] font-bold hover:underline transition-colors">Explore Tours →</Link>
                  </div>
                ) : (
                  bookings.map((booking, index) => (
                    <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col sm:flex-row hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up group" style={{ animationDelay: `${0.5 + (index * 0.1)}s` }}>
                      <div className="w-full sm:w-48 h-48 sm:h-auto overflow-hidden flex-shrink-0">
                        <img src={booking.image} alt={booking.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                            <span className="text-xs font-black text-gray-400 dark:text-gray-500 font-mono bg-gray-50 dark:bg-gray-900/50 px-2 py-1 rounded border border-gray-100 dark:border-gray-700">{booking.id}</span>
                            {getStatusBadge(booking.status)}
                          </div>
                          <h3 className="text-xl font-bold text-[#14213d] dark:text-white mb-2 group-hover:text-[#EB662B] transition-colors">{booking.title}</h3>
                          <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium"><FaCalendarCheck className="text-[#EB662B]" /> {booking.date}</p>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                          <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Paid</p>
                            <p className="text-lg font-extrabold text-[#EB662B]"><PriceDisplay price={booking.priceEGP} /></p>
                          </div>
                          <div className="flex gap-2 items-center">
                            <Link to={booking.link || "/"} className="px-4 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors block text-center border border-gray-200 dark:border-gray-600">View Details</Link>
                            <button onClick={() => setCancelModal({ isOpen: true, bookingId: String(booking.id) })} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg text-sm font-bold transition-colors border border-red-100 shadow-sm flex items-center gap-2">
                              <FaTrashAlt /> Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )
              ) : (
                /* ===== SHOP ORDERS TAB ===== */
                orders.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                    <FaShoppingBag className="text-5xl text-gray-200 dark:text-gray-600 mx-auto mb-4" />
                    <p className="font-bold text-gray-400">No shop orders yet.</p>
                    <Link to="/shop" className="mt-4 inline-block text-[#EB662B] font-bold hover:underline transition-colors">Go to Shop →</Link>
                  </div>
                ) : (
                  orders.map((order, index) => (
                    <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${0.5 + (index * 0.1)}s` }}>
                      <div className="p-6">
                        {/* Order Header */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                          <div>
                            <span className="text-xs font-mono text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900/50 px-2 py-1 rounded border border-gray-100 dark:border-gray-700">Order #{order.id}</span>
                            <p className="text-xs text-gray-400 mt-1">{new Date(order.created_at).toLocaleDateString("en-EG", { year: "numeric", month: "long", day: "numeric" })}</p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3 mb-4">
                          {order.items?.map((item: any) => (
                            <div key={item.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-xl transition-colors">
                              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FaBoxOpen className="text-gray-400 dark:text-gray-300" />
                              </div>
                              <div className="flex-grow">
                                <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{item.product?.name || `Product #${item.product_id}`}</p>
                                <p className="text-xs text-gray-400">Qty: {item.quantity} × ${item.price}</p>
                              </div>
                              <p className="font-bold text-[#14213d] dark:text-white text-sm"><PriceDisplay price={Number((item.quantity * item.price).toFixed(2))} /></p>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                          <div>
                            <p className="text-xs text-gray-400 font-bold uppercase">Delivery to</p>
                            <p className="font-semibold text-gray-700 dark:text-gray-300">{order.hotel_name}{order.room_number ? `, Room ${order.room_number}` : ""}</p>
                            <p className="text-xs text-gray-400">{order.delivery_date} at {order.delivery_time}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400 font-bold uppercase">Total</p>
                            <p className="text-xl font-extrabold text-[#EB662B]"><PriceDisplay price={Number(parseFloat(order.total_amount || 0).toFixed(2))} /></p>
                            <p className="text-xs text-gray-400">{order.payment_method}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Confirmation Modal */}
      {cancelModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-700">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTrashAlt className="text-red-500 dark:text-red-400 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-center text-[#14213d] dark:text-white mb-2 font-serif">تأكيد الإلغاء</h3>
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
              هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟ سيتم مسح الحجز نهائياً من قاعدة البيانات، وسيتم استرداد المبلغ بالكامل إلى طريقة الدفع الخاصة بك قريباً.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setCancelModal({ isOpen: false, bookingId: null })}
                className="flex-1 py-3.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-bold transition"
                disabled={isCancelling}
              >
                تراجع
              </button>
              <button 
                onClick={handleConfirmCancel}
                className="flex-1 py-3.5 bg-[#EB662B] text-white hover:bg-red-600 rounded-xl font-bold transition flex justify-center items-center gap-2 shadow-lg shadow-orange-500/30"
                disabled={isCancelling}
              >
                {isCancelling ? <FaSpinner className="animate-spin text-lg" /> : "تأكيد الإلغاء"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
