import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryParams } from "../../../hooks/useQueryParams";
import { WaitingDots } from "../../elements/waitingDots";
import { MessageError } from "../../elements/messages/messageError";
import { MessageWarning } from "../../elements/messages/messageWarning";
import { catchErrors } from "../../../utilis/catchErrors";
import { makes as makesList } from "../../../data/makes";
import { countries as countriesList } from "../../../data/countries";
import { yearsData } from "../../../data/years";
import { condition as conditionList } from "../../../data/condition";
import { fuel as fuelList } from "../../../data/fuel";
import { gearbox as gearboxList } from "../../../data/gearbox";
import { ILoggedProfile } from "../../../interfaces/ILoggedProfile";
import axios from "axios";

interface Props {
  loggedProfileData: ILoggedProfile;
  isChecked: boolean;
}

export function AdSLFilter({ loggedProfileData, isChecked }: Props) {
  //States of search parameters
  const [make, setMake] = useState<string>("Make");
  const [model, setModel] = useState<string>("");
  const [priceFrom, setPriceFrom] = useState<string>("");
  const [priceTo, setPriceTo] = useState<string>("");
  const [country, setCountry] = useState<string>("Pick country");
  const [condition, setCondition] = useState<string>("New/Used");
  const [fuel, setFuel] = useState<string>("Fuel");
  const [gearbox, setGearBox] = useState<string>("Gearbox");
  const [firstRegistrationFrom, setFirstRegistrationFrom] = useState<string>(
    "First registration from"
  );
  const [firstRegistrationTo, setFirstRegistrationTo] = useState<string>(
    "First registration to"
  );
  const [mileageFrom, setMileageFrom] = useState<string>("");
  const [mileageTo, setMileageTo] = useState<string>("");
  const [minPower, setMinPower] = useState<string>("");
  const [maxPower, setMaxPower] = useState<string>("");

  //Functional states
  const [moreSearchOptions, setMoreSearchOptions] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [resultsNo, setResultsNo] = useState<number>(0);
  const [searchId, setSearchId] = useState<string>("");
  const [warningMessage, setWarningMessage] = useState<string>("");
  const [lockedNewCar, setLockedNewCar] = useState<boolean>(false);
  const [allFieldsChecked, setAllFieldsChecked] = useState<boolean>(false);

  const params = useParams();
  const navigate = useNavigate();
  const queryParamsMaker = useQueryParams;

  const years = yearsData();

  useEffect(() => {
    //Search data loading
    if (isChecked && params.id) {
      params.id
        .split("&")
        .map((el) => {
          return el.split("=");
        })
        .forEach((el) => {
          if (el[0] === `make`) return setMake(el[1]);
          else if (el[0] === `model`) return setModel(el[1]);
          else if (el[0] === `priceFrom`) return setPriceFrom(el[1]);
          else if (el[0] === `priceTo`) return setPriceTo(el[1]);
          else if (el[0] === `country`) return setCountry(el[1]);
          else if (el[0] === `condition`) {
            setCondition(el[1]);
            if (el[1] === "New") {
              setLockedNewCar(true);
            }
            return;
          } else if (el[0] === `fuel`) return setFuel(el[1]);
          else if (el[0] === `firstRegistrationFrom`) {
            return setFirstRegistrationFrom(el[1]);
          } else if (el[0] === `firstRegistrationTo`) {
            return setFirstRegistrationTo(el[1]);
          } else if (el[0] === `mileageFrom`) return setMileageFrom(el[1]);
          else if (el[0] === `mileageTo`) return setMileageTo(el[1]);
          else if (el[0] === `minPower`) return setMinPower(el[1]);
          else if (el[0] === `maxPower`) return setMaxPower(el[1]);
        });
      setAllFieldsChecked(true);
    }
  }, []);

  //New fetch after any change (getting total results number (in results button))
  useEffect(() => {
    if (allFieldsChecked) {
      fetchAdsTotalNo();
    }
  }, [
    make,
    model,
    priceFrom,
    priceTo,
    country,
    condition,
    fuel,
    gearbox,
    firstRegistrationFrom,
    firstRegistrationTo,
    mileageFrom,
    mileageTo,
    minPower,
    maxPower,
  ]);

  //Changing states functions
  const handleSelectMake = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMake(event.target.value);
  };

  const handleChangeModel = (event: React.ChangeEvent<HTMLInputElement>) => {
    setModel(event.target.value);
  };

  const handleChangePriceFrom = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (/^\d*$/.test(event.target.value)) {
      setPriceFrom(event.target.value);
    }
  };

  const handleChangePriceTo = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (/^\d*$/.test(event.target.value)) {
      setPriceTo(event.target.value);
    }
  };

  const handleSelectCountry = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "Any") setCountry("");
    else setCountry(event.target.value);
  };

  const handleSelectCondition = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCondition(event.target.value);
    if (event.target.value === "New") {
      setMileageFrom("0");
      setMileageTo("0");
      setFirstRegistrationFrom("-");
      setFirstRegistrationTo("-");
      setLockedNewCar(true);
    } else {
      setLockedNewCar(false);
      setMileageFrom("");
      setMileageTo("");
      setFirstRegistrationFrom("");
      setFirstRegistrationTo("");
    }
  };

  const handleSelectFuel = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFuel(event.target.value);
  };

  const handleSelectGearbox = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGearBox(event.target.value);
  };

  const handleSelectFirstRegistrationFrom = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (condition === "New") return;
    setFirstRegistrationFrom(event.target.value);
  };

  const handleSelectFirstRegistrationTo = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (condition === "New") return;
    setFirstRegistrationTo(event.target.value);
  };

  const handleChangeMileageFrom = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (condition === "New") return;
    if (Number(event.target.value) > 0) setCondition("Used");
    if (/^\d*$/.test(event.target.value)) {
      setMileageFrom(event.target.value);
    }
  };

  const handleChangeMileageTo = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (condition === "New") return;
    if (/^\d*$/.test(event.target.value)) {
      setMileageTo(event.target.value);
    }
  };

  const handleChangeMinPower = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (/^\d*$/.test(event.target.value)) {
      setMinPower(event.target.value);
    }
  };

  const handleChangeMaxPower = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (/^\d*$/.test(event.target.value)) {
      setMaxPower(event.target.value);
    }
  };

  //Open/close additional search options
  const handleMoreSearchOptions = () => {
    return moreSearchOptions
      ? setMoreSearchOptions(false)
      : setMoreSearchOptions(true);
  };

  //Fetching data function
  const fetchAdsTotalNo = async () => {
    setIsLoading(true);

    const allfields = {
      make,
      model,
      firstRegistrationFrom,
      firstRegistrationTo,
      country,
      mileageFrom,
      mileageTo,
      condition,
      fuel,
      gearbox,
      minPower,
      maxPower,
      priceFrom,
      priceTo,
    };

    const queryParams = queryParamsMaker(allfields);

    try {
      const response = await axios.get(
        `https://car-market-production.up.railway.app/api/v1/car/searchTotal/?${queryParams}`,
        {
          headers: {
            authorization: `Bearer ${loggedProfileData?.token}`,
          },
        }
      );
      setResultsNo(response.data.adsNo);
      setSearchId(queryParams);
      if (response.data.adsNo > 0) setWarningMessage("");
    } catch (error) {
      catchErrors(error, setError);
    }
    setIsLoading(false);
  };

  //Open warrning message
  const handleWarning = (message: string) => {
    setWarningMessage(message);
  };

  //Submit function
  const handleSubmit = () => {
    navigate(`/ads/${searchId}`);
    window.location.reload();
  };

  //Clear all fields function
  const clearFields = () => {
    setMake("");
    setModel("");
    setPriceFrom("");
    setPriceTo("");
    setCountry("");
    setCondition("");
    setFuel("");
    setFirstRegistrationFrom("");
    setFirstRegistrationTo("");
    setMileageFrom("");
    setMileageTo("");
    setMinPower("");
    setMaxPower("");
  };

  return (
    <>
      {" "}
      {/*Error box*/}
      {error && (
        <main className="mx-auto w-full p-2">
          <MessageError message={error} />
        </main>
      )}
      {/*Warning box*/}
      {warningMessage && (
        <main className="mx-auto w-full p-2">
          <MessageWarning message={warningMessage} />
        </main>
      )}
      {/* Search form */}
      <form
        method="dialog"
        onSubmit={handleSubmit}
        className="flex flex-col justify-between gap-2 mx-auto w-full md:px-2"
      >
        <p className="text-xs px-2 text-center xl:text-sm">
          To submit the search, click on the button displaying the number of
          results.{" "}
        </p>
        {/* Make select */}
        <select
          value={make}
          onChange={handleSelectMake}
          className="input input-bordered w-full"
        >
          <option>Make</option>
          {makesList.map((m, i) => (
            <option key={i} value={m}>
              {m}
            </option>
          ))}
        </select>
        {/* Model input */}
        <input
          type="text"
          placeholder="Model"
          className="input input-bordered w-full text-black"
          minLength={1}
          maxLength={20}
          value={model}
          onChange={handleChangeModel}
        />
        {/* Price from input */}
        <input
          type="text"
          placeholder="Price from"
          className="input input-bordered w-full text-black"
          minLength={0}
          maxLength={8}
          value={priceFrom}
          onChange={handleChangePriceFrom}
        />
        {/* Price to input */}
        <input
          type="text"
          placeholder="Price to"
          className="input input-bordered w-full text-black"
          minLength={0}
          maxLength={8}
          value={priceTo}
          onChange={handleChangePriceTo}
        />
        {/* Country select */}
        <select
          value={country}
          onChange={handleSelectCountry}
          className="input input-bordered w-full"
        >
          <option>Pick country</option>
          {countriesList.map((c, i) => {
            return (
              <option key={i} value={c}>
                {c}
              </option>
            );
          })}
        </select>
        {/* More search options button */}
        <button
          type="button"
          className="btn bg-black text-white w-full"
          onClick={handleMoreSearchOptions}
        >
          {moreSearchOptions ? "Less" : "More"} search options
        </button>
        {moreSearchOptions && (
          <>
            {/* Condition select */}
            <select
              value={condition}
              onChange={handleSelectCondition}
              className="input input-bordered w-full"
            >
              <option>New/Used</option>
              {conditionList.map((f, i) => (
                <option key={i} value={f}>
                  {f}
                </option>
              ))}
            </select>
            {/* Fuel select */}
            <select
              value={fuel}
              onChange={handleSelectFuel}
              className="input input-bordered w-full"
            >
              <option>Fuel</option>
              {fuelList.map((f, i) => (
                <option key={i} value={f}>
                  {f}
                </option>
              ))}
            </select>
            {/* Gearbox select */}
            <select
              value={gearbox}
              onChange={handleSelectGearbox}
              className="input input-bordered w-full xxl:text-xl"
            >
              <option>Gearbox</option>
              {gearboxList.map((g, i) => (
                <option key={i} value={g}>
                  {g}
                </option>
              ))}
            </select>
            {/* First registration from select */}
            <select
              value={firstRegistrationFrom}
              onChange={handleSelectFirstRegistrationFrom}
              className="input input-bordered w-full"
              disabled={lockedNewCar}
            >
              <option>First registration from</option>
              {years.map((y, i) => {
                if (y === "-" || y === "First registration from") return;
                else {
                  return (
                    <option key={i + 1} value={y}>
                      {y}
                    </option>
                  );
                }
              })}
            </select>
            {/* First registration to select */}
            <select
              value={firstRegistrationTo}
              onChange={handleSelectFirstRegistrationTo}
              className="input input-bordered w-full"
              disabled={lockedNewCar}
            >
              <option>First registration to</option>
              {years.map((y, i) => {
                if (
                  y === "-" ||
                  y === "First registration to" ||
                  y === "1999. and before"
                ) {
                  return;
                } else {
                  return (
                    <option key={i + 1} value={y}>
                      {y}
                    </option>
                  );
                }
              })}
            </select>
            {/* Mileage from input */}
            <input
              type="text"
              placeholder="Mileage from (km)"
              className="input input-bordered w-full text-black"
              minLength={1}
              maxLength={7}
              value={mileageFrom}
              onChange={handleChangeMileageFrom}
              disabled={lockedNewCar}
            />
            {/* Mileage to input*/}
            <input
              type="text"
              placeholder="Mileage to (km)"
              className="input input-bordered w-full text-black"
              minLength={1}
              maxLength={7}
              value={mileageTo}
              onChange={handleChangeMileageTo}
              disabled={lockedNewCar}
            />
            {/* Min power input*/}
            <input
              type="text"
              placeholder="Min power (kW)"
              className="input input-bordered w-full text-black"
              minLength={1}
              maxLength={4}
              value={minPower}
              onChange={handleChangeMinPower}
            />
            {/* Max power input*/}
            <input
              type="text"
              placeholder="Max power (kW)"
              className="input input-bordered w-full text-black"
              minLength={1}
              maxLength={4}
              value={maxPower}
              onChange={handleChangeMaxPower}
            />
          </>
        )}
        {/* Last row */}
        {/* Clear all button */}
        <button
          type="button"
          className="btn btn-error w-full"
          onClick={() => clearFields()}
        >
          Clear All
        </button>
        {/* Waiting/Submit button */}
        {isLoading ? (
          <button className="btn bg-black text-white w-full">
            <WaitingDots size={"xs"} marginTop={2} />
          </button>
        ) : resultsNo === 0 ? (
          <button
            type="button"
            onClick={() =>
              handleWarning("There are no ads that meet the filter criteria")
            }
            className="btn bg-black text-white w-full"
          >
            {resultsNo} Results
          </button>
        ) : (
          <button type="submit" className="btn bg-black text-white w-full">
            {" "}
            {resultsNo} Results
          </button>
        )}{" "}
      </form>
    </>
  );
}
