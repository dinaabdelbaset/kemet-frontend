import React from 'react';
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';

interface SocialShareProps {
  url: string;
  title: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ url, title }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-3 py-4 border-y border-gray-100 dark:border-gray-800 my-6">
      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Follow us:</span>
      <a href="https://www.facebook.com/share/14UL6j576Qw/" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition transform hover:scale-110 shadow-sm" aria-label="Visit our Facebook">
        <FaFacebookF size={14} />
      </a>
      <a href="https://www.instagram.com/kemet2540?igsh=MXdjZmxtOXQ4c3hnNQ==" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white hover:opacity-90 transition transform hover:scale-110 shadow-sm" aria-label="Visit our Instagram">
        <FaInstagram size={18} />
      </a>
      <a href="https://www.tiktok.com/@egypt123456798?_r=1&_t=ZS-93mv12pHBFS" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition transform hover:scale-110 shadow-sm" aria-label="Visit our TikTok">
        <FaTiktok size={14} />
      </a>
      <a href="https://wa.me/201060401644" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white hover:bg-green-600 transition transform hover:scale-110 shadow-sm" aria-label="Chat on WhatsApp">
        <FaWhatsapp size={14} />
      </a>
    </div>
  );
};

export default SocialShare;
