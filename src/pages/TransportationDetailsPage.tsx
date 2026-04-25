import PriceDisplay from "../components/common/PriceDisplay";
import {
  FaCheck,
  FaClock,
  FaBuilding,
  FaRoute,
  FaStar,
  FaUsers,
} from "react-icons/fa";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../components/Ui/Button";
import SectionWrapper from "../components/sections/SectionWrapper";
import { getTransportationDetails } from "../api/transportationService";

const EXTERNAL_TRANSPORT_IMAGES = [
  "https://cdn.bookaway.com/media/files/67f8bcd9cb2c304aa42bba49.png",
  "https://otobeesy.com/img/about/3.jpg",
  "https://www.trans2day.com/wp-content/uploads/2026/01/%D9%85%D9%88%D8%A7%D8%B9%D9%8A%D8%AF-%D8%A3%D8%AA%D9%88%D8%A8%D9%8A%D8%B3%D8%A7%D8%AA-%D8%B4%D8%B1%D9%82-%D8%A7%D9%84%D8%AF%D9%84%D8%AA%D8%A7-%D8%A8%D8%A7%D9%84%D9%85%D8%AD%D8%A7%D9%81%D8%B8%D8%A7%D8%AA-%D9%88%D8%A3%D8%B3%D8%B9%D8%A7%D8%B1-%D8%A7%D9%84%D8%AA%D8%B0%D8%A7%D9%83%D8%B1-1-780x470.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/b/bc/Toyota_Hiace_%28fifth_generation%29_%28Grand_Cabin%29_%28front%29%2C_Kuala_Lumpur.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1UkEZaU_97zifw4Oqvu89ZOaZaZz_hVUz6A&s",
  "https://kingwaycarrental.com/wp-content/uploads/2025/07/BMW-420i-Convertible-Grey.jpg",
  "https://renty.ae/cdn-cgi/image/format=auto,fit=contain,width=408,height=258,sharpen=0/https://renty.ae/uploads/car/photo/l/silver_porsche--carrera-gts_2024_6294_main_0151d74cccb9c4c0a5e6a651eddc0d54.jpg",
  "https://octane.rent/wp-content/uploads/2024/12/porsche_cayenne_coupe_grey_01-600x400.webp",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH6Oj0LFmMkjs8ChSa22JNw57LIO0KAlOWOw&s",
  "https://octane.rent/wp-content/uploads/2025/05/tesla_cybertruck_silver_01-600x400.webp",
  "https://renty.ae/uploads/car/photo/l/white_tesla-model-y-long-range_2022_4942_main_9777a57e057e742ec561055fcefd91de.jpg",
  "https://exfordrentacar.com/program/images/products/16681642622.jpeg",
  "https://exfordrentacar.com/program/images/products/16840891482.jpeg"
];

