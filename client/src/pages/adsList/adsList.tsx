import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addAdListData, changeAdListDataNo } from "../../store/slices/adList";
import { store } from "../../store";
import { AdSL } from "../../components/adSearchList/info/adSL";
import { AdSLModal } from "../../components/adSearchList/modals/adSLModal";
import { AdSLFilter } from "../../components/adSearchList/filter/adSLFilter";
import { AdSLDropdowns } from "../../components/adSearchList/dropdowns/adSLDropdowns";
import { Pagination } from "../../components/elements/pagination";
import { WaitingDots } from "../../components/elements/waitingDots";
import { MessageError } from "../../components/elements/messages/messageError";
import { MessageWarning } from "../../components/elements/messages/messageWarning";
import { catchErrors } from "../../utilis/catchErrors";
import axios from "axios";

export function AdsList() {
  const [error, setError] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [sort, setSort] = useState<string>("-createdAt");

  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loggedProfileData, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
  );

  const { adListData, adListDataNo } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.adList
  );

  //Automatically fetches ad list data on page load and page change
  useEffect(() => {
    if (isChecked) {
      fetchAdsData();
    }
  }, [isChecked, page, sort]);

  //Ads fetching function
  const fetchAdsData = async () => {
    try {
      const response = await axios.get(
        `https://car-market-production.up.railway.app/api/v1/car/search/?sort=${sort}&page=${
          (page - 1) * 5
        }&${params.id}`,
        {
          headers: {
            authorization: `Bearer ${loggedProfileData?.token}`,
          },
        }
      );
      dispatch(addAdListData(response.data.ads));
      dispatch(changeAdListDataNo(response.data.adsNo));
    } catch (error) {
      catchErrors(error, setError);
    }
    setIsLoaded(true);
  };

  //Redirect to ad (after clicking `See more` button)
  const handleSeeMoreClick = (id: string) => {
    navigate(`/ad/${id}`);
  };

  //Sorting ads list
  const handleSorting = (operation: string) => {
    setSort(operation);
    setPage(1);
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
  } else if (adListData?.length === 0 && isChecked && isLoaded) {
    {
      /* No matching ads */
    }
    return (
      <div className="mx-auto w-[90vw]">
        <MessageWarning message={"Can't find any matching ad"} />
      </div>
    );
  } else if (adListData) {
    return (
      <div className="flex justify-center w-full">
        {/* Ads filter - left, if screen is wider than 768px */}
        {window.innerWidth < 768 ? null : (
          <div className="hidden w-2/5 md:block md:w-1/3">
            <div className="w-11/12 mx-auto mt-12 bg-base-200 py-4 shadow-xl rounded-lg md:w-10/12 md:mr-2 lg:w-2/3 lg:mr-4">
              <h3 className="font-bold text-lg text-center">Filter</h3>
              <AdSLFilter
                loggedProfileData={loggedProfileData}
                isChecked={isChecked}
              />
            </div>
          </div>
        )}

        {/* Ads column */}
        <div className="md:w-2/3">
          {/* Ads dropdowns */}
          <AdSLDropdowns
            adListDataNo={adListDataNo}
            handleSorting={handleSorting}
          />

          {/* Ads  */}
          <div className="card w-[90vw] bg-base-200 gap-2 py-4 shadow-xl mx-auto rounded-lg md:w-11/12 md:ml-2 md:py-2 lg:w-5/6 lg:ml-4">
            {/* Pagination */}
            <Pagination
              totalLength={adListDataNo}
              itemsPerPage={5}
              page={page}
              setPage={setPage}
            />

            {/*Ads list (mapped)*/}
            <div className="card-body p-2 md:gap-6 md:py-0">
              <AdSL
                adListData={adListData}
                handleSeeMoreClick={handleSeeMoreClick}
              />
            </div>

            {/* Pagination */}
            <Pagination
              totalLength={adListDataNo}
              itemsPerPage={5}
              page={page}
              setPage={setPage}
            />
          </div>
        </div>

        {/* Modal- active only if screen is 768px or narrower */}
        {window.innerWidth < 768 ? (
          <AdSLModal
            loggedProfileData={loggedProfileData}
            isChecked={isChecked}
          />
        ) : null}
      </div>
    );
  }
}
