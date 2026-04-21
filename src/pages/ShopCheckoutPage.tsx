import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaMoneyBillWave, FaPaypal, FaTrash, FaSpinner, FaLock } from "react-icons/fa";
import SectionWrapper from "../components/sections/SectionWrapper";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../api/shopService";
import type { OrderPayload } from "../api/shopService";
import { socialLogin } from "../api/authService";
import DateTimePicker from "../components/Ui/DateTimePicker";
import InvoiceReceipt from "../components/Ui/InvoiceReceipt";

const ShopCheckoutPage = () => {
  const { cart, removeFromCart, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  // Check if user is logged in
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const savedUser = JSON.parse(localStorage.getItem("app_user") || "null");

  const [formData, setFormData] = useState({
    hotel_name: "",
    room_number: "",
    phone: savedUser?.phone || "",
    delivery_date: new Date().toISOString().split("T")[0],
    delivery_time: "12:00",
    payment_method: "Cash on Delivery"
  });

  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any | null>(null); // stores confirmed order for invoice
  const [cartSnapshot, setCartSnapshot] = useState<typeof cart>([]); // snapshot of cart before clearing
  const [errorMsg, setErrorMsg] = useState("");

  // Set default date/time on mount
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFormData(prev => ({
      ...prev,
      delivery_date: today,
      delivery_time: "12:00"
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const placeOrderAndShowInvoice = async (payload: OrderPayload) => {
    await placeOrder(payload);
    // Save cart snapshot before clearing
    const snapshot = [...cart];
    setCartSnapshot(snapshot);
    clearCart();
    const subtotal = snapshot.reduce((s, i) => s + i.quantity * i.product.price, 0);
    const totalWithFees = subtotal * 1.05; // +5% Service Fee only
    // Show invoice
    setInvoiceData({
      invoiceNumber: `KMT-${Date.now().toString().slice(-8)}`,
      issuedAt: new Date().toLocaleString("en-EG", { 
        year: "numeric", month: "long", day: "numeric",
        hour: "2-digit", minute: "2-digit"
      }),
      totalWithFees,
      ...payload,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    setErrorMsg("");

    const deliveryDate = formData.delivery_date || new Date().toISOString().split("T")[0];
    const deliveryTime = formData.delivery_time || "12:00";

    const orderPayload: OrderPayload = {
      hotel_name: formData.hotel_name,
      room_number: formData.room_number,
      phone: formData.phone,
      delivery_date: deliveryDate,
      delivery_time: deliveryTime,
      payment_method: formData.payment_method,
      items: cart.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }))
    };

    try {
      await placeOrderAndShowInvoice(orderPayload);
    } catch (err: any) {
      // If 401: token expired - get a fresh token and retry
      if (err?.response?.status === 401) {
        try {
          if (savedUser?.email) {
            const refreshed = await socialLogin({ 
              name: savedUser.name || "User",
              email: savedUser.email, 
              provider: "google" 
            });
            localStorage.setItem("token", refreshed.token);
            await placeOrderAndShowInvoice(orderPayload);
          } else {
            setErrorMsg("Session expired. Please go to Login and sign in again.");
          }
        } catch (retryErr: any) {
          setErrorMsg(retryErr?.response?.data?.message || "Failed after token refresh. Please login again.");
        }
      } else if (err?.response?.data?.errors) {
        const errs = err.response.data.errors;
        const firstError = Object.values(errs)[0];
        setErrorMsg(`Error: ${Array.isArray(firstError) ? firstError[0] : firstError}`);
      } else {
        setErrorMsg(err?.response?.data?.message || err.message || "Failed to place order. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ===== SHOW INVOICE after success =====
  if (invoiceData) {
    return (
      <InvoiceReceipt
        invoiceNumber={invoiceData.invoiceNumber}
        issuedAt={invoiceData.issuedAt}
        customerName={savedUser?.name || "Valued Customer"}
        customerEmail={savedUser?.email || "—"}
        hotelName={invoiceData.hotel_name}
        roomNumber={invoiceData.room_number}
        phone={invoiceData.phone}
        deliveryDate={invoiceData.delivery_date}
        deliveryTime={invoiceData.delivery_time}
        paymentMethod={invoiceData.payment_method}
        items={cartSnapshot.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        }))}
        totalAmount={invoiceData.totalWithFees || cartSnapshot.reduce((s, i) => s + i.quantity * i.product.price, 0) * 1.10}
      />
    );
  }

  // ===== CHECKOUT FORM =====
  return (
    <div className="bg-gray-50 min-h-screen pb-16 pt-24">
      <SectionWrapper>
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[#05073C]">Checkout & Delivery</h1>
          <p className="text-gray-500 mt-2">Your items will be delivered directly to your hotel room.</p>
        </div>

        {/* Not Logged In Warning */}
        {!isLoggedIn && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-center gap-3">
            <FaLock className="text-amber-500 text-xl flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-800">You are not logged in</p>
              <p className="text-sm text-amber-700">
                Please{" "}
                <Link to="/login" className="underline font-bold">sign in here</Link>{" "}
                before placing your order.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Cart Review Section */}
          <div className="w-full lg:w-7/12">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
              <h2 className="text-xl font-bold border-b pb-4 mb-4">Order Summary ({totalItems} items)</h2>
              
              {cart.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  Your cart is empty. <br/>
                  <Link to="/shop" className="text-blue-600 font-bold hover:underline mt-2 inline-block">Go to Shop</Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-4 items-center">
                      <img 
                        src={item.product.image || "https://images.unsplash.com/photo-1555026615-560bf974fa2e?w=200"} 
                        alt={item.product.name} 
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-grow">
                        <h3 className="font-bold text-gray-800">{item.product.name}</h3>
                        <div className="text-sm text-gray-500">Qty: {item.quantity} × ${item.product.price}</div>
                      </div>
                      <div className="text-lg font-bold text-[#05073C]">
                        ${(item.quantity * item.product.price).toFixed(2)}
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-400 hover:text-red-600 p-2 transition"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4 flex justify-between font-bold text-xl text-[#05073C]">
                    <span>Total:</span>
                    <span className="text-[#EB662B]"><PriceDisplay price={Number(totalPrice.toFixed(2))} /></span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Checkout Form Section */}
          <div className="w-full lg:w-5/12">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
              <h2 className="text-xl font-bold border-b pb-4 mb-4">Delivery Details</h2>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm mb-4">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Hotel Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="hotel_name"
                  required
                  value={formData.hotel_name}
                  onChange={handleChange}
                  placeholder="e.g. Marriott Mena House"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Room Number (if checked in)</label>
                <input 
                  type="text" 
                  name="room_number"
                  value={formData.room_number}
                  onChange={handleChange}
                  placeholder="e.g. Room 412"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">WhatsApp / Phone Number <span className="text-red-500">*</span></label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+20 100 000 0000"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="mb-4">
                <DateTimePicker 
                  compact 
                  onDateChange={(date) => setFormData(prev => ({...prev, delivery_date: date}))} 
                  onTimeChange={(time) => setFormData(prev => ({...prev, delivery_time: time}))} 
                />
              </div>

              <p className="text-xs text-gray-400 mt-1">We will contact you to confirm delivery time.</p>

              <h2 className="text-xl font-bold border-b pb-4 mt-8 mb-4">Payment Method</h2>
              
              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition ${formData.payment_method === 'Cash on Delivery' ? 'border-[#05073C] bg-blue-50/30' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input 
                    type="radio" 
                    name="payment_method" 
                    value="Cash on Delivery"
                    checked={formData.payment_method === "Cash on Delivery"}
                    onChange={handleChange}
                    className="text-[#05073C] w-5 h-5"
                  />
                  <div className="flex items-center gap-2">
                    <FaMoneyBillWave className="text-green-600 text-xl" />
                    <span className="font-semibold text-gray-800">Cash on Delivery (Hotel)</span>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition ${formData.payment_method === 'PayPal' ? 'border-[#05073C] bg-blue-50/30' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input 
                    type="radio" 
                    name="payment_method" 
                    value="PayPal"
                    checked={formData.payment_method === "PayPal"}
                    onChange={handleChange}
                    className="text-[#05073C] w-5 h-5 cursor-pointer"
                  />
                  <div className="flex items-center gap-2">
                    <FaPaypal className="text-[#003087] text-xl" />
                    <span className="font-semibold text-gray-800">PayPal / Credit Card</span>
                  </div>
                </label>
              </div>

              <button 
                type="submit"
                disabled={cart.length === 0 || loading}
                className="w-full mt-6 bg-[#D4AF37] hover:bg-[#b5952f] text-white font-bold text-lg py-4 rounded-xl shadow-lg transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <FaSpinner className="animate-spin" /> : "✓ Confirm & Get Invoice"}
              </button>
              
              <p className="text-xs text-center text-gray-400 mt-2">
                By placing this order you agree to our delivery terms.
              </p>
            </form>
          </div>

        </div>
      </SectionWrapper>
    </div>
  );
};

export default ShopCheckoutPage;
