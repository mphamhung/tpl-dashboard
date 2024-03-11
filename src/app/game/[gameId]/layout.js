import { GamePageTabs } from "@/components/GamePageTabs";
import { getGamesMetadata } from "@/lib/api-fetching";
export default async function GamePageTemplate({ children, params }) {
  const game_metadata = await getGamesMetadata();
  const [game, _] = game_metadata.filter(
    (game) => Number(game.id) === Number(params.gameId)
  );

  return (
    <>
      <GamePageTabs game={game} />
      <div className="rounded-b-lg  bg-gray-600 p-2">{children}</div>
    </>
  );
}
