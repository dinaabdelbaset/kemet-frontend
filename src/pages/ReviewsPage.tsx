import { Link } from "react-router-dom";
import { FaArrowLeft, FaStar, FaSpinner } from "react-icons/fa6";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { useState, useEffect } from "react";
import { getAllReviews } from "@/api/reviewService";

const ReviewsPage = () => {
  const [realReviews, setRealReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getAllReviews();
        setRealReviews(data);
      } catch (error) {
        console.error("Failed to load global reviews from database");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const mockReviews = [
    {
      name: "John Smith",
      role: "Traveler",
      rating: 5,
      date: "2 days ago",
      comment: "I had an amazing experience with this company. The service was top-notch, and the staff was incredibly friendly. I highly recommend them!",
      avatar: "https://ui-avatars.com/api/?name=Customer&background=random"
    },
    {
      name: "Sarah Jenkins",
      role: " Solo Traveler",
      rating: 5,
      date: "1 week ago",
      comment: "Absolutely perfect! Everything was planned meticulously. Will definitely use this booking app for my next vacation.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
    },
    {
      name: "Michael Chen",
      role: "Family Trip",
      rating: 4,
      date: "3 weeks ago",
      comment: "Great experience overall. The hotel selections were exactly what we requested. Dropped one star because the airport transfer was late, but otherwise fantastic.",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop"
    },
    {
      name: "Emma Watson",
      role: "Couple",
      rating: 5,
      date: "1 month ago",
      comment: "We booked our honeymoon through this app and it was magical! Excellent prices and amazing customer support.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
    }
  ];

  const dbReviewsMapped = realReviews.map(r => ({
     name: r.user?.name || "Anonymous",
     role: `Reviewed ${r.item_type || "Trip"}`,
     rating: r.rating || 5,
     date: new Date(r.created_at).toLocaleDateString(),
     comment: r.comment || "No comment provided.",
     avatar: r.user?.avatar || `https://ui-avatars.com/api/?name=${r.user?.name || 'A'}&font-size=0.4&background=EB662B&color=fff`
  }));

  const allReviewsToDisplay = [...dbReviewsMapped, ...mockReviews];

  return (
    <SectionWrapper className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#EB662B] text-sm font-medium transition mb-8"
        >
          <FaArrowLeft />
          Back to Home
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-[#05073C] mb-8 text-center">
          What Our Customers Say
        </h1>

        {loading ? (
             <div className="flex justify-center items-center py-20">
                 <FaSpinner className="animate-spin text-4xl text-[#EB662B]" />
             </div>
        ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {allReviewsToDisplay.map((review, idx) => (
                 <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 50}ms` }}>
                   <div className="flex items-center gap-4 mb-4">
                     <img 
                       src={review.avatar} 
                       alt={review.name} 
                       className="w-14 h-14 rounded-full object-cover border border-gray-100 shadow-sm"
                     />
                     <div>
                       <h3 className="font-bold text-[#05073C] capitalize">{review.name}</h3>
                       <p className="text-xs text-[#EB662B] font-semibold">{review.role} <span className="text-gray-400 font-normal">• {review.date}</span></p>
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-1 mb-3">
                     {[...Array(5)].map((_, i) => (
                       <FaStar 
                         key={i} 
                         className={`text-[15px] ${i < review.rating ? "text-[#f4a261]" : "text-gray-200"}`} 
                       />
                     ))}
                   </div>

                   <p className="text-gray-600 text-[15px] leading-relaxed relative">
                     <span className="text-[#EB662B] font-serif text-3xl leading-none absolute -top-2 -left-3 opacity-20">"</span>
                     <span className="relative z-10">{review.comment}</span>
                     <span className="text-[#EB662B] font-serif text-3xl leading-none absolute -bottom-3 ml-1 opacity-20">"</span>
                   </p>
                 </div>
               ))}
             </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default ReviewsPage;
