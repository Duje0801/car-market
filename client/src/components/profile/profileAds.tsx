import { Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";
import { store } from "../../store";
import { MessageError } from "../elements/messages/messageError";
import { MessageWarning } from "../elements/messages/messageWarning";
import { Pagination } from "../elements/pagination";
import { useIsAdOld } from "../../hooks/useIsAdOld";
import { MdNewReleases } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { FaRoad } from "react-icons/fa";
import { ImPriceTags } from "react-icons/im";

interface Props {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  adInfoTotalNo: number;
  handleSeeMoreClick: (id: string) => void;
}

export function ProfileAds({
  page,
  setPage,
  adInfoTotalNo,
  handleSeeMoreClick,
}: Props) {
  const { profileData, profileAds } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  return (
    <div className="card bg-base-200 gap-2 pt-2 pb-4 shadow-xl mx-auto mb-2 rounded-lg w-[90vw]">
      {/* Ads (mapped) */}
      <div className="card-body p-2">
        <p className="text-center text-lg font-bold">
          {profileData?.username}'s ads:
        </p>
        {/* Pagination */}
        <Pagination
          totalLength={adInfoTotalNo}
          itemsPerPage={5}
          page={page}
          setPage={setPage}
        />
        {profileAds &&
          profileAds.map((ad, i) => {
            const adDate = useIsAdOld(ad.createdAt);

            return (
              <div
                key={i}
                className="card w-full bg-base-100 shadow-xl p-2 mb-4"
              >
                {/* Old ad */}
                {adDate && (
                  <div className="mt-2 mx-auto w-full">
                    <MessageWarning
                      message={"This ad is older than 180 days"}
                    />
                  </div>
                )}{" "}
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
      {/* Pagination */}
      <Pagination
        totalLength={adInfoTotalNo}
        itemsPerPage={5}
        page={page}
        setPage={setPage}
      />
    </div>
  );
}
