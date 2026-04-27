import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaChevronRight, FaCar, FaMapMarkerAlt } from "react-icons/fa";
import { getAllExploreData } from "../api/exploreService";
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
  const [selectedCity, setSelectedCity] = useState("All Locations");
  const uniqueCities = ["All Locations", ...new Set(apiHotels.map((item: any) => item.location || item.city).filter(Boolean))];
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

                let allData: any = {};
                try {
                    const data = await getAllExploreData();
                    allData = data?.data || data || {};
                } catch(err) {}
                
                if (allData.restaurants) {
                    allData.restaurants = allData.restaurants.map((r: any) => {
                       const title = r.title || r.name || "";
                       const titleLc = title.toLowerCase();
                       let newImage = r.image;
                       
                       if (titleLc.includes("kadoura") || title.includes("قدورة")) newImage = "/images/restaurants/kadoura.png";
                       else if (titleLc.includes("balbaa") || title.includes("بلبع")) newImage = "/images/restaurants/balbaa.png";
                       else if (titleLc.includes("fares") || title.includes("فارس")) newImage = "/images/restaurants/fares.png";
                       else if (titleLc.includes("masrien") || title.includes("المصريين")) newImage = "/images/restaurants/masrien.png";
                       else if (newImage?.includes("unsplash") || newImage?.includes("hotel") || newImage === "placeholder.png") newImage = "/images/restaurants/generic.png";
                       // If we know this is a restaurant and it happens to have the globally shared hotel image (we don't know the exact string, so we force generic onto missing/plain hotel images)
                       else if (r.image === "hotel_fallback" || !r.image || (typeof r.image === 'string' && r.image.includes("red-sea.png"))) newImage = "/images/restaurants/generic.png";
                       
                       return { ...r, image: newImage || "/images/restaurants/generic.png", image_url: newImage || "/images/restaurants/generic.png" };
                    });
                }
                
                setApiHotels(allData.hotels || []);
                setApiRestaurants(allData.restaurants || []);
                setApiSafari(allData.safaris || []);
                setApiBazaars(allData.bazaars?.length > 0 ? allData.bazaars : fallbackBazaars);
                setApiEvents(allData.events || []);
                setApiMuseums(allData.museums || []);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, []);

    const getCityHash = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    };

    // Smart dynamic image mapping based on City + Category using deterministic hashing
    const getCitySpecificImage = (city: string, category: string, index: number) => {
        const hash = getCityHash(city) + (index * 7); // Multiply index to avoid sequential adjacent picks

        if (category === "Hotels") {
           const imgs = ['/images/tour-red-sea.png', '/images/home/why-quality.jpg', '/images/era-greco-roman.png', '/images/home/why-flex.jpg', '/images/nile-cruise.png', '/images/nile-luxor-aswan.png', '/images/destinations/giza.png', '/images/destinations/fayoum.png'];
           return imgs[hash % imgs.length];
        }
        if (category === "Museums") {
           const imgs = ['/images/era-greco-roman.png', '/images/tour-museum.png', '/images/era-pharaonic.png', '/images/saint-catherine.png', '/images/era-coptic.png', '/images/era-islamic.png'];
           return imgs[hash % imgs.length];
        }
        if (category === "Restaurants") {
           const imgs = ['/images/tour-cairo-food.png', '/images/tour-nile-cruise.png', '/food/koshary.png', '/food/molokhia.png', '/food/grills.png', '/food/chicken-tajine.png', '/food/pigeon.png', '/food/meat-tajine.png'];
           return imgs[hash % imgs.length];
        }
        if (category === "Safari") {
           const imgs = ['/images/tour-desert-safari.png', '/images/siwa-safari.png', '/images/destinations/marsa-matrouh.png', '/images/home/why-flex.jpg'];
           return imgs[hash % imgs.length];
        }
        if (category === "Bazaars") {
           const imgs = ['/images/luxor-souk.png', '/images/era-islamic.png', '/images/aswan-nubian-market.png', '/images/tour-pyramids.png'];
           return imgs[hash % imgs.length];
        }
        if (category === "Events") {
           const imgs = ['/images/pyramids-vip.png', '/images/era-pharaonic.png', '/images/tour-pyramids.png', '/images/era-islamic.png', '/images/destinations/port-said.png', '/images/era-greco-roman.png'];
           return imgs[hash % imgs.length];
        }
        return '/images/home/why-quality.jpg';
    };

    const filterAndMap = (items: any[], isEgypt: boolean, categoryName: string, fallbackKey: string, priceKey: string = "price") => {
        if (!items || items.length === 0) return [];
        const normalizedDest = destination.toLowerCase() === "sharm el.s" ? "sharm" : destination.toLowerCase();
        
        const locationMap: Record<string, string[]> = {
            "cairo": ["cairo", "القاهرة"],
            "giza": ["giza", "الجيزة"],
            "luxor": ["luxor", "الأقصر"],
            "aswan": ["aswan", "أسوان"],
            "alexandria": ["alexandria", "الإسكندرية", "alex"],
            "sharm": ["sharm", "شرم الشيخ", "شرم"],
            "hurghada": ["hurghada", "الغردقة"],
            "fayoum": ["fayoum", "الفيوم"],
            "marsa alam": ["marsa", "مرسى"],
            "siwa": ["siwa", "سيوة"],
            "dahab": ["dahab", "دهب"],
            "matrouh": ["matrouh", "مطروح"]
        };
        
        const validKeywords = locationMap[normalizedDest] || [normalizedDest];

        const destItems = items.filter(h => {
            if (isEgypt) return true;
            const locStr = h.location || h.city || "";
            if (!locStr) return false;
            const locLc = locStr.toLowerCase();
            return validKeywords.some(kw => locLc.includes(kw));
        });

        // STRICT MODE: Try to get up to 2 real items that match
        let valid = destItems.slice(0, 2);
        
        // Pad to exactly 2 items if needed
        if (valid.length < 2 && items.length > 0) {
            const needed = 2 - valid.length;
            const fallbackItems = items.filter((i: any) => !valid.find(v => v.id === i.id)).slice(0, needed);
            
            fallbackItems.forEach((item: any) => {
                valid.push({
                    ...item,
                    location: isEgypt ? item.location : destinationName
                });
            });
        }
        
        // If we STILL don't have 2 items (e.g. only 1 item exists globally), duplicate the first one
        if (valid.length === 1) {
            valid.push({
                ...valid[0],
                id: valid[0].id + 1000,
                title: valid[0].title + " - Premium",
                // Do not override the image, keep the original
            });
        }

        // Ensure the two items have DIFFERENT prices
        if (valid.length === 2) {
            let p1 = parseFloat(valid[0][priceKey] || valid[0].ticket_price || valid[0].price_range_min || valid[0].price || 0);
            let p2 = parseFloat(valid[1][priceKey] || valid[1].ticket_price || valid[1].price_range_min || valid[1].price || 0);
            
            if (isNaN(p1)) p1 = 250;
            if (isNaN(p2)) p2 = 450;
            
            if (p1 === p2) {
                valid[1] = { ...valid[1], [priceKey]: p1 + (p1 > 0 ? p1 * 0.5 : 500) }; // Make the second item 50% more expensive
            }
        }

        return valid.map((item: any, idx: number) => {
            const rawImage = item.image || item.image_url || '/placeholder.png';
            
            // Extreme safety net: Check if image is obviously broken or missing
            const isInvalidImg = !rawImage 
                || rawImage.includes('unsplash.com') 
                || rawImage.includes('hotel_fallback')
                || (!rawImage.startsWith('/') && !rawImage.startsWith('http'));

            const finalImage = isInvalidImg ? getCitySpecificImage(destinationName, categoryName, idx) : rawImage;
            
            return {
                id: item.id,
                title: item.title || item.name || 'Egypt Destination',
                image: finalImage,
                category: item.category || categoryName,
                rating: item.rating || 4.5,
                reviews: item.reviews_count || item.reviews || 120,
                location: item.location || destinationName,
                description: item.description,
                price: `$${item[priceKey] || item.ticket_price || item.price_range_min || item.price || 0}`
            };
        });
    };

    const isEgypt = destination.toLowerCase() === "egypt";
    
    // Hotels are a bit different because they were separated logic above, so we unify it here simply
    const localHotels = filterAndMap(apiHotels, isEgypt, "Luxury/Budget Hotel", "Hotels", "price_starts_from");
    const localRestaurants = filterAndMap(apiRestaurants, isEgypt, "Local Cuisine", "Restaurants", "price_range_min");
    const localSafari = filterAndMap(apiSafari, isEgypt, "Adventure", "Safari", "price");
    const localBazaars = filterAndMap(apiBazaars, isEgypt, "Local Market", "Bazaars", "ticket_price");
    const localEvents = filterAndMap(apiEvents, isEgypt, "Event", "Events", "price");
    const localMuseums = filterAndMap(apiMuseums, isEgypt, "History", "Museums", "ticket_price");

    const GenericCard = ({ item, linkTo }: { item: any; linkTo: string }) => (
        <Link to={linkTo} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_12px_30px_rgba(212,175,55,0.25)] transition-all duration-500 group flex flex-col border-2 border-transparent hover:border-[#D4AF37] hover:-translate-y-2 block">
            <div className="relative h-56 overflow-hidden bg-gray-100">
                <img src={item.image} alt={item.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
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

    
  const filteredApiHotels = apiHotels.filter((item: any) => selectedCity === "All Locations" || (item.location || item.city) === selectedCity);
  return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:text-[#EB662B] transition">Home</Link>
                    <FaChevronRight className="w-3 h-3" />
                    <Link to="/#trending-destinations" className="text-gray-500 hover:text-[#EB662B] transition">Destinations</Link>
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
                        {(category === "all" || category === "hotels") && (localHotels.length > 0 || category === "hotels") && (
                            <section>
                                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                                    <h2 className="text-2xl font-bold text-[#05073C]">Hotels (فنادق)</h2>
                                </div>
                                {localHotels.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {localHotels.map(hotel => (
                                            <GenericCard key={`hotel-${hotel.id}`} item={hotel} linkTo={`/hotels/${hotel.id}`} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center bg-white rounded-xl shadow-sm"><p className="text-gray-500 font-bold">No hotels available in this location yet.</p></div>
                                )}
                            </section>
                        )}

                        {/* 2. Museums */}
                        {(category === "all" || category === "museums") && (localMuseums.length > 0 || category === "museums") && (
                            <section>
                                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                                    <h2 className="text-2xl font-bold text-[#05073C]">Museums (متاحف)</h2>
                                </div>
                                {localMuseums.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {localMuseums.map(museum => (
                                            <GenericCard key={`museum-${museum.id}`} item={museum} linkTo={`/museums/${museum.id}`} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center bg-white rounded-xl shadow-sm"><p className="text-gray-500 font-bold">No museums available in this location yet.</p></div>
                                )}
                            </section>
                        )}

                        {/* 3. Restaurants */}
                        {(category === "all" || category === "restaurants") && (localRestaurants.length > 0 || category === "restaurants") && (
                            <section>
                                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                                    <h2 className="text-2xl font-bold text-[#05073C] text-right w-full">أشهر المطاعم في {destinationName}</h2>
                                </div>
                                {localRestaurants.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right" dir="rtl">
                                        {localRestaurants.map(restaurant => (
                                            <Link to={`/restaurants/${restaurant.id}`} key={`rest-${restaurant.id}`} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(212,175,55,0.06)] border border-gray-100 hover:-translate-y-2 transition-all duration-500 flex flex-col group block">
                                              <div className="relative w-full aspect-video overflow-hidden">
                                                <img 
                                                  src={restaurant.image || '/placeholder.png'} 
                                                  alt={restaurant.title} 
                                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 relative z-0" 
                                                />
                                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm text-[#cd4f3c] text-xs font-bold flex items-center gap-1.5 z-10">
                                                  <FaMapMarkerAlt /> {restaurant.location}
                                                </div>
                                              </div>
                                              <div className="p-6 flex flex-col flex-grow text-right">
                                                <h3 className="text-2xl font-bold text-[#14213d] mb-2 group-hover:text-[#cd4f3c] transition-colors duration-300">{restaurant.title}</h3>
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{restaurant.description || 'أفضل تجربة طعام مصرية وأجواء رائعة لك ولعائلتك'}</p>
                                                <div className="flex justify-between items-center mb-4">
                                                  <span className="text-[#cd4f3c] font-bold text-sm bg-[#cd4f3c]/10 px-3 py-1 rounded-md">{restaurant.category || "أكل مصري"}</span>
                                                  <div className="flex items-center gap-1.5">
                                                    <span className="text-yellow-400">★</span>
                                                    <span className="text-sm font-bold">{restaurant.rating}</span>
                                                    <span className="text-xs text-gray-500">({restaurant.reviews})</span>
                                                  </div>
                                                </div>
                                                <div className="border-t border-gray-100 pt-4 flex justify-between items-center mt-auto cursor-pointer">
                                                  <span className="text-gray-700 font-bold group-hover:text-[#cd4f3c] flex-1">
                                                      {document.cookie.includes('/ar') || document.documentElement.dir === 'rtl' ? 'تصفح المنيو والحجز \u2190' : 'View Menu & Booking \u2192'}
                                                  </span>
                                                  <span className="text-gray-500 text-xs">10:00 AM - 12:00 AM</span>
                                                </div>
                                              </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center bg-white rounded-xl shadow-sm"><p className="text-gray-500 font-bold">No restaurants available in this location yet.</p></div>
                                )}
                            </section>
                        )}

                        {/* 4. Safari */}
                        {(category === "all" || category === "safari") && (localSafari.length > 0 || category === "safari") && (
                            <section>
                                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                                    <h2 className="text-2xl font-bold text-[#05073C]">Safari (سفاري)</h2>
                                </div>
                                {localSafari.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {localSafari.map(safari => (
                                            <GenericCard key={`safari-${safari.id}`} item={safari} linkTo={`/safari/${safari.id}`} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center bg-white rounded-xl shadow-sm"><p className="text-gray-500 font-bold">No safari available in this location yet.</p></div>
                                )}
                            </section>
                        )}

                        {/* 5. Bazaars */}
                        {(category === "all" || category === "bazaars") && (localBazaars.length > 0 || category === "bazaars") && (
                            <section>
                                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                                    <h2 className="text-2xl font-bold text-[#05073C]">Bazaars (بازارات)</h2>
                                </div>
                                {localBazaars.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {localBazaars.map(bazaar => (
                                            <GenericCard key={`bazaar-${bazaar.id}`} item={bazaar} linkTo={`/bazaars/${bazaar.id}`} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center bg-white rounded-xl shadow-sm"><p className="text-gray-500 font-bold">No bazaars available in this location yet.</p></div>
                                )}
                            </section>
                        )}

                        {/* 6. Events */}
                        {(category === "all" || category === "events") && (localEvents.length > 0 || category === "events") && (
                            <section>
                                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                                    <h2 className="text-2xl font-bold text-[#05073C]">Events (فعاليات)</h2>
                                </div>
                                {localEvents.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {localEvents.map(event => (
                                            <GenericCard key={`event-${event.id}`} item={event} linkTo={`/events/${event.id}`} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center bg-white rounded-xl shadow-sm"><p className="text-gray-500 font-bold">No events available in this location yet.</p></div>
                                )}
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
