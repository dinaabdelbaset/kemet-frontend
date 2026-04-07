

interface FilterSidebarProps {
    categories?: { id: string; name: string }[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    onBestSellerChange: (value: boolean) => void;
}

const FilterSidebar = ({
    categories = [],
    selectedCategory,
    onCategoryChange,
    onBestSellerChange,
}: FilterSidebarProps) => {
    return (
        <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-6">
                {/* Categories */}
                <div>
                    <h3 className="text-[#05073C] font-semibold mb-4">
                        Categories
                    </h3>

                    <div className="space-y-3">
                        {categories.map((cat) => (
                            <label
                                key={cat.id}
                                className="flex items-center gap-3 cursor-pointer group"
                            >
                                <input
                                    type="radio"
                                    name="category"
                                    checked={selectedCategory === cat.id}
                                    onChange={() => onCategoryChange(cat.id)}
                                    className="w-4 h-4 text-[#EB662B] focus:ring-[#EB662B]"
                                />
                                <span className="text-sm text-gray-600 group-hover:text-[#05073C] transition-colors">
                                    {cat.name}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <hr className="border-gray-100" />

                {/* Best Seller */}
                <div>
                    <h3 className="text-[#05073C] font-semibold mb-3">
                        Top Picks
                    </h3>

                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            onChange={(e) => onBestSellerChange(e.target.checked)}
                            className="w-4 h-4 text-[#EB662B] focus:ring-[#EB662B]"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-[#05073C] transition-colors">
                            Best Seller
                        </span>
                    </label>
                </div>
            </div>
        </aside>
    );
};

export default FilterSidebar;
