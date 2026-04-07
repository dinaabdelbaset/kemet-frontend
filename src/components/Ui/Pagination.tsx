interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) => {
    const goToPrev = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const goToNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="flex items-center justify-center gap-4 mt-8">
            {/* Prev */}
            <button
                onClick={goToPrev}
                disabled={currentPage === 1}
                className="px-4 py-2 border cursor-pointer rounded disabled:opacity-40 disabled:cursor-not-allowed disabled:cursor-not-allowed"
            >
                Prev
            </button>

            {/* Page Number */}
            <span className="font-medium">
                Page {currentPage} of {totalPages}
            </span>

            {/* Next */}
            <button
                onClick={goToNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
