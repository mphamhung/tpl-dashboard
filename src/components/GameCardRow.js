"use client";
import Link from "next/link";
import { getScore } from "@/lib/api";
import { useState, useEffect } from "react";

export function Score({ score, is_winner }) {
  const color_map = {
    win: "bg-lime-700",
    loss: "bg-red-500",
    tie: "bg-gray-400",
  };

  return (
    <div className={`rounded-l-lg text-center ${color_map[is_winner]}`}>
      {score}
    </div>
  );
}

export const GameCardRow = ({ game, name, teamId, score, is_winner }) => (
  <div className="grid grid-cols-6 row-span-1 col-span-4 rounded-lg bg-slate-900 p-2">
    <div className="col-span-4 leading-6 line-clamp-1">{name}</div>
    <div className="col-start-5 col-span-1">
      <Score score={score} is_winner={is_winner}></Score>
    </div>
    <Link
      href={`/game/${game.gameId}/${teamId}`}
      className="col-start-6 col-span-1 bg-slate-800 hover:bg-slate-700 rounded-r-lg flex justify-center"
    >
      {"->"}
    </Link>
  </div>
);
