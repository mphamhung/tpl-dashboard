import { GameTable, GetGameLeagueId } from "@/lib/preprocess";
import { getTeamInfo } from "@/lib/api-fetching";
import StatTable from "@/components/StatTable";
import { StackedBar, ScatterPlot } from "@/components/Contributions";
import { Suspense } from "react";

export default async function Page({ params }) {
  // const events = await getGameEvents(params.gameId, params.teamId)
  const [game_metadata, _] = await GetGameLeagueId([params.gameId]);
  const rows = await GameTable(
    params.gameId,
    params.teamId,
    game_metadata.date
  );
  const teamInfo = await getTeamInfo(params.teamId);
  // const [rows, _] = preprocess(events, (d) => true)
  const columns = [
    "name",
    "goals",
    "assists",
    "second_assists",
    "blocks",
    "throwaways",
    "drops",
    "other_passes",
    "% pass",
  ];
  return (
    <Suspense>
      {/* <h1>{teamInfo.teamName}</h1> */}
      <StatTable rows={rows} columns={columns} />
      <StackedBar rows={rows} keys={["% GC", "% T"]} sort_key="% total" />
      <ScatterPlot rows={rows} x_key={"% GC"} y_key={"% T"} />
      <StackedBar
        rows={rows}
        keys={["throwaways", "other_passes"]}
        sort_key="other_passes"
      />
      <StackedBar rows={rows} keys={["blocks"]} sort_key="blocks" />
    </Suspense>
  );
}
