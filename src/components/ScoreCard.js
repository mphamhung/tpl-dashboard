import { gridColumnsTotalWidthSelector } from "@mui/x-data-grid";
import { GameTable } from "@/lib/preprocess";
import { tidy, sum } from "@tidyjs/tidy";

export async function ScoreCard({ gameId, homeTeamId, awayTeamId }) {
  const homeTeamEvents = await GameTable(gameId, homeTeamId);
  const awayTeamEvents = await GameTable(gameId, awayTeamId);

  const homeScore = tidy(homeTeamEvents, sum("goals"));
  const awayScore = tidy(awayTeamEvents, sum("goals"));

  return (
    <div className="flex w-full h-full justify-between">
      <div
        className={
          homeScore > awayScore
            ? "basis-1/2 bg-gradient-to-r from-lime-700 to-transparent text-center"
            : homeScore == awayScore
              ? "basis-1/2 bg-gradient-to-r from-slate-700 to-transparent text-center"
              : "basis-1/2 bg-gradient-to-r from-red-700 to-transparent text-center"
        }
      >
        {homeScore}
      </div>
      <div
        className={
          homeScore < awayScore
            ? "basis-1/2 bg-gradient-to-l from-lime-700 to-transparent text-center"
            : homeScore == awayScore
              ? "basis-1/2 bg-gradient-to-l from-slate-700 to-transparent text-center"
              : "basis-1/2 bg-gradient-to-l from-red-700 to-transparent text-center"
        }
      >
        {awayScore}
      </div>
    </div>
  );
}
