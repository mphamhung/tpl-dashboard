"use client";
import Link from "next/link";
import { GameCardRow } from "./GameCardRow";
import { useState, useEffect } from "react";
import { getGameEvents } from "@/lib/api-fetching";

export function GameCard({ game }) {
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  useEffect(() => {
    // wake api
    const getScore = async (events) => {
      return events.filter((event) => event.eventType == "Goal").length;
    };

    const queryScores = async (game) => {
      const [homeTeamEvents, awayTeamEvents] = await Promise.all([
        getGameEvents(game.id, game.homeTeamId),
        getGameEvents(game.id, game.awayTeamId),
      ]);

      const [homeScore, awayScore] = await Promise.all([
        getScore(homeTeamEvents),
        getScore(awayTeamEvents),
      ]);
      setHomeScore(homeScore);
      setAwayScore(awayScore);
    };

    const queryApi = async () => {
      queryScores(game);
    };
    queryApi();
  }, []);

  return (
    <div className="grid grid-rows-4 grid-cols-4 h-auto rounded-lg gap-1 bg-slate-700 p-1">
      <div className="grid grid-cols-4 row-span-1 col-span-4">
        <div>
          {new Date(game.date).toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        <div>{game.gameTime}pm</div>
        <div>{game.location}</div>
      </div>
      <GameCardRow
        game={game}
        name={game.homeTeam}
        teamId={game.homeTeamId}
        score={homeScore}
        is_winner={
          homeScore > awayScore
            ? "win"
            : homeScore == awayScore
              ? "tie"
              : "loss"
        }
      />
      <GameCardRow
        game={game}
        name={game.awayTeam}
        teamId={game.awayTeamId}
        score={awayScore}
        is_winner={
          homeScore < awayScore
            ? "win"
            : homeScore == awayScore
              ? "tie"
              : "loss"
        }
      />
      <div></div>
      <Link
        href={`/game/${game.id}`}
        className="flex row-span-1 row-start-4 col-start-3 border-2 border-slate-600 col-span-2 rounded-lg p-1 justify-center leading-6 bg-slate-800 hover:bg-slate-700"
      >
        <div>View Game</div>
      </Link>
    </div>
  );
}