const TransportationDetailsPage = () => {
  const { transportId } = useParams();
  const navigate = useNavigate();
  const [transport, setTransport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransport = async () => {
      try {
        setIsLoading(true);
        const data = await getTransportationDetails(transportId!);
        setTransport(data);
      } catch (error) {
        console.error("Error fetching transport:", error);
        setTransport(null);
      } finally {
        setIsLoading(false);
      }
    };
    if (transportId) fetchTransport();
  }, [transportId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#EB662B]"></div>
      </div>
    );
  }

  // If not found, show error message  
  if (!transport) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <h2 className="text-3xl font-bold text-[#05073C] mb-4">
          Transport Not Found
        </h2>
        <p className="text-gray-500 mb-8">
          We couldn't find the transportation option you're looking for.
        </p>
        <Link to="/transportation">
          <Button className="px-8 py-3 rounded-xl text-white font-bold">
            Back to Transportation
          </Button>
        </Link>
      </div>
    );
  }

  // Derive the target specific UI image from the ID explicitly mapping it similarly to the listing wrapper
  const imageIndex = Math.max(0, parseInt(transport.id || transportId || "1", 10) - 1);
  const mappedImage = EXTERNAL_TRANSPORT_IMAGES[imageIndex % EXTERNAL_TRANSPORT_IMAGES.length];
  const galleryImages = [mappedImage, mappedImage, mappedImage]; // Provide duplicates to fill the 3-image gallery dynamically if needed or just use 1.

  // Mock reviews for the UI
  const reviews = [
    {
      id: 1,
      name: "Ahmed Hassan",
      avatar: "AH",
      text: "Very comfortable ride! The driver was professional and the vehicle was spotless. Highly recommend.",
      rating: 5,
    },
    {
      id: 2,
      name: "Maria Lopez",
      avatar: "ML",
      text: "Arrived on time and the seats were very comfortable. Great value for money. Will book again!",
      rating: 4.8,
    },
  ];

  return (
    <SectionWrapper className="bg-gray-50 min-h-screen pb-20 pt-8">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="text-sm text-gray-500 font-medium flex items-center gap-2">
          <Link
            to="/"
            className="hover:text-[#EB662B] transition-colors"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            to="/transportation"
            className="hover:text-[#EB662B] transition-colors"
          >
            Transportation
          </Link>
          <span>/</span>
          <span className="text-[#05073C] font-bold">
            {transport.type} — {transport.route}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#05073C]">
                {transport.route}
              </h1>
            </div>
            <p className="flex items-center gap-2 text-gray-500 font-medium">
              <FaBuilding className="text-[#EB662B]" />
              {transport.company}
            </p>
          </div>

          <div className="text-right bg-blue-50 px-6 py-4 rounded-2xl w-full md:w-auto">
            <div className="text-sm text-gray-500 font-medium mb-1">
              Rating
            </div>
            <div className="flex items-center gap-2 justify-end mb-1">
              <span className="bg-[#05073C] text-white font-bold px-2 py-1 rounded-lg">
                {transport.rating}
              </span>
              <span className="text-[#05073C] font-bold">/ 5</span>
            </div>
            <div className="text-sm text-gray-400">Verified reviews</div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {galleryImages.map((img: string, index: number) => (
            <div
              key={index}
              className={`overflow-hidden rounded-2xl border-2 border-transparent hover:border-[#D4AF37] hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] transition-all duration-500 hover:-translate-y-2 group ${index === 0 ? "md:col-span-2 md:row-span-2 h-64 md:h-full" : "h-48 md:h-56"}`}
            >
              <img
                src={img}
                alt={`${transport.type} ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
          ))}
        </div>

        {/* Content*/}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8">
              <h2 className="text-2xl font-bold text-[#05073C] mb-4">
                About this ride
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                {transport.description}
              </p>

              <hr className="border-gray-100 my-8" />

              <h3 className="text-xl font-bold text-[#05073C] mb-4">
                Features
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                {(transport.features || []).map((feature: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-gray-600 font-medium"
                  >
                    <div className="bg-green-100 p-1.5 rounded-full text-green-600 text-xs">
                      <FaCheck />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Guest Reviews */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-[#05073C] mb-6">
                Traveler Reviews
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-gray-50 p-6 rounded-2xl flex items-start gap-4 border-2 border-transparent hover:border-[#D4AF37] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_25px_rgba(212,175,55,0.2)]"
                  >
                    <div className="w-12 h-12 bg-[#05073C] text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                      {review.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#05073C]">
                        {review.name}
                      </h4>
                      <div className="flex items-center gap-1 text-yellow-400 text-sm mb-3">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar
                          className={
                            review.rating < 5 ? "text-gray-300" : ""
                          }
                        />
                      </div>
                      <p className="text-sm text-gray-600 italic leading-relaxed">
                        "{review.text}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:w-[380px] shrink-0">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 sticky top-8">
              <h3 className="text-xl font-bold text-[#05073C] mb-6">
                Booking Summary
              </h3>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-[#EB662B]">
                  <PriceDisplay price={Number(transport.price)} baseCurrency="EGP" />
                </span>
                <span className="text-gray-500 font-medium">/trip</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-600">
                  <FaRoute className="text-[#EB662B]" />
                  <span className="font-medium">{transport.route}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <FaUsers className="text-[#EB662B]" />
                  <span className="font-medium">
                    {transport.type === 'Car' ? 'Up to 4 passengers' : `${transport.seats} seats available`}
                  </span>
                </div>
                {transport.type !== 'Car' && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaClock className="text-[#EB662B]" />
                    <span className="font-medium">
                      Departure: {transport.departureTime}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-gray-600">
                  <FaClock className="text-[#EB662B]" />
                  <span className="font-medium">
                    {transport.type === 'Car' ? 'Rental Period' : 'Duration'}: {transport.duration || '48h'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <FaBuilding className="text-[#EB662B]" />
                  <span className="font-medium">{transport.company}</span>
                </div>
              </div>

              <Button 
                onClick={() => navigate('/checkout', { state: { type: transport.type.toLowerCase(), title: `${transport.company} - ${transport.route}`, price: transport.price, image: mappedImage, tickets: { adult: 1, child: 0, infant: 0 } } })}
                className="w-full py-4 rounded-xl text-white font-bold text-lg hover:shadow-lg transition-all"
              >
                Book Now
              </Button>

              <p className="text-xs text-center text-gray-400 mt-4">
                Free cancellation up to 24 hours before departure
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default TransportationDetailsPage;
