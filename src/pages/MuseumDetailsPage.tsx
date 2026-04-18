import SectionWrapper from "@/components/sections/SectionWrapper";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaClock, FaTicketAlt, FaInfoCircle, FaMinus, FaPlus } from "react-icons/fa";
import InteractiveMap from "@/components/common/InteractiveMap";
import SocialShare from "@/components/common/SocialShare";
import ReviewSection from "@/components/common/ReviewSection";
import DateTimePicker from "@/components/Ui/DateTimePicker";
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

const MuseumDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [museum, setMuseum] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState({ egAdult: 1, egStudent: 0, foreign: 0 });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchMuseum = async () => {
      try {
        const res = await axiosClient.get(`/museums/${id}`);
        setMuseum(res.data?.data || res.data);
      } catch (err) {
        console.error("Error loading museum details", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMuseum();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center p-20 text-xl font-bold">Loading Museum Details...</div>;
  }

  if (!museum) {
    return <div className="min-h-screen flex items-center justify-center p-20 text-xl font-bold text-red-500">Museum not found!</div>;
  }

  const museumDesc = museum.description || "A wonderful museum to explore the rich history of Egypt.";
  const museumImage = museum.image?.startsWith('/') || museum.image?.startsWith('http') ? museum.image : 'https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=1000&auto=format&fit=crop';
  
  const basePrice = museum.ticket_price || museum.price || 150;
  const ticketPrices = { egAdult: `${basePrice} EGP`, egStudent: `${Math.round(basePrice/2)} EGP`, foreigner: `${basePrice * 10} EGP` };
  
  const highlights = museum.highlights ? (typeof museum.highlights === 'string' ? JSON.parse(museum.highlights) : museum.highlights) : ["Historical artifacts", "Guided tours available", "Cultural heritage"];



  const handleTicketChange = (type: 'egAdult' | 'egStudent' | 'foreign', delta: number) => {
    setTickets(prev => ({ ...prev, [type]: Math.max(0, prev[type] + delta) }));
  };

  const parsePrice = (priceStr: string) => parseInt(priceStr.replace(/\D/g, '')) || 0;
  const totalPrice = 
    tickets.egAdult * parsePrice(ticketPrices.egAdult) +
    tickets.egStudent * parsePrice(ticketPrices.egStudent) +
    tickets.foreign * parsePrice(ticketPrices.foreigner);

  const totalQty = tickets.egAdult + tickets.egStudent + tickets.foreign;

  const handleReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return alert("Please select a date for your visit.");
    if (totalQty === 0) return alert("Please select at least one ticket.");
    
    navigate('/checkout', {
      state: {
        id: museum.id || id,
        type: 'museum',
        title: museum.title || museum.name,
        price: totalPrice / 50, // Convert to USD logic standard so checkout converter displays correctly
        image: museumImage,
        date: selectedDate,
        tickets: { adult: 1, child: 0, infant: 0 }, // Stub to bypass empty ticket checkout validation
        breakdown: `${tickets.egAdult}x Eg-Adult, ${tickets.egStudent}x Eg-Student, ${tickets.foreign}x Foreigner`
      }
    });
  };

  return (
    <div className="bg-white min-h-screen pb-16">
      {/* Hero */}
      <section className="relative w-full h-[500px]">
        <img src={museumImage} alt={museum.title || museum.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="max-w-4xl text-white">
            <Link to="/museums" className="text-white/80 hover:text-white mb-6 inline-block font-semibold tracking-wide uppercase text-sm">
              ← Back to Museums
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight drop-shadow-lg mb-4">
              {museum.title || museum.name}
            </h1>
            <div className="inline-block bg-white/10 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/20">
              <SocialShare url={window.location.href} title={museum.title || museum.name} />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <SectionWrapper className="py-20">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-3xl font-bold text-[#14213d] font-serif mb-6 flex items-center gap-3">
                <FaInfoCircle className="text-[#cd4f3c] text-2xl" /> About the Exhibition
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                {museumDesc}
              </p>
              <div className="bg-[#fcfbf9] p-6 text-right border-r-4 border-[#cd4f3c] rounded-l-lg shadow-sm">
                <p className="text-lg text-gray-700 leading-relaxed font-arabic">
                  {museumDesc}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#14213d] font-serif mb-4">What's Included</h3>
              <ul className="space-y-4">
                {highlights.map((hlt: any, idx: number) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="w-2 h-2 rounded-full bg-[#cd4f3c]"></span>
                    {hlt}
                  </li>
                ))}
              </ul>
            </div>

            <ReviewSection rating={museum.rating || 4.8} reviewCount={museum.reviews_count || 124} itemId={id || "1"} itemType="museum" />

            <InteractiveMap locationName={`${museum.location || 'Egypt'}`} />
          </div>

          <div className="lg:col-span-1">
             <div className="bg-[#14213d] text-white p-5 rounded-3xl shadow-xl sticky top-24 max-h-[calc(100vh-4rem)] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-track]:bg-transparent">
                <h3 className="text-xl font-bold mb-4 text-center font-serif border-b border-white/20 pb-2">Plan Your Visit</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="flex items-center gap-2 text-gray-300 text-sm"><FaClock /> Opening Hours</span>
                    <span className="font-semibold text-xs">{museum.opening_hours || "9:00 AM - 5:00 PM"}</span>
                  </div>
                  
                  {/* Detailed Ticket Pricing */}
                  <div className="pt-1">
                    <span className="flex items-center gap-2 text-gray-300 font-semibold mb-2 text-sm"><FaTicketAlt /> Entry Tickets</span>
                    <div className="space-y-1 text-xs bg-black/20 p-3 rounded-xl border border-white/5">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Egyptian Adult</span>
                        <span className="font-bold text-[#f4a261]">{ticketPrices.egAdult}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Egyptian Student</span>
                        <span className="font-bold text-[#f4a261]">{ticketPrices.egStudent}</span>
                      </div>
                      <div className="border-t border-white/10 mt-1 pt-1 flex justify-between">
                        <span className="text-gray-400">Foreign Tourist</span>
                        <span className="font-bold text-[#f4a261]">{ticketPrices.foreigner}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleReservation} className="space-y-4">
                  <div>
                    <DateTimePicker compact showTime={false} accentColor="#f4a261" onDateChange={setSelectedDate} />
                  </div>
                  
                  {/* Interactive Ticket Selectors */}
                  <div>
                    <label className="block text-xs text-gray-300 mb-2 font-semibold border-b border-white/10 pb-1">Select Tickets</label>
                    <div className="space-y-2">
                      {/* Egyptian Adult */}
                      <div className="flex items-center justify-between bg-white/5 px-2 py-1 rounded-lg border border-white/10">
                        <span className="text-xs text-gray-200">Egyptian Adult</span>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => handleTicketChange('egAdult', -1)} className="w-6 h-6 rounded-full bg-black/30 flex items-center justify-center hover:bg-[#f4a261] transition"><FaMinus className="text-[10px]" /></button>
                          <span className="w-3 text-center text-sm font-bold">{tickets.egAdult}</span>
                          <button type="button" onClick={() => handleTicketChange('egAdult', 1)} className="w-6 h-6 rounded-full bg-black/30 flex items-center justify-center hover:bg-[#f4a261] transition"><FaPlus className="text-[10px]" /></button>
                        </div>
                      </div>
                      {/* Egyptian Student */}
                      <div className="flex items-center justify-between bg-white/5 px-2 py-1 rounded-lg border border-white/10">
                        <span className="text-xs text-gray-200">Egyptian Student</span>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => handleTicketChange('egStudent', -1)} className="w-6 h-6 rounded-full bg-black/30 flex items-center justify-center hover:bg-[#f4a261] transition"><FaMinus className="text-[10px]" /></button>
                          <span className="w-3 text-center text-sm font-bold">{tickets.egStudent}</span>
                          <button type="button" onClick={() => handleTicketChange('egStudent', 1)} className="w-6 h-6 rounded-full bg-black/30 flex items-center justify-center hover:bg-[#f4a261] transition"><FaPlus className="text-[10px]" /></button>
                        </div>
                      </div>
                      {/* Foreigner */}
                      <div className="flex items-center justify-between bg-white/5 px-2 py-1 rounded-lg border border-white/10">
                        <span className="text-xs text-gray-200">Foreign Tourist</span>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => handleTicketChange('foreign', -1)} className="w-6 h-6 rounded-full bg-black/30 flex items-center justify-center hover:bg-[#f4a261] transition"><FaMinus className="text-[10px]" /></button>
                          <span className="w-3 text-center text-sm font-bold">{tickets.foreign}</span>
                          <button type="button" onClick={() => handleTicketChange('foreign', 1)} className="w-6 h-6 rounded-full bg-black/30 flex items-center justify-center hover:bg-[#f4a261] transition"><FaPlus className="text-[10px]" /></button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/20 pt-3 flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Total Price</span>
                    <span className="text-xl font-bold text-white">{totalPrice} EGP</span>
                  </div>

                  <button type="submit" disabled={totalQty === 0} className={`w-full py-3 font-bold rounded-xl transition shadow-lg text-base ${totalQty > 0 ? 'bg-[#cd4f3c] hover:bg-[#b03c2b] text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}>
                    Reserve {totalQty > 0 ? `${totalQty} Ticket${totalQty > 1 ? 's' : ''}` : 'Tickets'}
                  </button>
                </form>
              </div>
          </div>

        </div>
      </SectionWrapper>
    </div>
  );
};

export default MuseumDetailsPage;
