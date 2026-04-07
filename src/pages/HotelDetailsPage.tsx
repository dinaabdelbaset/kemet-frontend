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
const HOTEL_IMAGE_MAP: Record<string, string> = {
  'The Nile Ritz-Carlton': 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/818899760.jpg?k=230b17f3642c1c4d4dec913fe1e03e4acdc4fa969408942e715385893f8e16a6&o=',
  'Cairo Marriott Hotel & Omar Khayyam': 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/797079050.jpg?k=41e5fa87be51b19dfe5a07048154204153fd382745471d510c419bb4cc3bb3ef&o=',
  'Four Seasons Hotel Cairo at Nile Plaza': 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/94190040.jpg?k=ef1c7c9927dbc4c9bb8ade64114c12302c1490a01530fec267460efffb8fdf47&o=',
  'Kempinski Nile Hotel': 'https://storage.kempinski.com/cdn-cgi/image/w=1920,f=auto,fit=scale-down/ki-cms-prod/images/1/7/1/5/65171-1-eng-GB/abb1d7474666-73654605_4K.jpg',
  'Om Kolthoom Hotel': 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/587837448.jpg?k=943e9a56bbf7bc001d90e96eff5f51fb7a5cffce5255a3b5a941bb2ebacf65c8&o=',
  'Fairmont Nile City': 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/765210500.jpg?k=edcf60bab46b3afb37f173db0d739d1eecac8e9069c0f82fcd0858697637c5f7&o=',
  'Pavillon Winter Luxor': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIXVCxDFThx34HiKAvZ5qNaMZCTkgDPos7Kw&s',
  'Sofitel Winter Palace Luxor': 'https://phgcdn.com/images/uploads/LXRSW/overviewimages/1600x813-Winter-Palace-Exterior-and-Nile-River-at-Night.jpg',
  'Hilton Luxor Resort & Spa': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/cc/82/fe/hotel-main-swimming-pool.jpg?w=900&h=500&s=1',
  'Jolie Ville Hotel & Spa': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpXq1U3HnO70tbf4t4imo3gLxqI8AAjx1zhw&s',
  'Steigenberger Nile Palace': 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/520473784.jpg?k=183c0863529ab6a6fcc707a1b473722c404da45c1e7ce02f0af421cc3707c882&o=',
  'Sonesta St. George Hotel': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvBBihkp2TaEPtuyZK5gOMq4GBr7KejWLsaQ&s',
  'Sofitel Legend Old Cataract': 'https://www.ahstatic.com/photos/1666_ho_00_p_1024x768.jpg',
  'Mövenpick Resort Aswan': 'https://m.ahstatic.com/is/image/accorhotels/Aswan_xxxxxxxxxxxx_i130214:8by10?wid=412&hei=515&dpr=on,2.625&qlt=75&resMode=sharp2&op_usm=0.5,0.3,2,0&iccEmbed=true&icc=sRGB',
  'Citymax Hotel Aswan': 'https://www.hoteliermiddleeast.com/2021/05/zpjydscU-Citymax-Aswan.jpg',
  'Tolip Aswan Hotel': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3eKyiTx2HtgQFlG4PWzxmpMYU4vAonZiOJg&s',
  'Basma Hotel Aswan': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrEbvwqi6GTKCgMBJik86X4fNMM-pWUC_HWg&s',
  'Pyramisa Island Hotel Aswan': 'https://static21.com-hotel.com/uploads/hotel/61097/photo/pyramisa-island-hotel-aswan_15828427011.jpg',
  'Rixos Premium Seagate': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/25/03/8e/75/rixos-premium-seagate.jpg?w=900&h=500&s=1',
  'Four Seasons Resort Sharm El Sheikh': 'https://static.prod.r53.tablethotels.com/media/hotels/slideshow_images_staged/large/1414922.jpg',
  'Sunrise Arabian Beach Resort': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMCGJ8j91vHMl4PQVz31TGWucd0PNfmPrOuw&s',
  'Steigenberger Alcazar': 'https://assets.hrewards.com/assets/572_SHR_Alcazar_exterior_Overview_Night_f9bee851ef.jpg',
  'Mövenpick Resort Sharm': 'https://q-xx.bstatic.com/xdata/images/hotel/max500/244332007.jpg?k=8a3ea8cb1076f50b645f8f167f8dcde2059252b53995fa753983acc25f29ff05&o=',
  'Stella Di Mare Beach Hotel': 'https://q-xx.bstatic.com/xdata/images/hotel/max500/81552816.jpg?k=741a94a22ea8781430ae987436b19082c452bcf641a0a12e52d9842d85fead5b&o=',
  'Steigenberger ALDAU Beach Hotel': 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/611083499.jpg?k=7c459a47c8f9a0fd10240c51d07aa65aac9256a6217e373af17b720d77f42a09&o=',
  'Sunrise Royal Makadi Resort': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIjcrmlVZ5MYF_ZXbEwm6yuVOn5mugzD3fcQ&s',
  'Jaz Makadi Star & Spa': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/94/d6/ad/jaz-makadi-star-spa.jpg?w=500&h=-1&s=1',
  'Baron Palace Sahl Hasheesh': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSawu1UIOT1tu-59DifAdNRpwp5TlXZWHx5Ug&s',
  'Titanic Palace': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/32/6b/01/03/birds-eye-overview-of.jpg?w=500&h=-1&s=1',
  'Desert Rose Resort': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOzeJOIJIcegapUUg0J5CWhPUjK_vq3f0KQQ&s',
  'Four Seasons San Stefano': 'https://www.siac.com.eg/sites/default/files/san-stefano-front-view-siac.jpg',
  'Steigenberger Cecil Hotel': 'https://static.wixstatic.com/media/0dbdf2_be300604eaf64c9b8b75532d2873fab1~mv2_d_3916_3307_s_4_2.jpg/v1/fill/w_1956,h_838,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/0dbdf2_be300604eaf64c9b8b75532d2873fab1~mv2_d_3916_3307_s_4_2.jpg',
  'Helnan Palestine Hotel': 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/363689492.jpg?k=2d7bed4ab44f43f924cb6187830b34adbf3fb41a1987fd0f5061e6b2a358fe4f&o=',
  'Tolip Hotel Alexandria': 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/288644202.jpg?k=5ba38f47744415ee4d072303af89bf69b987e9f15ab3e69dc8c442d085a675d9&o=',
  'Hilton Alexandria Corniche': 'https://www.hilton.com/im/en/ALYACHI/3160549/pool-generic-horizontal.jpg?impolicy=crop&cw=5694&ch=3188&gravity=NorthWest&xposition=0&yposition=303&rw=768&rh=430',
  'Paradise Inn Le Metropole': 'https://cf.bstatic.com/xdata/images/hotel/max500/423611952.jpg?k=956daa67d1bbc4331ae665c65ea4954f21a664dab2672dd152151c1eadb0c0b0&o=&hp=1',
  'Marriott Mena House': 'https://images.trvl-media.com/lodging/18000000/17170000/17162700/17162680/2ac8dde9.jpg?impolicy=fcrop&w=1200&h=800&quality=medium',
  'Le Méridien Pyramids Hotel': 'https://www.marsaalamtours.com/images/Egypt_attraction_guide/le-meridien-pyramids-hotel/le-meridien-pyramids-hotel_29777.jpg',
  'Steigenberger Pyramids Cairo': 'https://www.egypttoursportal.com/images/2024/05/Steigenberger-Pyramids-Cairo-Egypt-Tours-Portal.jpg',
  'Triumph Luxury Hotel': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/2b/4b/b0/triumph-luxury-hotel.jpg?w=900&h=500&s=1',
  'Oasis Hotel Pyramids': 'https://images.trvl-media.com/lodging/74000000/73570000/73569100/73569070/d043103b_edited_8b58.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill',
  'Grand Pyramids Hotel': 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/267723989.jpg?k=57f4edbe9ec212b877edd3010001f9f2a0698c27f4a31afbf1ef024152b0bb6e&o=',
  'Jaz Almaza Beach Resort': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/e5/7f/fd/caption.jpg?w=500&h=-1&s=1',
  'Carols Beau Rivage Hotel': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/12/81/c4/overlooking-the-hotel.jpg?w=900&h=500&s=1',
  'Beau Site Belle Vue': 'https://static21.com-hotel.com/uploads/hotel/61260/photo/beau-site-belle-vue-hotel_15380002378.jpg',
  'Porto Matrouh Beach Resort': 'https://cf.bstatic.com/xdata/images/hotel/max500/303253632.jpg?k=e372582b539789e88fb01d1b5f68dc0af5cfc0a82396b0bbb8af5ed646928282&o=&hp=1',
  'Adriatica Hotel': 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/550831891.jpg?k=d3a616e964928354eddf3b3836fe9579cf2d5a777c13f90bde000c07fb86f298&o=',
  'Negresco Hotel': 'https://imagesawe.s3.amazonaws.com/styles/max980/s3/companies/images/2021/02/negresco_hotel.png?itok=xI2Ad3Kj',
  'Resta Port Said Hotel': 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/419857883.jpg?k=7a59dd191d279d23d9d41c3d55ec1aab17a5e49e94ea3a6644566209fc14b369&o=',
  'Port Said Hotel': 'https://portsaidmisrtravel.com/img/about/hotel.jpg',
  'Jewel Port Said Hotel': 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/267863563.jpg?k=49cf6059bf5010be653f9bf1423d7fc9c7792b0656d5f04d59fc2cffac106ef5&o=',
  'Grand Hotel Port Said': 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/453782406.jpg?k=3865ec3ef0e6a0d789d2feab3477bc12e4f474f22204d473c08be1d17ddfc693&o=',
  'Palace Hotel Port Said': 'https://q-xx.bstatic.com/xdata/images/hotel/max500/507142438.jpg?k=884b50b6d8a9812362f95c92d1cba6f61223b6b7378755bafb7aa73642142feb&o=',
  'Noras Village': 'https://www.eg-northcoast.com/data/Photos/OriginalPhoto/10756/1075689/1075689649/photo-noras-beach-hotel-port-said-1.JPEG',
  'Lazib Inn Resort & Spa': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/ee/97/d6/general-area-of-the-pool.jpg?w=900&h=500&s=1',
  'Byoum Lakeside Hotel': 'https://blogs.realestate.gov.eg/wp-content/uploads/2024/08/hotel-panoramic-view.jpg',
  'Helnan Auberge Fayoum': 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/219692026.jpg?k=5321f658340a433cc9bad08955b66501baf1dbb4b088a2897c6c3f8f4e1fbcf8&o=',
  'Tunis Village Resort': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTQnyej2smTL2Y5G8TVISGMJB8i9n_KTLxQg&s',
  'Tzila Lodge': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjY0_Pkhc1nwbQuTaiRML5vKXrYRqRiPjQbg&s',
  'Zad Al Mosafer Guest House': 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/409193308.jpg?k=1310c0befefdad26c908e1cc8b3e31ce3ec64aa4693e3ca5dade3bb428d6264d&o=',
};

