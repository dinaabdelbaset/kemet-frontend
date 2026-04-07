import type { CurrencyCode } from "../context/AppContext";

// Base currency is considered USD for these mock rates.
// If your prices are originally in EGP or USD, we use these rates to convert.
// Assuming your original app prices are in USD.
export const exchangeRates: Record<CurrencyCode, number> = {
  USD: 1,
  EGP: 50,      // 1 USD = 50 EGP approx
  EUR: 0.92,    // 1 USD = 0.92 EUR
  GBP: 0.79,    // 1 USD = 0.79 GBP
  SAR: 3.75     // 1 USD = 3.75 SAR
};

export const currencySymbols: Record<CurrencyCode, string> = {
  USD: "$",
  EGP: "EGP ",
  EUR: "€",
  GBP: "£",
  SAR: "SAR "
};

export const convertPrice = (priceInUSD: number, targetCurrency: CurrencyCode): string => {
  const rate = exchangeRates[targetCurrency] || 1;
  const converted = priceInUSD * rate;
  
  // Format with no decimal for large numbers if needed, but standard 2 decimals is safe
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: targetCurrency,
    minimumFractionDigits: targetCurrency === 'EGP' ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(converted);
};

// If the original prices in your data are in EGP, we can use a reverse conversion,
// but for standardisation, we will assume passing the base USD price.
