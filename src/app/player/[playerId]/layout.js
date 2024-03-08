import StatTable from "@/components/StatTable";
import { PlayerGameEvents, GetGameLeagueId } from "@/lib/preprocess";
import { ConstructionOutlined } from "@mui/icons-material";
import { tidy, first, distinct, leftJoin } from "@tidyjs/tidy";
import LeagueBadges from "@/components/LeagueBadges";
import Link from "next/link";

export default async function PlayerPageLayout({ children, params }) {
  var rows = await PlayerGameEvents(params.playerId);
  const game_league_mapping = await GetGameLeagueId(
    rows.map((row) => row.gameId)
  );
  const playerName = tidy(rows, first("name"));

  rows = tidy(rows, leftJoin(game_league_mapping, { by: "gameId" }));
  const leagueIds = tidy(rows, distinct("leagueId")).map((row) => row.leagueId);

  return (
    <>
      <h1 className="flex-grow m2 bg-grey" justify="center">
        <Link href={`/player/${params.playerId}`}>{playerName}</Link>
      </h1>
      <h1 className="flex-grow m2 bg-grey" justify="center">
        Past Games
      </h1>
      <LeagueBadges
        leagueIds={leagueIds}
        prefix={`player/${params.playerId}`}
        params={params}
      />
      <section>
        {/* Include shared UI here e.g. a header or sidebar */}
        {children}
      </section>
    </>
  );
}
