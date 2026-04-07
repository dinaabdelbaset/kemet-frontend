
const vehicleTypes = ["All", "Bus", "Van", "Car"]

interface IProps {
  selectedType: string;
  sortOrder: string;
  onTypeChange: (type: string) => void;
  onSortChange: (sort: string) => void;
}

const TransportationFilters = ({
  selectedType,
  sortOrder,
  onTypeChange,
  onSortChange,
}: IProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div className="flex flex-wrap gap-3">
        {vehicleTypes.map((type) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer
              ${selectedType === type
                ? "bg-[#EB662B] text-white shadow-lg shadow-[#EB662B]/25"
                : "bg-white text-[#05073C] border border-gray-200 hover:border-[#EB662B] hover:text-[#EB662B]"
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/*  dropdown */}
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 min-w-[200px]">
        <select
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full text-sm font-medium text-[#05073C] focus:outline-none bg-transparent cursor-pointer"
        >
          <option value="default">Sort by Price</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
        </select>
      </div>
    </div>
  );
};

export default TransportationFilters;
