import SectionWrapper from "@/components/sections/SectionWrapper";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { FaArrowLeft } from "react-icons/fa";
import InteractiveMap from "@/components/common/InteractiveMap";
import SocialShare from "@/components/common/SocialShare";
import ReviewSection from "@/components/common/ReviewSection";
import DateTimePicker from "@/components/Ui/DateTimePicker";

const getMealDescription = (title: string) => {
  const t = title.toLowerCase();
  
  if (t.includes('koshary')) {
    return {
      desc: "Our signature Koshary is a hearty, vegan-friendly masterpiece that combines several rich layers topped with the most flavorful tomato and garlic sauces. A true taste of the bustling streets of Cairo.",
      components: [
        { name: "The Base", val: "A generous bed of high-quality short-grain rice cooked perfectly with brown lentils and mixed pasta." },
        { name: "Crispy Onions (Vried)", val: "Nothing beats our famous deeply caramelized, crispy fried onions scattered on top." },
        { name: "Tomato Sauce (Salsa)", val: "Our house-special rich and tangy tomato sauce, slowly simmered with fresh tomatoes and herbs." },
        { name: "The Dakkah", val: "A small side jar of zesty garlic, cumin, and lemon-vinegar dressing to pour over your plate." },
        { name: "The Garnish", val: "Finished off with slow-cooked, tender chickpeas." }
      ],
      extrasTitle: "Served with our Special Condiments",
      extrasDesc: "Customize your Koshary exactly how you like it with our traditional sides and spicy additions.",
      extras: [
        { name: "Extra Salsa & Dakkah", val: "Don't hesitate to ask our waiters for extra tomato sauce or garlic vinegar." },
        { name: "Chili Flakes (Shata)", val: "For the brave, an extra spicy chili oil sauce (Shata) is served on the side. Add with caution!" }
      ]
    };
  } else if (t.includes('molokhia')) {
    return {
      desc: "A true staple of Egyptian cuisine, our Authentic Molokhia is carefully prepared from fresh leaves and infused with a perfectly roasted garlic coriander 'Tasha'.",
      components: [
        { name: "Fresh Molokhia Soup", val: "A rich, vibrant green soup made with finely minced fresh jute leaves and homemade aromatic broth." },
        { name: "The Tasha (Garlic Sizzle)", val: "Our secret weapon: golden fried garlic and coriander poured sizzling over the soup right before serving." },
        { name: "Vermicelli Rice", val: "A fluffy mound of Egyptian short-grain rice cooked with toasted vermicelli." },
        { name: "Protein Options", val: "Usually served alongside tender slow-roasted chicken or duck." }
      ],
      extrasTitle: "Served with our Special Condiments",
      extrasDesc: "Enhance your Molokhia experience with our traditional accompaniments.",
      extras: [
        { name: "Lemon Wedges", val: "A squeeze of fresh lemon perfectly balances the rich garlic flavors." },
        { name: "Fresh Baladi Bread", val: "For those who prefer dipping over rice." }
      ]
    };
  } else if (t.includes('liver')) {
    return {
      desc: "Experience the vibrant street food culture of Alexandria with our signature Alexandrian Liver, packed with bold spices and zesty flavors.",
      components: [
        { name: "Fresh Liver Cuts", val: "Premium, thinly sliced fresh liver, seared perfectly on high heat." },
        { name: "Alexandrian Spices", val: "A potent, signature marinade featuring heavy cumin, fresh garlic, and secret Alexandrian spices." },
        { name: "Green Chili Peppers", val: "Sizzled with fresh green peppers to add a vibrant heat and crunch." },
        { name: "Tahini Sauce", val: "Drizzled with our house-made rich sesame tahini." }
      ],
      extrasTitle: "Served With",
      extrasDesc: "The perfect accompaniments for Alexandrian Liver.",
      extras: [
        { name: "Fino Bread", val: "Served inside freshly baked, soft Fino rolls just like the authentic street carts." },
        { name: "Lime Halves", val: "Essential squeezable limes to cut through the richness." },
        { name: "Egyptian Pickles (Mekhalel)", val: "Spicy mixed pickles to complete the experience." }
      ]
    };
  } else if (t.includes('feteer')) {
    return {
      desc: "The ultimate Egyptian pastry! Our Feteer Meshaltet features dozens of impossibly thin, buttery layers baked until golden and crispy on the outside, soft and chewy inside.",
      components: [
        { name: "Feteer Meshaltet", val: "Freshly baked in a traditional oven using premium clarified butter (Samna Baladi)." },
        { name: "Old Cheese (Mish)", val: "Pungent, aged traditional Egyptian cheese bringing the perfect salty contrast." },
        { name: "Black Honey (Molasses)", val: "Rich, dark sugarcane molasses for dipping." },
        { name: "Tahini (Teheena)", val: "Often swirled into the black honey to create the ultimate sweet dip." },
        { name: "Fresh Cream (Qeshta)", val: "Rich farm-fresh clotted cream." }
      ],
      extrasTitle: "Add-Ons",
      extrasDesc: "Customize your Feteer experience.",
      extras: [
        { name: "White Honey", val: "Pure clover honey." },
        { name: "Areesh Cheese", val: "Light, crumbly farmer's cheese." }
      ]
    };
  } else if (t.includes('ful') || t.includes('taameya') || t.includes('breakfast')) {
    return {
      desc: "The undisputable king of the Egyptian breakfast table. Our Egyptian breakfast items are prepared fresh every morning to give you the perfect start to your day.",
      components: [
        { name: "Main Dish", val: "A generous serving of your selected authentic Egyptian breakfast item." },
        { name: "Baladi Salad", val: "Fresh diced tomatoes, cucumbers, and onions with a light vinegar dressing." },
        { name: "Baba Ghanoush", val: "Smoky roasted eggplant dip with tahini." }
      ],
      extrasTitle: "Served With",
      extrasDesc: "Everything you need for a robust breakfast.",
      extras: [
        { name: "Hot Baladi Bread", val: "Freshly baked whole wheat pocket bread." },
        { name: "Pickled Pickles", val: "Zesty, crunchy mixed pickles." }
      ]
    };
  }
  
  // Default fallback (generic dish components)
  return {
    desc: "An authentic, freshly prepared Egyptian dish bringing you the true taste of local culture and heritage, made with the finest local ingredients.",
    components: [
      { name: "Premium Ingredients", val: "Sourced locally to ensure the authentic taste of Egypt." },
      { name: "Traditional Spices", val: "A secret blend of herbs and spices passed down through generations." },
      { name: "Fresh Preparation", val: "Made to order by our expert chefs." }
    ],
    extrasTitle: "Served With",
    extrasDesc: "Our meals come complete with traditional sides.",
    extras: [
      { name: "Fresh Bread", val: "Hot from the oven." },
      { name: "House Condiments", val: "A selection of traditional Egyptian sides and pickles." }
    ]
  };
};

