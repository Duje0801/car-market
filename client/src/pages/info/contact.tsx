import { useEffect } from "react";

export function Contact() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="flex flex-col gap-2 w-[90vw] mx-auto text-justify">
      <p className="text-2xl font-bold my-2">Contact Us</p>
      <p>
        Thank you for your interest in Car-Market! Whether you have questions
        about our services, need assistance, or simply want to provide feedback,
        we're here to help. Feel free to reach out to us using the contact
        information provided below:
      </p>
      <p className="text-left">
        <b>Email:</b> info@not-car-market.com
      </p>
      <p>
        <b>Phone:</b> +01 234 567 8901 (Monday to Friday, 9am - 5pm CET)
      </p>
      <p>
        <b>Address:</b> <br></br> Car-Market Headquarters, <br></br> Street
        Address City, <br></br> Postal Code Country
      </p>
    </main>
  );
}
