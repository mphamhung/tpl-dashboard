import { getGames, getGameEvents } from "@/lib/api";
import { GameListByDate } from "@/components/GameListByDate";
export default async function Page({ params }) {
  const games = await getGames(params.leagueId);
  const filteredGames = games.filter(
    (game) =>
      new Date(new Date(game.date).toUTCString()).getTime() == params.date
  );
  return (
    <div>
      <GameListByDate gamelist={filteredGames} />
    </div>
  );
}
