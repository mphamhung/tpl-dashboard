import { AllGameEvents, GetGameLeagueId } from "@/lib/preprocess";
import StatTable from "@/components/StatTable";

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

export default async function Page() {
  var rows = await AllGameEvents();
  const game_league_mapping = await GetGameLeagueId(
    rows.map((row) => row.gameId)
  );
  const joinedTable = tidy(
    rows,
    leftJoin(game_league_mapping, { by: "gameId" })
  );
  let summaryTable = tidy(
    joinedTable,
    groupBy(
      ["playerId", "leagueId"],
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
  let groupedByLeague = tidy(
    summaryTable,
    groupBy("leagueId", groupBy.object())
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
      {Object.entries(groupedByLeague)
        .reverse()
        .map(([leagueId, rows]) => {
          return (
            <>
              <h1 className="flex-grow m2 bg-grey" justify="center">
                {leagueId}
              </h1>
              <StatTable rows={rows.reverse()} columns={columns} />
            </>
          );
        })}{" "}
    </>
  );
}
