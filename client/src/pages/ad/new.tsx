import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../../store";
import { catchErrors } from "../../utilis/catchErrors";
import { yearsData } from "../../data/years";
import { makes as makesList } from "../../data/makes";
import { fuel as fuelList } from "../../data/fuel";
import { condition as conditionList } from "../../data/condition";
import { countries as countriesList } from "../../data/countries";
import { UploadAdImages } from "../../components/ad/new/uploadAdImages";
import { WaitingDots } from "../../components/elements/waitingDots";
import { MessageError } from "../../components/elements/messages/messageError";
import { IImage } from "../../interfaces/IImage";
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
  const [adImages, setAdImages] = useState<IImage[]>([]);

  //Other states
  const [imgToShow, setImgToShow] = useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { loggedProfileData, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
  );

  const navigate = useNavigate();

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

  //Submit function
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (adImages.length < 1) {
      setError("Ad must have at least one image");
      setIsSaving(false);
      return;
    }

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

      await axios.post("http://localhost:4000/api/v1/ad/new", formData, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${loggedProfileData?.token}`,
        },
      });
      navigate("/redirect/ad/new");
    } catch (error) {
      catchErrors(error, setError);
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

  if (!isChecked) {
    {
      /* Loading user data */
    }
    return (
      <main>
        <WaitingDots size={"md"} marginTop={8} />{" "}
      </main>
    );
  } else if (!loggedProfileData.username) {
    {
      /* If the user is not logged in */
    }
    return (
      <main className="mx-auto w-[90vw]">
        <MessageError message={"You are already logged in!"} />
      </main>
    );
  } else {
    return (
      <main className="pb-2">
        {isSaving ? (
          <WaitingDots size={"md"} marginTop={8} />
        ) : (
          <>
            {error && (
              <main className="mx-auto w-[90vw]">
                <MessageError message={error} />
              </main>
            )}
            <form
              className="card bg-base-200 p-4 gap-2 shadow-xl mx-auto mt-2 rounded-lg w-[90vw]"
              onSubmit={handleSubmit}
            >
              <div className="card-body p-4">
                <p className="card-title text-3xl">Create New Ad</p>
                {/* Title input */}
                <label className="form-control w-full max-w-xs">
                  <div className="label p-0">
                    <span className="label-text">Title</span>
                  </div>
                  <input
                    type="text"
                    minLength={5}
                    maxLength={50}
                    value={title}
                    onChange={handleChangeTitle}
                    className="input input-bordered w-full max-w-xs"
                    required
                  />
                </label>
                {/* Condition select */}
                <label className="form-control w-full max-w-xs">
                  <div className="label p-0">
                    <span className="label-text">Condition</span>
                  </div>
                  <select
                    value={condition}
                    onChange={handleSelectCondition}
                    className="input input-bordered w-full"
                    required
                  >
                    <option key={0}></option>
                    {conditionList.map((c, i) => {
                      return (
                        <option key={i + 1} value={c}>
                          {c}
                        </option>
                      );
                    })}
                  </select>
                </label>
                {/* Country select */}
                <label className="form-control w-full max-w-xs">
                  <div className="label p-0">
                    <span className="label-text">Country</span>
                  </div>
                  <select
                    value={country}
                    onChange={handleSelectCountry}
                    className="input input-bordered w-full"
                    required
                  >
                    <option key={0}></option>
                    {countriesList.map((c, i) => {
                      return (
                        <option key={i + 1} value={c}>
                          {c}
                        </option>
                      );
                    })}
                  </select>
                </label>
                {/* Make select */}
                <label className="form-control w-full max-w-xs">
                  <div className="label p-0">
                    <span className="label-text">Make</span>
                  </div>
                  <select
                    value={make}
                    onChange={handleSelectMake}
                    className="input input-bordered w-full"
                    required
                  >
                    <option key={0}></option>
                    {makesList.map((m, i) => {
                      return (
                        <option key={i + 1} value={m}>
                          {m}
                        </option>
                      );
                    })}
                  </select>
                </label>
                {/* Model input */}
                <label className="form-control w-full max-w-xs">
                  <div className="label p-0">
                    <span className="label-text">Model</span>
                  </div>
                  <input
                    type="text"
                    minLength={1}
                    maxLength={20}
                    value={model}
                    onChange={handleChangeModel}
                    className="input input-bordered w-full max-w-xs"
                    required
                  />
                </label>
                {/* First registration select */}
                <label className="form-control w-full max-w-xs">
                  <div className="label p-0">
                    <span className="label-text">First Registration</span>
                  </div>
                  <select
                    value={firstRegistration}
                    onChange={handleSelectFirstRegistration}
                    className="input input-bordered w-full"
                    required
                  >
                    <option key={0}></option>
                    {years.map((m, i) => {
                      return (
                        <option key={i + 1} value={m}>
                          {m}
                        </option>
                      );
                    })}
                  </select>
                </label>
                {/* Mileage input */}
                <label className="form-control w-full max-w-xs">
                  <div className="label p-0">
                    <span className="label-text">Mileage</span>
                  </div>
                  <input
                    type="text"
                    placeholder="km"
                    minLength={1}
                    maxLength={7}
                    value={mileage}
                    onChange={handleChangeMileage}
                    className="input input-bordered w-full max-w-xs"
                    required
                  />
                </label>
                {/* Fuel select */}
                <label className="form-control w-full max-w-xs">
                  <div className="label p-0">
                    <span className="label-text">Fuel</span>
                  </div>
                  <select
                    value={fuel}
                    onChange={handleSelectFuel}
                    className="input input-bordered w-full"
                    required
                  >
                    <option key={0}></option>
                    {fuelList.map((m, i) => {
                      return (
                        <option key={i + 1} value={m}>
                          {m}
                        </option>
                      );
                    })}
                  </select>
                </label>
                {/* Power input */}
                <label className="form-control w-full max-w-xs">
                  <div className="label p-0">
                    <span className="label-text">Power</span>
                  </div>
                  <input
                    type="text"
                    placeholder="kW"
                    minLength={1}
                    maxLength={4}
                    value={power}
                    onChange={handleChangePower}
                    className="input input-bordered w-full max-w-xs"
                    required
                  />
                </label>
                {/* Price input */}
                <label className="form-control w-full max-w-xs">
                  <div className="label p-0">
                    <span className="label-text">Price</span>
                  </div>
                  <input
                    type="text"
                    placeholder="€"
                    minLength={1}
                    maxLength={8}
                    value={price}
                    onChange={handleChangePrice}
                    className="input input-bordered w-full max-w-xs"
                    required
                  />
                </label>
                {/* Description textarea */}
                <label className="form-control">
                  <div className="label p-0">
                    <span className="label-text">Description</span>
                  </div>
                  <textarea
                    className="textarea textarea-bordered h-24 max-w-xs"
                    placeholder="..."
                    value={description}
                    onChange={handleChangeDescription}
                    maxLength={1000}
                    rows={3}
                    cols={75}
                  ></textarea>
                </label>
                {/* Upload images */}
                <UploadAdImages
                  setError={setError}
                  adImages={adImages}
                  setAdImages={setAdImages}
                  imgToShow={imgToShow}
                  setImgToShow={setImgToShow}
                />
                {/* Clear all button */}
                <div className="card-actions justify-end">
                  <button
                    type="button"
                    className="btn btn-error w-full"
                    onClick={handleClearAll}
                  >
                    Clear All
                  </button>
                </div>
                {/* Submit button */}
                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn bg-black text-white w-full"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </main>
    );
  }
}
