import SectionWrapper from "@/components/sections/SectionWrapper";
import { Link } from "react-router-dom";

const SitemapPage = () => {
  const sections = [
    {
      title: "Main Pages",
      links: [
        { name: "Home", path: "/" },
        { name: "Services", path: "/Services" },
        { name: "Support", path: "/support" },
      ]
    },
    {
      title: "Destinations & Bookings",
      links: [
        { name: "Hotels", path: "/hotels" },
        { name: "Transportation", path: "/transportation" },
        { name: "Travel Packages", path: "/packages" },
        { name: "Tours", path: "/tours" },
        { name: "Restaurants", path: "/restaurants" },
      ]
    },
    {
      title: "Activities & Entertainment",
      links: [
        { name: "Events", path: "/events" },
        { name: "Safari", path: "/safari" },
        { name: "Museums", path: "/museums" },
        { name: "Bazaars", path: "/bazaars" },
      ]
    },
    {
      title: "Company details",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Contact Us", path: "/contact" },
        { name: "Reviews", path: "/reviews" },
        { name: "Travel Guides", path: "/travel-guides" },
      ]
    },
    {
      title: "Legal & Policies",
      links: [
        { name: "Data Policy", path: "/data-policy" },
        { name: "Cookie Policy", path: "/cookie-policy" },
        { name: "Legal Terms", path: "/legal" },
      ]
    }
  ];

  return (
    <div className="bg-[#fcfbf9] min-h-screen">
      <SectionWrapper className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#14213d] mb-12 font-serif text-center">Site Map</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {sections.map((section, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-[#cd4f3c] mb-6 border-b border-gray-100 pb-4">{section.title}</h2>
                <ul className="space-y-4">
                  {section.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <Link to={link.path} className="text-gray-600 hover:text-[#cd4f3c] hover:underline font-medium transition">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default SitemapPage;
