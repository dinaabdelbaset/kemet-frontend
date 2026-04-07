import { useState } from "react";
import Button from "../Ui/Button";

interface FilterState {
  minPrice: number;
  maxPrice: number;
  categories: string[];
  duration: string;
}

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
  availableCategories?: string[];
}

export const FilterSidebar = ({ onFilterChange, availableCategories = [] }: FilterSidebarProps) => {
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [duration, setDuration] = useState<string>("");

  const handleCategoryToggle = (cat: string) => {
    const updated = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    setSelectedCategories(updated);
  };

  const applyFilters = () => {
    onFilterChange({
      minPrice,
      maxPrice,
      categories: selectedCategories,
      duration,
    });
  };

  const resetFilters = () => {
    setMinPrice(0);
    setMaxPrice(10000);
    setSelectedCategories([]);
    setDuration("");
    onFilterChange({
      minPrice: 0,
      maxPrice: 10000,
      categories: [],
      duration: "",
    });
  };

  const handleMinPrice = (val: number) => {
    setMinPrice(val);
    onFilterChange({ minPrice: val, maxPrice, categories: selectedCategories, duration });
  };

  const handleMaxPrice = (val: number) => {
    setMaxPrice(val);
    onFilterChange({ minPrice, maxPrice: val, categories: selectedCategories, duration });
  };

  const handleDuration = (val: string) => {
    setDuration(val);
    onFilterChange({ minPrice, maxPrice, categories: selectedCategories, duration: val });
  };

  const handleCategory = (cat: string) => {
    const updated = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    setSelectedCategories(updated);
    onFilterChange({ minPrice, maxPrice, categories: updated, duration });
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[#05073C]">Filters</h3>
        <button onClick={resetFilters} className="text-sm text-[#EB662B] hover:underline">
          Reset
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-semibold text-[#05073C] mb-3 text-sm">Price Range (USD)</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => handleMinPrice(Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:border-[#EB662B] focus:outline-none"
            placeholder="Min"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => handleMaxPrice(Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:border-[#EB662B] focus:outline-none"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Categories */}
      {availableCategories.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-[#05073C] mb-3 text-sm">Categories</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableCategories.map((cat) => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategory(cat)}
                  className="rounded text-[#EB662B] focus:ring-[#EB662B]"
                />
                <span className="text-sm text-gray-700">{cat}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Duration */}
      <div className="mb-6">
        <h4 className="font-semibold text-[#05073C] mb-3 text-sm">Duration</h4>
        <div className="space-y-2">
          {["Up to 1 hour", "1 to 4 hours", "4 hours to 1 day", "Multi-day"].map((dur) => (
            <label key={dur} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="duration"
                value={dur}
                checked={duration === dur}
                onChange={() => handleDuration(dur)}
                className="text-[#EB662B] focus:ring-[#EB662B]"
              />
              <span className="text-sm text-gray-700">{dur}</span>
            </label>
          ))}
        </div>
      </div>

      <Button onClick={applyFilters} className="w-full bg-[#05073C] text-white py-2.5 rounded-xl font-bold hover:bg-gray-800 transition">
        Apply Filters
      </Button>
    </div>
  );
};
