import { useEffect } from "react";
import { MessageWarning } from "../../components/elements/messages/messageWarning";

export function Jobs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="flex flex-col gap-2 w-[90vw] mx-auto text-justify">
      <p className="text-2xl font-bold my-2">Jobs</p>
      <main className="mx-auto w-[90vw]">
        <MessageWarning message={"There are currently no open positions"} />
      </main>
    </main>
  );
}
