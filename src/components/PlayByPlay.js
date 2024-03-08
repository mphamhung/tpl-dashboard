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

const endPos = ["Goal", "TA", "Drop", "D"];

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
  allEvents.forEach((event) => {
    currPos.push(event);
    if (endPos.includes(event.eventType)) {
      toData.push({
        passe: currPos.length,
        results: event.eventType,
        teamId: event.teamId,
        deltaT: new Date(event.timestamp) - new Date(currPos[0].timestamp),
        timestamp: currPos[0].timestamp,
      });
      currPos = [];
    }
  });

  console.log(toData);
  const homeGoals = homeTeamEvents.filter((event) => event.eventType == "Goal");
  const awayGoals = awayTeamEvents.filter((event) => event.eventType == "Goal");

  const allGoals = homeGoals.concat(awayGoals);
  allGoals.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const data = {
    labels: toData.map((e) => e.timestamp),
    datasets: [
      {
        label: "home",
        data: toData
          .filter((e) => e.teamId == game.homeTeamId)
          .map((e) => {
            return { x: e.timestamp, y: e.passe };
          }),
        backgroundColor: toData
          .filter((e) => e.teamId == game.homeTeamId)
          .map((e) => {
            if (e.results == "Goal") {
              return "green";
            } else if (e.results == "TA" || e.results == "Drop") {
              return "orange";
            } else if (e.results == "D") {
              return "blue";
            } else {
              return "grey";
            }
          }),
      },
      {
        label: "away",
        data: toData
          .filter((e) => e.teamId == game.awayTeamId)
          .map((e) => {
            return { x: e.timestamp, y: e.passe * -1 };
          }),
        backgroundColor: toData
          .filter((e) => e.teamId == game.awayTeamId)
          .map((e) => {
            if (e.results == "Goal") {
              return "green";
            } else if (e.results == "TA" || e.results == "Drop") {
              return "orange";
            } else if (e.results == "D") {
              return "blue";
            } else {
              return "grey";
            }
          }),
      },
    ],
  };
  // let goalsOverTime = [];
  // let score = 0;
  // let startTime =
  //   allGoals.length > 0 ? new Date(allGoals[0].timestamp).getTime() : 0;
  // allGoals.forEach((event) => {
  //   score += event.teamId == game.homeTeamId ? 1 : -1;
  //   goalsOverTime.push({ ts: new Date(event.timestamp), s: score });
  // });
  // const data = {
  //   labels: goalsOverTime.map(
  //     (event) =>
  //       String(event.ts.getMinutes()) + ":" + String(event.ts.getSeconds())
  //   ), // Extract date part only
  //   datasets: [
  //     {
  //       label: "",
  //       data: goalsOverTime.map((event) => ({
  //         x: event.ts.getTime() - startTime,
  //         y: event.s,
  //       })),
  //       backgroundColor: goalsOverTime.map((event) =>
  //         event.s > 0 ? "blue" : "red"
  //       ),
  //       borderWidth: 2,
  //     },
  //   ],
  // };

  const options = {};
  return (
    <>
      <Bar data={data} options={options} />
      {/* TODO MAKE IT A DOUBLE LINE GRAPH */}
    </>
  );
}
