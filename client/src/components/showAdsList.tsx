import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IAd } from "../interfaces/IAd";
import { useCreateAtToString } from "../hooks/useCreateAtToString";
import axios from "axios";

export function ShowAdsList() {
  const [adInfo, setAdInfo] = useState<IAd[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const params = useParams();

  const fetchData = async (id: string) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/ad/search/?${id}`
      );
      setAdInfo(response.data.ads);
    } catch (error: any) {
      if (
        error?.response?.data?.status === "fail" &&
        typeof error?.response?.data?.message === `string`
      ) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong, please try again later.");
      }
    }
    setIsLoading(false);
  };

  //Automatically fetch ad list data on page load
  useEffect(() => {
    if (params.id) {
      fetchData(params.id);
    }
  }, []);

  if (!params.id) return <div>Can't find any matching ad</div>;
  else if (params.id && isLoading) return <div>Loading...</div>;
  else if (adInfo.length === 0 && !isLoading)
    return <div>Can't find any matching ad</div>;
  else if (adInfo) {
    return (
      <div className="flex flex-col gap-2">
        {error && <p className="text-red-500">{error}</p>}
        {adInfo.map((ad, i) => {
          const createdAt = useCreateAtToString(ad.createdAt);
          return (
            <div key={i} className="border-black border-2">
              <div>
                Title: <b>{ad.title}</b>
              </div>
              <img
                src={ad.images[0].imageUrl}
                width={200}
                height={200}
                alt="adImage"
              />
              <div>Active since: {createdAt}</div>
              <div>Price: {ad.price}€</div>
              <button className="btn">See more</button>
            </div>
          );
        })}
      </div>
    );
  }
}
