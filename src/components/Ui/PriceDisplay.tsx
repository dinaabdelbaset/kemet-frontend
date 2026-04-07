import { useApp } from "../../context/AppContext";
import { convertPrice } from "../../utils/currency";

interface PriceDisplayProps {
  amount: number;
  className?: string;
}

const PriceDisplay = ({ amount, className = "" }: PriceDisplayProps) => {
  const { currency } = useApp();
  
  return (
    <span className={className}>
      {convertPrice(amount, currency)}
    </span>
  );
};

export default PriceDisplay;