const getSimilarDishes = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('koshary')) {
    return [
      { id: 1, title: "Chicken Tajine (طاجن فراخ)", price: 2.50, img: "/food/chicken-tajine.png" },
      { id: 2, title: "Meat Tajine (طاجن لحمة)", price: 3.00, img: "/food/meat-tajine.png" },
      { id: 3, title: "Dukkah & Shata (دقة وشطة)", price: 0.50, img: "/food/dukkah.png" },
      { id: 4, title: "Original Koshary (كشري)", price: 1.20, img: "/food/koshary.png" }
    ];
  }
  return [
    { id: 1, title: "Authentic Molokhia", price: 1.80, img: "/food/molokhia.png" },
    { id: 2, title: "Mixed Charcoal Grills", price: 8.00, img: "/food/grills.png" },
    { id: 3, title: "Koshary Abu Tarek", price: 1.20, img: "/food/koshary.png" },
    { id: 4, title: "Stuffed Pigeon", price: 4.50, img: "/food/pigeon.png" }
  ];
};

const MealDetailsPage = () => {
  useParams(); // id can be used to fetch real data later
  const navigate = useNavigate();
  const location = useLocation();
  const mealData = location.state || {};
  const { currency } = useApp();

  const formatPrice = (usdPrice: number) => {
    const rates: Record<string, number> = { USD: 1, EUR: 0.9, GBP: 0.8, EGP: 50, SAR: 3.75 };
    const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', EGP: 'EGP', SAR: 'SAR' };
    const rate = rates[currency as keyof typeof rates] || 1;
    const symbol = symbols[currency as keyof typeof symbols] || '$';
    return `${symbol} ${(usdPrice * rate).toFixed(2)}`;
  };

  const mealTitle = mealData.title || "Authentic Egyptian Koshary like Abu Tarek";
  const mealImage = mealData.img || mealData.image || "/food/koshary.png";
  const mealDetails = getMealDescription(mealTitle);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/checkout', {
      state: {
        title: mealTitle,
        price: 45, // Example price
        image: mealImage
      }
    });
  };



  return (
    <div className="bg-white min-h-screen">
      <SectionWrapper className="pt-32 pb-16">
        <Link to="/restaurants" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#cd4f3c] transition mb-8 px-4 max-w-4xl mx-auto block">
          <FaArrowLeft /> Back
        </Link>
        
        {/* Title */}
        <div className="max-w-4xl mx-auto px-4 text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#222] leading-[1.2] mb-6">
            {mealTitle}
          </h1>
          <div className="flex justify-center">
             <SocialShare url={window.location.href} title={mealTitle} />
          </div>
        </div>

        {/* Hero Image */}
        <div className="max-w-5xl mx-auto px-4 mb-16">
          <div className="w-full h-[500px] rounded-[30px] overflow-hidden shadow-lg">
            <img src={mealImage} alt="Meal Details" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg prose-p:text-gray-600 prose-headings:text-[#222] prose-li:text-gray-600 max-w-none">
            <h2 className="text-2xl font-bold mb-4">Dish Ingredients & Components</h2>
            <p className="mb-6">{mealDetails.desc}</p>
            <ul className="list-disc pl-5 mb-8 space-y-3">
              {mealDetails.components.map((item, idx) => (
                <li key={idx}><strong>{item.name}:</strong> {item.val}</li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold mb-4">{mealDetails.extrasTitle}</h2>
            <p className="mb-6">{mealDetails.extrasDesc}</p>
            <ul className="list-disc pl-5 space-y-3">
              {mealDetails.extras.map((item, idx) => (
                <li key={idx}><strong>{item.name}:</strong> {item.val}</li>
              ))}
            </ul>

            <ReviewSection rating={4.9} reviewCount={1250} itemId="meal-koshary" itemType="meal" />

            <div className="mt-12">
               <InteractiveMap locationName="Downtown Cairo Authentic Koshary" />
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Map & Booking Form Section */}
      <div className="relative w-full h-[600px] bg-gray-200 mt-16 flex items-center justify-center">
        {/* Map Background Placeholder */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600" 
            alt="Map background" 
            className="w-full h-full object-cover opacity-50 grayscale"
          />
        </div>

        {/* Booking Form Card */}
        <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full mx-4">
          <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2 mb-2">
              <DateTimePicker compact accentColor="#cd4f3c" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input type="text" required placeholder="Write your name" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#cd4f3c]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input type="tel" required placeholder="Your Number" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#cd4f3c]" />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input type="email" required placeholder="example@email.com" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#cd4f3c]" />
            </div>
            <div className="col-span-1 md:col-span-2 mt-2">
              <button type="submit" className="w-full bg-[#cd4f3c] hover:bg-[#b03c2b] text-white font-bold py-4 rounded-lg transition">
                Book A Table
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Read More Articles */}
      <SectionWrapper className="py-20 bg-[#fafafa] text-center">
        <div>
          <h2 className="text-3xl font-bold text-[#222] mb-2 font-serif">Similar Dishes You Might Like</h2>
          <p className="text-gray-500 mb-12 max-w-2xl mx-auto text-sm">
            Try another selection of our delicious dishes prepared with the highest quality and authentic taste.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto text-left">
            {getSimilarDishes(mealTitle).map(dish => (
              <div key={dish.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100">
                <div className="h-48 overflow-hidden">
                  <img src={dish.img} className="w-full h-full object-cover hover:scale-105 transition duration-500" alt={dish.title} />
                </div>
                <div className="p-5 flex flex-col justify-between h-24">
                  <h3 className="font-bold text-[#222] leading-snug">{dish.title}</h3>
                  <span className="text-sm font-bold text-[#cd4f3c] mb-2 block">{formatPrice(dish.price)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default MealDetailsPage;
