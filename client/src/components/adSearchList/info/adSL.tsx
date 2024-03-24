import { AdDisplayMessages } from "../adDisplay/adDisplayMessages";
import { AdDisplayNarrow } from "../adDisplay/adDisplayNarrow";
import { AdDisplayWide } from "../adDisplay/adDisplayWide";
import { IAd } from "../../../interfaces/IAd";

interface Props {
  adListData: IAd[];
  handleSeeMoreClick: (id: string) => void;
}

export function AdSL({ adListData, handleSeeMoreClick }: Props) {
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
