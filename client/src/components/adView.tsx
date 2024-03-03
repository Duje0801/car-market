import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../store";
import { IAd } from "../interfaces/IAd";
import { useCreateAtToString } from "../hooks/useCreateAtToString";
import axios from "axios";

export function AdView() {
  const [adInfo, setAdInfo] = useState<IAd | null>(null);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const params = useParams();
  const navigate = useNavigate()

  const { data, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  useEffect(() => {
    if (isChecked) {
      fetchData();
    }
  }, [isChecked]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/ad/find/${params.id}`,
        {
          headers: {
            authorization: `Bearer ${data?.token}`,
          },
        }
      );
      setAdInfo(response.data.ad);
    } catch (error: any) {
      if (
        error?.response?.data?.status === "fail" &&
        typeof error?.response?.data?.message === `string`
      ) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong.");
      }
    }
  };

  const handleBtnClick = async (operation: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/v1/ad/${operation}/${params.id}`,
        {
          headers: {
            authorization: `Bearer ${data?.token}`,
          },
        }
      );
      setAdInfo(response.data.ad);
      if (operation === "delete") setError(response.data.message);
      else setMessage(response.data.message);
    } catch (error: any) {
      if (
        error?.response?.data?.status === "fail" &&
        typeof error?.response?.data?.message === `string`
      ) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Something went wrong.");
      }
    }
  };

  const handleEditClick = () => {
    navigate(`/editAd/${params.id}`)
  }

  if (error) return <div className="text-red-500">{error}</div>;
  else if (!isChecked) return <div>Loading...</div>;
  else if (adInfo && adInfo.user) {
    const createdAt = useCreateAtToString(adInfo.createdAt);
    return (
      <div className="border-black border-2 p-2 m-2">
        {" "}
        {error && <div>{error}</div>}
        {!adInfo.visible &&
        (data.username === `admin` || data.username === adInfo.username) ? (
          <div className="text-red-500">
            This ad is not visible to other users
          </div>
        ) : null}
        {!adInfo.active && data.username === `admin` ? (
          <div className="text-red-500">This ad is deactivated</div>
        ) : null}
        <div>
          <b>{adInfo.title}</b>
        </div>
        {data.username === adInfo.username ? (
          <div>
            <button
              className="btn btn-neutral"
              onClick={() => handleEditClick()}
            >
              Edit
            </button>
          </div>
        ) : null}
        {message && <div className="text-red-500">{message}</div>}
        <div>
          User: <span>{adInfo.user[0].username}</span>
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
        {adInfo.active && data.username === adInfo.user[0].username ? (
          <div>
            <button
              className="btn btn-error"
              onClick={() => handleBtnClick(`hide`)}
            >
              Change visibility
            </button>
          </div>
        ) : null}
        {data.username === adInfo.user[0].username ||
        data.username === "admin" ? (
          <div>
            <button
              className="btn btn-error"
              onClick={() => handleBtnClick(`deactivate`)}
            >
              {adInfo.active ? `Deactivate` : `Activate`}
            </button>
          </div>
        ) : null}
        {data.username === "admin" ? (
          <div>
            <button
              className="btn btn-error"
              onClick={() => handleBtnClick(`delete`)}
            >
              Delete Ad
            </button>
          </div>
        ) : null}
      </div>
    );
  }
}
