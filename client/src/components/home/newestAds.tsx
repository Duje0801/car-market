import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WaitingDots } from "../elements/waitingDots";
import { MessageError } from "../elements/messages/messageError";
import { catchErrors } from "../../utilis/catchErrors";
import { IAd } from "../../interfaces/IAd";
import axios from "axios";

export function NewestAds() {
  const [newestAds, setNewestAds] = useState<IAd[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  //Fetch data function
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/ad/newest/?sort=-createdAt`
      );
      setNewestAds(response.data.ads);
      setIsLoading(false);
    } catch (error) {
      catchErrors(error, setError);
      setIsLoading(false);
    }
  };

  //Redirect to ad page
  const handleClickAd = (id: string) => {
    navigate(`/ad/${id}`);
  };

  if (isLoading) {
    {
      /* Loading ads data */
    }
    return (
      <div>
        <WaitingDots size={"md"} marginTop={8} />{" "}
      </div>
    );
  } else if (error && !isLoading) {
    {
      /* Problems with loading ads info */
    }
    return (
      <div className="mx-auto mb-2 mt-6 w-full">
        <MessageError message={error} />
      </div>
    );
  } else {
    {
      /* 5 newest ads */
    }
    return (
      <div className="flex flex-col mt-6 p-4 bg-base-200 shadow-xl gap-2 rounded-lg lg:mt-8">
        {/* Title */}
        <p className="text-xl xl:text-2xl">
          <b>Newest ads</b>
        </p>
        {/* Ad images mapped */}
        <div className="carousel flex flex-col w-full gap-2 lg:flex-row lg:max-h-[25vh] lg:justify-between lg:rounded-lg lg:gap-0">
          {newestAds.map((ad, i) => {
            return (
              <figure
                onClick={() => handleClickAd(ad.id)}
                key={i}
                className="carousel-item relative group w-full max-h-[30vh] overflow-hidden hover:cursor-pointer lg:w-[19.5%]"
              >
                {/* Image */}
                <img
                  src={ad.images[0].imageUrl}
                  className="w-full object-cover transform transition duration-500 hover:scale-110"
                  alt="adImage"
                />
                {/* Bottom box */}
                <div className="absolute w-full p-2 opacity-75 pointer-events-none bg-black text-white text-md text-right bottom-0 group-hover:opacity-75 lg:opacity-0 xxl:text-lg">
                  <p>{ad.title}</p>
                  <p>{ad.price}€</p>
                </div>
              </figure>
            );
          })}
        </div>
      </div>
    );
  }
}
