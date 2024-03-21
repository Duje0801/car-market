import { useSelector } from "react-redux";
import { store } from "../../../store";
import { AdSLDropdownSort } from "./adSLDropdownSort";

interface Props {
  handleSorting: (id: string) => void;
  handleOpenModal: (id: string) => void;
}

export function AdSLDropdowns({ handleSorting, handleOpenModal }: Props) {
  const { adListDataNo } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.adList
  );

  return (
    <div className="flex justify-between w-[90vw] mx-auto mb-2 md:w-5/6 md:ml-4">
      <button
        onClick={() => handleOpenModal(`filterSearch`)}
        className="btn btn-sm bg-black text-white text-sm font-bold mt-auto md:hidden"
      >
        Filter
      </button>
      <div className="stat flex justify-center p-0 gap-2 md:justify-start">
        <div className="stat-title mt-auto">Total Ads No:</div>
        <div className="stat-value">{adListDataNo}</div>
      </div>
      <AdSLDropdownSort handleSorting={handleSorting} />
    </div>
  );
}
