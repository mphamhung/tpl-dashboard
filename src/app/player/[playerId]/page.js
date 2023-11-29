import {getPlayerGameEvents} from '@/lib/api-fetching'
import gamePlayerEventSequenceToSummaryDict from "@/lib/transforms/GamePlayerEventSequenceToSummaryDict"
import StatTable from '@/components/StatTable'
import { ScatterContributions} from '@/components/Contributions'


export default async function Page({params}) {
    const gameEvents = await getPlayerGameEvents(params.playerId);
    const summaryOfGamesWithPlayer = gamePlayerEventSequenceToSummaryDict(gameEvents)
    const playerStats = Object.keys(summaryOfGamesWithPlayer).map(gameId => {
      var temp_dict= summaryOfGamesWithPlayer[gameId][params.playerId]
      temp_dict["Name"] = gameId
      return temp_dict
    })
    
    const columns = [
      "Game Id",
      "Goal",
      'Assist',
      '2nd Assist',
      'D',
      'TA',
      'Drop',
      "",
    ]
    return (
      <>
      <StatTable rows={playerStats} columns={columns}/>
      <ScatterContributions rows={playerStats}/>
      </>
    )
}