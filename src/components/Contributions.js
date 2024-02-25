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

  
export function ScatterPlot({rows, x_key, y_key}) {
    const [hydrated, setHydrated] = React.useState(false);
    React.useEffect(() => {
        setHydrated(true);
    }, []);
    if (!hydrated) {
        // Returns null on first render, so the client and server match
        return null;
    }
    
    const labels = rows.map(row => {
        return row['name']
    })

    const options = {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        showTooltips: true,
        tooltipEvents: [],
      };

    const data = {
        labels: labels,
        datasets: [
            {
            label: `${x_key} vs ${y_key}`,
            data: rows.map(row => {
                return {x: row[x_key], y: row[y_key]}
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


const colors = {
    "name": 'rgba(255, 99, 132, 0.5)',
    "goals": 'rgba(255, 99, 132, 0.5)',
    "assists": 'rgba(255, 99, 132, 0.5)',
    "second_assists": 'rgba(255, 99, 132, 0.5)',
    "blocks": 'rgba(255, 99, 132, 0.5)',
    "throwaways": 'rgba(255, 99, 132, 0.5)',
    "drops": 'rgba(255, 99, 132, 0.5)',
    "other_passes": 'rgba(255, 255, 132, 0.5)',
    "% GC": 'rgba(255, 99, 132, 0.5)',
    "% T": 'rgba(255, 255, 132, 0.5)',
}
export function StackedBar({rows, keys, sort_key}) {
    const [hydrated, setHydrated] = React.useState(false);
    React.useEffect(() => {
        setHydrated(true);
    }, []);
    if (!hydrated) {
        // Returns null on first render, so the client and server match
        return null;
    }

    rows.sort(function(a, b){return (a[sort_key]) - (b[sort_key])}).reverse()
    
    const labels = rows.map(row => {
        return row['name']
    })
    const data = {
        labels: labels,
        datasets: keys.map(key => {
            return             {
                label: key,
                data: rows.map(row => row[key]),
                backgroundColor: colors[key],
                }
        }
        )
        };

    const options = {
        scales: {
            y: {
                stacked: true
            },
            x: {
                stacked: true
            }
        }
    }
    console.log(data)
    return(
        <Bar data={data} options={options}/>
    )

}