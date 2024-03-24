import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addAdData, removeAdData } from "../../store/slices/ad";
import { store } from "../../store";
import { CarouselImgProvider } from "../../context/carouselImgContext";
import { AdMessages } from "../../components/ad/messages/adMessages";
import { AdInfoBox } from "../../components/ad/info/adInfoBox";
import { AdOperationModals } from "../../components/ad/modals/adOperationModals";
import { WaitingDots } from "../../components/elements/waitingDots";
import { MessageError } from "../../components/elements/messages/messageError";
import { AdDropdowns } from "../../components/ad/dropdowns/adDropdowns";
import { AdAdditionalInfo } from "../../components/ad/info/adAdditionalInfo";
import { catchErrors } from "../../utilis/catchErrors";
import { deleteImage } from "../../utilis/deleteImage";
import axios from "axios";

export function Ad() {
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
      fetchAdData();
    }
  }, [isChecked]);

  //Fetch ad data function
  const fetchAdData = async () => {
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

  //Function for hiding, deactivating and deleting ad
  const handleModalClick = async (operation: string) => {
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
        const deleteImageMessage: string = await deleteImage(
          adData,
          loggedProfileData
        );
        navigate(`/redirect/ad/deleteAd-${deleteImageMessage}`);
      }
      if (
        operation === "deactivate" &&
        loggedProfileData.username !== `admin`
      ) {
        navigate(`/redirect/ad/deactivate`);
      } else {
        //if ad is hidden/unhidden or ad is deactivated by admin
        setMessage(response.data.message);
        dispatch(removeAdData());
        dispatch(addAdData(response.data.ad));
      }
    } catch (error) {
      catchErrors(error, setError);
    }
    setIsLoaded(true);
  };

  if (!isChecked || !isLoaded) {
    {
      /* Loading ad data */
    }
    return (
      <div>
        <WaitingDots size={"md"} marginTop={8} />{" "}
      </div>
    );
  } else if (!adData && isChecked && isLoaded) {
    {
      /* Problems with loading ad info */
    }
    return (
      <div className="mx-auto w-[90vw]">
        <MessageError message={error} />
      </div>
    );
  } else if (adData && adData.user && isChecked && isLoaded) {
    return (
      <CarouselImgProvider>
        <div className="mx-auto md:w-2/3">
          {/* Profile top messages */}
          <AdMessages
            loggedProfileData={loggedProfileData}
            adData={adData}
            error={error}
            message={message}
          />

          {/*Dropdown menu*/}
          {loggedProfileData.username === adData.username ||
          loggedProfileData.username === `admin` ? (
            <AdDropdowns
              loggedProfileData={loggedProfileData}
              adData={adData}
            />
          ) : null}

          {/* Ad display */}
          <AdInfoBox adData={adData} />

          {/* Ad data and seller data */}
          <AdAdditionalInfo adData={adData} />
        </div>
        {/* Ad modals */}
        <AdOperationModals
          adData={adData}
          handleModalClick={handleModalClick}
        />
      </CarouselImgProvider>
    );
  }
}
