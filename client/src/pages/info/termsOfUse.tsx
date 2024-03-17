import { useEffect } from "react";

export function TermsOfUse() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col gap-2 w-[90vw] mx-auto text-justify">
      <p className="text-2xl font-bold my-2">Terms of Use</p>
      <p>
        Welcome to Car-Market! Before using our platform, please carefully
        review the following Terms of Use. By accessing or using Car-Market, you
        agree to comply with these terms and conditions.
      </p>
      <p>
        <b>Acceptance of Terms:</b> By accessing or using Car-Market, you agree
        to be bound by these Terms of Use, our Privacy Policy, and all
        applicable laws and regulations. If you do not agree with any part of
        these terms, you may not use our platform.
      </p>
      <p>
        <b>Use of the Platform:</b> Car-Market provides an online marketplace
        for buying and selling vehicles. You agree to use the platform only for
        its intended purpose and in compliance with all applicable laws and
        regulations.
      </p>
      <p>
        <b>User Accounts:</b> In order to access certain features of Car-Market,
        you may be required to create a user account. You are responsible for
        maintaining the confidentiality of your account credentials and for all
        activities that occur under your account.
      </p>{" "}
      <p>
        <b>Listing Cars:</b> If you choose to list a vehicle for sale on
        Car-Market, you agree to provide accurate and up-to-date information
        about the vehicle. You also agree to comply with any additional
        guidelines or requirements for listing vehicles on our platform.
      </p>{" "}
      <p>
        <b>Limitation of Liability:</b> Car-Market is provided on an "as is" and
        "as available" basis, without any warranties of any kind. We are not
        liable for any damages or losses arising from your use of the platform
        or from any transactions conducted through Car-Market.
      </p>
      <p className="mt-4">
        If you have any questions or concerns about these Terms of Use, please
        contact us at:{" "}
        <a href="mailto:info@not-car-market.com">
          <b>info@not-car-market.com</b>
        </a>
        .
      </p>
    </div>
  );
}
