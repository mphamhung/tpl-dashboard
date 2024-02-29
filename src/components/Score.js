import { tidy, sum } from "@tidyjs/tidy";
import Link from "next/link";

import { GameTable } from "@/lib/preprocess";

export default async function Score({ game, teamId }) {
  const teamEvents = await GameTable(game.id, teamId, game.date);

  const score = tidy(teamEvents, sum("goals"));

  return (
    <div align="center" justify="center" className="whitespace-nowrap">
      {score}
    </div>
  );
}
