import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../../store";
import { WaitingDots } from "../../components/elements/waitingDots";
import { MessageError } from "../../components/elements/messages/messageError";
import { catchErrors } from "../../utilis/catchErrors";
import { MdNewReleases } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { FaRoad } from "react-icons/fa";
import { ImPriceTags } from "react-icons/im";
import { IAd } from "../../interfaces/IAd";
import axios from "axios";

export function AdsList() {
  const [adInfo, setAdInfo] = useState<IAd[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const params = useParams();
  const navigate = useNavigate();

  const { loggedProfileData, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
  );

  //Automatically fetches ad list data on page load
  useEffect(() => {
    if (params.id && isChecked) {
      fetchData();
    }
  }, [isChecked]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/ad/search/?${params.id}`,
        {
          headers: {
            authorization: `Bearer ${loggedProfileData?.token}`,
          },
        }
      );
      setAdInfo(response.data.ads);
    } catch (error) {
      catchErrors(error, setError);
    }
    setIsLoaded(true);
  };

  //Redirect to ad (after clicking `See more` button)
  const handleSeeMoreClick = (id: string) => {
    navigate(`/ad/${id}`);
  };

  if (!isChecked || !isLoaded) {
    {
      /* Loading ad data */
    }
    return (
      <main>
        <WaitingDots size={"md"} marginTop={8} />{" "}
      </main>
    );
  } else if (isChecked && isLoaded && error) {
    {
      /* Problems with loading ad info */
    }
    return (
      <main className="mx-auto w-[90vw]">
        <MessageError message={error} />
      </main>
    );
  } else if (adInfo.length === 0 && isChecked && isLoaded) {
    {
      /* No matching ads */
    }
    return (
      <main className="mx-auto w-[90vw]">
        <MessageError message={"Can't find any matching ad"} />
      </main>
    );
  } else if (adInfo) {
    return (
      <main className="p-2">
        <div className="card bg-base-200 p-4 gap-2 shadow-xl mx-auto my-8 rounded-lg w-[90vw]">
          {/* Ads (mapped) */}
          <p className="text-center text-lg font-bold">Ads List:</p>
          <div className="card-body p-4">
            <div>
              {adInfo &&
                adInfo.map((ad, i) => {
                  return (
                    <div
                      key={i}
                      className="card w-fit bg-base-100 shadow-xl p-2 mb-4"
                    >
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
            </div>
          </div>
        </div>
      </main>
    );
  }
}
