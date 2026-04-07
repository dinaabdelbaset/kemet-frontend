import SectionWrapper from "@/components/sections/SectionWrapper";

const DataPolicyPage = () => {
  return (
    <div className="bg-[#fcfbf9] min-h-screen">
      <SectionWrapper className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto bg-white p-10 md:p-16 rounded-[2rem] shadow-sm border border-gray-100">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#14213d] mb-8 font-serif">Data Policy</h1>
          <p className="text-gray-500 mb-8">Last updated: March 24, 2026</p>
          
          <div className="space-y-8 text-gray-700 leading-relaxed text-lg">
            <section>
              <h2 className="text-2xl font-bold text-[#14213d] mb-4">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-[#14213d] mb-4">2. How We Use Your Information</h2>
              <p>
                We use the information we collect about you to provide, maintain, and improve our services, including to facilitate payments, send receipts, provide products and services you request, develop new features, provide customer support, and send administrative messages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#14213d] mb-4">3. Sharing of Information</h2>
              <p>
                We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including with third-party service providers, API aggregators, and in response to legal requests. We do not sell your personal data to advertisers.
              </p>
            </section>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default DataPolicyPage;
