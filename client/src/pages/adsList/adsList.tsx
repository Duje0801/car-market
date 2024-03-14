import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../../store";
import { AdSLDropdownSort } from "../../components/adSearchList/adSLDropdownSort";
import { AdSLModal } from "../../components/adSearchList/adSLModal";
import { AdSL } from "../../components/adSearchList/adSL";
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

  //Sorting ads list
  const handleSorting = (id: string) => {
    setSort(id);
    setPage(1);
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

  if (!isChecked || !isLoaded) {
    {
      /* Loading ad data */
    }
    return (
      <main>
        <WaitingDots size={"md"} marginTop={8} />{" "}
      </main>
    );
  } else if (isChecked && isLoaded && error) {
    {
      /* Problems with loading ad info */
    }
    return (
      <main className="mx-auto w-[90vw]">
        <MessageError message={error} />
      </main>
    );
  } else if (adInfo.length === 0 && isChecked && isLoaded) {
    {
      /* No matching ads */
    }
    return (
      <main className="mx-auto w-[90vw]">
        <MessageWarning message={"Can't find any matching ad"} />
      </main>
    );
  } else if (adInfo) {
    return (
      <>
        <main className="pb-2">
          {/* Ads dropdown */}
          <div className="flex justify-between w-[90vw] mx-auto mb-2">
            <button
              onClick={() => handleOpenModal(`filterSearch`)}
              className="btn btn-sm bg-black text-white text-sm font-bold"
            >
              Filter
            </button>
            <p className="flex text-lg font-bold">
              Total: {adInfoTotalNo} ad{adInfoTotalNo > 1 ? "s" : ""}
            </p>
            <AdSLDropdownSort handleSorting={handleSorting} />
          </div>
          {/* Ads (mapped) */}
          <div className="card bg-base-200 gap-2 py-4 shadow-xl mx-auto mb-2 rounded-lg w-[90vw]">
            {/* Pagination */}
            <Pagination
              totalLength={adInfoTotalNo}
              itemsPerPage={5}
              page={page}
              setPage={setPage}
            />

            {/*Ads list*/}
            <div className="card-body p-2">
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
        </main>
        <AdSLModal />
      </>
    );
  }
}
