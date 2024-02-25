import StatTable from '@/components/StatTable'
import { ScatterContributions} from '@/components/Contributions'
import {PlayerGameEvents} from '@/lib/preprocess'
import { tidy, first ,mutate} from '@tidyjs/tidy'


export default async function Page({params}) {
    const rows = await PlayerGameEvents(params.playerId);
    const playerName = tidy(rows,first("name"))

    console.log(rows)
    const columns = [
      "gameId",
      "goals",
      "assists",
      "second_assists",
      "blocks",
      "throwaways",
      "drops",
      "other_passes",
      "% pass",
    ]
    return (
      <>
      <h1 className='flex-grow m2 bg-grey' justify="center">
        {playerName}
      </h1>
      <StatTable rows={rows} columns={columns}/>
      <ScatterContributions rows={rows}/>
      </>
    )
}