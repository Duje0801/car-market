import { SiAudi } from "react-icons/si";
import { SiBmw } from "react-icons/si";
import { SiCitroen } from "react-icons/si";
import { SiDacia } from "react-icons/si";
import { SiFiat } from "react-icons/si";
import { SiFord } from "react-icons/si";
import { SiMercedes } from "react-icons/si";
import { SiOpel } from "react-icons/si";
import { SiPeugeot } from "react-icons/si";
import { SiRenault } from "react-icons/si";
import { SiSkoda } from "react-icons/si";
import { SiVolkswagen } from "react-icons/si";
import { FaQuestion } from "react-icons/fa";

export function useMakeLogo(make: string) {
  if (make === "Audi") return <SiAudi className="my-auto text-3xl" />;
  else if (make === "BMW") return <SiBmw className="my-auto text-3xl" />;
  else if (make === "Citroën")
    return <SiCitroen className="my-auto text-3xl" />;
  else if (make === "Dacia") return <SiDacia className="my-auto text-3xl" />;
  else if (make === "Fiat") return <SiFiat className="my-auto text-3xl" />;
  else if (make === "Ford") return <SiFord className="my-auto text-3xl" />;
  else if (make === "Mercedes-Benz")
    return <SiMercedes className="my-auto text-3xl" />;
  else if (make === "Opel") return <SiOpel className="my-auto text-3xl" />;
  else if (make === "Peugeot")
    return <SiPeugeot className="my-auto text-3xl" />;
  else if (make === "Renault")
    return <SiRenault className="my-auto text-3xl" />;
  else if (make === "Skoda") return <SiSkoda className="my-auto text-3xl" />;
  else if (make === "Volkswagen")
    return <SiVolkswagen className="my-auto text-3xl" />;
  else if (make === "Other") return <FaQuestion className="my-auto text-3xl" />;
}
