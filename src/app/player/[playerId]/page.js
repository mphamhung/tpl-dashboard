import {getPlayerGameEvents} from '@/lib/api-fetching'
import gamePlayerEventSequenceToSummaryDict from "@/lib/transforms/GamePlayerEventSequenceToSummaryDict"
import StatTable from '@/components/PlayerStatTable'

export default async function Page({params}) {
    const gameEvents = await getPlayerGameEvents(params.playerId);
    const summaryOfGamesWithPlayer = gamePlayerEventSequenceToSummaryDict(gameEvents)
    const playerStats = Object.keys(summaryOfGamesWithPlayer).map(gameId => {
      return summaryOfGamesWithPlayer[gameId][params.playerId]
    })
    return (
      <>
      <StatTable rows={playerStats}/>
      </>
    )
}