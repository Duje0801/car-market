import { FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import { IImageData } from "../interfaces/IImageData";
import { store } from "../store";
import { yearsData } from "../data/years";
import { makes as makesList } from "../data/makes";
import { fuel as fuelList } from "../data/fuel";
import { condition as conditionList } from "../data/condition";
import { countries as countriesList } from "../data/countries";
import { UploadAdImages } from "./uploadAdImages";
import { Hourglass } from "react-loader-spinner";
import axios from "axios";

export function NewAd() {
  //Form data states
  const [title, setTitle] = useState<string>("");
  const [condition, setCondition] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [make, setMake] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [firstRegistration, setFirstRegistration] = useState<number | string>(
    ""
  );
  const [mileage, setMileage] = useState<string>("");
  const [fuel, setFuel] = useState<string>("");
  const [power, setPower] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [adImages, setAdImages] = useState<IImageData[]>([]);

  //Other states
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { data, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  const years = yearsData();

  //Form data states changes
  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSelectCondition = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCondition(event.target.value);
  };

  const handleSelectCountry = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCountry(event.target.value);
  };

  const handleSelectMake = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMake(event.target.value);
  };

  const handleChangeModel = (event: React.ChangeEvent<HTMLInputElement>) => {
    setModel(event.target.value);
  };

  const handleChangeMileage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (/^\d*$/.test(event.target.value)) {
      setMileage(event.target.value);
    }
  };

  const handleSelectFirstRegistration = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFirstRegistration(event.target.value);
  };

  const handleChangePower = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (/^\d*$/.test(event.target.value)) {
      setPower(event.target.value);
    }
  };

  const handleChangePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (/^\d*$/.test(event.target.value)) {
      setPrice(event.target.value);
    }
  };

  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleSelectFuel = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFuel(event.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("condition", condition);
      formData.append("country", country);
      formData.append("make", make);
      formData.append("model", model);
      formData.append("firstRegistration", String(firstRegistration));
      formData.append("mileage", mileage);
      formData.append("fuel", fuel);
      formData.append("power", power);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("adImages", JSON.stringify(adImages));

      if (adImages.length < 1) {
        setError("Ad must have at least one image");
        setIsSaving(false);
        return;
      }

      await axios.post("http://localhost:4000/api/v1/ad/newAd", formData, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${data?.token}`,
        },
      });
      handleClearAll();
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
    setIsSaving(false);
  };

  //Clear button click
  const handleClearAll = () => {
    setError("");
    setTitle("");
    setCondition("");
    setCountry("");
    setMake("");
    setModel("");
    setFirstRegistration("");
    setMileage("");
    setFuel("");
    setPower("");
    setPrice("");
    setDescription("");
    setAdImages([]);
  };

  if (!isChecked) return <div>Loading...</div>;
  else if (!data.username) {
    return <div>Only logged users can see this page!</div>;
  } else {
    return (
      <>
        <form className="m-2 p-2 border-2 border-black" onSubmit={handleSubmit}>
          <div>Create New Add:</div>
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <label htmlFor="titleField">Title:</label>
            <input
              type="text"
              minLength={5}
              maxLength={50}
              id="titleField"
              value={title}
              onChange={handleChangeTitle}
              className="border-2 border-black"
              required
            />{" "}
          </div>
          <div>
            <label htmlFor="conditionField">Condition:</label>
            <select
              className="border-2 border-black"
              value={condition}
              onChange={handleSelectCondition}
            >
              {conditionList.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="countryField">Country:</label>
            <select
              className="border-2 border-black"
              value={country}
              onChange={handleSelectCountry}
            >
              {countriesList.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
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
              required
            />{" "}
          </div>
          <div>
            <label htmlFor="makeField">First Registration:</label>
            <select
              className="border-2 border-black"
              value={firstRegistration}
              onChange={handleSelectFirstRegistration}
            >
              {years.map((y, i) => (
                <option key={i} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="mileageField">Mileage:</label>
            <input
              type="text"
              minLength={1}
              maxLength={7}
              id="mileageField"
              value={mileage}
              onChange={handleChangeMileage}
              className="border-2 border-black"
              required
            />{" "}
            km
          </div>
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
            <label htmlFor="powerField">Power:</label>
            <input
              type="text"
              minLength={1}
              maxLength={4}
              id="powerField"
              value={power}
              onChange={handleChangePower}
              className="border-2 border-black"
              required
            />{" "}
            kW
          </div>
          <div>
            <label htmlFor="priceField">Price:</label>
            <input
              type="text"
              minLength={1}
              maxLength={8}
              id="priceField"
              value={price}
              onChange={handleChangePrice}
              className="border-2 border-black"
              required
            />{" "}
            €
          </div>
          <div>
            <label htmlFor="textInput">Description:</label>
            <textarea
              id="textInput"
              className="border-2 border-black"
              value={description}
              onChange={handleChangeDescription}
              rows={4}
              cols={75}
            />
          </div>
          <UploadAdImages
            setError={setError}
            adImages={adImages}
            setAdImages={setAdImages}
          />
          <button type="submit" className="btn">
            Submit
          </button>
          <button type="button" className="btn" onClick={handleClearAll}>
            Clear All
          </button>
        </form>
        {isSaving && (
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
}
