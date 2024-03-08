import { AllGameEvents, GetGameLeagueId, GetLeagueIds } from "@/lib/preprocess";
import StatTable from "@/components/StatTable";
import Link from "next/link";
import LeagueBadges from "@/components/LeagueBadges";

import {
  tidy,
  mutate,
  groupBy,
  summarize,
  sum,
  first,
  nDistinct,
  leftJoin,
} from "@tidyjs/tidy";

export default async function Page({ params }) {
  var leagueIds = await GetLeagueIds();
  leagueIds = leagueIds
    .filter((row) => Number(row.leagueId) > 700)
    .map((row) => Number(row.leagueId));

  var rows = await AllGameEvents();
  const game_league_mapping = await GetGameLeagueId(
    rows.map((row) => row.gameId)
  );
  rows = tidy(rows, leftJoin(game_league_mapping, { by: "gameId" }));
  rows = rows.filter((row) => row.leagueId === Number(params.leagueId));
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

  const columns = [
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
  ];

  return (
    <>
      <h1> Rankings </h1>
      <StatTable rows={rows.reverse()} columns={columns} />
    </>
  );
}
