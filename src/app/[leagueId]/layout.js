import GamesList from "@/components/GamesList";
import GameListByDate from "@/components/GameListByDate";
import { Children, Suspense } from "react";
import { getGames, getGameEvents } from "@/lib/api";
import { DateSelect } from "@/components/DateSelect";
import { tidy, distinct, mutate } from "@tidyjs/tidy";
import Link from "next/link";

export default async function HomeLayout({ children, params }) {
  const games = await getGames(params.leagueId);
  const dates = tidy(games, distinct("date")).map((row) =>
    Date.parse(`${row.date} EST`)
  );
  dates.reverse();
  games.reverse();
  return (
    <div>
      <div className="flex justify-center ">
        <DateSelect dates={dates} />
        <Link href={"/rankings/" + params.leagueId}>View All Stats</Link>
      </div>
      {children}
    </div>
  );
}
