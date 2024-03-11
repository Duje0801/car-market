import { IAd } from "../../interfaces/IAd";

interface Props {
  adInfo: IAd;
  handleBtnClick: (operation: string) => void;
}

export function AdModals({ adInfo, handleBtnClick }: Props) {
  return (
    <>
      {/* Hide ad modal */}
      <dialog id="hideAdModal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-2">
            Are you sure you want to {adInfo.active ? "hide" : "show"} this ad?
          </h3>
          <div className="flex flex-col gap-2">
            <form method="dialog">
              <button
                onClick={() => handleBtnClick(`hide`)}
                className="btn btn-error w-full"
              >
                Yes
              </button>
            </form>
            <form method="dialog">
              <button className="btn w-full">No</button>
            </form>
          </div>
        </div>
      </dialog>{" "}
      {/* Deactivate ad modal */}
      <dialog id="deactivateAdModal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-2">
            Are you sure you want to {adInfo.active ? "de" : ""}
            activate this ad?
          </h3>
          <div className="flex flex-col gap-2">
            <form method="dialog">
              <button className="btn w-full">No</button>
            </form>
            <form method="dialog">
              <button
                onClick={() => handleBtnClick(`deactivate`)}
                className="btn btn-error w-full"
              >
                Yes
              </button>
            </form>
          </div>
        </div>
      </dialog>
      {/* Delete profile modal */}
      <dialog id="deleteAdModal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-2">
            Are you sure you want to delete this ad?
          </h3>
          <div className="flex flex-col gap-2">
            <form method="dialog">
              <button className="btn w-full">No</button>
            </form>
            <form method="dialog">
              <button
                onClick={() => handleBtnClick(`delete`)}
                className="btn btn-error w-full"
              >
                Yes
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