const ROOM_IMAGE_MAP: Record<string, string> = {
  'Classic Single Room': 'https://image-tc.galaxy.tf/wijpeg-9m1i1ijyovvgwvgbx2yvokfbd/classic-single-room-at-warwick-geneva_standard.jpg?crop=120%2C0%2C1680%2C1260',
  'Deluxe Double Room': 'https://www.princehotels.com/tokyo/wp-content/uploads/sites/9/2019/06/%E3%83%87%E3%83%A9%E3%83%83%E3%82%AF%E3%82%B9%E3%83%84%E3%82%A4%E3%83%B3%E3%83%BB%E3%82%A2%E3%83%83%E3%83%91%E3%83%BC%EF%BC%88201809%EF%BC%894X3.jpg',
  'Executive Suite': 'https://image-tc.galaxy.tf/wijpeg-2jct4zgskj1iaxbbuhm99w2yo/executive-suite-twin-living-area_wide.jpg?crop=0%2C101%2C1920%2C1080',
  'Presidential Suite': 'https://thelibrary.mgmresorts.com/transform/osyHcjoSIT22/MAN02950.tif'
};

const getHotelMainImage = (hotel: any) => {
  const title = hotel.title || hotel.name;
  if (title && HOTEL_IMAGE_MAP[title]) {
    return HOTEL_IMAGE_MAP[title];
  }
  if (hotel.image && !hotel.image.startsWith('/')) {
     return hotel.image;
  }
  return '/hotels-live/realistic_cairo.png'; 
};

const getHotelGallery = (hotel: any) => {
  const mainImage = getHotelMainImage(hotel);
  return [mainImage];
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
