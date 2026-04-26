import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheck, FaCalendarAlt, FaClock, FaGift } from "react-icons/fa";
import SectionWrapper from "../components/sections/SectionWrapper";
import PriceDisplay from "../components/common/PriceDisplay";

import BookingDetailsStep from "../components/checkout/BookingDetailsStep";
import YourDetailsStep from "../components/checkout/YourDetailsStep";
import PaymentStep from "../components/checkout/PaymentStep";
import CheckoutSuccess from "../components/checkout/CheckoutSuccess";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useApp } from "../context/AppContext";
import { createBooking } from "../api/bookingService";
import axiosClient from "../api/axiosClient";

const STEPS = [
  { id: 1, label: "Booking Details" },
  { id: 2, label: "Your Details" },
  { id: 3, label: "Payment" },
];

export interface CheckoutState {
  item: {
    id: number;
    type: string;
    title: string;
    price: number;
    image: string;
    items?: any[];
  };
  bookingId?: string;
  booking: {
    date: string | null;
    time: string | null;
    tickets: {
      adult: number;
      child: number;
      infant: number;
    };
    serviceType?: "delivery" | "reservation";
    guests?: number;
    deliveryAddress?: string;
    deliveryNotes?: string;
  };
  details: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  payment: {
    method: "paypal" | "credit_card" | "cash" | "apple_pay";
    cardNumber: string;
    expirationDate: string;
    cvc: string;
  };
  totalPrice: number;
}

