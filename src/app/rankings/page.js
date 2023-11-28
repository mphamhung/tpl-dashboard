
import {getAllGameEvents} from '@/lib/api-fetching'
import gameEventSequenceToSummaryDict from "@/lib/transforms/GameEventSequenceToSummaryDict"
import StatTable from '@/components/StatTable'

export default async function Page() {
    const gameEvents = await getAllGameEvents();
    const playerStats = gameEventSequenceToSummaryDict(gameEvents)
    const rows = Object.keys(playerStats).map(playerId => playerStats[playerId])
    return (
      <>
        <StatTable rows={rows}/>
      </>
    )
}