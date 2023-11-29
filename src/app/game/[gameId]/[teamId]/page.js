import {getGameEvents} from '@/lib/api-fetching'
import gameEventSequenceToSummaryDict from "@/lib/transforms/GameEventSequenceToSummaryDict"

import StatTable from '@/components/StatTable'
import {BarContributions, ScatterContributions} from '@/components/Contributions'
import { Suspense } from 'react';


export default async function Page({params}) {
    const events = await getGameEvents(params.gameId, params.teamId);
    const statSummaryDict = gameEventSequenceToSummaryDict(events)
    const rows = Object.keys(statSummaryDict).map(playerId => statSummaryDict[playerId])
    const columns = [
      "Name",
      "Goal",
      'Assist',
      '2nd Assist',
      'D',
      'TA',
      'Drop',
      "",
    ]

    return (
      <Suspense>
        <StatTable rows={rows} columns={columns} />
        <BarContributions rows={rows} />
        <ScatterContributions rows={rows} />
      </Suspense>
    )
}