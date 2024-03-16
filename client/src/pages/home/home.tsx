import { SearchAds } from "../../components/home/searchAds";
import { Box1 } from "../../components/home/box1";

export function Home() {
  return (
    <main className="flex flex-col gap-6">
      <SearchAds />
      <Box1 />
    </main>
  );
}
