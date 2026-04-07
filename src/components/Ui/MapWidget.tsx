interface MapWidgetProps {
  locationQuery: string;
}

export const MapWidget = ({ locationQuery }: MapWidgetProps) => {
  // Use highly encoded URL for the iframe src using Google Maps embed approach
  // NOTE: In a real production app, an API key is required. 
  // We use a general embed URL format that works without a key for basic places.
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(locationQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative my-8">
      <iframe
        title="Interactive Location Map"
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src={mapUrl}
        className="w-full h-full object-cover"
      ></iframe>
      <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md text-sm font-bold text-[#05073C]">
        📍 {locationQuery}
      </div>
    </div>
  );
};
