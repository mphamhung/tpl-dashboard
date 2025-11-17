import { loadSummaryStats } from "@/lib/api";
import StatsAcrossTime from "@/components/StatsAcrossTime";
import { CollapsableStatTable } from "@/components/CollapsableStatTable";
import {
  tidy,
  groupBy,
  summarize,
  sum,
  first,
  nDistinct,
  mutate,
  max,
  filter,
} from "@tidyjs/tidy";

export default async function Page({ params }) {
  const all = await loadSummaryStats();
  var rows = tidy(
    all,
    filter((d) => d.leagueId === params.leagueId)
  );
  rows = tidy(
    rows,
    groupBy(
      ["playerId"],
      [
        summarize({
          name: first("name"),
          goals: sum("goals"),
          assists: sum("assists"),
          second_assists: sum("second_assists"),
          blocks: sum("blocks"),
          throwaways: sum("throwaways"),
          drops: sum("drops"),
          other_passes: sum("other_passes"),
          games_played: nDistinct("gameId"),
          max_goals: max("goals"),
          max_assists: max("assists"),
          max_second_assists: max("second_assists"),
          max_blocks: max("blocks"),
          max_throwaways: max("throwaways"),
          max_drops: max("drops"),
        }),
      ]
    ),
    mutate({
      GC: (d) => d["goals"] + d["assists"] + d["second_assists"],
      "% pass": (d) =>
        (
          1 -
          d["throwaways"] /
            (d["throwaways"] +
              d["other_passes"] +
              d["assists"] +
              d["second_assists"])
        ).toFixed(2),
      "g pg": (d) => (d["goals"] / d["games_played"]).toFixed(2),
      "a pg": (d) => (d["assists"] / d["games_played"]).toFixed(2),
      "2a pg": (d) => (d["second_assists"] / d["games_played"]).toFixed(2),
      "b pg": (d) => (d["blocks"] / d["games_played"]).toFixed(2),
      "ta pg": (d) => (d["throwaways"] / d["games_played"]).toFixed(2),
      "dr pg": (d) => (d["drops"] / d["games_played"]).toFixed(2),
      "touches pg": (d) => (d["other_passes"] / d["games_played"]).toFixed(2),
    })
  );

  //   rows = tidy(rows, groupBy("playerId"));
  return (
    <>
      <CollapsableStatTable
        rows={rows}
        primary_columns={[
          "name",
          "g pg",
          "a pg",
          "2a pg",
          "b pg",
          "touches pg",
          "% pass",
          "games_played",
        ]}
        secondary_columns={[
          "name",
          "g pg",
          "a pg",
          "2a pg",
          "b pg",
          "ta pg",
          "dr pg",
          "touches pg",
          "games_played",
          "% pass",
          "% Goal Contributions",
          "% Touches",
          "throwaways",
          "drops",
          "max_goals",
          "max_assists",
          "max_second_assists",
          "max_blocks",
          "max_throwaways",
          "max_drops",
          "player page",
        ]}
        abbr={false}
      />
      <StatsAcrossTime rows={rows} />
    </>
  );
}
