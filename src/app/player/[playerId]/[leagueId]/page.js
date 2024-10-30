"use client";
import { getPlayerEvents, getRowsFromEvents } from "@/lib/api";
import StatsAcrossTime from "@/components/StatsAcrossTime";
import { CollapsableStatTable } from "@/components/CollapsableStatTable";
import { useEffect, useState } from "react";

export default async function Page({ params }) {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    // wake api
    const queryApi = async () => {
      const playerEvents = await getPlayerEvents(
        params.playerId,
        params.leagueId
      );
      var [rows, _] = await getRowsFromEvents(playerEvents);
      setRows(rows);
    };

    queryApi();
  }, []);

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
