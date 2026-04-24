import React, { useState } from 'react';
import { FaWifi, FaTv, FaSnowflake, FaGlassMartiniAlt, FaBed, FaRulerCombined, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import type { IRoom } from '../../interface';
import Button from '../Ui/Button';

interface RoomCardProps {
    room: IRoom;
    onBookNow: (roomId: number) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onBookNow }) => {
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    //  next image
    const nextImg = () => {
        if (currentImgIndex === room.images.length - 1) {
            setCurrentImgIndex(0);
        } else {
            setCurrentImgIndex(currentImgIndex + 1);
        }
    };

    //   previous image
    const prevImg = () => {
        if (currentImgIndex === 0) {
            setCurrentImgIndex(room.images.length - 1);
        } else {
            setCurrentImgIndex(currentImgIndex - 1);
        }
    };

    // pick the right icon 
    const getIcon = (icon: string) => {
        const text = icon.toLowerCase();

        if (text.includes('wifi')) {
            return <FaWifi className="text-[#EB662B]" />;
        } else if (text.includes('tv')) {
            return <FaTv className="text-[#EB662B]" />;
        } else if (text.includes('ac') || text.includes('air conditioning')) {
            return <FaSnowflake className="text-[#EB662B]" />;
        } else if (text.includes('mini bar')) {
            return <FaGlassMartiniAlt className="text-[#EB662B]" />;
        } else {
            // Default icon 
            return <span className="w-1.5 h-1.5 rounded-full bg-[#EB662B] inline-block"></span>;
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col group mb-6 relative">

            {/* Top Side: Image Gallery */}
            <div className="relative w-full h-56 md:h-64 overflow-hidden shrink-0">

                {/* Images sliding container */}
                <div
                    className="w-full h-full flex transition-transform duration-500"
                    style={{ transform: `translateX(-${currentImgIndex * 100}%)` }}
                >
                    {room.images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Room image ${index + 1}`}
                            className="w-full h-full object-cover shrink-0"
                        />
                    ))}
                </div>

                {/* Arrow buttons  */}
                {room.images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); e.preventDefault(); prevImg(); }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#05073C] p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                            <FaChevronLeft className="text-sm" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); e.preventDefault(); nextImg(); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#05073C] p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                            <FaChevronRight className="text-sm" />
                        </button>
                    </>
                )}

                {/* Badge for best value */}
                {room.hasBestValueBadge === true && (
                    <div className="absolute top-4 left-4 bg-[#05073C] text-[#D4AF37] text-[10px] font-bold px-3 py-1 rounded-full shadow-md z-10 uppercase tracking-wide">
                        Best Value
                    </div>
                )}

                {/* Small dots for images */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {room.images.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1.5 rounded-full transition-all ${index === currentImgIndex ? 'bg-white w-3' : 'bg-white/60 w-1.5'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom Side: Room Details (Heart of the Card) */}
            <div className="p-5 flex flex-col flex-grow relative z-20">

                <div className="flex-grow">
                    {/* Title and Price */}
                    <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-3">
                        <div className="flex-1 pr-2">
                            <h3 className="text-xl font-bold text-[#05073C] group-hover:text-[#D4AF37] transition-colors leading-tight">{room.name}</h3>
                            {room.description && <p className="text-[11px] text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">{room.description}</p>}
                        </div>
                        <div className="text-right shrink-0">
                            <span className="text-xl font-black text-[#05073C]">${room.price}</span>
                            <span className="text-xs text-gray-400 block -mt-1 font-medium">/ night</span>
                        </div>
                    </div>

                    {/* Basic Info [beds, size, type] */}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-gray-600 mb-4 font-semibold">
                        <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                            <FaBed className="text-[#D4AF37]" /> {room.beds} {room.beds > 1 ? 'Beds' : 'Bed'}
                        </span>
                        <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                            <FaRulerCombined className="text-[#D4AF37]" /> {room.size} m²
                        </span>
                    </div>

                    {/* icon List */}
                    <div className="mb-4 bg-[#f8f9fa] p-3 rounded-xl border border-gray-100">
                        <h4 className="text-[11px] uppercase tracking-wider font-extrabold text-[#05073C] mb-2 opacity-70">Room Services</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                            {room.amenities.map((icon, index) => (
                                <div key={index} className="flex items-center gap-1.5 text-xs text-gray-600 font-medium font-semibold">
                                    {getIcon(icon)}
                                    <span>{icon}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Status & Action */}
                <div className="flex justify-between items-center mt-2 pt-1">
                    <div className="text-xs font-bold uppercase tracking-wide">
                        {room.status === 'Available' ? (
                            <span className="text-[#20B2AA] flex items-center gap-1.5 bg-[#20B2AA]/10 px-2.5 py-1 rounded-lg">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#20B2AA] shadow-[0_0_8px_rgba(32,178,170,0.8)] animate-pulse"></span>
                                Available
                            </span>
                        ) : (
                            <span className="text-red-500 flex items-center gap-1.5 bg-red-500/10 px-2.5 py-1 rounded-lg">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                                Sold Out
                            </span>
                        )}
                    </div>

                    <Button
                        className="px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg shadow-[#EB662B]/30 hover:shadow-xl hover:-translate-y-0.5 transition-all bg-[#05073C] hover:bg-[#D4AF37]"
                        onClick={() => onBookNow(room.id)}
                        disabled={room.status === 'Booked' || room.available_count === 0}
                    >
                        {room.status === 'Booked' || room.available_count === 0 ? 'Sold Out' : 'Book Now'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RoomCard;
