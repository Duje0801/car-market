import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addAdListData, changeAdListDataNo } from "../../store/slices/adList";
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
import axios from "axios";

export function AdsList() {
  const [error, setError] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [sort, setSort] = useState<string>("-createdAt");

  const params = useParams();

  const dispatch = useDispatch();

  const { loggedProfileData, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
  );

  const { adListData, adListDataNo } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.adList
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
      dispatch(addAdListData(response.data.ads));
      dispatch(changeAdListDataNo(response.data.adsNo));
    } catch (error) {
      catchErrors(error, setError);
    }
    setIsLoaded(true);
  };

  //Open modal
  const handleOpenModal = (id: string) => {
    const modal = document.getElementById(
      `${id}Modal`
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  //Sorting ads list
  const handleSorting = (id: string) => {
    setSort(id);
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
        <AdSLFilter />

        {/* Ads column */}
        <div className="md:w-2/3">
          {/* Ads dropdowns */}
          <AdSLDropdowns
            handleSorting={handleSorting}
            handleOpenModal={handleOpenModal}
          />

          {/* Ads  */}
          <div className="card bg-base-200 gap-2 py-4 shadow-xl mx-auto rounded-lg w-[90vw] md:w-5/6 md:ml-4 md:py-2">
            {/* Pagination */}
            <Pagination
              totalLength={adListDataNo}
              itemsPerPage={5}
              page={page}
              setPage={setPage}
            />

            {/*Ads list (mapped)*/}
            <div className="card-body p-2 md:gap-6 md:py-0">
              <AdSL />
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

        {/* Modal- active only if screen is narrower than 768px */}
        <AdSLModal />
      </div>
    );
  }
}
