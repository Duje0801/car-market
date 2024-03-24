import { useCalcPhotosNumber } from "../../../hooks/useCalcPhotosNumber";
import { IoMdCloseCircle } from "react-icons/io";
import { IAd } from "../../../interfaces/IAd";

interface Props {
  adData: IAd;
  imgToShowModal: number;
  handleChangeImageModal: (iteration: number) => void;
}

export function PhotoModal({
  adData,
  imgToShowModal,
  handleChangeImageModal,
}: Props) {
  const photoNumbersModal = useCalcPhotosNumber(
    imgToShowModal,
    adData?.images.length!
  );

  return (
    <dialog id="zoomImageModal" className="modal">
      <div className="modal-box md:flex md:min-w-[60vw] md:min-h-[60vh]">
        {/* Image in modal */}
        <img
          src={adData?.images[imgToShowModal].imageUrl}
          className="m-auto max-h-[70vh]"
        ></img>
        {/* No of image user is looking at (in modal) */}
        <div className="absolute flex bottom-2 right-2 p-2 bg-slate-100 gap-2 text-xl rounded-md cursor-pointer transition-transform">
          {imgToShowModal + 1}/{adData?.images.length}
        </div>
        {/* Changing visible image in modal (left and right arrows) */}
        {adData?.images.length! > 1 && (
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a
              onClick={() => handleChangeImageModal(photoNumbersModal.before)}
              className="btn btn-circle bg-slate-100 transition-transform"
            >
              ❮
            </a>
            <a
              onClick={() => handleChangeImageModal(photoNumbersModal.after)}
              className="btn btn-circle bg-slate-100 transition-transform"
            >
              ❯
            </a>
          </div>
        )}
        {/* Close button (X) */}
        <div className="modal-action h-0 m-0">
          <form method="dialog">
            <button>
              <IoMdCloseCircle className="absolute text-5xl bg-white text-red-500 top-0 right-0 rounded-full" />
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
