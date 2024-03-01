import {
  tidy,
  sum,
  groupBy,
  summarize,
  first,
  nDistinct,
  mutate,
} from "@tidyjs/tidy";
import Link from "next/link";

import { getTeamInfo } from "@/lib/api-fetching";
import { AllGameEvents } from "@/lib/preprocess";
import StatTable from "./StatTable";
export default async function Forecast({ game }) {
  const homeTeamInfo = await getTeamInfo(game.homeTeamId);
  const homeTeamIds = homeTeamInfo.players.map((player) => Number(player.id));
  const awayTeamInfo = await getTeamInfo(game.awayTeamId);
  const awayTeamIds = awayTeamInfo.players.map((player) => Number(player.id));

  const rows = await AllGameEvents();

  var homeTeamRows = rows.filter((row) => homeTeamIds.includes(row.playerId));
  var awayTeamRows = rows.filter((row) => awayTeamIds.includes(row.playerId));
  homeTeamRows = tidy(
    homeTeamRows,
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

  awayTeamRows = tidy(
    awayTeamRows,
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

  let homeTeamTotal = tidy(
    homeTeamRows,
    summarize({
      "g pg": sum("g pg"),
      "a pg": sum("a pg"),
      "2a pg": sum("2a pg"),
      "b pg": sum("b pg"),
      "ta pg": sum("ta pg"),
      "dr pg": sum("dr pg"),
      "touches pg": sum("touches pg"),
    }),
    mutate({
      name: "total",
      "g pg": (d) => d["g pg"].toFixed(2),
      "a pg": (d) => d["a pg"].toFixed(2),
      "2a pg": (d) => d["2a pg"].toFixed(2),
      "b pg": (d) => d["b pg"].toFixed(2),
      "ta pg": (d) => d["ta pg"].toFixed(2),
      "dr pg": (d) => d["dr pg"].toFixed(2),
      "touches pg": (d) => d["touches pg"].toFixed(2),
    })
  );
  let awayTeamTotal = tidy(
    awayTeamRows,
    summarize({
      "g pg": sum("g pg"),
      "a pg": sum("a pg"),
      "2a pg": sum("2a pg"),
      "b pg": sum("b pg"),
      "ta pg": sum("ta pg"),
      "dr pg": sum("dr pg"),
      "touches pg": sum("touches pg"),
    }),
    mutate({
      name: "total",
      "g pg": (d) => d["g pg"].toFixed(2),
      "a pg": (d) => d["a pg"].toFixed(2),
      "2a pg": (d) => d["2a pg"].toFixed(2),
      "b pg": (d) => d["b pg"].toFixed(2),
      "ta pg": (d) => d["ta pg"].toFixed(2),
      "dr pg": (d) => d["dr pg"].toFixed(2),
      "touches pg": (d) => d["touches pg"].toFixed(2),
    })
  );
  let columns = ["g pg"];
  return (
    <>
      <h1>
        {" "}
        Estimated Final Score (based of current roster and lifetime stats):{" "}
      </h1>
      <main className="">
        <h2>{homeTeamInfo.teamName}</h2>
        <p>{homeTeamTotal[0]["g pg"]}</p>
        <h2>{awayTeamInfo.teamName}</h2>
        <p>{awayTeamTotal[0]["g pg"]}</p>
      </main>
    </>
  );
}
