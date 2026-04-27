import PriceDisplay from "../components/common/PriceDisplay";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import DateTimePicker from "@/components/Ui/DateTimePicker";
import { FaMapMarkerAlt, FaShoppingBag, FaCamera, FaCoffee } from "react-icons/fa";
import InteractiveMap from "@/components/common/InteractiveMap";
import SocialShare from "@/components/common/SocialShare";
import { getBazaarById } from "../api/bazaarService";

const BazaarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [bazaar, setBazaar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const TIME_SLOTS = ["10:15 - 12:15", "12:15 - 14:15", "14:15 - 16:15", "16:15 - 18:15"];
  const [selectedTime, setSelectedTime] = useState<string>(TIME_SLOTS[0]);
  const [tickets, setTickets] = useState<Record<string, number>>({ person: 1 });

  useEffect(() => {
    const fetchBazaar = async () => {
      const syntheticData = location.state?.syntheticData;
      if (syntheticData && Number(id) >= 9000) {
        setBazaar({
            ...syntheticData,
            name: syntheticData.title,
            price: syntheticData.rawPrice || syntheticData.price,
            description: syntheticData.description || "A wonderful traditional market with history and rich culture.",
        });
        setLoading(false);
        return;
      }

      try {
        const data = await getBazaarById(id!);
        setBazaar(data?.data || data);
      } catch (err) {
        console.error("Error loading bazaar details", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBazaar();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center p-20 text-xl font-bold">Loading Bazaar Details...</div>;
  }

  if (!bazaar) {
    return <div className="min-h-screen flex items-center justify-center p-20 text-xl font-bold text-red-500">Bazaar not found!</div>;
  }

  const bazaarImage = bazaar.image?.startsWith('/') || bazaar.image?.startsWith('http') ? bazaar.image : 'https://images.unsplash.com/photo-1542036136-23133de5057b?w=600';
  const bazaarTitle = bazaar.title || bazaar.name || "Amazing Bazaar";
  const bazaarLocation = bazaar.location || "Egypt";
  const bazaarOpen = bazaar.opening_hours || "Daily";
  const bazaarDesc = bazaar.description || "A wonderful traditional market with history and rich culture.";
  const specialtyList = bazaar.specialty ? (typeof bazaar.specialty === 'string' ? JSON.parse(bazaar.specialty) : bazaar.specialty) : ["Spices", "Textiles", "Antiques"];
  
  const titleLc = (bazaar?.title || bazaar?.name || "").toLowerCase();
  const isSettat = titleLc.includes("settat") || titleLc.includes("ستات") || titleLc.includes("زنقة") || titleLc.includes("zan2et");

  // Default gallery fallback if none exists
  let gallery = [
    "/bazaars/clothing.png",
    "/bazaars/accessories.png",
    "/bazaars/spices.png",
    "/bazaars/lanterns.png"
  ];

  if (isSettat) {
    gallery = [
      "/bazaars/fabric_1.png",
      "/bazaars/fabric_2.png",
      "/bazaars/fabric_3.png",
      "/bazaars/clothing.png"
    ];
  }


  
  const handleTicketChange = (key: string, delta: number) => {
    setTickets(prev => ({ ...prev, [key]: Math.max(0, (prev[key] || 0) + delta) }));
  };

  const totalPrice = tickets.person * 200;
  const totalQty = tickets.person;

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      alert("Please select a date for your guided tour");
      return;
    }
    if (totalQty === 0) {
      alert("Please select at least one person for the tour.");
      return;
    }
    
    navigate('/checkout', {
      state: {
        id: bazaar.id || id,
        type: 'bazaar', // Dedicated type prevents UI bugs in checkout
        title: `${bazaarTitle} - Guided Tour`,
        price: totalPrice / 50, // Standardize to USD baseline for checkout conversion
        image: bazaarImage,
        date: selectedDate,
        time: selectedTime,
        tickets: { adult: totalQty, child: 0, infant: 0 },
        breakdown: `Guided tour for ${totalQty} person(s)`
      }
    });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <section className="w-full h-[55vh] relative">
        <img src={bazaarImage} alt={bazaarTitle} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#cd4f3c]/90 via-black/40 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 p-8 max-w-5xl mx-auto flex flex-col md:flex-row items-end justify-between gap-6 pointer-events-none">
           <div className="text-white pointer-events-auto">
             <button onClick={() => navigate(-1)} className="text-white/80 hover:text-white font-bold text-sm tracking-wider uppercase mb-4 inline-block">
               ← GO BACK
             </button>
             <h1 className="text-5xl md:text-7xl font-extrabold mb-4">{bazaarTitle}</h1>
             <p className="flex items-center gap-2 text-lg font-medium">
               <FaMapMarkerAlt /> {bazaarLocation}
             </p>
           </div>
           <div className="bg-white text-[#222] p-4 rounded-xl shadow-xl font-bold pointer-events-auto flex flex-col items-center gap-2">
             <p className="border-b border-gray-100 pb-2 w-full text-center">Open: {bazaarOpen}</p>
             <SocialShare url={window.location.href} title={bazaarTitle} />
           </div>
        </div>
      </section>

      {/* Main Content */}
      <SectionWrapper className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold text-[#222] mb-6">About The Bazaar</h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-8">
                {bazaarDesc}
              </p>

              <h3 className="text-2xl font-bold text-[#222] mb-6">What You'll Find Here</h3>
              <div className="flex flex-wrap gap-3">
                {specialtyList.map((item: any, idx: number) => (
                  <span key={idx} className="px-5 py-2.5 bg-[#fdfaf7] text-gray-700 font-semibold rounded-full border border-gray-200">
                    {item}
                  </span>
                ))}
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden shadow-sm h-64 border border-gray-100 relative group">
                  <img src="/bazaars/clothing.png" alt="Bazaar Fabrics and Clothes" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition duration-300"></div>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-sm h-64 border border-gray-100 relative group">
                  <img src="/bazaars/accessories.png" alt="Traditional Antiquities and Accessories" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition duration-300"></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col gap-6 sticky top-24">
              <h3 className="font-bold text-2xl text-[#222] border-b border-gray-200 pb-4">Reserve Guided Tour</h3>
              


              <div className="text-3xl font-bold text-[#cd4f3c] mb-6"><PriceDisplay price={Number(totalPrice)} /><span className="text-sm text-gray-400 font-normal"> / total</span></div>
              
              <form onSubmit={handleBooking} className="space-y-6">
                <div>
                  <h4 className="font-bold text-[#222] mb-3 text-right" dir="rtl">اختر المواعيد الزمنية للدخول</h4>
                  <div className="flex flex-wrap gap-2 justify-end" dir="rtl">
                    {TIME_SLOTS.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`px-4 py-2 border rounded-lg text-sm font-semibold transition ${selectedTime === slot ? 'border-[#e67e22] text-[#e67e22] bg-[#e67e22]/5' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-2">
                  <DateTimePicker compact showTime={false} accentColor="#e67e22" onDateChange={setSelectedDate} />
                </div>
                
                <div className="space-y-4" dir="rtl">
                  
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-[#f8f9fa]">
                    <div className="bg-[#e67e22] text-white font-bold py-2 px-4 shadow-sm">
                      رسوم الجولة الإرشادية
                    </div>
                    <div className="divide-y divide-gray-200">
                        <div className="flex justify-between items-center p-3 hover:bg-white transition">
                          <div className="flex items-center gap-3 w-1/3">
                            <span className="font-semibold text-gray-800">فرد</span>
                          </div>
                          <span className="font-bold text-gray-700">200 جنيه</span>
                          <div className="flex items-center gap-3">
                            <button type="button" onClick={() => handleTicketChange('person', 1)} className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 font-bold transition">+</button>
                            <span className="w-4 text-center font-bold text-[#222]">{tickets.person}</span>
                            <button type="button" onClick={() => handleTicketChange('person', -1)} className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 font-bold transition">-</button>
                          </div>
                        </div>
                    </div>
                  </div>

                </div>

                <button type="submit" className="w-full py-4 mt-6 bg-[#e67e22] hover:bg-[#d6721b] text-white font-bold rounded-xl transition shadow-md">
                  Reserve Your Guide
                </button>
              </form>
              
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
                <h4 className="font-bold text-[#222]">Top Tips</h4>
                <div className="flex gap-4">
                  <FaShoppingBag className="text-[#cd4f3c] text-lg flex-shrink-0 mt-1" />
                  <p className="text-xs text-gray-600">Haggling is expected! Start at half the offered price.</p>
                </div>
                <div className="flex gap-4">
                  <FaCamera className="text-[#cd4f3c] text-lg flex-shrink-0 mt-1" />
                  <p className="text-xs text-gray-600">Bring your camera for incredible photo opportunities.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-20">
            <InteractiveMap locationName={bazaarLocation} />
          </div>

          {/* Photo Gallery */}
          <h2 className="text-3xl font-bold text-[#222] mb-8 text-center">Market Gallery</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {gallery.map((img, idx) => (
              <div key={idx} className="w-full aspect-square rounded-2xl overflow-hidden shadow-sm group">
                <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
              </div>
            ))}
          </div>

        </div>
      </SectionWrapper>
    </div>
  );
};

export default BazaarDetailsPage;
