"use client";
import { useState, useEffect } from "react";
import { getGamesMetadata, getGameEvents } from "@/lib/api-fetching";
import { useRouter, usePathname } from "next/navigation";
import Tabs from "./Tabs"; // import the reusable Tabs component

export function GamePageTabs({ game, homeScore, awayScore }) {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("overview");
  console.log(game.id);
  const tabs = [
    {
      label: "Game Overview",
      value: "overview",
      href: game ? `/game/${game.gameId}` : null,
    },
    {
      label: (
        <div className="grid grid-cols-5">
          <div className="col-span-4">{game.homeTeam}</div>
          <div
            className={`py-2 text-center ${
              homeScore > awayScore
                ? "bg-score-winner"
                : homeScore === awayScore
                  ? ""
                  : "bg-score-loser"
            }`}
          >
            {homeScore}
          </div>
        </div>
      ),
      value: "home",
      href: game ? `/game/${game.gameId}/${game.homeTeamId}` : null,
    },
    {
      label: (
        <div className="grid grid-cols-5">
          <div className="col-span-4">{game.awayTeam}</div>
          <div
            className={`py-2 text-center ${
              awayScore > homeScore
                ? "bg-score-winner"
                : homeScore === awayScore
                  ? ""
                  : "bg-score-loser"
            }`}
          >
            {awayScore}
          </div>
        </div>
      ),
      value: "away",
      href: game ? `/game/${game.gameId}/${game.awayTeamId}` : null,
    },
  ];

  return (
    <Tabs
      tabs={tabs}
      defaultTab="overview"
      onChange={(val) => setSelectedTab(val)}
    />
  );
}
