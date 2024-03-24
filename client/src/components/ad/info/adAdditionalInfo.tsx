import { AdData } from "./adData";
import { AdSellerInfo } from "./adSellerInfo";
import { IAd } from "../../../interfaces/IAd";

interface Props {
  adData: IAd;
}

export function AdAdditionalInfo({ adData }: Props) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <AdData adData={adData} />
      <AdSellerInfo adData={adData} />
    </div>
  );
}
