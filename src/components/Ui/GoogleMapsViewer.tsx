import React, { useEffect, useRef, useState } from 'react';
import { FaTimes, FaSearch, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';

declare global {
  interface Window {
    google: any;
  }
}

interface MapBounds {
  north: number;
  south: number;
  west: number;
  east: number;
}

interface GoogleMapsViewerProps {
  center: { lat: number; lng: number };
  bounds: MapBounds;
  title: string;
  onClose: () => void;
}

const GoogleMapsViewer: React.FC<GoogleMapsViewerProps> = ({ center, bounds, title, onClose }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Custom Search State
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(!!window.google?.maps);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [markerInstance, setMarkerInstance] = useState<any>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Dynamically load Google Maps API
    if (!window.google?.maps) {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''; 
      const scriptId = 'google-maps-script';
      
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`;
        script.async = true;
        script.defer = true;
        script.onload = () => setGoogleMapsLoaded(true);
        document.body.appendChild(script);
      } else {
        script.addEventListener('load', () => setGoogleMapsLoaded(true));
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    // Once loaded and we have our target div, render the restricted 3D map!
    if (googleMapsLoaded && mapRef.current && !mapInstance) {
      
      const map = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: 14,
        mapTypeId: 'hybrid', 
        tilt: 45, 
        heading: 0,
        disableDefaultUI: true, // We will just keep it clean
        zoomControl: true,
        panControl: true,
        streetViewControl: false, 
        
        restriction: {
          latLngBounds: bounds,
          strictBounds: true,
        },
      });

      const marker = new window.google.maps.Marker({
        map,
        anchorPoint: new window.google.maps.Point(0, -29),
        visible: false
      });

      setMapInstance(map);
      setMarkerInstance(marker);
    }
  }, [googleMapsLoaded, center, bounds, mapInstance]);

  // === CUSTOM OPEN SOURCE SEARCH LOGIC (No API Key Required) ===
  const delayDebounceFn = useRef<any>(null);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);

    if (delayDebounceFn.current) clearTimeout(delayDebounceFn.current);

    if (q.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    delayDebounceFn.current = setTimeout(async () => {
      try {
        // Nominatim expects viewbox as: left,top,right,bottom -> west,north,east,south
        const { north, south, east, west } = bounds;
        const viewbox = `${west},${north},${east},${south}`;
        
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&viewbox=${viewbox}&bounded=1&limit=5&addressdetails=1`;
        
        const response = await fetch(url, {
          headers: {
             'Accept-Language': 'ar,en'
          }
        });
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Search failed: ", error);
      } finally {
        setIsSearching(false);
      }
    }, 600);
  };

  const handleSelectPlace = (place: any) => {
    setSearchQuery(place.display_name);
    setSearchResults([]);

    if (mapInstance && markerInstance) {
      const lat = parseFloat(place.lat);
      const lng = parseFloat(place.lon);

      mapInstance.panTo({ lat, lng });
      mapInstance.setZoom(18); // Zoom in closely to the street/restaurant
      
      markerInstance.setPosition({ lat, lng });
      markerInstance.setTitle(place.display_name);
      markerInstance.setVisible(true);
    }
  };
  // ===============================================================

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-500 p-0 md:p-8">
      
      {/* Map HUD UI */}
      <div className="absolute top-0 left-0 right-0 p-4 md:p-8 z-[110] flex justify-between items-start pointer-events-none fade-in">
        <div className="flex flex-col gap-4 max-w-xl w-full">
          
          <div className="flex items-center gap-4">
            <div className="bg-[#10B981] text-white text-[10px] md:text-xs uppercase font-bold px-3 py-1.5 rounded-full animate-pulse tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center gap-2">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
              LIVE 3D EXPLORATION
            </div>
            <h2 className="text-white text-lg md:text-3xl font-display font-black tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-none hidden md:block">
              {title}
            </h2>
          </div>

          {/* Interactive Search Bar Element */}
          <div className="relative pointer-events-auto mt-2">
            <div className="absolute top-0 left-0 h-12 md:h-14 pl-3 md:pl-4 flex items-center pointer-events-none">
              {isSearching ? (
                <FaSpinner className="text-[#D4AF37] animate-spin" />
              ) : (
                <FaSearch className="text-gray-400" />
              )}
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={handleSearchInput}
              placeholder={`ابحث عن شارع، فندق، مطعم في ${title.split('-')[0].trim()}...`}
              dir="auto"
              className="w-full bg-white/95 backdrop-blur-md border-[3px] border-transparent focus:border-[#D4AF37] text-black text-sm md:text-lg rounded-2xl md:rounded-full h-12 md:h-14 pl-10 md:pl-12 pr-12 shadow-[0_10px_30px_rgba(0,0,0,0.5)] outline-none transition-all placeholder:text-gray-500 placeholder:font-medium font-bold"
            />
            <div className="absolute top-0 bottom-auto right-2 h-12 md:h-14 flex items-center">
              <div className="bg-[#D4AF37]/20 text-[#D4AF37] p-2 rounded-full">
                <FaMapMarkerAlt />
              </div>
            </div>

            {/* Custom Dropdown for Search Results (Avoids Google's hidden UI) */}
            {searchResults.length > 0 && (
              <div className="absolute top-[110%] left-0 w-full bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden border border-gray-100 flex flex-col z-[120]">
                {searchResults.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPlace(result)}
                    className="w-full text-left px-5 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 flex flex-col transition-colors group"
                  >
                    <span className="font-bold text-gray-900 group-hover:text-[#EB662B] line-clamp-1" dir="auto">
                      {result.name || result.display_name.split(',')[0]}
                    </span>
                    <span className="text-xs text-gray-400 mt-1 line-clamp-1" dir="auto">
                      {result.display_name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="pointer-events-auto shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 shadow-xl ml-4"
        >
          <FaTimes className="text-xl" />
        </button>
      </div>

      {/* Google Maps JS API Container */}
      <div className="w-full h-full relative md:rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.9)] bg-black border border-white/10">
        
        {/* Loading placeholder skeleton */}
        {!googleMapsLoaded && (
          <div className="absolute inset-0 bg-[#0A0D1A] flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-4 text-white/50 animate-pulse">
              <svg className="w-12 h-12 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="font-bold tracking-widest text-sm uppercase text-center">
                INITIALIZING 3D ENGINE...<br/>
                <span className="text-[10px] text-white/30 lowercase mt-1 block">loading restricted borders & local search databases</span>
              </span>
            </div>
          </div>
        )}

        {/* The actual map target element */}
        <div 
          ref={mapRef} 
          className="w-full h-full absolute inset-0 z-0" 
          style={{ isolation: 'isolate' }} 
        />

      </div>

    </div>
  );
};

export default GoogleMapsViewer;
