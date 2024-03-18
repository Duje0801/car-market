import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../../store";
import { AdSL } from "../../components/adSearchList/adSL";
import { AdSLModal } from "../../components/adSearchList/adSLModal";
import { AdSLFilter } from "../../components/adSearchList/adSLFilter";
import { AdSLDropdowns } from "../../components/adSearchList/dropdowns/adSLDropdowns";
import { Pagination } from "../../components/elements/pagination";
import { WaitingDots } from "../../components/elements/waitingDots";
import { MessageError } from "../../components/elements/messages/messageError";
import { MessageWarning } from "../../components/elements/messages/messageWarning";
import { catchErrors } from "../../utilis/catchErrors";
import { IAd } from "../../interfaces/IAd";
import axios from "axios";

export function AdsList() {
  const [adInfo, setAdInfo] = useState<IAd[]>([]);
  const [adInfoTotalNo, setAdInfoTotalNo] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [sort, setSort] = useState<string>("-createdAt");

  const params = useParams();

  const { loggedProfileData, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
  );

  //Automatically fetches ad list data on page load and page change
  useEffect(() => {
    if (params.id && isChecked) {
      fetchData();
    }
  }, [isChecked, page, sort]);

  //Ads fetching function
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/ad/search/?sort=${sort}&page=${
          (page - 1) * 5
        }&${params.id}`,
        {
          headers: {
            authorization: `Bearer ${loggedProfileData?.token}`,
          },
        }
      );
      setAdInfo(response.data.ads);
      setAdInfoTotalNo(response.data.adsNo);
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
  } else if (isChecked && isLoaded && error) {
    {
      /* Problems with loading ad info */
    }
    return (
      <div className="mx-auto w-[90vw]">
        <MessageError message={error} />
      </div>
    );
  } else if (adInfo.length === 0 && isChecked && isLoaded) {
    {
      /* No matching ads */
    }
    return (
      <div className="mx-auto w-[90vw]">
        <MessageWarning message={"Can't find any matching ad"} />
      </div>
    );
  } else if (adInfo) {
    return (
      <div className="flex justify-center w-full">
        {/* Ads filter - left, if screen is wider than 768px */}
        <AdSLFilter />

        {/* Ads column */}
        <div className="md:w-2/3">
          {/* Ads dropdowns */}
          <AdSLDropdowns
            adInfoTotalNo={adInfoTotalNo}
            setSort={setSort}
            setPage={setPage}
          />

          {/* Ads  */}
          <div className="card bg-base-200 gap-2 py-4 shadow-xl mx-auto rounded-lg w-[90vw] md:w-5/6 md:ml-4 md:py-2">
            {/* Pagination */}
            <Pagination
              totalLength={adInfoTotalNo}
              itemsPerPage={5}
              page={page}
              setPage={setPage}
            />

            {/*Ads list (mapped)*/}
            <div className="card-body p-2 md:gap-6 md:py-0">
              <AdSL adInfo={adInfo} />
            </div>

            {/* Pagination */}
            <Pagination
              totalLength={adInfoTotalNo}
              itemsPerPage={5}
              page={page}
              setPage={setPage}
            />
          </div>
        </div>

        {/* Modal- active only if screen is narrower than 768px */}
        <AdSLModal />
      </div>
    );
  }
}
