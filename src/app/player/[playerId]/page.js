import StatTable from "@/components/StatTable";
import { PlayerGameEvents, GetGameLeagueId } from "@/lib/preprocess";
import { tidy, first, groupBy, leftJoin } from "@tidyjs/tidy";

export default async function Page({ params }) {
  const rows = await PlayerGameEvents(params.playerId);
  const game_league_mapping = await GetGameLeagueId(
    rows.map((row) => row.gameId)
  );
  const playerName = tidy(rows, first("name"));

  const joinedTable = tidy(
    rows,
    leftJoin(game_league_mapping, { by: "gameId" })
  );
  const groupedByLeague = tidy(
    joinedTable,
    groupBy(["leagueId"], groupBy.object())
  );

  const columns = [
    "date",
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
      <h1 className="flex-grow m2 bg-grey" justify="center">
        {playerName}
      </h1>
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
        })}
    </>
  );
}
