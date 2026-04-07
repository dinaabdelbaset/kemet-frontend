import Button from "../Ui/Button";

const TransportationHeader = () => {
  return (
    <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1920"
          alt="Transportation Hero"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay*/}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
          Transportation
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 drop-shadow-md">
          Choose from a variety of transportation options to reach your
          destination comfortably and on time.
        </p>
        <a href="#transportation-list" className="flex justify-center items-center">
          <Button className="px-10 py-4 rounded-full text-white text-lg font-bold shadow-xl transform transition hover:scale-105">
            Browse Options
          </Button>
        </a>
      </div>
    </section>
  );
};

export default TransportationHeader;
