'use client'

import {getAllGameEvents} from '@/lib/api-fetching'
import preprocess from '@/lib/preprocess'
import StatTable from '@/components/StatTable'

import { tidy, mutate, groupBy,summarize, sum, first, nDistinct} from '@tidyjs/tidy'


export default async function Page() {
    const gameEvents = await getAllGameEvents();
    var [rows, _] = preprocess(gameEvents, (d) => true)
    rows = tidy(
      rows,
      groupBy('playerId' , [
        summarize({
          "Name": first("Name"),
          'Goal': sum("Goal"), 
          'Assist': sum("Assist"), 
          '2nd Assist': sum("2nd Assist'"), 
          'D': sum("D"), 
          'TA': sum("TA"), 
          'Drop': sum("Drop"), 
          '': sum(""), 
          'GP': nDistinct("gameId"),
        })
      ]),
      mutate({ "GC": d => d["Goal"] + d["Assist"] + d["2nd Assist"],
      "% pass": d => (1- (d["TA"] / ( d["TA"] +d[""] +d["Assist"] + d["2nd Assist"] ) )).toFixed(2) }),
    )

    const columns = [
      "Name",
      "Goal",
      'Assist',
      '2nd Assist',
      'D',
      'TA',
      'Drop',
      "",
      "% pass",
      "GP",
    ]
    
    return (
      <>
        <h1> Rankings </h1>
        <StatTable rows={rows} columns={columns}/>
      </>
    )
}