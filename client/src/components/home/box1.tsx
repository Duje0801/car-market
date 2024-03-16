import lowCostCarImage from "../../assets/images/low-cost-car-image.png";

export function Box1() {
  return (
    <div className="card card-side w-[90vw] mx-auto bg-base-200 shadow-xl rounded-lg">
      <figure>
        <img className="h-full" src={lowCostCarImage} alt="car-image" />
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title">Affordable Used Cars Under 5000 Euros!</h2>
        <p>
          Looking for a reliable ride without breaking the bank? Check out our
          selection of quality used cars priced under 5000 euros!{" "}
        </p>
        <div className="card-actions justify-end">
          <button className="btn bg-black text-white">Check</button>
        </div>
      </div>
    </div>
  );
}
