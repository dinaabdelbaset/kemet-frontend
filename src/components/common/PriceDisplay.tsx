import React from 'react';
import { useApp } from '../../context/AppContext';
import { CURRENCY_RATES } from '../../context/AppContext';

interface PriceDisplayProps {
  price: number;
  className?: string;
  baseCurrency?: keyof typeof CURRENCY_RATES;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ price, className = "", baseCurrency = "USD" }) => {
  const { currency } = useApp();
  
  // Convert from baseCurrency to USD, then to target currency
  const priceInUSD = price / (CURRENCY_RATES[baseCurrency] || 1);
  const convertedPrice = priceInUSD * (CURRENCY_RATES[currency] || 1);

  // Use en-US locale to ensure standard (Western) digits are used for all currencies
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'narrowSymbol', // shows $, €, £, EGP
    maximumFractionDigits: 0,
  }).format(convertedPrice);

  // Fallback for EGP to show "EGP" explicitly if narrowSymbol doesn't work well
  const displayString = currency === "EGP" || currency === "SAR"
    ? `${Math.round(convertedPrice).toLocaleString('en-US')} ${currency}`
    : formattedPrice;

  return <span className={className}>{displayString}</span>;
}

export default PriceDisplay;
