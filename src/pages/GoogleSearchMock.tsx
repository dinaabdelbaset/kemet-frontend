import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleSearchMock = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (query.trim().length > 0) {
      setSearched(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-white text-left font-sans" dir="ltr" style={{ zIndex: 99999, position: 'relative' }}>
      {/* Google Header */}
      <div className="flex items-center p-4 sm:p-6 border-b border-gray-200">
        <img 
          src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" 
          alt="Google" 
          className="h-6 sm:h-8 mr-4 sm:mr-8" 
        />
        <div className="flex items-center w-full max-w-2xl bg-white border border-gray-300 rounded-full hover:shadow-md px-4 py-2 sm:py-3 transition-shadow">
          <input 
            type="text" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ابحث في Google أو اكتب عنوان URL"
            className="w-full outline-none text-gray-800 text-base"
            autoFocus
          />
          <button onClick={handleSearch} className="text-blue-500 hover:bg-gray-100 p-2 rounded-full transition-colors">
            <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 text-gray-500"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"></path></svg>
          </button>
        </div>
      </div>

      {/* Results */}
      {searched && (
        <div className="max-w-3xl ml-4 sm:ml-[150px] mt-4 px-4 pb-20">
          <p className="text-sm text-gray-500 mb-6">About 2,450,000 results (0.28 seconds)</p>

          {/* Kemet Result */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-[#D4AF37] border border-gray-200">
                <img src="https://cdn-icons-png.flaticon.com/512/11516/11516147.png" alt="Kemet" className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-[#202124] leading-tight">Kemet Tourism Platform</p>
                <p className="text-xs text-[#4d5156]">https://kemet-tourism.com</p>
              </div>
            </div>
            <h3 
              onClick={() => navigate('/')}
              className="text-xl sm:text-2xl text-[#1a0dab] font-medium hover:underline cursor-pointer mb-2"
            >
              Kemet | Explore the Wonders of Egypt - Book Your Trip Now
            </h3>
            <p className="text-sm text-[#4d5156] leading-relaxed">
              Book the best tours, hotels, and museum tickets in Egypt. Your ultimate guide to the Pyramids, Nile Cruises, and the Red Sea. Plan your trip with our <strong>AI Trip Planner</strong>!
            </p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-[#1a0dab]">
              <span onClick={() => navigate('/ai-planner')} className="hover:underline cursor-pointer">✨ AI Trip Planner</span>
              <span onClick={() => navigate('/hotels')} className="hover:underline cursor-pointer">Luxury Hotels</span>
              <span onClick={() => navigate('/tours')} className="hover:underline cursor-pointer">Popular Tours</span>
            </div>
          </div>

          {/* Wikipedia Result */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold">W</div>
              <div>
                <p className="text-sm text-[#202124] leading-tight">Wikipedia</p>
                <p className="text-xs text-[#4d5156]">https://en.wikipedia.org › wiki › Kemet</p>
              </div>
            </div>
            <h3 className="text-xl text-[#1a0dab] font-medium hover:underline cursor-pointer mb-2">
              Kemet - Wikipedia
            </h3>
            <p className="text-sm text-[#4d5156] leading-relaxed">
              <strong>Kemet</strong> was the name used by ancient Egyptians to refer to their land, translating to "Black Land" in reference to the fertile soil of the Nile valley...
            </p>
          </div>

          {/* Ministry of Tourism Result */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold">🇪🇬</div>
              <div>
                <p className="text-sm text-[#202124] leading-tight">Ministry of Tourism and Antiquities</p>
                <p className="text-xs text-[#4d5156]">https://mota.gov.eg</p>
              </div>
            </div>
            <h3 className="text-xl text-[#1a0dab] font-medium hover:underline cursor-pointer mb-2">
              Egypt Tourism Official Website
            </h3>
            <p className="text-sm text-[#4d5156] leading-relaxed">
              Discover the history of Egypt, find official information about antiquities, museums, and plan your next visit to the land of the Pharaohs.
            </p>
          </div>

        </div>
      )}
    </div>
  );
};

export default GoogleSearchMock;
