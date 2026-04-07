import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { CheckoutState } from "../../pages/CheckoutPage";

interface Props {
  data?: CheckoutState;
}

const CheckoutSuccess = ({ data }: Props) => {
  return (
    <div className="min-h-[70vh] bg-white flex flex-col items-center justify-center px-4 animate-fade-in">
      <div className="text-center max-w-lg w-full">
        {/* Orange Check Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[#EB662B] rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
            <svg 
              className="w-10 h-10 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Success message */}
        <h2 className="text-3xl font-extrabold text-[#14213d] mb-4">
          Your Order is complete!
        </h2>
        <p className="text-gray-500 text-lg mb-10 font-medium">
          You will be receiving a confirmation email with order details.
        </p>

        {/* Back to Home Button */}
        <div className="flex justify-center">
          <Link 
            to="/" 
            className="px-8 py-3 bg-transparent border-2 border-[#EB662B] text-[#EB662B] font-bold rounded-full hover:bg-orange-50 transition-colors"
          >
            Go to the Home Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
