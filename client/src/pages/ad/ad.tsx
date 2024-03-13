import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../../store";
import { AdOwnerInfo } from "../../components/ad/adOwnerInfo";
import { AdMessages } from "../../components/ad/adMessages";
import { AdInfoBox } from "../../components/ad/adInfoBox";
import { AdModals } from "../../components/ad/adModals";
import { WaitingDots } from "../../components/elements/waitingDots";
import { MessageError } from "../../components/elements/messages/messageError";
import { AdDropdowns } from "../../components/ad/adDropdowns";
import { addAdData, removeAdData } from "../../store/slices/ad";
import { catchErrors } from "../../utilis/catchErrors";
import axios from "axios";

export function AdView() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loggedProfileData, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
  );

  const { adData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.ad
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
            authorization: `Bearer ${loggedProfileData?.token}`,
          },
        }
      );
      dispatch(addAdData(response.data.ad));
    } catch (error) {
      catchErrors(error, setError);
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
            authorization: `Bearer ${loggedProfileData?.token}`,
          },
        }
      );
      if (operation === "delete") {
        //Deleting all images associated with ad
        const deleteImageMessage: string = await deleteImage();
        navigate(`/redirect/ad/deleteAd-${deleteImageMessage}`);
      }
      if (
        operation === "deactivate" &&
        loggedProfileData.username !== `admin`
      ) {
        navigate(`/redirect/ad/deactivate`);
      } else {
        setMessage(response.data.message);
        dispatch(removeAdData())
        dispatch(addAdData(response.data.ad))
      }
    } catch (error) {
      catchErrors(error, setError);
    }
    setIsLoaded(true);
  };

  const deleteImage = async () => {
    let imagesDeleteList: string[] = [];

    //Adding all ad`s images
    adData?.images?.forEach((img) => {
      imagesDeleteList.push(img.publicID);
    });

    //Creating fetch for all images
    const promises = imagesDeleteList.map((publicID) =>
      axios.delete(`http://localhost:4000/api/v1/ad/deleteImage/${publicID}`, {
        headers: {
          authorization: `Bearer ${loggedProfileData?.token}`,
        },
      })
    );

    try {
      //Deleting images
      await Promise.all(promises);
      return "allDeleted";
    } catch (error) {
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
  } else if (!adData && isChecked && isLoaded) {
    {
      /* Problems with loading ad info */
    }
    return (
      <main className="mx-auto w-[90vw]">
        <MessageError message={error} />
      </main>
    );
  } else if (adData && adData.user && isChecked && isLoaded) {
    return (
      <>
        <main className="pb-2">
          {/* Profile top messages */}
          <AdMessages error={error} adData={adData} message={message} />

          {/*Dropdown menu*/}
          {loggedProfileData.username === adData.username ||
          loggedProfileData.username === `admin` ? (
            <AdDropdowns handleOpenModal={handleOpenModal} />
          ) : null}

          {/* Ad display */}
          <div className="card bg-base-200 p-4 gap-2 shadow-xl mx-auto mt-2 mb-4 rounded-lg w-[90vw]">
            {/* Ad Info */}
            <AdInfoBox />
          </div>
          {/* Ad owner data */}
          <AdOwnerInfo />
        </main>
        {/* Ad modals */}
        <AdModals handleBtnClick={handleBtnClick} />
      </>
    );
  }
}
