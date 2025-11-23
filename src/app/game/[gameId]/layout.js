import { GamePageTabs } from "@/components/GamePageTabs";
import { getGames } from "@/lib/api";
export default async function GamePageTemplate({ children, params }) {
  const games = await getGames();
  const game = games.find((d) => d.gameId === params.gameId);
  return (
    <div className="flex flex-col">
      <div className="bg-gray-600 p-5">
        <GamePageTabs
          game={game}
          homeScore={game.homeTeamScore}
          awayScore={game.awayTeamScore}
        />
      </div>
      <div className="rounded-b-lg  bg-gray-600 p-2">{children}</div>
    </div>
  );
}
