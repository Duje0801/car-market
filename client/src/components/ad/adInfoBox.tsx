import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { store } from "../../store";
import { useCalcPhotosNumber } from "../../hooks/useCalcPhotosNumber";
import { MdNewReleases } from "react-icons/md";
import { FaFlag } from "react-icons/fa";
import { FaCar } from "react-icons/fa";
import { FaCarSide } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaRoad } from "react-icons/fa";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { ImPower } from "react-icons/im";
import { ImPriceTags } from "react-icons/im";

export function AdInfoBox() {
  const [imgToShow, setImgToShow] = useState<number>(0);

  const { adData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.ad
  );

  const photoNumbers = useCalcPhotosNumber(imgToShow, adData?.images.length!);

  useEffect(() => {
    setImgToShow(0);
  }, [adData?.images.length]);

  //Changing visible image (in uploaded images box)
  const handleChangeImage = (iteration: number) => {
    setImgToShow(iteration);
  };

  return (
    <div>
      {/* Show images (box) */}
      {adData && adData.images.length > 0 && (
        <div className="flex">
          <div className="carousel carousel-item h-[33vh] w-full bg-black rounded-lg relative">
            <img
              src={adData.images[imgToShow].imageUrl}
              className="w-auto h-full m-auto"
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
      )}
      {/* Ad data (title, country, price...) */}
      <p className="text-2xl font-bold text-center my-4">
        {adData && adData.title}
      </p>
      <p className="flex gap-2 text-xl">
        <MdNewReleases className="my-auto" /> Condition:{" "}
        {adData && adData.condition}
      </p>
      <p className="flex gap-2 text-xl">
        <FaFlag className="my-auto" /> Country: {adData && adData.country}
      </p>
      <p className="flex gap-2 text-xl">
        <FaCar className="my-auto" /> Make: {adData && adData.make}
      </p>
      <p className="flex gap-2 text-xl">
        <FaCarSide className="my-auto" /> Model: {adData && adData.model}
      </p>
      <p className="flex gap-2 text-xl">
        <FaCalendarAlt className="my-auto" /> First reg.:{" "}
        {adData && adData.firstRegistration === 1999
          ? "Older than 2000."
          : adData?.firstRegistration}
      </p>
      <p className="flex gap-2 text-xl">
        <FaRoad className="my-auto" /> Mileage: {adData && adData.mileage} km
      </p>
      <p className="flex gap-2 text-xl">
        <BsFillFuelPumpFill className="my-auto" /> Fuel: {adData && adData.fuel}
      </p>
      <p className="flex gap-2 text-xl">
        <ImPower className="my-auto" /> Power: {adData && adData.power} kW
      </p>
      <p className="flex gap-2 text-xl">
        <ImPriceTags className="my-auto" /> Price: {adData && adData.price}€
      </p>
      {adData && adData.description ? (
        <div className="gap-2 text-xl mt-2">
          <div>Description:</div>
          <div className="text-lg">{adData.description}</div>
        </div>
      ) : null}
    </div>
  );
}
