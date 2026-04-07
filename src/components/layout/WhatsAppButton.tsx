import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/201060401644"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-[100] w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center text-3xl hover:scale-110 transition-transform duration-300 hover:shadow-[#25D366]/40 group"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="group-hover:animate-pulse" />
      {/* Tooltip */}
      <span className="absolute left-full ml-3 px-3 py-1 bg-white text-gray-800 text-xs font-bold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
        Need help? Chat with us!
      </span>
    </a>
  );
};

export default WhatsAppButton;
