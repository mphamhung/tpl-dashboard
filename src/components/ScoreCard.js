import { gridColumnsTotalWidthSelector } from "@mui/x-data-grid";
import { GameTable } from "@/lib/preprocess";
import { tidy, sum } from "@tidyjs/tidy";

export async function ScoreCard({ game }) {
  const homeTeamEvents = await GameTable(game.id, game.homeTeamId, game.date);
  const awayTeamEvents = await GameTable(game.id, game.awayTeamId, game.date);

  const homeScore = tidy(homeTeamEvents, sum("goals"));
  const awayScore = tidy(awayTeamEvents, sum("goals"));

  return (
    <div className="flex w-full h-full justify-between">
      <div
        className={
          homeScore > awayScore
            ? "basis-1/2 bg-gradient-to-r from-lime-700 to-transparent"
            : homeScore == awayScore
              ? "basis-1/2 bg-gradient-to-r from-slate-700 to-transparent"
              : "basis-1/2 bg-gradient-to-r from-red-700 to-transparent"
        }
      >
        {game.homeTeam}
      </div>
      <div
        className={
          homeScore < awayScore
            ? "basis-1/2 bg-gradient-to-l from-lime-700 to-transparent"
            : homeScore == awayScore
              ? "basis-1/2 bg-gradient-to-l from-slate-700 to-transparent"
              : "basis-1/2 bg-gradient-to-l from-red-700 to-transparent"
        }
      >
        {game.awayTeam}
      </div>
    </div>
  );
}
