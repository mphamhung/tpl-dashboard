import {
  PlayerGameEvents,
  GetGameLeagueId,
  GamesMetadata,
} from "@/lib/preprocess";
import { tidy, distinct, leftJoin, first } from "@tidyjs/tidy";
import { PlayerPageTabs } from "@/components/PlayerPageTabs";
import { Suspense } from "react";
export default async function PlayerPageLayout({ children, params }) {
  var rows = await PlayerGameEvents(params.playerId);
  let a = await GamesMetadata();
  const game_league_mapping = await GetGameLeagueId(
    rows.map((row) => row.gameId)
  );
  const playerName = tidy(rows, first("name"));

  rows = tidy(rows, leftJoin(game_league_mapping, { by: "gameId" }));
  const leagueIds = tidy(rows, distinct("leagueId")).map((row) => row.leagueId);

  return (
    <>
      <PlayerPageTabs
        playerName={playerName}
        playerId={params.playerId}
        leagueIds={leagueIds}
      />
      <div className="rounded-b-lg  bg-gray-600 p-2 overflow-scroll max-h-screen">
        <Suspense fallback={"loading player page"}>{children}</Suspense>
      </div>
    </>
  );
}
