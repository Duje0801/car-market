import { useNavigate } from "react-router-dom";
import box1Image from "../../assets/images/home/box1-image.png";

export function Box1() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/ads/firstRegistrationFrom=${new Date().getFullYear() - 1}`);
  };

  return (
    <div className="card card-side flex flex-row w-[90vw] mx-auto bg-base-200 shadow-xl rounded-lg md:w-[70vw] lg:w-[37.5vw] lg:h-1/2">
      <figure className="w-2/5">
        <img className="h-full" src={box1Image} alt="car-image" />
      </figure>
      <div className="card-body p-4 my-auto w-3/5">
        <h2 className="card-title text-sm md:text-lg">
          Drive Like New! Low Mileage Cars Under 1 Year Old!
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
