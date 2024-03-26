import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../../store";
import { WaitingDots } from "../elements/waitingDots";
import { useQueryParams } from "../../hooks/useQueryParams";
import { catchErrors } from "../../utilis/catchErrors";
import { makes as makesList } from "../../data/makes";
import { countries as countriesList } from "../../data/countries";
import { yearsData } from "../../data/years";
import { condition as conditionList } from "../../data/condition";
import { fuel as fuelList } from "../../data/fuel";
import { gearbox as gearboxList } from "../../data/gearbox";
import axios from "axios";

interface Props {
  setError: Dispatch<SetStateAction<string>>;
}

export function SearchAds({ setError }: Props) {
  //States of search parameters
  const [make, setMake] = useState<string>("Make");
  const [model, setModel] = useState<string>("");
  const [priceFrom, setPriceFrom] = useState<string>("");
  const [priceTo, setPriceTo] = useState<string>("");
  const [country, setCountry] = useState<string>("Pick country");
  const [condition, setCondition] = useState<string>("New/Used");
  const [fuel, setFuel] = useState<string>("Fuel");
  const [gearbox, setGearbox] = useState<string>("Gearbox");
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resultsNo, setResultsNo] = useState<number>(0);
  const [searchId, setSearchId] = useState<string>("");
  const [lockedNewCar, setLockedNewCar] = useState<boolean>(false);

  //Loged user details (username, email and token)
  const { loggedProfileData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
  );

  const navigate = useNavigate();
  const queryParamsMaker = useQueryParams;

  const years = yearsData();

  //New fetch after any change (getting total results number)
  useEffect(() => {
    fetchSearchTotalResults();
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
    if (event.target.value === "Pick country") setCountry("");
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
      setMileageFrom("");
      setMileageTo("");
      setFirstRegistrationFrom("");
      setFirstRegistrationTo("");
      setLockedNewCar(false);
    }
  };

  const handleSelectFuel = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFuel(event.target.value);
  };

  const handleSelectGearbox = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGearbox(event.target.value);
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

  //Open/close additional search options (click on button `More search options`)
  const handleMoreSearchOptions = () => {
    return moreSearchOptions
      ? setMoreSearchOptions(false)
      : setMoreSearchOptions(true);
  };

  //Fetching data function
  const fetchSearchTotalResults = async () => {
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
        `https://car-market-production.up.railway.app/api/v1/ad/searchTotal/?${queryParams}`,
        {
          headers: {
            authorization: `Bearer ${loggedProfileData?.token}`,
          },
        }
      );
      setResultsNo(response.data.adsNo);
      //If the user requests a search, prepare queries in the URL link
      setSearchId(queryParams);
    } catch (error) {
      catchErrors(error, setError);
    }
    setIsLoading(false);
  };

  //Redirect to search result list
  const handleRedirect = () => {
    if (resultsNo < 1) return;
    navigate(`/ads/${searchId}`);
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
    <form className="flex flex-col bg-base-200 p-4 gap-2 shadow-xl mx-auto mt-2 rounded-lg w-[90vw] md:w-[70vw] lg:mt-0">
      {/* 1st row */}
      <div className="flex gap-2 justify-around">
        {/* Make select */}
        <select
          value={make}
          onChange={handleSelectMake}
          className="input input-bordered w-1/2 xxl:text-xl"
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
          className="input input-bordered w-1/2 text-black xxl:text-xl"
          minLength={1}
          maxLength={20}
          value={model}
          onChange={handleChangeModel}
        />
      </div>
      {/* 2nd row */}
      <div className="flex gap-2 justify-around">
        {/* Price from input */}
        <input
          type="text"
          placeholder="Price from"
          className="input input-bordered w-1/2 text-black xxl:text-xl"
          minLength={0}
          maxLength={8}
          value={priceFrom}
          onChange={handleChangePriceFrom}
        />
        {/* Price to input */}
        <input
          type="text"
          placeholder="Price to"
          className="input input-bordered w-1/2 text-black xxl:text-xl"
          minLength={0}
          maxLength={8}
          value={priceTo}
          onChange={handleChangePriceTo}
        />
      </div>
      {/* 3rd row */}
      {/* Country select */}
      <select
        value={country}
        onChange={handleSelectCountry}
        className="input input-bordered w-full xxl:text-xl"
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
      {/* 4th row */}
      {/* More search options button */}
      <button
        type="button"
        className="btn bg-black text-white w-full xxl:text-xl"
        onClick={handleMoreSearchOptions}
      >
        {moreSearchOptions ? "Less" : "More"} search options
      </button>
      {moreSearchOptions && (
        <>
          {/* 5th row */}
          {/* Condition select */}
          <select
            value={condition}
            onChange={handleSelectCondition}
            className="input input-bordered w-full xxl:text-xl"
          >
            <option>New/Used</option>
            {conditionList.map((f, i) => (
              <option key={i} value={f}>
                {f}
              </option>
            ))}
          </select>
          {/* 6th row */}
          {/* Fuel select */}
          <select
            value={fuel}
            onChange={handleSelectFuel}
            className="input input-bordered w-full xxl:text-xl"
          >
            <option>Fuel</option>
            {fuelList.map((f, i) => (
              <option key={i} value={f}>
                {f}
              </option>
            ))}
          </select>
          {/* 7th row */}
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
          {/* 8th row */}
          <div className="flex gap-2 justify-around">
            {/* First registration from select */}
            <select
              value={firstRegistrationFrom}
              onChange={handleSelectFirstRegistrationFrom}
              className="input input-bordered w-1/2 xxl:text-xl"
              disabled={lockedNewCar}
            >
              <option>First registration from</option>
              {years.map((y, i) => {
                if (y === "-" || y === "First registration from") return;
                return (
                  <option key={i + 1} value={y}>
                    {y}
                  </option>
                );
              })}
            </select>
            {/* First registration to select */}
            <select
              value={firstRegistrationTo}
              onChange={handleSelectFirstRegistrationTo}
              className="input input-bordered w-1/2 xxl:text-xl"
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
          </div>
          {/* 9th row */}
          <div className="flex gap-2 justify-around">
            {/* Mileage from input */}
            <input
              type="text"
              placeholder="Mileage from (km)"
              className="input input-bordered w-1/2 text-black xxl:text-xl"
              minLength={1}
              maxLength={7}
              value={mileageFrom}
              disabled={lockedNewCar}
              onChange={handleChangeMileageFrom}
            />
            {/* Mileage to input*/}
            <input
              type="text"
              placeholder="Mileage to (km)"
              className="input input-bordered w-1/2 text-black xxl:text-xl"
              minLength={1}
              maxLength={7}
              value={mileageTo}
              disabled={lockedNewCar}
              onChange={handleChangeMileageTo}
            />
          </div>
          {/* 10th row */}
          <div className="flex gap-2 justify-around">
            {/* Min power input*/}
            <input
              type="text"
              placeholder="Min power (kW)"
              className="input input-bordered w-1/2 text-black xxl:text-xl"
              minLength={1}
              maxLength={4}
              value={minPower}
              onChange={handleChangeMinPower}
            />
            {/* Max power input*/}
            <input
              type="text"
              placeholder="Max power (kW)"
              className="input input-bordered w-1/2 text-black xxl:text-xl"
              minLength={1}
              maxLength={4}
              value={maxPower}
              onChange={handleChangeMaxPower}
            />
          </div>
        </>
      )}
      {/* Last row */}
      {/* Clear all and Results buttons */}
      <button
        type="button"
        className="btn btn-error w-full xxl:text-xl"
        onClick={() => clearFields()}
      >
        Clear All
      </button>
      <button
        type="button"
        className="btn bg-black text-white w-full xxl:text-xl"
        onClick={handleRedirect}
      >
        {isLoading ? (
          <WaitingDots size={"xs"} marginTop={2} />
        ) : (
          `${resultsNo} Results`
        )}{" "}
      </button>
    </form>
  );
}
