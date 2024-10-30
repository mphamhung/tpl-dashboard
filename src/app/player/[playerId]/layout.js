import { PlayerLeagues, getPlayer } from "@/lib/api";
import { tidy, distinct, leftJoin, first } from "@tidyjs/tidy";
import { PlayerPageTabs } from "@/components/PlayerPageTabs";
import { Suspense } from "react";
export default async function PlayerPageLayout({ children, params }) {
  var leagueIds = await PlayerLeagues(params.playerId);
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
        <Suspense fallback={"loading player page"}>{children}</Suspense>
      </div>
    </>
  );
}
