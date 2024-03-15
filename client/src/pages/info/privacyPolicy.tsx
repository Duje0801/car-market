import { useEffect } from "react";

export function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="flex flex-col gap-2 w-[90vw] mx-auto text-justify">
      <div>
        <p className="text-2xl font-bold my-2">Privacy Policy</p>
        <p>
          At Car-Market, we are committed to protecting your privacy and
          ensuring the security of your personal information. This Privacy
          Policy outlines how we collect, use, and safeguard the information you
          provide to us when using our platform.
        </p>
      </div>
      <div>
        <p className="text-lg font-bold my-2">1. Information We Collect:</p>
        <ul>
          <li>
            <strong>Personal Information:</strong> When you create an account or
            interact with our platform, we may collect personal information such
            as your name, email address, phone number, and address.
          </li>
          <li>
            <strong>Vehicle Information:</strong> If you list a vehicle for sale
            on Car-Market, we may collect information about the vehicle,
            including its make, model, year, and specifications.
          </li>
          <li>
            <strong>Usage Information:</strong> We may collect information about
            how you use our platform, including your browsing history, search
            queries, and interactions with our website.
          </li>
        </ul>
      </div>
      <div>
        <p className="text-lg font-bold my-2">
          2. How We Use Your Information:
        </p>
        <ul>
          <li>
            <strong>To Provide Services:</strong> We use the information we
            collect to provide and improve our services, including facilitating
            vehicle transactions, customizing your experience, and responding to
            your inquiries.
          </li>
          <li>
            <strong>For Communication:</strong> We may use your contact
            information to communicate with you about your account,
            transactions, and promotional offers.
          </li>
          <li>
            <strong>For Analytics:</strong> We may use aggregated and anonymized
            data for analytical purposes to understand usage trends and improve
            our platform.
          </li>
        </ul>
      </div>
      <div>
        <p className="text-lg font-bold my-2">3. Information Sharing:</p>
        <p>
          We do not sell, trade, or otherwise transfer your personal information
          to third parties without your consent, except as required by law or as
          necessary to fulfill our contractual obligations. We may share your
          information with trusted third-party service providers who assist us
          in operating our platform, conducting business, or servicing you, as
          long as those parties agree to keep this information confidential.
        </p>
      </div>
      <div>
        <p className="text-lg font-bold my-2">4. Data Security:</p>
        <p>
          We implement a variety of security measures to safeguard your personal
          information and prevent unauthorized access, disclosure, alteration,
          or destruction. However, no method of transmission over the internet
          or electronic storage is 100% secure, and we cannot guarantee absolute
          security.
        </p>
      </div>
      <div>
        <p className="text-lg font-bold my-2">5. Your Rights:</p>
        <p>
          You have the right to access, correct, or delete your personal
          information. You may also request that we restrict the processing of
          your data or object to its processing. If you wish to exercise any of
          these rights or have questions about our Privacy Policy, please
          contact us at info@not-car-market.com.
        </p>
      </div>
      <div>
        <p className="text-lg font-bold my-2">6. Changes to Privacy Policy:</p>
        <p>
          Car-Market reserves the right to update or modify this Privacy Policy
          at any time. Any changes will be effective immediately upon posting to
          the platform. Your continued use of Car-Market after any such changes
          constitutes acceptance of the revised policy. By using Car-Market, you
          consent to the terms of this Privacy Policy. If you do not agree with
          this policy, please do not use our platform.
        </p>
      </div>
    </main>
  );
}
