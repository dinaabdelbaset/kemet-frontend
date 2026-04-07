import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

interface InteractiveMapProps {
  locationName: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ locationName }) => {
  // We use openstreetmap iframe or Google Maps iframe. Google requires API key, so we use a safe query based embed
  // Example for Google Maps (works loosely with generic queries without an API key in some contexts, but let's use a simple presentation)
  const encodedLocation = encodeURIComponent(locationName);

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-[#14213d] dark:text-white mb-6 font-serif flex items-center gap-3">
        <FaMapMarkerAlt className="text-[#EB662B] text-2xl" /> Location on Map
      </h3>
      <div className="w-full h-[400px] rounded-3xl overflow-hidden shadow-lg border-4 border-white dark:border-gray-800 relative z-0">
        <iframe
          title="Map View"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://maps.google.com/maps?q=${encodedLocation}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
        ></iframe>
      </div>
    </div>
  );
};

export default InteractiveMap;
