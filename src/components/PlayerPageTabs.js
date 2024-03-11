"use client";
import { useState, useEffect } from "react";
import { getGamesMetadata, getGameEvents } from "@/lib/api-fetching";
import { useRouter, usePathname } from "next/navigation";
import Typography from "@mui/material/Typography";

export function PlayerPageTabs({ playerName, playerId, leagueIds }) {
  const latestLeagueId = Math.max(...leagueIds);
  // useEffect(() => {}, []);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [open, setOpen] = useState(false);
  const [currLeague, setCurrLeague] = useState(latestLeagueId);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <Typography variant="h4">{playerName}</Typography>
      <div className="grid grid-cols-3 gap-1">
        <div
          className={
            selectedTab == "overview"
              ? "h-12 line-clamp-2 col-span-1 rounded-t-lg bg-gray-700 px-2"
              : "h-12 line-clamp-2 col-span-1  rounded-t-lg bg-gray-700 px-2  border-b-black border-b-2"
          }
          onClick={() => {
            setSelectedTab("overview");
            router.push(`/player/${playerId}`);
          }}
        >
          Player Overview
        </div>
        <div
          className={`relative inline-block line-clamp-2 col-span-2 rounded-t-lg bg-gray-700 px-2  ${selectedTab == currLeague ? "" : "border-b-black border-b-2"}`}
          onClick={() => setOpen(!open)}
        >
          Current League Stats ({currLeague})
          <div className="flex flex-col">
            {open &&
              leagueIds.map((leagueId, idx) => {
                return (
                  <div
                    className="h-12"
                    onClick={() => {
                      setCurrLeague(leagueId);
                      setSelectedTab(leagueId);
                      router.push(`/player/${playerId}/${leagueId}`);
                    }}
                  >
                    {leagueId}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
