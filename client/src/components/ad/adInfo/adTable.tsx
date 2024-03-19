import { useSelector } from "react-redux";
import { store } from "../../../store";
import { MdNewReleases } from "react-icons/md";
import { FaFlag } from "react-icons/fa";
import { FaCar } from "react-icons/fa";
import { FaCarSide } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaRoad } from "react-icons/fa";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { ImPower } from "react-icons/im";
import { ImPriceTags } from "react-icons/im";

export function AdTable() {
  const { adData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.ad,
  );

  return (
    <div className="overflow-x-auto mx-auto md:w-2/3 lg:w-1/2">
      {/* Ad title */}
      <p className="text-2xl font-bold text-center my-4 md:text-3xl">
        {adData && adData.title}
      </p>
      {/* Table */}
      <table className="table w-3/4 mx-auto ">
        <tbody>
          {/* Condition row */}
          <tr className="bg-base-200 text-xl">
            <th className="flex gap-2 p-0">
              <MdNewReleases className="my-auto" /> Condition:
            </th>
            <td className="p-0">{adData && adData.condition}</td>
          </tr>
          {/* Country row */}
          <tr className="bg-base-200 text-xl">
            <th className="flex gap-2 p-0">
              <FaFlag className="my-auto" /> Country:
            </th>
            <td className="p-0">{adData && adData.country}</td>
          </tr>
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
                ? "Older than 2000."
                : adData?.firstRegistration}.
            </td>
          </tr>
          {/* Mileage row */}
          <tr className="bg-base-200 text-xl">
            <th className="flex gap-2 p-0">
              <FaRoad className="my-auto" /> Mileage:
            </th>
            <td className="p-0">{adData && adData.mileage} km</td>
          </tr>
          {/* Fuel row */}
          <tr className="bg-base-200 text-xl">
            <th className="flex gap-2 p-0">
              <BsFillFuelPumpFill className="my-auto" />
              Fuel:{" "}
            </th>
            <td className="p-0">{adData && adData.fuel}</td>
          </tr>
          {/* Power row */}
          <tr className="bg-base-200 text-xl">
            <th className="flex gap-2 p-0">
              <ImPower className="my-auto" /> Power:
            </th>
            <td className="p-0">{adData && adData.power} kW</td>
          </tr>
          {/* Price row */}
          <tr className="bg-base-200 text-xl">
            <th className="flex gap-2 p-0">
              <ImPriceTags className="my-auto" /> Price:
            </th>
            <td className="p-0">{adData && adData.price}€</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
