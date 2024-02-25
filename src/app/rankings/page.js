import {AllGameEvents} from '@/lib/preprocess'
import StatTable from '@/components/StatTable'

import { tidy, mutate, groupBy,summarize, sum, first, nDistinct} from '@tidyjs/tidy'

export default async function Page() {
    var rows = await AllGameEvents();
    rows = tidy(
      rows,
      groupBy('playerId' , [
        summarize({
          "name":  first("name"),
          "goals":  sum("goals"), 
          "assists":  sum("assists"), 
          "second_assists":  sum("second_assists"), 
          "blocks":  sum("blocks"), 
          "throwaways":  sum("throwaways"), 
          "drops":  sum("drops"), 
          "other_passes": sum("other_passes"), 
          'games_played': nDistinct("gameId"),
        })
      ]),
      mutate({ "GC": d => d["Goal"] + d["Assist"] + d["2nd Assist"],
      "% pass": d => (1- (d["TA"] / ( d["TA"] +d[""] +d["Assist"] + d["2nd Assist"] ) )).toFixed(2) }),
    )


    const columns = [
      "name",
      "goals",
      "assists",
      "second_assists",
      "blocks",
      "throwaways",
      "drops",
      "other_passes",
      "games_played"
    ]
    
    return (
      <>
        <h1> Rankings </h1>
        <StatTable rows={rows} columns={columns}/>
      </>
    )
}