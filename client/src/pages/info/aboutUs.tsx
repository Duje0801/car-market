import { useEffect } from "react";

export function AboutUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col gap-2 w-[90vw] mx-auto text-justify">
      <p className="text-2xl font-bold my-2">About Us</p>
      <p>
        Welcome to Car Market, your premier online destination for all things
        automotive in Europe.{" "}
      </p>
      <p>
        At Car Market, we're passionate about connecting car buyers and sellers
        in a seamless and transparent marketplace, revolutionizing the way
        Europeans buy and sell vehicles. With a dedication to excellence and
        innovation, we have crafted a platform that offers unparalleled
        convenience and efficiency for both buyers and sellers alike.{" "}
      </p>
      <p>
        Whether you're in search of your dream car or looking to sell your
        current vehicle, Car Market provides the tools and resources to make the
        process smooth and hassle-free. Our extensive selection of vehicles
        spans across a wide range of makes, models, and price points, ensuring
        that every customer can find their perfect match. From luxury sedans to
        rugged SUVs, eco-friendly hybrids to powerful sports cars, we cater to
        every preference and budget.{" "}
      </p>
      <p>
        What sets Car Market apart is our commitment to transparency and
        trustworthiness. We prioritize the integrity of our marketplace,
        providing accurate vehicle listings and facilitating secure
        transactions. Our user-friendly interface and advanced search features
        empower buyers to find exactly what they're looking for, while our
        robust seller verification process gives peace of mind to those listing
        their vehicles.
      </p>
      <p>
        At Car Market, we're not just a platform – we're a community of car
        enthusiasts, dedicated to fostering a culture of passion and expertise
        in everything automotive. Whether you're a seasoned car aficionado or a
        first-time buyer, you'll find a welcoming and supportive environment
        here.{" "}
      </p>
      <p>
        Join us at Car Market and experience the future of car buying and
        selling in Europe. Let us help you find your next vehicle or connect you
        with the perfect buyer. Together, we're driving innovation and
        transforming the way Europeans navigate the world of automobiles.
      </p>
    </div>
  );
}
