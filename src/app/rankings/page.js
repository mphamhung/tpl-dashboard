import {AllGameEvents, GetGameLeagueId} from '@/lib/preprocess'
import StatTable from '@/components/StatTable'

import { tidy, mutate, groupBy,summarize, sum, first, nDistinct, leftJoin} from '@tidyjs/tidy'

export default async function Page() {
    var rows = await AllGameEvents();
    const game_league_mapping = await GetGameLeagueId(rows.map(row => row.gameId))
    const joinedTable = tidy(
      rows,
      leftJoin(game_league_mapping, { by: "gameId" })
    );
    let summaryTable = tidy(
      joinedTable,
      groupBy(['playerId', 'leagueId'] , [
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
    let groupedByLeague = tidy(
      summaryTable,
      groupBy('leagueId',
      groupBy.object())
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
        {Object.entries(groupedByLeague).reverse().map( ([leagueId, rows])=> {
      return (
        <>
      <h1 className='flex-grow m2 bg-grey' justify="center">
        {leagueId}
      </h1>
      <StatTable rows={rows.reverse()} columns={columns}/>
      </>
      )})}      </>
    )
}