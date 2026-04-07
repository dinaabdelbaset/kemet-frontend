import SectionWrapper from './SectionWrapper';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';

const RecentlyViewedSection = () => {
  const { recentlyViewed } = useApp();

  if (!recentlyViewed || recentlyViewed.length === 0) return null;

  return (
    <SectionWrapper className="bg-gray-50 dark:bg-[#121212] py-16">
      <div className="max-w-7xl mx-auto px-4 mb-10 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-bold text-[#14213d] dark:text-white font-serif mb-3">Recently Viewed</h2>
        <p className="text-gray-500 dark:text-gray-400">Pick up where you left off</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto">
        {recentlyViewed.map((item) => (
          <Link key={`${item.type}-${item.id}`} to={item.link} className="bg-white dark:bg-[#1e1e1e] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition transform hover:-translate-y-1 group border border-gray-100 dark:border-gray-800">
            <div className="h-48 overflow-hidden relative">
               <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
               <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                 {item.type}
               </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-[#05073C] dark:text-white text-lg line-clamp-2 leading-tight">{item.title}</h3>
              <p className="text-sm text-[#EB662B] mt-3 font-bold group-hover:underline flex items-center gap-1">Continue booking <span>&rarr;</span></p>
            </div>
          </Link>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default RecentlyViewedSection;
