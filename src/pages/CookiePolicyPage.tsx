import SectionWrapper from "@/components/sections/SectionWrapper";

const CookiePolicyPage = () => {
  return (
    <div className="bg-[#fcfbf9] min-h-screen">
      <SectionWrapper className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto bg-white p-10 md:p-16 rounded-[2rem] shadow-sm border border-gray-100">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#14213d] mb-8 font-serif">Cookie Policy</h1>
          <p className="text-gray-500 mb-8">Last updated: March 24, 2026</p>
          
          <div className="space-y-8 text-gray-700 leading-relaxed text-lg">
            <section>
              <h2 className="text-2xl font-bold text-[#14213d] mb-4">1. What Are Cookies?</h2>
              <p>
                Cookies are small text files that are stored on your browser or device by websites, apps, online media, and advertisements. Our platform uses cookies and similar technologies for purposes such as remembering user preferences and analyzing site traffic.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-[#14213d] mb-4">2. Types of Cookies We Use</h2>
              <ul className="list-disc pl-6 space-y-3">
                <li><strong>Essential Cookies:</strong> Required for the basic functionality of the site, such as logging in and securing your session.</li>
                <li><strong>Performance Cookies:</strong> Allow us to monitor site performance and analyze how visitors interact with our pages.</li>
                <li><strong>Functional Cookies:</strong> Used to remember your preferences (like currency or language) to provide a tailored experience.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#14213d] mb-4">3. Managing Your Cookies</h2>
              <p>
                Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove or reject browser cookies. Please note that if you choose to remove or reject cookies, this could affect the availability and functionality of our services.
              </p>
            </section>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default CookiePolicyPage;
