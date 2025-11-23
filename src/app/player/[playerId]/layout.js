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
    <div className="rounded-b-lg  bg-gray-600">
      <div className="sticky top-0 bg-gray-600">
        <PlayerPageTabs
          playerName={player.playerName}
          playerId={params.playerId}
          leagueIds={leagueIds}
        />
      </div>
      <div className="flex-1 rounded-b-lg bg-gray-600">
        <Suspense>{children}</Suspense>
      </div>
    </div>
  );
}
