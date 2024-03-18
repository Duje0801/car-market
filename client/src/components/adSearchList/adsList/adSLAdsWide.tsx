import { MdNewReleases } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { FaRoad } from "react-icons/fa";
import { FaFlag } from "react-icons/fa";
import { IAd } from "../../../interfaces/IAd";

interface Props {
  ad: IAd;
  handleSeeMoreClick: (id: string) => void;
}

export function AdSLAdsWide({ ad, handleSeeMoreClick }: Props) {
  return (
    <div className="hidden card card-side bg-base-100 shadow-xl rounded-lg h-[30vh] lg:flex">
      {/* Ad image - left */}
      <figure className="w-2/5">
        <img
          src={ad.images[0].imageUrl}
          alt="AdImage"
          className="h-full w-full max-h-[25vw]"
        />
      </figure>

      {/* Ad info - right */}
      <div className="card-body flex justify-center p-4 w-3/5">
        {/* Ad title */}
        <h2 className="card-title mx-auto">{ad.title}</h2>

        {/* Ad data */}
        <div className="card-body items-center text-center text-md p-0 gap-1">
          {/* 1st data row */}
          <div className="flex gap-4">
            <p className="ml-auto flex gap-2">
              <MdNewReleases className="m-auto" /> {ad.condition}
            </p>
            <p className="ml-auto flex gap-2">
              <FaRoad className="m-auto" /> {ad.mileage} km
            </p>
          </div>
          {/* 2nd data row */}
          <div className="flex gap-4">
            <p className="ml-auto flex gap-2">
              <FaCalendarAlt className="m-auto" />{" "}
              {ad.firstRegistration === 1999 ? "<2000" : ad.firstRegistration}.
            </p>
            <p className="ml-auto flex gap-2">
              <FaFlag className="m-auto" /> {ad.country}
            </p>
          </div>
        </div>
        {/* Price and button */}
        <div className="card-actions flex flex-col gap-0">
          {/* Price */}
          <div className="flex  ml-auto">
            <p className="flex text-xl gap-2">{ad.price} €</p>
          </div>

          {/* Details button */}
          <button
            onClick={() => handleSeeMoreClick(ad.id)}
            className="btn bg-black text-white ml-auto"
          >
            See details
          </button>
        </div>
      </div>
    </div>
  );
}
