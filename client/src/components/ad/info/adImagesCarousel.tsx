import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCarouselImgContext } from "../../../context/carouselImgContext";
import { store } from "../../../store";
import { useCalcPhotosNumber } from "../../../hooks/useCalcPhotosNumber";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";

export function AdImagesCarousel() {
  //Image number to show in modal only
  const [imgToShowModal, setImgToShowModal] = useState<number>(0);

  const { adData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.ad
  );

  const { carouselImgState, carouselImgDispatch } = useCarouselImgContext();

  const photoNumbers = useCalcPhotosNumber(
    carouselImgState.number,
    adData?.images.length!
  );
  const photoNumbersModal = useCalcPhotosNumber(
    imgToShowModal,
    adData?.images.length!
  );

  useEffect(() => {
    carouselImgDispatch({ type: "SET_IMG_NO", payload: 0 });
  }, [adData?.images.length]);

  //Changing visible image (in uploaded images box)
  const handleChangeImage = (iteration: number) => {
    carouselImgDispatch({ type: "SET_IMG_NO", payload: iteration });
  };

  //Changing visible image (in modal)
  const handleChangeImageModal = (iteration: number) => {
    setImgToShowModal(iteration);
  };

  //Open modals
  const handleOpenModal = () => {
    setImgToShowModal(carouselImgState.number);
    const modal = document.getElementById(
      `zoomImageModal`
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  return (
    <>
      {/* Image carousel */}
      {adData && adData.images.length > 0 && (
        <div className="flex lg:w-1/2">
          <div className="carousel carousel-item h-[40vh] w-full bg-black rounded-lg relative lg:h-full">
            {/* Image in box */}
            <img
              src={adData.images[carouselImgState.number].imageUrl}
              className="w-full object-cover h-[40vh] m-auto transform transition duration-500 hover:scale-110"
            />
            {/* Zoom in /open modal - top right icon */}
            <MdOutlineZoomOutMap
              onClick={() => handleOpenModal()}
              className="absolute top-2 right-2 text-3xl bg-slate-100 rounded-md cursor-pointer hover:bg-slate-300"
            />
            {adData.images.length > 1 && (
              <>
                <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                  {/* Changing visible image (left and right arrows) */}
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
              </>
            )}
            {/* No of image user is looking at */}
            <div className="absolute flex bottom-2 right-2 p-2 bg-slate-100 gap-2 text-xl rounded-md cursor-pointer transition-transform">
              {carouselImgState.number + 1}/{adData.images.length}
            </div>
          </div>
        </div>
      )}

      {/*Photo modal*/}
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
    </>
  );
}
