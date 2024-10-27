import { PlayerGameEvents, GetGameLeagueId } from "@/lib/api";
import {
  tidy,
  first,
  mutate,
  leftJoin,
  summarize,
  groupBy,
  sum,
  nDistinct,
} from "@tidyjs/tidy";

import { PieChart } from "@/components/PieChart";
export default async function Page({ params }) {
  let rows = await PlayerGameEvents(params.playerId);
  const game_league_mapping = await GetGameLeagueId(
    rows.map((row) => row.gameId)
  );
  rows = tidy(rows, leftJoin(game_league_mapping, { by: "gameId" }));
  rows = tidy(
    rows,
    mutate({
      team: (d) =>
        d["teamId"] == d["awayTeamId"] ? d["awayTeam"] : d["homeTeam"],
      date: (d) => new Date(d["date"]),
      game_time: (d) => Number(d["time"].split(":")[0]) - 12, // Convert to pm game
    })
  );

  const summaries = tidy(
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
      "game contributions": (d) =>
        d["goals"] + d["assists"] + d["second_assists"],
      "game negatives": (d) => d["throwaways"] + d["drops"],
    })
  )[0];
  rows.reverse();
  return (
    <>
      <div>
        <h1>Life time Stats (since like 2 years ago)</h1>
      </div>
      <div className="bg-slate-900 rounded-lg">
        <PieChart
          row={summaries}
          columns={["game contributions", "game negatives", "other_passes"]}
        ></PieChart>
      </div>
      <div>Games played: {summaries["games_played"]}</div>
      <div>Goals: {summaries["goals"]}</div>
      <div>Assists: {summaries["assists"]}</div>
      <div>Second Assists: {summaries["second_assists"]}</div>
      <div>Blocks: {summaries["blocks"]}</div>
      <div>Throwaways: {summaries["throwaways"]}</div>
      <div>Drops: {summaries["drops"]}</div>
      <div>Other passes: {summaries["other_passes"]}</div>
      <div>
        <a
          href={`https://www.tuc.org/zuluru/people/view?person=${params.playerId}`}
        >
          TUC profile
        </a>
      </div>
    </>
  );
}
