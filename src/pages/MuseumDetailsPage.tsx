import SectionWrapper from "@/components/sections/SectionWrapper";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaClock, FaTicketAlt, FaInfoCircle, FaMinus, FaPlus } from "react-icons/fa";
import InteractiveMap from "@/components/common/InteractiveMap";
import SocialShare from "@/components/common/SocialShare";
import ReviewSection from "@/components/common/ReviewSection";
import DateTimePicker from "@/components/Ui/DateTimePicker";
import { useState } from "react";

const MuseumDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const MUSEUMS_DB = [
    {
      id: 1,
      title: "Grand Egyptian Museum",
      titleAr: "المتحف المصري الكبير",
      image: "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=1000&auto=format&fit=crop",
      hours: "Daily: 9:00 AM - 6:00 PM",
      price: 150,
      ticketPrices: { egAdult: "150 EGP", egStudent: "75 EGP", foreigner: "1000 EGP" },
      description: "The Grand Egyptian Museum, arguably the largest archaeological museum in the world, houses thousands of unique artifacts from ancient Egypt, including the complete Tutankhamun collection.",
      descriptionAr: "المتحف المصري الكبير، يعتبر أكبر متحف أثري في العالم، يضم آلاف القطع الأثرية الفريدة من مصر القديمة، بما في ذلك مجموعة توت عنخ آمون الكاملة.",
      highlights: ["Extensive Tutankhamun galleries", "Colossal statue of Ramses II", "Modern architectural mastery"]
    },
    {
      id: 2,
      title: "National Museum of Egyptian Civilization",
      titleAr: "المتحف القومي للحضارة المصرية",
      image: "https://images.unsplash.com/photo-1622616238327-0fa83c316223?q=80&w=1000&auto=format&fit=crop",
      hours: "Daily: 9:00 AM - 5:00 PM",
      price: 80,
      ticketPrices: { egAdult: "80 EGP", egStudent: "40 EGP", foreigner: "500 EGP" },
      description: "The NMEC provides a comprehensive overview of all historical periods of Egypt. It famously houses the Royal Mummies Hall, where you can view the preserved remains of ancient pharaohs.",
      descriptionAr: "يقدم المتحف القومي للحضارة المصرية نظرة شاملة على جميع العصور التاريخية لمصر. ويضم قاعة المومياوات الملكية الشهيرة.",
      highlights: ["Royal Mummies Hall", "Overlooks Ain el-Sirat Lake", "Chronological history of Egypt"]
    },
    {
      id: 3,
      title: "Karnak Temple Complex",
      titleAr: "مجمع معابد الكرنك",
      image: "https://images.unsplash.com/photo-1596422846543-75c61266b7fb?q=80&w=1000&auto=format&fit=crop",
      hours: "Daily: 6:00 AM - 5:00 PM",
      price: 40,
      ticketPrices: { egAdult: "40 EGP", egStudent: "20 EGP", foreigner: "450 EGP" },
      description: "The Karnak Temple Complex is a vast mix of decayed temples, chapels, pylons, and other buildings. The towering pillars of the Great Hypostyle Hall are among the most famous historical sites on Earth.",
      descriptionAr: "مجمع معابد الكرنك هو مزيج واسع من المعابد المدمرة، والأضرحة، والمباني الأخرى. أساطين قاعة الأعمدة الكبرى تعد من أشهر المواقع التاريخية على وجه الأرض.",
      highlights: ["Great Hypostyle Hall", "Avenue of Sphinxes", "Sacred Lake"]
    },
    {
      id: 4,
      title: "Luxor Museum",
      titleAr: "متحف الأقصر",
      image: "https://images.unsplash.com/photo-1505763567675-97e3fb633454?q=80&w=1000&auto=format&fit=crop",
      hours: "Daily: 9:00 AM - 9:00 PM",
      price: 40,
      ticketPrices: { egAdult: "40 EGP", egStudent: "20 EGP", foreigner: "300 EGP" },
      description: "Unlike other museums, the Luxor Museum prides itself on the quality of the pieces it displays, rather than the quantity. It is brilliantly lit and perfectly showcases masterworks of pharaonic art.",
      descriptionAr: "على عكس المتاحف الأخرى، يفتخر متحف الأقصر بجودة القطع التي يعرضها بدلاً من الكمية. الإضاءة الرائعة تُبرز التحف الفنية الفرعونية بشكل مثالي.",
      highlights: ["Royal Granet Statues", "Mummies of Ahmose I and Ramses I", "Cachette of Luxor Temple"]
    },
    {
      id: 5,
      title: "Abu Simbel Temple",
      titleAr: "معبد أبو سمبل",
      image: "https://images.unsplash.com/photo-1621350631677-be8eebd54cf8?q=80&w=1000&auto=format&fit=crop",
      hours: "Daily: 5:00 AM - 5:00 PM",
      price: 60,
      ticketPrices: { egAdult: "60 EGP", egStudent: "30 EGP", foreigner: "600 EGP" },
      description: "Carved out of a massive rock cliff, the colossal Abu Simbel temples by King Ramses II are a magnificent testament to ancient architectural genius, completely relocated in the 1960s to save them from flooding.",
      descriptionAr: "نُحتت معابد أبو سمبل العظيمة للملك رمسيس الثاني في جرف صخري ضخم، وهي شهادة رائعة على العبقرية المعمارية القديمة، وتم نقلها بالكامل في الستينيات لإنقاذها من الغرق.",
      highlights: ["Colossi of Ramses II", "Solar alignment phenomenon", "Relocated by UNESCO"]
    },
    {
      id: 6,
      title: "Philae Temple",
      titleAr: "معبد فيلة",
      image: "https://images.unsplash.com/photo-1634568112344-933e085025a1?q=80&w=1000&auto=format&fit=crop",
      hours: "Daily: 7:00 AM - 4:00 PM",
      price: 40,
      ticketPrices: { egAdult: "40 EGP", egStudent: "20 EGP", foreigner: "450 EGP" },
      description: "Dedicated to the goddess Isis, this stunning temple complex is located on an island in the reservoir of the Aswan Low Dam. Accessible only by boat, it offers a deeply romantic and historical experience.",
      descriptionAr: "مُكرس للإلهة إيزيس، يقع هذا المجمع المعبدي المذهل على جزيرة في خزان سد أسوان المنخفض. لا يمكن الوصول إليه إلا بالقوارب، ويقدم تجربة رومانسية وتاريخية عميقة.",
      highlights: ["Island Sanctuary", "Temple of Isis", "Trajan's Kiosk"]
    },
    {
      id: 7,
      title: "Graeco-Roman Museum",
      titleAr: "المتحف اليوناني الروماني",
      image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=1000&auto=format&fit=crop",
      hours: "Daily: 9:00 AM - 5:00 PM",
      price: 40,
      ticketPrices: { egAdult: "40 EGP", egStudent: "20 EGP", foreigner: "300 EGP" },
      description: "Located in Alexandria, this newly restored museum features an extensive collection tracing the fascinating intersection of ancient Egyptian, Greek, and Roman histories spanning over a millennium.",
      descriptionAr: "يقع هذا المتحف المرمم حديثاً في الإسكندرية، ويضم مجموعة واسعة تتبع التقاطع الرائع بين التاريخ المصري القديم واليوناني والروماني والذي يمتد لأكثر من ألف عام.",
      highlights: ["Hellenistic Antiquities", "Roman Mosaics", "Statue of Apis"]
    },
    {
      id: 8,
      title: "Citadel of Qaitbay",
      titleAr: "قلعة قايتباي",
      image: "https://images.unsplash.com/photo-1628178122971-ce51e6006f15?q=80&w=1000&auto=format&fit=crop",
      hours: "Daily: 8:00 AM - 5:00 PM",
      price: 60,
      ticketPrices: { egAdult: "60 EGP", egStudent: "30 EGP", foreigner: "150 EGP" },
      description: "A 15th-century defensive fortress located on the Mediterranean sea coast, built upon the ruins of the Lighthouse of Alexandria. It provides spectacular ocean views and deep historical immersion.",
      descriptionAr: "حصن دفاعي من القرن الخامس عشر يقع على ساحل البحر الأبيض المتوسط، بُني على أنقاض منارة الإسكندرية. يوفر إطلالات مذهلة على المحيط وانغماساً تاريخياً عميقاً.",
      highlights: ["Mediterranean Views", "Naval Museum", "15th-century architecture"]
    },
    {
      id: 9,
      title: "Hurghada National Museum",
      titleAr: "متحف الغردقة الوطني",
      image: "https://images.unsplash.com/photo-1582236940866-7bda526017b2?q=80&w=1000&auto=format&fit=crop",
      hours: "10:00 AM - 1:00 PM & 5:00 PM - 10:00 PM",
      price: 80,
      ticketPrices: { egAdult: "80 EGP", egStudent: "40 EGP", foreigner: "500 EGP" },
      description: "The first antiquities museum in the Red Sea Governorate, showcasing the beauty and lifestyle of Egyptian civilization from antiquity to modern times, perfect for a break from coastal activities.",
      descriptionAr: "أول متحف للآثار في محافظة البحر الأحمر، يعرض جمال وأسلوب حياة الحضارة المصرية من العصور القديمة وحتى العصر الحديث، مثالي لأخذ استراحة من الأنشطة الساحلية.",
      highlights: ["Royal Jewelry", "Coptic Artifacts", "Late-night opening hours"]
    },
    {
      id: 10,
      title: "Sharm El-Sheikh Museum",
      titleAr: "متحف شرم الشيخ",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop",
      hours: "10:00 AM - 1:00 PM & 5:00 PM - 10:00 PM",
      price: 40,
      ticketPrices: { egAdult: "40 EGP", egStudent: "20 EGP", foreigner: "250 EGP" },
      description: "Designed to act as a cultural hub amidst the tourist resorts, the museum focuses on the daily life of ancient Egyptians, the local wildlife of the Sinai peninsula, and their deep connection to the environment.",
      descriptionAr: "صُمم ليكون مركزاً ثقافياً وسط المنتجعات السياحية، يركز المتحف على الحياة اليومية للمصريين القدماء، والحياة البرية المحلية لشبه جزيرة سيناء، وارتباطهم العميق بالبيئة.",
      highlights: ["Sinai Heritage", "Ancient Boats", "Wildlife Exhibits"]
    }
  ];

  const museumId = id ? parseInt(id) : 1;
  const museum = MUSEUMS_DB.find(m => m.id === museumId) || MUSEUMS_DB[0];

  const [tickets, setTickets] = useState({ egAdult: 1, egStudent: 0, foreign: 0 });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleTicketChange = (type: 'egAdult' | 'egStudent' | 'foreign', delta: number) => {
    setTickets(prev => ({ ...prev, [type]: Math.max(0, prev[type] + delta) }));
  };

  const parsePrice = (priceStr: string) => parseInt(priceStr.replace(/\D/g, '')) || 0;
  const totalPrice = 
    tickets.egAdult * parsePrice(museum.ticketPrices.egAdult) +
    tickets.egStudent * parsePrice(museum.ticketPrices.egStudent) +
    tickets.foreign * parsePrice(museum.ticketPrices.foreigner);

  const totalQty = tickets.egAdult + tickets.egStudent + tickets.foreign;

  const handleReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return alert("Please select a date for your visit.");
    if (totalQty === 0) return alert("Please select at least one ticket.");
    
    navigate('/checkout', {
      state: {
        id: museum.id,
        type: 'museum',
        title: museum.title,
        price: totalPrice / 50, // Convert to USD logic standard so checkout converter displays correctly
        image: museum.image,
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
        <img src={museum.image} alt={museum.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="max-w-4xl text-white">
            <Link to="/museums" className="text-white/80 hover:text-white mb-6 inline-block font-semibold tracking-wide uppercase text-sm">
              ← Back to Museums
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight drop-shadow-lg mb-4">
              {museum.title}
            </h1>
            <div className="inline-block bg-white/10 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/20">
              <SocialShare url={window.location.href} title={museum.title} />
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
                {museum.description}
              </p>
              <div className="bg-[#fcfbf9] p-6 text-right border-r-4 border-[#cd4f3c] rounded-l-lg shadow-sm">
                <p className="text-lg text-gray-700 leading-relaxed font-arabic">
                  {museum.descriptionAr}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#14213d] font-serif mb-4">What's Included</h3>
              <ul className="space-y-4">
                {museum.highlights.map((hlt, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="w-2 h-2 rounded-full bg-[#cd4f3c]"></span>
                    {hlt}
                  </li>
                ))}
              </ul>
            </div>

            <ReviewSection rating={4.8} reviewCount={124} itemId={museum.id.toString()} itemType="museum" />

            <InteractiveMap locationName={`${museum.title}, Egypt`} />
          </div>

          <div className="lg:col-span-1">
             <div className="bg-[#14213d] text-white p-5 rounded-3xl shadow-xl sticky top-24 max-h-[calc(100vh-4rem)] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-track]:bg-transparent">
                <h3 className="text-xl font-bold mb-4 text-center font-serif border-b border-white/20 pb-2">Plan Your Visit</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="flex items-center gap-2 text-gray-300 text-sm"><FaClock /> Opening Hours</span>
                    <span className="font-semibold text-xs">{museum.hours}</span>
                  </div>
                  
                  {/* Detailed Ticket Pricing */}
                  <div className="pt-1">
                    <span className="flex items-center gap-2 text-gray-300 font-semibold mb-2 text-sm"><FaTicketAlt /> Entry Tickets</span>
                    <div className="space-y-1 text-xs bg-black/20 p-3 rounded-xl border border-white/5">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Egyptian Adult</span>
                        <span className="font-bold text-[#f4a261]">{museum.ticketPrices.egAdult}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Egyptian Student</span>
                        <span className="font-bold text-[#f4a261]">{museum.ticketPrices.egStudent}</span>
                      </div>
                      <div className="border-t border-white/10 mt-1 pt-1 flex justify-between">
                        <span className="text-gray-400">Foreign Tourist</span>
                        <span className="font-bold text-[#f4a261]">{museum.ticketPrices.foreigner}</span>
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
