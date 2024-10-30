"use client";
import {
  tidy,
  first,
  mutate,
  summarize,
  groupBy,
  sum,
  nDistinct,
} from "@tidyjs/tidy";
import { getPlayerEvents, getRowsFromEvents, PlayerLeagues } from "@/lib/api";
import { PieChart } from "@/components/PieChart";
import { useEffect, useState } from "react";
export default async function Page({ params }) {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(0);
  useEffect(() => {
    // wake api
    const queryApi = async () => {
      var leagueIds = await PlayerLeagues(params.playerId);
      const allRows = []; // Array to collect all rows

      for (const idx in leagueIds) {
        setLoading((Number(idx) + 1) / leagueIds.length);
        const playerEvents = await getPlayerEvents(
          params.playerId,
          leagueIds[idx]
        );
        var [rows, _] = await getRowsFromEvents(playerEvents);
        allRows.push(...rows);
      }
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
    </>
  );
}
