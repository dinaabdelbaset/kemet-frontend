import { useState, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
];

const getInitialLang = () => {
  if (typeof document === 'undefined') return languages[0];
  const match = document.cookie.match(/googtrans=\/[a-zA-Z]+\/([a-zA-Z]+)/);
  if (match && match[1]) {
    const code = match[1].toLowerCase();
    const found = languages.find(l => l.code === code);
    if (found) return found;
  }
  return languages[0];
};

const LanguageSwitcher = ({ scrolled = true }: { scrolled?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(getInitialLang());

  useEffect(() => {
    // Initial setup on mount based on cookie
    if (currentLang.code === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = currentLang.code;
    }
  }, [currentLang]);

  const changeLanguage = (lang: typeof languages[0]) => {
    setCurrentLang(lang);
    setIsOpen(false);
    
    // Set document direction for RTL support (Arabic)
    if (lang.code === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = lang.code;
    }

    // Safely configure Google Translate Cookies to aggressively translate
    const hostname = window.location.hostname;
    const targetLang = lang.code;
    
    // Set the cookie to always translate from auto to the target language 
    document.cookie = `googtrans=/auto/${targetLang}; path=/`;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      document.cookie = `googtrans=/auto/${targetLang}; domain=${hostname}; path=/`;
      document.cookie = `googtrans=/auto/${targetLang}; domain=.${hostname}; path=/`;
    }

    // Small delay ensures cookies are saved to browser storage before reload
    setTimeout(() => {
      window.location.reload();
    }, 150);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 text-[12px] font-semibold transition px-2.5 py-1.5 rounded-lg ${
          scrolled
            ? "text-gray-700 dark:text-gray-300 hover:text-[#EB662B] bg-gray-100 dark:bg-white/8 border border-gray-200 dark:border-white/10 hover:border-[#EB662B]/40"
            : "text-white/90 hover:text-white bg-white/10 border border-white/20 hover:bg-white/20"
        }`}
      >
        <span className="uppercase font-bold text-xs">{currentLang.code}</span>
        <span className="text-sm leading-none">{currentLang.flag}</span>
        {isOpen ? <IoIosArrowUp className="text-xs" /> : <IoIosArrowDown className="text-xs" />}
      </button>

      {isOpen && (
        <ul className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
          {languages.map((lang) => (
            <li key={lang.code}>
              <button
                onClick={() => changeLanguage(lang)}
                className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition ${currentLang.code === lang.code ? 'bg-orange-50 text-[#cd4f3c] font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className={lang.code === 'ar' ? 'font-arabic' : ''}>{lang.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
