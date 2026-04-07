import { Link } from "react-router-dom";
import { FaCompass } from "react-icons/fa";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#fcfbf9] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
         <img 
           src="https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1600" 
           alt="Desert background" 
           className="w-full h-full object-cover grayscale blur-sm"
         />
      </div>

      <div className="relative z-10 max-w-lg bg-white/80 backdrop-blur-md p-10 md:p-14 rounded-[40px] shadow-2xl border border-gray-100/50">
        <div className="w-24 h-24 mx-auto bg-orange-50 text-[#EB662B] rounded-full flex items-center justify-center mb-8 shadow-inner">
          <FaCompass className="text-5xl animate-spin-slow" style={{ animationDuration: '4s' }} />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-[#05073C] mb-2 font-serif text-shadow-sm">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Oops! You're lost in the desert.
        </h2>
        
        <p className="text-gray-500 mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="bg-[#05073C] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#14213d] transition shadow-lg w-full sm:w-auto hover:-translate-y-1 transform duration-300"
          >
            Go to Home
          </Link>
          <Link 
            to="/explore/egypt" 
            className="bg-white text-[#EB662B] border-2 border-[#EB662B] px-8 py-3.5 rounded-full font-bold hover:bg-orange-50 transition shadow-sm w-full sm:w-auto hover:-translate-y-1 transform duration-300"
          >
            Explore Tours
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
