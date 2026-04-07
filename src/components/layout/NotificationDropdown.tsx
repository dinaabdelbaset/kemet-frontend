import { useState, useEffect, useRef } from "react";
import { FaBell, FaCheckCircle, FaExclamationCircle, FaInfoCircle } from "react-icons/fa";
import { getUserNotifications, markNotificationAsRead, type Notification } from "../../api/notificationService";

interface NotificationDropdownProps {
  scrolled: boolean;
}

const NotificationDropdown = ({ scrolled }: NotificationDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getUserNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Failed to load notifications", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIconForType = (type: string) => {
    switch (type) {
      case "booking": return <FaCheckCircle className="text-green-500" />;
      case "offer": return <FaExclamationCircle className="text-[#EB662B]" />;
      default: return <FaInfoCircle className="text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/20 dark:hover:bg-gray-800 transition ${
          !scrolled ? "text-white" : "text-gray-700 dark:text-gray-300"
        }`}
      >
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-2 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white dark:border-[#121212]"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-3 w-80 bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
            <h3 className="font-bold text-[#05073C] dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs font-semibold bg-[#EB662B]/10 text-[#EB662B] py-1 px-2 rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#EB662B]"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-5 text-center text-gray-500 dark:text-gray-400 text-sm">
                No notifications right now.
              </div>
            ) : (
              <ul>
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    className={`p-4 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition flex items-start gap-3 ${
                      !notif.isRead ? "bg-blue-50/30 dark:bg-blue-900/10" : ""
                    }`}
                    onClick={() => !notif.isRead && handleRead(notif.id)}
                  >
                    <div className="mt-1">{getIconForType(notif.type)}</div>
                    <div>
                      <p className={`text-sm ${!notif.isRead ? "font-bold text-black dark:text-white" : "font-medium text-gray-700 dark:text-gray-300"}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <span className="w-2 h-2 bg-[#EB662B] rounded-full self-center ml-auto"></span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="border-t border-gray-100 dark:border-gray-800 p-2 text-center">
            <button className="text-xs font-bold text-[#EB662B] hover:text-[#d55822] transition">
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
