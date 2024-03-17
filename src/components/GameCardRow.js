"use client";
import Link from "next/link";
import { getScore } from "@/lib/api";
import { useState, useEffect } from "react";

export function Score({ game, teamId }) {
  const [score, setScore] = useState(0);
  const [winnner, setWinner] = useState("tie");
  useEffect(() => {
    const resolveScore = async () => {
      const [homeScore, awayScore] = await Promise.all([
        getScore(
          game.id,
          teamId == game.homeTeamId ? game.homeTeamId : game.awayTeamId
        ),
        getScore(
          game.id,
          teamId == game.homeTeamId ? game.awayTeamId : game.homeTeamId
        ),
      ]);

      if (homeScore > awayScore) {
        setWinner("home");
      } else if (homeScore < awayScore) {
        setWinner("away");
      } else {
        setWinner("tie");
      }
      setScore(homeScore);
    };

    resolveScore();
  }, [game, teamId]);

  const color_map = {
    home: "bg-lime-700",
    away: "bg-red-500",
    tie: "bg-gray-400",
  };

  return <div className={color_map[winnner]}>{score}</div>;
}

export const GameCardRow = ({ game, name, teamId }) => (
  <div className="grid grid-cols-6 row-span-1 col-span-4 rounded-lg bg-slate-900 p-2">
    <div className="col-span-4 leading-6 line-clamp-1">{name}</div>
    <div className="col-start-5 col-span-1">
      <Score game={game} teamId={teamId}></Score>
    </div>
    <Link
      href={`/game/${game.id}/${teamId}`}
      className="col-start-6 col-span-1 bg-slate-800 hover:bg-slate-700 rounded-r-lg flex justify-center"
    >
      {"->"}
    </Link>
  </div>
);
