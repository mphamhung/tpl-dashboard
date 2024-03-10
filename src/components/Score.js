import { tidy, sum } from "@tidyjs/tidy";
import { GameTable } from "@/lib/preprocess";

export default async function Score({ game, teamId }) {
  const [teamEvents, otherTeamEvents] = await Promise.all([
    GameTable(game.id, teamId, game.date),
    GameTable(
      game.id,
      teamId == game.homeTeamId ? game.awayTeamId : game.homeTeamId,
      game.date
    ),
  ]);
  const score = tidy(teamEvents, sum("goals"));
  const otherScore = tidy(otherTeamEvents, sum("goals"));
  return (
    <div
      align="center"
      justify="center"
      className={
        score > otherScore
          ? "bg-lime-700 w-full h-full rounded-l-lg"
          : score == otherScore
            ? "bg-grey-700 w-full h-full rounded-l-lg"
            : "bg-red-900 w-full h-full rounded-l-lg"
      }
    >
      {score}
    </div>
  );
}
