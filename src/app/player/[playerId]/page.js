import {getPlayerGameEvents} from '@/lib/api-fetching'
import StatTable from '@/components/StatTable'
import { ScatterContributions} from '@/components/Contributions'
import preprocess from '@/lib/preprocess'


export default async function Page({params}) {
    const gameEvents = await getPlayerGameEvents(params.playerId);
    var rows = preprocess(gameEvents, (d) => d.playerId == params.playerId)

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
    ]
    return (
      <>
      <h1>
      </h1>
      <StatTable rows={rows} columns={columns}/>
      <ScatterContributions rows={rows}/>
      </>
    )
}