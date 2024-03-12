import { useEffect, useState } from "react";
import { useCalcPhotosNumber } from "../../hooks/useCalcPhotosNumber";
import { IAd } from "../../interfaces/IAd";
import { MdNewReleases } from "react-icons/md";
import { FaFlag } from "react-icons/fa";
import { FaCar } from "react-icons/fa";
import { FaCarSide } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaRoad } from "react-icons/fa";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { ImPower } from "react-icons/im";
import { ImPriceTags } from "react-icons/im";

interface Props {
  adInfo: IAd;
}

export function AdInfoBox({ adInfo }: Props) {
  const [imgToShow, setImgToShow] = useState<number>(0);

  const photoNumbers = useCalcPhotosNumber(imgToShow, adInfo.images.length);

  useEffect(() => {
    setImgToShow(0);
  }, [adInfo.images.length]);

  //Changing visible image (in uploaded images box)
  const handleChangeImage = (iteration: number) => {
    setImgToShow(iteration);
  };

  return (
    <div>
      {/* Show images (box) */}
      {adInfo.images.length > 0 && (
        <div className="flex">
          <div className="carousel carousel-item h-[33vh] w-full bg-black rounded-lg relative">
            <img
              src={adInfo.images[imgToShow].imageUrl}
              className="w-auto h-full m-auto"
            />
            <div className="absolute top-2 right-2 text-3xl bg-slate-100 rounded-md cursor-pointer transition-transform"></div>
            {/* Changing visible image (left and right arrows) */}
            {adInfo.images.length > 1 && (
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
      <p className="text-2xl font-bold text-center my-4">{adInfo.title}</p>
      <p className="flex gap-2 text-xl">
        <MdNewReleases className="my-auto" /> Condition: {adInfo.condition}
      </p>
      <p className="flex gap-2 text-xl">
        <FaFlag className="my-auto" /> Country: {adInfo.country}
      </p>
      <p className="flex gap-2 text-xl">
        <FaCar className="my-auto" /> Make: {adInfo.make}
      </p>
      <p className="flex gap-2 text-xl">
        <FaCarSide className="my-auto" /> Model: {adInfo.model}
      </p>
      <p className="flex gap-2 text-xl">
        <FaCalendarAlt className="my-auto" /> First reg.:{" "}
        {adInfo.firstRegistration === 1999
          ? "Older than 2000."
          : adInfo.firstRegistration}
      </p>
      <p className="flex gap-2 text-xl">
        <FaRoad className="my-auto" /> Mileage: {adInfo.mileage} km
      </p>
      <p className="flex gap-2 text-xl">
        <BsFillFuelPumpFill className="my-auto" /> Fuel: {adInfo.fuel}
      </p>
      <p className="flex gap-2 text-xl">
        <ImPower className="my-auto" /> Power: {adInfo.power} kW
      </p>
      <p className="flex gap-2 text-xl">
        <ImPriceTags className="my-auto" /> Price: {adInfo.price}€
      </p>
      {adInfo.description ? (
        <div className="gap-2 text-xl mt-2">
          <div>Description:</div>
          <div className="text-lg">{adInfo.description}</div>
        </div>
      ) : null}
    </div>
  );
}
