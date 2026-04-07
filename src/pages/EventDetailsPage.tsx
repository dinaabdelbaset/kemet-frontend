import { useState } from "react";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTicketAlt } from "react-icons/fa";
import InteractiveMap from "@/components/common/InteractiveMap";
import SocialShare from "@/components/common/SocialShare";

const EVENT_DB = [
  {
    id: 1,
    title: "Pyramids Sound & Light Show",
    image: "https://images.unsplash.com/photo-1572251460395-9b77541656bc?q=80&w=1000&auto=format&fit=crop",
    date: "Daily Shows",
    time: "8:00 PM - 10:00 PM",
    venue: "Giza Pyramids Complex, Giza",
    price: 1500,
    description: "Experience the history of Ancient Egypt brilliantly illuminated on the faces of the Pyramids and the timeless Sphinx. The Sound and Light Show uses dramatic lasers and grand storytelling to bring you back thousands of years to the era of the Pharaohs.",
    rules: ["Gates open 45 mins early.", "No flash photography.", "Tickets are non-refundable."]
  },
  {
    id: 2,
    title: "Whirling Dervishes (El Tanoura)",
    image: "https://images.unsplash.com/photo-1621360811095-207d7c669146?q=80&w=1000&auto=format&fit=crop",
    date: "Mon, Wed, Sat",
    time: "7:30 PM - 9:00 PM",
    venue: "Wekalet El Ghouri Arts Center, Cairo",
    price: 400,
    description: "A mesmerizing and spiritual performance by the traditional Egyptian Sufi Whirling Dervishes. Set in a 16th-century historic complex, watch as dancers spin endlessly in highly vibrant colored skirts to traditional rhythmic music.",
    rules: ["Seats are first-come, first-served.", "Show up at least 1 hr early."]
  },
  {
    id: 3,
    title: "Opera Aida at Luxor Temple",
    image: "https://images.unsplash.com/photo-1507676184212-d0330a151f78?q=80&w=1000&auto=format&fit=crop",
    date: "November 12, 2026",
    time: "8:00 PM - 12:00 AM",
    venue: "Luxor Temple, Luxor",
    price: 3500,
    description: "A once-in-a-lifetime grand orchestral performance of Verdi's masterpiece Opera Aida, performed live under the stars among the colossal statues and towering pillars of the ancient Luxor Temple.",
    rules: ["Formal evening attire required.", "No entry after doors close."]
  },
  {
    id: 4,
    title: "Cairo Jazz Festival",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000&auto=format&fit=crop",
    date: "Oct 22-24, 2026",
    time: "6:00 PM - 1:00 AM",
    venue: "AUC Tahrir Campus, Cairo",
    price: 1200,
    description: "A premier international music gathering bringing together the best jazz, blues, and contemporary musicians from around the globe to the heart of downtown Cairo for three days of non-stop soul.",
    rules: ["Age restricted: 16+.", "Multiple stages across the venue."]
  },
  {
    id: 5,
    title: "Red Sea EDM Beach Festival",
    image: "https://images.unsplash.com/photo-1470229722913-7c092fb1f6f1?q=80&w=1000&auto=format&fit=crop",
    date: "July 15, 2026",
    time: "10:00 PM - 5:00 AM",
    venue: "Mangroovy Beach, El Gouna",
    price: 2500,
    description: "The ultimate summer electronic dance music party on the shores of the Red Sea. Featuring top international DJs, massive neon stage designs, and beachfront dancing till sunrise.",
    rules: ["Age restricted: 21+ only.", "Zero tolerance policy enforced."]
  },
  {
    id: 6,
    title: "Cairo International Book Fair",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000&auto=format&fit=crop",
    date: "Jan 28 - Feb 6",
    time: "10:00 AM - 9:00 PM",
    venue: "Egypt International Exhibitions Center",
    price: 100,
    description: "The oldest and largest book fair in the Arab world, welcoming millions of visitors. Explore thousands of pavilions featuring global literature, cultural panels, poetry readings, and rare collections.",
    rules: ["Family friendly.", "Strollers allowed."]
  }
];

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const event = EVENT_DB.find(e => e.id === Number(id)) || EVENT_DB[0];

  const handleCheckout = () => {
    navigate('/checkout', {
      state: {
        type: 'event',
        id: event.id,
        title: event.title,
        price: event.price,
        image: event.image
      }
    });
  };

  return (
    <div className="bg-[#fcfbf9] min-h-screen">
      {/* Hero */}
      <section className="relative w-full h-[50vh] md:h-[60vh]">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
        <div className="absolute inset-x-0 bottom-0 p-8 max-w-6xl mx-auto text-white">
          <Link to="/events" className="inline-block mb-4 text-white/70 hover:text-white text-sm uppercase tracking-wider font-bold">
            ← Back to Events
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">{event.title}</h1>
          <div className="inline-block bg-white/10 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/20">
             <SocialShare url={window.location.href} title={event.title} />
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
                   <p className="font-bold text-[#14213d]">{event.date}</p>
                 </div>
               </div>

               <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-[#f4a261]/10 text-[#f4a261] rounded-full flex items-center justify-center text-xl">
                    <FaClock />
                 </div>
                 <div>
                   <p className="text-sm text-gray-500 font-medium">Time</p>
                   <p className="font-bold text-[#14213d]">{event.time}</p>
                 </div>
               </div>

               <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-[#f4a261]/10 text-[#f4a261] rounded-full flex items-center justify-center text-xl">
                    <FaMapMarkerAlt />
                 </div>
                 <div>
                   <p className="text-sm text-gray-500 font-medium">Venue</p>
                   <p className="font-bold text-[#14213d]">{event.venue}</p>
                 </div>
               </div>
             </div>

             <div>
               <h2 className="text-2xl font-bold text-[#14213d] mb-4">About The Event</h2>
               <p className="text-gray-600 leading-relaxed text-lg">{event.description}</p>
             </div>

             <div>
               <h2 className="text-2xl font-bold text-[#14213d] mb-4">Terms & Rules</h2>
               <ul className="list-disc pl-5 space-y-2 text-gray-600">
                 {event.rules.map((rule, idx) => (
                   <li key={idx}>{rule}</li>
                 ))}
               </ul>
             </div>

             <div className="mt-8">
               <InteractiveMap locationName={event.venue} />
             </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
             <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
                <h3 className="text-xl font-bold text-[#14213d] mb-6 border-b border-gray-100 pb-4">Booking Info</h3>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500">Price per ticket</span>
                  <span className="text-2xl font-bold text-[#14213d]">{event.price}</span>
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

      {/* Similar Events */}
      <SectionWrapper className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#14213d] mb-10">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {EVENT_DB.filter(e => e.id !== event.id).slice(0, 3).map((evt) => (
              <div key={evt.id} className="group bg-[#fcfbf9] rounded-3xl border border-gray-100 shadow-sm hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col">
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <img 
                    src={evt.image} 
                    alt={evt.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent pt-12 pb-4 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-white font-medium text-sm flex items-center gap-2">
                       <FaMapMarkerAlt className="text-[#E76F51]" /> {evt.venue}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <Link to={`/events/${evt.id}`}>
                    <h3 className="text-lg font-bold text-[#14213d] mb-3 group-hover:text-[#E76F51] transition-colors line-clamp-2">
                      {evt.title}
                    </h3>
                  </Link>
                  <div className="text-sm text-gray-500 flex items-center gap-2 mb-4">
                    <FaCalendarAlt className="text-[#E76F51]/70" /> {evt.date}
                  </div>
                  <div className="mt-auto border-t border-gray-100 pt-4 flex justify-between items-center">
                    <span className="font-bold text-[#14213d]">{evt.price} EGP</span>
                    <Link 
                      to={`/events/${evt.id}`}
                      className="text-sm font-bold text-[#E76F51] hover:underline"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default EventDetailsPage;
