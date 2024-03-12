import { FormEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addAdData } from "../../../store/slices/ad";
import { store } from "../../../store";
import { IImageData } from "../../../interfaces/IImageData";
import { yearsData } from "../../../data/years";
import { makes as makesList } from "../../../data/makes";
import { fuel as fuelList } from "../../../data/fuel";
import { condition as conditionList } from "../../../data/condition";
import { countries as countriesList } from "../../../data/countries";
import { UploadAdImages } from "../new/uploadAdImages";
import { WaitingDots } from "../../elements/waitingDots";
import { MessageSuccessfully } from "../../elements/messages/messageSuccessfully";
import { MessageWarning } from "../../elements/messages/messageWarning";
import { IAd } from "../../../interfaces/IAd";
import axios from "axios";

interface Props {
  adData: IAd | null;
}

export function EditAd({ adData }: Props) {
  //Form data states
  const [title, setTitle] = useState<string>(adData?.title || "");
  const [condition, setCondition] = useState<string>(adData?.condition || "");
  const [country, setCountry] = useState<string>(adData?.country || "");
  const [make, setMake] = useState<string>(adData?.make || "");
  const [model, setModel] = useState<string>(adData?.model || "");
  const [firstRegistration, setFirstRegistration] = useState<number | string>(
    adData?.firstRegistration || ""
  );
  const [mileage, setMileage] = useState<string>(String(adData?.mileage || ""));
  const [fuel, setFuel] = useState<string>(adData?.fuel || "");
  const [power, setPower] = useState<string>(String(adData?.power || ""));
  const [price, setPrice] = useState<string>(String(adData?.price || ""));
  const [description, setDescription] = useState<string>(
    String(adData?.description || "")
  );
  const [adImages, setAdImages] = useState<IImageData[]>(adData?.images || []);

  //Other states
  const [imgToShow, setImgToShow] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { loggedProfileData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
  );

  const params = useParams();
  const dispatch = useDispatch()

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

  //Submit new ad data
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

      if (adImages.length < 1 || adImages.length > 10) {
        setError("Ad must have between 1 and 10 images");
        setIsSaving(false);
        return;
      }

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
      const deletedImagesMessage = await deleteImage();
      setMessage(response.data.message + ". " + deletedImagesMessage);
      dispatch(addAdData(response.data.ad))
      setImgToShow(0);
    } catch (error: any) {
      if (
        error?.response?.data?.status === "fail" &&
        typeof error?.response?.data?.message === `string`
      ) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Something went wrong.");
      }
    }
    setIsSaving(false);
  };

  //Deleting images (from Cloudinary DB)
  const deleteImage = async () => {
    let imagesDeleteList: string[] = [];

    const adImagesMapped = adImages.map((img) => img.publicID);
    adData?.images.forEach((img) => {
      if (!adImagesMapped.includes(img.publicID)) {
        imagesDeleteList.push(img.publicID);
      }
    });

    if (imagesDeleteList.length === 0) return "";

    //Creating fetch for all images
    const promises = imagesDeleteList.map((publicID) =>
      axios.delete(
        `http://localhost:4000/api/v1/user/deleteImage/${publicID}`,
        {
          headers: {
            authorization: `Bearer ${loggedProfileData?.token}`,
          },
        }
      )
    );

    try {
      //Deleting images
      await Promise.all(promises);
      return "All ad images designated for deletion have been deleted";
    } catch (error: any) {
      return "Some of the ad images designated for deletion have not been deleted";
    }
  };

  const handleClickX = () => {
    setMessage("");
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
            <form className="card gap-2 mx-auto" onSubmit={handleSubmit}>
              <h3 className="font-bold text-lg mb-2">Edit Ad</h3>
              {message && (
                <div className="mx-auto w-full">
                  <MessageSuccessfully message={message} />
                </div>
              )}
              {error && <p className="text-red-500">{error}</p>}
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
                setError={setMessage}
                adImages={adImages}
                setAdImages={setAdImages}
                imgToShow={imgToShow}
                setImgToShow={setImgToShow}
              />
              <div className="label pt-1">
                <span className="label-text-alt text-[0.75rem]">
                  *To confirm add/delete image click `submit` button
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
    </>
  );
}
