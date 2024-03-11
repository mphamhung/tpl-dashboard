import { PlayerGameEvents, GetGameLeagueId } from "@/lib/preprocess";
import { tidy, distinct, leftJoin, first } from "@tidyjs/tidy";
import { PlayerPageTabs } from "@/components/PlayerPageTabs";
import { Suspense } from "react";
export default async function PlayerPageLayout({ children, params }) {
  var rows = await PlayerGameEvents(params.playerId);
  const game_league_mapping = await GetGameLeagueId(
    rows.map((row) => row.gameId)
  );
  const playerName = tidy(rows, first("name"));

  rows = tidy(rows, leftJoin(game_league_mapping, { by: "gameId" }));
  const leagueIds = tidy(rows, distinct("leagueId")).map((row) => row.leagueId);

  console.log(leagueIds);
  return (
    <>
      <PlayerPageTabs
        playerName={playerName}
        playerId={params.playerId}
        leagueIds={leagueIds}
      />
      {children}
    </>
  );
}
