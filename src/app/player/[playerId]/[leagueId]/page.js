import StatTable from "@/components/StatTable";
import { PlayerGameEvents, GetGameLeagueId } from "@/lib/preprocess";
import { ConstructionOutlined } from "@mui/icons-material";
import { tidy, first, mutate, leftJoin, distinct } from "@tidyjs/tidy";
import LeagueBadges from "@/components/LeagueBadges";
import Link from "next/link";
import StatsAcrossTime from "@/components/StatsAcrossTime";
import { CollapsableStatTable } from "@/components/CollapsableStatTable";

export default async function Page({ params }) {
  var rows = await PlayerGameEvents(params.playerId);
  const game_league_mapping = await GetGameLeagueId(
    rows.map((row) => row.gameId)
  );
  rows = tidy(rows, leftJoin(game_league_mapping, { by: "gameId" }));
  rows = rows.filter((row) => row.leagueId == params.leagueId);
  rows = tidy(
    rows,
    mutate({
      team: (d) =>
        d["teamId"] == d["awayTeamId"] ? d["awayTeam"] : d["homeTeam"],
      date: (d) => new Date(d["date"]),
      game_time: (d) => Number(d["time"].split(":")[0]) - 12, //Convert to pm game
    })
  );
  rows.reverse();
  return (
    <>
      <CollapsableStatTable
        rows={rows}
        primary_columns={[
          "date",
          "goals",
          "assists",
          "second_assists",
          "blocks",
          "other_passes",
        ]}
        secondary_columns={[
          "team",
          "game_time",
          "throwaways",
          "drops",
          "game page",
        ]}
      />
      <StatsAcrossTime rows={rows} />
    </>
  );
}
