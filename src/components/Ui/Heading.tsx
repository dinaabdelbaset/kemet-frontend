import SplitTextReveal from "./SplitTextReveal";

interface IProps {
  title: string;
  subtitle?: string;
}
const Heading = ({ title, subtitle }: IProps) => {
  return (
    <div className="mb-8 md:mb-10">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-[3px] w-8 bg-gradient-to-r from-[#D4AF37] to-[#EB662B] rounded-full" />
        <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.2em]">Explore</span>
      </div>
      <h2 className="text-2xl md:text-3xl lg:text-5xl lg:tracking-tight capitalize font-bold text-heading leading-tight">
        <SplitTextReveal text={title} type="words" duration={1} stagger={0.05} />
      </h2>
      {subtitle && (
        <p className="text-gray-500 mt-2 text-sm md:text-base max-w-2xl">{subtitle}</p>
      )}
    </div>
  );
};

export default Heading;
