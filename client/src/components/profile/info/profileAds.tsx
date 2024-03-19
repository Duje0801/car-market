import { Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";
import { store } from "../../../store";
import { ProfileDropdownSort } from "../dropdowns/profileDropdownSort";
import { Pagination } from "../../elements/pagination";
import { AdDisplayMessages } from "../../adsDisplay/adDisplayMessages";
import { AdDisplayNarrow } from "../../adsDisplay/adDisplayNarrow";
import { AdDisplayWide } from "../../adsDisplay/adDisplayWide";

interface Props {
  adInfoTotalNo: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  setSort: Dispatch<SetStateAction<string>>;
  handleSeeMoreClick: (id: string) => void;
}

export function ProfileAds({
  adInfoTotalNo,
  page,
  setPage,
  setSort,
  handleSeeMoreClick,
}: Props) {
  const { profileAds } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  const handleSorting = (id: string) => {
    setSort(id);
    setPage(1);
  };

  return (
    <div className="lg:w-2/3">
      {/* Profile ads sort button */}
      <ProfileDropdownSort handleSorting={handleSorting} />
      {/* Profile ads display */}
      <div className="card bg-base-200 pt-2 pb-4 shadow-xl mx-auto mb-2 rounded-lg w-[90vw] sm:w-[66vw] lg:w-5/6 lg:ml-4 lg:mr-auto">
        {/* Ads (mapped) */}
        <div className="card-body p-2">
          {/* Pagination */}
          <Pagination
            totalLength={adInfoTotalNo}
            itemsPerPage={5}
            page={page}
            setPage={setPage}
          />
          {profileAds &&
            profileAds.map((ad, i) => {
              return (
                <div
                  key={i}
                  className="card w-full bg-base-100 shadow-xl p-2 rounded-lg lg:p-0"
                >
                  {/* Ads List messages */}
                  <AdDisplayMessages ad={ad} />

                  {/* If screen is narrower than 1024px */}
                  <AdDisplayNarrow
                    ad={ad}
                    handleSeeMoreClick={handleSeeMoreClick}
                  />

                  {/* If screen is wider than 1024px */}
                  <AdDisplayWide
                    ad={ad}
                    handleSeeMoreClick={handleSeeMoreClick}
                  />
                </div>
              );
            })}
        </div>
      </div>
      {/* Pagination */}
      <Pagination
        totalLength={adInfoTotalNo}
        itemsPerPage={5}
        page={page}
        setPage={setPage}
      />
    </div>
  );
}
