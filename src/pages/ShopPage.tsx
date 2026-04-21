import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaSpinner } from "react-icons/fa";
import SectionWrapper from "../components/sections/SectionWrapper";
import { getProducts } from "../api/shopService";
import type { Product } from "../api/shopService";
import { useCart } from "../context/CartContext";
import PriceDisplay from "../components/common/PriceDisplay";

const getProductImage = (product: Product) => {
  const n = product.name?.toLowerCase() || '';
  if (n.includes('papyrus')) return '/shop-products/papyrus.png';
  if (n.includes('canvas')) return '/shop-products/canvas_art.png';
  if (n.includes('tapestry')) return '/shop-products/tapestry.png';
  if (n.includes('basket')) return '/shop-products/basket.png';
  
  if (n.includes('spice')) return '/shop-products/spice_box.png';
  if (n.includes('hibiscus')) return '/shop-products/hibiscus.png';
  if (n.includes('date')) return '/shop-products/dates.png';
  if (n.includes('coffee')) return '/shop-products/coffee.png';
  
  if (n.includes('nefertiti')) return '/shop-products/nefertiti.png';
  if (n.includes('tutankhamun') || n.includes('mask')) return '/shop-products/tutankhamun.png';
  if (n.includes('anubis')) return '/shop-products/anubis.png';
  if (n.includes('bastet')) return '/shop-products/bastet.png';
  
  if (n.includes('scarf')) return '/shop-products/scarf.png';
  if (n.includes('galabeya')) return '/shop-products/galabeya.png';
  if (n.includes('cartouche')) return '/shop-products/cartouche.png';
  if (n.includes('necklace')) return '/shop-products/necklace.png';
  
  if (n.includes('lantern')) return '/shop-products/lantern.png';
  if (n.includes('jewelry box')) return '/shop-products/jewelry_box.png';
  if (n.includes('perfume')) return '/shop-products/perfume_bottle.png';
  if (n.includes('rug')) return '/shop-products/rug.png';
  
  return product.image || "https://images.unsplash.com/photo-1555026615-560bf974fa2e?w=500";
};


const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const { addToCart, totalItems } = useCart();

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[450px] w-full flex flex-col items-center justify-center overflow-hidden mb-12">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1534008897995-27a23e859048?w=1600&auto=format&fit=crop" 
            alt="Authentic Egyptian Souvenirs Bazaar" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#05073C]/90 via-[#05073C]/60 to-[#05073C]/90 mix-blend-multiply"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl pt-16">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold tracking-widest uppercase mb-4 animate-in fade-in slide-in-from-bottom-4">
             Bazaar & Souvenirs
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 font-serif drop-shadow-lg animate-in fade-in slide-in-from-bottom-6 duration-500 delay-100">
             Bring Kemet Home
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-md animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
             Buy authentic, high-quality Egyptian products, hand-crafted by local artisans. Delivered securely directly to your hotel.
          </p>
          <div className="flex justify-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
             <Link 
               to="/shop-checkout" 
               className="flex items-center gap-2 bg-[#EB662B] hover:bg-[#d55822] text-white px-8 py-4 rounded-xl font-bold transition shadow-xl shadow-[#EB662B]/30 hover:-translate-y-1"
             >
               <FaShoppingCart className="text-xl" />
               <span>View Cart ({totalItems})</span>
             </Link>
          </div>
        </div>
      </div>

      <SectionWrapper>
        {/* Category Visual Section */}
        <div className="mb-16">
           <h2 className="text-3xl font-extrabold text-[#05073C] mb-8 text-center sm:text-left">Shop by Category</h2>
           <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
              {Array.from(new Set(products.map(p => p.category))).slice(0, 5).map(catName => {
                 let image = "/shop-categories/gifts.png";
                 const str = catName.toLowerCase();
                 if (str.includes('art') || str.includes('craft')) image = "/shop-categories/art_and_crafts.png";
                 else if (str.includes('statue') || str.includes('antiq')) image = "/shop-categories/statues.png";
                 else if (str.includes('jewel') || str.includes('gold')) image = "/shop-categories/jewelry.png";
                 else if (str.includes('cloth') || str.includes('fashion') || str.includes('textil')) image = "/shop-categories/clothing.png";
                 else if (str.includes('food') || str.includes('herb') || str.includes('spice')) image = "/shop-products/spice_box.png";
                 
                 return (
                 <div 
                   key={catName} 
                   onClick={() => setSelectedCategory(catName)}
                   className={`relative h-48 md:h-64 rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer group shadow-sm transition-all transform hover:-translate-y-2 ${selectedCategory === catName ? 'ring-4 ring-[#EB662B] shadow-2xl' : 'hover:shadow-xl'}`}
                 >
                    <img 
                      src={image} 
                      alt={catName} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05073C]/90 via-[#05073C]/30 to-transparent flex flex-col justify-end p-4 md:p-6">
                       <span className="text-white font-extrabold text-lg md:text-2xl transform group-hover:translate-x-2 transition-transform duration-300">{catName}</span>
                    </div>
                 </div>
              )})}
           </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-10 border-b border-gray-200 pb-6 overflow-x-auto">
          <h2 className="text-3xl font-extrabold text-[#05073C] shrink-0 mr-4">Featured Artifacts</h2>
          <div className="flex items-center gap-4 text-sm font-medium text-gray-500 whitespace-nowrap">
             {["All Categories", ...Array.from(new Set(products.map(p => p.category)))].map(cat => (
               <span 
                 key={cat}
                 onClick={() => setSelectedCategory(cat)}
                 className={`cursor-pointer transition ${selectedCategory === cat ? "text-[#EB662B] border-b-2 border-[#EB662B] pb-1" : "hover:text-[#EB662B]"}`}
               >
                 {cat}
               </span>
             ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
             <FaSpinner className="animate-spin text-4xl text-[#D4AF37]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.filter(p => selectedCategory === "All Categories" || p.category === selectedCategory).map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all flex flex-col">
                <div className="h-56 overflow-hidden relative">
                  {/* Fallback image if product.image is missing */}
                  <img 
                    src={getProductImage(product)} 
                    alt={product.name} 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded text-gray-700">
                    {product.category}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{product.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <PriceDisplay className="text-xl font-extrabold text-[#EB662B]" price={Number(product.price)} />
                    <button 
                      onClick={() => addToCart({ ...product, image: getProductImage(product) })}
                      className="text-sm font-semibold bg-gray-100 hover:bg-[#05073C] text-[#05073C] hover:text-white px-4 py-2 rounded-lg transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && products.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                <h3 className="text-2xl font-bold text-gray-400">No products available right now.</h3>
            </div>
        )}
      </SectionWrapper>
    </div>
  );
};

export default ShopPage;
