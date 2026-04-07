import React, { useState, useEffect } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { getReviews, submitReview } from '../../api/reviewService';
import type { ReviewPayload } from '../../api/reviewService';
import { useApp } from '../../context/AppContext';

interface ReviewSectionProps {
  rating: number;
  reviewCount: number;
  itemId: string | number;
  itemType: string; // 'tour', 'package', 'destination'
}

interface ReviewItem {
    id: number;
    rating: number;
    comment: string;
    created_at: string;
    user?: {
        name: string;
    }
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ rating, reviewCount, itemId, itemType }) => {
  const { user } = useApp();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Submit Form State
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const safeRating = Number(rating) || 0;
  const fullStars = Math.max(0, Math.floor(safeRating));
  const hasHalfStar = safeRating % 1 >= 0.5;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

  useEffect(() => {
     const fetchDbReviews = async () => {
         try {
             // Try fetching real reviews from DB
             const data = await getReviews(itemType, itemId);
             setReviews(data);
         } catch (err) {
             console.error("No DB reviews yet or API error");
         } finally {
             setLoading(false);
         }
     }
     fetchDbReviews();
  }, [itemId, itemType]);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError('');

      if (!user) {
          setSubmitError('You must be logged in to leave a review.');
          window.dispatchEvent(new Event('open-auth-modal'));
          return;
      }

      if (newRating === 0) {
          setSubmitError('Please select a star rating.');
          return;
      }

      setIsSubmitting(true);
      try {
          const payload: ReviewPayload = {
              rating: newRating,
              comment: comment.trim()
          };
          const response = await submitReview(itemType, itemId, payload);
          
          // Optimistic update
          setReviews(prev => [response.review, ...prev]);
          
          // Reset form
          setNewRating(0);
          setHoverRating(0);
          setComment('');
      } catch (err: any) {
          setSubmitError('Failed to submit review. Please try again.');
      } finally {
          setIsSubmitting(false);
      }
  };

  return (
    <div className="mt-12 border-t border-gray-100 dark:border-gray-800 pt-8" id="reviews-section">
      <h3 className="text-2xl font-bold text-[#14213d] dark:text-white mb-8 font-serif">Guest Reviews</h3>
      
      {/* Global Average Summary */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-10 bg-gray-50 dark:bg-gray-800/30 p-8 rounded-3xl">
        <div className="text-center md:border-r border-gray-200 dark:border-gray-700 md:pr-8">
          <p className="text-6xl font-black text-[#EB662B]">{safeRating.toFixed(1)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">Global {reviewCount} reviews</p>
        </div>
        <div className="flex-1">
          <div className="flex text-[#f4a261] text-xl mb-3">
            {[...Array(fullStars)].map((_, i) => <FaStar key={`full-${i}`} />)}
            {hasHalfStar && <FaStarHalfAlt />}
            {[...Array(emptyStars)].map((_, i) => <FaRegStar key={`empty-${i}`} />)}
          </div>
          <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">Excellent based on verified guest stays</p>
        </div>
      </div>

      {/* --- ADD REVIEW FORM --- */}
      <div className="mb-10 bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
          <h4 className="font-bold text-lg mb-4 dark:text-white">Leave your review</h4>
          
          {submitError && <div className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">{submitError}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Selector */}
              <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Your Rating:</span>
                  <div className="flex text-2xl cursor-pointer">
                      {[1, 2, 3, 4, 5].map((star) => (
                          <div 
                              key={star}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              onClick={() => setNewRating(star)}
                              className="p-1 transition-transform hover:scale-110"
                          >
                              {star <= (hoverRating || newRating) ? (
                                  <FaStar className="text-[#f4a261]" />
                              ) : (
                                  <FaRegStar className="text-gray-300 dark:text-gray-600" />
                              )}
                          </div>
                      ))}
                  </div>
              </div>

              {/* Comment Textarea */}
              <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience (optional)..."
                  className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#EB662B] focus:border-transparent outline-none transition min-h-[100px] resize-y"
              ></textarea>
              
              <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#EB662B] hover:bg-[#d55822] text-white px-6 py-2.5 rounded-lg font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
          </form>
      </div>

      {/* --- REVIEWS LIST --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading && (
             <div key="loading" className="col-span-full py-8 text-center text-gray-500 flex justify-center items-center gap-2">
                 <div className="animate-spin h-5 w-5 border-2 border-t-2 border-gray-300 border-t-[#EB662B] rounded-full"></div>
                 <span>Loading latest reviews...</span>
             </div>
        )}
        
        {!loading && reviews.length > 0 && reviews.map((rev) => (
            <div key={rev.id} className="bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#EB662B] flex items-center justify-center text-white font-bold text-lg">
                      {rev.user?.name ? rev.user.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm capitalize">{rev.user?.name || 'Anonymous Traveler'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(rev.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex text-[#f4a261] text-[10px] mb-3">
                   {[...Array(5)].map((_, i) => (
                       i < rev.rating ? <FaStar key={i} /> : <FaRegStar key={i} className="text-gray-300" />
                   ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {rev.comment ? `"${rev.comment}"` : "No comment entirely left."}
              </p>
            </div>
        ))}

        {!loading && reviews.length === 0 && (
             <div key="empty" className="col-span-full py-10 bg-gray-50 dark:bg-gray-800/30 rounded-2xl text-center">
                 <p className="text-gray-500 mb-2">No dynamic reviews yet.</p>
                 <p className="text-sm font-medium text-gray-600">Be the first to share your experience!</p>
             </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
