"use client";

import { useState, useEffect } from "react";
import { getGamesMetadata, getGameEvents } from "@/lib/api-fetching";
import { useRouter, usePathname } from "next/navigation";

export default function GamePageTemplate({ children, params }) {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [game, setGame] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

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
      const game_metadata = await getGamesMetadata();
      const [game, _] = game_metadata.filter(
        (game) => Number(game.id) === Number(params.gameId)
      );
      setGame(game);
      queryScores(game);

      if (pathname.split("/").pop() == game.homeTeamId) {
        setSelectedTab("home");
      }
      if (pathname.split("/").pop() == game.awayTeamId) {
        setSelectedTab("away");
      }
    };
    queryApi();
  }, []);

  return (
    <>
      <div className="grid grid-cols-5 gap-1">
        <div
          className={
            selectedTab == "overview"
              ? "h-12 line-clamp-2 col-span-1 rounded-t-lg bg-gray-700 px-2"
              : "h-12 line-clamp-2 col-span-1  rounded-t-lg bg-gray-700 px-2  border-b-black border-b-2"
          }
          onClick={() => {
            setSelectedTab("overview");
            if (game) {
              router.push(`/game/${game.id}`);
            }
          }}
        >
          Game Overview
        </div>
        <div
          className={
            selectedTab == "home"
              ? "h-12 line-clamp-2 col-span-2  rounded-t-lg bg-gray-700 px-2 grid grid-cols-5"
              : "h-12 line-clamp-2 col-span-2  rounded-t-lg bg-gray-700 px-2 grid grid-cols-5  border-b-black border-b-2"
          }
          onClick={() => {
            setSelectedTab("home");
            if (game) {
              router.push(`/game/${game.id}/${game.homeTeamId}`);
            }
          }}
        >
          <div className="col-span-4">{game && game.homeTeam}</div>
          <div
            className={`py-2 col-span-1 text-center ${homeScore > awayScore ? "bg-lime-700" : homeScore == awayScore ? "" : "bg-red-900"}`}
          >
            {game && homeScore}
          </div>
        </div>
        <div
          className={
            selectedTab == "away"
              ? "h-12 line-clamp-2 col-span-2 rounded-t-lg bg-gray-700 px-2 grid grid-cols-5"
              : "h-12 line-clamp-2 col-span-2  rounded-t-lg bg-gray-700 px-2 grid grid-cols-5  border-b-black border-b-2"
          }
          onClick={() => {
            setSelectedTab("away");
            if (game) {
              router.push(`/game/${game.id}/${game.awayTeamId}`);
            }
          }}
        >
          <div className="col-span-4">{game && game.awayTeam}</div>
          <div
            className={`py-2 col-span-1 text-center ${homeScore < awayScore ? "bg-lime-700" : homeScore == awayScore ? "" : "bg-red-900"}`}
          >
            {game && awayScore}
          </div>
        </div>
      </div>
      <div className="rounded-b-lg  bg-gray-700 p-2">{children}</div>
    </>
  );
}
