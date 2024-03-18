import { Dispatch, SetStateAction } from "react";
import { AdSLDropdownSort } from "./adSLDropdownSort";

interface Props {
  adInfoTotalNo: number;
  setSort: Dispatch<SetStateAction<string>>;
  setPage: Dispatch<SetStateAction<number>>;
}

export function AdSLDropdowns({ adInfoTotalNo, setSort, setPage }: Props) {
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
        <div className="stat-value">{adInfoTotalNo}</div>
      </div>
      <AdSLDropdownSort handleSorting={handleSorting} />
    </div>
  );
}
