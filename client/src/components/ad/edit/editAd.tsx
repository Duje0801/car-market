import { FormEvent, useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addAdData } from "../../../store/slices/ad";
import { useCarouselImgContext } from "../../../context/carouselImgContext";
import { catchErrors } from "../../../utilis/catchErrors";
import { deleteImageEditingAd } from "../../../utilis/deleteImageEditingAd";
import { handleOpenModal } from "../../../utilis/handleOpenModal";
import { WaitingDots } from "../../elements/waitingDots";
import { MessageError } from "../../elements/messages/messageError";
import { MessageSuccessfully } from "../../elements/messages/messageSuccessfully";
import { MessageWarning } from "../../elements/messages/messageWarning";
import { UploadAdImages } from "../uploadImages/uploadAdImages";
import { EditAdImagesModal } from "../modals/editAdImagesModal";
import { yearsData } from "../../../data/years";
import { makes as makesList } from "../../../data/makes";
import { fuel as fuelList } from "../../../data/fuel";
import { gearbox as gearboxList } from "../../../data/gearbox";
import { condition as conditionList } from "../../../data/condition";
import { IImage } from "../../../interfaces/IImage";
import { IAd } from "../../../interfaces/IAd";
import { ILoggedProfile } from "../../../interfaces/ILoggedProfile";
import axios from "axios";

interface Props {
  loggedProfileData: ILoggedProfile;
  adData: IAd | null;
}

