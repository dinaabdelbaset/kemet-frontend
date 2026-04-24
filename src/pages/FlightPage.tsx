import PriceDisplay from "../components/common/PriceDisplay";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPlane, FaClock, FaTag, FaChair, FaStar, FaShieldAlt, FaGift } from "react-icons/fa";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

interface FlightState {
  from: string;
  to: string;
  depDate: string;
  retDate: string | null;
  passengers: { adults: number; children: number; infants: number };
  tripType: "round" | "oneway";
}

interface Flight {
  id: number;
  airline: string;
  logo: string;
  from: string;
  to: string;
  dep: string;
  arr: string;
  duration: string;
  stops: number;
  class: "economy" | "business" | "first";
  price: number;
  seats: number;
  rating: number;
}

const CLASSES = [
  { key: "economy", label: "اقتصادي", mult: 1, color: "#D4AF37" },
  { key: "business", label: "رجال أعمال", mult: 2.2, color: "#EB662B" },
  { key: "first", label: "درجة أولى", mult: 3.8, color: "#4caf82" },
];

const generateFlights = (from: string, to: string): Flight[] => [
  { id: 101, airline: "مصر للطيران", logo: "🇪🇬", from, to, dep: "07:30", arr: "09:15", duration: "1س 45د", stops: 0, class: "economy", price: 89, seats: 12, rating: 4.7 },
  { id: 204, airline: "فلاي إيجيبت", logo: "✈️", from, to, dep: "10:00", arr: "12:05", duration: "2س 05د", stops: 0, class: "economy", price: 74, seats: 6, rating: 4.5 },
  { id: 305, airline: "مصر للطيران", logo: "🇪🇬", from, to, dep: "13:45", arr: "15:30", duration: "1س 45د", stops: 0, class: "economy", price: 95, seats: 24, rating: 4.8 },
  { id: 512, airline: "إيرعربية مصر", logo: "🌙", from, to, dep: "16:20", arr: "18:50", duration: "2س 30د", stops: 1, class: "economy", price: 61, seats: 18, rating: 4.3 },
  { id: 701, airline: "مصر للطيران", logo: "🇪🇬", from, to, dep: "20:00", arr: "21:45", duration: "1س 45د", stops: 0, class: "economy", price: 112, seats: 4, rating: 4.9 },
];

const SEAT_ROWS = Array.from({ length: 8 }, (_, i) => i + 1);
const SEAT_COLS = ["A", "B", "C", "D", "E", "F"];
const OCCUPIED = new Set(["1A", "1B", "2C", "2D", "3A", "3F", "4B", "4C", "5D", "5E", "6A", "6F", "7C"]);

