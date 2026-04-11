import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import {
  FaCalendarCheck,
  FaConciergeBell,
  FaDumbbell,
  FaHeadset,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaSpa,
  FaStar,
  FaSwimmingPool,
  FaUtensils,
  FaWifi,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Button from "../components/Ui/Button";
import SectionWrapper from "../components/sections/SectionWrapper";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import AdvancedFilters from "../components/common/AdvancedFilters";

const LUXURY_HOTEL_IMAGES = [
  "/hotels-live/realistic_cairo.png",
  "/hotels-live/realistic_siwa.png",
  "/hotels-live/realistic_redsea.png",
  "/hotels-live/realistic_pyramids.png"
];

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

const getHotelImage = (hotel: any) => {
  const title = hotel.title || hotel.name;
  if (title && HOTEL_IMAGE_MAP[title]) {
    return HOTEL_IMAGE_MAP[title];
  }
  if (hotel.image && !hotel.image.startsWith('/')) {
     return hotel.image;
  }
  return LUXURY_HOTEL_IMAGES[(hotel.id || 0) % LUXURY_HOTEL_IMAGES.length];
};
const amenities = [
  { icon: <FaWifi />, name: "Free High-Speed WiFi" },
  { icon: <FaSwimmingPool />, name: "Infinity Pools" },
  { icon: <FaUtensils />, name: "Fine Dining" },
  { icon: <FaSpa />, name: "Luxury Spa" },
  { icon: <FaDumbbell />, name: "Fitness Center" },
  { icon: <FaConciergeBell />, name: "24/7 Concierge" },
];

const HotelsPage = () => {
  useDocumentTitle("Hotels | Kemet");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [hotels, setHotels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarFilters, setSidebarFilters] = useState<{ priceRange: [number, number]; stars: number[] }>({
    priceRange: [0, 5000],
    stars: []
  });
  const [apiError, setApiError] = useState<string | null>(null);

  const cities = ["All", "Cairo", "Giza", "Hurghada", "Sharm El-Sheikh", "Alexandria", "Luxor", "Aswan", "Marsa Matrouh", "Port Said", "Fayoum"];

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setIsLoading(true);
        setApiError(null);
        // Use axiosClient so it points to the correct deployed URL
        const response = await axiosClient.get("/hotels");
        if (Array.isArray(response.data) && response.data.length > 0) {
            setHotels(response.data);
        } else if (response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
            setHotels(response.data.data);
        } else {
            setHotels([]);
        }
      } catch (error: any) {
        console.error("Error fetching hotels:", error.message);
        setHotels([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const filteredHotels = hotels.filter((hotel) => {
    const title = hotel.title || hotel.name || "";
    const matchesSearch = title.toLowerCase().includes((searchTerm || "").toLowerCase());
    
    const location = hotel.location || hotel.city || "";
    const matchesCity = selectedCity === "All" || location === selectedCity;
    
    const price = Number(hotel.price_starts_from) || Number(hotel.price) || 0;
    const matchesPrice = price <= sidebarFilters.priceRange[1];
    
    const rating = Number(hotel.rating) || 0;
    const matchesStars = sidebarFilters.stars.length === 0 || sidebarFilters.stars.includes(Math.floor(rating));
    
    return matchesSearch && matchesCity && matchesPrice && matchesStars;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920"
            alt="Hotels Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
            Find Your Perfect Stay
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 drop-shadow-md">
            Discover luxury hotels, boutique stays, and cozy resorts tailored
            for your unforgettable journey.
          </p>
          <a href="#hotels-list" className="flex justify-center items-center">
            <Button className="px-10 py-4 rounded-full text-white text-lg font-bold shadow-xl transform transition hover:scale-105">
              Explore Now
            </Button>
          </a>
        </div>
      </section>

      {/* Stats / Benefits Bar */}
      <div className="bg-white border-b border-gray-100 py-8 relative z-20 -mt-10 mx-auto max-w-6xl rounded-xl shadow-xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex items-center gap-4">
          <div className="bg-[#EB662B]/10 p-4 rounded-full">
            <FaShieldAlt className="text-[#EB662B] text-2xl" />
          </div>
          <div>
            <h4 className="font-bold text-[#05073C]">Best Price Guarantee</h4>
            <p className="text-sm text-gray-500">
              We match any price you find.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-[#EB662B]/10 p-4 rounded-full">
            <FaCalendarCheck className="text-[#EB662B] text-2xl" />
          </div>
          <div>
            <h4 className="font-bold text-[#05073C]">Free Cancellation</h4>
            <p className="text-sm text-gray-500">
              Flexible bookings for your peace of mind.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-[#EB662B]/10 p-4 rounded-full">
            <FaHeadset className="text-[#EB662B] text-2xl" />
          </div>
          <div>
            <h4 className="font-bold text-[#05073C]">24/7 Support</h4>
            <p className="text-sm text-gray-500">
              We're here whenever you need us.
            </p>
          </div>
        </div>
      </div>

      {/* Hotel Gallery Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#05073C]">
            Explore Our Destinations
          </h2>
          <p className="text-gray-500 mt-2">
            Take a glimpse at some of our most stunning properties.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {hotels.slice(0, 4).map((hotel, index) => (
            <div
              key={index}
              className="relative h-64 overflow-hidden rounded-2xl group border-2 border-transparent transition-all duration-500 hover:border-[#D4AF37] hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:-translate-y-2"
            >
              <img
                src={getHotelImage(hotel)}
                alt={hotel.title || hotel.name || "Hotel"}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            </div>
          ))}
        </div>
      </div>

      <div
        id="hotels-list"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        {/* Search & Filter Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-[#05073C]">
              Available Hotels
            </h2>
            <p className="text-gray-500 mt-1">
              Showing the best results in your selected location.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 grow max-w-2xl bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
            <div className="grow">
              <input
                type="text"
                placeholder="Search hotel name..."
                className="w-full px-4 py-3 text-sm focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="h-10 w-px bg-gray-200 hidden sm:block" />
            <div className="min-w-37.5">
              <select
                className="w-full px-4 py-3 text-sm focus:outline-none bg-transparent cursor-pointer font-medium"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Filters and Hotels Grid Layout */}
        <div className="flex flex-col md:flex-row gap-8 mb-16">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <AdvancedFilters onFilterChange={setSidebarFilters} />
          </div>
          
          {/* Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EB662B]"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                  {filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white rounded-2xl overflow-hidden border-2 border-transparent hover:border-[#D4AF37] hover:shadow-[0_12px_30px_rgba(212,175,55,0.25)] transition-all duration-500 group flex flex-col h-full hover:-translate-y-2"
            >
              {/* Hotel Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={getHotelImage(hotel)}
                  alt={hotel.title || "Hotel"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Booking.com Style Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                   {hotel.id % 3 === 0 && (
                     <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded shadow-md w-max">
                        High Demand - Only 2 rooms left!
                     </span>
                   )}
                   {hotel.id % 2 === 0 && (
                     <span className="bg-[#003580] text-white text-[10px] font-black uppercase px-2 py-1 rounded shadow-md flex items-center gap-1 w-max">
                        Kemet VIP Genius Level 2
                     </span>
                   )}
                </div>

                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[#05073C] font-bold shadow-sm flex flex-col items-center gap-1">
                  <div className="flex gap-1 items-center">
                     <span className="text-xl">{(hotel.rating || 9.8).toFixed(1)}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 uppercase">{hotel.rating >= 9 ? 'Exceptional' : 'Fabulous'}</span>
                </div>
              </div>

              {/* Hotel Details */}
              <div className="p-6 flex flex-col grow">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#EB662B] uppercase tracking-wider mb-2">
                  <FaMapMarkerAlt />
                  {hotel.location || hotel.city}
                </div>
                <h3 className="text-xl font-bold text-[#05073C] group-hover:text-[#EB662B] transition-colors leading-tight">
                  {hotel.title || hotel.name}
                </h3>
                
                {/* Free Cancellation Badge */}
                <div className="mt-2 mb-3">
                   <p className="text-green-700 font-bold text-xs">✓ Free cancellation</p>
                   <p className="text-green-700 text-[10px]">No prepayment needed – pay at the property</p>
                </div>
                
                <p className="text-sm text-gray-500 line-clamp-2 mt-auto mb-4">
                  {hotel.description || "Experience luxury with top-tier amenities and stunning views."}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">
                      Starts from
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-[#05073C]">
                        ${hotel.price_starts_from || hotel.price}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">
                        /night
                      </span>
                    </div>
                  </div>
                  <Link to={`/hotels/${hotel.id}`}>
                    <Button className="text-white text-sm px-7 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                      View Stay
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
              </>
            )}

            {apiError && !isLoading && (
              <div className="text-center py-24 bg-red-50 rounded-3xl border border-red-300">
                <h3 className="text-2xl font-bold text-red-500">
                  Backend API Error ⚠️
                </h3>
                <p className="text-red-400 mt-2">
                  {apiError} (Make sure your Laravel backend is running and allows CORS).
                </p>
              </div>
            )}

            {filteredHotels.length === 0 && !isLoading && !apiError && (
              <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300">
                <h3 className="text-2xl font-bold text-gray-400">
                  No matching hotels found.
                </h3>
                <p className="text-gray-400 mt-2">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Amenities Section */}
      <SectionWrapper className="bg-white py-24 px-6 md:px-12 rounded-3xl mb-20 shadow-sm border border-gray-100">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#05073C]">
            World-Class Amenities
          </h2>
          <p className="text-gray-500 mt-2">
            Everything you need for a comfortable and luxury stay.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {amenities.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-4 group">
              <div className="w-16 h-16 bg-[#EB662B]/5 rounded-2xl flex items-center justify-center text-[#EB662B] text-2xl group-hover:bg-[#EB662B] group-hover:text-white transition-all duration-300 transform group-hover:-translate-y-2">
                {item.icon}
              </div>
              <span className="text-sm font-bold text-[#05073C] text-center">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/*  Rewards Section */}
      <SectionWrapper className="mb-20">
        <div className="relative overflow-hidden rounded-3xl bg-[#05073C] p-8 md:p-16">
          <div className="relative z-10 max-w-2xl">
            <span className="text-[#EB662B] font-bold tracking-widest uppercase text-sm">
              Join the Club
            </span>
            <h2 className="text-white text-3xl md:text-5xl font-extrabold mt-4 leading-tight">
              Save up to <span className="text-[#EB662B]">20% extra</span> with
              our membership
            </h2>
            <p className="text-white/70 mt-6 text-lg">
              Sign up for free and get instant access to member-only prices on
              thousands of hotels worldwide.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button className="px-10 py-4 rounded-xl text-white font-bold">
                Join Now for Free
              </Button>
              <Button
                backgroundColor="transparent"
                className="px-10 py-4 rounded-xl text-white font-bold border border-white/20 hover:bg-white/5"
              >
                Learn More
              </Button>
            </div>
          </div>
          {/* Abstract background elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#EB662B]/10 blur-3xl rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[#EB662B]/5 blur-3xl rounded-full -ml-20 -mb-20" />
        </div>
      </SectionWrapper>
    </div>
  );
};

export default HotelsPage;
