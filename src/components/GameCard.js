"use client";
import Link from "next/link";
import { getScore } from "@/lib/api";
import { useState, useEffect } from "react";

export function GameCard({ game }) {
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  useEffect(() => {
    const resolveScore = async () => {
      const [homeScore, awayScore] = await Promise.all([
        getScore(game.id, game.homeTeamId),
        getScore(game.id, game.awayTeamId),
      ]);

      setHomeScore(homeScore);
      setAwayScore(awayScore);
    };

    resolveScore();
  }, [game]);

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
        win={
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
        win={
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
export function Score({ score, win }) {
  console.log(score, win);
  const color_map = {
    win: "bg-lime-700",
    loss: "bg-red-500",
    tie: "bg-gray-400",
  };

  return <div className={color_map[win]}>{score}</div>;
}
export function GameCardRow({ game, name, teamId, score, win }) {
  return (
    <div className="grid grid-cols-6 row-span-1 col-span-4 rounded-lg bg-slate-900 p-2">
      <div className="col-span-4 leading-6 line-clamp-1">{name}</div>
      <div className="col-start-5 col-span-1">
        <Score score={score} win={win}></Score>
      </div>
      <Link
        href={`/game/${game.id}/${teamId}`}
        className="col-start-6 col-span-1 bg-slate-800 hover:bg-slate-700 rounded-r-lg flex justify-center"
      >
        {"->"}
      </Link>
    </div>
  );
}
