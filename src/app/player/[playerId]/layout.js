import { getPlayerRows, getPlayer } from "@/lib/api";
import { PlayerPageTabs } from "@/components/PlayerPageTabs";
import { Suspense } from "react";
import { tidy, distinct } from "@tidyjs/tidy";
export default async function PlayerPageLayout({ children, params }) {
  const allRows = await getPlayerRows(params.playerId);
  const leagueIds = tidy(allRows, distinct("leagueId")).map(
    (d) => d["leagueId"]
  );

  leagueIds.sort((a, b) => b - a);
  const player = await getPlayer(params.playerId);

  return (
    <>
      <PlayerPageTabs
        playerName={player.playerName}
        playerId={params.playerId}
        leagueIds={leagueIds}
      />
      <div className="rounded-b-lg  bg-gray-600 p-2 overflow-scroll max-h-screen">
        <Suspense>{children}</Suspense>
      </div>
    </>
  );
}
