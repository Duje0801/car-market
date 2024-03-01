import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IAd } from "../interfaces/IAd";
import { useCreateAtToString } from "../hooks/useCreateAtToString";
import axios from "axios";

export function AdView() {
  const [adInfo, setAdInfo] = useState<IAd | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const params = useParams();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/ad/find/${params.id}`
      );
      setAdInfo(response.data.ad);
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

  const handleUsernameClick = () => {
    if (adInfo && adInfo.user) {
      navigate(`/profile/${adInfo.user[0].username}`);
    } else return;
  };

  useEffect(() => {
    if (params.id) {
      fetchData();
    }
  }, []);

  if (!params.id && isLoading) return <div>No ad id</div>;
  else if (params.id && isLoading) return <div>Loading...</div>;
  else if ((!adInfo && !isLoading) || (adInfo && !adInfo.user))
    return <div>Can't find this ad</div>;
  else if (adInfo && adInfo.user) {
    if (!adInfo.user[0].active)
      return <div>The user who posted this ad has been deactivated</div>;

    const createdAt = useCreateAtToString(adInfo.createdAt);
    return (
      <div className="border-black border-2 p-2 m-2">
        {" "}
        {error && <div className="text-red-500">{error}</div>}
        <div>
          <b>{adInfo.title}</b>
        </div>
        <div>
          User:{" "}
          <span onClick={handleUsernameClick}>{adInfo.user[0].username}</span>
        </div>
        <div>Active since: {createdAt}</div>
        <img
          src={adInfo.images[0].imageUrl}
          width={300}
          height={300}
          alt="adImage"
        />
        <div>Condition: {adInfo.condition}</div>
        <div>Country: {adInfo.country}</div>
        <div>Make: {adInfo.make}</div>
        <div>Model: {adInfo.model}</div>
        <div>First registration: {adInfo.firstRegistration}</div>
        <div>Mileage: {adInfo.mileage} km</div>
        <div>Fuel: {adInfo.fuel}</div>
        <div>Power: {adInfo.power} kW</div>
        <div>Price: {adInfo.price}€</div>
        <div>Description: {adInfo.description}</div>
      </div>
    );
  }
}
