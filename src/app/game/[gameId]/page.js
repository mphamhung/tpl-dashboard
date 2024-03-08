import { getGamesMetadata } from "@/lib/api-fetching";
import { Suspense } from "react";
import ScoreCard from "@/components/ScoreCard";
import Forecast from "@/components/Forecast";
import PlayByPlay from "@/components/PlayByPlay";

export default async function Page({ params }) {
  const game_metadata = await getGamesMetadata();
  const [game, _] = game_metadata.filter(
    (game) => Number(game.id) === Number(params.gameId)
  );

  return (
    <>
      <PlayByPlay game={game} />
    </>
  );
  // return (
  //   <Suspense>
  //     {/* <ScoreCard game={game} /> */}
  //     <Forecast game={game} />
  //     <PlayByPlay game={game} />
  //   </Suspense>
  // );
}
