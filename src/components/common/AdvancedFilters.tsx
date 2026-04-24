import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface AdvancedFiltersProps {
  onFilterChange: (filters: { priceRange: [number, number]; stars: number[] }) => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25000]);
  const [stars, setStars] = useState<number[]>([]);

  const handleStarToggle = (star: number) => {
    const newStars = stars.includes(star) ? stars.filter(s => s !== star) : [...stars, star];
    setStars(newStars);
    onFilterChange({ priceRange, stars: newStars });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setPriceRange([0, val]);
    onFilterChange({ priceRange: [0, val], stars });
  };

  return (
    <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm sticky top-24">
      <h3 className="text-xl font-bold text-[#05073C] dark:text-white mb-6">Filter By</h3>
      
      {/* Price Filter */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Max Price</h4>
        <input 
          type="range" 
          min="0" max="25000" step="500" 
          value={priceRange[1]} 
          onChange={handlePriceChange}
          className="w-full accent-[#EB662B] mb-2" 
        />
        <div className="flex justify-between text-sm text-[#EB662B] font-bold">
          <span>0 EGP</span>
          <span>{priceRange[1]} EGP</span>
        </div>
      </div>

      {/* Stars Filter */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Star Rating</h4>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((num) => (
            <label key={num} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={stars.includes(num)}
                onChange={() => handleStarToggle(num)}
                className="w-4 h-4 rounded border-gray-300 text-[#EB662B] focus:ring-[#EB662B]"
              />
              <div className="flex items-center gap-1 text-yellow-400 group-hover:scale-105 transition-transform duration-200">
                {[...Array(num)].map((_, i) => <FaStar key={i} size={14} />)}
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;
