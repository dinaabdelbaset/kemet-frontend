import React, { useState, useRef, useEffect } from "react";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { Link, useParams, useLocation } from "react-router-dom";
import { FaStar, FaArrowLeft, FaShoppingCart, FaPlus, FaTimes, FaCheck, FaFireAlt, FaMinus } from "react-icons/fa";

// ================= TYPES =================
export interface IMeal {
  id: number;
  title: string;
  img: string;
  video?: string;
  price: number;
  calories?: number;
  rating?: number;
}

export interface ICartItem {
  id: string; // unique id combining meal id + extras
  meal: IMeal;
  quantity: number;
  extras: string[];
  totalPrice: number;
}

// ================= COMPONENTS =================

const InteractiveFoodCard = ({ meal, onSelect }: { meal: IMeal; onSelect: (m: IMeal) => void }) => {
  return (
    <div 
      onClick={() => onSelect(meal)}
      className="bg-white rounded-[2rem] overflow-hidden hover:shadow-[0_20px_40px_rgba(235,102,43,0.15)] transition-all duration-300 flex flex-col p-4 border border-gray-100 group cursor-pointer relative"
    >
      <div className="relative w-full aspect-square bg-[#f9f9f9] rounded-3xl overflow-hidden mb-4">
        <img 
          src={meal.img} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          alt={meal.title} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {meal.calories && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-[#222] text-xs font-bold px-2 py-1 rounded-md z-10 flex items-center gap-1">
            <FaFireAlt className="text-orange-500" /> {meal.calories} kcal
          </span>
        )}
      </div>

      <div className="flex flex-col flex-grow px-2">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-extrabold text-lg text-[#05073C] group-hover:text-[#EB662B] transition-colors line-clamp-1">{meal.title}</h3>
        </div>
        
        <div className="flex items-center gap-1 mb-3">
          <FaStar className="text-yellow-400 text-sm" />
          <span className="text-sm text-gray-500 font-medium">{meal.rating || 4.8} (2k+)</span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
          <span className="text-xl font-black text-[#05073C]"><PriceDisplay price={Number(meal.price.toFixed(2))} /></span>
          <button className="bg-[#f2f2f2] group-hover:bg-[#EB662B] group-hover:text-white text-[#05073C] w-10 h-10 rounded-full flex items-center justify-center transition-colors">
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
  );
};

const UpsellModal = ({ meal, isOpen, onClose, onAdd }: { meal: IMeal | null; isOpen: boolean; onClose: () => void; onAdd: (item: ICartItem) => void }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  
  // Reset state when modal opens with new meal
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedExtras([]);
    }
  }, [isOpen, meal]);

  if (!isOpen || !meal) return null;

  const extrasOptions = [
    { name: "Extra Cheese", price: 2.00 },
    { name: "Large Fries", price: 3.50 },
    { name: "Cold Drink", price: 1.50 }
  ];

  const handleExtraToggle = (name: string) => {
    if (selectedExtras.includes(name)) {
      setSelectedExtras(selectedExtras.filter(e => e !== name));
    } else {
      setSelectedExtras([...selectedExtras, name]);
    }
  };

  const extrasTotal = extrasOptions
    .filter(e => selectedExtras.includes(e.name))
    .reduce((sum, e) => sum + e.price, 0);

  const finalPrice = (meal.price + extrasTotal) * quantity;

  const handleAddToCart = () => {
    onAdd({
      id: `${meal.id}-${Date.now()}`,
      meal,
      quantity,
      extras: selectedExtras,
      totalPrice: finalPrice
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-[2.5rem] w-full max-w-md relative z-10 overflow-hidden shadow-2xl flex flex-col p-6 animate-scaleIn">
        <button onClick={onClose} className="absolute top-4 right-4 bg-gray-100 text-gray-500 hover:text-red-500 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-20">
          <FaTimes />
        </button>

        <div className="w-full h-48 rounded-2xl overflow-hidden mb-6 relative">
          <img src={meal.img} alt={meal.title} className="w-full h-full object-cover" />
        </div>

        <h2 className="text-2xl font-black text-[#05073C] mb-2">{meal.title}</h2>
        <p className="text-gray-500 text-sm mb-6">Enjoy this authentic Egyptian dish prepared fresh to order.</p>

        <div className="mb-6">
          <h4 className="font-bold text-[#05073C] mb-3 uppercase text-sm tracking-wider">Make it a Combo? (Optional)</h4>
          <div className="space-y-3">
            {extrasOptions.map(extra => {
              const isSelected = selectedExtras.includes(extra.name);
              return (
                <div 
                  key={extra.name}
                  onClick={() => handleExtraToggle(extra.name)}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-[#EB662B] bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isSelected ? 'bg-[#EB662B] text-white' : 'bg-gray-200'}`}>
                      {isSelected && <FaCheck className="text-[10px]" />}
                    </div>
                    <span className="font-bold text-[#05073C] text-sm">{extra.name}</span>
                  </div>
                  <span className="text-[#EB662B] font-bold">+${extra.price.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <span className="font-bold text-[#05073C]">Quantity</span>
          <div className="flex items-center gap-4 bg-gray-50 rounded-full p-1 border border-gray-100">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-100"><FaMinus className="text-xs" /></button>
            <span className="font-bold text-[#05073C] w-4 text-center">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-100"><FaPlus className="text-xs" /></button>
          </div>
        </div>

        <button 
          onClick={handleAddToCart}
          className="w-full bg-[#EB662B] text-white py-4 rounded-2xl font-bold text-lg hover:shadow-[0_10px_20px_rgba(235,102,43,0.3)] transition-all flex items-center justify-between px-6"
        >
          <span>Add to Order</span>
          <span><PriceDisplay price={Number(finalPrice.toFixed(2))} /></span>
        </button>
      </div>
    </div>
  );
};

const CartDrawer = ({ isOpen, onClose, cart, onRemove }: { isOpen: boolean; onClose: () => void; cart: ICartItem[]; onRemove: (id: string) => void }) => {
  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className={`fixed inset-0 z-[120] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className={`relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white" dir="auto">
          <h2 className="text-2xl font-black text-[#05073C] flex items-center gap-3">
            <FaShoppingCart /> Your Order
          </h2>
          <button onClick={onClose} className="bg-gray-100 w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors">
            <FaTimes />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 py-10">
              <FaShoppingCart className="text-6xl mb-4 text-gray-200" />
              <p className="text-lg font-medium">Your cart is empty.</p>
              <p className="text-sm">Start adding some delicious food!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                  <img src={item.meal.img} alt={item.meal.title} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-[#05073C] line-clamp-1">{item.meal.title}</h4>
                      <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1"><FaTimes className="text-xs" /></button>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">Qty: {item.quantity}</div>
                    {item.extras.length > 0 && (
                      <div className="text-[10px] bg-orange-50 text-[#EB662B] px-2 py-1 rounded inline-block mb-2 font-bold">
                        With: {item.extras.join(", ")}
                      </div>
                    )}
                    <div className="font-black text-[#05073C]"><PriceDisplay price={Number(item.totalPrice.toFixed(2))} /></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="text-2xl font-black text-[#05073C]"><PriceDisplay price={Number(cartTotal.toFixed(2))} /></span>
            </div>
            <Link 
              to="/checkout" 
              state={{ type: 'food_cart', items: cart, price: cartTotal, title: 'Restaurant Order', image: cart[0]?.meal?.img || '/food/category_food.png' }}
              className="w-full text-center block bg-[#05073C] text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};


// ================= MAIN PAGE =================

const MenuCategoryPage = () => {
  const { category } = useParams();
  
  const location = useLocation();
  const { restaurantId, restaurantName } = location.state || {}; // Extract injected state!

  const [cart, setCart] = useState<ICartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<IMeal | null>(null);

  // Use the restaurant name if available, else just "Menu"
  const baseTitle = category ? category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ') : "Menu";
  const categoryTitle = restaurantName ? `${baseTitle} at ${restaurantName}` : baseTitle;

  // Data mapping with prices
  let baseCategoryMeals: IMeal[] = [];
  
  if (category === 'breakfast') {
    const ASSET_URL = '/food/';
    baseCategoryMeals = [
      { id: 1, title: "طعمية ساخنة", img: `${ASSET_URL}falafel.png`, price: 0.40, calories: 450 },
      { id: 2, title: "فول بالزيت والليمون", img: `${ASSET_URL}foul.png`, price: 0.60, calories: 350 },
      { id: 3, title: "بطاطس محمرة", img: `${ASSET_URL}fries.png`, price: 0.50, calories: 500 },
      { id: 4, title: "فطير مشلتت وعسل وقشطة", img: `${ASSET_URL}feteer.png`, price: 1.50, calories: 850 },
      { id: 5, title: "فطار مصري كامل", img: `${ASSET_URL}breakfast.png`, price: 3.00, calories: 1200 },
    ];
  } else if (category === 'drinks') {
    const ASSET_URL = '/food/';
    baseCategoryMeals = [
      { id: 1, title: "عصير قصب ساقع", img: `${ASSET_URL}sugarcane.png`, price: 0.40, calories: 150 },
      { id: 2, title: "عناب / كركديه مثلج", img: `${ASSET_URL}enab.png`, price: 0.40, calories: 120 },
      { id: 3, title: "ليمون بالنعناع فريش", img: `${ASSET_URL}lemon_mint.png`, price: 0.70, calories: 90 },
      { id: 4, title: "عصير برتقال فريش", img: `${ASSET_URL}orange_juice.png`, price: 0.80, calories: 110 },
      { id: 5, title: "شاي مصري بالنعناع", img: `${ASSET_URL}egyptian_tea.png`, price: 0.20, calories: 10 },
      { id: 6, title: "قهوة تركي بوش", img: `${ASSET_URL}turkish_coffee.png`, price: 0.50, calories: 15 },
      { id: 7, title: "سحلب شتوي بالمكسرات", img: `${ASSET_URL}sahlab.png`, price: 0.90, calories: 380 },
      { id: 8, title: "مشروب سوبيا باللبن", img: `${ASSET_URL}sobia.png`, price: 0.60, calories: 250 },
    ];
  } else if (category === 'desserts') {
    const ASSET_URL = '/food/';
    baseCategoryMeals = [
      { id: 1, title: "طاجن أم علي بالمكسرات", img: `${ASSET_URL}om_ali.png`, price: 1.20, calories: 550 },
      { id: 2, title: "أرز بلبن بالقشطة", img: `${ASSET_URL}rice_pudding.png`, price: 0.70, calories: 350 },
      { id: 3, title: "زلابية مقرمشة", img: `${ASSET_URL}zalabia.png`, price: 0.60, calories: 420 },
      { id: 4, title: "قشطوطة لوتس", img: `${ASSET_URL}kashtoota.png`, price: 1.50, calories: 600 },
      { id: 5, title: "كنافة بالقشطة", img: `${ASSET_URL}konafa.png`, price: 1.40, calories: 480 },
      { id: 6, title: "بسبوسة سادة", img: `${ASSET_URL}basbousa.png`, price: 0.90, calories: 450 },
      { id: 7, title: "كريم كراميل", img: `${ASSET_URL}creme_caramel.png`, price: 0.80, calories: 300 },
      { id: 8, title: "تشيز كيك فراولة", img: `${ASSET_URL}cheesecake.png`, price: 1.80, calories: 500 },
      { id: 9, title: "مولتن كيك", img: `${ASSET_URL}molten_cake.png`, price: 2.00, calories: 650 },
      { id: 10, title: "ريد فيلفيت", img: `${ASSET_URL}red_velvet.png`, price: 1.60, calories: 480 },
      { id: 11, title: "فدج شوكولاتة", img: `${ASSET_URL}fudge_cake.png`, price: 1.70, calories: 590 },
      { id: 12, title: "كنافة بالمانجو", img: `${ASSET_URL}mango_konafa.png`, price: 2.50, calories: 650 },
    ];
  } else if (category === 'chinese') {
    const ASSET_URL = '/food/';
    baseCategoryMeals = [
      { id: 1, title: "كونغ باو تشيكن حلال", img: `${ASSET_URL}chinese_kungpao.png`, price: 4.50, calories: 600 },
      { id: 2, title: "لحم بقري بالبروكلي", img: `${ASSET_URL}chinese_beefbroc.png`, price: 5.50, calories: 550 },
      { id: 3, title: "دجاج بالبرتقال", img: `${ASSET_URL}chinese_orange.png`, price: 4.80, calories: 650 },
      { id: 4, title: "نودلز الخضار الأصيلة", img: `${ASSET_URL}chinese_noodle.png`, price: 3.50, calories: 480 },
    ];
  } else if (category === 'indian') {
    const ASSET_URL = '/food/';
    baseCategoryMeals = [
      { id: 1, title: "دجاج تيكا ماسالا", img: `${ASSET_URL}indian_tikka.png`, price: 4.80, calories: 580 },
      { id: 2, title: "برياني لحم", img: `${ASSET_URL}indian_biryani.png`, price: 6.50, calories: 800 },
      { id: 3, title: "دجاج بالزبدة", img: `${ASSET_URL}indian_butter.png`, price: 5.00, calories: 650 },
      { id: 4, title: "خبز النان بالثوم", img: `${ASSET_URL}indian_naan.png`, price: 1.00, calories: 250 },
    ];
  } else if (category === 'korean') {
    const ASSET_URL = '/food/';
    baseCategoryMeals = [
      { id: 1, title: "بولجوجي حلال", img: `${ASSET_URL}korean_bulgogi.png`, price: 6.00, calories: 550 },
      { id: 2, title: "تتبوكي حار", img: `${ASSET_URL}korean_tteok.png`, price: 3.80, calories: 450 },
      { id: 3, title: "دجاج مقلي كوري", img: `${ASSET_URL}korean_fried.png`, price: 5.50, calories: 750 },
      { id: 4, title: "أرز مقلي بالكيمتشي", img: `${ASSET_URL}korean_kimchi.png`, price: 4.00, calories: 500 },
    ];
  } else if (category === 'turkish') {
    const ASSET_URL = '/food/';
    baseCategoryMeals = [
      { id: 1, title: "إسكندر كباب", img: `${ASSET_URL}turkish_iskender.png`, price: 6.50, calories: 850 },
      { id: 2, title: "كباب أضنة", img: `${ASSET_URL}turkish_adana.png`, price: 5.00, calories: 700 },
      { id: 3, title: "لحم بعجين", img: `${ASSET_URL}turkish_lahmacun.png`, price: 3.50, calories: 400 },
      { id: 4, title: "كنافة تركية فستق", img: `${ASSET_URL}turkish_kunefe.png`, price: 2.80, calories: 650 },
    ];
  } else if (category === 'italian') {
    const ASSET_URL = '/food/';
    baseCategoryMeals = [
      { id: 1, title: "بيتزا مارجريتا نابولي", img: `${ASSET_URL}italian_margherita.png`, price: 4.00, calories: 750 },
      { id: 2, title: "مكرونة بيني أرابياتا", img: `${ASSET_URL}italian_penne.png`, price: 3.50, calories: 600 },
      { id: 3, title: "لازانيا باللحم الفرش", img: `${ASSET_URL}italian_lasagna.png`, price: 5.50, calories: 850 },
      { id: 4, title: "ريزوتو بالفراخ والمشروم", img: `${ASSET_URL}italian_risotto.png`, price: 4.80, calories: 700 },
    ];
  } else if (category === 'mexican') {
    const ASSET_URL = '/food/';
    baseCategoryMeals = [
      { id: 1, title: "تاكوز لحم مفروم", img: `${ASSET_URL}mexican_tacos.png`, price: 4.20, calories: 550 },
      { id: 2, title: "فاهيتا دجاج", img: `${ASSET_URL}mexican_fajitas.png`, price: 5.00, calories: 600 },
      { id: 3, title: "ناتشوز بالجبن", img: `${ASSET_URL}mexican_nachos.png`, price: 3.80, calories: 800 },
      { id: 4, title: "كاساديا دجاج", img: `${ASSET_URL}mexican_quesadilla.png`, price: 4.50, calories: 650 },
    ];
  } else if (category === 'seafood') {
    baseCategoryMeals = [
      { id: 1, title: "سمك دنيس مشوي", img: `/food/grilled_denis.png`, price: 12.0, calories: 350 },
      { id: 2, title: "سمك بوري سنجاري", img: `/food/singary_bouri.png`, price: 10.0, calories: 450 },
      { id: 3, title: "سمك قاروص مقلي", img: `/food/fried_bass.png`, price: 15.0, calories: 500 },
      { id: 4, title: "طويجن كالاماري", img: `/food/calamari_tagine.png`, price: 14.0, calories: 400 },
    ];
  } else if (category === 'shrimp') {
    baseCategoryMeals = [
      { id: 1, title: "جمبري مشوي جامبو", img: `/food/jumbo_grilled.png`, price: 25.0, calories: 400 },
      { id: 2, title: "جمبري بترفلاي", img: `https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80`, price: 28.0, calories: 550 },
      { id: 3, title: "طاجن سي فود بالكريمة", img: `https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=600&q=80`, price: 20.0, calories: 650 },
      { id: 4, title: "شوربة سي فود مخلية", img: `/food/seafood_soup.png`, price: 8.0, calories: 250 },
    ];
  } else if (category === 'seafood-rice') {
    baseCategoryMeals = [
      { id: 1, title: "أرز صيادية بالجمبري", img: `https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=600&q=80`, price: 6.0, calories: 500 },
      { id: 2, title: "أرز خلطة سي فود", img: `/food/seafood_mixed_rice.png`, price: 8.0, calories: 600 },
      { id: 3, title: "مقبلات طحينة وسلطة", img: `https://images.unsplash.com/photo-1529059997568-3d847b1154f0?auto=format&fit=crop&w=600&q=80`, price: 3.0, calories: 200 },
      { id: 4, title: "أرز صيادية سادة", img: `/food/sayadia_rice.png`, price: 2.5, calories: 350 },
    ];
  } else if (category === 'grills-category') {
    const ASSET_URL = '/food/';
    baseCategoryMeals = [
      { id: 1, title: "مشاوي مشكلة حاتي", img: `${ASSET_URL}grills.png`, price: 8.00, calories: 950 },
      { id: 2, title: "كباب وكفتة", img: `${ASSET_URL}sausage.png`, price: 7.00, calories: 850 },
      { id: 3, title: "فراخ مشوية عالفحم", img: `${ASSET_URL}mandi.png`, price: 6.50, calories: 700 },
      { id: 4, title: "طرب بلدي ضاني", img: `${ASSET_URL}hawawshi.png`, price: 5.50, calories: 600 },
    ];
  } else if (category === 'tagines') {
    const ASSET_URL = '/food/';
    baseCategoryMeals = [
      { id: 1, title: "طاجن بامية باللحمة", img: `${ASSET_URL}okra.png`, price: 4.50, calories: 540 },
      { id: 2, title: "ورق عنب بالكوارع", img: `${ASSET_URL}grape_leaves.png`, price: 5.00, calories: 600 },
      { id: 3, title: "محاشي مشكلة", img: `${ASSET_URL}mixed_mahshi.png`, price: 3.50, calories: 580 },
      { id: 4, title: "ملوخية طاجن", img: `${ASSET_URL}molokhia.png`, price: 2.50, calories: 310 },
    ];
  } else if (category === 'salads') {
    baseCategoryMeals = [
      { id: 1, title: "باذنجان مخلل بالدقة", img: `/food/pickled_eggplant.png`, price: 0.50, calories: 120 },
      { id: 2, title: "بابا غنوج شرقي", img: `/food/babaganoush.png`, price: 0.90, calories: 120 },
      { id: 3, title: "سلطة طحينة بيتي", img: `/food/tahini.png`, price: 0.80, calories: 150 },
      { id: 4, title: "سلطة بلدي خضراء", img: `/food/green_salad.png`, price: 1.00, calories: 100 },
    ];
  } else if (category === 'koshary-meals') {
    const ASSET_URL = '/food/';
    baseCategoryMeals = [
      { id: 1, title: "كشري التحرير ميجا", img: `${ASSET_URL}koshary.png`, price: 2.00, calories: 650 },
      { id: 2, title: "طاجن مكرونة باللحمة", img: `${ASSET_URL}fatta.png`, price: 2.50, calories: 550 },
      { id: 3, title: "طاجن مكرونة بالفراخ", img: `${ASSET_URL}shawarma.png`, price: 2.20, calories: 500 },
      { id: 4, title: "كشري وسط", img: `${ASSET_URL}koshary.png`, price: 1.50, calories: 450 },
    ];
  } else if (category === 'extras') {
    baseCategoryMeals = [
      { id: 1, title: "صلصة كشري زيادة", img: `/food/koshary_salsa_1776728282739.png`, price: 0.30, calories: 50 },
      { id: 2, title: "دقة وشطة نار", img: `/food/koshary_dakka_1776728296556.png`, price: 0.20, calories: 10 },
      { id: 3, title: "تقلية بصل مقرمش", img: `/food/koshary_onions_1776728310136.png`, price: 0.40, calories: 80 },
      { id: 4, title: "حمص مدشوش زيادة", img: `/food/koshary_hummus_1776728324264.png`, price: 0.50, calories: 90 },
    ];
  } else if (category === 'birds') {
    baseCategoryMeals = [
      { id: 1, title: "حمام محشي أرز", img: `/food/true_pigeon.png`, price: 4.50, calories: 750 },
      { id: 2, title: "نصف بطة بلدي", img: `/food/food_mandi_chicken.png`, price: 8.00, calories: 950 },
      { id: 3, title: "فراخ مشوية عالفحم", img: `/food/pigeon.png`, price: 6.00, calories: 600 },
      { id: 4, title: "سمك دنيس مشوي", img: `/food/grilled_denis.png`, price: 12.00, calories: 450 },
    ];
  } else if (category === 'appetizers') {
    baseCategoryMeals = [
      { id: 1, title: "طحينة مصرية أصلية", img: `/food/tahini.png`, price: 0.80, calories: 150 },
      { id: 2, title: "بابا غنوج بالرمان", img: `/food/babaganoush.png`, price: 0.90, calories: 120 },
      { id: 3, title: "بصل وثوم مقرمش", img: `/food/food_fries.png`, price: 0.50, calories: 200 },
      { id: 4, title: "سلطة بلدي خضراء", img: `/food/green_salad.png`, price: 1.00, calories: 80 },
    ];
  } else if (category === 'traditional-drinks') {
    baseCategoryMeals = [
      { id: 1, title: "شاي مصري بالنعناع", img: `/food/egyptian_tea.png`, price: 0.20, calories: 10 },
      { id: 2, title: "كركديه عناب صعيدي", img: `/food/enab.png`, price: 0.40, calories: 120 },
      { id: 3, title: "سوبيا بلدي باللبن", img: `/food/sobia.png`, price: 0.60, calories: 250 },
      { id: 4, title: "قهوة تركي قوية", img: `/food/turkish_coffee.png`, price: 0.50, calories: 15 },
    ];
  } else {
    const ASSET_URL = '/food/';
    baseCategoryMeals = [
      { id: 1, title: "كبدة إسكندراني", img: `${ASSET_URL}kibda.png`, price: 1.50, calories: 480 },
      { id: 2, title: "حواوشي بلدي", img: `${ASSET_URL}hawawshi.png`, price: 1.50, calories: 550 },
      { id: 3, title: "سجق شرقي", img: `${ASSET_URL}sausage.png`, price: 1.40, calories: 510 },
      { id: 4, title: "فتة مصري باللحمة", img: `${ASSET_URL}fatta.png`, price: 3.00, calories: 850 },
      { id: 5, title: "شاورما مصري", img: `${ASSET_URL}shawarma.png`, price: 1.50, calories: 600 },
      { id: 6, title: "ملوخية طاجن", img: `${ASSET_URL}molokhia.png`, price: 1.80, calories: 310 },
      { id: 7, title: "حمام محشي", img: `${ASSET_URL}true_pigeon.png`, price: 4.50, calories: 750 },
      { id: 8, title: "ورق عنب بالكوارع", img: `${ASSET_URL}grape_leaves.png`, price: 3.50, calories: 600 },
      { id: 9, title: "طاجن بامية باللحمة", img: `${ASSET_URL}okra.png`, price: 3.00, calories: 540 },
      { id: 10, title: "مشاوي مشكلة", img: `${ASSET_URL}grills.png`, price: 8.00, calories: 950 },
      { id: 11, title: "فراخ مندي روعة", img: `${ASSET_URL}mandi.png`, price: 6.00, calories: 700 },
      { id: 12, title: "كشك صعيدي بالفراخ", img: `${ASSET_URL}kishk.png`, price: 1.00, calories: 350 },
      { id: 13, title: "رز مصري بالشعرية", img: `${ASSET_URL}vermicelli_rice.png`, price: 0.50, calories: 250 },
      { id: 14, title: "محاشي مشكلة", img: `${ASSET_URL}mixed_mahshi.png`, price: 2.50, calories: 580 },
      { id: 15, title: "أكلة رنجة بالبصل والطحينة", img: `${ASSET_URL}renga.png`, price: 2.00, calories: 480 },
      { id: 16, title: "كشري أبو طارق", img: `${ASSET_URL}koshary.png`, price: 1.20, calories: 650 },
    ];
  }

  // MAGICAL UNIQUE MENU GENERATOR
  // We use the restaurantId (or 1 if none) to manipulate the items and make EVERY restaurant perfectly unique!
  const numId = restaurantId ? parseInt(restaurantId) : 1;
  const categoryMeals: IMeal[] = baseCategoryMeals.map((meal, index) => {
    // Generate unique ID
    const uniqueId = Number(`${numId}${meal.id}${index}`);
    
    // Add unique pricing offset
    const priceOffset = (numId * 0.15) + (index * 0.05);
    const newPrice = Number((meal.price + priceOffset).toFixed(2));
    
    // Customize title
    const isArabic = /[\u0600-\u06FF]/.test(meal.title);
    let newTitle = meal.title;
    if (restaurantName) {
      if (isArabic) {
        // If it already has "حاتي" or similar, just replace or append
        newTitle = `${meal.title} (من ${restaurantName})`;
      } else {
        newTitle = `${restaurantName}'s ${meal.title}`;
      }
    }
    
    return { ...meal, id: uniqueId, title: newTitle, price: newPrice };
  });

  // Optional: Slice or shuffle elements if there's enough so they have different counts
  if (categoryMeals.length > 4) {
    categoryMeals.sort((a, b) => (numId % 2 === 0 ? a.id - b.id : b.id - a.id));
  }

  const handleAddToCart = (item: ICartItem) => {
    setCart(prev => [...prev, item]);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-[#fcfaf8] min-h-screen relative font-sans">
      
      {/* Top Banner Area */}
      <div className="bg-[#05073C] pt-32 pb-12 rounded-b-[3rem] px-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/restaurants" className="flex items-center gap-2 text-white/70 hover:text-white transition font-medium bg-white/10 px-4 py-2 rounded-full">
            <FaArrowLeft /> Back to Menus
          </Link>
        </div>
        
        <div className="text-center mt-12 mb-8">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Our {categoryTitle}
          </h1>
          <p className="text-white/70 max-w-xl mx-auto text-lg leading-relaxed">
            Freshly prepared, authentically spiced, and ready to be delivered hot to your table. 
          </p>
        </div>
      </div>

      <SectionWrapper className="py-8 bg-[#fcfaf8]">
        <div className="max-w-6xl mx-auto mb-10 px-4">
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 mb-8" dir="rtl">
            <h2 className="text-2xl font-bold text-[#14213d] mb-8 text-center">أقسام المنيو المتوفرة</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
              {[
                { title: "الإفطار", id: "breakfast", icon: "☕", enTitle: "Breakfast" },
                { title: "الأطباق الرئيسية", id: "main-dishes", icon: "🍜", enTitle: "Main Dishes" },
                { title: "الحلويات", id: "desserts", icon: "🍰", enTitle: "Desserts" },
                { title: "المشروبات", id: "drinks", icon: "🍹", enTitle: "Drinks" }
              ].map((item) => (
                <Link 
                  to={`/restaurants/menu/${item.id}`}
                  key={item.id} 
                  className={`border rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 text-center block group
                    ${category === item.id 
                      ? 'bg-white border-[#cd4f3c] shadow-md' 
                      : 'bg-[#fdfaf7] border-gray-100 hover:border-[#D4AF37] hover:shadow-lg'
                    }
                  `}
                >
                  <div className="w-14 h-14 mx-auto bg-white rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <h3 className={`font-bold text-sm md:text-base ${category === item.id ? 'text-[#cd4f3c]' : 'text-gray-800'}`}>
                    {item.title}
                  </h3>
                  <span className="text-xs text-gray-500 mt-1 block">{item.enTitle}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
          {categoryMeals.map(meal => (
             <InteractiveFoodCard key={meal.id} meal={meal} onSelect={setSelectedMeal} />
          ))}
        </div>
      </SectionWrapper>

      {/* Floating Smart Cart Widget */}
      <div 
        className={`fixed bottom-8 right-8 z-50 transition-all duration-500 ${cart.length > 0 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-90 pointer-events-none'}`}
      >
        <button 
          onClick={() => setIsCartOpen(true)}
          className="bg-[#05073C] text-white p-4 rounded-3xl shadow-[0_20px_40px_rgba(5,7,60,0.3)] flex items-center gap-4 hover:shadow-xl transition-all group animate-[float_3s_ease-in-out_infinite]"
        >
          <div className="relative">
            <FaShoppingCart className="text-2xl" />
            <span className="absolute -top-3 -right-3 bg-[#EB662B] text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#05073C]">
              {totalCartCount}
            </span>
          </div>
          <div className="flex flex-col items-start pr-2">
            <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Total</span>
            <span className="font-black"><PriceDisplay price={Number(cart.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2))} /></span>
          </div>
        </button>
      </div>

      {/* UI Modals */}
      <UpsellModal 
        meal={selectedMeal} 
        isOpen={!!selectedMeal} 
        onClose={() => setSelectedMeal(null)} 
        onAdd={handleAddToCart}
      />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        onRemove={handleRemoveFromCart}
      />
      
      {/* Global Style for animations */}
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
};

export default MenuCategoryPage;
