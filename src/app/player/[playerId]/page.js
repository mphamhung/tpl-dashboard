"use client";
import {
  tidy,
  first,
  mutate,
  summarize,
  groupBy,
  sum,
  nDistinct,
  max,
} from "@tidyjs/tidy";
import { getPlayerRows } from "@/lib/api";
import { PieChart } from "@/components/PieChart";
import { useEffect, useState } from "react";
import { LinePlot, ScatterPlot } from "@/components/Contributions";

export default async function Page({ params }) {
  const [summaries, setSummaries] = useState([]);
  const [lifetimeStats, setLifeTimeStats] = useState([]);
  const [loading, setLoading] = useState(0);
  useEffect(() => {
    // wake api
    const queryApi = async () => {
      const allRows = await getPlayerRows(params.playerId);
      const summaries = tidy(
        allRows,
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
      setSummaries(summaries);

      const stats = tidy(
        allRows,
        groupBy(
          ["leagueId"],
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
          "touches pg": (d) =>
            (d["other_passes"] / d["games_played"]).toFixed(2),
        })
      );
      console.log(stats);
      setLifeTimeStats(stats);
      setLoading(1);
    };

    queryApi();
  }, []);

  if (loading !== 1) {
    return <>Fetching lifetime games {(loading * 100).toFixed(0)}%</>;
  }

  return (
    <>
      <div>
        <h1>Life time Stats</h1>{" "}
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
      <LinePlot rows={lifetimeStats} x_key={"leagueId"} y_key={"g pg"} />
      <LinePlot rows={lifetimeStats} x_key={"leagueId"} y_key={"a pg"} />
      <LinePlot rows={lifetimeStats} x_key={"leagueId"} y_key={"2a pg"} />
      <LinePlot rows={lifetimeStats} x_key={"leagueId"} y_key={"b pg"} />
      <LinePlot rows={lifetimeStats} x_key={"leagueId"} y_key={"ta pg"} />
      <LinePlot rows={lifetimeStats} x_key={"leagueId"} y_key={"dr pg"} />
      <LinePlot rows={lifetimeStats} x_key={"leagueId"} y_key={"touches pg"} />
    </>
  );
}
