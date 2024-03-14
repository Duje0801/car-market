import { useNavigate } from "react-router-dom";
import { MessageWarning } from "../elements/messages/messageWarning";
import { MessageError } from "../elements/messages/messageError";
import { useIsAdOld } from "../../hooks/useIsAdOld";
import { MdNewReleases } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { FaRoad } from "react-icons/fa";
import { ImPriceTags } from "react-icons/im";
import { IAd } from "../../interfaces/IAd";

interface Props {
  adInfo: IAd[];
}

export function AdSL({ adInfo }: Props) {
  const navigate = useNavigate();

  //Redirect to ad (after clicking `See more` button)
  const handleSeeMoreClick = (id: string) => {
    navigate(`/ad/${id}`);
  };

  return (
    <>
      {" "}
      {adInfo.map((ad, i) => {
        const adDate = useIsAdOld(ad.createdAt);

        return (
          <div key={i} className="card w-full bg-base-100 shadow-xl p-2 mb-4">
            {/* Old ad */}
            {adDate && (
              <div className="mt-2 mx-auto w-full">
                <MessageWarning message={"This ad is older than 180 days"} />
              </div>
            )}
            {/* Visibility message */}
            {!ad.visible && (
              <div className="mt-2 mx-auto w-full">
                <MessageError message={"This ad is hidden from other users"} />
              </div>
            )}
            {/* Deactivated message */}
            {!ad.active && (
              <div className="mt-2 mx-auto w-full">
                <MessageError message={"This ad is deactivated"} />
              </div>
            )}
            {/* Ad image */}
            <figure className="p-2 border-b-black border-b-2">
              <img
                src={ad.images[0].imageUrl}
                alt="AdImage"
                width={250}
                height={250}
                className="rounded-xl"
              />
            </figure>
            {/* Ad description */}
            <div className="card-body items-center text-center p-2 gap-1">
              <h2 className="card-title">{ad.title}</h2>
              <div className="flex gap-10">
                <p className="ml-auto flex gap-2">
                  <MdNewReleases className="m-auto" /> {ad.condition}
                </p>
                <p className="ml-auto flex gap-2">
                  <FaRoad className="m-auto" /> {ad.mileage} km
                </p>
              </div>
              <div className="flex gap-10">
                <p className="ml-auto flex gap-2">
                  <FaCalendarAlt className="m-auto" />{" "}
                  {ad.firstRegistration === 1999
                    ? "<2000"
                    : ad.firstRegistration}
                  .
                </p>
                <p className="ml-auto flex gap-2">
                  <ImPriceTags className="m-auto" /> {ad.price} €
                </p>
              </div>
              {/* See more button */}
              <div className="card-actions w-full">
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
      })}
    </>
  );
}
