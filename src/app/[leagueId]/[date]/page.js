import { getGames, getGameEvents } from "@/lib/api";
import { GameListByDate } from "@/components/GameListByDate";
export default async function Page({ params }) {
  const games = await getGames(params.leagueId);
  console.log();
  const filteredGames = games.filter(
    (game) => Date.parse(`${game.date} EST`) == params.date
  );
  return (
    <div>
      <GameListByDate gamelist={filteredGames} />
    </div>
  );
}
