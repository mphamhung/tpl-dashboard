import {getPlayerGameEvents} from '@/lib/api-fetching'
import StatTable from '@/components/StatTable'
import { ScatterContributions} from '@/components/Contributions'
import preprocess from '@/lib/preprocess'
import { tidy, first ,mutate} from '@tidyjs/tidy'


export default async function Page({params}) {
    const gameEvents = await getPlayerGameEvents(params.playerId);
    var [rows, graph] = preprocess(gameEvents, (d) => d.playerId == params.playerId)
    const playerName = tidy(rows,first("Name"))

    const columns = [
      "gameId",
      "Goal",
      'Assist',
      '2nd Assist',
      'D',
      'TA',
      'Drop',
      "",
      "% pass",
      "person",
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