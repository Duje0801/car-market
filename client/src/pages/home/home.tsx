import { useState } from "react";
import { SearchAds } from "../../components/home/searchAds";
import { Box1 } from "../../components/home/box1";
import { Box2 } from "../../components/home/box2";
import { MessageError } from "../../components/elements/messages/messageError";
import { NewestAds } from "../../components/home/newestAds";

export function Home() {
  //Errors from SearchAds are shown at the top of the home page (main)
  const [error, setError] = useState<string>("");

  return (
    <div>
      {/*Error box*/}
      {error && (
        <div className="mx-auto mb-6 w-[90vw] md:w-[70vw] lg:w-full lg:px-16">
          <MessageError message={error} />
        </div>
      )}
      <div className="flex flex-col lg:flex-row">
        {/*Search form - top/left*/}
        <div className="flex px-4 lg:w-2/3 lg:pl-6 lg:pr-4 xxl:pr-16 xxl:pl-6">
          <SearchAds setError={setError} />
        </div>
        {/*Boxes - middle/right*/}
        <div className="flex flex-col mt-6 gap-6 lg:mt-0 lg:px-4 lg:w-1/3 lg:pl-4 lg:pr-6 xxl:pl-16 xxl:pr-6">
          <Box1 />
          <Box2 />
        </div>
      </div>
      {/*5 newest ads*/}
      <div className="mx-auto w-[90vw] md:w-[70vw] lg:w-full lg:px-6">
        <NewestAds />
      </div>
    </div>
  );
}
