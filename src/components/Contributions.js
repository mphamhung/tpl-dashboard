import React, { useState, useEffect} from "react";
import { Bar } from 'react-chartjs-2';
import {getGameEvents} from '../lib/api-fetching'
import gameEventSequenceToSummaryDict from "../lib/transforms"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  
export default function Contributions({rows}) {
    rows.sort(function(a, b){return a["% T"]+a["% GC"] - b["% T"] - b["% GC"]}).reverse()
    const labels = rows.map(row => {
        return row['Name']
    })
    const data = {
        labels: labels,
        datasets: [
            {
            label: '% GC',
            data: rows.map(row => row["% GC"]),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
            label: '% Touches',
            data: rows.map(row => row["% T"]),
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
        };
    return(
        <Bar data={data} />
    )

    
}