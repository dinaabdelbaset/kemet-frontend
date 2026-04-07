import { FaCalendarAlt, FaClock } from "react-icons/fa";
import PriceDisplay from "../Ui/PriceDisplay";
import DateTimePicker from "../Ui/DateTimePicker";

interface BookingDetailsData {
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
}

interface Props {
  data: BookingDetailsData;
  itemPrice: number;
  itemType?: string;
  onChange: (data: BookingDetailsData) => void;
}

const BookingDetailsStep = ({ data, itemPrice, itemType, onChange }: Props) => {
  const handleTicketChange = (type: keyof BookingDetailsData["tickets"], increment: number) => {
    const newCount = Math.max(0, data.tickets[type] + increment);
    onChange({
      ...data,
      tickets: {
        ...data.tickets,
        [type]: newCount
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      {/* Date and Time Selection for Standard Bookings */}
      {itemType !== "flight" && itemType !== 'food_cart' && (
        <div className="space-y-3 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-[#05073C]">When will you visit?</h3>
          <DateTimePicker 
            accentColor="#EB662B"
            onDateChange={(val) => onChange({...data, date: val})}
            onTimeChange={(val) => onChange({...data, time: val})}
          />
        </div>
      )}

      {/* Select Tickets or Food Checkout Modes */}
      <div className="space-y-4">
        
        {itemType === 'food_cart' ? (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-[#05073C]">How would you like your food?</h3>
            <div className="flex bg-gray-100 p-1 rounded-2xl">
                <button 
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${data.serviceType === 'delivery' ? 'bg-white text-[#EB662B] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => onChange({...data, serviceType: 'delivery'})}
                >🚕 Delivery</button>
                <button 
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${data.serviceType === 'reservation' ? 'bg-white text-[#EB662B] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => onChange({...data, serviceType: 'reservation'})}
                >🍽️ Table Reservation</button>
            </div>

            {data.serviceType === 'delivery' ? (
              <div className="space-y-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in">
                <h4 className="font-bold text-gray-900">Delivery Details</h4>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Full Delivery Address</label>
                  <textarea 
                    placeholder="Street name, Building number, Apartment..." 
                    value={data.deliveryAddress || ''}
                    onChange={(e) => onChange({...data, deliveryAddress: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#EB662B] resize-none h-24"
                  ></textarea>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Special Instructions (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="Leave at the door, ring bell..." 
                    value={data.deliveryNotes || ''}
                    onChange={(e) => onChange({...data, deliveryNotes: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#EB662B]"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in">
                <h4 className="font-bold text-gray-900">Reservation Details</h4>
                <div className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900">Number of Guests</h4>
                  </div>
                  <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden h-10">
                    <button 
                      className="px-3 hover:bg-gray-50 h-full text-gray-500 font-medium"
                      onClick={() => onChange({...data, guests: Math.max(1, (data.guests || 1) - 1)})}
                    >-</button>
                    <div className="w-10 text-center font-semibold text-gray-900 h-full flex items-center justify-center bg-gray-50">{data.guests}</div>
                    <button 
                      className="px-3 hover:bg-gray-50 h-full text-gray-600 font-medium"
                      onClick={() => onChange({...data, guests: (data.guests || 1) + 1})}
                    >+</button>
                  </div>
                </div>
                <div className="pt-2">
                  <h4 className="font-bold text-gray-900 mb-3">Select Arrival Time</h4>
                  <DateTimePicker 
                    accentColor="#EB662B"
                    onDateChange={(val) => onChange({...data, date: val})}
                    onTimeChange={(val) => onChange({...data, time: val})}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (itemType === 'museum' || itemType === 'bazaar') ? (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#05073C]">Ticket Summary</h3>
            <div className="bg-[#14213d] text-white rounded-2xl p-6 text-center shadow-lg">
               <p className="text-gray-300 font-medium mb-2">Tickets and quantities are finalized.</p>
               <p className="text-sm text-gray-400">Please proceed to Step 2 to enter your details.</p>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-[#05073C]">Select Your Tickets</h3>
            
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-2">
              <p className="flex items-start gap-2 before:content-['•'] before:text-gray-400">
                Free for kids under 6 and disabled visitors (74%+)
              </p>
              <p className="flex items-start gap-2 before:content-['•'] before:text-gray-400">
                Pregnant women, families with strollers, and visitors on crutches can buy priority tickets at the venue
              </p>
            </div>

            {/* Adult Ticket */}
            <div className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-900">Adult (18+)</h4>
                <div className="font-bold text-[#EB662B] mt-1"><PriceDisplay amount={itemPrice} /></div>
              </div>
              <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden h-10">
                <button 
                  className="px-3 hover:bg-gray-50 h-full text-gray-500 font-medium"
                  onClick={() => handleTicketChange("adult", -1)}
                >-</button>
                <div className="w-10 text-center font-semibold text-gray-900 h-full flex items-center justify-center bg-gray-50">{data.tickets.adult}</div>
                <button 
                  className="px-3 hover:bg-gray-50 h-full text-gray-600 font-medium"
                  onClick={() => handleTicketChange("adult", 1)}
                >+</button>
              </div>
            </div>

            {/* Child Ticket */}
            <div className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-900">Child (6-17)</h4>
                <p className="text-xs text-gray-500 mt-1">With valid ID</p>
                <p className="text-xs text-gray-500">Only in combination with: Adult (18+)</p>
                <div className="font-bold text-[#EB662B] mt-1"><PriceDisplay amount={itemType === 'flight' ? Math.round(itemPrice * 0.75) : 22} /></div>
              </div>
              <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden h-10">
                <button 
                  className="px-3 hover:bg-gray-50 h-full text-gray-500 font-medium"
                  onClick={() => handleTicketChange("child", -1)}
                >-</button>
                <div className="w-10 text-center font-semibold text-gray-900 h-full flex items-center justify-center bg-gray-50">{data.tickets.child}</div>
                <button 
                  className="px-3 hover:bg-gray-50 h-full text-gray-600 font-medium"
                  onClick={() => handleTicketChange("child", 1)}
                >+</button>
              </div>
            </div>

            {/* Infant Ticket */}
            <div className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-900">Infant (0-5)</h4>
                <p className="text-xs text-gray-500 mt-1">Only in combination with: Adult (18+)</p>
                <div className="font-bold text-[#EB662B] mt-1 uppercase text-sm">Free</div>
              </div>
              <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden h-10">
                <button 
                  className="px-3 hover:bg-gray-50 h-full text-gray-500 font-medium"
                  onClick={() => handleTicketChange("infant", -1)}
                >-</button>
                <div className="w-10 text-center font-semibold text-gray-900 h-full flex items-center justify-center bg-gray-50">{data.tickets.infant}</div>
                <button 
                  className="px-3 hover:bg-gray-50 h-full text-gray-600 font-medium"
                  onClick={() => handleTicketChange("infant", 1)}
                >+</button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default BookingDetailsStep;
