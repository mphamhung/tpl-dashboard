"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Typography from "@mui/material/Typography";

export function PlayerPageTabs({ playerName, playerId, leagueIds }) {
  const latestLeagueId = Math.max(...leagueIds);
  const pathname = usePathname();

  const [_, __, ___, leagueId] = pathname.split("/");

  const [selectedTab, setSelectedTab] = useState(
    leagueId ? leagueId : "overview"
  );
  const [open, setOpen] = useState(false);
  const [currLeague, setCurrLeague] = useState(
    leagueId ? leagueId : latestLeagueId
  );
  const router = useRouter();

  return (
    <>
      <Typography variant="h4">{playerName}</Typography>
      <div className="grid grid-cols-3 gap-1">
        <div
          className={`h-12 line-clamp-2 col-span-1 rounded-t-lg  px-2 ${selectedTab == "overview" ? "bg-gray-600" : "bg-gray-700"}`}
          onClick={() => {
            setSelectedTab("overview");
            router.push(`/player/${playerId}`);
          }}
        >
          Player Overview
        </div>
        <div
          className={`relative inline-block line-clamp-2 col-span-2 rounded-t-lg px-2  ${selectedTab == currLeague ? "bg-gray-600" : "bg-gray-700"}`}
          onClick={() => setOpen(!open)}
        >
          Current League Stats ({currLeague})
          {open && (
            <div className="bg-gray-600 flex flex-col z-100 top-0">
              {leagueIds.map((leagueId, idx) => (
                <div
                  className="p-2 bg-slate-600 text-left"
                  onClick={() => {
                    setCurrLeague(leagueId);
                    setSelectedTab(leagueId);
                    router.push(`/player/${playerId}/${leagueId}`);
                  }}
                  key={idx} // Adding key prop for list items
                >
                  {leagueId}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
