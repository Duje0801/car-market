import { MessageError } from "../elements/messages/messageError";
import { IProfile } from "../../interfaces/IProfile";
import { MdNewReleases } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { FaRoad } from "react-icons/fa";
import { ImPriceTags } from "react-icons/im";

interface Props {
  profileData: IProfile;
  handleSeeMoreClick: (id: string) => void;
}

export function ProfileAds({ profileData, handleSeeMoreClick }: Props) {
  return (
    <div className="card bg-base-200 p-4 gap-2 shadow-xl mx-auto my-8 rounded-lg w-[90vw]">
      {/* Ads (mapped) */}
      <div className="card-body p-4">
        <p className="text-center text-lg font-bold mb-4">
          {profileData.username}'s ads:
        </p>
        <div>
          {profileData.ads &&
            profileData.ads.map((ad, i) => {
              return (
                <div
                  key={i}
                  className="card w-fit bg-base-100 shadow-xl p-2 mb-4"
                >
                  {" "}
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
                  {/* Visibility message */}
                  {!ad.visible && (
                    <div className="mt-2 mx-auto w-full">
                      <MessageError
                        message={"This ad is hidden from other users"}
                      />
                    </div>
                  )}
                  {/* Deactivated message */}
                  {!ad.active && (
                    <div className="mt-2 mx-auto w-full">
                      <MessageError message={"This ad is deactivated"} />
                    </div>
                  )}
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
        </div>
      </div>
    </div>
  );
}
