import { useSelector } from "react-redux";
import { store } from "../../../store";
import { AdImagesCarousel } from "./adImagesCarousel";
import { AdTable } from "./adTable";

export function AdInfoBox() {
  const { adData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.ad
  );

  return (
    <div className="card bg-base-200 p-4 gap-2 shadow-xl mx-auto mt-2 mb-4 rounded-lg w-[90vw] md:w-full">
      <div className="lg:flex lg:gap-2">
        {/* Ad images carousel */}
        <AdImagesCarousel />
        {/* Ad info table */}
        <AdTable />
      </div>
      {/* Ad description */}
      {adData && adData.description ? (
        <div className="gap-2 text-xl mt-6">
          <div>
            <b>Description:</b>
          </div>
          <div className="text-base">{adData.description}</div>
        </div>
      ) : null}
    </div>
  );
}
