import { AdSLFilter } from "../filter/adSLFilter";
import { ILoggedProfile } from "../../../interfaces/ILoggedProfile";

interface Props {
  loggedProfileData: ILoggedProfile;
  isChecked: boolean;
}

export function AdSLModal({ loggedProfileData, isChecked }: Props) {
  return (
    <dialog id="filterSearchModal" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg mb-2">Filter</h3>
        <div className="flex flex-col gap-2">
          <AdSLFilter
            loggedProfileData={loggedProfileData}
            isChecked={isChecked}
          />
        </div>
      </div>
    </dialog>
  );
}
