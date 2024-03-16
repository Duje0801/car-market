import { SearchAds } from "../../components/home/searchAds";
import { Box1 } from "../../components/home/box1";
import { Box2 } from "../../components/home/box2";

export function Home() {
  return (
    <main>
      <div className="flex flex-col gap-8 lg:flex-row lg:justify-around lg:gap-0">
        <div className="flex lg:px-6 lg:flex-col lg:justify-between">
          <SearchAds />
        </div>
        <div className="flex flex-col gap-8 lg:max-h-[360px] lg:px-6 lg:justify-between lg:gap-2">
          <Box1 />
          <Box2 />
        </div>
      </div>
    </main>
  );
}