const FlightPage = () => {
  useDocumentTitle("مصر للطيران - احجز رحلتك");
  const location = useLocation();
  const navigate = useNavigate();
  const search = (location.state as FlightState) || {
    from: "القاهرة (CAI)", to: "الأقصر (LXR)",
    depDate: "2026-05-01", retDate: null,
    passengers: { adults: 1, children: 0, infants: 0 },
    tripType: "oneway"
  };

  const flights = generateFlights(search.from, search.to);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedClass, setSelectedClass] = useState<"economy" | "business" | "first">("economy");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [step, setStep] = useState<"list" | "seat" | "confirm">("list");
  
  const totalPassengers = search.passengers.adults + search.passengers.children;

  const handleSeatClick = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length < totalPassengers) {
        setSelectedSeats(prev => [...prev, seatId]);
      } else {
        // Replace the oldest selected seat if trying to select more than needed
        setSelectedSeats(prev => [...prev.slice(1), seatId]);
      }
    }
  };

  const classInfo = CLASSES.find(c => c.key === selectedClass)!;
  const finalPrice = selectedFlight
    ? Math.round(selectedFlight.price * classInfo.mult * (search.passengers.adults + search.passengers.children * 0.75))
    : 0;
  const cashbackPct = parseInt(localStorage.getItem("kemet_cashback_pct") || "0");
  const cashbackAmt = cashbackPct > 0 ? Math.round(finalPrice * cashbackPct / 100) : 0;

  return (
    <div className="min-h-screen bg-[#04062e] text-white" dir="rtl">

      {/* Header */}
      <div className="bg-[#04062e]/95 border-b border-white/10 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => step === "list" ? navigate(-1) : setStep("list")}
              className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center hover:bg-white/15 transition">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div>
              <p className="font-black text-base">{search.from} → {search.to}</p>
              <p className="text-white/40 text-[11px]">{search.depDate} · {search.passengers.adults} بالغ{search.passengers.children > 0 ? ` · ${search.passengers.children} طفل` : ""}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-black text-[#D4AF37]">
            <span className="text-lg">🇪🇬</span> مصر للطيران
          </div>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto px-4 pb-3 flex gap-4">
          {[{ key: "list", label: "الرحلات" }, { key: "seat", label: "المقعد" }, { key: "confirm", label: "التأكيد" }].map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${step === s.key || (s.key === "list") || (step === "confirm" && s.key === "seat") ? "bg-gradient-to-r from-[#D4AF37] to-[#EB662B] text-[#04062e]" : "bg-white/10 text-white/40"}`}>{i + 1}</div>
              <span className={`text-[11px] font-black ${step === s.key ? "text-[#D4AF37]" : "text-white/30"}`}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* STEP 1: Flight List */}
        {step === "list" && (
          <div className="space-y-4">
            <h2 className="text-xl font-black mb-6">🛫 الرحلات المتاحة ({flights.length})</h2>

            {/* Class selector */}
            <div className="flex gap-2 mb-6">
              {CLASSES.map(c => (
                <button key={c.key} onClick={() => setSelectedClass(c.key as typeof selectedClass)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-black border transition-all duration-200"
                  style={selectedClass === c.key
                    ? { backgroundColor: `${c.color}20`, borderColor: c.color, color: c.color }
                    : { backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>

            {flights.map(flight => {
              const price = Math.round(flight.price * classInfo.mult * (search.passengers.adults + search.passengers.children * 0.75));
              const isSelected = selectedFlight?.id === flight.id;
              return (
                <div key={flight.id}
                  onClick={() => setSelectedFlight(flight)}
                  className="relative rounded-2xl border p-5 cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: isSelected ? `${classInfo.color}10` : "rgba(255,255,255,0.03)",
                    borderColor: isSelected ? `${classInfo.color}50` : "rgba(255,255,255,0.08)",
                    boxShadow: isSelected ? `0 8px 30px ${classInfo.color}20` : "none",
                  }}
                >
                  {flight.seats <= 6 && (
                    <div className="absolute top-3 left-3 px-2 py-0.5 bg-red-500/20 border border-red-500/30 rounded-full text-[9px] font-black text-red-400">
                      آخر {flight.seats} مقاعد!
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    {/* Airline */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/8 flex items-center justify-center text-xl">{flight.logo}</div>
                      <div>
                        <p className="font-black text-sm">{flight.airline}</p>
                        <p className="text-white/40 text-[10px]">{flight.id} · {flight.stops === 0 ? "مباشر" : `${flight.stops} توقف`}</p>
                      </div>
                    </div>

                    {/* Times */}
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="font-black text-lg">{flight.dep}</p>
                        <p className="text-white/40 text-[9px]">{search.from.split(" ")[0]}</p>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1 text-white/20 text-[9px]">
                          <FaClock className="text-[8px]" />{flight.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-12 h-px bg-white/20"></div>
                          <FaPlane className="text-[#D4AF37] text-[10px] rotate-180" />
                          <div className="w-12 h-px bg-white/20"></div>
                        </div>
                        <p className="text-white/20 text-[9px]">{flight.stops === 0 ? "مباشر" : "توقف"}</p>
                      </div>
                      <div className="text-center">
                        <p className="font-black text-lg">{flight.arr}</p>
                        <p className="text-white/40 text-[9px]">{search.to.split(" ")[0]}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-center">
                      <div className="flex items-center gap-1 justify-end mb-1">
                        <FaStar className="text-[#D4AF37] text-[9px]" />
                        <span className="text-[10px] text-white/50">{flight.rating}</span>
                      </div>
                      <p className="font-black text-xl" style={{ color: classInfo.color }}><PriceDisplay price={Number(price)} /></p>
                      <p className="text-white/30 text-[9px]">للشخص</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {selectedFlight && (
              <div className="sticky bottom-6 mt-6">
                <button onClick={() => setStep("seat")}
                  className="w-full py-4 rounded-2xl font-extrabold text-[#04062e] text-base flex items-center justify-center gap-3 hover:-translate-y-0.5 transition-all"
                  style={{ background: `linear-gradient(135deg, ${classInfo.color}, #EB662B)`, boxShadow: `0 15px 40px ${classInfo.color}40` }}
                >
                  <FaChair /> اختار مقعدك على رحلة {selectedFlight.id}
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Seat Selection */}
        {step === "seat" && selectedFlight && (
          <div>
            <h2 className="text-xl font-black mb-2">💺 اختار مقعدك</h2>
            <p className="text-white/40 text-sm mb-8">{selectedFlight.airline} · {selectedFlight.id} · {selectedFlight.dep} ← {selectedFlight.arr}</p>

            {/* Plane diagram */}
            <div className="max-w-xs mx-auto">
              {/* Nose */}
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full text-[11px] text-white/40">
                  <FaPlane className="text-[#D4AF37] rotate-180" /> مقدمة الطائرة
                </div>
              </div>

              {/* Legend */}
              <div className="flex gap-4 justify-center mb-5 text-[10px]">
                {[{ color: "bg-white/10", label: "متاح" }, { color: "bg-[#D4AF37]/70", label: "مختار" }, { color: "bg-red-500/50", label: "محجوز" }].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className={`w-4 h-4 rounded-md ${l.color}`} />
                    <span className="text-white/40">{l.label}</span>
                  </div>
                ))}
              </div>

              {/* Col headers */}
              <div className="grid grid-cols-7 gap-1 mb-2 px-2">
                {["A", "B", "C", "", "D", "E", "F"].map((c, i) => (
                  <div key={i} className="text-center text-[10px] text-white/30 font-black">{c}</div>
                ))}
              </div>

              {/* Seats */}
              {SEAT_ROWS.map(row => {
                const isBusinessClass = row <= 2;
                return (
                  <div key={row} className="grid grid-cols-7 gap-1 mb-1.5">
                    {["A", "B", "C", null, "D", "E", "F"].map((col, colIdx) => {
                      if (!col) return <div key={colIdx} className="flex items-center justify-center text-[10px] text-white/30">{row}</div>;
                      const seatId = `${row}${col}`;
                      const isOccupied = OCCUPIED.has(seatId);
                      const isChosen = selectedSeats.includes(seatId);
                      return (
                        <button key={col} disabled={isOccupied} onClick={() => handleSeatClick(seatId)}
                          className={`aspect-square rounded-lg text-[10px] font-black transition-all duration-200 flex items-center justify-center ${isOccupied ? "bg-red-500/30 text-red-400/50 cursor-not-allowed" : isChosen ? "text-[#04062e] scale-110" : `hover:bg-white/20 ${isBusinessClass ? "bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37]" : "bg-white/8 text-white/50"}`}`}
                          style={isChosen ? { background: `linear-gradient(135deg, ${classInfo.color}, #EB662B)` } : {}}
                        >
                          {isOccupied ? "✕" : seatId}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {selectedSeats.length > 0 && (
              <div className="sticky bottom-6 mt-8">
                <button onClick={() => setStep("confirm")}
                  disabled={selectedSeats.length !== totalPassengers}
                  className={`w-full py-4 rounded-2xl font-extrabold text-[#04062e] text-base flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all ${selectedSeats.length !== totalPassengers ? "opacity-50 cursor-not-allowed" : ""}`}
                  style={{ background: `linear-gradient(135deg, ${classInfo.color}, #EB662B)`, boxShadow: `0 15px 40px ${classInfo.color}40` }}
                >
                  <FaChair /> تأكيد المقاعد ({selectedSeats.length}/{totalPassengers})
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Confirmation / Invoice */}
        {step === "confirm" && selectedFlight && (
          <div className="max-w-lg mx-auto">
            <h2 className="text-xl font-black mb-6">🧾 فاتورة الرحلة</h2>

            {/* Ticket card */}
            <div className="rounded-2xl overflow-hidden border border-white/10 mb-6">
              {/* Top colored bar */}
              <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${classInfo.color}, #EB662B)` }} />

              <div className="bg-white/4 p-6 space-y-5">
                {/* Flight info */}
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-3xl font-black">{selectedFlight.dep}</p>
                    <p className="text-white/50 text-xs mt-1">{search.from}</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1 px-4">
                    <p className="text-white/30 text-[10px]">{selectedFlight.duration}</p>
                    <div className="flex items-center gap-1 w-full">
                      <div className="flex-1 h-px bg-white/15"></div>
                      <FaPlane className="text-[#D4AF37] text-sm rotate-180" />
                      <div className="flex-1 h-px bg-white/15"></div>
                    </div>
                    <p className="text-white/30 text-[10px]">{selectedFlight.stops === 0 ? "✈️ مباشر" : "توقف"}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-black">{selectedFlight.arr}</p>
                    <p className="text-white/50 text-xs mt-1">{search.to}</p>
                  </div>
                </div>

                <div className="border-t border-dashed border-white/10 pt-5 grid grid-cols-2 gap-4">
                  {[
                    { label: "الرحلة", val: selectedFlight.id },
                    { label: "المقاعد", val: selectedSeats.join(', ') || "-" },
                    { label: "الدرجة", val: classInfo.label },
                    { label: "التاريخ", val: search.depDate },
                    { label: "المسافرون", val: `${search.passengers.adults} بالغ` },
                    { label: "شركة الطيران", val: selectedFlight.airline },
                  ].map(({ label, val }) => (
                    <div key={label}>
                      <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">{label}</p>
                      <p className="text-white font-black text-sm mt-0.5">{val}</p>
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">سعر التذكرة × {search.passengers.adults}</span>
                    <span className="font-black"><PriceDisplay price={Number(Math.round(selectedFlight.price * classInfo.mult))} /> × {search.passengers.adults}</span>
                  </div>
                  {search.passengers.children > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">أطفال × {search.passengers.children} (75%)</span>
                      <span className="font-black"><PriceDisplay price={Number(Math.round(selectedFlight.price * classInfo.mult * 0.75))} /> × {search.passengers.children}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <span className="font-black text-lg">الإجمالي</span>
                    <span className="font-black text-2xl" style={{ color: classInfo.color }}><PriceDisplay price={Number(finalPrice)} /></span>
                  </div>

                  {/* Cashback */}
                  {cashbackPct > 0 && (
                    <div className="rounded-xl border border-[#4caf82]/25 bg-[#4caf82]/8 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaGift className="text-[#4caf82]" />
                        <div>
                          <p className="text-[#4caf82] font-black text-xs">🎁 كاش باك {cashbackPct}%</p>
                          <p className="text-white/30 text-[10px]">ستُضاف لمحفظتك بعد السفر</p>
                        </div>
                      </div>
                      <p className="text-[#4caf82] font-black text-lg">+${cashbackAmt}</p>
                    </div>
                  )}
                </div>

                {/* Trust */}
                <div className="flex gap-4 border-t border-white/10 pt-4">
                  {[{ icon: FaShieldAlt, text: "حجز آمن" }, { icon: FaStar, text: "أفضل سعر" }, { icon: FaTag, text: "إلغاء مجاني" }].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-1.5 text-white/30 text-[10px]">
                      <Icon className="text-[#D4AF37] text-xs" />{text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pay button */}
            <button
              onClick={() => {
                navigate("/checkout", {
                  state: {
                    type: "flight",
                    id: selectedFlight.id,
                    title: `${selectedFlight.airline} · ${selectedFlight.id} · مقاعد ${selectedSeats.join(', ')}`,
                    price: Math.round(selectedFlight.price * classInfo.mult),
                    date: search.depDate,
                    time: selectedFlight.dep,
                    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80",
                    tickets: {
                      adult: search.passengers.adults,
                      child: search.passengers.children,
                      infant: search.passengers.infants
                    }
                  }
                });
              }}
              className="w-full py-4 rounded-2xl font-extrabold text-[#04062e] text-lg flex items-center justify-center gap-3 hover:-translate-y-0.5 transition-all"
              style={{ background: `linear-gradient(135deg, ${classInfo.color}, #EB662B)`, boxShadow: `0 15px 50px ${classInfo.color}50` }}
            >
              <FaPlane /> أكمل الدفع — ${finalPrice}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightPage;