export function EditAd({ loggedProfileData, adData }: Props) {
  //Form data states
  const [title, setTitle] = useState<string>(adData?.title || "");
  const [condition, setCondition] = useState<string>(adData?.condition || "");
  const [make, setMake] = useState<string>(adData?.make || "");
  const [model, setModel] = useState<string>(adData?.model || "");
  const [firstRegistration, setFirstRegistration] = useState<number | string>(
    adData?.firstRegistration || ""
  );
  const [mileage, setMileage] = useState<string>(String(adData?.mileage || ""));
  const [fuel, setFuel] = useState<string>(adData?.fuel || "");
  const [gearbox, setGearbox] = useState<string>(adData?.gearbox || "");
  const [power, setPower] = useState<string>(String(adData?.power || ""));
  const [price, setPrice] = useState<string>(String(adData?.price || ""));
  const [description, setDescription] = useState<string>(
    String(adData?.description || "")
  );
  const [adImages, setAdImages] = useState<IImage[]>(adData?.images || []);

  //Other states
  const [imgToShow, setImgToShow] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lockedNewCar, setLockedNewCar] = useState<boolean>(false);

  //Reason why this is in the parent element,
  //after clicking on the clear all button (in /src/pages/ad/new.tsx),
  //or submitting ad edits (in this file)
  //it will delete both successful and error messages

  //UploadAdImagesStates
  const [messageImgSuccess, setMessageImgSuccess] = useState<string>("");
  const [messageImgError, setMessageImgError] = useState<string>("");

  const { carouselImgDispatch } = useCarouselImgContext();

  const params = useParams();
  const dispatch = useDispatch();

  //File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const years = yearsData();

  useEffect(() => {
    if (condition === "New") {
      setFirstRegistration("-");
      setMileage("0");
      setLockedNewCar(true);
    }
  }, []);

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

  //Submit new ad data
  const handleSubmitNewData = async (e: FormEvent) => {
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

      const response = await axios.patch(
        `http://localhost:4000/api/v1/ad/edit/${params.id}`,
        formData,
        {
          headers: {
            authorization: `Bearer ${loggedProfileData?.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const deletedImagesMessage = await deleteImageEditingAd(
        loggedProfileData,
        adData,
        adImages
      );
      setMessage(response.data.message + ". " + deletedImagesMessage);
      carouselImgDispatch({ type: "SET_IMG_NO", payload: 0 });
      dispatch(addAdData(response.data.ad));
      setError("");
      setMessageImgError("");
      setMessageImgSuccess("");
      setImgToShow(0);
    } catch (error) {
      setMessage("");
      setMessageImgSuccess("");
      setMessageImgError("");
      catchErrors(error, setError);
    }
    setIsSaving(false);
  };

  //Deleting image from images array
  //(images are not deleted from Cloudinary DB now, 
  //images will be deleted from Cloudinary DB after edit form is submitted)
  const handleModalClick = async (operation: string) => {
    if (operation === `deleteOne`) {
      //Removing one image from images array (adImages)
      const updatedadImagesArray = [...adImages];
      updatedadImagesArray.splice(imgToShow, 1);
      setMessageImgSuccess("Image deleted");
      setAdImages([...updatedadImagesArray]);
      setImgToShow(0);
    } else if (operation === `deleteAll`) {
      //Removing all images from images array (adImages)
      setMessageImgSuccess("Deleted all images");
      setAdImages([]);
    }
  };

  //Click on X (top right) or cancel button
  const handleClickX = () => {
    setMessage("");
    setError("");
    setMessageImgSuccess("");
    setMessageImgError("");
  };

  return (
    <>
      <div className="modal-box">
        {isSaving ? (
          <WaitingDots size="md" marginTop={2} />
        ) : (
          <>
            {/* X - top right */}
            <form method="dialog">
              <button
                onClick={handleClickX}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              >
                ✕
              </button>
            </form>
            {/* Edit form */}
            <form
              className="card gap-2 mx-auto w-full"
              onSubmit={handleSubmitNewData}
            >
              <h3 className="font-bold text-lg mb-2">Edit Ad</h3>
              {message && (
                <div className="mx-auto w-full">
                  <MessageSuccessfully message={message} />
                </div>
              )}
              {error && (
                <div className="mx-auto w-full">
                  <MessageError message={error} />
                </div>
              )}
              {/* Title input */}
              <label className="form-control w-full">
                <div className="label p-0">
                  <span className="label-text">Title</span>
                </div>
                <input
                  type="text"
                  minLength={5}
                  maxLength={30}
                  value={title}
                  onChange={handleChangeTitle}
                  className="input input-bordered w-full"
                  required
                />
              </label>
              {/* Condition select */}
              <label className="form-control w-full">
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
              {/* Make select */}
              <label className="form-control w-full">
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
              <label className="form-control w-full">
                <div className="label p-0">
                  <span className="label-text">Model</span>
                </div>
                <input
                  type="text"
                  minLength={1}
                  maxLength={20}
                  value={model}
                  onChange={handleChangeModel}
                  className="input input-bordered w-full"
                  required
                />
              </label>
              {/* First registration select */}
              <label className="form-control w-full">
                <div className="label p-0">
                  <span className="label-text">First Registration</span>
                </div>
                <select
                  value={firstRegistration}
                  onChange={handleSelectFirstRegistration}
                  className="input input-bordered w-full"
                  disabled={lockedNewCar}
                  required
                >
                  <option key={0}></option>
                  {years.map((y, i) => {
                    if (y === "-" && !lockedNewCar) return;
                    else
                      return (
                        <option key={i + 1} value={y}>
                          {y}
                        </option>
                      );
                  })}
                </select>
              </label>
              {/* Mileage input */}
              <label className="form-control w-full">
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
                  className="input input-bordered w-full"
                  disabled={lockedNewCar}
                  required
                />
              </label>
              {/* Fuel select */}
              <label className="form-control w-full">
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
              {/* Gearbox select */}
              <label className="form-control w-full">
                <div className="label p-0">
                  <span className="label-text">Gearbox</span>
                </div>
                <select
                  value={gearbox}
                  onChange={handleSelectGearbox}
                  className="input input-bordered w-full"
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
              <label className="form-control w-full">
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
                  className="input input-bordered w-full"
                  required
                />
              </label>
              {/* Price input */}
              <label className="form-control w-full">
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
                  className="input input-bordered w-full"
                  required
                />
              </label>
              {/* Description textarea */}
              <label className="form-control">
                <div className="label p-0">
                  <span className="label-text">Description</span>
                </div>
                <textarea
                  className="textarea textarea-bordered h-24"
                  placeholder="..."
                  value={description}
                  onChange={handleChangeDescription}
                  maxLength={1000}
                  rows={3}
                  cols={75}
                ></textarea>
              </label>
              {adImages.length !== adData?.images.length && (
                <div className="mx-auto w-full">
                  <MessageWarning
                    message={
                      "The image gallery of this ad has changed, please click the submit button to confirm changes."
                    }
                  />
                </div>
              )}
              {/* Images uploading and deleting */}
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
                handleOpenModal={handleOpenModal}
              />
              <div className="label pt-1">
                <span className="label-text-alt text-[0.75rem]">
                  *To confirm add/delete image click Submit button
                </span>
              </div>
              {/* Submit button */}
              <button type="submit" className="btn btn-error w-full">
                Submit
              </button>
            </form>
            {/* Cancel button */}
            <form method="dialog">
              <button onClick={handleClickX} className="btn w-full mt-2">
                Cancel
              </button>
            </form>
          </>
        )}
      </div>
      {/* Edit Uploaded Image Modal */}
      <EditAdImagesModal handleModalClick={handleModalClick} />
    </>
  );
}
