import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Heading from "../Ui/Heading";
import Image from "../Ui/Image";
import SectionWrapper from "./SectionWrapper";
import { getActivities } from "../../api/activityService";
import type { Activity } from "../../api/activityService";

const PopularThingsToDoSection = () => {
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await getActivities();
        // If the backend has data, use it. Otherwise, use a static fallback for safety
        setItems(data && data.length > 0 ? data : getFallbackData());
      } catch (error) {
        console.error("Failed to load activities", error);
        setItems(getFallbackData());
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const getFallbackData = (): Activity[] => [
    { id: 1, image: "/images/ThingsToDo1.jpeg", title: "City Tours", description: "", price: 0, location: "", rating: 0, review_count: 0 },
    { id: 2, image: "/images/ThingsToDo2.jpeg", title: "Cruises", description: "", price: 0, location: "", rating: 0, review_count: 0 },
    { id: 3, image: "/images/ThingsToDo3.jpeg", title: "Beach Tours", description: "", price: 0, location: "", rating: 0, review_count: 0 },
    { id: 4, image: "/images/ThingsToDo4.jpeg", title: "Food", description: "", price: 0, location: "", rating: 0, review_count: 0 },
    { id: 5, image: "/images/ThingsToDo5.jpeg", title: "Hiking", description: "", price: 0, location: "", rating: 0, review_count: 0 },
    { id: 6, image: "/images/ThingsToDo6.jpeg", title: "Museum Tour", description: "", price: 0, location: "", rating: 0, review_count: 0 },
  ];

  return (
    <SectionWrapper>
      <Heading title="Popular Things To Do" />

      {loading ? (
        <div className="flex justify-center items-center h-40">
           <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#D4AF37]"></div>
        </div>
      ) : (
        <div className="masonry">
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/things-to-do/${item.id}`}
              state={{ item }}
              className="masonry-item block overflow-hidden rounded-xl border-2 border-transparent transition-all duration-500 hover:border-[#D4AF37] hover:shadow-[0_15px_30px_rgba(212,175,55,0.3)] hover:-translate-y-2 group relative"
            >
              <Image src={item.image} alt={item.title} className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-b-xl">
                  <h3 className="text-white font-bold text-lg">{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
};

export default PopularThingsToDoSection;
