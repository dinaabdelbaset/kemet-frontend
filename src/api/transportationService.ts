import axiosClient from "./axiosClient";

/**
 * ---------------------------------------------------------------------------------
 * ملف الخدمات الخاص بالمواصلات (Transportation & Flights/Cars)
 * ---------------------------------------------------------------------------------
 */

export const dummyTransportation = [
  {
    id: 5,
    type: "Bus",
    route: "Cairo to Alexandria",
    company: "Blue Bus",
    class: "VIP AC",
    price: 130,
    duration: "3h",
    departureTime: "07:00 AM",
    rating: 4.2,
    seats: 40,
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80"],
    description: "Travel comfortably by bus from Cairo to Alexandria with scenic views."
  },
  {
    id: 10,
    type: "Minibus",
    route: "Hurghada to El Gouna",
    company: "Red Sea Vans",
    class: "Standard",
    price: 50,
    duration: "45m",
    departureTime: "Every 30 mins",
    rating: 4.3,
    seats: 14,
    image: "https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?w=800&q=80"],
    description: "Fast and reliable minibus service between Hurghada and El Gouna."
  },
  {
    id: 12,
    type: "Car",
    route: "Cairo",
    company: "Kemet Luxury Rentals",
    class: "Sports",
    price: 2500,
    duration: "48h",
    departureTime: "On Demand",
    rating: 4.9,
    seats: 2,
    image: "https://images.unsplash.com/photo-1503376713220-4e55e09ed9af?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1503376713220-4e55e09ed9af?w=800&q=80"],
    description: "Private luxury sports car rental in Cairo for 48 hours."
  }
];

export const getTransportationList = async (filters: any) => {
  try {
    const response = await axiosClient.get("/transportation", { params: filters });
    if (response.data && response.data.length > 0) {
      // Map departure_time to departureTime and ensure image exists
      return response.data.map((t: any) => ({
        ...t,
        departureTime: t.departure_time || t.departureTime || "08:00 AM",
        image: t.image || "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80"
      }));
    }
    return dummyTransportation;
  } catch (err) {
    console.error("API error, falling back to dummy transportation data");
    return dummyTransportation;
  }
};

export const getTransportationDetails = async (id: string | number) => {
  try {
    const response = await axiosClient.get(`/transportation/${id}`);
    if (response.data && response.data.id) {
       return {
         ...response.data,
         departureTime: response.data.departure_time || response.data.departureTime || "08:00 AM",
         image: response.data.image || "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80"
       };
    }
    return dummyTransportation.find(t => t.id == id) || dummyTransportation[0];
  } catch (err) {
    return dummyTransportation.find(t => t.id == id) || dummyTransportation[0];
  }
};
