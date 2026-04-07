import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import axiosClient from "../api/axiosClient";
import TourCard from "../components/card/TourCard";
import ActivityCard from "../components/card/ActivityCard";

const WishlistPage = () => {
  const { wishlist, user } = useApp();
  const [tours, setTours] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        setIsLoading(true);
        // Fetch tours and activities from API
        const [toursRes, activitiesRes] = await Promise.all([
          axiosClient.get("/tours"),
          axiosClient.get("/activities"),
        ]);
        
        const allTours = Array.isArray(toursRes.data) ? toursRes.data : [];
        const allActivities = Array.isArray(activitiesRes.data) ? activitiesRes.data : [];

        // Filter to only wishlist items
        const savedTours = allTours.filter((t: any) => wishlist.includes(`tour-${t.id}`));
        const savedActivities = allActivities.filter((a: any) => wishlist.includes(`activity-${a.id}`));

        setTours(savedTours);
        setActivities(savedActivities);
      } catch (error) {
        console.error("Error fetching wishlist items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (wishlist.length > 0) {
      fetchWishlistItems();
    } else {
      setIsLoading(false);
    }
  }, [wishlist]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold text-[#05073C] mb-4">Please log in to view your Wishlist</h2>
        <button 
          onClick={() => window.dispatchEvent(new Event('open-auth-modal'))}
          className="bg-[#EB662B] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#d55822] transition"
        >
          Log In or Register
        </button>
      </div>
    );
  }

  const totalItems = tours.length + activities.length;

  return (
    <div className="container mx-auto px-4 py-12 min-h-[70vh]">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-[#05073C] mb-4">Your Wishlist ❤️</h1>
        <p className="text-gray-600">All your saved adventures in one place.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EB662B]"></div>
        </div>
      ) : totalItems === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-xl">Your wishlist is currently empty.</p>
          <p className="mt-2">Explore destinations and click the heart icon to save them here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <ActivityCard key={`activity-${activity.id}`} activity={activity} />
          ))}
          {tours.map((tour) => (
            <TourCard key={`tour-${tour.id}`} tour={tour} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
