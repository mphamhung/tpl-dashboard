
'use client'

import { BarChart, XAxis, YAxis, Bar, Tooltip, Legend, ResponsiveContainer} from "recharts";
async function getGameEvents(gameId, teamId) {
    const res = await fetch('https://tplapp.onrender.com/gameEvents/'+gameId+"/"+teamId)
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
   
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }

const columns = {
    "Name": "Name",
    'Goal': "Goal",
    'Assist': "Assist",
    '2nd Assist': "2nd Assist",
    'D':"Blocks",
    'TA':"TA",
    'Drop':"Drop",
    '':"Pass"
}

function getStatBoard({gameEvents}) {
    var stat_board = {}
    for (const event of gameEvents) {
        if (!(event.player.id in stat_board)){
            stat_board[event.player.id] = {
                "Name": event.player.playerName,
                'Goal':0,
                'Assist':0,
                '2nd Assist':0,
                'D':0,
                'TA':0,
                'Drop':0,
                '':0,
                'gc':0
            }
        }
        stat_board[event.player.id][event.eventType] += 1
        stat_board[event.player.id]['gc'] += (["Goal", "Assist", "2nd Assist" ].includes(event.eventType))
        
    }



    return stat_board
}

function Table({ gameEvents } ) {
    const stat_board = getStatBoard({gameEvents})
    return (
            <table className="w-1/2 bg-gray-700 rounded">
            <tr className="flex-grow">
            {Object.keys(columns).map(k => 
            <th>{columns[k]}</th>
            )
            }
            </tr>
            {Object.keys(stat_board).map(playerId => 
            <tr className="flex-grow" key={playerId}>
            {             Object.keys(columns).map(k =>
            <td className="flex-grow"> {stat_board[playerId][k]}</td>
            )}
            </tr>

            )}
            </table>
    )
}

function PossessionsPlot({gameEvents}) {
    const stat_board = getStatBoard({gameEvents})
    const sum_touches= Object.keys(stat_board).reduce( function (prev, key) {
        return Number(prev) + Number(stat_board[key][""])
    }, 0)
    const sum_gc= Object.keys(stat_board).reduce( function (prev, key) {
        return Number(prev) + Number(stat_board[key]["gc"] )
    }, 0)
    const data = Object.keys(stat_board).map(playerId => {
        return ({
            "Name": stat_board[playerId]["Name"],
            "% GC": stat_board[playerId]["gc"] / sum_gc,
            "% Touches": stat_board[playerId][""] / sum_touches,
        }
        )
    })

    return(
        <div className="w-[600px] h-[300px] bg-gray-700 rounded">
        <ResponsiveContainer>
            <BarChart width={600} height={300} data={data}>
                <Bar dataKey="% GC" fill="green" stackId='a'/>
                <Bar dataKey="% Touches" fill="blue" stackId='a' />
                <XAxis dataKey="Name" angle="90"/>
                <Legend/>
                <YAxis />
            </BarChart>
        </ResponsiveContainer>
        </div>
    )
}
  
export default async function Page({ params } ) {
    var gameEvents = await getGameEvents(params.gameId,params.teamId)
    return (
      <>
      <div className="flex">
      <main className="flex-grow ml-64 relative">
        <h1></h1>
        <Table gameEvents={gameEvents}/>
        <PossessionsPlot gameEvents={gameEvents}/>
      </main>
      </div>
      </>
    )
    }