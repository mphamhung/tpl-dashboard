import { Search } from "@/components/Search";
import { tidy, distinct } from "@tidyjs/tidy";
export default async function Page({ params }) {
  const res = await fetch("https://tplapp.onrender.com/players");
  var player_list = await res.json();
  player_list = tidy(player_list, distinct(["id"]));
  return (
    <div className="h-full w-full">
      <Search player_list={player_list} />
    </div>
  );
}
