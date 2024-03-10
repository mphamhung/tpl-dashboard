"use server";
import { gridColumnsTotalWidthSelector } from "@mui/x-data-grid";
import { GameTable } from "@/lib/preprocess";
import { tidy, sum } from "@tidyjs/tidy";

export async function ScoreCard({ gameId, homeTeamId, awayTeamId }) {
  const [homeTeamEvents, awayTeamEvents] = await Promise.all([
    GameTable(gameId, homeTeamId),
    GameTable(gameId, awayTeamId),
  ]);

  const homeScore = tidy(homeTeamEvents, sum("goals"));
  const awayScore = tidy(awayTeamEvents, sum("goals"));

  return (
    <div className="flex w-full h-full justify-between">
      <div
        className={
          homeScore > awayScore
            ? "basis-1/2 bg-lime-700 text-center rounded-l-md"
            : homeScore == awayScore
              ? "basis-1/2 bg-slate-700 text-center rounded-l-md"
              : "basis-1/2 bg-red-700 text-center rounded-l-md"
        }
      >
        {homeScore}
      </div>
      <div
        className={
          homeScore < awayScore
            ? "basis-1/2 bg-lime-700 text-center rounded-r-md"
            : homeScore == awayScore
              ? "basis-1/2 bg-slate-700 text-center rounded-r-md"
              : "basis-1/2 bg-red-700 text-center rounded-r-md"
        }
      >
        {awayScore}
      </div>
    </div>
  );
}
