import {getGameEvents} from '@/lib/api-fetching'
import gameEventSequenceToSummaryDict from "@/lib/transforms"

import StatTable from '@/components/StatTable'
import {BarContributions, ScatterContributions} from '@/components/Contributions'

export default async function Page({params}) {
    const events = await getGameEvents(params.gameId, params.teamId);
    const statSummaryDict = gameEventSequenceToSummaryDict(events)
    const rows = Object.keys(statSummaryDict).map(playerId => statSummaryDict[playerId])

    return (
      <>
        <StatTable rows={rows} />
        <BarContributions rows={rows} />
        <ScatterContributions rows={rows} />
      </>
    )
}