import { FaHome, FaCompass, FaCheck, FaCalendarAlt, FaClock, FaTicketAlt, FaMoneyBillWave, FaPrint, FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { CheckoutState } from "../../pages/CheckoutPage";
import PriceDisplay from "../common/PriceDisplay";

interface Props {
  data?: CheckoutState;
}

const CheckoutSuccess = ({ data }: Props) => {
  const invoiceNumber = data?.bookingId || `KMT-${Math.floor(10000000 + Math.random() * 90000000)}`;
  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const handlePrint = () => {
    window.print();
  };

  // Helper to get nice icons based on booking type
  const getItemIcon = (type?: string) => {
    switch (type) {
      case "flight": return "✈️";
      case "hotel": return "🏨";
      case "tour":
      case "package": return "🏛️";
      case "safari": return "🦁";
      case "food_cart":
      case "restaurant":
      case "meal": return "🍽️";
      case "transport":
      case "car": return "🚗";
      default: return "🎟️";
    }
  };

  const isCash = data?.payment.method === "cash";

  /* ==========================================================================
     CASE 1: CASH PAYMENT SUCCESS SCREEN (Neat, clean confirmation card style)
     ========================================================================== */
  if (isCash) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center py-12 px-4" dir="rtl">
        <div className="bg-white border border-gray-200/80 rounded-3xl shadow-xl p-8 max-w-lg w-full text-center animate-fade-in relative overflow-hidden">
          {/* Top colored accent bar */}
          <div className="absolute top-0 right-0 left-0 h-2 bg-[#EB662B]" />

          {/* Success Check Icon */}
          <div className="flex justify-center mb-6 mt-4">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <FaCheck className="text-white text-3xl" />
            </div>
          </div>

          {/* Core confirmation messages */}
          <h2 className="text-2xl font-extrabold text-[#05073C] mb-3">
            تم تأكيد حجزك بنجاح! 🎉
          </h2>
          <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6">
            لقد تم حجز طلبك وتأكيده بنجاح بنظام <strong className="text-[#EB662B]">الدفع كاش عند الوصول</strong>. 
            تم تحديث النظام ومزامنة المقاعد والبيانات فوراً في قاعدة البيانات!
          </p>

          {/* Booking Summary Box */}
          <div className="bg-gray-50 rounded-2xl p-5 text-right border border-gray-100 space-y-3.5 mb-8">
            <div className="flex items-center justify-between border-b border-gray-200/50 pb-2.5">
              <span className="text-gray-400 text-xs font-bold">رقم الحجز</span>
              <span className="font-mono font-bold text-gray-800 text-sm">{invoiceNumber}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl shrink-0">{getItemIcon(data?.item.type)}</span>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">المنتج / الرحلة</p>
                <p className="text-xs font-black text-gray-700 leading-snug">{data?.item.title}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-gray-200/50 pt-3">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-gray-400 text-xs" />
                <div>
                  <p className="text-[9px] text-gray-400 font-bold">التاريخ</p>
                  <p className="text-[11px] font-bold text-gray-700">{data?.booking.date || formattedDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <FaMoneyBillWave className="text-gray-400 text-xs" />
                <div>
                  <p className="text-[9px] text-gray-400 font-bold">المبلغ المطلوب نقداً</p>
                  <p className="text-[11px] font-bold text-[#EB662B]"><PriceDisplay price={data?.totalPrice || 0} /></p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Link 
              to="/explore/egypt" 
              className="w-full py-3.5 bg-[#EB662B] text-white font-extrabold rounded-xl hover:bg-[#d55822] transition shadow-md flex items-center justify-center gap-2"
            >
              <FaCompass /> استمر في الاستكشاف
            </Link>

            <Link 
              to="/" 
              className="w-full py-3.5 bg-white border border-gray-200 text-gray-500 font-extrabold rounded-xl hover:bg-gray-50 hover:text-gray-800 transition flex items-center justify-center gap-2"
            >
              <FaHome /> العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================================
     CASE 2: ONLINE PAYMENT SUCCESS SCREEN (Premium Voucher/Invoice Style)
     ========================================================================== */
  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto">
        
        {/* Print-only stylesheet to isolate the invoice card when printing */}
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-invoice, #printable-invoice * {
              visibility: visible;
            }
            #printable-invoice {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              border: none !important;
              box-shadow: none !important;
            }
          }
        `}} />

        {/* Success Header Notification (Hidden in print) */}
        <div className="text-center mb-8 print:hidden">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4 animate-bounce">
            <FaCheck className="text-2xl" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#05073C]">حجزك مؤكد بنجاح! 🎉</h2>
          <p className="text-gray-500 mt-2">لقد أرسلنا تفاصيل التذكرة والفاتورة إلى بريدك الإلكتروني.</p>
        </div>

        {/* Invoice Card */}
        <div 
          id="printable-invoice" 
          className="bg-white border-t-[10px] border-t-[#EB662B] border border-gray-200/80 rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden print:border-t-4"
        >
          {/* Top Decorative Line */}
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#EB662B] to-[#D4AF37]" />

          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-gray-100 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#05073C] to-[#1a1d5e] rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-serif font-black text-2xl">K</span>
              </div>
              <div className="text-left">
                <h3 className="font-extrabold text-xl text-[#05073C] tracking-wide">KEMET EGYPT</h3>
                <p className="text-xs text-gray-400 font-medium">Egypt Tourism & Local Booking</p>
              </div>
            </div>
            
            <div className="text-left md:text-right">
              <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest block mb-1">Official Voucher</span>
              <h4 className="font-mono font-bold text-lg md:text-xl text-gray-800">{invoiceNumber}</h4>
              <div className="flex flex-wrap md:justify-end items-center gap-2 mt-2">
                <span className="bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  حجز مؤكد · Confirmed
                </span>
                <span className="text-[11px] text-gray-400 font-medium">{formattedDate} at {formattedTime}</span>
              </div>
            </div>
          </div>

          {/* Customer & Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-gray-100">
            {/* Bill To */}
            <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100/50 text-left">
              <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest block mb-3">Bill To · العميل</span>
              <h5 className="font-extrabold text-base text-gray-800 flex items-center gap-2">
                <FaUser className="text-gray-400 text-sm" />
                {data?.details.firstName} {data?.details.lastName}
              </h5>
              <div className="space-y-1.5 mt-3 text-xs text-gray-500 font-medium">
                <p className="flex items-center gap-2">
                  <FaEnvelope className="text-gray-400" />
                  {data?.details.email}
                </p>
                <p className="flex items-center gap-2">
                  <FaPhone className="text-gray-400" />
                  {data?.details.phone}
                </p>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-orange-50/20 rounded-2xl p-6 border border-orange-100/30 text-left">
              <span className="text-[10px] text-orange-400 uppercase font-black tracking-widest block mb-3">Voucher Details · تفاصيل الحجز</span>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-sm">
                    <FaCalendarAlt />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Date</p>
                    <p className="text-xs font-black text-gray-700">{data?.booking.date || formattedDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-sm">
                    <FaClock />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Time / Schedule</p>
                    <p className="text-xs font-black text-gray-700">{data?.booking.time || "All Day Access"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="py-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left" dir="ltr">
                <thead>
                  <tr className="bg-[#05073C] text-white text-[11px] font-black uppercase tracking-wider rounded-lg">
                    <th className="py-3.5 px-4 rounded-l-xl">Booked Item</th>
                    <th className="py-3.5 px-4 text-center">Type</th>
                    <th className="py-3.5 px-4 text-center">Guests/Qty</th>
                    <th className="py-3.5 px-4 text-right rounded-r-xl">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
                  <tr>
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl shrink-0">{getItemIcon(data?.item.type)}</span>
                        <div>
                          <p className="font-extrabold text-[#05073C] leading-snug">{data?.item.title}</p>
                          <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">Category: {data?.item.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-center capitalize">{data?.item.type}</td>
                    <td className="py-5 px-4 text-center">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-600">
                        {data?.booking.tickets.adult || data?.booking.guests || 1}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-right font-extrabold"><PriceDisplay price={data?.item.price || 0} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Calculation & Stamp */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pt-6 border-t border-gray-100 gap-8">
            
            {/* Kemet Egypt Stamp Seal (PAID - Emerald Green) */}
            <div className="flex justify-start md:justify-center">
              <div className="relative w-36 h-36 border-4 border-double border-emerald-600/80 rounded-full flex flex-col items-center justify-center p-3 rotate-[-12deg] shadow-sm select-none">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">KEMET EGYPT</span>
                <span className="text-3xl font-black text-emerald-600 tracking-wider my-0.5 leading-none">PAID</span>
                <span className="text-[10px] font-bold text-emerald-600 leading-none mt-1">Official Voucher</span>
                <div className="absolute inset-2 border border-dashed border-emerald-600/30 rounded-full pointer-events-none" />
              </div>
            </div>

            {/* Price breakdown */}
            <div className="w-full md:w-80 space-y-3.5 text-sm font-medium text-gray-500">
              <div className="flex justify-between">
                <span>Subtotal · المجموع</span>
                <span className="font-extrabold text-gray-700"><PriceDisplay price={data?.totalPrice ? Math.round(data.totalPrice / 1.05) : 0} /></span>
              </div>
              <div className="flex justify-between">
                <span>Platform Service Fee (5%)</span>
                <span className="font-extrabold text-gray-700"><PriceDisplay price={data?.totalPrice ? Math.round(data.totalPrice * 0.05 / 1.05) : 0} /></span>
              </div>
              
              <div className="rounded-2xl bg-[#05073C] text-white p-5 flex items-center justify-between shadow-lg shadow-blue-900/10">
                <div className="text-left">
                  <p className="font-bold text-xs uppercase text-white/50">Total Paid</p>
                  <p className="text-[9px] text-white/40 mt-0.5">incl. service fee</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-[#D4AF37]"><PriceDisplay price={data?.totalPrice || 0} /></p>
                  <p className="text-[9px] text-emerald-400 font-bold uppercase mt-0.5">Payment Verified ✓</p>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Terms */}
          <div className="border-t border-gray-100 mt-10 pt-6 text-center text-[10px] text-gray-400 leading-relaxed">
            <p>This is an official electronic ticket and booking voucher issued by **KEMET Egypt Tourism Platform**.</p>
            <p className="mt-1">For support, questions, or modifications, contact us at <a href="mailto:support@kemet-egypt.com" className="text-[#EB662B] font-bold underline">support@kemet-egypt.com</a> or via WhatsApp.</p>
          </div>

        </div>

        {/* Action Buttons (Hidden in print) */}
        <div className="flex flex-wrap justify-center items-center gap-4 mt-10 print:hidden">
          <button 
            onClick={handlePrint}
            className="px-8 py-3.5 bg-[#05073C] text-white font-extrabold rounded-xl hover:bg-[#D4AF37] hover:text-[#05073C] transition shadow-md flex items-center gap-2 cursor-pointer"
          >
            <FaPrint /> Print / Save Ticket PDF
          </button>
          
          <Link 
            to="/explore/egypt" 
            className="px-8 py-3.5 bg-[#EB662B] text-white font-extrabold rounded-xl hover:bg-[#d55822] transition shadow-md flex items-center gap-2"
          >
            <FaCompass /> Continue Exploring
          </Link>
          
          <Link 
            to="/" 
            className="px-8 py-3.5 bg-white border border-gray-200 text-gray-500 font-extrabold rounded-xl hover:bg-gray-50 hover:text-gray-800 transition shadow-sm flex items-center gap-2"
          >
            <FaHome /> Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CheckoutSuccess;
