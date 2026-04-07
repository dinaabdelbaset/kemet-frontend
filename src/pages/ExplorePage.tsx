import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaChevronRight, FaCar } from "react-icons/fa";
import axiosClient from "../api/axiosClient";
import FilterSidebar from "../components/sections/FilterSidebar";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const ExplorePage = () => {
    const { destination = "egypt" } = useParams();
    const destinationName =
        destination.charAt(0).toUpperCase() + destination.slice(1);
    useDocumentTitle(`Explore ${destinationName}`);

    const [category, setCategory] = useState("all");
    const [, setOnlyBestSeller] = useState(false);

    const exploreCategories = [
        { id: "all", name: "All Experiences" },
        { id: "hotels", name: "Hotels" },
        { id: "museums", name: "Museums" },
        { id: "restaurants", name: "Restaurants" },
        { id: "safari", name: "Safari" },
        { id: "bazaars", name: "Bazaars" },
        { id: "events", name: "Events" },
    ];

    const [apiHotels, setApiHotels] = useState<any[]>([]);
    const [apiRestaurants, setApiRestaurants] = useState<any[]>([]);
    const [apiSafari, setApiSafari] = useState<any[]>([]);
    const [apiBazaars, setApiBazaars] = useState<any[]>([]);
    const [apiEvents, setApiEvents] = useState<any[]>([]);
    const [apiMuseums, setApiMuseums] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fallbackBazaars = [
                    { id: 1, title: `Old Market`, image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/baz_cairo", category: "Local Market", rating: 4.7, reviews_count: 890, location: destinationName, ticket_price: 0 },
                    { id: 4, title: `Premium Spice Bazaar`, image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/baz_luxor", category: "Shopping", rating: 4.9, reviews_count: 620, location: destinationName, ticket_price: 25 },
                ];

                const [hotels, rests, safaris, bazaars, events, museums] = await Promise.all([
                    axiosClient.get("/hotels").catch(() => ({ data: [] })),
                    axiosClient.get("/restaurants").catch(() => ({ data: [] })),
                    axiosClient.get("/safaris").catch(() => ({ data: [] })),
                    axiosClient.get("/bazaars").catch(() => ({ data: fallbackBazaars })),
                    axiosClient.get("/events").catch(() => ({ data: [] })),
                    axiosClient.get("/museums").catch(() => ({ data: [] })),
                ]);
                setApiHotels(hotels.data);
                setApiRestaurants(rests.data);
                setApiSafari(safaris.data);
                setApiBazaars(bazaars.data);
                setApiEvents(events.data);
                setApiMuseums(museums.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, []);

    // Filter hotels by destination, sort by price
    const destHotels = apiHotels.filter(h => h.location.toLowerCase() === destination.toLowerCase() || destination.toLowerCase() === "egypt");
    const validHotels = destHotels.length > 0 ? destHotels : apiHotels;
    const sortedHotels = [...validHotels].sort((a, b) => a.price_starts_from - b.price_starts_from);
    
    let localHotels: any[] = [];
    if (sortedHotels.length >= 2) {
        const cheap = sortedHotels[0];
        const exp = sortedHotels[sortedHotels.length - 1];
        localHotels = [
            { id: cheap.id, title: cheap.title, image: cheap.image, category: "Budget Hotel", rating: cheap.rating, reviews: cheap.reviews_count, location: destinationName, price: `$${cheap.price_starts_from}` },
            { id: exp.id, title: exp.title, image: exp.image, category: "Luxury Hotel", rating: exp.rating, reviews: exp.reviews_count, location: destinationName, price: `$${exp.price_starts_from}` }
        ];
    } else if (sortedHotels.length === 1) {
        const single = sortedHotels[0];
        localHotels = [
            { id: single.id, title: single.title, image: single.image, category: "Luxury Hotel", rating: single.rating, reviews: single.reviews_count, location: destinationName, price: `$${single.price_starts_from}` },
            { id: 999, title: `Boutique Hotel ${destinationName}`, image: "https://dinaabdelbaset-kemet.hf.space/api/kamet-images/hotel_fallback", category: "Budget Hotel", rating: 4.5, reviews: 45, location: destinationName, price: "$40" }
        ];
    } else {
        localHotels = [];
    }

    // Helper to filter and map data roughly equivalent to how it was styled
    const filterAndMap = (items: any[], isEgypt: boolean, categoryName: string, priceKey: string = "price") => {
        const destItems = items.filter(h => isEgypt || (h.location && h.location.toLowerCase() === destination.toLowerCase()));
        const valid = destItems.length > 0 ? destItems : items.slice(0, 2);
        return valid.slice(0, 2).map((item: any) => ({
            id: item.id,
            title: item.title || item.name || '',
            image: item.image || item.image_url || '',
            category: item.category || categoryName,
            rating: item.rating || 4.5,
            reviews: item.reviews_count || item.reviews || 0,
            location: destinationName,
            price: `$${item[priceKey] || item.ticket_price || item.price_range_min || 0}`
        }));
    };

    const isEgypt = destination.toLowerCase() === "egypt";
    const localRestaurants = filterAndMap(apiRestaurants, isEgypt, "Local Cuisine", "price_range_min");
    const localSafari = filterAndMap(apiSafari, isEgypt, "Adventure", "price");
    const localBazaars = filterAndMap(apiBazaars, isEgypt, "Local Market", "ticket_price");
    const localEvents = filterAndMap(apiEvents, isEgypt, "Event", "price");
    const localMuseums = filterAndMap(apiMuseums, isEgypt, "History", "ticket_price");

    // Simple Render Card (Make the ENTIRE card perfectly clickable)
    const GenericCard = ({ item, linkTo }: { item: any; linkTo: string }) => (
        <Link to={linkTo} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_12px_30px_rgba(212,175,55,0.25)] transition-all duration-500 group flex flex-col border-2 border-transparent hover:border-[#D4AF37] hover:-translate-y-2 block">
            <div className="relative h-56 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-lg text-sm font-bold shadow-sm text-[#05073C]">
                    ★ {item.rating} <span className="text-gray-500 font-normal">({item.reviews})</span>
                </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <div className="text-xs text-[#EB662B] font-bold mb-1 uppercase tracking-wider">{item.category}</div>
                <h3 className="text-lg font-bold text-[#05073C] mb-2 leading-tight group-hover:text-[#EB662B] transition line-clamp-2">
                    {item.title}
                </h3>
                <div className="text-sm text-gray-500 mb-4">{item.location}</div>
                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-lg font-bold text-[#05073C]">{item.price} <span className="text-sm font-normal text-gray-500">avg</span></span>
                    <span className="text-sm bg-[#EB662B] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#d55822] transition pointer-events-none">
                        Select
                    </span>
                </div>
            </div>
        </Link>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:text-[#EB662B] transition">Home</Link>
                    <FaChevronRight className="w-3 h-3" />
                    <span className="text-gray-500">Destinations</span>
                    <FaChevronRight className="w-3 h-3" />
                    <span className="text-[#05073C] font-bold">{destinationName}</span>
                </nav>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#05073C] mb-2">
                        Top Selections in {destinationName}
                    </h1>
                    <p className="text-gray-500">We collected the best options from each category for your ultimate experience.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-1/4 flex-shrink-0">
                        <FilterSidebar
                            categories={exploreCategories}
                            selectedCategory={category}
                            onCategoryChange={setCategory}
                            onBestSellerChange={setOnlyBestSeller}
                        />
                    </div>

                    {/* Right Side: Exact grouped listings requested by the user */}
                    <div className="lg:w-3/4 flex-grow space-y-12">
                        
                        {/* 1. Hotels */}
                        {(category === "all" || category === "hotels") && (
                            <section>
                                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                                    <h2 className="text-2xl font-bold text-[#05073C]">Hotels (فنادق)</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {localHotels.map(hotel => (
                                        <GenericCard key={`hotel-${hotel.id}`} item={hotel} linkTo={`/hotels/${hotel.id}`} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 2. Museums */}
                        {(category === "all" || category === "museums") && (
                            <section>
                                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                                    <h2 className="text-2xl font-bold text-[#05073C]">Museums (متاحف)</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {localMuseums.map(museum => (
                                        <GenericCard key={`museum-${museum.id}`} item={museum} linkTo={`/museums/${museum.id}`} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 3. Restaurants */}
                        {(category === "all" || category === "restaurants") && (
                            <section>
                                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                                    <h2 className="text-2xl font-bold text-[#05073C]">Restaurants (مطاعم)</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {localRestaurants.map(rest => (
                                        <GenericCard key={`rest-${rest.id}`} item={rest} linkTo={`/restaurants/meal/${rest.id}`} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 4. Safari */}
                        {(category === "all" || category === "safari") && (
                            <section>
                                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                                    <h2 className="text-2xl font-bold text-[#05073C]">Safari (سفاري)</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {localSafari.map(safari => (
                                        <GenericCard key={`safari-${safari.id}`} item={safari} linkTo={`/safari/${safari.id}`} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 5. Bazaars */}
                        {(category === "all" || category === "bazaars") && (
                            <section>
                                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                                    <h2 className="text-2xl font-bold text-[#05073C]">Bazaars (بازارات)</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {localBazaars.map(bazaar => (
                                        <GenericCard key={`bazaar-${bazaar.id}`} item={bazaar} linkTo={`/bazaars/${bazaar.id}`} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 6. Events */}
                        {(category === "all" || category === "events") && (
                            <section>
                                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                                    <h2 className="text-2xl font-bold text-[#05073C]">Events (فعاليات)</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {localEvents.map(event => (
                                        <GenericCard key={`event-${event.id}`} item={event} linkTo={`/events/${event.id}`} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 7. Transportation Banner (Always visible or maybe follow All but it's fine) */}
                        <section className="mt-16">
                            <Link to="/transportation" className="block w-full bg-[#05073C] text-white rounded-2xl overflow-hidden hover:opacity-95 transition shadow-lg group">
                                <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-10 relative z-10">
                                    <div className="text-left mb-6 md:mb-0">
                                        <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
                                            <FaCar /> Transportation Services (مواصلات)
                                        </h3>
                                        <p className="text-gray-300">Easily find rides and transfers inside {destinationName}.</p>
                                    </div>
                                    <div className="bg-[#EB662B] text-white px-6 py-3 rounded-lg font-bold group-hover:scale-105 transition transform shadow-md flex items-center gap-2">
                                        View Transportation <FaChevronRight />
                                    </div>
                                </div>
                            </Link>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExplorePage;
