import { FormEvent, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { store } from "../../store";
import { catchErrors } from "../../utilis/catchErrors";
import { deleteNewAdImages } from "../../utilis/deleteImagesFromDB/deleteNewAdImages";
import { EditAdImagesModal } from "../../components/ad/modals/editAdImagesModal";
import { UploadAdImages } from "../../components/ad/uploadImages/uploadAdImages";
import { WaitingDots } from "../../components/elements/waitingDots";
import { MessageError } from "../../components/elements/messages/messageError";
import { MessageSuccessfully } from "../../components/elements/messages/messageSuccessfully";
import { yearsData } from "../../data/years";
import { makes as makesList } from "../../data/makes";
import { fuel as fuelList } from "../../data/fuel";
import { gearbox as gearboxList } from "../../data/gearbox";
import { condition as conditionList } from "../../data/condition";
import { IImage } from "../../interfaces/IImage";
import axios from "axios";

export function NewAd() {
  //Form data states
  const [title, setTitle] = useState<string>("");
  const [condition, setCondition] = useState<string>("");
  const [make, setMake] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [firstRegistration, setFirstRegistration] = useState<number | string>(
    ""
  );
  const [mileage, setMileage] = useState<string>("");
  const [fuel, setFuel] = useState<string>("");
  const [gearbox, setGearbox] = useState<string>("");
  const [power, setPower] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [adImages, setAdImages] = useState<IImage[]>([]);

  //Other states
  const [imgToShow, setImgToShow] = useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [lockedNewCar, setLockedNewCar] = useState<boolean>(false);

  //Reason why this is in the parent element,
  //after clicking on the clear all button
  //it will delete both successful and error messages

  //UploadAdImagesStates
  const [messageImgSuccess, setMessageImgSuccess] = useState<string>("");
  const [messageImgError, setMessageImgError] = useState<string>("");

  const { loggedProfileData, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
  );

  //File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const years = yearsData();

  //Form data states changes
  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSelectCondition = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCondition(event.target.value);
    if (event.target.value === "New") {
      setMileage("0");
      setFirstRegistration("-");
      setMessage(
        "New cars automatically have their mileage set to 0 and no first registration."
      );
      setLockedNewCar(true);
    } else {
      setMileage("");
      setFirstRegistration("");
      setLockedNewCar(false);
    }
  };

  const handleSelectMake = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMake(event.target.value);
  };

  const handleChangeModel = (event: React.ChangeEvent<HTMLInputElement>) => {
    setModel(event.target.value);
  };

  const handleChangeMileage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (condition === "New") return;
    if (/^\d*$/.test(event.target.value)) {
      setMileage(event.target.value);
    }
  };

  const handleSelectFirstRegistration = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (condition === "New") return;
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

  const handleSelectFuel = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFuel(event.target.value);
  };

  const handleSelectGearbox = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGearbox(event.target.value);
  };

  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
  };

  //New ad submit function
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("condition", condition);
      formData.append("make", make);
      formData.append("model", model);
      formData.append("firstRegistration", String(firstRegistration));
      formData.append("mileage", mileage);
      formData.append("fuel", fuel);
      formData.append("gearbox", gearbox);
      formData.append("power", power);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("adImages", JSON.stringify(adImages));

      const response = await axios.post(
        "https://car-market-production.up.railway.app/api/v1/car/new",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${loggedProfileData?.token}`,
          },
        }
      );
      handleClearAll(`submit`);
      setError("");
      setMessage(response.data.message);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error: any) {
      setMessage("");
      setMessageImgSuccess("");
      setMessageImgError("");
      catchErrors(error, setError);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    setIsSaving(false);
  };

  //Clear all button click
  const handleClearAll = async (operation: string) => {
    setError("");
    setTitle("");
    setCondition("");
    setMake("");
    setModel("");
    setFirstRegistration("");
    setMileage("");
    setFuel("");
    setPower("");
    setPrice("");
    setDescription("");
    setMessageImgSuccess("");
    setMessageImgError("");
    setAdImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    //There are two tyes of clear all:
    //1. after submit images will not be deleted from Cloudinary DB
    //2. after clear all, all images will be deleted from Cloudinary DB
    if (operation === `clear`) {
      const deleteImageResponse = await deleteNewAdImages(
        loggedProfileData,
        adImages
      );
      setMessage("All inputs and " + deleteImageResponse);
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  //Deleting image/s (from adImages array and Cloudinary DB)
  const handleModalClick = async (operation: string) => {
    //Removing one image from images array (adImages)
    if (operation === `deleteOne`) {
      const updatedadImagesArray = [...adImages];
      updatedadImagesArray.splice(imgToShow, 1);
      const publicID = adImages[imgToShow].publicID;
      const deleteImageResponse = await deleteNewAdImages(
        loggedProfileData,
        adImages,
        publicID
      );
      setMessageImgSuccess(deleteImageResponse);
      setAdImages([...updatedadImagesArray]);
      setImgToShow(0);
    }
    //Removing all images from images array (adImages)
    else if (operation === `deleteAll`) {
      const deleteImageResponse = await deleteNewAdImages(
        loggedProfileData,
        adImages
      );
      setMessageImgSuccess(deleteImageResponse);
      setAdImages([]);
    }
  };

  if (!isChecked) {
    {
      /* Loading user data */
    }
    return (
      <div>
        <WaitingDots size={"md"} marginTop={8} />{" "}
      </div>
    );
  } else if (!loggedProfileData.username) {
    {
      /* If the user is not logged in */
    }
    return (
      <div className="mx-auto w-[90vw]">
        <MessageError message={"You are already logged in!"} />
      </div>
    );
  } else {
    return (
      <>
        {isSaving ? (
          <WaitingDots size={"md"} marginTop={8} />
        ) : (
          <form
            className="card bg-base-200 p-4 gap-2 shadow-xl mx-auto rounded-lg w-[80vw] md:w-[50vw]"
            onSubmit={handleSubmit}
          >
            <div className="card-body p-0">
              <p className="card-title mx-auto text-3xl xxl:text-4xl">
                Create New Ad
              </p>
              {/* Messages */}
              {message && (
                <div className="mx-auto max-w-lg xxl:max-w-2xl w-full">
                  <MessageSuccessfully message={message} />
                </div>
              )}
              {error && (
                <div className="mx-auto max-w-lg xxl:max-w-2xl w-full">
                  <MessageError message={error} />
                </div>
              )}
              {/* Title input */}
              <label className="form-control w-full mx-auto max-w-lg xxl:max-w-2xl">
                <div className="label p-0">
                  <span className="label-text xxl:text-xl">Title</span>
                </div>
                <input
                  type="text"
                  minLength={5}
                  maxLength={30}
                  value={title}
                  onChange={handleChangeTitle}
                  className="input input-bordered w-full mx-auto max-w-lg xxl:max-w-2xl xxl:text-xl"
                  required
                />
              </label>
              {/* Condition select */}
              <label className="form-control w-full mx-auto max-w-lg xxl:max-w-2xl">
                <div className="label p-0">
                  <span className="label-text xxl:text-xl">Condition</span>
                </div>
                <select
                  value={condition}
                  onChange={handleSelectCondition}
                  className="input input-bordered w-full xxl:text-xl"
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
              {/* Make select */}
              <label className="form-control w-full mx-auto max-w-lg xxl:max-w-2xl">
                <div className="label p-0">
                  <span className="label-text xxl:text-xl">Make</span>
                </div>
                <select
                  value={make}
                  onChange={handleSelectMake}
                  className="input input-bordered w-full xxl:text-xl"
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
              <label className="form-control w-full mx-auto max-w-lg xxl:max-w-2xl">
                <div className="label p-0">
                  <span className="label-text xxl:text-xl">Model</span>
                </div>
                <input
                  type="text"
                  minLength={1}
                  maxLength={20}
                  value={model}
                  onChange={handleChangeModel}
                  className="input input-bordered w-full mx-auto max-w-lg xxl:max-w-2xl xxl:text-xl"
                  required
                />
              </label>
              {/* First registration select */}
              <label className="form-control w-full mx-auto max-w-lg xxl:max-w-2xl">
                <div className="label p-0">
                  <span className="label-text xxl:text-xl">
                    First Registration
                  </span>
                </div>
                <select
                  value={firstRegistration}
                  onChange={handleSelectFirstRegistration}
                  className="input input-bordered w-full xxl:text-xl"
                  disabled={lockedNewCar}
                  required
                >
                  <option key={0}></option>
                  {years.map((y, i) => {
                    if (y === "-" && !lockedNewCar) return;
                    return (
                      <option key={i + 1} value={y}>
                        {y}
                      </option>
                    );
                  })}
                </select>
              </label>
              {/* Mileage input */}
              <label className="form-control w-full mx-auto max-w-lg xxl:max-w-2xl">
                <div className="label p-0">
                  <span className="label-text xxl:text-xl">Mileage</span>
                </div>
                <input
                  type="text"
                  placeholder="km"
                  minLength={1}
                  maxLength={7}
                  value={mileage}
                  onChange={handleChangeMileage}
                  className="input input-bordered w-full mx-auto max-w-lg xxl:max-w-2xl xxl:text-xl"
                  disabled={lockedNewCar}
                  required
                />
              </label>
              {/* Fuel select */}
              <label className="form-control w-full mx-auto max-w-lg xxl:max-w-2xl">
                <div className="label p-0">
                  <span className="label-text xxl:text-xl">Fuel</span>
                </div>
                <select
                  value={fuel}
                  onChange={handleSelectFuel}
                  className="input input-bordered w-full xxl:text-xl"
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
              {/* Gearbox select */}
              <label className="form-control w-full mx-auto max-w-lg xxl:max-w-2xl">
                <div className="label p-0">
                  <span className="label-text xxl:text-xl">Gearbox</span>
                </div>
                <select
                  value={gearbox}
                  onChange={handleSelectGearbox}
                  className="input input-bordered w-full xxl:text-xl"
                  required
                >
                  <option key={0}></option>
                  {gearboxList.map((g, i) => {
                    return (
                      <option key={i + 1} value={g}>
                        {g}
                      </option>
                    );
                  })}
                </select>
              </label>
              {/* Power input */}
              <label className="form-control w-full mx-auto max-w-lg xxl:max-w-2xl">
                <div className="label p-0">
                  <span className="label-text xxl:text-xl">Power</span>
                </div>
                <input
                  type="text"
                  placeholder="kW"
                  minLength={1}
                  maxLength={4}
                  value={power}
                  onChange={handleChangePower}
                  className="input input-bordered w-full mx-auto max-w-lg xxl:max-w-2xl xxl:text-xl"
                  required
                />
              </label>
              {/* Price input */}
              <label className="form-control w-full mx-auto max-w-lg xxl:max-w-2xl">
                <div className="label p-0">
                  <span className="label-text xxl:text-xl">Price</span>
                </div>
                <input
                  type="text"
                  placeholder="€"
                  minLength={1}
                  maxLength={8}
                  value={price}
                  onChange={handleChangePrice}
                  className="input input-bordered w-full mx-auto max-w-lg xxl:max-w-2xl xxl:text-xl"
                  required
                />
              </label>
              {/* Description textarea */}
              <label className="form-control">
                <div className="label p-0">
                  <span className="label-text max-w-lg xxl:max-w-2xl md:mx-auto xxl:text-xl">
                    Description
                  </span>
                </div>
                <textarea
                  className="textarea textarea-bordered w-full mx-auto max-w-lg xxl:max-w-2xl text-base xxl:text-xl"
                  placeholder="..."
                  value={description}
                  onChange={handleChangeDescription}
                  maxLength={1000}
                  rows={4}
                  cols={50}
                ></textarea>
              </label>
              {/* Upload images */}
              <UploadAdImages
                setError={setError}
                adImages={adImages}
                setAdImages={setAdImages}
                imgToShow={imgToShow}
                setImgToShow={setImgToShow}
                messageImgSuccess={messageImgSuccess}
                setMessageImgSuccess={setMessageImgSuccess}
                messageImgError={messageImgError}
                setMessageImgError={setMessageImgError}
                fileInputRef={fileInputRef}
              />
              {/* Clear all button */}
              <div className="card-actions justify-end">
                <button
                  type="button"
                  className="btn btn-error w-full mx-auto max-w-lg xxl:max-w-2xl xxl:text-xl"
                  onClick={() => handleClearAll(`clear`)}
                >
                  Clear All
                </button>
              </div>
              {/* Submit button */}
              <div className="card-actions justify-end">
                <button
                  type="submit"
                  className="btn bg-black text-white w-full mx-auto max-w-lg xxl:max-w-2xl xxl:text-xl"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        )}
        {/* Edit Uploaded Image Modal */}
        <EditAdImagesModal handleModalClick={handleModalClick} />
      </>
    );
  }
}