const CheckoutPage = () => {
  const location = useLocation();
  const { showToast, user } = useApp();
  useDocumentTitle("Checkout");

  // Initialize state with passed location state, or fallback
  const navigate = useNavigate();

  const [checkoutData, setCheckoutData] = useState<CheckoutState>({
    item: {
      id: location.state?.id || 1,
      type: location.state?.type || "tour",
      title: location.state?.title || "Wine tasting In Tuscany",
      price: location.state?.price || 32,
      image: location.state?.image || "https://images.unsplash.com/photo-1504285806655-24e5a9eeac18?q=80&w=600&auto=format&fit=crop",
      items: location.state?.items || [],
    },
    booking: {
      date: location.state?.date || null,
      time: location.state?.time || null,
      tickets: {
        adult: location.state?.tickets?.adult ?? 2,
        child: location.state?.tickets?.child ?? 0,
        infant: location.state?.tickets?.infant ?? 0,
      },
      serviceType: "delivery",
      guests: 1,
      deliveryAddress: "",
      deliveryNotes: "",
    },
    details: {
      firstName: user?.name ? user.name.split(' ')[0] : "",
      lastName: user?.name ? user.name.split(' ').slice(1).join(' ') : "",
      phone: user?.phone || "",
      email: user?.email || "",
    },
    payment: {
      method: "credit_card",
      cardNumber: "",
      expirationDate: "",
      cvc: "",
    },
    totalPrice: (location.state?.type === 'food_cart' || location.state?.type === 'museum' || location.state?.type === 'bazaar' || location.state?.type === 'ai_trip') ? location.state?.price : 0,
  });

  const [currentStep, setCurrentStep] = useState(() => ((location.state?.type === "flight" || location.state?.type === "museum" || location.state?.type === "bazaar" || location.state?.type === "ai_trip") ? 2 : 1));
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  
  // OTP Feature Hooks
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState("");
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Read cashback % earned from destination selections (set by ParallaxCTA)
  const CASHBACK_PCT = parseInt(localStorage.getItem("kemet_cashback_pct") || "0");
  const cashbackAmount = CASHBACK_PCT > 0 && checkoutData.totalPrice > 0
    ? Math.round((checkoutData.totalPrice * CASHBACK_PCT) / 100)
    : 0;

  // Recalculate total price when tickets change
  useEffect(() => {
    if (checkoutData.item.type === 'museum' || checkoutData.item.type === 'bazaar' || checkoutData.item.type === 'ai_trip') {
      // Museum/Bazaar/AI Trip ticket quantities and prices are fully pre-calculated on the Details page
      return;
    }

    if (checkoutData.item.type === 'food_cart') {
      const baseFoodPrice = location.state?.price || 0;
      const deliveryFee = checkoutData.booking.serviceType === 'delivery' ? 1.05 : 0; // ~50 EGP
      setCheckoutData((prev) => ({ ...prev, totalPrice: baseFoodPrice + deliveryFee }));
      return; 
    }

    if (checkoutData.item.type === 'car') {
      setCheckoutData((prev) => ({ ...prev, totalPrice: checkoutData.item.price }));
      return;
    }

    // Basic pricing logic: Adults full price, children discounted (e.g., 22), infant 0.
    const adultPrice = checkoutData.item.price;
    const childPrice = (checkoutData.item.type === 'flight' || checkoutData.item.type === 'train' || checkoutData.item.type === 'bus') 
                       ? Math.round(adultPrice * 0.75) 
                       : 22; 
    const infantPrice = 0;

    const total =
      checkoutData.booking.tickets.adult * adultPrice +
      checkoutData.booking.tickets.child * childPrice +
      checkoutData.booking.tickets.infant * infantPrice;

    setCheckoutData((prev) => ({ ...prev, totalPrice: total }));
  }, [checkoutData.booking.tickets, checkoutData.item.price, checkoutData.item.type, checkoutData.booking.serviceType]);

  const handleNextStep = async () => {
    if (isSubmitting) return;
    let newErrors: string[] = [];

    // Step 1 Validation
    if (currentStep === 1) {
      if (checkoutData.item.type === 'food_cart') {
        if (checkoutData.booking.serviceType === 'delivery' && !checkoutData.booking.deliveryAddress?.trim()) {
          newErrors.push("Please provide a delivery address.");
        }
        if (checkoutData.booking.serviceType === 'reservation') {
          if (!checkoutData.booking.date) newErrors.push("Please select a date for your reservation.");
          if (!checkoutData.booking.guests || checkoutData.booking.guests < 1) newErrors.push("Please select the number of guests.");
        }
      } else {
        if (checkoutData.item.type !== 'flight' && !checkoutData.booking.date) {
          newErrors.push("Please select a date for your booking.");
        }
        if (checkoutData.booking.tickets.adult === 0 && checkoutData.booking.tickets.child === 0) {
          newErrors.push("Please select at least one ticket (Adult or Child).");
        }
      }
    }

    // Step 2 Validation
    if (currentStep === 2) {
      if (!checkoutData.details.firstName.trim()) newErrors.push("First name is required.");
      if (!checkoutData.details.lastName.trim()) newErrors.push("Last name is required.");
      if (!checkoutData.details.email.trim() || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(checkoutData.details.email)) {
        newErrors.push("A valid email address is required.");
      }
      if (!checkoutData.details.phone.trim()) newErrors.push("Phone number is required.");
    }

    // Step 3 Validation (We simulate a fake card check if needed, but for now just passing)
    if (currentStep === 3) {
      if (checkoutData.payment.method === "credit_card") {
        const cardClean = checkoutData.payment.cardNumber.replace(/\s/g, "");
        if (cardClean.length !== 16) {
          newErrors.push("A valid 16-digit credit card number is required.");
        }
        if (checkoutData.payment.expirationDate.length !== 5) {
          newErrors.push("A valid expiration date (MM/YY) is required.");
        }
        if (checkoutData.payment.cvc.length < 3) {
          newErrors.push("A valid CVC code is required.");
        }
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      // Removed scrolling up assuming errors are visible near the button, or we can scroll
      return; 
    }

    setErrors([]); // Clear errors before proceeding

    if (currentStep < 3) {
         if (currentStep === 2) {
             setIsSubmitting(true);
             try {
                await axiosClient.post("/checkout/send-otp", { email: checkoutData.details.email });
                setShowOtpModal(true);
             } catch (e: any) {
                setErrors([e.response?.data?.message || "Failed to send OTP to your email. Please try again."]);
             } finally {
                setIsSubmitting(false);
             }
             return;
         }
       setCurrentStep((prev) => prev + 1);
       window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
       try {
           setIsSubmitting(true);
           const isFood = checkoutData.item.type === 'food_cart';
           const payload = {
               item_type: isFood ? `food_${checkoutData.booking.serviceType}` : checkoutData.item.type,
               item_title: checkoutData.item.title,
               item_image: checkoutData.item.image,
               item_id: checkoutData.item.id,
               date_info: isFood && checkoutData.booking.serviceType === 'delivery' 
                 ? `Delivery to: ${checkoutData.booking.deliveryAddress}`
                 : `${checkoutData.booking.date} ${checkoutData.booking.time || ''}`.trim(),
               total_price: checkoutData.totalPrice,
               guests: isFood ? (checkoutData.booking.guests || 1) : (checkoutData.booking.tickets.adult + checkoutData.booking.tickets.child + checkoutData.booking.tickets.infant),
               customer_first_name: checkoutData.details.firstName,
               customer_last_name: checkoutData.details.lastName,
               customer_email: checkoutData.details.email,
               customer_phone: checkoutData.details.phone
           };
           const res = await createBooking(payload);
           
           if (res && res.bookingId) {
             setCheckoutData(prev => ({ ...prev, bookingId: res.bookingId }));
           }
           
           showToast("Booking Completed Successfully!", false);
           setIsSuccess(true);
           window.scrollTo({ top: 0, behavior: "smooth" });
       } catch (error: any) {
           console.error("Booking err:", error);
           const errMsg = error.response?.data?.message;
           if (error.response?.status === 401 || errMsg === 'Unauthenticated.') {
               showToast("You must be logged in to complete this order. Redirecting...", true);
               setTimeout(() => {
                 navigate('/login', { state: { returnTo: location.pathname, ...location.state } });
               }, 1500);
           } else {
               setErrors([errMsg || "Failed to complete booking. Please try again."]);
           }
       } finally {
           setIsSubmitting(false);
       }
    }
  };

  const handleBackStep = () => {
    if (currentStep > (checkoutData.item.type === 'flight' ? 2 : 1)) {
      setErrors([]); 
      setCurrentStep((prev) => prev - 1);
    } else if (currentStep === 2 && checkoutData.item.type === 'flight') {
      // If it's a flight and they are on step 2, back should ideally go back to flight selection
      window.history.back();
    }
  };

  if (isSuccess) {
    return <CheckoutSuccess data={checkoutData} />;
  }

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otpValues];
    newOtp[index] = val.slice(-1);
    setOtpValues(newOtp);
    if (val && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const submitOtpAndProceed = async () => {
    if (otpValues.join('').length === 4) {
      setOtpError("");
      try {
        // Call the real backend API
        await axiosClient.post("/checkout/verify-otp", { 
           email: checkoutData.details.email, 
           otp: otpValues.join('') 
        });
        
        setShowOtpModal(false);
        setCurrentStep(3);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (e: any) {
         setOtpError(e.response?.data?.message || "رمز غير صحيح.");
      }
    } else {
      showToast("Please enter the complete 4-digit code first.", true);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navbar Placeholder - assumed to be handled by RootLayout but since this might be a full page, 
          it renders under RootLayout's navbar usually. */}
      
      {/* Step Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded-full overflow-hidden">
             <div 
               className="h-full bg-[#EB662B] transition-all duration-300"
               style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
             ></div>
          </div>
          
          {STEPS.map((step) => (
            <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300
                  ${currentStep >= step.id ? "bg-[#EB662B] text-white" : "bg-gray-200 text-gray-500"}
                `}
              >
                {currentStep > step.id ? <FaCheck className="text-sm" /> : step.id}
              </div>
              <span className={`text-sm font-medium ${currentStep >= step.id ? "text-[#EB662B]" : "text-gray-400"}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <SectionWrapper className="max-w-6xl mx-auto pt-4 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form Content */}
        <div className="lg:col-span-2 space-y-8">
          {currentStep === 1 && (
            <BookingDetailsStep 
              data={checkoutData.booking} 
              itemPrice={checkoutData.item.price}
              itemType={checkoutData.item.type}
              onChange={(booking) => setCheckoutData(prev => ({ ...prev, booking }))}
            />
          )}
          {currentStep === 2 && (
            <YourDetailsStep 
              data={checkoutData.details}
              onChange={(details: any) => setCheckoutData(prev => ({ ...prev, details }))}
            />
          )}
          {currentStep === 3 && (
            <PaymentStep 
               data={checkoutData.payment}
               onChange={(payment: any) => setCheckoutData(prev => ({ ...prev, payment }))}
            />
          )}
        </div>

        {/* Right Sidebar - Tickets Overview */}
        <div className="lg:col-span-1">
          <div className="bg-white border text-[#05073C] border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
            <h3 className="text-xl font-bold mb-6">
              {checkoutData.item.type === 'food_cart' ? 'Your Order Overview' : 'Your Tickets Overview'}
            </h3>
            
            {/* Item Info */}
            <div className="flex gap-4 mb-6">
              <img 
                src={checkoutData.item.image} 
                alt={checkoutData.item.title} 
                className="w-24 h-16 object-cover rounded-lg"
              />
              <div>
                <h4 className="font-bold text-gray-900 border-b border-transparent leading-tight mb-2">
                  {checkoutData.item.title}
                </h4>
                <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                  {checkoutData.booking.date && (
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt className="text-[#EB662B]" /> 
                      {checkoutData.booking.date}
                    </span>
                  )}
                  {checkoutData.booking.time && (
                    <span className="flex items-center gap-1">
                      <FaClock className="text-[#EB662B]" /> 
                      {checkoutData.booking.time}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <hr className="border-gray-100 my-4" />

            {/* Tickets Breakdown */}
            <div className="space-y-4">
              {checkoutData.item.type === 'food_cart' ? (
                <>
                  {checkoutData.item.items?.map((cartItem: any) => (
                    <div key={cartItem.id} className="flex justify-between items-start text-sm">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 shrink-0 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-xs text-gray-600">
                          {cartItem.quantity}
                        </span>
                        <div className="text-gray-600">
                          <p className="line-clamp-2">{cartItem.meal.title}</p>
                          {cartItem.extras?.length > 0 && (
                            <p className="text-[10px] text-gray-400 mt-0.5">With: {cartItem.extras.join(", ")}</p>
                          )}
                        </div>
                      </div>
                      <span className="font-semibold"><PriceDisplay price={cartItem.totalPrice} /></span>
                    </div>
                  ))}
                  {checkoutData.booking.serviceType === 'delivery' && (
                    <>
                      <hr className="border-gray-100" />
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span className="font-semibold text-gray-900"><PriceDisplay price={1.05} /></span>
                      </div>
                    </>
                  )}
                </>
              ) : (checkoutData.item.type === 'museum' || checkoutData.item.type === 'bazaar' || checkoutData.item.type === 'ai_trip') ? (
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 shrink-0 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-xs text-gray-600">
                      {checkoutData.booking.tickets.adult}
                    </span>
                    <span className="text-gray-600 leading-snug pr-4">
                       {location.state?.breakdown || "Selected Tickets"}
                    </span>
                  </div>
                  <span className="font-semibold"><PriceDisplay price={checkoutData.item.price} /></span>
                </div>
              ) : (checkoutData.item.type === 'car') ? (
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 shrink-0 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-xs text-gray-600">
                      1
                    </span>
                    <span className="text-gray-600 leading-snug pr-4">
                       Private Vehicle
                    </span>
                  </div>
                  <span className="font-semibold"><PriceDisplay price={checkoutData.item.price} /></span>
                </div>
              ) : (
                <>
                  {checkoutData.booking.tickets.adult > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-xs text-gray-600">
                          {checkoutData.booking.tickets.adult}
                        </span>
                        <span className="text-gray-600">{checkoutData.item.type === 'hotel' ? 'Nights' : 'Adult (18+)'} (<PriceDisplay price={checkoutData.item.price} />)</span>
                      </div>
                      <span className="font-semibold"><PriceDisplay price={checkoutData.booking.tickets.adult * checkoutData.item.price} /></span>
                    </div>
                  )}
                  {checkoutData.item.type !== 'hotel' && checkoutData.booking.tickets.child > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-xs text-gray-600">
                          {checkoutData.booking.tickets.child}
                        </span>
                        <span className="text-gray-600">Child (6-17)</span>
                      </div>
                      <span className="font-semibold"><PriceDisplay price={checkoutData.booking.tickets.child * (checkoutData.item.type === 'flight' ? Math.round(checkoutData.item.price * 0.75) : 22)} /></span>
                    </div>
                  )}
                  {checkoutData.item.type !== 'hotel' && checkoutData.booking.tickets.infant > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-xs text-gray-600">
                          {checkoutData.booking.tickets.infant}
                        </span>
                        <span className="text-gray-600">Infant (0-5)</span>
                      </div>
                      <span className="font-semibold"><PriceDisplay price={0} /></span>
                    </div>
                  )}
                </>
              )}
            </div>

            <hr className="border-gray-100 my-4" />

            {/* Total Menu */}
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-gray-800 text-lg">Total Price</span>
              <span className="font-bold text-[#EB662B] text-xl">
                <PriceDisplay price={checkoutData.totalPrice} />
              </span>
            </div>

            {/* Cashback Badge */}
            {cashbackAmount > 0 && (
              <div className="mb-4 rounded-xl overflow-hidden border border-[#4caf82]/30 bg-[#4caf82]/5">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#4caf82]/10 border-b border-[#4caf82]/20">
                  <FaGift className="text-[#4caf82] text-sm shrink-0" />
                  <span className="text-[#4caf82] text-[11px] font-black uppercase tracking-widest">
                    🎁 كاش باك Kemet
                  </span>
                </div>
                <div className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">هدية {CASHBACK_PCT}% كاش باك على هذا الحجز</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">ستُضاف تلقائياً لمحفظتك ✨</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#4caf82] font-black text-lg">
                      +<PriceDisplay price={cashbackAmount} />
                    </p>
                    <p className="text-[10px] text-gray-400">كاش باك مكتسب</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Messages */}
            {errors.length > 0 && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
                <ul className="list-disc pl-5 space-y-1">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Step / Complete Button */}
            <button 
              onClick={handleNextStep}
              disabled={isSubmitting}
              className={`w-full font-bold py-3.5 px-4 rounded-xl transition shadow-md flex justify-center items-center gap-2 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-[#EB662B] hover:bg-[#d55822] text-white shadow-orange-500/20'}`}
            >
              {isSubmitting ? <span className="animate-pulse">Processing...</span> : currentStep === 3 ? "Complete Booking" : "Go to the Next Step"}
            </button>
            {(currentStep > 1 || (currentStep === 2 && checkoutData.item.type === 'flight')) && (
               <button 
                 onClick={handleBackStep}
                 className="w-full mt-3 text-gray-500 hover:text-gray-800 font-medium py-2 rounded-xl transition text-sm underline"
               >
                 Back
               </button>
            )}
          </div>
        </div>
      </SectionWrapper>

      {/* OTP Modal Overlay - specifically styled to match user mockup */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in" dir="rtl">
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl relative">
            <button 
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition"
              aria-label="Close modal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="p-8 text-center bg-gray-50/50 rounded-t-lg">
              <h2 className="text-xl font-bold text-[#e67e22] mb-3">رقم المرور لمرة واحدة (OTP)</h2>
              <p className="text-gray-600 font-medium text-sm leading-relaxed mb-6">
                أدخل رمز التحقق المكون من 4 أرقام الذي تم إرساله إلى البريد الإلكتروني المسجل<br/>
                <strong className="text-gray-800">{checkoutData.details.email || "al***@gmail.com"}</strong>
              </p>

              <div className="flex items-center justify-center gap-4 mb-4" dir="ltr">
                {otpValues.map((val, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpInputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg text-gray-800 focus:border-[#e67e22] focus:ring-2 focus:ring-[#e67e22]/20 transition-all shadow-sm outline-none bg-white"
                  />
                ))}
              </div>
              <p className="text-sm font-bold text-[#e67e22] mt-4 opacity-0 transition-opacity" style={{ opacity: otpValues.join('').length === 4 ? 1 : 0 }}>
                ✓ جاهز للتأكيد
              </p>
            </div>

            <div className="bg-white p-6 rounded-b-lg text-center border-t border-gray-100">
              {otpError && <p className="text-red-500 font-semibold mb-2">{otpError}</p>}
              <p className="text-sm text-[#222] font-semibold mb-6 flex justify-center items-center gap-1">
                لم تتلق كلمة المرور لمرة واحدة؟ 
                <button 
                  type="button"
                  className="text-[#e67e22] hover:text-[#d6721b] underline"
                  onClick={() => axiosClient.post("/checkout/send-otp", { email: checkoutData.details.email })}
                >
                  إعادة إرسال
                </button>
              </p>

              <button 
                onClick={submitOtpAndProceed}
                className="bg-[#edaeb3] hover:bg-[#e67e22] hover:text-white text-[#fff] min-w-[140px] font-bold py-2.5 px-6 rounded transition-colors duration-300 shadow-md inline-block w-auto mx-auto"
                style={{ backgroundColor: otpValues.join('').length === 4 ? '#e67e22' : '#f0b263' }}
              >
                الاستمرار
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
