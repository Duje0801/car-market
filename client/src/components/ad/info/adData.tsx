import { useSelector } from "react-redux";
import { store } from "../../../store";
import { useCreateAtToString } from "../../../hooks/useCreateAtToString";

export function AdData() {
  const { adData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.ad
  );

  const createdAt = useCreateAtToString(adData?.createdAt);

  const randomNumber = Math.floor(Math.random() * 1000) + 1;

  return (
    <div className="bg-base-200 p-4 shadow-xl mx-auto rounded-lg w-[90vw] md:w-full lg:w-1/2 lg:ml-0 lg:mr-auto">
      <p className="text-xl font-bold text-center mb-2">Ad Data:</p>
      <div className="text-center lg:text-left">
        <p>
          <b>Created at:</b> {createdAt}.
        </p>
        <p>
          <b>Hits:</b> {randomNumber} times
        </p>
        <p>
          <b>Location:</b> {adData?.location ? `${adData?.location}, ` : ``}{" "}
          {adData?.country}
        </p>
      </div>
    </div>
  );
}
