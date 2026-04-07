import SectionWrapper from "@/components/sections/SectionWrapper";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTicketAlt, FaArrowRight } from "react-icons/fa";

const EventsPage = () => {

  const events = [
    {
      id: 1,
      title: "Pyramids Sound & Light Show",
      image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/pyramids",
      details: ["2 Hours", "Daily Shows", "8:00 PM"],
      price: "1500 EGP",
    },
    {
      id: 2,
      title: "Whirling Dervishes (El Tanoura)",
      image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/dervishes",
      details: ["1.5 Hours", "Mon, Wed, Sat", "7:30 PM"],
      price: "400 EGP",
    },
    {
      id: 3,
      title: "Opera Aida at Luxor Temple",
      image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/opera",
      details: ["4 Hours", "November 12, 2026", "8:00 PM"],
      price: "3500 EGP",
    },
    {
      id: 4,
      title: "Cairo Jazz Festival",
      image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/jazz",
      details: ["3 Days", "Oct 22-24, 2026", "6:00 PM"],
      price: "1200 EGP",
    },
    {
      id: 5,
      title: "Red Sea EDM Beach Festival",
      image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/edm",
      details: ["Weekend Pass", "July 15, 2026", "10:00 PM"],
      price: "2500 EGP",
    },
    {
      id: 6,
      title: "Cairo International Book Fair",
      image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/book",
      details: ["Full Day", "Jan 28 - Feb 6", "10:00 AM"],
      price: "100 EGP",
    },
  ];

  return (
    <div className="bg-[#fdfaf7] min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] w-full">
        <div className="absolute inset-0">
          <img 
            src="https://dinaabdelbaset-kemet.hf.space/api/kamet-images/hero" 
            alt="Events Hero" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="absolute inset-0 bg-black/30"></div>
      </section>

      {/* Main Content */}
      <SectionWrapper className="py-20 -mt-20 relative z-10 bg-white rounded-t-[40px] shadow-sm">
        <div className="text-center max-w-3xl mx-auto px-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#14213d] mb-6 uppercase tracking-wider font-serif">
            EVENTS AND SHOWS
          </h1>
          <p className="text-gray-600 leading-relaxed text-lg">
            Experience the vibrant pulse of Egypt through our curated selection of cultural festivals, dynamic musical performances, and historic theatrical shows. From the mesmerizing lights of the Pyramids to the modern beats of the Red Sea, secure your tickets to unforgettable memories today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
          {events.map((evt) => (
            <div key={evt.id} className="group bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col">
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <img 
                  src={evt.image} 
                  alt={evt.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14213d]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/20">
                  <span className="text-xs font-black text-[#E76F51] flex items-center gap-1"><FaTicketAlt /> {evt.price}</span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <Link to={`/events/${evt.id}`}>
                  <h2 className="text-xl font-black text-[#14213d] mb-5 group-hover:text-[#E76F51] transition-colors line-clamp-2">
                    {evt.title}
                  </h2>
                </Link>
                
                <div className="space-y-4 mb-8 mt-auto">
                  <div className="text-gray-500 text-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#fdfaf7] flex items-center justify-center text-[#E76F51] shrink-0 transition-colors group-hover:bg-[#E76F51]/10">
                      <FaClock />
                    </div>
                    <span className="font-medium tracking-wide">{evt.details[0]} • {evt.details[2]}</span>
                  </div>
                  <div className="text-gray-500 text-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#fdfaf7] flex items-center justify-center text-[#E76F51] shrink-0 transition-colors group-hover:bg-[#E76F51]/10">
                      <FaCalendarAlt />
                    </div>
                    <span className="font-medium tracking-wide">{evt.details[1]}</span>
                  </div>
                </div>

                <div className="flex border-t border-gray-100 pt-5 gap-4 mt-auto">
                  <Link 
                    to={`/events/${evt.id}`}
                    className="flex-1 px-4 py-3.5 bg-[#fdfaf7] hover:bg-gray-100 text-[#14213d] text-sm font-bold uppercase tracking-wider rounded-xl transition text-center border border-gray-100"
                  >
                    Details
                  </Link>
                  <Link 
                    to="/checkout"
                    state={{ type: 'event', id: evt.id, title: evt.title, price: parseInt(evt.price.replace(' EGP', '')), image: evt.image }}
                    className="flex-1 px-4 py-3.5 bg-[#E76F51] hover:bg-[#d65f41] text-white text-sm font-bold uppercase tracking-wider rounded-xl transition text-center shadow-lg shadow-[#E76F51]/25 flex items-center justify-center gap-2"
                  >
                    Book <FaArrowRight className="text-[10px]" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>
    </div>
  );
};

export default EventsPage;
