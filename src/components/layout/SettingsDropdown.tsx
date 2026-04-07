import { useState, useRef, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaMoon, FaSun } from "react-icons/fa";
import { useApp } from "../../context/AppContext";
import type { CurrencyCode } from "../../context/AppContext";

const currencies: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'EUR', label: 'Euro', symbol: '€' },
  { code: 'GBP', label: 'British Pound', symbol: '£' },
  { code: 'EGP', label: 'Egyptian Pound', symbol: 'EGP' },
  { code: 'SAR', label: 'Saudi Riyal', symbol: 'SAR' },
];

const SettingsDropdown = ({ scrolled = true }: { scrolled?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currency, setCurrency, theme, toggleTheme } = useApp();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentCurrency = currencies.find(c => c.code === currency) || currencies[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 text-[12px] font-semibold transition px-2.5 py-1.5 rounded-lg ${
          scrolled
            ? "text-gray-700 dark:text-gray-300 hover:text-[#EB662B] bg-gray-100 dark:bg-white/8 border border-gray-200 dark:border-white/10 hover:border-[#EB662B]/40"
            : "text-white/90 hover:text-white bg-white/10 border border-white/20 hover:bg-white/20"
        }`}
      >
        <span className="font-bold text-xs">{currentCurrency.code}</span>
        {theme === 'dark' ? <FaMoon className="text-xs" /> : <FaSun className="text-xs text-yellow-500" />}
        {isOpen ? <IoIosArrowUp className="text-xs" /> : <IoIosArrowDown className="text-xs" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Theme Toggle */}
          <div className="p-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Dark Mode</span>
            <button
              onClick={() => toggleTheme()}
              className={`w-10 h-5 rounded-full flex items-center transition-colors px-1 ${theme === 'dark' ? 'bg-[#cd4f3c]' : 'bg-gray-300'}`}
            >
              <div className={`w-3.5 h-3.5 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Currency List */}
          <div className="py-2">
            <p className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Currency</p>
            <ul>
              {currencies.map((curr) => (
                <li key={curr.code}>
                  <button
                    onClick={() => {
                      setCurrency(curr.code);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition ${currency === curr.code ? 'bg-orange-50 text-[#cd4f3c] font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
                  >
                    <span>{curr.label}</span>
                    <span className="text-xs text-gray-500 font-normal">{curr.symbol}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;
