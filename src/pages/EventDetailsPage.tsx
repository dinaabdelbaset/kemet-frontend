import PriceDisplay from "../components/common/PriceDisplay";
import { useState, useEffect } from "react";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTicketAlt } from "react-icons/fa";
import InteractiveMap from "@/components/common/InteractiveMap";
import SocialShare from "@/components/common/SocialShare";
import { getEventById } from "../api/eventService";

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(id!);
        setEvent(data?.data || data);
      } catch (err) {
        console.error("Error loading event details", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center p-20 text-xl font-bold">Loading Event Details...</div>;
  }

  if (!event) {
    return <div className="min-h-screen flex items-center justify-center p-20 text-xl font-bold text-red-500">Event not found!</div>;
  }

  const eventImage = event.image?.startsWith('/') || event.image?.startsWith('http') ? event.image : 'https://images.unsplash.com/photo-1572251460395-9b77541656bc?q=80&w=1000&auto=format&fit=crop';
  const eventTitle = event.title || event.name || "Amazing Event";
  const eventDate = event.date || "Upcoming";
  const eventTime = event.time || "Evening";
  const eventVenue = event.venue || event.location || "Egypt";
  const eventDesc = event.description || "Join us for this exciting event.";
  const eventRules = event.rules ? (typeof event.rules === 'string' ? JSON.parse(event.rules) : event.rules) : ["No flash photography.", "Tickets are non-refundable."];
  const eventPrice = event.price || event.ticket_price || 1500;
  
  const handleCheckout = () => {
    navigate('/checkout', {
      state: {
        type: 'event',
        id: event.id || id,
        title: eventTitle,
        price: eventPrice,
        image: eventImage
      }
    });
  };

  const isLibrary = eventTitle.includes("مكتبة");
  const isLuxorFilm = eventTitle.includes("أقصر") || eventTitle.includes("اقصر") || eventTitle.includes("Luxor");
  const isKarnakShow = eventTitle.includes("صوت") || eventTitle.includes("ضوء") || eventTitle.includes("كرنك");
  const isSharmTheater = eventTitle.includes("شرم") && eventTitle.includes("مسرح");
  const isSohoConcert = eventTitle.includes("سوهو") || eventTitle.includes("موسيقية");
  const isAbuSimbel = eventTitle.includes("تعامد") || eventTitle.includes("رمسيس") || eventTitle.includes("سمبل");
  const isFilm = eventTitle.includes("السينمائي") || eventTitle.includes("فيلم");

  let galleryImages = [
    "/events/real_cairo_opera_aida.jpg",
    "/events/real_giza_sound_light.jpg",
    "/events/real_sharm_edm.jpg",
    "/events/real_luxor_opet.jpg"
  ];

  if (isLuxorFilm) {
    galleryImages = [
      "/events/luxor_film_1.png",
      "/events/luxor_film_2.png",
      "/events/luxor_film_3.png",
      "/events/luxor_film_4.png"
    ];
  } else if (isKarnakShow) {
    galleryImages = [
      "/events/karnak_show_1.png",
      "/events/karnak_show_2.png",
      "/events/karnak_show_3.png",
      "/events/karnak_show_4.png"
    ];
  } else if (isSharmTheater) {
    galleryImages = [
      "/events/sharm_theater_1.png",
      "/events/sharm_theater_2.png",
      "/events/sharm_theater_3.png",
      "/events/sharm_theater_4.png"
    ];
  } else if (isSohoConcert) {
    galleryImages = [
      "/events/sharm_concert_1.png",
      "/events/sharm_concert_2.png",
      "/events/sharm_concert_3.png",
      "/events/sharm_concert_4.png"
    ];
  } else if (isAbuSimbel) {
    galleryImages = [
      "/events/abu_simbel_gallery_1.png",
      "/events/abu_simbel_gallery_2.png",
      "/events/abu_simbel_gallery_3.png",
      "/events/abu_simbel_gallery_4.png"
    ];
  } else if (isLibrary) {
    galleryImages = [
      "/events/alex_event_1.png",
      "/events/concert_stage.png",
      "/events/concert_fireworks.png",
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80"
    ];
  } else if (isFilm) {
    galleryImages = [
      "/events/film_celeb_1.png",
      "/events/film_celeb_2.png",
      "/events/film_celeb_3.png",
      "/events/alex_event_2.png"
    ];
  }

  return (
    <div className="bg-[#fcfbf9] min-h-screen">
      {/* Hero */}
      <section className="relative w-full h-[50vh] md:h-[60vh]">
        <img src={eventImage} alt={eventTitle} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
        <div className="absolute inset-x-0 bottom-0 p-8 max-w-6xl mx-auto text-white">
          <button onClick={() => navigate(-1)} className="inline-block mb-4 text-white/70 hover:text-white text-sm uppercase tracking-wider font-bold">
            ← GO BACK
          </button>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">{eventTitle}</h1>
          <div className="inline-block bg-white/10 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/20">
             <SocialShare url={window.location.href} title={eventTitle} />
          </div>
        </div>
      </section>

      {/* Content */}
      <SectionWrapper className="py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-10">
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-8">
               <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-[#f4a261]/10 text-[#f4a261] rounded-full flex items-center justify-center text-xl">
                    <FaCalendarAlt />
                 </div>
                 <div>
                   <p className="text-sm text-gray-500 font-medium">Date</p>
                   <p className="font-bold text-[#14213d]">{eventDate}</p>
                 </div>
               </div>

               <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-[#f4a261]/10 text-[#f4a261] rounded-full flex items-center justify-center text-xl">
                    <FaClock />
                 </div>
                 <div>
                   <p className="text-sm text-gray-500 font-medium">Time</p>
                   <p className="font-bold text-[#14213d]">{eventTime}</p>
                 </div>
               </div>

               <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-[#f4a261]/10 text-[#f4a261] rounded-full flex items-center justify-center text-xl">
                    <FaMapMarkerAlt />
                 </div>
                 <div>
                   <p className="text-sm text-gray-500 font-medium">Venue</p>
                   <p className="font-bold text-[#14213d]">{eventVenue}</p>
                 </div>
               </div>
             </div>

             <div>
               <h2 className="text-2xl font-bold text-[#14213d] mb-4">About The Event</h2>
               <p className="text-gray-600 leading-relaxed text-lg">{eventDesc}</p>
             </div>

             <div>
               <h2 className="text-2xl font-bold text-[#14213d] mb-4">Terms & Rules</h2>
               <ul className="list-disc pl-5 space-y-2 text-gray-600">
                 {eventRules.map((rule: any, idx: number) => (
                   <li key={idx}>{rule}</li>
                 ))}
               </ul>
             </div>

             <div className="mt-8">
               <InteractiveMap locationName={eventVenue} />
             </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
                <h3 className="text-xl font-bold text-[#14213d] mb-6 border-b border-gray-100 pb-4">Booking Info</h3>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500">Price per ticket</span>
                  <span className="text-2xl font-bold text-[#14213d]"><PriceDisplay price={Number(eventPrice)} /></span>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="text-gray-500 text-sm">
                    Select your exact date and amount of tickets in the next step.
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full py-4 bg-[#f4a261] hover:bg-[#e76f51] text-white font-bold rounded-xl transition flex justify-center items-center gap-2 shadow-md"
                >
                  <FaTicketAlt /> Proceed to Checkout
                </button>
             </div>
          </div>

        </div>
      </SectionWrapper>

      <SectionWrapper className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#14213d] mb-10 text-center font-serif border-b border-gray-100 pb-4">Event Photo Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img, idx) => (
              <div key={idx} className="w-full h-64 rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative group">
                <img src={img} alt={`Gallery view ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default EventDetailsPage;
