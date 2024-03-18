import { getGamesMetadata } from "@/lib/api-fetching";
import PlayByPlay from "@/components/PlayByPlay";

export default async function Page({ params }) {
  const game_metadata = await getGamesMetadata();
  const [game, _] = game_metadata.filter(
    (game) => Number(game.id) === Number(params.gameId)
  );

  return (
    <div className="h-full w-full">
      <PlayByPlay game={game} />
    </div>
  );
}
