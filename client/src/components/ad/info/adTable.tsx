import { useSelector } from "react-redux";
import { store } from "../../../store";
import { useMakeLogo } from "../../../hooks/useMakeLogo";
import { MdNewReleases } from "react-icons/md";
import { FaCar } from "react-icons/fa";
import { FaCarSide } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaRoad } from "react-icons/fa";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { TbManualGearbox } from "react-icons/tb";
import { ImPower } from "react-icons/im";
import { ImPriceTags } from "react-icons/im";

export function AdTable() {
  const { adData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.ad
  );

  const makeLogo = useMakeLogo(adData?.make!);

  //Calculating horse power from kw
  const hp = (adData?.power! * 1.34102).toFixed(0);

  return (
    <div className="overflow-x-auto mx-auto md:w-2/3 lg:w-1/2">
      {/* Ad title */}
      <p className="text-2xl font-bold text-center my-2 md:text-3xl lg:mt-0">
        {adData && adData.title}
      </p>{" "}
      {/* Make logo */}
      <div className="flex justify-center mb-2">{makeLogo}</div>
      {/* Table */}
      <table className="table w-3/4 mx-auto ">
        <tbody>
          {/* Make row */}
          <tr className="bg-base-200 text-xl">
            <th className="flex gap-2 p-0">
              <FaCar className="my-auto" /> Make:
            </th>
            <td className="p-0">{adData && adData.make}</td>
          </tr>
          {/* Model row */}
          <tr className="bg-base-200 text-xl">
            <th className="flex gap-2 p-0">
              <FaCarSide className="my-auto" /> Model:
            </th>
            <td className="p-0">{adData && adData.model}</td>
          </tr>
          {/* First registration row */}
          <tr className="bg-base-200 text-xl">
            <th className="flex gap-2 p-0">
              <FaCalendarAlt className="my-auto" /> First reg.:{" "}
            </th>
            <td className="p-0">
              {" "}
              {adData && adData.firstRegistration === 1999
                ? "1999. or before"
                : adData && adData.firstRegistration === 0
                ? "-"
                : `${adData?.firstRegistration}.`}
            </td>
          </tr>
          {/* Mileage row */}
          <tr className="bg-base-200 text-xl">
            <th className="flex gap-2 p-0">
              <FaRoad className="my-auto" /> Mileage:
            </th>
            <td className="p-0">{adData && adData.mileage}km</td>
          </tr>
          {/* Fuel row */}
          <tr className="bg-base-200 text-xl">
            <th className="flex gap-2 p-0">
              <BsFillFuelPumpFill className="my-auto" />
              Fuel:{" "}
            </th>
            <td className="p-0">{adData && adData.fuel}</td>
          </tr>
          {/* Gearbox row */}
          <tr className="bg-base-200 text-xl">
            <th className="flex gap-2 p-0">
              <TbManualGearbox className="my-auto" />
              Gearbox:{" "}
            </th>
            <td className="p-0">{adData && adData.gearbox}</td>
          </tr>
          {/* Power row (kW) */}
          <tr className="bg-base-200 text-xl">
            <th className="flex gap-2 p-0">
              <ImPower className="my-auto" /> Power:
            </th>
            <td className="p-0">
              {adData && adData.power}kW/{hp}hp
            </td>
          </tr>
          {/* Condition row */}
          <tr className="bg-base-200 text-xl">
            <th className="flex gap-2 p-0">
              <MdNewReleases className="my-auto" /> Condition:
            </th>
            <td className="p-0">{adData && adData.condition}</td>
          </tr>
          {/* Price row */}
          <tr className="bg-base-200 text-xl">
            <th className="flex gap-2 p-0">
              <ImPriceTags className="my-auto" /> Price:
            </th>
            <td className="p-0">
              <b>{adData && adData.price}€</b>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
