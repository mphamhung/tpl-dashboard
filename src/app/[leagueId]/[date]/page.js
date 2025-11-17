import { getGames, getGameEvents } from "@/lib/api";
import { GameListByDate } from "@/components/GameListByDate";

export default async function Page({ params }) {
  const game_info = await getGames(params.leagueId);

  const filteredGames = game_info.filter(
    (game) => Date.parse(`${game.date} EST`) == params.date
  );

  return (
    <div>
      <GameListByDate gamelist={filteredGames} />
    </div>
  );
}
