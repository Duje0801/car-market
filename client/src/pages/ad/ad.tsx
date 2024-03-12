import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../../store";
import { AdActivity } from "../../components/ad/adActivity";
import { AdOwnerInfo } from "../../components/ad/adOwnerInfo";
import { AdInfoBox } from "../../components/ad/adInfoBox";
import { AdModals } from "../../components/ad/adModals";
import { WaitingDots } from "../../components/elements/waitingDots";
import { MessageError } from "../../components/elements/messages/messageError";
import { MessageSuccessfully } from "../../components/elements/messages/messageSuccessfully";
import { AdDropdowns } from "../../components/ad/adDropdowns";
import { IAd } from "../../interfaces/IAd";
import axios from "axios";

export function AdView() {
  const [adInfo, setAdInfo] = useState<IAd | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const params = useParams();
  const navigate = useNavigate();

  const { data, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  useEffect(() => {
    if (isChecked) {
      fetchData();
    }
  }, [isChecked]);

  //Fetch function
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
    setIsLoaded(true);
  };

  //Open modals
  const handleOpenModal = (id: string) => {
    const modal = document.getElementById(
      `${id}Modal`
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  //Function for hiding, deactivating and deleting ad
  const handleBtnClick = async (operation: string) => {
    setIsLoaded(false);
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/v1/ad/${operation}/${params.id}`,
        {
          headers: {
            authorization: `Bearer ${data?.token}`,
          },
        }
      );
      if (operation === "delete") {
        //Deleting all images associated with ad
        const deleteImageMessage: string = await deleteImage();
        navigate(`/redirect/ad/deleteAd-${deleteImageMessage}`);
      }
      if (operation === "deactivate" && data.username !== `admin`) {
        navigate(`/redirect/ad/deactivate`);
      } else {
        setMessage(response.data.message);
        setAdInfo(response.data.ad);
      }
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
    setIsLoaded(true);
  };

  const deleteImage = async () => {
    let imagesDeleteList: string[] = [];

    //Adding all ad`s images
    adInfo?.images?.forEach((img) => {
      imagesDeleteList.push(img.publicID);
    });

    //Creating fetch for all images
    const promises = imagesDeleteList.map((publicID) =>
      axios.delete(`http://localhost:4000/api/v1/ad/deleteImage/${publicID}`, {
        headers: {
          authorization: `Bearer ${data?.token}`,
        },
      })
    );

    try {
      //Deleting images
      await Promise.all(promises);
      return "allDeleted";
    } catch (error: any) {
      return "notAllDeleted";
    }
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
  } else if (!adInfo && isChecked && isLoaded) {
    {
      /* Problems with loading ad info */
    }
    return (
      <main className="mx-auto w-[90vw]">
        <MessageError message={error} />
      </main>
    );
  } else if (adInfo && adInfo.user && isLoaded) {
    return (
      <>
        <main className="p-2">
          {/*Ad activity (hidden/deactivated info)*/}
          <AdActivity adInfo={adInfo} />
          {/* Ad messages (errors) */}
          {error && <MessageError message={error} />}
          {/*Dropdown menu*/}
          {data.username === adInfo.username || data.username === `admin` ? (
            <AdDropdowns adInfo={adInfo} handleOpenModal={handleOpenModal} />
          ) : null}
          {/* Ad display */}
          <div className="card bg-base-200 p-4 gap-2 shadow-xl mx-auto mt-2 mb-4 rounded-lg w-[90vw]">
            {/* Info, if succesfully changed something about ad (activity...) */}
            {message && <MessageSuccessfully message={message} />}
            {/* Ad Info */}
            <AdInfoBox adInfo={adInfo} />
          </div>
          {/* Ad owner data */}
          <AdOwnerInfo adInfo={adInfo} />
        </main>
        {/* Ad modals */}
        <AdModals
          adInfo={adInfo}
          setAdInfo={setAdInfo}
          handleBtnClick={handleBtnClick}
        />
      </>
    );
  }
}
