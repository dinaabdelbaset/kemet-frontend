import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { FaCheck, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { Link, useParams, useNavigate } from "react-router-dom";
import ActivityCard from "../components/card/ActivityCard";
import HotelGallerySlider from "../components/hotel/HotelGallerySlider";
import RoomCard from "../components/hotel/RoomCard";
import SectionWrapper from "../components/sections/SectionWrapper";
import Button from "../components/Ui/Button";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import InteractiveMap from "../components/common/InteractiveMap";
import ReviewSection from "../components/common/ReviewSection";
import SocialShare from "../components/common/SocialShare";
import { useApp } from "../context/AppContext";
const ROOM_IMAGE_MAP: Record<string, string> = {
  'Classic Single Room': '/placeholder.png',
  'Deluxe Double Room': '/placeholder.png',
  'Executive Suite': '/placeholder.png',
  'Presidential Suite': '/placeholder.png'
};

const getHotelMainImage = (hotel: any) => {
  if (hotel.image) {
      if (hotel.image.startsWith('/')) {
         return 'http://localhost:5173' + hotel.image;
      }
      return hotel.image;
  }
  return '/placeholder.png'; 
};

const getHotelGallery = (hotel: any) => {
  if (hotel.gallery && Array.isArray(hotel.gallery) && hotel.gallery.length > 0) {
      return hotel.gallery.map((img: string) => img.startsWith('/') ? 'http://localhost:5173' + img : img);
  }
  return [getHotelMainImage(hotel)];
};

const HotelDetailsPage = () => {
    const { hotelId } = useParams();
    const navigate = useNavigate();
    const { addRecentlyViewed } = useApp();

    const [hotel, setHotel] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);


    useDocumentTitle(hotel?.title ? `${hotel.title} | Kemet` : "Hotel Details");

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                setIsLoading(true);
                const response = await axiosClient.get(`/hotels/${hotelId}`);
                
                if (response.data && response.data.id) {
            setHotel(response.data);
                    addRecentlyViewed({
                        id: response.data.id,
                        title: response.data.title || response.data.name,
                        image: getHotelMainImage(response.data),
                        type: "hotel",
                        link: `/hotels/${response.data.id}`
                    });
                } else {
                    throw new Error("Invalid backend data");
                }
            } catch (error) {
                console.error("Error fetching hotel:", error);
                setHotel(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (hotelId) {
            fetchHotel();
        }
    }, [hotelId]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#EB662B]"></div>
            </div>
        );
    }

    if (!hotel) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
                <h2 className="text-3xl font-bold text-[#05073C] mb-4">Hotel Not Found</h2>
                <p className="text-gray-500 mb-8">It seems we couldn't find the hotel you're looking for.</p>
                <Link to="/hotels">
                    <Button className="px-8 py-3 rounded-xl text-white font-bold">Back to Hotels</Button>
                </Link>
            </div>
        );
    }

    const hotelRooms = hotel.rooms || [];

    const handleBookRoom = (roomId: number) => {

        const room = hotelRooms.find((r: any) => r.id === roomId);
        navigate("/checkout", { 
           state: { 
              title: `${hotel.title} - ${room?.room_type || room?.type || 'Room'}`, 
              price: room?.price_per_night || hotel.price_starts_from, 
              image: ROOM_IMAGE_MAP[room?.room_type || room?.type] ? ROOM_IMAGE_MAP[room?.room_type || room?.type] : getHotelMainImage(hotel)
           } 
        });
    };

    return (
        <SectionWrapper className="bg-gray-50 min-h-screen pb-20 pt-8 relative">
            

            {/* Top Navigation Path */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                <div className="text-sm text-gray-500 font-medium flex items-center gap-2">
                    <Link to="/" className="hover:text-[#EB662B] transition-colors">Home</Link>
                    <span>/</span>
                    <Link to="/hotels" className="hover:text-[#EB662B] transition-colors">Hotels</Link>
                    <span>/</span>
                    <span className="text-[#05073C] font-bold">{hotel.title || hotel.name}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex flex-wrap items-center gap-4 mb-2">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#05073C]">{hotel.title || hotel.name}</h1>

                        </div>
                        <p className="flex items-center gap-2 text-gray-500 font-medium">
                            <FaMapMarkerAlt className="text-[#EB662B]" />
                            {hotel.address || hotel.location || hotel.city}
                        </p>
                    </div>

                    <div className="text-right flex flex-col items-end w-full md:w-auto">
                        <div className="bg-blue-50 px-6 py-4 rounded-2xl mb-1 w-full flex items-center justify-between gap-6">
                            <div>
                                <div className="text-sm text-gray-500 font-medium mb-1">Excellent</div>
                                <div className="text-sm text-gray-400">{hotel.reviews_count} verified reviews</div>
                            </div>
                            <div className="flex items-center gap-2 justify-end mb-1">
                                <span className="bg-[#05073C] text-white font-bold px-3 py-2 rounded-xl text-lg flex items-center gap-1">
                                    <FaStar className="text-yellow-400 text-sm" /> {hotel.rating}
                                </span>
                            </div>
                        </div>
                        <SocialShare url={window.location.href} title={hotel.title || hotel.name} />
                    </div>
                </div>

                {/* Image Gallery Slider */}
                <HotelGallerySlider images={getHotelGallery(hotel)} />

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                        {/* Hotel Description and Services */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8">
                            <h2 className="text-2xl font-bold text-[#05073C] mb-4">About this hotel</h2>
                            <div className="text-gray-600 leading-relaxed space-y-4">
                                <p>{hotel.description}</p>
                            </div>

                            <hr className="border-gray-100 my-8" />

                            <h3 className="text-xl font-bold text-[#05073C] mb-4">Top Amenities</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                                {(hotel.Services || ["Free WiFi", "Swimming Pool", "Room Service", "Air Conditioning", "Mini Bar", "Restaurant"]).map((service: string, index: number) => (
                                    <div key={index} className="flex items-center gap-3 text-gray-600 font-medium">
                                        <div className="bg-green-100 p-1.5 rounded-full text-green-600 text-xs">
                                            <FaCheck />
                                        </div>
                                        {service}
                                    </div>
                                ))}
                            </div>

                            <InteractiveMap locationName={`${hotel.location}, Egypt`} />
                        </div>

                        {/* AVAILABLE ROOMS SECTION */}
                        <div className="mb-8 scroll-mt-24" id="rooms">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-[#05073C] mb-2">Available Rooms</h2>
                                    <p className="text-gray-500 font-medium">Find the perfect room for your stay</p>
                                </div>
                            </div>

                            {hotelRooms.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {(() => {
                                      // Force exactly 4 big Room Cards for the UX by combining real data with mock extras
                                      const real = hotelRooms || [];
                                      const mock = [
                                        { id: 991, room_type: 'Classic Single Room', price_per_night: 425, capacity_adults: 1 },
                                        { id: 992, room_type: 'Deluxe Double Room', price_per_night: 637.50, capacity_adults: 2 },
                                        { id: 993, room_type: 'Executive Suite', price_per_night: 1062.50, capacity_adults: 2 },
                                        { id: 994, room_type: 'Presidential Suite', price_per_night: 2500, capacity_adults: 4 }
                                      ];
                                      const displayRooms = [...real, ...mock].slice(0, 4);
                                      return displayRooms.map((room: any, i: number) => (
                                        <RoomCard
                                            key={room.id || i}
                                            room={{
                                                ...room,
                                                name: room.room_type,
                                                price: room.price_per_night || room.price || hotel.price_starts_from || hotel.price,
                                                beds: room.capacity_adults || room.beds || 2,
                                                size: room.size || 40,
                                                type: room.room_type || room.type,
                                                amenities: room.features || room.amenities || ["Free WiFi", "AC", "Room Service"],
                                                status: room.status || (room.available_count > 0 ? 'Available' : 'Booked'),
                                                images: ROOM_IMAGE_MAP[room.room_type || room.type] ? [ROOM_IMAGE_MAP[room.room_type || room.type]] : [getHotelMainImage(hotel)],
                                                hasBestValueBadge: room.hasBestValueBadge || (room.available_count || 5) > 5
                                            }}
                                            onBookNow={handleBookRoom}
                                        />
                                      ));
                                    })()}
                                </div>
                            ) : (
                                <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center shadow-sm">
                                    <h3 className="text-xl font-bold text-[#05073C] mb-2">No rooms available</h3>
                                    <p className="text-gray-500">Please check back later or contact the hotel for availability.</p>
                                </div>
                            )}
                        </div>

                        {/* GUEST REVIEWS SECTION */}
                        <ReviewSection rating={hotel.rating} reviewCount={hotel.reviews_count} itemId={hotel.id.toString()} itemType="hotel" />
                    </div>
                </div>



            </div>
        </SectionWrapper>
    );
};

export default HotelDetailsPage;
