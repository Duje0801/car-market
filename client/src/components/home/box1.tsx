import { useNavigate } from "react-router-dom";
import box1Image from "../../assets/images/home/box1-image.png";

export function Box1() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/ads/firstRegistrationFrom=${new Date().getFullYear() - 1}`);
  };

  return (
    <div className="card card-side flex flex-row w-[90vw] h-1/2 mx-auto max-h-[168px] bg-base-200 shadow-xl rounded-lg md:w-[70vw] lg:w-full">
      <figure className="w-2/5 xxl:w-1/3">
        <img className="h-full" src={box1Image} alt="car-image" />
      </figure>
      <div className="card-body p-4 my-auto w-3/5 xxl:w-2/3">
        <h2 className="card-title text-md lg:text-lg xxl:text-2xl">
          Drive Like New! Low Mileage Cars Under 1 Year Old!
        </h2>
        <div className="card-actions justify-end">
          <button
            onClick={handleClick}
            className="btn text-xs bg-black text-white lg:text-sm xxl:text-xl"
          >
            Check
          </button>
        </div>
      </div>
    </div>
  );
}
