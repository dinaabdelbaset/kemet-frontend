const fs = require('fs');

const defaultRoomsStr = `
const defaultRooms: IRoom[] = [
  {
    id: 101,
    name: "Classic Single Room",
    images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800", "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800"],
    type: "Single", beds: 1, price: 120, size: 25,
    amenities: ["Free WiFi", "AC", "TV"], status: "Available"
  },
  {
    id: 102,
    name: "Deluxe Double Room",
    images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"],
    type: "Double", beds: 2, price: 200, size: 40,
    amenities: ["Free WiFi", "AC", "TV", "Mini Bar"], status: "Available", hasBestValueBadge: true
  },
  {
    id: 103,
    name: "Executive Suite",
    images: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800", "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800"],
    type: "Suite", beds: 3, price: 450, size: 80,
    amenities: ["Free WiFi", "AC", "TV", "Mini Bar", "Bathtub", "Balcony"], status: "Available"
  }
];
`;

const citiesData = {
  "Cairo": [
    { name: "The Nile Ritz-Carlton", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/56681024.jpg?k=3af105c31758c5c7ce1a5e1174ee0f02717904ba88c3fc2fb8a983fb08d98d24&o=&hp=1", price: 350 },
    { name: "Four Seasons Hotel Cairo at Nile Plaza", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/41517454.jpg?k=4d4f2bc158bba4cccaaff8cebdf447e7bc3410f8ed8433989c9dce1c02ab05d4&o=&hp=1", price: 420 },
    { name: "Cairo Marriott Hotel & Omar Khayyam Casino", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/247285117.jpg?k=b0b8c6fa2fc1492ba6f6b0f02c0c7ea5d6f1a8cbedef7af0ddb4cc580327f311&o=&hp=1", price: 230 },
    { name: "Fairmont Nile City", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/296767222.jpg?k=230a1bf33c467df88ab1fc03bbbf97dbf301d0fe53c076f83be83c6dd4c9ad24&o=&hp=1", price: 210 },
    { name: "Kempinski Nile Hotel, Cairo", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/38822001.jpg?k=dbb41b9aebe8717c1bfef017c69da4b679bafa360980bdff48f8a2bb53c6e949&o=&hp=1", price: 260 },
    { name: "Sofitel Cairo Nile El Gezirah", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/26429381.jpg?k=5cd91a3297a7d4323fed74fd2b834d87da779d714d3ec1be430fbe8f1a2cc094&o=&hp=1", price: 240 }
  ],
  "Giza": [
    { name: "Marriott Mena House, Cairo", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/138131336.jpg?k=dddb18f3d1f1ee435941da7acff6541603ba0fbf61c164a66a15ecf36fcc7ad4&o=&hp=1", price: 380 },
    { name: "Steigenberger Pyramids Cairo", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/200632204.jpg?k=d7b5006d6bc502fccc2f88cfcd5e9bed769533f81e8b2bd3a0ed79df34139f40&o=&hp=1", price: 190 },
    { name: "Le Méridien Pyramids Hotel & Spa", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/16140508.jpg?k=12f91b4ca134d11d955fa286bb483f324ad7255f9ac37ecbad5a55734bc14d5e&o=&hp=1", price: 160 },
    { name: "Triumph Luxury Hotel", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/267718021.jpg?k=ef45a2789f28da781bcf76451a94dd9e46a782b54dcea482613d9646b5a32693&o=&hp=1", price: 180 },
    { name: "Oasis Hotel Pyramids", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/136006180.jpg?k=c92fb36bf643ab2f348e89cfec4ef6de1dd3141f5ee743ce280f5ec8d8ae311b&o=&hp=1", price: 90 },
    { name: "Grand Pyramids Hotel", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/382025642.jpg?k=9ac5ea30514101eaaa7eebf23ec0df50fe3fa90ef2968ddbecccd80dadddf210&o=&hp=1", price: 75 }
  ],
  "Hurghada": [
    { name: "Steigenberger ALDAU Beach Hotel", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/156903822.jpg?k=da87747754659fcc0bed2bcbacfe26c6158e2392aa0c36b69b596f265ad6e94f&o=&hp=1", price: 210 },
    { name: "Sunrise Royal Makadi Resort", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/125304018.jpg?k=f64a51ebed7dc9e69dbfcae127271e8ba32fe3fef07903f69eb56faec34f3791&o=&hp=1", price: 180 },
    { name: "Baron Palace Sahl Hasheesh", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/202672469.jpg?k=4241e3d09a067e41b2f9f1fa1aa7b8fc3ce9c2c8f8bde6316231bd4e2d27e1f4&o=&hp=1", price: 290 },
    { name: "Jaz Makadi Star & Spa", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/238718664.jpg?k=28178c1cd81414bc91aa82305a30eb6bc1687f8b91ef5220c38d4fed996ed7b3&o=&hp=1", price: 150 },
    { name: "Titanic Palace", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/88856230.jpg?k=6af92bdcbdeb9e72847c21f7fb1fdddd05fc7fdc76ae2c7f461e7ccff1f1bed4&o=&hp=1", price: 120 },
    { name: "Desert Rose Resort", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/33036814.jpg?k=d94c9ba1d8c11e74aeb912cf36ceafc3dccbb9cbf83cbbf4ac1e7bde9352e008&o=&hp=1", price: 130 }
  ],
  "Sharm El-Sheikh": [
    { name: "Rixos Premium Seagate", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/271168128.jpg?k=7a9d0aef86ad6e626e2aade76380c5ce100fa1b6bf2bb179acde04ff388277be&o=&hp=1", price: 350 },
    { name: "Four Seasons Resort Sharm El Sheikh", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/41551829.jpg?k=962f3a69a239ed678b877f8841443422da8a25c34138e4a77afca01fede45cd4&o=&hp=1", price: 480 },
    { name: "Sunrise Arabian Beach Resort", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/89369331.jpg?k=8e41bf398bf3aa7f6c498703223f1ce49cc2f6ef3debdacebf04c38210350d29&o=&hp=1", price: 210 },
    { name: "Steigenberger Alcazar", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/193237582.jpg?k=1259074d0e512fd56c68a4de9d6d0dc949a2a9043cba390c2ff1e13f9f4a56a1&o=&hp=1", price: 280 },
    { name: "Mövenpick Resort Sharm El Sheikh", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/284074213.jpg?k=ff9ce81bcafa25b8ff5cd16e147fcebb427a1b02581c1d9b32afdfebd1d152c1&o=&hp=1", price: 150 },
    { name: "Stella Di Mare Beach Hotel & Spa", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/29263152.jpg?k=10996bcff27a4d6bb0aeb87cdbbf67b931dc16f5c88af1df6b5c16dfc64c7eec&o=&hp=1", price: 140 }
  ],
  "Alexandria": [
    { name: "Four Seasons Hotel Alexandria At San Stefano", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/41517871.jpg?k=756f70cd70198de7ce634b0d00de2cf05d2da3c6fe6b1b7abce14fd8b534606f&o=&hp=1", price: 320 },
    { name: "Steigenberger Cecil Hotel", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/189871780.jpg?k=b4e9f345422abda6f2bb2a6fe1f2bf29a8a7051fbaea1b4c95f03d5231718dd2&o=&hp=1", price: 160 },
    { name: "Helnan Royal Hotel - Palestine", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/388307409.jpg?k=5cd91a3297a7d4323fed74fd2b834d87da779d714d3ec1be430fbe8f1a2cc094&o=&hp=1", price: 140 },
    { name: "Tolip Hotel Alexandria", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/35544778.jpg?k=3ce9aed79e6f1f456ab364dbd20ad7de3d038f88ce1ee27e0fc6cf938ea5fba7&o=&hp=1", price: 110 },
    { name: "Hilton Alexandria Corniche", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/31828859.jpg?k=bb2db608d0e749c951bb700d9e2fc60098df2411cfca3584e038bad1eb1d36d4&o=&hp=1", price: 150 },
    { name: "Paradise Inn Le Metropole Hotel", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/193237582.jpg?k=1259074d0e512fd56c68a4de9d6d0dc949a2a9043cba390c2ff1e13f9f4a56a1&o=&hp=1", price: 90 }
  ],
  "Luxor": [
    { name: "Sofitel Winter Palace Luxor", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/142340578.jpg?k=85c6dfdbdfbb4eabaf05c1d68378d38eecd38d2ed889d134b1da9d83df232b72&o=&hp=1", price: 210 },
    { name: "Hilton Luxor Resort & Spa", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/58882570.jpg?k=23a6d48259deef2505ea5c3a444983e0988bf246ca7bed5c80ed25a1727c62ed&o=&hp=1", price: 180 },
    { name: "Jolie Ville Hotel & Spa Kings Island", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/228100523.jpg?k=f60dff57338baeff52f759c90f23f6c6e3956fc4de329e7c53d10bfabf618991&o=&hp=1", price: 110 },
    { name: "Steigenberger Nile Palace Luxor", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/200632204.jpg?k=d7b5006d6bc502fccc2f88cfcd5e9bed769533f81e8b2bd3a0ed79df34139f40&o=&hp=1", price: 130 },
    { name: "Pavillon Winter Luxor", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/250499691.jpg?k=42407519119616016e788647acae3ca4ac24cfce5bdf04fc29cc46e9df0736e6&o=&hp=1", price: 100 },
    { name: "Sonesta St. George Hotel", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/247285117.jpg?k=b0b8c6fa2fc1492ba6f6b0f02c0c7ea5d6f1a8cbedef7af0ddb4cc580327f311&o=&hp=1", price: 90 }
  ],
  "Aswan": [
    { name: "Sofitel Legend Old Cataract", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/156903822.jpg?k=da87747754659fcc0bed2bcbacfe26c6158e2392aa0c36b69b596f265ad6e94f&o=&hp=1", price: 340 },
    { name: "Mövenpick Resort Aswan", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/284074213.jpg?k=ff9ce81bcafa25b8ff5cd16e147fcebb427a1b02581c1d9b32afdfebd1d152c1&o=&hp=1", price: 150 },
    { name: "Tolip Aswan Hotel", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/35544778.jpg?k=3ce9aed79e6f1f456ab364dbd20ad7de3d038f88ce1ee27e0fc6cf938ea5fba7&o=&hp=1", price: 120 },
    { name: "Citymax Hotel Aswan", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/136006180.jpg?k=c92fb36bf643ab2f348e89cfec4ef6de1dd3141f5ee743ce280f5ec8d8ae311b&o=&hp=1", price: 80 },
    { name: "Basma Hotel Aswan", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/26429381.jpg?k=5cd91a3297a7d4323fed74fd2b834d87da779d714d3ec1be430fbe8f1a2cc094&o=&hp=1", price: 70 },
    { name: "Pyramisa Island Hotel Aswan", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/296767222.jpg?k=230a1bf33c467df88ab1fc03bbbf97dbf301d0fe53c076f83be83c6dd4c9ad24&o=&hp=1", price: 95 }
  ],
  "Marsa Matrouh": [
    { name: "Jaz Almaza Beach Resort", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/238718664.jpg?k=28178c1cd81414bc91aa82305a30eb6bc1687f8b91ef5220c38d4fed996ed7b3&o=&hp=1", price: 180 },
    { name: "Carols Beau Rivage Hotel", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/16140508.jpg?k=12f91b4ca134d11d955fa286bb483f324ad7255f9ac37ecbad5a55734bc14d5e&o=&hp=1", price: 120 },
    { name: "Beau Site Belle Vue", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/388307409.jpg?k=5cd91a3297a7d4323fed74fd2b834d87da779d714d3ec1be430fbe8f1a2cc094&o=&hp=1", price: 95 },
    { name: "Porto Matrouh Beach Resort", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/88856230.jpg?k=6af92bdcbdeb9e72847c21f7fb1fdddd05fc7fdc76ae2c7f461e7ccff1f1bed4&o=&hp=1", price: 85 },
    { name: "Adriatica Hotel", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/29263152.jpg?k=10996bcff27a4d6bb0aeb87cdbbf67b931dc16f5c88af1df6b5c16dfc64c7eec&o=&hp=1", price: 60 },
    { name: "Negresco Hotel", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/382025642.jpg?k=9ac5ea30514101eaaa7eebf23ec0df50fe3fa90ef2968ddbecccd80dadddf210&o=&hp=1", price: 50 }
  ],
  "Port Said": [
    { name: "Resta Port Said Hotel", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/189871780.jpg?k=b4e9f345422abda6f2bb2a6fe1f2bf29a8a7051fbaea1b4c95f03d5231718dd2&o=&hp=1", price: 110 },
    { name: "Port Said Hotel", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/31828859.jpg?k=bb2db608d0e749c951bb700d9e2fc60098df2411cfca3584e038bad1eb1d36d4&o=&hp=1", price: 90 },
    { name: "Jewel Port Said Hotel", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/228100523.jpg?k=f60dff57338baeff52f759c90f23f6c6e3956fc4de329e7c53d10bfabf618991&o=&hp=1", price: 80 },
    { name: "Grand Hotel Port Said", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/250499691.jpg?k=42407519119616016e788647acae3ca4ac24cfce5bdf04fc29cc46e9df0736e6&o=&hp=1", price: 75 },
    { name: "Palace Hotel Port Said", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/193237582.jpg?k=1259074d0e512fd56c68a4de9d6d0dc949a2a9043cba390c2ff1e13f9f4a56a1&o=&hp=1", price: 65 },
    { name: "Noras Village", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/33036814.jpg?k=d94c9ba1d8c11e74aeb912cf36ceafc3dccbb9cbf83cbbf4ac1e7bde9352e008&o=&hp=1", price: 60 }
  ],
  "Fayoum": [
    { name: "Lazib Inn Resort & Spa", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/125304018.jpg?k=f64a51ebed7dc9e69dbfcae127271e8ba32fe3fef07903f69eb56faec34f3791&o=&hp=1", price: 180 },
    { name: "Byoum Lakeside Hotel", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/267718021.jpg?k=ef45a2789f28da781bcf76451a94dd9e46a782b54dcea482613d9646b5a32693&o=&hp=1", price: 110 },
    { name: "Helnan Auberge Fayoum", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/138131336.jpg?k=dddb18f3d1f1ee435941da7acff6541603ba0fbf61c164a66a15ecf36fcc7ad4&o=&hp=1", price: 120 },
    { name: "Tunis Village Resort", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/202672469.jpg?k=4241e3d09a067e41b2f9f1fa1aa7b8fc3ce9c2c8f8bde6316231bd4e2d27e1f4&o=&hp=1", price: 80 },
    { name: "Tzila Lodge", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/156903822.jpg?k=da87747754659fcc0bed2bcbacfe26c6158e2392aa0c36b69b596f265ad6e94f&o=&hp=1", price: 70 },
    { name: "Zad Al Mosafer Guest House", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/58882570.jpg?k=23a6d48259deef2505ea5c3a444983e0988bf246ca7bed5c80ed25a1727c62ed&o=&hp=1", price: 50 }
  ]
};

let output = `import type { IHotel, IRoom } from "../interface";\n\n${defaultRoomsStr}\n\nexport const hotelsData: IHotel[] = [\n`;

let autoId = 1;

for (const [city, hotels] of Object.entries(citiesData)) {
  for (const hotel of hotels) {
    const rating = (4.0 + Math.random() * 0.9).toFixed(1);
    const revCount = Math.floor(Math.random() * 800) + 150;
    
    // Duplicate images realistically to satisfy gallery requirement
    const otherImg1 = hotels[(hotels.indexOf(hotel) + 1) % hotels.length].img;
    const otherImg2 = hotels[(hotels.indexOf(hotel) + 2) % hotels.length].img;
    
    output += `
  {
    id: ${autoId++},
    name: "${hotel.name}",
    city: "${city}",
    country: "Egypt",
    price: ${hotel.price},
    rating: ${rating},
    image: "${hotel.img}",
    images: [
      "${hotel.img}",
      "${otherImg1}",
      "${otherImg2}"
    ],
    description: "Experience unparalleled luxury and authentic Egyptian hospitality at ${hotel.name}. Located in the heart of ${city}, this exquisite property offers stunning views, world-class dining, and premium amenities designed to make your stay unforgettable.",
    Services: [
      "Free WiFi",
      "Air Conditioning",
      "Room Service",
      "Restaurant",
      "Swimming Pool",
      "Fitness Center",
      "24/7 Front Desk"
    ],
    reviewCount: ${revCount},
    rooms: defaultRooms,
  },`;
  }
}

output += `\n];\n`;
output += `\nexport const cities1 = ["Cairo", "Luxor", "Aswan", "Sharm El-Sheikh", "Hurghada", "Alexandria", "Marsa Alam", "Dahab"];\n`;
output += `export const cities2 = ["Dahab", "Marsa Alam", "Alexandria", "Hurghada", "Sharm El-Sheikh", "Aswan", "Luxor", "Cairo"];\n`;

fs.writeFileSync('e:\\مشروع ahmed\\booking-app-main (10)\\booking-app-main\\src\\data\\hotelsData.ts', output, 'utf8');
console.log("hotelsData.ts generated with 60 real hotels.");
