import type { ITransportation } from "../../interface";
import TransportationCard from "./TransportationCard";

interface IProps {
  data: ITransportation[];
}

const EXTERNAL_TRANSPORT_IMAGES = [
  "https://cdn.bookaway.com/media/files/67f8bcd9cb2c304aa42bba49.png",
  "https://otobeesy.com/img/about/3.jpg",
  "https://www.trans2day.com/wp-content/uploads/2026/01/%D9%85%D9%88%D8%A7%D8%B9%D9%8A%D8%AF-%D8%A3%D8%AA%D9%88%D8%A8%D9%8A%D8%B3%D8%A7%D8%AA-%D8%B4%D8%B1%D9%82-%D8%A7%D9%84%D8%AF%D9%84%D8%AA%D8%A7-%D8%A8%D8%A7%D9%84%D9%85%D8%AD%D8%A7%D9%81%D8%B8%D8%A7%D8%AA-%D9%88%D8%A3%D8%B3%D8%B9%D8%A7%D8%B1-%D8%A7%D9%84%D8%AA%D8%B0%D8%A7%D9%83%D8%B1-1-780x470.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/b/bc/Toyota_Hiace_%28fifth_generation%29_%28Grand_Cabin%29_%28front%29%2C_Kuala_Lumpur.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1UkEZaU_97zifw4Oqvu89ZOaZaZz_hVUz6A&s",
  "https://kingwaycarrental.com/wp-content/uploads/2025/07/BMW-420i-Convertible-Grey.jpg",
  "https://renty.ae/cdn-cgi/image/format=auto,fit=contain,width=408,height=258,sharpen=0/https://renty.ae/uploads/car/photo/l/silver_porsche--carrera-gts_2024_6294_main_0151d74cccb9c4c0a5e6a651eddc0d54.jpg",
  "https://octane.rent/wp-content/uploads/2024/12/porsche_cayenne_coupe_grey_01-600x400.webp",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH6Oj0LFmMkjs8ChSa22JNw57LIO0KAlOWOw&s",
  "https://octane.rent/wp-content/uploads/2025/05/tesla_cybertruck_silver_01-600x400.webp",
  "https://renty.ae/uploads/car/photo/l/white_tesla-model-y-long-range_2022_4942_main_9777a57e057e742ec561055fcefd91de.jpg",
  "https://exfordrentacar.com/program/images/products/16681642622.jpeg",
  "https://exfordrentacar.com/program/images/products/16840891482.jpeg"
];

const TransportationList = ({ data }: IProps) => {
  // If no results show a friendly message
  if (data.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300">
        <h3 className="text-2xl font-bold text-gray-400">
          No transportation options found.
        </h3>
        <p className="text-gray-400 mt-2">
          Try changing your filters to see more results.
        </p>
      </div>
    );
  }

  // Shuffle logic pseudo-randomly based on index (distributing 13 unique images reliably)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {data.map((transport, i) => (
        <TransportationCard 
           key={transport.id} 
           transport={{ ...transport, image: EXTERNAL_TRANSPORT_IMAGES[i % EXTERNAL_TRANSPORT_IMAGES.length] }} 
        />
      ))}
    </div>
  );
};

export default TransportationList;
