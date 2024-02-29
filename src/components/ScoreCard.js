import { tidy, sum } from "@tidyjs/tidy";
import Link from "next/link";

import { GameTable } from "@/lib/preprocess";

export default async function ScoreCard({ game }) {
  const homeTeamEvents = await GameTable(game.id, game.homeTeamId, game.date);
  const awayTeamEvents = await GameTable(game.id, game.awayTeamId, game.date);

  const homeScore = tidy(homeTeamEvents, sum("goals"));
  const awayScore = tidy(awayTeamEvents, sum("goals"));

  return (
    <Link
      href={{ pathname: `/game/${game.id}` }}
      align="center"
      justify="center"
      className="bg-gray-700 rounded grid hover:bg-gray-500"
    >
      <div align="center" justify="center" className="whitespace-nowrap">
        {homeScore} : {awayScore}
      </div>
    </Link>
  );
}
