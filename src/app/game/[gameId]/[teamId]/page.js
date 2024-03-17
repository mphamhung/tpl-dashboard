import { GameTable, GetGameLeagueId } from "@/lib/preprocess";
import { getTeamInfo } from "@/lib/api-fetching";
import StatTable from "@/components/StatTable";
import { StackedBar, ScatterPlot } from "@/components/Contributions";
import { CollapsableStatTable } from "@/components/CollapsableStatTable";

import { tidy, mutate } from "@tidyjs/tidy";
export default async function Page({ params }) {
  // const events = await getGameEvents(params.gameId, params.teamId)
  const [[game_metadata, _], teamInfo] = await Promise.all([
    GetGameLeagueId([params.gameId]),
    getTeamInfo(params.teamId),
  ]);
  var rows = await GameTable(params.gameId, params.teamId, game_metadata.date);

  rows = tidy(
    rows,
    mutate({
      "player page": (d) => `/${d["playerId"]}/${game_metadata.leagueId}`,
    })
  );
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
    <div className="grid grid-flow-row gap-2">
      <CollapsableStatTable
        rows={rows}
        primary_columns={[
          "name",
          "goals",
          "assists",
          "second_assists",
          "blocks",
          "other_passes",
        ]}
        secondary_columns={[
          "% Goal Contributions",
          "% Touches",
          "throwaways",
          "drops",
          "player page",
        ]}
      />
      <StackedBar
        rows={rows}
        keys={["% Goal Contributions", "% Touches"]}
        sort_key="participation"
      />
      <ScatterPlot
        rows={rows}
        x_key={"% Goal Contributions"}
        y_key={"% Touches"}
      />
      <StackedBar
        rows={rows}
        keys={["throwaways", "other_passes"]}
        sort_key="other_passes"
      />
      <StackedBar rows={rows} keys={["blocks"]} sort_key="blocks" />
    </div>
  );
}
