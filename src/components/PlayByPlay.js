'use client'
import {Line, Bar, Scatter} from 'react-chartjs-2';
import {getGameEvents, getTeamInfo} from '@/lib/api-fetching'

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
  } from 'chart.js';

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
import React, { useEffect, useState } from 'react';

export default function PlayByPlay({game}) {
    const [homeTeamEvents, setHomeTeamEvents] = useState([]);
    const [awayTeamEvents, setAwayTeamEvents] = useState([]);
    const [homeTeamInfo, setHomeTeamInfo] = useState([]);
    const [awayTeamInfo, setAwayTeamInfo] = useState([]);

    useEffect(() => {
        const fetchGameEvents = async () => {
            const homeEvents = await getGameEvents(game.id, game.homeTeamId);
            const awayEvents = await getGameEvents(game.id, game.awayTeamId);
            const homeTeamInfo = await getTeamInfo(game.homeTeamId)
            const awayTeamInfo = await getTeamInfo(game.awayTeamId)
            setHomeTeamEvents(homeEvents);
            setAwayTeamEvents(awayEvents);
            setHomeTeamInfo(homeTeamInfo);
            setAwayTeamInfo(awayTeamInfo);
        };
        
        fetchGameEvents();
    }, [game.id, game.homeTeamId, game.awayTeamId]);

    const homeGoals = homeTeamEvents.filter(event => event.eventType == "Goal")
    const awayGoals = awayTeamEvents.filter(event => event.eventType == "Goal")

    const allGoals = homeGoals.concat(awayGoals)
    allGoals.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp))
    let goalsOverTime = []
    let score = 0
    let startTime = allGoals.length >0 ? new Date(allGoals[0].timestamp).getTime() : 0
    allGoals.forEach(event => {
        score += event.teamId == game.homeTeamId ? 1 : -1
        goalsOverTime.push({ts:new Date(event.timestamp), s:score})
    })
    const data = {
        labels: goalsOverTime.map(event => String(event.ts.getMinutes()) + ":" + String(event.ts.getSeconds())), // Extract date part only
        datasets: [{
          label: "",
          data: goalsOverTime.map(event => ({x: event.ts.getTime() - startTime, y: event.s})),
          backgroundColor: goalsOverTime.map(event => event.s > 0 ? "blue" : "red"),
          borderWidth: 2,
        }]
      };   

      const options = {
      }
      return (        
        <>
        <Bar data={data} options={options}/>

        </>
     )
    }