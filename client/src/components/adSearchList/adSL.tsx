import { useNavigate } from "react-router-dom";
import { useIsAdOld } from "../../hooks/useIsAdOld";
import { IAd } from "../../interfaces/IAd";
import { AdSLMessages } from "./adsList/adSLMessages";
import { AdSLAdsNarrow } from "./adsList/adSLAdsNarrow";
import { AdSLAdsWide } from "./adsList/adSLAdsWide";

interface Props {
  adInfo: IAd[];
}

export function AdSL({ adInfo }: Props) {
  const navigate = useNavigate();

  //Redirect to ad (after clicking `See more` button)
  const handleSeeMoreClick = (id: string) => {
    navigate(`/ad/${id}`);
  };

  return (
    <>
      {adInfo.map((ad, i) => {
        const adDate = useIsAdOld(ad.createdAt);

        return (
          <div
            key={i}
            className="card w-full bg-base-100 shadow-xl p-2 rounded-lg lg:p-0"
          >
            {/* Ads List messages */}
            <AdSLMessages ad={ad} adDate={adDate}  />

            {/* If screen is narrower than 1024px */}
            <AdSLAdsNarrow ad={ad} handleSeeMoreClick={handleSeeMoreClick} />

            {/* If screen is wider than 1024px */}
            <AdSLAdsWide ad={ad} handleSeeMoreClick={handleSeeMoreClick} />
          </div>
        );
      })}
    </>
  );
}
