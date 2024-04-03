import { useEffect, useState } from "react";
import { useCarouselImgContext } from "../../../context/carouselImgContext";
import { useCalcPhotosNumber } from "../../../hooks/useCalcPhotosNumber";
import { handleOpenModal } from "../../../utilis/handleOpenModal";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { IAd } from "../../../interfaces/IAd";
import { PhotoModal } from "../modals/photoModal";

interface Props {
  adData: IAd;
}

export function AdImagesCarousel({ adData }: Props) {
  //Image number to show in modal only
  const [imgToShowModal, setImgToShowModal] = useState<number>(0);

  const { carouselImgState, carouselImgDispatch } = useCarouselImgContext();

  const photoNumbers = useCalcPhotosNumber(
    carouselImgState.number,
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

  return (
    <>
      {/* Image carousel */}
      {adData && adData.images.length > 0 && (
        <div className="flex lg:w-1/2">
          <div className="carousel carousel-item h-[40vh] w-full bg-black rounded-lg relative overflow-hidden lg:h-full">
            {/* Image in box */}
            <img
              src={adData.images[carouselImgState.number].imageUrl}
              className="w-full object-cover h-[40vh] m-auto transform transition duration-500 hover:scale-110"
            />
            {/* Zoom in /open modal - top right icon */}
            <MdOutlineZoomOutMap
              onClick={() => handleOpenModal("zoomImage")}
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

      <PhotoModal
        adData={adData}
        imgToShowModal={imgToShowModal}
        handleChangeImageModal={handleChangeImageModal}
      />
    </>
  );
}
