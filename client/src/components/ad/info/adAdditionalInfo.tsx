import { AdData } from "./adData";
import { AdSellerInfo } from "./adSellerInfo";

export function AdAdditionalInfo() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <AdData />
      <AdSellerInfo />
    </div>
  );
}
