import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { store } from "../../store";
import { useCalcPhotosNumber } from "../../hooks/useCalcPhotosNumber";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";

export function AdImagesCarousel() {
  const [imgToShow, setImgToShow] = useState<number>(0);

  const { adData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.ad
  );

  useEffect(() => {
    setImgToShow(0);
  }, [adData?.images.length]);

  const photoNumbers = useCalcPhotosNumber(imgToShow, adData?.images.length!);

  //Changing visible image (in uploaded images box)
  const handleChangeImage = (iteration: number) => {
    setImgToShow(iteration);
  };

  //Open modals
  const handleOpenModal = () => {
    const modal = document.getElementById(
      `zoomImageModal`
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  return (
    <>
      {/* Show images (box) */}
      {adData && adData.images.length > 0 && (
        <div className="flex">
          <div className="carousel carousel-item h-[33vh] w-full bg-black rounded-lg relative">
            <img
              src={adData.images[imgToShow].imageUrl}
              className="w-auto h-full m-auto"
            />
            <MdOutlineZoomOutMap
              onClick={() => handleOpenModal()}
              className="absolute top-2 right-2 text-3xl bg-slate-100 rounded-md cursor-pointer"
            />
            <div className="absolute top-2 right-2 text-3xl bg-slate-100 rounded-md cursor-pointer transition-transform"></div>
            {/* Changing visible image (left and right arrows) */}
            {adData.images.length > 1 && (
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a
                  onClick={() => handleChangeImage(photoNumbers.before)}
                  className="btn btn-circle bg-slate-100"
                >
                  ❮
                </a>
                <a
                  onClick={() => handleChangeImage(photoNumbers.after)}
                  className="btn btn-circle bg-slate-100"
                >
                  ❯
                </a>
              </div>
            )}
          </div>
        </div>
      )}{" "}
      {/*Photo modal*/}
      <dialog id="zoomImageModal" className="modal">
        <div className="modal-box">
          <img
            src={adData?.images[imgToShow].imageUrl}
            className="m-auto max-h-[70vh]"
          ></img>
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a
              onClick={() => handleChangeImage(photoNumbers.before)}
              className="btn btn-circle bg-slate-100 transition-transform"
            >
              ❮
            </a>
            <a
              onClick={() => handleChangeImage(photoNumbers.after)}
              className="btn btn-circle bg-slate-100 transition-transform"
            >
              ❯
            </a>
          </div>
          <div className="modal-action h-0 m-0">
            <form method="dialog">
              <button>
                <IoMdCloseCircle className="absolute text-5xl bg-white text-red-500 top-0 right-0 rounded-full" />
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
