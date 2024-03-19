import { AdSellerInfo } from "../../components/ad/adSellerInfo";
import { AdData } from "../../components/ad/adData";

export function AdAdditionalInfo() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <AdData />
      <AdSellerInfo />
    </div>
  );
}
