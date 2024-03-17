import GamesList from "@/components/GamesList";
import GameListByDate from "@/components/GameListByDate";
import { Suspense } from "react";
import { getGames, getGameEvents } from "@/lib/api";

export default async function Home({ params }) {
  const games = await getGames(params.leagueId);

  games.reverse();
  return (
    <div>
      <GameListByDate gamelist={games} />
    </div>
  );
}
