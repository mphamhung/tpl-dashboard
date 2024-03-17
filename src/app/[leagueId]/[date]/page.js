import { getGames, getGameEvents } from "@/lib/api";
import { GameListByDate } from "@/components/GameListByDate";
export default async function Page({ params }) {
  const games = await getGames(params.leagueId);
  const filteredGames = games.filter(
    (game) => new Date(game.date).getTime() == params.date
  );
  return (
    <div>
      <GameListByDate gamelist={filteredGames} />
    </div>
  );
}
