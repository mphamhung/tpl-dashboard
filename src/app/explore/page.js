"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loadSummaryStats } from "@/lib/api";
import {
  tidy,
  summarize,
  sum,
  nDistinct,
  first,
  groupBy,
  mutate,
} from "@tidyjs/tidy";

const Page = () => {
  const router = useRouter();
  const [summaries, setSummaries] = useState([]);
  useEffect(() => {
    // wake api
    const queryApi = async () => {
      const res = await loadSummaryStats();
      const summaries = tidy(
        res,
        groupBy(
          ["leagueId", "playerId"],
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
      );
      setSummaries(summaries);
    };

    queryApi();
  }, []);

  // This component doesn't actually render anything
  return <>{summaries.map((d) => d.name)}</>;
};

export default Page;
