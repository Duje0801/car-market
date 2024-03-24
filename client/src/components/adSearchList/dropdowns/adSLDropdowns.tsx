import { AdSLDropdownSort } from "./adSLDropdownSort";
import { handleOpenModal } from "../../../utilis/handleOpenModal";

interface Props {
  adListDataNo: number;
  handleSorting: (operation: string) => void;
}

export function AdSLDropdowns({ adListDataNo, handleSorting }: Props) {
  return (
    <div className="flex justify-between w-[90vw] mx-auto mb-2 md:w-11/12 md:ml-2 lg:w-5/6 lg:ml-4">
      {/* Filter button, only appears if the screen width is 768px or narrower - top left */}
      <button
        onClick={() => handleOpenModal(`filterSearch`)}
        className="btn btn-sm bg-black text-white text-sm font-bold mt-auto md:hidden"
      >
        Filter
      </button>
      {/* Total ads number, only appears if screen width is 768px and wider - top left */}
      <div className="stat flex justify-center p-0 gap-2 md:justify-start">
        <div className="stat-title mt-auto">Total Ads No:</div>
        <div className="stat-value">{adListDataNo}</div>
      </div>
      {/* Sort dropdown - top right */}
      <AdSLDropdownSort handleSorting={handleSorting} />
    </div>
  );
}
