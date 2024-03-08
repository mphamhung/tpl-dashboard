import StatTable from "@/components/StatTable";
import { PlayerGameEvents, GetGameLeagueId } from "@/lib/preprocess";
import { ConstructionOutlined } from "@mui/icons-material";
import { tidy, first, mutate, leftJoin, distinct } from "@tidyjs/tidy";
import LeagueBadges from "@/components/LeagueBadges";
import Link from "next/link";

export default async function Page({ params }) {
  var rows = await PlayerGameEvents(params.playerId);
  const game_league_mapping = await GetGameLeagueId(
    rows.map((row) => row.gameId)
  );
  const playerName = tidy(rows, first("name"));

  rows = tidy(rows, leftJoin(game_league_mapping, { by: "gameId" }));
  const leagueIds = tidy(rows, distinct("leagueId")).map((row) => row.leagueId);
  rows = rows.filter((row) => row.leagueId == params.leagueId);
  rows = tidy(
    rows,
    mutate({
      team: (d) =>
        d["teamId"] == d["awayTeamId"] ? d["awayTeam"] : d["homeTeam"],
      date: (d) => new Date(d["date"]),
    })
  );

  const columns = [
    "date",
    "team",
    "goals",
    "assists",
    "second_assists",
    "blocks",
    "throwaways",
    "drops",
    "other_passes",
    "% pass",
  ];
  return (
    <>
      <StatTable rows={rows.reverse()} columns={columns} />
    </>
  );
}
