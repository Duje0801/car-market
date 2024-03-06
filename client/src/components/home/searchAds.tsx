import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../../store";
import { makes as makesList } from "../../data/makes";
import { countries as countriesList } from "../../data/countries";
import { yearsData } from "../../data/years";
import { condition as conditionList } from "../../data/condition";
import { fuel as fuelList } from "../../data/fuel";
import axios from "axios";

export function SearchAds() {
  //States of search parameters
  const [make, setMake] = useState<string>("Make");
  const [model, setModel] = useState<string>("");
  const [priceFrom, setPriceFrom] = useState<string>("");
  const [priceTo, setPriceTo] = useState<string>("");
  const [country, setCountry] = useState<string>("Pick country");
  const [condition, setCondition] = useState<string>("New/Used");
  const [fuel, setFuel] = useState<string>("Fuel");
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
  const [error, setError] = useState<string>("");
  const [resultsNo, setResultsNo] = useState<number>(0);
  const [searchId, setSearchId] = useState<string>("");

  const { data } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  const navigate = useNavigate();

  const years = yearsData();

  //New fetch after any change (getting results number)
  useEffect(() => {
    if (
      make ||
      model ||
      priceFrom ||
      priceTo ||
      country ||
      condition ||
      fuel ||
      firstRegistrationFrom ||
      firstRegistrationTo ||
      mileageFrom ||
      mileageTo ||
      minPower ||
      maxPower
    ) {
      fetchData();
    } else setResultsNo(0);
  }, [
    make,
    model,
    priceFrom,
    priceTo,
    country,
    condition,
    fuel,
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
  };

  const handleSelectFuel = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFuel(event.target.value);
  };

  const handleSelectFirstRegistrationFrom = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFirstRegistrationFrom(event.target.value);
  };

  const handleSelectFirstRegistrationTo = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFirstRegistrationTo(event.target.value);
  };

  const handleChangeMileageFrom = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (/^\d*$/.test(event.target.value)) {
      setMileageFrom(event.target.value);
    }
  };

  const handleChangeMileageTo = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
    clearFields(false);
    return moreSearchOptions
      ? setMoreSearchOptions(false)
      : setMoreSearchOptions(true);
  };

  //Fetching data function
  const fetchData = async () => {
    setIsLoading(true);

    let url = "";
    if (make && make !== "Make") url += `make=${make}&`;
    if (model) url += `model=${model}&`;
    if (
      firstRegistrationFrom &&
      firstRegistrationFrom !== "First registration from"
    ) {
      url += `firstRegistrationFrom=${firstRegistrationFrom}&`;
    }
    if (
      firstRegistrationTo &&
      firstRegistrationTo !== "First registration to"
    ) {
      url += `firstRegistrationTo=${firstRegistrationTo}&`;
    }
    if (country && country !== "Pick country") url += `country=${country}&`;
    if (mileageFrom) url += `mileageFrom=${mileageFrom}&`;
    if (mileageTo) url += `mileageTo=${mileageTo}&`;
    if (condition && condition !== "New/Used") url += `condition=${condition}&`;
    if (fuel && fuel !== "Fuel") url += `fuel=${fuel}&`;
    if (minPower) url += `minPower=${minPower}&`;
    if (maxPower) url += `maxPower=${maxPower}&`;
    if (priceFrom) url += `priceFrom=${priceFrom}&`;
    if (priceTo) url += `priceTo=${priceTo}`;

    if (url.slice(-1) === "&" || url.slice(-1) === "?") {
      url = url.slice(0, -1);
    }

    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/ad/searchNo/?${url}`,
        {
          headers: {
            authorization: `Bearer ${data?.token}`,
          },
        }
      );
      setResultsNo(response.data.ads);
      setSearchId(url);
    } catch (error: any) {
      if (
        error?.response?.data?.status === "fail" &&
        typeof error?.response?.data?.message === `string`
      ) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
    setIsLoading(false);
  };

  //Redirect to search result list
  const handleRedirect = () => {
    if (resultsNo < 1) return;
    navigate(`/ads/${searchId}`);
  };

  //Clear all fields function
  const clearFields = (all: boolean) => {
    if (all) {
      setMake("");
      setModel("");
      setPriceFrom("");
      setPriceTo("");
      setCountry("");
    }
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
      {/*Error box*/}
      {error && (
        <div className="badge badge-error flex flex-justify gap-2 rounded-lg p-4 m-auto h-fit max-w-[80vw]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-8 h-8 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
          <p className="text-sm text-center">{error}</p>
        </div>
      )}
      {/* Search form */}
      <form className="flex flex-wrap justify-between bg-base-200 p-4 gap-2 shadow-xl mx-auto mt-2 rounded-lg w-[90vw]">
        {/* Make select */}
        <select
          value={make}
          onChange={handleSelectMake}
          className="input input-bordered w-[39.5vw] max-w-xs"
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
          className="input input-bordered w-[39.5vw] max-w-xs text-black"
          minLength={1}
          maxLength={20}
          value={model}
          onChange={handleChangeModel}
        />
        {/* Price from input */}
        <input
          type="text"
          placeholder="Price from"
          className="input input-bordered w-[39.5vw] max-w-xs text-black"
          minLength={0}
          maxLength={8}
          value={priceFrom}
          onChange={handleChangePriceFrom}
        />
        {/* Price to input */}
        <input
          type="text"
          placeholder="Price to"
          className="input input-bordered w-[39.5vw] max-w-xs text-black"
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
            {/* First registration from select */}
            <select
              value={firstRegistrationFrom}
              onChange={handleSelectFirstRegistrationFrom}
              className="input input-bordered w-[39.5vw]"
            >
              <option>First registration from</option>
              {years.map((y, i) => {
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
              className="input input-bordered w-[39.5vw]"
            >
              <option>First registration to</option>
              {years.map((y, i) => {
                if (typeof y !== `number`) return;
                else {
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
              className="input input-bordered w-[39.5vw] max-w-xs text-black"
              minLength={1}
              maxLength={7}
              value={mileageFrom}
              onChange={handleChangeMileageFrom}
            />
            {/* Mileage to input*/}
            <input
              type="text"
              placeholder="Mileage to (km)"
              className="input input-bordered w-[39.5vw] max-w-xs text-black"
              minLength={1}
              maxLength={7}
              value={mileageTo}
              onChange={handleChangeMileageTo}
            />
            {/* Min power input*/}
            <input
              type="text"
              placeholder="Min power (kW)"
              className="input input-bordered w-[39.5vw] max-w-xs text-black"
              minLength={1}
              maxLength={4}
              value={minPower}
              onChange={handleChangeMinPower}
            />
            {/* Max power input*/}
            <input
              type="text"
              placeholder="Max power (kW)"
              className="input input-bordered w-[39.5vw] max-w-xs text-black"
              minLength={1}
              maxLength={4}
              value={maxPower}
              onChange={handleChangeMaxPower}
            />
          </>
        )}
        {/* Clear all and Results buttons */}
        <button
          type="button"
          className="btn btn-error w-[39.5vw] max-w-xs"
          onClick={() => clearFields(true)}
        >
          Clear All
        </button>
        <button
          type="button"
          className="btn bg-black text-white w-[39.5vw] max-w-xs"
          onClick={handleRedirect}
        >
          {isLoading ? (
            <div className="flex">
              <span className="loading loading-ball loading-xs"></span>
              <span className="loading loading-ball loading-xs"></span>
              <span className="loading loading-ball loading-xs"></span>
            </div>
          ) : (
            `${resultsNo} Results`
          )}{" "}
        </button>
      </form>
    </>
  );
}
