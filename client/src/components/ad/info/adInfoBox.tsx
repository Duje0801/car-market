import { AdImagesCarousel } from "./adImagesCarousel";
import { AdTable } from "./adTable";
import { IAd } from "../../../interfaces/IAd";

interface Props {
  adData: IAd;
}

export function AdInfoBox({ adData }: Props) {
  return (
    <div className="card bg-base-200 p-4 gap-2 shadow-xl mx-auto mt-2 mb-4 rounded-lg w-[90vw] md:w-full">
      <div className="lg:flex lg:gap-2">
        {/* Ad images carousel */}
        <AdImagesCarousel adData={adData} />
        {/* Ad info table */}
        <AdTable adData={adData} />
      </div>
      {/* Ad description */}
      {adData && adData.description ? (
        <div className="gap-2 text-xl mt-4">
          <div>
            <b>Description:</b>
          </div>
          <div className="text-base">{adData.description}</div>
        </div>
      ) : null}
    </div>
  );
}
