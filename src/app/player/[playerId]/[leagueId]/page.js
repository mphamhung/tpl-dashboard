// import { getPlayerEvents, getRowsFromEvents } from "@/lib/api";
import StatsAcrossTime from "@/components/StatsAcrossTime";
import { CollapsableStatTable } from "@/components/CollapsableStatTable";
import { getPlayerRows } from "@/lib/api";
import { tidy, filter, mutate } from "@tidyjs/tidy";

export default async function Page({ params }) {
  const data = await getPlayerRows(params.playerId);
  const rows = tidy(
    data,
    filter((d) => d.leagueId === params.leagueId),
    mutate({
      date: (d) => new Date(Date.parse(`${d.date} EST`)),
    })
  );
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
