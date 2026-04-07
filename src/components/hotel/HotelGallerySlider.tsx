import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface HotelGallerySliderProps {
    images: string[];
}

const HotelGallerySlider = ({ images }: HotelGallerySliderProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // If there are no images, don't show anything
    if (!images || images.length === 0) {
        return null;
    }

    // next image
    const nextSlide = () => {
        if (currentIndex === images.length - 1) {
            setCurrentIndex(0);
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    };

    // previous image
    const prevSlide = () => {
        if (currentIndex === 0) {
            setCurrentIndex(images.length - 1);
        } else {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] rounded-3xl overflow-hidden group mb-10">

            {/* Container for all images */}
            <div
                className="w-full h-full flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-full object-cover shrink-0"
                    />
                ))}
            </div>

            {/* go to previous image */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#05073C] p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10"
            >
                <FaChevronLeft />
            </button>

            {/* go to next image */}
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#05073C] p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10"
            >
                <FaChevronRight />
            </button>
        </div>
    );
};

export default HotelGallerySlider;
