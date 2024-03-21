import { useIsAdOld } from "../../hooks/useIsAdOld";
import { MdNewReleases } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { FaRoad } from "react-icons/fa";
import { FaFlag } from "react-icons/fa";
import { IAd } from "../../interfaces/IAd";

interface Props {
  ad: IAd;
  handleSeeMoreClick: (id: string) => void;
}

export function AdDisplayWide({ ad, handleSeeMoreClick }: Props) {
  const isOld = useIsAdOld(ad.createdAt);
  return (
    <div
      className={`hidden card card-side bg-base-100 shadow-xl rounded-lg h-[22.5vh] lg:h-[27.5vh] lg:flex ${
        isOld || !ad.visible || !ad.active ? `rounded-tl-none` : ``
      }`}
    >
      {/* Ad image - left */}
      <figure className="w-2/5">
        <img
          src={ad.images[0].imageUrl}
          alt="AdImage"
          className={`h-full object-cover ${
            isOld || !ad.visible || !ad.active ? `rounded-tr-lg` : ``
          }`}
        />
      </figure>

      {/* Ad info - right */}
      <div className="card-body flex justify-center p-4 w-3/5">
        {/* Ad title */}
        <h2 className="card-title mx-auto xl:text-3xl">{ad.title}</h2>

        {/* Ad data */}
        <div className="card-body items-center text-center text-md p-0 gap-1 xl:gap-4">
          {/* 1st data row */}
          <div className="flex gap-4 mt-auto xl:gap-6">
            <p className="ml-auto flex gap-2 xl:text-2xl xl:gap-4">
              <MdNewReleases className="m-auto" /> {ad.condition}
            </p>
            <p className="ml-auto flex gap-2 xl:text-2xl xl:gap-4">
              <FaRoad className="m-auto" /> {ad.mileage} km
            </p>
          </div>
          {/* 2nd data row */}
          <div className="flex gap-4 mb-auto xl:gap-6">
            <p className="ml-auto flex gap-2 xl:text-2xl xl:gap-4">
              <FaCalendarAlt className="m-auto" />{" "}
              {ad.firstRegistration === 1999 ? "<2000" : ad.firstRegistration}.
            </p>
            <p className="ml-auto flex gap-2 xl:text-2xl xl:gap-4">
              <FaFlag className="m-auto" /> {ad.country}
            </p>
          </div>
        </div>
        {/* Price and button */}
        <div className="card-actions flex flex-col gap-0 xl:gap-4">
          {/* Price */}
          <div className="flex  ml-auto">
            <p className="flex text-xl gap-2 xl:text-3xl">
              <b>{ad.price} €</b>
            </p>
          </div>

          {/* Details button */}
          <button
            onClick={() => handleSeeMoreClick(ad.id)}
            className="btn bg-black text-white ml-auto xl:text-2xl"
          >
            See details
          </button>
        </div>
      </div>
    </div>
  );
}
