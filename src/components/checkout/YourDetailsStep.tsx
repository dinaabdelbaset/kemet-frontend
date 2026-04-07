interface YourDetailsData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface Props {
  data: YourDetailsData;
  onChange: (data: YourDetailsData) => void;
}

const YourDetailsStep = ({ data, onChange }: Props) => {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <h3 className="text-xl font-bold text-[#05073C]">Who shall we send these tickets to?</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Name</label>
          <input 
            type="text" 
            placeholder="Enter your name" 
            className="w-full border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-[#EB662B] focus:ring-1 focus:ring-[#EB662B] transition-colors"
            value={data.firstName}
            onChange={(e) => onChange({...data, firstName: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Surname</label>
          <input 
            type="text" 
            placeholder="Enter your surname" 
            className="w-full border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-[#EB662B] focus:ring-1 focus:ring-[#EB662B] transition-colors"
            value={data.lastName}
            onChange={(e) => onChange({...data, lastName: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Telephone Number</label>
          <input 
            type="tel" 
            placeholder="Enter your telephone number" 
            className="w-full border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-[#EB662B] focus:ring-1 focus:ring-[#EB662B] transition-colors"
            value={data.phone}
            onChange={(e) => onChange({...data, phone: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Email Address</label>
          <input 
            type="email" 
            placeholder="Enter your email address" 
            className="w-full border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-[#EB662B] focus:ring-1 focus:ring-[#EB662B] transition-colors"
            value={data.email}
            onChange={(e) => onChange({...data, email: e.target.value})}
          />
        </div>
      </div>
    </div>
  );
};

export default YourDetailsStep;
