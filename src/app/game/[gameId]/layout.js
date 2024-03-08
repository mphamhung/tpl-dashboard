import { getGamesMetadata } from "@/lib/api-fetching";
import TeamBadges from "@/components/TeamBadges";

export default async function PlayerPageLayout({ children, params }) {
  const game_metadata = await getGamesMetadata();
  const [game, _] = game_metadata.filter(
    (game) => Number(game.id) === Number(params.gameId)
  );
  return (
    <>
      <TeamBadges
        teamIds={[
          { teamId: game.homeTeamId, teamName: game.homeTeam },
          { teamId: game.awayTeamId, teamName: game.awayTeam },
        ]}
        prefix={`game/${game.id}`}
        params={params}
      />
      <section>
        {/* Include shared UI here e.g. a header or sidebar */}
        {children}
      </section>
    </>
  );
}
