'use client'
import { Bar , Scatter} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

  import React from 'react';
ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
PointElement,
Title,
Tooltip,
Legend
);


  
export function BarContributions({rows}) {
    const [hydrated, setHydrated] = React.useState(false);
    React.useEffect(() => {
        setHydrated(true);
    }, []);
    if (!hydrated) {
        // Returns null on first render, so the client and server match
        return null;
    }
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

  
export function ScatterContributions({rows}) {
    const [hydrated, setHydrated] = React.useState(false);
    React.useEffect(() => {
        setHydrated(true);
    }, []);
    if (!hydrated) {
        // Returns null on first render, so the client and server match
        return null;
    }
    
    rows.sort(function(a, b){return a["% T"]+a["% GC"] - b["% T"] - b["% GC"]}).reverse()
    const labels = rows.map(row => {
        return row['Name']
    })

    const options = {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };

    const data = {
        labels: labels,
        datasets: [
            {
            label: '% GC vs % Touches',
            data: rows.map(row => {
                return {x: row["% T"], y: row["% GC"]}
            }),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            pointRadius: 10,
            },
        ],
        };
    return(
        <Scatter data={data} options={options} />
    )
}