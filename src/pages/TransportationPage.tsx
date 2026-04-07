import { useState, useEffect } from "react";
import { FaBus, FaCar, FaShuttleVan } from "react-icons/fa";
import TransportationHeader from "../components/transportation/TransportationHeader";
import TransportationFilters from "../components/transportation/TransportationFilters";
import TransportationList from "../components/transportation/TransportationList";
import SectionWrapper from "../components/sections/SectionWrapper";
import Button from "../components/Ui/Button";
import { getTransportationList } from "../api/transportationService";
import AdvancedFilters from "../components/common/AdvancedFilters";


const TransportationPage = () => {
  const [selectedType, setSelectedType] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");
  const [transportData, setTransportData] = useState<any[]>([]);
  const [sidebarFilters, setSidebarFilters] = useState<{ priceRange: [number, number]; stars: number[] }>({
    priceRange: [0, 5000],
    stars: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTransportationList({});
        setTransportData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching transportation:", error);
        setTransportData([]);
      }
    };
    fetchData();
  }, []);

  //  Filter
  const filteredData = transportData
    .filter((item) => {
      const matchType = selectedType === "All" ? true : item.type === selectedType;
      const price = Number(item.price) || 0;
      const matchPrice = price <= sidebarFilters.priceRange[1];
      const rating = Number(item.rating) || 0;
      const matchStars = sidebarFilters.stars.length === 0 || sidebarFilters.stars.includes(Math.floor(rating));
      return matchType && matchPrice && matchStars;
    })
    .sort((a, b) => {
      if (sortOrder === "low") return a.price - b.price;
      if (sortOrder === "high") return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <TransportationHeader />



      {/* Main Content */}
      <div
        id="transportation-list"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        {/* Title */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-[#05073C]">
            Available Transportation
          </h2>
          <p className="text-gray-500 mt-1">
            Browse and book the best ride for your journey.
          </p>
        </div>

        {/* Filters + Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AdvancedFilters onFilterChange={setSidebarFilters} />
          </div>
          {/* Cards */}
          <div className="lg:col-span-3">
            <TransportationList data={filteredData} />
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <SectionWrapper className="mb-20">
        <div className="relative overflow-hidden rounded-3xl bg-[#05073C] p-8 md:p-16">
          <div className="relative z-10 max-w-2xl">
            <span className="text-[#EB662B] font-bold tracking-widest uppercase text-sm">
              Travel Smart
            </span>
            <h2 className="text-white text-3xl md:text-5xl font-extrabold mt-4 leading-tight">
              Get <span className="text-[#EB662B]">15% off</span> your first
              ride
            </h2>
            <p className="text-white/70 mt-6 text-lg">
              Sign up today and enjoy exclusive discounts on all transportation
              bookings across Egypt.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button className="px-10 py-4 rounded-xl text-white font-bold">
                Sign Up Now
              </Button>
              <Button
                backgroundColor="transparent"
                className="px-10 py-4 rounded-xl text-white font-bold border border-white/20 hover:bg-white/5"
              >
                Learn More
              </Button>
            </div>
          </div>
          {/* Decorative blurs */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#EB662B]/10 blur-3xl rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[#EB662B]/5 blur-3xl rounded-full -ml-20 -mb-20" />
        </div>
      </SectionWrapper>
    </div>
  );
};

export default TransportationPage;
