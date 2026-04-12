import type { ITransportation } from "../../interface";
import TransportationCard from "./TransportationCard";

interface IProps {
  data: ITransportation[];
}

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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {data.map((transport) => (
        <TransportationCard 
           key={transport.id} 
           transport={transport} 
        />
      ))}
    </div>
  );
};

export default TransportationList;
