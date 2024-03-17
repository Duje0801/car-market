import { useEffect } from "react";
import { MessageWarning } from "../../components/elements/messages/messageWarning";

export function Jobs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col gap-2 w-[90vw] mx-auto text-justify">
      <p className="text-2xl font-bold my-2">Jobs</p>
      <div className="mx-auto w-[80vw] md:w-[50vw] lg:w-[30vw]">
        <MessageWarning message={"There are currently no open positions"} />
      </div>
    </div>
  );
}
