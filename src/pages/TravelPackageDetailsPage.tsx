import PriceDisplay from "../components/common/PriceDisplay";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaCheck, FaStar, FaClock, FaTag, FaHotel, FaUniversity, FaTimesCircle } from "react-icons/fa";
import DateTimePicker from "@/components/Ui/DateTimePicker";
import { getDealById } from "../api/dealService";

const TravelPackageDetailsPage = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setIsLoading(true);
        const data = await getDealById(packageId!);
        setPkg(data);
      } catch (error) {
        console.error("Error fetching package:", error);
        setPkg(null);
      } finally {
        setIsLoading(false);
      }
    };
    if (packageId) fetchPackage();
  }, [packageId]);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/checkout", {
      state: {
        title: pkg?.title,
        price: pkg?.price,
        image: pkg?.image,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-700">Package not found</h2>
        <Link to="/" className="text-blue-600 hover:underline flex items-center gap-2">
          <FaArrowLeft /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative h-72 md:h-96 w-full overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.alt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full mb-3">
            {pkg.tag}
          </span>
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">
            {pkg.title}
          </h1>
          <p className="text-white/80 text-sm mt-2">
            By {pkg.author} · {pkg.date}
          </p>
        </div>
        <Link
          to="/"
          className="absolute top-6 left-6 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-700 hover:text-blue-600 text-sm font-medium px-4 py-2 rounded-full shadow transition"
        >
          <FaArrowLeft />
          Back
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — Activities + Highlights */}
        <div className="lg:col-span-2 space-y-8">
          {/* Package Composition */}
          {(pkg.hotel || pkg.museum || pkg.excluded) && (
            <section className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-blue-50">
              <h2 className="text-xl font-bold text-[#05073C] mb-4 flex items-center gap-2">
                <FaStar className="text-blue-600" />
                Package Includes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pkg.hotel && (
                  <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <FaHotel className="text-blue-600 mt-1 text-lg" />
                    <div>
                      <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Accommodation</span>
                      <span className="text-gray-800 font-semibold text-sm">{pkg.hotel}</span>
                    </div>
                  </div>
                )}
                {pkg.museum && (
                  <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <FaUniversity className="text-blue-600 mt-1 text-lg" />
                    <div>
                      <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Culture & History</span>
                      <span className="text-gray-800 font-semibold text-sm">{pkg.museum}</span>
                    </div>
                  </div>
                )}
                {pkg.excluded && pkg.excluded.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 bg-red-50 p-4 rounded-xl border border-red-100 md:col-span-2">
                    <FaTimesCircle className="text-red-500 mt-1 text-lg" />
                    <div>
                      <span className="block text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Excluded from Package</span>
                      <span className="text-gray-800 font-semibold text-sm">{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Activities */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#05073C] mb-4 flex items-center gap-2">
              <FaCheck className="text-blue-600" />
              Activities Included
            </h2>
            <ul className="space-y-3">
              {(pkg.activities || []).map((activity: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 text-sm">{activity}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Highlights */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#05073C] mb-4 flex items-center gap-2">
              <FaStar className="text-yellow-400" />
              Tour Highlights
            </h2>
            <ul className="space-y-3">
              {(pkg.highlights || []).map((highlight: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                  <FaCheck className="mt-0.5 flex-shrink-0 text-green-500 text-sm" />
                  <span className="text-gray-700 text-sm">{highlight}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right — Booking Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6 space-y-4">
            <div className="text-3xl font-bold text-blue-600">
              <PriceDisplay price={Number(pkg.price)} baseCurrency="EGP" />
              <span className="text-base font-normal text-gray-500"> / person</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaClock className="text-blue-600" />
              <span>{pkg.duration}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaTag className="text-blue-600" />
              <span>{pkg.activities.length} activities</span>
            </div>

            <hr className="border-gray-100" />

            <form onSubmit={handleBooking} className="space-y-4">
              <div className="mb-2">
                <DateTimePicker compact showTime={false} accentColor="#2563eb" />
              </div>
              <button 
                type="submit"
                className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-md shadow-blue-600/20 text-sm"
              >
                Book Package Now
              </button>
            </form>
            
            <button className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-xl transition text-sm">
              Add to Wishlist
            </button>

            <p className="text-xs text-gray-400 text-center">
              Free cancellation up to 24h before
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelPackageDetailsPage;
