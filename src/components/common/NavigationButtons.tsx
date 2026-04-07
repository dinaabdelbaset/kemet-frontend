import { useNavigate, useLocation } from "react-router-dom";

const NavigationButtons = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/") return null;

  return (
    <div className="fixed bottom-6 left-6 z-[99] flex flex-col gap-3">
      <button
        onClick={() => navigate("/")}
        className="p-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-105"
        title="Home"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      </button>

      <button
        onClick={() => navigate(-1)}
        className="p-3 bg-[#EB662B] text-white rounded-full shadow-[0_4px_12px_rgba(235,102,43,0.3)] hover:bg-[#d55e27] transition-all hover:scale-105"
        title="Go Back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
      </button>
    </div>
  );
};

export default NavigationButtons;
