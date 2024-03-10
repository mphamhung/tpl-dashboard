import { getGamesMetadata } from "@/lib/api-fetching";
import TeamBadges from "@/components/TeamBadges";
import { ScoreCard } from "@/components/ScoreCard";

export default async function GamePageTemplate({ children, params }) {
  const game_metadata = await getGamesMetadata();
  const [game, _] = game_metadata.filter(
    (game) => Number(game.id) === Number(params.gameId)
  );
  return (
    <>
      <div className="grid grid-cols-5"></div>
      <TeamBadges
        teamIds={[
          { teamId: game.homeTeamId, teamName: game.homeTeam },
          { teamId: game.awayTeamId, teamName: game.awayTeam },
        ]}
        prefix={`game/${params.gameId}`}
        params={params}
      />
      <div className="grid grid-cols-5">
        <div className="col-start-2 col-span-4">
          <ScoreCard
            gameId={params.gameId}
            homeTeamId={game.homeTeamId}
            awayTeamId={game.awayTeamId}
          />
        </div>
      </div>
      <section>
        {/* Include shared UI here e.g. a header or sidebar */}
        {children}
      </section>
    </>
  );
}
