import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../store";
import { makes as makesList } from "../data/makes";
import { countries as countriesList } from "../data/countries";
import { yearsData } from "../data/years";
import { fuel as fuelList } from "../data/fuel";
import { Hourglass } from "react-loader-spinner";
import axios from "axios";

export function SearchAds() {
  const [make, setMake] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [priceFrom, setPriceFrom] = useState<string>("");
  const [priceTo, setPriceTo] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [fuel, setFuel] = useState<string>("");
  const [firstRegistrationFrom, setFirstRegistrationFrom] =
    useState<string>("");
  const [firstRegistrationTo, setFirstRegistrationTo] = useState<string>("");
  const [mileageFrom, setMileageFrom] = useState<string>("");
  const [mileageTo, setMileageTo] = useState<string>("");
  const [minPower, setMinPower] = useState<string>("");
  const [maxPower, setMaxPower] = useState<string>("");

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

  useEffect(() => {
    if (
      make ||
      model ||
      priceFrom ||
      priceTo ||
      country ||
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
    fuel,
    firstRegistrationFrom,
    firstRegistrationTo,
    mileageFrom,
    mileageTo,
    minPower,
    maxPower,
  ]);

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

  const handleMoreSearchOptions = () => {
    return moreSearchOptions
      ? setMoreSearchOptions(false)
      : setMoreSearchOptions(true);
  };

  const fetchData = async () => {
    setIsLoading(true);

    try {
      let url = "";
      if (country) url += `country=${country}&`;
      if (make) url += `make=${make}&`;
      if (model) url += `model=${model}&`;
      if (firstRegistrationFrom) {
        url += `firstRegistrationFrom=${firstRegistrationFrom}&`;
      }
      if (firstRegistrationTo) {
        url += `firstRegistrationTo=${firstRegistrationTo}&`;
      }
      if (mileageFrom) url += `mileageFrom=${mileageFrom}&`;
      if (mileageTo) url += `mileageTo=${mileageTo}&`;
      if (fuel) url += `fuel=${fuel}&`;
      if (minPower) url += `minPower=${minPower}&`;
      if (maxPower) url += `maxPower=${maxPower}&`;
      if (priceFrom) url += `priceFrom=${priceFrom}&`;
      if (priceTo) url += `priceTo=${priceTo}`;

      if (url.slice(-1) === "&" || url.slice(-1) === "?") {
        url = url.slice(0, -1);
      }
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
        setError("Something went wrong, please try again later.");
      }
    }
    setIsLoading(false);
  };

  const handleRedirect = (e: FormEvent) => {
    e.preventDefault();
    if (resultsNo < 1) return;
    navigate(`/ads/${searchId}`);
  };

  const clearAll = () => {
    setMake("");
    setModel("");
    setPriceFrom("");
    setPriceTo("");
    setCountry("");
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
      <form>
        {error && <p className="text-red-500">{error}</p>}
        <div>
          <label htmlFor="makeField">Make:</label>
          <select
            className="border-2 border-black"
            value={make}
            onChange={handleSelectMake}
          >
            {makesList.map((m, i) => (
              <option key={i} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="modelField">Model:</label>
          <input
            type="text"
            minLength={1}
            maxLength={20}
            id="modelField"
            value={model}
            onChange={handleChangeModel}
            className="border-2 border-black"
          />{" "}
        </div>
        <div>
          <label htmlFor="titleField">Price from:</label>
          <input
            type="text"
            minLength={0}
            maxLength={8}
            id="priceFromField"
            value={priceFrom}
            onChange={handleChangePriceFrom}
            className="border-2 border-black"
          />{" "}
        </div>
        <div>
          <label htmlFor="titleField">Price To:</label>
          <input
            type="text"
            minLength={0}
            maxLength={8}
            id="priceToField"
            value={priceTo}
            onChange={handleChangePriceTo}
            className="border-2 border-black"
          />{" "}
        </div>
        <div>
          <label htmlFor="countryField">Country:</label>
          <select
            className="border-2 border-black"
            value={country}
            onChange={handleSelectCountry}
          >
            {countriesList.map((c, i) => {
              if (c === "") {
                return (
                  <option key={i} value={"Any"}>
                    Any
                  </option>
                );
              } else {
                return (
                  <option key={i} value={c}>
                    {c}
                  </option>
                );
              }
            })}
          </select>
        </div>
        <button type="button" className="btn" onClick={handleMoreSearchOptions}>
          More search options
        </button>
        {moreSearchOptions && (
          <>
            <div>
              <label htmlFor="fuelField">Fuel:</label>
              <select
                className="border-2 border-black"
                value={fuel}
                onChange={handleSelectFuel}
              >
                {fuelList.map((f, i) => (
                  <option key={i} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="makeField">First registration from:</label>
              <select
                className="border-2 border-black"
                value={firstRegistrationFrom}
                onChange={handleSelectFirstRegistrationFrom}
              >
                <option key={0} value={0}></option>
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
            </div>
            <div>
              <label htmlFor="makeField">First registration to:</label>
              <select
                className="border-2 border-black"
                value={firstRegistrationTo}
                onChange={handleSelectFirstRegistrationTo}
              >
                <option key={0} value={0}></option>
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
            </div>
            <div>
              <label htmlFor="mileageField">Mileage from:</label>
              <input
                type="text"
                minLength={1}
                maxLength={7}
                id="mileageFromField"
                value={mileageFrom}
                onChange={handleChangeMileageFrom}
                className="border-2 border-black"
              />{" "}
              km
            </div>
            <div>
              <label htmlFor="mileageField">Mileage to:</label>
              <input
                type="text"
                minLength={1}
                maxLength={7}
                id="mileageToField"
                value={mileageTo}
                onChange={handleChangeMileageTo}
                className="border-2 border-black"
              />{" "}
              km
            </div>
            <div>
              <label htmlFor="powerField">Min power:</label>
              <input
                type="text"
                minLength={1}
                maxLength={4}
                id="powerField"
                value={minPower}
                onChange={handleChangeMinPower}
                className="border-2 border-black"
              />{" "}
              kW
            </div>
            <div>
              <label htmlFor="powerField">Max power:</label>
              <input
                type="text"
                minLength={1}
                maxLength={4}
                id="powerField"
                value={maxPower}
                onChange={handleChangeMaxPower}
                className="border-2 border-black"
              />{" "}
              kW
            </div>
          </>
        )}
        <button type="button" className="btn" onClick={clearAll}>
          Clear All
        </button>
        <button type="button" className="btn" onClick={handleRedirect}>
          {resultsNo} Results
        </button>
      </form>
      {isLoading && (
        <Hourglass
          visible={true}
          height="80"
          width="80"
          ariaLabel="hourglass-loading"
          wrapperStyle={{}}
          wrapperClass=""
          colors={["#306cce", "#72a1ed"]}
        />
      )}
    </>
  );
}
