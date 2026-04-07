import SectionWrapper from "@/components/sections/SectionWrapper";

const LegalPage = () => {
  return (
    <div className="bg-[#fcfbf9] min-h-screen">
      <SectionWrapper className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto bg-white p-10 md:p-16 rounded-[2rem] shadow-sm border border-gray-100">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#14213d] mb-8 font-serif">Legal & Terms of Service</h1>
          <p className="text-gray-500 mb-8">Last updated: March 24, 2026</p>
          
          <div className="space-y-8 text-gray-700 leading-relaxed text-lg">
            <section>
              <h2 className="text-2xl font-bold text-[#14213d] mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-[#14213d] mb-4">2. Provision of Services</h2>
              <p>
                We are constantly innovating in order to provide the best possible experience for our users. You acknowledge and agree that the form and nature of the services which we provide may change from time to time without prior notice to you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#14213d] mb-4">3. Limitation of Liability</h2>
              <p>
                In no event shall our company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>
            </section>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default LegalPage;
