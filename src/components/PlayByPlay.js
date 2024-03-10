"use client";
import { Line, Bar, Scatter } from "react-chartjs-2";
import { getGameEvents, getTeamInfo } from "@/lib/api-fetching";
import Chart from "chart.js/auto";
import "chartjs-adapter-moment";
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
      const [homeEvents, awayEvents, homeTeamInfo, awayTeamInfo] =
        await Promise.all([
          getGameEvents(game.id, game.homeTeamId),
          getGameEvents(game.id, game.awayTeamId),
          getTeamInfo(game.homeTeamId),
          getTeamInfo(game.awayTeamId),
        ]);

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
  var toDataGoals = [];
  var sumGoals = 0;

  allEvents.forEach((event) => {
    currPos.push(event);
    if (endPos.includes(event.eventType)) {
      toData.push({
        passe: currPos.length,
        results: event.eventType,
        teamId: event.teamId,
        playerName: event.player.playerName,
        deltaT: new Date(event.timestamp) - new Date(currPos[0].timestamp),
        timestamp:
          event.eventType == "D"
            ? toData[toData.length - 1].timestamp
            : new Date(currPos[0].timestamp),
      });

      maxPasses = currPos.length > maxPasses ? currPos.length : maxPasses;
      if (event.eventType == "Goal") {
        sumGoals += event.teamId == game.homeTeamId ? -1 : 1;
        toDataGoals.push({
          x: new Date(currPos[0].timestamp),
          y: sumGoals,
        });
      }
      currPos = [];
    }
  });

  const homeGoals = homeTeamEvents.filter((event) => event.eventType == "Goal");
  const awayGoals = awayTeamEvents.filter((event) => event.eventType == "Goal");

  const allGoals = homeGoals.concat(awayGoals);
  allGoals.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  toData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const data = {
    labels: toData.map((e) => e.timestamp),
    datasets: endPos
      .map((event) => {
        return {
          label: event,
          data: toData
            .filter((e) => e.results == event)
            .map((e) => {
              return {
                x: e.timestamp,
                y: e.teamId == game.homeTeamId ? e.passe * -1 : e.passe,
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
      })
      .concat({
        label: "Score Differential",
        data: toDataGoals,
        backgroundColor: "rgba(255,100,1,0.5)",
        radius: 0.1,
        type: "line",
        fill: {
          below: "rgba(255,100,1,0.5)",
          target: { value: 0 },
        },
        parsing: {
          xAxisKey: "y",
          yAxisKey: "x",
        },
      }),
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          footer: footer,
        },
      },
      filler: {
        propagate: false,
      },
      "samples-filler-analyser": {
        target: "chart-analyser",
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
        stacked: true,
      },
      yAxis: {
        display: false,
        ticks: {
          display: false,
        },
        stacked: true,
        type: "time",
      },
    },
  };
  const w = 300;
  const h = 800;
  return (
    <div className="flex flex-col">
      <Bar height={h} width={w} data={data} options={options} />
    </div>
  );
}
