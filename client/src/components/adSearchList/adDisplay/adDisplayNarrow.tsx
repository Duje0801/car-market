import { MdNewReleases } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { FaRoad } from "react-icons/fa";
import { FaFlag } from "react-icons/fa";
import { ImPriceTags } from "react-icons/im";
import { IAd } from "../../../interfaces/IAd";

interface Props {
  ad: IAd;
  handleSeeMoreClick: (id:string) => void
}

export function AdDisplayNarrow({ ad, handleSeeMoreClick }: Props) {

  return (
    <div className="lg:hidden">
      {/* Ad image */}
      <figure className="h-[25vh]">
        <img
          src={ad.images[0].imageUrl}
          alt="AdImage"
          className=" w-full object-cover rounded-lg transform transition duration-500 hover:scale-110 hover:cursor-pointer"
        />
      </figure>

      {/* Ad info */}
      <div className="card-body items-center text-center px-0 py-2 gap-1">
        {/* Ad title */}
        <h2 className="card-title">{ad.title}</h2>
        {/* Ad data */}
        {/* 1st data row */}
        <div className="flex gap-10">
          <p className="ml-auto flex gap-2">
            <MdNewReleases className="m-auto" /> {ad.condition}
          </p>
          <p className="ml-auto flex gap-2">
            <FaRoad className="m-auto" /> {ad.mileage} km
          </p>
        </div>
        {/* 2nd data row */}
        <div className="flex gap-10">
          <p className="ml-auto flex gap-2">
            <FaCalendarAlt className="m-auto" />{" "}
            {ad.firstRegistration === 1999
              ? "<2000."
              : ad.firstRegistration === 0
              ? "-"
              : `${ad.firstRegistration}.`}
          </p>
          <p className="ml-auto flex gap-2 text-md xl:text-md">
            <FaFlag className="m-auto" /> {ad.country}
          </p>
        </div>
      </div>
      {/* Price and button */}
      <div className="card-actions flex flex-col gap-1">
        {/* Price */}
        <p className="flex text-xl gap-2 my-auto ml-auto">
          <ImPriceTags className="my-auto" />
          <b>{ad.price} €</b>
        </p>
        {/* See more button */}
        <button
          onClick={() => handleSeeMoreClick(ad.id)}
          className="btn bg-black text-white ml-auto"
        >
          See details
        </button>
      </div>
    </div>
  );
}
