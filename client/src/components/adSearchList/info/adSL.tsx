import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../../../store";
import { AdDisplayMessages } from "../../adsDisplay/adDisplayMessages";
import { AdDisplayNarrow } from "../../adsDisplay/adDisplayNarrow";
import { AdDisplayWide } from "../../adsDisplay/adDisplayWide";

export function AdSL() {
  const navigate = useNavigate();

  const { adListData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.adList
  );

  //Redirect to ad (after clicking `See more` button)
  const handleSeeMoreClick = (id: string) => {
    navigate(`/ad/${id}`);
  };

  return (
    <>
      {adListData &&
        adListData?.map((ad, i) => {
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
              <AdDisplayWide ad={ad} handleSeeMoreClick={handleSeeMoreClick} />
            </div>
          );
        })}
    </>
  );
}
