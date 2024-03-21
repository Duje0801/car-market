import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../../../store";
import { makes as makesList } from "../../../data/makes";
import { countries as countriesList } from "../../../data/countries";
import { yearsData } from "../../../data/years";
import { condition as conditionList } from "../../../data/condition";
import { fuel as fuelList } from "../../../data/fuel";
import { WaitingDots } from "../../elements/waitingDots";
import { MessageError } from "../../elements/messages/messageError";
import { MessageWarning } from "../../elements/messages/messageWarning";
import { catchErrors } from "../../../utilis/catchErrors";
import axios from "axios";

export function AdSLFilter() {
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
  const [warningMessage, setWarningMessage] = useState<string>("");

  const { loggedProfileData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
  );

  const params = useParams();
  const navigate = useNavigate();

  const years = yearsData();

  useEffect(() => {
    params.id &&
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
          else if (el[0] === `condition`) return setCondition(el[1]);
          else if (el[0] === `fuel`) return setFuel(el[1]);
          else if (el[0] === `firstRegistrationFrom`) {
            return setFirstRegistrationFrom(el[1]);
          } else if (el[0] === `firstRegistrationTo`) {
            return setFirstRegistrationTo(el[1]);
          } else if (el[0] === `mileageFrom`) return setMileageFrom(el[1]);
          else if (el[0] === `mileageTo`) return setMileageTo(el[1]);
          else if (el[0] === `minPower`) return setMinPower(el[1]);
          else if (el[0] === `maxPower`) return setMaxPower(el[1]);
        });
  }, []);

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
      fetchDataNo();
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
  const fetchDataNo = async () => {
    setIsLoading(true);

    let queries = "";
    if (make && make !== "Make") queries += `make=${make}&`;
    if (model) queries += `model=${model}&`;
    if (
      firstRegistrationFrom &&
      firstRegistrationFrom !== "First registration from"
    ) {
      queries += `firstRegistrationFrom=${firstRegistrationFrom}&`;
    }
    if (
      firstRegistrationTo &&
      firstRegistrationTo !== "First registration to"
    ) {
      queries += `firstRegistrationTo=${firstRegistrationTo}&`;
    }
    if (country && country !== "Pick country") queries += `country=${country}&`;
    if (mileageFrom) queries += `mileageFrom=${mileageFrom}&`;
    if (mileageTo) queries += `mileageTo=${mileageTo}&`;
    if (condition && condition !== "New/Used") {
      queries += `condition=${condition}&`;
    }
    if (fuel && fuel !== "Fuel") queries += `fuel=${fuel}&`;
    if (minPower) queries += `minPower=${minPower}&`;
    if (maxPower) queries += `maxPower=${maxPower}&`;
    if (priceFrom) queries += `priceFrom=${priceFrom}&`;
    if (priceTo) queries += `priceTo=${priceTo}`;

    if (queries.slice(-1) === "&" || queries.slice(-1) === "?") {
      queries = queries.slice(0, -1);
    }

    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/ad/searchNo/?${queries}`,
        {
          headers: {
            authorization: `Bearer ${loggedProfileData?.token}`,
          },
        }
      );
      setResultsNo(response.data.adsNo);
      setSearchId(queries);
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
        className="flex flex-col justify-between gap-2 mx-auto w-full md:p-2"
      >
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
            {/* First registration from select */}
            <select
              value={firstRegistrationFrom}
              onChange={handleSelectFirstRegistrationFrom}
              className="input input-bordered w-full"
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
              className="input input-bordered w-full"
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
              className="input input-bordered w-full text-black"
              minLength={1}
              maxLength={7}
              value={mileageFrom}
              onChange={handleChangeMileageFrom}
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
          onClick={() => clearFields(true)}
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
