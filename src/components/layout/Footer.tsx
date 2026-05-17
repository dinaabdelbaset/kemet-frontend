import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { IFooterLinks } from "../../interface";
import { getFooterData } from "../../api/contentService";
import Image from "../Ui/Image";
import Input from "../Ui/Input";
import Button from "../Ui/Button";
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  const { Company, Support, Mobile } = IFooterLinks;
  const [payImagesData, setPayImagesData] = useState<any[]>([]);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const data = await getFooterData();
        if (data?.payImages) setPayImagesData(data.payImages);
      } catch (e) { console.error('Error fetching footer:', e); }
    };
    fetchFooter();
  }, []);

  const companyLinks = Company.map((item) => (
    <li key={item.id}>
      <Link to={item.link} className="text-sm text-body hover:text-heading">
        {item.title}
      </Link>
    </li>
  ));

  const supportLinks = Support.map((item) => (
    <li key={item.id}>
      {item.link === "#chatbot" ? (
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
          className="text-sm text-body hover:text-heading cursor-pointer text-left"
        >
          {item.title}
        </button>
      ) : (
        <Link to={item.link} className="text-sm text-body hover:text-heading">
          {item.title}
        </Link>
      )}
    </li>
  ));

  const mobileLinks = Mobile.map((item) => (
    <li key={item.id}>
      <Link to={item.link} className="text-sm text-body hover:text-heading">
        {item.title}
      </Link>
    </li>
  ));

  const PayImages = payImagesData.map((item) => (
    <Image key={item.id} src={item.src} alt={item.alt} className="h-6" />
  ));


  return (
    <footer className="bg-[#FFF7F3] dark:bg-[#0f0f1a] pt-16 border-t border-transparent dark:border-white/5 relative z-10">
      <div className="container mx-auto px-4">
        {/* Top */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          {/* Contact */}
          <div>
            <h4 className="font-semibold text-heading dark:text-white mb-4">Contact</h4>
            <p className="text-sm text-body dark:text-gray-300 leading-relaxed">
              328 Queensberry Street, cairo,Egypt
            </p>
            <p className="mt-3 text-sm text-body text-black dark:text-white font-semibold">dinaabdelbaset@gmail.com</p>
            <div className="flex items-center gap-3 mt-6">
              <a href="https://www.facebook.com/share/14UL6j576Qw/" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition transform hover:scale-110 shadow-sm" aria-label="Visit our Facebook">
                <FaFacebookF size={14} />
              </a>
              <a href="https://www.instagram.com/kemet2540?igsh=MXdjZmxtOXQ4c3hnNQ==" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white hover:opacity-90 transition transform hover:scale-110 shadow-sm" aria-label="Visit our Instagram">
                <FaInstagram size={16} />
              </a>
              <a href="https://www.tiktok.com/@egypt123456798?_r=1&_t=ZS-93mv12pHBFS" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition transform hover:scale-110 shadow-sm" aria-label="Visit our TikTok">
                <FaTiktok size={14} />
              </a>
              <a href="https://wa.me/201060401644" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white hover:bg-green-600 transition transform hover:scale-110 shadow-sm" aria-label="Chat on WhatsApp">
                <FaWhatsapp size={14} />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-heading dark:text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-body dark:text-gray-300">{companyLinks}</ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-heading dark:text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-body dark:text-gray-300">{supportLinks}</ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-heading dark:text-white mb-4">Newsletter</h4>
            <p className="text-sm text-body dark:text-gray-300 mb-4">
              Subscribe to the free newsletter and stay up to date
            </p>

            <div className="flex bg-white dark:bg-white/10 rounded-md overflow-hidden border dark:border-white/10">
              <Input
                name="sendEmail"
                type="email"
                placeholder="Your email address"
                className="flex-1 py-3 pl-2 text-sm outline-none bg-transparent dark:text-white dark:placeholder-gray-400"
              />
              <Button className="flex-1 text-sm font-medium text-white bg-[#EB662B] hover:bg-[#d55822]">
                Send
              </Button>
            </div>
          </div>

          {/* Mobile Apps */}
          <div>
            <h4 className="font-semibold text-heading dark:text-white mb-4">Mobile Apps</h4>
            <ul className="space-y-2 text-sm text-body dark:text-gray-300">{mobileLinks}</ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-default dark:border-white/10 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-body dark:text-gray-400">© Copyright Viatours 2026</p>

          <div className="flex items-center gap-2">{PayImages}</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
