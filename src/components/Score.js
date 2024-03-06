import { tidy, sum } from "@tidyjs/tidy";
import Link from "next/link";

import { GameTable } from "@/lib/preprocess";

export default async function Score({ game, teamId }) {
  const teamEvents = await GameTable(game.id, teamId, game.date);
  const otherTeamEvents = await GameTable(
    game.id,
    teamId == game.homeTeamId ? game.awayTeamId : game.homeTeamId,
    game.date
  );
  const score = tidy(teamEvents, sum("goals"));
  const otherScore = tidy(otherTeamEvents, sum("goals"));
  return (
    <div
      align="center"
      justify="center"
      className={
        score > otherScore
          ? "bg-lime-700 w-full h-full"
          : score == otherScore
            ? "bg-grey-700 w-full h-full"
            : "bg-red-900 w-full h-full"
      }
    >
      {score}
    </div>
  );
}
