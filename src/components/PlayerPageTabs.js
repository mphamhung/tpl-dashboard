"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Typography from "@mui/material/Typography";
import Tabs from "./Tabs";

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
      <Tabs
        defaultTab="overview"
        tabs={[
          {
            label: "Player Overview",
            value: "overview",
            href: `/player/${playerId}`,
          },
          {
            label: `Current League Stats ${currLeague == "overview" ? "" : currLeague}`,
            value: currLeague == "overview" ? "" : currLeague,
            dropdown: leagueIds.map((leagueId) => ({
              label: leagueId,
              value: leagueId,
              href: `/player/${playerId}/${leagueId}`,
            })),
          },
        ]}
        onChange={(val) => setCurrLeague(val)}
      />
    </>
  );
}
