import { FaPaypal, FaCreditCard, FaCheckCircle, FaRegCircle, FaMoneyBillWave, FaApplePay } from "react-icons/fa";

interface PaymentData {
  method: "paypal" | "credit_card" | "cash" | "apple_pay";
  cardNumber: string;
  expirationDate: string;
  cvc: string;
}

interface Props {
  data: PaymentData;
  itemType?: string;
  onChange: (data: PaymentData) => void;
}

const PaymentStep = ({ data, itemType, onChange }: Props) => {
  const handleCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.substring(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    onChange({ ...data, cardNumber: formatted });
  };

  const handleExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.substring(0, 4);
    if (value.length >= 3) {
      value = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    }
    onChange({ ...data, expirationDate: value });
  };

  const handleCvc = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.substring(0, 4);
    onChange({ ...data, cvc: value });
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <h3 className="text-xl font-bold text-[#05073C]">Select a payment method</h3>

      {/* Cash / Pay at Hotel Option */}
      {(itemType === 'food_cart' || itemType === 'hotel' || itemType === 'car') && (
        <div 
          className={`border rounded-2xl p-4 cursor-pointer transition-colors ${
            data.method === "cash" ? "border-[#EB662B] bg-orange-50/30" : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => onChange({ ...data, method: "cash" })}
        >
          <div className="flex items-center gap-4">
            <div className="text-[#EB662B] text-xl">
              {data.method === "cash" ? <FaCheckCircle /> : <FaRegCircle className="text-gray-300" />}
            </div>
            <span className="font-bold flex-1 text-gray-800">
              {itemType === 'hotel' ? 'Pay at Hotel 🏨' : 'Cash on Delivery / Arrival 💵'}
            </span>
            <FaMoneyBillWave className="text-green-600 text-2xl" />
          </div>
          
          {data.method === "cash" && (
            <div className="ml-9 mt-2 text-sm text-gray-500">
              {itemType === 'hotel' 
                ? 'You will pay at the hotel reception upon arrival.' 
                : 'You will pay in cash to the delivery agent or at the location when you arrive.'}
            </div>
          )}
        </div>
      )}

      {/* Apple Pay Option */}
      <div 
        className={`border rounded-2xl p-4 cursor-pointer transition-colors ${
          data.method === "apple_pay" ? "border-[#EB662B] bg-orange-50/30" : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={() => onChange({ ...data, method: "apple_pay" })}
      >
        <div className="flex items-center gap-4">
          <div className="text-[#EB662B] text-xl">
            {data.method === "apple_pay" ? <FaCheckCircle /> : <FaRegCircle className="text-gray-300" />}
          </div>
          <span className="font-bold flex-1 text-gray-800">Apple Pay</span>
          <FaApplePay className="text-gray-900 text-4xl -my-2" />
        </div>
      </div>
      
      {/* PayPal Option */}
      <div 
        className={`border rounded-2xl p-4 cursor-pointer transition-colors ${
          data.method === "paypal" ? "border-[#EB662B] bg-orange-50/30" : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={() => onChange({ ...data, method: "paypal" })}
      >
        <div className="flex items-center gap-4">
          <div className="text-[#EB662B] text-xl">
            {data.method === "paypal" ? <FaCheckCircle /> : <FaRegCircle className="text-gray-300" />}
          </div>
          <span className="font-bold flex-1 text-gray-800">PayPal</span>
          <FaPaypal className="text-[#003087] text-2xl" />
        </div>
        
        {data.method === "paypal" && (
          <div className="ml-9 mt-2 text-sm text-gray-500">
            You will be redirected to the PayPal website after submitting your order.
          </div>
        )}
      </div>

      {/* Credit Card Option */}
      <div 
        className={`border rounded-2xl overflow-hidden transition-colors ${
          data.method === "credit_card" ? "border-[#EB662B]" : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <div 
          className={`p-4 flex items-center gap-4 cursor-pointer ${data.method === "credit_card" ? "bg-orange-50/50 border-b border-[#EB662B]/20" : ""}`}
          onClick={() => onChange({ ...data, method: "credit_card" })}
        >
          <div className="text-[#EB662B] text-xl">
             {data.method === "credit_card" ? <FaCheckCircle /> : <FaRegCircle className="text-gray-300" />}
          </div>
          <span className="font-bold flex-1 text-gray-800">Pay with Credit Card</span>
          <div className="flex gap-2 text-2xl">
            <FaCreditCard className="text-gray-600" />
            {/* Added logos mockup since I can't easily fetch true svgs */}
            <div className="flex gap-1">
               <div className="w-8 h-5 bg-blue-800 rounded flex items-center justify-center text-[8px] text-white font-bold italic">VISA</div>
               <div className="w-8 h-5 bg-orange-500 rounded flex items-center justify-center text-[8px] text-white font-bold">MC</div>
            </div>
          </div>
        </div>

        {data.method === "credit_card" && (
          <div className="p-5 bg-orange-50/30 space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="text-xs text-gray-500 mb-1 block">Card number</label>
                  <input 
                    type="text" 
                    placeholder="1234 5678 9101 3456" 
                    value={data.cardNumber || ""} 
                    onChange={handleCardNumber} 
                    className="w-full border border-gray-200 rounded-lg py-2.5 px-3 bg-white focus:outline-none focus:border-[#EB662B]" 
                  />
               </div>
               <div>
                  <label className="text-xs text-gray-500 mb-1 block">Expiration Date</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    value={data.expirationDate || ""} 
                    onChange={handleExpiry} 
                    className="w-full border border-gray-200 rounded-lg py-2.5 px-3 bg-white focus:outline-none focus:border-[#EB662B]" 
                  />
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="text-xs text-gray-500 mb-1 block">Card Security Code</label>
                  <input 
                    type="password" 
                    placeholder="***" 
                    value={data.cvc || ""} 
                    onChange={handleCvc} 
                    className="w-full border border-gray-200 rounded-lg py-2.5 px-3 bg-white focus:outline-none focus:border-[#EB662B]" 
                  />
               </div>
               <div className="flex items-end pb-2">
                 <a href="#" className="text-xs text-[#EB662B] hover:underline">What is this?</a>
               </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default PaymentStep;
