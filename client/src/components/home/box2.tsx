import { useNavigate } from "react-router-dom";
import box2Image from "../../assets/images/home/box2-image.jpg";

export function Box2() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/ads/priceTo=5000`);
  };

  return (
    <div className="card card-side flex flex-row w-[90vw] mx-auto bg-base-200 shadow-xl rounded-lg md:w-[70vw] lg:w-[37.5vw] lg:h-1/2">
      <figure className="w-2/5">
        <img className="h-full" src={box2Image} alt="car-image" />
      </figure>
      <div className="card-body my-auto p-4 w-3/5">
        <h2 className="card-title text-sm md:text-lg">
          Check out selection of used cars priced under 5000 euros!
        </h2>
        <div className="card-actions justify-end">
          <button
            onClick={handleClick}
            className="btn text-xs bg-black text-white lg:text-sm"
          >
            Check
          </button>
        </div>
      </div>
    </div>
  );
}
