import { Link, useNavigate, useLocation } from "react-router-dom";
import { getNavItems } from "../../api/contentService";
import { useState, useEffect, useRef } from "react";
import Button from "../Ui/Button";
import { FaBarsStaggered, FaXmark } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { FaHeart, FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import LanguageSwitcher from "./LanguageSwitcher";
import SettingsDropdown from "./SettingsDropdown";
import NotificationDropdown from "./NotificationDropdown";
import { useApp } from "../../context/AppContext";
import { useCart } from "../../context/CartContext";
import gsap from "gsap";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [navbarItemsData, setNavbarItemsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchNavItems = async () => {
      try {
        const data = await getNavItems();
        if (Array.isArray(data)) setNavbarItemsData(data);
      } catch (e) { console.error('Error fetching nav items:', e); }
    };
    fetchNavItems();
  }, []);

  const { user, wishlist, logout } = useApp();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const navRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  // GSAP entrance animation
  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.1 }
      );
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const location = useLocation();
  const solidNavbarPaths = [
    '/checkout', '/wishlist', '/bookings', 
    '/profile', '/dashboard', '/search', '/cart'
  ];
  const forceSolid = solidNavbarPaths.some(path => location.pathname.startsWith(path));

  // Navbar always has a consistent readable background
  const isTransparent = false;
  const navClasses = `fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
    scrolled || mobileOpen
      ? "bg-white/95 dark:bg-[#0f0f1a]/97 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 shadow-sm"
      : "bg-white/80 dark:bg-[#0f0f1a]/80 backdrop-blur-md border-b border-gray-100/60 dark:border-white/5"
  } py-1`;

  const textClass = "text-[#1a1a2e] dark:text-gray-100";

  const hoverClass = "hover:text-[#EB662B] transition-colors duration-200";

  // Main nav items (excluding the last "Support" one)
  const mainNavItems = navbarItemsData.slice(0, -1);
  const lastItem = navbarItemsData[navbarItemsData.length - 1];

  return (
    <nav ref={navRef} className={navClasses}>
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 flex items-center h-[50px] xl:h-[56px] gap-4 xl:gap-6">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center shrink-0 group z-50 gap-2">
          <div style={{
            width: "36px", height: "36px",
            background: "linear-gradient(135deg, #D4AF37, #EB662B)",
            borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(212,175,55,0.4)",
            flexShrink: 0
          }}>
            <span className="notranslate" style={{ color: "white", fontWeight: 900, fontSize: "20px", fontFamily: "serif", lineHeight: 1 }}>K</span>
          </div>
          <span className="notranslate" style={{ fontWeight: 900, fontSize: "17px", color: "#D4AF37", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "serif" }}>
            KEMET
          </span>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <ul className="hidden xl:flex items-center gap-0.5 flex-1">
          {mainNavItems.map((item, index) => (
            <li key={index} className="relative">
              {item.link && (
                <Link
                  to={item.link}
                  className={`relative px-3 py-2 text-[13px] font-semibold rounded-lg tracking-wide whitespace-nowrap
                    ${textClass} ${hoverClass}
                    hover:bg-white/10 dark:hover:bg-white/5
                    group flex items-center gap-1.5`}
                >
                  {item.name}
                  <span className="absolute bottom-1 left-3 right-3 h-[2px] bg-[#EB662B] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full origin-left" />
                </Link>
              )}

              {item.dropdown && (
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenDropdown(openDropdown === item.name ? null : item.name)
                    }
                    className={`px-3 py-2 text-[13px] font-semibold rounded-lg tracking-wide whitespace-nowrap flex items-center gap-1.5
                      ${textClass} ${hoverClass}
                      hover:bg-white/10 dark:hover:bg-white/5`}
                  >
                    {item.name}
                    <IoIosArrowDown
                      className={`text-[11px] transition-transform duration-300 ${
                        openDropdown === item.name ? "rotate-180 text-[#EB662B]" : ""
                      }`}
                    />
                  </button>

                  {/* Standard Dropdown */}
                  {openDropdown === item.name && item.name !== "Destinations" && (
                    <ul className="absolute left-0 top-full mt-3 w-52 bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/8 z-[9999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="h-[3px] w-full bg-gradient-to-r from-[#EB662B] to-[#ff9a6c]" />
                      <div className="py-2">
                        {item.dropdown.map((sub: any, si: any) => (
                          <li key={si}>
                            <Link
                              to={sub.link!}
                              onClick={() => setOpenDropdown(null)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:text-[#EB662B] hover:bg-[#EB662B]/5 transition-all group/sub"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 group-hover/sub:bg-[#EB662B] transition-colors" />
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </div>
                    </ul>
                  )}

                  {/* Mega Menu for Destinations */}
                  {openDropdown === item.name && item.name === "Destinations" && (
                    <div className="absolute left-1/2 -translate-x-1/3 top-full mt-3 w-[580px] bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/8 z-[9999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="h-[3px] w-full bg-gradient-to-r from-[#EB662B] to-[#ff9a6c]" />
                      <div className="p-5 flex gap-5">
                        {/* Links */}
                        <div className="flex-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">
                            Explore by Category
                          </p>
                          <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
                            {item.dropdown.map((sub: any, si: any) => (
                              <li key={si}>
                                <Link
                                  to={sub.link!}
                                  onClick={() => setOpenDropdown(null)}
                                  className="flex items-center gap-2 px-2 py-2 text-[13px] font-semibold text-gray-700 dark:text-gray-300 hover:text-[#EB662B] hover:bg-[#EB662B]/5 rounded-xl transition-all group/m"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 group-hover/m:bg-[#EB662B] group-hover/m:scale-125 transition-all" />
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Featured Card */}
                        <div className="w-[46%] bg-gradient-to-br from-[#05073C] to-[#1a2a6c] rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group/feat">
                          <div className="absolute top-0 right-0 w-28 h-28 bg-[#EB662B]/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover/feat:scale-150 transition-all duration-700" />
                          <div className="relative z-10">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#EB662B] text-white text-[9px] font-black tracking-wider uppercase rounded-full mb-3">
                              ⭐ Featured
                            </span>
                            <h4 className="font-extrabold text-white text-[15px] leading-snug">
                              Magical Egypt Safari
                            </h4>
                            <p className="text-[11px] text-white/60 mt-1.5 leading-relaxed">
                              Vast deserts & luxury camps under a million stars.
                            </p>
                          </div>
                          <Link
                            to="/safari"
                            onClick={() => setOpenDropdown(null)}
                            className="mt-3 overflow-hidden rounded-xl block relative z-10 shadow-lg"
                          >
                            <img
                              src="https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400"
                              className="w-full h-[90px] object-cover transition duration-700 group-hover/feat:scale-110"
                              alt="Safari"
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* ── Right Side Tools ── */}
        <div className="flex items-center gap-1 xl:gap-1.5 ml-auto shrink-0">

          {/* Search Icon / Overlay */}
          <div className="relative hidden lg:block">
            {searchOpen ? (
              <form
                onSubmit={handleSearch}
                className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200"
              >
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destinations..."
                  className={`w-52 h-8 px-4 pr-3 rounded-full text-[13px] border focus:outline-none focus:ring-2 focus:ring-[#EB662B]/50 transition-all
                    ${isTransparent
                      ? "bg-white/15 border-white/30 text-white placeholder-white/60 focus:bg-white/25"
                      : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                  className={`p-1.5 rounded-full hover:bg-white/15 transition ${isTransparent ? "text-white" : "text-gray-500"}`}
                >
                  <FaXmark className="text-sm" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className={`flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/15 dark:hover:bg-white/8 transition-all duration-200 ${isTransparent ? "text-white" : "text-gray-600 dark:text-gray-300"}`}
                aria-label="Search"
              >
                <FaSearch className="text-[13px]" />
              </button>
            )}
          </div>

          {/* Settings (Currency) */}
          <SettingsDropdown scrolled={true} />

          {/* Language */}
          <LanguageSwitcher scrolled={true} />

          {/* Notifications */}
          {user && (
            <NotificationDropdown scrolled={true} />
          )}

          {/* Cart */}
          <Link
            to="/shop-checkout"
            className={`relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/15 dark:hover:bg-white/8 transition-all duration-200 ${isTransparent ? "text-white" : "text-gray-600 dark:text-gray-300"}`}
            aria-label="Cart"
          >
            <FaShoppingCart className="text-[13px]" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 rounded-full bg-[#EB662B] text-white text-[9px] font-black flex items-center justify-center border-[1.5px] border-white dark:border-[#0f0f1a]">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Wishlist */}
          {user && (
            <Link
              to="/wishlist"
              className={`relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/15 dark:hover:bg-white/8 transition-all duration-200 ${isTransparent ? "text-white" : "text-gray-600 dark:text-gray-300"}`}
              aria-label="Wishlist"
            >
              <FaHeart className="text-[13px]" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 rounded-full bg-[#EB662B] text-white text-[9px] font-black flex items-center justify-center border-[1.5px] border-white dark:border-[#0f0f1a]">
                  {wishlist.length}
                </span>
              )}
            </Link>
          )}

          {/* Support CTA Button */}
          {lastItem?.link && (
            <Link
              to={lastItem.link}
              className="hidden lg:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-bold text-white bg-[#EB662B] hover:bg-[#d55822] shadow-md hover:shadow-lg hover:shadow-[#EB662B]/30 transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap ml-1"
            >
              {lastItem.name}
            </Link>
          )}

          {/* Auth / User */}
          {user ? (
            <div className="hidden lg:flex items-center gap-2 relative group cursor-pointer z-50 ml-0.5">
              {user.avatar ? (
                <img src={user.avatar} className="w-8 h-8 rounded-full object-cover shadow-md ring-2 ring-[#EB662B]/30 hover:ring-[#EB662B]/60 transition-all bg-white" alt="Avatar" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#EB662B] to-[#b03c2b] text-white flex items-center justify-center font-black text-sm shadow-md ring-2 ring-[#EB662B]/30 hover:ring-[#EB662B]/60 transition-all">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}

              {/* User Dropdown */}
              <div className="absolute top-full right-0 mt-3 w-56 bg-white dark:bg-[#1a1a2e] border border-gray-100 dark:border-white/8 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 scale-95 group-hover:scale-100 origin-top-right overflow-hidden z-50">
                <div className="h-[3px] bg-gradient-to-r from-[#EB662B] to-[#ff9a6c]" />
                <div className="px-4 py-3.5 border-b border-gray-100 dark:border-white/6 bg-gray-50/50 dark:bg-white/3">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-0.5">Signed in as</p>
                  <p className="text-sm font-bold text-[#1a1a2e] dark:text-white truncate">{user.email || user.name}</p>
                </div>
                <div className="py-1.5">
                  <Link to="/dashboard" onClick={() => {}} className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:text-[#EB662B] hover:bg-[#EB662B]/5 transition-all">
                    👤 My Dashboard
                  </Link>
                  <Link to="/bookings" onClick={() => {}} className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:text-[#EB662B] hover:bg-[#EB662B]/5 transition-all">
                    📋 My Bookings
                  </Link>
                  <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:text-[#EB662B] hover:bg-[#EB662B]/5 transition-all">
                    ⚙️ Profile Settings
                  </Link>
                </div>
                <div className="border-t border-gray-100 dark:border-white/6 py-1.5">
                  <button
                    onClick={logout}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className={`hidden lg:inline-flex items-center gap-1.5 text-[13px] font-semibold transition whitespace-nowrap ml-0.5 ${textClass} ${hoverClass}`}
            >
              <FaUser className="text-[11px]" />
              Log in
            </Link>
          )}

          {/* Mobile Hamburger */}
          <button
            type="button"
            className={`xl:hidden flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 ml-1 ${
              isTransparent
                ? "text-white hover:bg-white/15"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/8"
            }`}
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FaXmark className="text-lg" /> : <FaBarsStaggered className="text-lg" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        className={`xl:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } bg-white dark:bg-[#0f0f1a] border-t border-gray-100 dark:border-white/6 shadow-xl`}
      >
        <div className="px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations..."
              className="w-full h-10 px-4 pr-10 rounded-xl bg-gray-100 dark:bg-white/6 border border-gray-200 dark:border-white/8 text-[13px] text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EB662B]/40 transition"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#EB662B] transition">
              <FaSearch className="text-[13px]" />
            </button>
          </form>

          {navbarItemsData.map((item, index) => (
            <div key={index}>
              {item.link && (
                <Link
                  to={item.link}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-[14px] font-semibold transition-all ${
                    index === navbarItemsData.length - 1
                      ? "bg-[#EB662B] text-white text-center font-bold shadow-md mt-2"
                      : "text-gray-800 dark:text-gray-200 hover:text-[#EB662B] hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
                >
                  {item.name}
                </Link>
              )}

              {item.dropdown && (
                <div>
                  <button
                    onClick={() =>
                      setOpenDropdown(openDropdown === item.name ? null : item.name)
                    }
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-semibold text-gray-800 dark:text-gray-200 hover:text-[#EB662B] hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                  >
                    {item.name}
                    <IoIosArrowDown
                      className={`text-[12px] transition-transform duration-200 ${
                        openDropdown === item.name ? "rotate-180 text-[#EB662B]" : ""
                      }`}
                    />
                  </button>

                  {openDropdown === item.name && (
                    <div className="ml-3 mt-1 mb-1 border-l-2 border-[#EB662B]/25 pl-3 space-y-0.5">
                      {item.dropdown.map((sub: any, si: any) => (
                        <Link
                          key={si}
                          to={sub.link!}
                          onClick={() => { setOpenDropdown(null); setMobileOpen(false); }}
                          className="block py-2 px-3 text-[13px] font-medium text-gray-600 dark:text-gray-400 hover:text-[#EB662B] hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-all"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Mobile Auth */}
          <div className="pt-3 border-t border-gray-100 dark:border-white/6 mt-2">
            {user ? (
              <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-3">
                  {user.avatar ? (
                     <img src={user.avatar} className="w-9 h-9 rounded-full object-cover bg-white" alt="Avatar" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#EB662B] to-[#b03c2b] text-white flex items-center justify-center font-black">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-[13px] font-bold text-gray-900 dark:text-white">{user.name.split(" ")[0]}</p>
                    <p className="text-[11px] text-gray-400 truncate max-w-[160px]">{user.email}</p>
                  </div>
                </div>
                <button onClick={logout} className="text-[12px] font-bold text-red-500 hover:text-red-600 transition">
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[14px] font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/8 hover:border-[#EB662B] hover:text-[#EB662B] transition-all"
              >
                <FaUser className="text-[12px]" /> Log in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
