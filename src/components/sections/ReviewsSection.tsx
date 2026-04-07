import { useState } from "react";
import { FaStar } from "react-icons/fa";
import Button from "../Ui/Button";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

const mockReviews: Review[] = [
  { id: 1, name: "Sarah Jenkins", rating: 5, comment: "Absolutely breathtaking! The guide was fantastic and the experience was seamless.", date: "Oct 12, 2024" },
  { id: 2, name: "Michael Chen", rating: 4, comment: "Great experience overall. The pickup was a bit late but the rest of the tour made up for it.", date: "Sep 28, 2024" },
];

export const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setReviews([
      {
        id: Date.now(),
        name: "Current User",
        rating: newRating,
        comment: newComment,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      },
      ...reviews
    ]);
    setNewComment("");
    setNewRating(5);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm my-8">
      <h3 className="text-2xl font-bold text-[#05073C] mb-6">Guest Reviews</h3>
      
      {/* Existing Reviews */}
      <div className="space-y-6 mb-8">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[#05073C]">{review.name}</span>
              <span className="text-sm text-gray-500">{review.date}</span>
            </div>
            <div className="flex text-yellow-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} />
              ))}
            </div>
            <p className="text-gray-600 leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>

      {/* Add Review Form */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="font-bold text-[#05073C] mb-4">Leave a Review</h4>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-600">Your Rating:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  className="focus:outline-none"
                >
                  <FaStar className={`w-5 h-5 ${star <= newRating ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-400 transition`} />
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share details of your own experience at this place"
            className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#EB662B] resize-none mb-3"
            rows={4}
          />
          <Button type="submit" className="bg-[#EB662B] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#d55822]">
            Submit Review
          </Button>
        </form>
      </div>
    </div>
  );
};
