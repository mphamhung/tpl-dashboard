"use client";
import { Line, Bar, Scatter } from "react-chartjs-2";
import { getGameEvents, getTeamInfo } from "@/lib/api-fetching";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import React, { useEffect, useState } from "react";
import Link from "next/link";

const endPos = ["Goal", "TA", "Drop", "D"];
const colorMap = {
  Goal: "green",
  TA: "orange",
  Drop: "red",
  D: "blue",
};

const footer = (tooltipItems) => {
  return tooltipItems[0].raw["playerName"];
};
export default function PlayByPlay({ game }) {
  const [homeTeamEvents, setHomeTeamEvents] = useState([]);
  const [awayTeamEvents, setAwayTeamEvents] = useState([]);
  const [homeTeamInfo, setHomeTeamInfo] = useState([]);
  const [awayTeamInfo, setAwayTeamInfo] = useState([]);

  useEffect(() => {
    const fetchGameEvents = async () => {
      const homeEvents = await getGameEvents(game.id, game.homeTeamId);
      const awayEvents = await getGameEvents(game.id, game.awayTeamId);
      const homeTeamInfo = await getTeamInfo(game.homeTeamId);
      const awayTeamInfo = await getTeamInfo(game.awayTeamId);
      setHomeTeamEvents(homeEvents);
      setAwayTeamEvents(awayEvents);
      setHomeTeamInfo(homeTeamInfo);
      setAwayTeamInfo(awayTeamInfo);
    };

    fetchGameEvents();
  }, [game.id, game.homeTeamId, game.awayTeamId]);

  const allEvents = homeTeamEvents.concat(awayTeamEvents);
  allEvents.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  var toData = [];
  var currPos = [];
  var maxPasses = 10;
  allEvents.forEach((event) => {
    currPos.push(event);
    if (endPos.includes(event.eventType)) {
      toData.push({
        passe: currPos.length,
        results: event.eventType,
        teamId: event.teamId,
        playerName: event.player.playerName,
        deltaT: new Date(event.timestamp) - new Date(currPos[0].timestamp),
        timestamp: (
          new Date(currPos[0].timestamp).getMinutes() +
          new Date(currPos[0].timestamp).getSeconds() / 60
        ).toFixed(3),
      });
      maxPasses = currPos.length > maxPasses ? currPos.length : maxPasses;
      currPos = [];
    }
  });

  const homeGoals = homeTeamEvents.filter((event) => event.eventType == "Goal");
  const awayGoals = awayTeamEvents.filter((event) => event.eventType == "Goal");

  const allGoals = homeGoals.concat(awayGoals);
  allGoals.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const data = {
    labels: toData.map((e) => e.timestamp),
    datasets: endPos.map((event) => {
      return {
        label: event,
        data: toData
          .filter((e) => e.results == event)
          .map((e) => {
            return {
              x: e.timestamp,
              y: e.teamId == game.homeTeamId ? e.passe : e.passe * -1,
              playerName: e.playerName,
            };
          }),
        backgroundColor: toData
          .filter((e) => e.results == event)
          .map((e) => {
            return colorMap[event];
          }),
        parsing: {
          xAxisKey: "y",
          yAxisKey: "x",
        },
        barThickness: 6,
        barPercentage: 0.5,
      };
    }),
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          footer: footer,
        },
      },
    },
    indexAxis: "y",
    scales: {
      xAxis: {
        ticks: {
          display: false,
        },
        min: -maxPasses,
        max: maxPasses,
      },
      yAxis: {
        display: false,
        ticks: {
          display: false,
        },
      },
    },
  };
  const w = 300;
  const h = 600;
  return (
    <>
      <div className="flex flex-col">
        <Bar height={h} width={w} data={data} options={options} />
      </div>
      {/* TODO MAKE IT A DOUBLE LINE GRAPH */}
    </>
  );
}
